import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C, IMG, JEUX } from '../theme';
import { Appear, Avatar, Btn, MapBg, Me, st } from '../ui';
import { Etape } from './perms';

const W = Dimensions.get('window').width;

const SLIDES = [
  { k: 'logo' },
  { k: 'zone', t: 'Une zone. Un chrono.', s: 'Ta ville devient le terrain de jeu. Tout se passe dans le cercle.' },
  { k: 'jeux', t: 'Trois jeux, zéro règle à lire.', s: 'Manhunt, GeoGuessr, Trouve l\'objet. Tu comprends en une seconde.' },
  { k: 'potes', t: 'Que tes potes.', s: 'Pas d\'inconnus, pas de liste d\'amis. Un code, ta bande rejoint, c\'est parti.' },
];

export function Onboarding({ nav }: { nav: Nav; p: any }) {
  const [i, setI] = useState(0);
  const ref = useRef<any>(null);
  const x = useRef(new Animated.Value(0)).current;
  const next = () => {
    if (i < SLIDES.length - 1) { ref.current?.scrollTo({ x: (i + 1) * W, animated: true }); setI(i + 1); }
    else nav.go('pseudo');
  };
  return (
    <View style={{ flex: 1, backgroundColor: C.nuit }}>
      <Animated.ScrollView
        ref={ref as any} horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x } } }], { useNativeDriver: true })}
        onMomentumScrollEnd={(e) => setI(Math.round(e.nativeEvent.contentOffset.x / W))}
        scrollEventThrottle={16}
      >
        {SLIDES.map((sl, idx) => {
          const scale = x.interpolate({ inputRange: [(idx - 1) * W, idx * W, (idx + 1) * W], outputRange: [0.8, 1, 0.8], extrapolate: 'clamp' });
          return (
            <View key={sl.k} style={{ width: W, flex: 1 }}>
              <Animated.View style={{ flex: 1, transform: [{ scale }] }}>{renderSlide(sl)}</Animated.View>
            </View>
          );
        })}
      </Animated.ScrollView>
      <View style={o.bottom}>
        <View style={o.dots}>
          {SLIDES.map((_, idx) => <View key={idx} style={[o.dot, idx === i && o.dotOn]} />)}
        </View>
        <Btn label={i === 0 ? 'Commencer' : i === SLIDES.length - 1 ? 'Créer mon profil' : 'Suivant'} kind="blanc" onPress={next} />
        {i === 0 ? <Pressable onPress={() => nav.go('home')}><Text style={o.link}>J'ai déjà un compte</Text></Pressable> : <View style={{ height: 38 }} />}
      </View>
    </View>
  );
}

function renderSlide(sl: any) {
  if (sl.k === 'logo') {
    return (
      <View style={o.center}>
        <Appear><Image source={IMG.logo} style={{ width: W * 0.8, height: W * 0.8, borderRadius: 48 }} /></Appear>
        <Appear delay={250}><Text style={o.tag}>Joue en vrai.</Text></Appear>
        <Appear delay={400}><Text style={o.sub}>Défis entre potes, dans ta ville.</Text></Appear>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, paddingTop: 80, paddingHorizontal: 24 }}>
      <View style={o.card}>
        {sl.k === 'zone' && <MapBg zone={200}><View style={o.center}><Me /></View></MapBg>}
        {sl.k === 'jeux' && (
          <View style={{ flex: 1, justifyContent: 'center', gap: 12, padding: 16 }}>
            {JEUX.map((j) => (
              <View key={j.id} style={o.jeu}>
                <View style={[o.ic, { backgroundColor: j.couleur }]}><Ionicons name={j.icone as any} size={22} color="#fff" /></View>
                <Text style={o.jeuTxt}>{j.nom}</Text>
              </View>
            ))}
          </View>
        )}
        {sl.k === 'potes' && (
          <MapBg zone={220}>
            <View style={o.center}><Me /></View>
            {(['lea', 'hugo', 'sam', 'ines'] as const).map((id, n) => (
              <View key={id} style={{ position: 'absolute', top: `${[28, 60, 34, 66][n]}%` as any, left: `${[22, 26, 66, 64][n]}%` as any }}>
                <Avatar src={AV[id]} size={52} />
              </View>
            ))}
          </MapBg>
        )}
      </View>
      <Text style={o.t}>{sl.t}</Text>
      <Text style={o.s}>{sl.s}</Text>
    </View>
  );
}

export function Pseudo({ nav }: { nav: Nav; p: any }) {
  const [v, setV] = useState('Mathieu');
  return (
    <View style={[st.screen, { backgroundColor: '#fff' }]}>
      <Etape n={1} />
      <Appear><Text style={st.h1}>Comment tes potes t'appellent ?</Text></Appear>
      <Appear delay={120}>
        <TextInput value={v} onChangeText={setV} style={o.input} placeholder="Ton pseudo" autoFocus={false} />
      </Appear>
      <Appear delay={220}><Text style={[st.p, { marginTop: 12 }]}>Pas d'âge, pas de numéro. Juste un pseudo.</Text></Appear>
      <View style={{ flex: 1 }} />
      <Btn label="Continuer" onPress={() => nav.go('selfie', { pseudo: v })} />
    </View>
  );
}

const o = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tag: { color: '#fff', fontSize: 40, fontWeight: '900', marginTop: 28, textAlign: 'center' },
  sub: { color: 'rgba(255,255,255,0.8)', fontSize: 18, fontWeight: '600', marginTop: 8, textAlign: 'center' },
  card: { height: W * 1.0, borderRadius: 36, overflow: 'hidden', backgroundColor: '#fff' },
  t: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 28 },
  s: { color: 'rgba(255,255,255,0.8)', fontSize: 17, marginTop: 10, lineHeight: 24 },
  jeu: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F6FF', borderRadius: 24, padding: 14 },
  ic: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  jeuTxt: { fontSize: 22, fontWeight: '900', color: C.texte },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 30, gap: 12 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.4)' },
  dotOn: { width: 26, backgroundColor: '#fff' },
  link: { color: '#fff', textAlign: 'center', fontWeight: '700', fontSize: 15, paddingVertical: 10 },
  input: { marginTop: 24, fontSize: 28, fontWeight: '800', backgroundColor: '#F2F6FF', borderRadius: 24, padding: 20, color: C.texte },
  selfie: { width: 160, height: 160, borderRadius: 80, backgroundColor: '#F2F6FF', alignItems: 'center', justifyContent: 'center' },
});
