import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { C, IMG, JEUX } from '../theme';
import { Appear, Back, Btn, Glass, MapBg, Me, st } from '../ui';
import { Image } from 'react-native';

export function ChoixJeu({ nav }: { nav: Nav; p: any }) {
  return (
    <View style={[st.screen, { backgroundColor: '#fff' }]}>
      <Back onPress={nav.back} />
      <Text style={[st.h1, { marginTop: 16, marginBottom: 20 }]}>On joue à quoi ?</Text>
      {JEUX.map((j, i) => (
        <Appear key={j.id} delay={i * 110}>
          <Pressable onPress={() => nav.go('paywall', { jeu: j.id })} style={({ pressed }) => [c.card, { backgroundColor: j.couleur, transform: [{ scale: pressed ? 0.97 : 1 }] }]}>
            <View style={c.cardIc}><Ionicons name={j.icone as any} size={34} color={j.couleur} /></View>
            <View style={{ flex: 1 }}>
              <Text style={c.cardT}>{j.nom}</Text>
              <Text style={c.cardS}>{j.phrase}</Text>
            </View>
            <Ionicons name="chevron-forward" size={26} color="#fff" />
          </Pressable>
        </Appear>
      ))}
    </View>
  );
}

const OFFRES = [
  { id: 'an', t: 'Annuel', prix: '29,99 €', sous: 'soit 0,58 € par semaine', badge: '3 jours gratuits' },
  { id: 'sem', t: 'Hebdo', prix: '3,99 €', sous: 'par semaine', badge: '' },
];

export function Paywall({ nav, p }: { nav: Nav; p: any }) {
  const [sel, setSel] = useState('an');
  const go = () => nav.replace('distance', p);
  return (
    <View style={{ flex: 1, backgroundColor: C.nuit }}>
      <View style={[st.screen]}>
        <Pressable onPress={go} hitSlop={16} style={{ alignSelf: 'flex-end' }}><Ionicons name="close" size={28} color="rgba(255,255,255,0.7)" /></Pressable>
        <Appear style={{ alignItems: 'center' }}><Image source={IMG.logo} style={{ width: 120, height: 120, borderRadius: 30 }} /></Appear>
        <Appear delay={100}><Text style={c.pwT}>Crée des parties illimitées</Text></Appear>
        <Appear delay={180}>
          {['Les 3 jeux, sans limite', 'Jusqu\'à 12 joueurs', 'Rejoindre reste gratuit pour tes potes'].map((x) => (
            <View key={x} style={c.li}><Ionicons name="checkmark-circle" size={24} color={C.azur} /><Text style={c.liT}>{x}</Text></View>
          ))}
        </Appear>
        <View style={{ flex: 1 }} />
        {OFFRES.map((o) => (
          <Pressable key={o.id} onPress={() => setSel(o.id)} style={[c.offre, sel === o.id && c.offreOn]}>
            <View style={{ flex: 1 }}>
              <Text style={c.offreT}>{o.t}</Text>
              <Text style={c.offreS}>{o.sous}</Text>
            </View>
            {o.badge ? <View style={c.badge}><Text style={c.badgeT}>{o.badge}</Text></View> : null}
            <Text style={c.prix}>{o.prix}</Text>
          </Pressable>
        ))}
        <Btn label={sel === 'an' ? 'Essayer 3 jours gratuits' : 'Continuer'} kind="blanc" onPress={go} style={{ marginTop: 6 }} />
        <Text style={c.small}>Annulable à tout moment</Text>
      </View>
    </View>
  );
}

const RAYONS = [200, 500, 1000, 2000];

export function Distance({ nav, p }: { nav: Nav; p: any }) {
  const [r, setR] = useState(500);
  const size = 120 + RAYONS.indexOf(r) * 70;
  return (
    <View style={{ flex: 1 }}>
      <MapBg zone={size}><View style={c.center}><Me /></View></MapBg>
      <View style={{ position: 'absolute', top: 60, left: 20 }}><Back onPress={nav.back} /></View>
      <View style={c.bottom}>
        <Glass>
          <Text style={c.lbl}>Distance autour de toi</Text>
          <Text style={c.big}>{r >= 1000 ? `${r / 1000} km` : `${r} m`}</Text>
          <View style={c.pills}>
            {RAYONS.map((x) => (
              <Pressable key={x} onPress={() => setR(x)} style={[c.pill, r === x && c.pillOn]}>
                <Text style={[c.pillT, r === x && { color: '#fff' }]}>{x >= 1000 ? `${x / 1000} km` : `${x} m`}</Text>
              </Pressable>
            ))}
          </View>
        </Glass>
        <Btn label="Créer la partie" onPress={() => nav.replace('lobby', { ...p, rayon: r })} style={{ marginTop: 12 }} />
      </View>
    </View>
  );
}

const c = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderRadius: 30, padding: 18, marginBottom: 14, minHeight: 120 },
  cardIc: { width: 64, height: 64, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardT: { color: '#fff', fontSize: 26, fontWeight: '900' },
  cardS: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '600', marginTop: 4 },
  pwT: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center', marginVertical: 20 },
  li: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  liT: { color: '#fff', fontSize: 17, fontWeight: '700' },
  offre: { flexDirection: 'row', alignItems: 'center', borderRadius: 24, padding: 18, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 3, borderColor: 'transparent' },
  offreOn: { borderColor: C.azur, backgroundColor: 'rgba(255,255,255,0.2)' },
  offreT: { color: '#fff', fontSize: 19, fontWeight: '900' },
  offreS: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  prix: { color: '#fff', fontSize: 22, fontWeight: '900' },
  badge: { backgroundColor: C.rouge, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4, marginRight: 10 },
  badgeT: { color: '#fff', fontSize: 11, fontWeight: '800' },
  small: { color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: 10, fontSize: 13 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 40 },
  lbl: { fontSize: 15, fontWeight: '700', color: C.gris },
  big: { fontSize: 64, fontWeight: '900', color: C.texte, letterSpacing: -1 },
  pills: { flexDirection: 'row', gap: 8, marginTop: 8 },
  pill: { flex: 1, height: 44, borderRadius: 22, backgroundColor: '#EAF1FF', alignItems: 'center', justifyContent: 'center' },
  pillOn: { backgroundColor: C.bleu },
  pillT: { fontWeight: '800', color: C.bleu, fontSize: 14 },
});
