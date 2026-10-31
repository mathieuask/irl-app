import React, { useRef, useState } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C, IMG, JEUX } from '../theme';
import { Appear, Dots, Fond, LienSouligne, MoiPin, Pill, Verre, Zone } from '../ui';
import { Etape } from './perms';

const W = Dimensions.get('window').width;

const SLIDES = [
  { k: 'logo' },
  { k: 'zone', t: 'Une zone. Un chrono.', s: 'Ta ville devient le terrain de jeu. Tout se passe dans le cercle.' },
  { k: 'jeux', t: 'Trois jeux, zéro règle à lire.', s: "Manhunt, GeoGuessr, Trouve l'objet. Tu comprends en une seconde." },
  { k: 'potes', t: 'Que tes potes.', s: "Pas d'inconnus, pas de liste d'amis. Un code, ta bande rejoint." },
];

function Bulle({ id, nom, size = 66, rouge, style }: { id: keyof typeof AV; nom: string; size?: number; rouge?: boolean; style?: any }) {
  return (
    <View style={[{ position: 'absolute', alignItems: 'center' }, style]}>
      <Image source={AV[id]} style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 4, borderColor: '#fff', shadowColor: rouge ? C.rouge : C.bleu, shadowOpacity: 0.5, shadowRadius: 10 }} />
      <View style={[o.nom, rouge && { backgroundColor: C.rouge }]}><Text style={[o.nomT, rouge && { color: '#fff' }]}>{nom}</Text></View>
    </View>
  );
}

export function Onboarding({ nav, p }: { nav: Nav; p: any }) {
  const start = Math.min(3, Math.max(0, Number(p?.pg) || 0));
  const [i, setI] = useState(start);
  const ref = useRef<any>(null);
  const go = (n: number) => { ref.current?.scrollTo({ x: n * W, animated: true }); setI(n); };
  const next = () => (i < SLIDES.length - 1 ? go(i + 1) : nav.go('pseudo'));
  return (
    <View style={{ flex: 1, backgroundColor: '#dfeaf5' }}>
      <Fond veil={0.1} />
      <ScrollView
        ref={ref} horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentOffset={{ x: start * W, y: 0 }}
        onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / W))}
      >
        {SLIDES.map((sl) => (
          <View key={sl.k} style={{ width: W, flex: 1 }}>{sl.k === 'logo' ? <Page1 /> : <Page sl={sl} />}</View>
        ))}
      </ScrollView>
      {i > 0 && <View pointerEvents="none" style={o.dotsTop}><Dots n={5} i={i} /></View>}
      <View style={o.bottom}>
        <Pill label={i === 0 ? 'Commencer' : i === SLIDES.length - 1 ? 'Créer mon profil' : 'Suivant'} onPress={next} />
        {i === 0 ? <LienSouligne label="J'ai déjà un compte" onPress={() => nav.go('home')} /> : <View style={{ height: 38 }} />}
      </View>
    </View>
  );
}

function Page1() {
  return (
    <View style={{ flex: 1 }}>
      <View style={o.zoneBox}><Zone size={W * 0.92} /></View>
      <Appear style={o.logoBox}><Image source={IMG.logo} style={o.logo} /></Appear>
      <View style={o.mapCenter}><MoiPin /></View>
      <Bulle id="hugo" nom="Hugo" rouge style={{ left: 26, top: 262 }} />
      <Bulle id="lea" nom="Léa" size={58} style={{ right: 46, top: 252 }} />
      <Bulle id="theo" nom="Théo" size={58} style={{ right: 24, top: 430 }} />
      <Appear delay={200} style={o.tagBox}>
        <Verre radius={26} style={{ paddingVertical: 22, alignItems: 'center' }}>
          <Text style={o.tag}>Défis entre potes, dans ta ville.</Text>
        </Verre>
      </Appear>
    </View>
  );
}

function Page({ sl }: { sl: any }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 20 }}>
      <View style={o.visu}>
        {sl.k === 'zone' && (
          <View style={{ width: W * 0.8, height: W * 0.8, alignItems: 'center', justifyContent: 'center' }}>
            <Zone size={W * 0.72} />
            <MoiPin />
            <Verre radius={20} style={o.chip}><Text style={o.chipT}>500 m  ·  12:00</Text></Verre>
          </View>
        )}
        {sl.k === 'jeux' && (
          <View style={{ width: '100%', gap: 12 }}>
            {JEUX.map((j) => (
              <Verre key={j.id} radius={26} style={o.jeu}>
                <View style={[o.ic, { backgroundColor: j.couleur === '#0A9F6E' ? C.bleu : j.couleur }]}><Ionicons name={j.icone as any} size={26} color="#fff" /></View>
                <Text style={o.jeuTxt}>{j.nom}</Text>
              </Verre>
            ))}
          </View>
        )}
        {sl.k === 'potes' && (
          <View style={{ width: W * 0.86, height: W * 0.8 }}>
            <View style={o.mapCenterBox}><MoiPin /></View>
            <Bulle id="lea" nom="Léa" style={{ left: 8, top: 20 }} />
            <Bulle id="hugo" nom="Hugo" style={{ right: 10, top: 60 }} />
            <Bulle id="sam" nom="Sam" style={{ left: 30, bottom: 10 }} />
            <Bulle id="ines" nom="Inès" style={{ right: 36, bottom: 0 }} />
          </View>
        )}
      </View>
      <Verre radius={30} style={o.textCard}>
        <Text style={o.t}>{sl.t}</Text>
        <Text style={o.s}>{sl.s}</Text>
      </Verre>
    </View>
  );
}

export function Pseudo({ nav }: { nav: Nav; p: any }) {
  const [v, setV] = useState('Mathieu');
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#dfeaf5' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Fond veil={0.12} />
      <View style={{ flex: 1, paddingTop: 70, paddingHorizontal: 20, paddingBottom: 40 }}>
        <Etape n={1} />
        <Appear style={{ marginTop: 40 }}>
          <Verre radius={34} style={{ paddingVertical: 20, paddingHorizontal: 18 }}>
            <Text style={o.h}>Comment tes potes t'appellent ?</Text>
          </Verre>
        </Appear>
        <Appear delay={120} style={{ alignSelf: 'center', marginTop: 14 }}>
          <Verre radius={22} style={{ paddingVertical: 8, paddingHorizontal: 18 }}><Text style={o.hint}>Ça aide tes potes à te trouver.</Text></Verre>
        </Appear>
        <Appear delay={220} style={{ marginTop: 30 }}>
          <Verre radius={30} style={{ paddingHorizontal: 22 }}>
            <TextInput value={v} onChangeText={setV} style={o.input} placeholder="Ton pseudo" placeholderTextColor="#9AA6BD" selectionColor={C.bleu} />
          </Verre>
        </Appear>
        <View style={{ flex: 1 }} />
        <Pill label="Continuer" onPress={() => nav.go('selfie', { pseudo: v })} />
      </View>
    </KeyboardAvoidingView>
  );
}

const o = StyleSheet.create({
  zoneBox: { position: 'absolute', left: 0, right: 0, top: 290, height: W * 0.92, alignItems: 'center', justifyContent: 'center' },
  mapCenter: { position: 'absolute', left: 0, right: 0, top: 290, height: W * 0.92, alignItems: 'center', justifyContent: 'center' },
  mapCenterBox: { ...(StyleSheet.absoluteFill as object), alignItems: 'center', justifyContent: 'center' },
  logoBox: { position: 'absolute', top: 70, left: 0, right: 0, alignItems: 'center' },
  logo: { width: 190, height: 190, borderRadius: 46, borderWidth: 5, borderColor: '#fff', shadowColor: C.bleu, shadowOpacity: 0.55, shadowRadius: 22, shadowOffset: { width: 0, height: 10 } },
  tagBox: { position: 'absolute', left: 20, right: 20, bottom: 168 },
  tag: { fontSize: 19, fontWeight: '600', color: '#27324D' },
  nom: { marginTop: -8, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 3, borderRadius: 14, shadowColor: '#2B5FA8', shadowOpacity: 0.25, shadowRadius: 6 },
  nomT: { fontSize: 14, fontWeight: '900', color: C.texte },
  dotsTop: { position: 'absolute', top: 66, left: 0, right: 0 },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 34, gap: 8 },
  visu: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 70, paddingBottom: 150 },
  textCard: { position: 'absolute', left: 20, right: 20, bottom: 140, paddingVertical: 18, paddingHorizontal: 20, alignItems: 'center' },
  t: { fontSize: 28, fontWeight: '900', color: C.texte, textAlign: 'center', letterSpacing: -0.5 },
  s: { fontSize: 16, color: '#4A5670', marginTop: 8, lineHeight: 22, textAlign: 'center', fontWeight: '500' },
  chip: { position: 'absolute', bottom: 6, paddingVertical: 8, paddingHorizontal: 16 },
  chipT: { fontSize: 18, fontWeight: '900', color: C.bleu },
  jeu: { flexDirection: 'row', alignItems: 'center', padding: 14 },
  ic: { width: 52, height: 52, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  jeuTxt: { fontSize: 22, fontWeight: '900', color: C.texte },
  h: { fontSize: 31, fontWeight: '900', color: '#0A0F2E', textAlign: 'center', letterSpacing: -0.8, lineHeight: 36 },
  hint: { fontSize: 15, fontWeight: '700', color: '#6B7690' },
  input: { fontSize: 28, fontWeight: '900', color: C.texte, paddingVertical: 20 },
});
