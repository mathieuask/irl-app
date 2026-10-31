import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C, JEUX, JOUEURS } from '../theme';
import { Appear, Avatar, Back, Btn, MapBg, st } from '../ui';
import { play } from '../sound';

let partie = 0;

export function Lobby({ nav, p }: { nav: Nav; p: any }) {
  const [n, setN] = useState(0);
  const jeu = JEUX.find((j) => j.id === p.jeu) || JEUX[0];
  useEffect(() => {
    const id = setInterval(() => setN((x) => {
      if (x < JOUEURS.length) play('pop');
      return Math.min(x + 1, JOUEURS.length);
    }), 900);
    return () => clearInterval(id);
  }, []);
  const lancer = () => {
    partie += 1;
    nav.replace('countdown', { ...p, role: p.jeu === 'manhunt' ? (partie % 2 === 1 ? 'fuyard' : 'chasseur') : 'joueur' });
  };
  return (
    <View style={[st.screen, { backgroundColor: '#fff' }]}>
      <Back onPress={nav.back} />
      <View style={{ alignItems: 'center', marginTop: 4 }}>
        <View style={[l.jeu, { backgroundColor: jeu.couleur }]}>
          <Ionicons name={jeu.icone as any} size={16} color="#fff" /><Text style={l.jeuT}>{jeu.nom}</Text>
        </View>
        <Text style={[st.p, { marginTop: 16 }]}>Code de la partie</Text>
        <Text style={l.code}>K7Q2</Text>
        <View style={l.qr}><Ionicons name="qr-code" size={110} color={C.texte} /></View>
      </View>
      <Text style={l.sec}>{n + 1} joueurs dans la partie</Text>
      <View style={l.grid}>
        <Joueur src={AV.moi} nom="Toi" />
        {JOUEURS.slice(0, n).map((j) => <Joueur key={j.id} src={AV[j.id]} nom={j.nom} />)}
      </View>
      <View style={{ flex: 1 }} />
      {p.invite ? (
        <View style={l.wait}><Text style={l.waitT}>En attente du créateur…</Text></View>
      ) : null}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Btn label="Partager" kind="blanc" icon="share-outline" onPress={() => {}} style={{ paddingHorizontal: 18 }} />
        <View style={{ flex: 1 }}><Btn label={p.invite ? 'Prêt' : 'Lancer'} icon="flash" onPress={lancer} /></View>
      </View>
    </View>
  );
}

function Joueur({ src, nom }: any) {
  return (
    <Appear from={20} style={{ alignItems: 'center', width: 76 }}>
      <Avatar src={src} size={64} ring={C.bleu} />
      <Text style={l.nom}>{nom}</Text>
    </Appear>
  );
}

export function Countdown({ nav, p }: { nav: Nav; p: any }) {
  const [n, setN] = useState(3);
  const s = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    s.setValue(0);
    play(n > 0 ? 'tick' : 'go');
    Animated.timing(s, { toValue: 1, duration: 800, easing: Easing.out(Easing.back(2)), useNativeDriver: true }).start();
    const t = setTimeout(() => {
      if (n > 0) setN(n - 1);
      else nav.replace(p.jeu === 'manhunt' ? 'reveal' : p.jeu === 'objet' ? 'slot' : 'geo', p);
    }, 900);
    return () => clearTimeout(t);
  }, [n]);
  const scale = s.interpolate({ inputRange: [0, 1], outputRange: [2.4, 1] });
  return (
    <View style={{ flex: 1 }}>
      <MapBg zone={300} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(6,56,232,0.55)', alignItems: 'center', justifyContent: 'center' }]}>
        <Animated.Text style={[l.cd, { opacity: s, transform: [{ scale }] }]}>{n > 0 ? n : 'GO'}</Animated.Text>
        <Text style={l.cdS}>Restez dans la zone</Text>
      </View>
    </View>
  );
}

export function Reveal({ nav, p }: { nav: Nav; p: any }) {
  const chasse = p.role === 'fuyard';
  const s = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    play('impact');
    Animated.spring(s, { toValue: 1, friction: 5, useNativeDriver: true }).start();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: chasse ? C.rouge : C.nuit, padding: 24, paddingTop: 100, paddingBottom: 44 }}>
      <Animated.View style={{ alignItems: 'center', transform: [{ scale: s }] }}>
        <Ionicons name={chasse ? 'eye' : 'locate'} size={90} color="#fff" />
        <Text style={l.rvSmall}>Tu es</Text>
        <Text style={l.rvBig}>{chasse ? 'CHASSÉ' : 'CHASSEUR'}</Text>
      </Animated.View>
      <Appear delay={300} style={{ marginTop: 30, alignItems: 'center' }}>
        {chasse ? (
          <Text style={l.rvTxt}>Tu as 3 minutes d'avance. Ta position est révélée toutes les 3 minutes. Cours.</Text>
        ) : (
          <>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Avatar src={AV.lea} size={56} /><Avatar src={AV.sam} size={56} />
            </View>
            <Text style={[l.rvTxt, { marginTop: 16 }]}>Avec Léa et Sam. Trouvez Hugo avant la fin du chrono.</Text>
          </>
        )}
      </Appear>
      <View style={{ flex: 1 }} />
      <Btn label={chasse ? 'Je pars' : 'À la chasse'} kind="blanc" onPress={() => nav.replace('manhunt', p)} />
    </View>
  );
}

const l = StyleSheet.create({
  jeu: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  jeuT: { color: '#fff', fontWeight: '800', fontSize: 15 },
  code: { fontSize: 76, fontWeight: '900', color: C.texte, letterSpacing: 8 },
  qr: { backgroundColor: '#F2F6FF', borderRadius: 28, padding: 14, marginTop: 4 },
  sec: { fontSize: 18, fontWeight: '900', color: C.texte, marginTop: 22, marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  nom: { fontSize: 13, fontWeight: '700', color: C.texte, marginTop: 4 },
  wait: { alignItems: 'center', marginBottom: 12 },
  waitT: { color: C.gris, fontWeight: '700' },
  cd: { fontSize: 200, fontWeight: '900', color: '#fff' },
  cdS: { color: '#fff', fontSize: 20, fontWeight: '800' },
  rvSmall: { color: 'rgba(255,255,255,0.85)', fontSize: 24, fontWeight: '800', marginTop: 20 },
  rvBig: { color: '#fff', fontSize: 64, fontWeight: '900', letterSpacing: -1 },
  rvTxt: { color: '#fff', fontSize: 19, fontWeight: '700', textAlign: 'center', lineHeight: 27 },
});
