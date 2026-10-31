import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C, IMG } from '../theme';
import { Appear, Avatar, Back, Fond, MoiPin, Pill, Verre, st } from '../ui';
import { MapClean } from './create';

export function Home({ nav }: { nav: Nav; p: any }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#dfeaf5' }}>
      <MapClean />
      <View style={h.center}><MoiPin size={70} halo={150} /></View>
      <Ami id="lea" nom="Léa" d="300 m" style={{ left: 36, top: 170 }} />
      <Ami id="hugo" nom="Hugo" d="450 m" style={{ right: 38, top: 332 }} />
      <Ami id="sam" nom="Sam" d="700 m" style={{ left: 40, top: 500 }} />
      <View style={h.top}>
        <Image source={IMG.logo} style={h.logo} />
        <Pressable onPress={() => nav.go('profil')}>
          <Avatar src={AV.moi} size={58} />
          <View style={h.dot} />
        </Pressable>
      </View>
      <Verre radius={38} style={h.sheet}>
        <View style={h.grab} />
        <Appear><Pill label="Lancer une partie" h={68} onPress={() => nav.go('choix')} /></Appear>
        <Appear delay={120} style={{ marginTop: 12 }}><Pill label="Rejoindre avec un code" kind="verre" h={62} onPress={() => nav.go('rejoindre')} /></Appear>
      </Verre>
    </View>
  );
}

function Ami({ id, nom, d, style }: { id: keyof typeof AV; nom: string; d: string; style: any }) {
  return (
    <View style={[{ position: 'absolute', alignItems: 'center' }, style]}>
      <View>
        <Avatar src={AV[id]} size={66} />
        <View style={h.dot} />
      </View>
      <Verre radius={16} style={{ marginTop: -10, paddingVertical: 4, paddingHorizontal: 12 }}><Text style={h.ami}>{nom} · {d}</Text></Verre>
    </View>
  );
}

const PARTIES = [
  { jeu: 'Manhunt', date: 'Hier, 18h', res: 'Capturé en 6:42', ic: 'walk' },
  { jeu: 'GeoGuessr', date: 'Mardi', res: '2e sur 5', ic: 'image' },
  { jeu: "Trouve l'objet", date: 'Samedi', res: 'Gagné, boîte aux lettres', ic: 'search' },
];

export function Profil({ nav }: { nav: Nav; p: any }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#dfeaf5' }}>
      <Fond veil={0.12} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={st.screen}>
        <Back onPress={nav.back} />
        <Appear style={{ alignItems: 'center', marginTop: 6 }}>
          <Avatar src={AV.moi} size={120} ring="#fff" />
          <Verre radius={26} style={{ paddingVertical: 8, paddingHorizontal: 22, marginTop: 14, alignItems: 'center' }}>
            <Text style={h.nom}>Mathieu</Text>
          </Verre>
          <Text style={[st.p, { marginTop: 8 }]}>12 parties jouées</Text>
        </Appear>
        <Text style={h.sec}>Anciennes parties</Text>
        {PARTIES.map((x, i) => (
          <Appear key={i} delay={100 + i * 80} style={{ marginBottom: 10 }}>
            <Verre radius={26} style={h.row}>
              <View style={[h.ic, { backgroundColor: x.jeu === 'Manhunt' ? C.rouge : C.bleu }]}><Ionicons name={x.ic as any} size={22} color="#fff" /></View>
              <View style={{ flex: 1 }}>
                <Text style={h.rowT}>{x.jeu}</Text>
                <Text style={st.p}>{x.date} · {x.res}</Text>
              </View>
            </Verre>
          </Appear>
        ))}
      </ScrollView>
    </View>
  );
}

export function Rejoindre({ nav, p }: { nav: Nav; p: any }) {
  const keys = ['K', '7', 'Q', '2'];
  const [code, setCode] = useState(keys.slice(0, Math.min(4, Number(p?.code) || 0)).join(''));
  const entrer = () => nav.replace('lobby', { jeu: 'manhunt', invite: true });
  const tap = () => { if (code.length < 4) setCode(code + keys[code.length]); };
  return (
    <View style={{ flex: 1, backgroundColor: '#dfeaf5' }}>
      <Fond veil={0.1} />
      <View style={{ flex: 1, paddingTop: 64, paddingHorizontal: 20, paddingBottom: 40 }}>
        <Pressable onPress={nav.back} hitSlop={16} style={h.close}><Ionicons name="close" size={26} color={C.texte} /></Pressable>
        <Appear style={{ marginTop: 50 }}>
          <Verre radius={34} style={{ paddingVertical: 18, alignItems: 'center' }}><Text style={h.titre}>Rejoindre une partie</Text></Verre>
        </Appear>
        <Pressable onPress={tap} style={h.cases}>
          {[0, 1, 2, 3].map((i) => (
            <Verre key={i} radius={26} style={(i === code.length ? { ...h.case, ...h.caseOn } : h.case) as any}>
              {code[i] ? <Text style={h.caseT}>{code[i]}</Text> : i === code.length ? <View style={h.caret} /> : null}
            </Verre>
          ))}
        </Pressable>
        <Text style={h.aide}>Touche les cases pour saisir le code</Text>
        <Pressable onPress={entrer} style={{ alignSelf: 'center', marginTop: 18 }}>
          <Verre radius={30} style={h.qr}>
            <Ionicons name="qr-code-outline" size={26} color={C.bleu} />
            <Text style={h.qrT}>Scanner un QR code</Text>
          </Verre>
        </Pressable>
        <View style={{ flex: 1 }} />
        <Pill label="Rejoindre" onPress={() => (code.length === 4 ? entrer() : setCode(keys.join('')))} />
      </View>
    </View>
  );
}

const h = StyleSheet.create({
  center: { ...(StyleSheet.absoluteFill as object), bottom: 260, alignItems: 'center', justifyContent: 'center' },
  top: { position: 'absolute', top: 62, left: 18, right: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  logo: { width: 84, height: 84, borderRadius: 24, borderWidth: 4, borderColor: '#fff', shadowColor: C.bleu, shadowOpacity: 0.5, shadowRadius: 14 },
  dot: { position: 'absolute', right: 0, bottom: 2, width: 18, height: 18, borderRadius: 9, backgroundColor: C.bleu, borderWidth: 3, borderColor: '#fff' },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, paddingHorizontal: 22, paddingTop: 14, paddingBottom: 46 },
  grab: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: '#C3CCDD', marginBottom: 14 },
  ami: { fontSize: 14, fontWeight: '800', color: C.texte },
  nom: { fontSize: 26, fontWeight: '900', color: C.texte },
  sec: { fontSize: 22, fontWeight: '900', color: C.texte, marginTop: 30, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  ic: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowT: { fontSize: 18, fontWeight: '800', color: C.texte },
  close: { width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center', shadowColor: '#2B5FA8', shadowOpacity: 0.2, shadowRadius: 10 },
  titre: { fontSize: 30, fontWeight: '900', color: '#0A0F2E', letterSpacing: -0.8 },
  cases: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 44 },
  case: { width: 80, height: 100, alignItems: 'center', justifyContent: 'center' },
  caseOn: { borderColor: C.bleu, borderWidth: 3, shadowColor: C.bleu, shadowOpacity: 0.6, shadowRadius: 14 },
  caseT: { fontSize: 50, fontWeight: '900', color: '#0A0F2E' },
  caret: { width: 3, height: 44, borderRadius: 2, backgroundColor: C.bleu },
  aide: { textAlign: 'center', color: '#4A5670', fontSize: 14, marginTop: 14, fontWeight: '500' },
  qr: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 14, paddingHorizontal: 22 },
  qrT: { fontSize: 18, fontWeight: '800', color: C.bleu },
});
