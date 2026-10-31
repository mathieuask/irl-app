import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C } from '../theme';
import { Appear, Avatar, BigTimer, Btn, Glass, MapBg, Me, mmss, useCountdown } from '../ui';
import { play } from '../sound';

export function Manhunt({ nav, p }: { nav: Nav; p: any }) {
  return p.role === 'fuyard' ? <Fuyard nav={nav} p={p} /> : <Chasseur nav={nav} p={p} />;
}

function Fuyard({ nav, p }: { nav: Nav; p: any }) {
  const t = useCountdown(14 * 60 + 32);
  const rev = useCountdown(48);
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.06, duration: 500, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
    ])).start();
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <MapBg zone={300}>
        <View style={m.center}><Me /></View>
        <View style={[m.pin, { top: '30%', left: '18%' }]}><Avatar src={AV.lea} size={44} ring={C.rouge} /></View>
        <View style={[m.pin, { top: '62%', left: '70%' }]}><Avatar src={AV.sam} size={44} ring={C.rouge} /></View>
      </MapBg>
      <View style={m.top}>
        <Glass style={{ alignItems: 'center', paddingVertical: 10 }}>
          <Text style={m.lbl}>Tiens encore</Text>
          <BigTimer s={t} />
        </Glass>
        <Animated.View style={[m.alert, { transform: [{ scale: pulse }] }]}>
          <Ionicons name="eye" size={20} color="#fff" />
          <Text style={m.alertT}>Révélé dans {mmss(rev)}</Text>
        </Animated.View>
      </View>
      <View style={m.bottom}>
        <Btn label="J'ai été trouvé" kind="rouge" icon="hand-left" onPress={() => { play('impact'); nav.replace('fin', { ...p, issue: 'trouve', temps: 14 * 60 + 32 - t }); }} />
      </View>
    </View>
  );
}

function Chasseur({ nav, p }: { nav: Nav; p: any }) {
  const t = useCountdown(12 * 60 + 5);
  const [sel, setSel] = useState(false);
  const [d, setD] = useState(64);
  useEffect(() => {
    if (!sel) return;
    const id = setInterval(() => setD((x) => Math.max(8, x - 7)), 600);
    return () => clearInterval(id);
  }, [sel]);
  const proche = d <= 20;
  return (
    <View style={{ flex: 1 }}>
      <MapBg zone={300}>
        <View style={m.center}><Me /></View>
        <Pressable onPress={() => { play('pop'); setSel(true); }} style={[m.pin, { top: '36%', left: '58%', alignItems: 'center' }]}>
          <Avatar src={AV.hugo} size={sel ? 70 : 58} ring={sel ? C.rouge : C.blanc} />
          <View style={m.bubble}><Text style={m.bubbleT}>Hugo · il y a 2 min</Text></View>
        </Pressable>
        <View style={[m.pin, { top: '64%', left: '22%' }]}><Avatar src={AV.lea} size={40} ring={C.bleu} /></View>
      </MapBg>
      <View style={m.top}>
        <Glass style={{ alignItems: 'center', paddingVertical: 10 }}>
          <Text style={m.lbl}>Reste</Text>
          <BigTimer s={t} color={C.rouge} />
        </Glass>
      </View>
      <View style={m.bottom}>
        {sel ? (
          <Appear>
            <Glass style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Avatar src={AV.hugo} size={52} ring={C.rouge} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={m.who}>Hugo</Text>
                <Text style={[m.dist, proche && { color: C.rouge }]}>à {d} m</Text>
              </View>
              <Ionicons name="navigate" size={28} color={C.bleu} />
            </Glass>
            <Btn label={proche ? 'Capturer' : 'Rapproche-toi (20 m)'} kind={proche ? 'rouge' : 'blanc'} icon="flash"
              onPress={() => { if (proche) { play('impact'); nav.replace('fin', { ...p, issue: 'capture', temps: 12 * 60 + 5 - t }); } else setD(18); }} />
          </Appear>
        ) : (
          <Glass><Text style={m.hint}>Touche Hugo sur la carte pour le traquer</Text></Glass>
        )}
      </View>
    </View>
  );
}

const m = StyleSheet.create({
  center: { ...StyleSheet.absoluteFill as any, alignItems: 'center', justifyContent: 'center' },
  pin: { position: 'absolute' },
  top: { position: 'absolute', top: 58, left: 20, right: 20, gap: 10 },
  lbl: { fontSize: 15, fontWeight: '800', color: '#6B7280', marginBottom: -6 },
  alert: { flexDirection: 'row', gap: 8, alignSelf: 'center', backgroundColor: C.rouge, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center' },
  alertT: { color: '#fff', fontWeight: '900', fontSize: 17 },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 40 },
  bubble: { backgroundColor: '#fff', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 5, marginTop: 4 },
  bubbleT: { fontWeight: '800', fontSize: 12, color: C.texte },
  who: { fontSize: 20, fontWeight: '900', color: C.texte },
  dist: { fontSize: 28, fontWeight: '900', color: C.bleu },
  hint: { textAlign: 'center', fontWeight: '800', fontSize: 16, color: C.texte },
});
