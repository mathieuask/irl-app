import React, { useRef, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Nav } from '../nav';
import { AV, C } from '../theme';
import { Btn, useCountdown } from '../ui';
import { Chrono, H, MapClean, Marker, PhotoPin, Pill, Ring, ScaleBar, Seg, W, mmss } from '../jeuui';
import { play } from '../sound';

export function Manhunt({ nav, p }: { nav: Nav; p: any }) {
  return p.role === 'fuyard' ? <Fuyard nav={nav} p={p} /> : <Chasseur nav={nav} p={p} />;
}

function Fuyard({ nav, p }: { nav: Nav; p: any }) {
  const t0 = useRef(Date.now()).current;
  const t = useCountdown(14 * 60 + 32);
  const rev = useCountdown(48);
  const me = { x: W / 2, y: H * 0.5 };
  const lea = { x: 92, y: H * 0.31 };
  const sam = { x: W - 92, y: H * 0.67 };
  const trouve = () => { play('impact'); nav.replace('fin', { ...p, issue: 'trouve', temps: Math.floor((Date.now() - t0) / 1000) }); };
  return (
    <View style={{ flex: 1 }}>
      <MapClean />
      <Ring cx={me.x} cy={me.y} d={W - 24} />
      <Seg a={lea} b={me} color="rgba(252,29,51,0.25)" w={26} />
      <Seg a={sam} b={me} color="rgba(252,29,51,0.25)" w={26} />
      <Marker x={me.x} y={me.y} color={C.bleu} />
      <PhotoPin x={lea.x} y={lea.y} src={AV.lea} ring={C.rouge} dot={C.rouge} size={72} line2="Léa · il y a 1 min" />
      <PhotoPin x={sam.x} y={sam.y} src={AV.sam} ring={C.rouge} dot={C.rouge} size={72} line2="Sam · il y a 40 s" />
      <View style={m.top}>
        <Chrono s={t} color={C.bleu} />
        <Pill style={{ marginTop: 10, flexDirection: 'row', paddingHorizontal: 22, paddingVertical: 10 }}>
          <Text style={m.rev}>Révélé dans </Text><Text style={[m.rev, { color: C.bleu }]}>{mmss(rev)}</Text>
        </Pill>
      </View>
      <View style={m.bottom}>
        <Pill style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingVertical: 12, paddingHorizontal: 14, alignSelf: 'stretch' }}>
          <View style={{ flexDirection: 'row', marginRight: 8 }}>
            {[AV.lea, AV.sam].map((a, i) => <Image key={i} source={a} style={[m.mini, i > 0 && { marginLeft: -14 }]} />)}
          </View>
          <Text style={m.big}>2</Text><Text style={m.chas}> chasseurs</Text>
        </Pill>
        <Btn label="J'ai été trouvé" kind="blanc" onPress={trouve} style={{ marginTop: 14, alignSelf: 'center', paddingHorizontal: 34 }} />
      </View>
    </View>
  );
}

// Échelle de la carte : 12 px par mètre. Toute distance affichée se déduit des positions à l'écran.
const PX_PER_M = 12;
const metres = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.round(Math.hypot(a.x - b.x, a.y - b.y) / PX_PER_M);

function Chasseur({ nav, p }: { nav: Nav; p: any }) {
  const t0 = useRef(Date.now()).current;
  const t = useCountdown(7 * 60 + 42);
  const [sel, setSel] = useState(false);
  const me = { x: W / 2, y: H * 0.5 };
  const hugo = { x: me.x - 100, y: me.y - 110 };
  const lea = { x: me.x + 95, y: me.y - 195 };
  const d = metres(me, hugo);
  const capturer = () => { play('impact'); nav.replace('fin', { ...p, issue: 'capture', temps: Math.floor((Date.now() - t0) / 1000) }); };
  return (
    <View style={{ flex: 1 }}>
      <MapClean />
      <Ring cx={me.x} cy={me.y + 20} d={W + 40} />
      {sel ? <Seg a={me} b={hugo} color="rgba(252,29,51,0.3)" w={34} /> : null}
      <Marker x={me.x} y={me.y} color={C.rouge} />
      <PhotoPin x={lea.x} y={lea.y} src={AV.lea} ring={C.bleu} size={54} line2="il y a 30 s" line1="Léa" />
      <PhotoPin x={hugo.x} y={hugo.y} src={AV.hugo} ring={C.rouge} dot={C.rouge} size={sel ? 96 : 84} line1="Hugo" line2="il y a 2 min"
        onPress={() => { play('pop'); setSel(true); }} />
      <ScaleBar px={PX_PER_M * 10} label="10 m" />
      <View style={m.top}><Chrono s={t} /></View>
      <View style={m.bottom}>
        {sel ? (
          <View style={m.card}>
            <Text style={m.who}>Hugo</Text>
            <Text style={m.dist}>à {d} m</Text>
            <Btn label="Capturer" kind="rouge" onPress={capturer} style={{ alignSelf: 'stretch', marginTop: 8, height: 62 }} />
          </View>
        ) : (
          <Pill style={{ paddingVertical: 16, paddingHorizontal: 20 }}><Text style={m.hint}>Touche Hugo sur la carte</Text></Pill>
        )}
      </View>
    </View>
  );
}

const m = StyleSheet.create({
  top: { position: 'absolute', top: 54, left: 0, right: 0, alignItems: 'center' },
  rev: { fontSize: 22, fontWeight: '900', color: C.texte },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 36 },
  mini: { width: 52, height: 52, borderRadius: 26, borderWidth: 3, borderColor: '#fff' },
  big: { fontSize: 36, fontWeight: '900', color: C.bleu },
  chas: { fontSize: 19, fontWeight: '900', color: C.texte },
  card: { backgroundColor: 'rgba(246,250,255,0.94)', borderRadius: 44, borderWidth: 2, borderColor: '#fff', padding: 14, paddingTop: 18, alignItems: 'center',
    shadowColor: C.azur, shadowOpacity: 0.7, shadowRadius: 18, shadowOffset: { width: 0, height: 4 } },
  who: { fontSize: 34, fontWeight: '900', color: C.texte, lineHeight: 38 },
  dist: { fontSize: 30, fontWeight: '900', color: C.bleu, lineHeight: 34 },
  hint: { fontWeight: '900', fontSize: 18, color: C.texte },
});
