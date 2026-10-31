import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C, IMG } from '../theme';
import { Appear, Avatar, Back, Btn, Glass, MapBg, Me, st } from '../ui';

export function Home({ nav }: { nav: Nav; p: any }) {
  return (
    <View style={{ flex: 1 }}>
      <MapBg zone={0}><View style={h.center}><Me /></View></MapBg>
      <View style={h.top}>
        <Image source={IMG.logo} style={h.logo} />
        <Pressable onPress={() => nav.go('profil')}><Avatar src={AV.moi} size={52} /></Pressable>
      </View>
      <View style={h.bottom}>
        <Appear><Btn label="Lancer une partie" icon="play" onPress={() => nav.go('choix')} style={{ height: 68, borderRadius: 34 }} /></Appear>
        <Appear delay={120}><Btn label="Rejoindre" kind="blanc" icon="enter" onPress={() => nav.go('rejoindre')} /></Appear>
      </View>
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
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }} contentContainerStyle={st.screen}>
      <Back onPress={nav.back} />
      <Appear style={{ alignItems: 'center', marginTop: 10 }}>
        <Avatar src={AV.moi} size={120} ring={C.bleu} />
        <Text style={[st.h1, { marginTop: 12 }]}>Mathieu</Text>
        <Text style={st.p}>12 parties jouées</Text>
      </Appear>
      <Text style={h.sec}>Anciennes parties</Text>
      {PARTIES.map((x, i) => (
        <Appear key={i} delay={100 + i * 80}>
          <View style={h.row}>
            <View style={h.ic}><Ionicons name={x.ic as any} size={22} color="#fff" /></View>
            <View style={{ flex: 1 }}>
              <Text style={h.rowT}>{x.jeu}</Text>
              <Text style={st.p}>{x.date} · {x.res}</Text>
            </View>
          </View>
        </Appear>
      ))}
    </ScrollView>
  );
}

export function Rejoindre({ nav }: { nav: Nav; p: any }) {
  const [code, setCode] = useState('');
  const keys = ['K', '7', 'Q', '2'];
  const tap = () => {
    if (code.length < 4) {
      const n = code + keys[code.length];
      setCode(n);
      if (n.length === 4) setTimeout(() => nav.replace('lobby', { jeu: 'manhunt', invite: true }), 500);
    }
  };
  return (
    <View style={[st.screen, { backgroundColor: '#fff' }]}>
      <Back onPress={nav.back} />
      <Text style={[st.h1, { marginTop: 20 }]}>Entre le code</Text>
      <Text style={st.p}>Demande-le au créateur de la partie.</Text>
      <Pressable onPress={tap} style={h.cases}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[h.case, code[i] ? { borderColor: C.bleu } : null]}>
            <Text style={h.caseT}>{code[i] || ''}</Text>
          </View>
        ))}
      </Pressable>
      <Text style={[st.p, { textAlign: 'center' }]}>Touche les cases pour saisir le code</Text>
      <View style={{ flex: 1 }} />
      <Btn label="Scanner un QR" kind="blanc" icon="qr-code" onPress={() => nav.replace('lobby', { jeu: 'manhunt', invite: true })} />
    </View>
  );
}

const h = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  top: { position: 'absolute', top: 60, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { width: 56, height: 56, borderRadius: 16 },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 44, gap: 12 },
  sec: { fontSize: 20, fontWeight: '900', color: C.texte, marginTop: 30, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F6FF', borderRadius: 24, padding: 14, marginBottom: 10 },
  ic: { width: 46, height: 46, borderRadius: 16, backgroundColor: C.bleu, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  rowT: { fontSize: 18, fontWeight: '800', color: C.texte },
  cases: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginVertical: 40 },
  case: { width: 70, height: 86, borderRadius: 22, backgroundColor: '#F2F6FF', borderWidth: 3, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  caseT: { fontSize: 44, fontWeight: '900', color: C.texte },
});
