import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, AvKey, C } from '../theme';
import { Appear, Btn } from '../ui';
import { MapClean, Pill, mmss } from '../jeuui';
import { play } from '../sound';

type Ligne = { id: AvKey; nom: string; val: string };

function classement(p: any): Ligne[] {
  const pts = Number(p.pts) || (p.issue === 'geo' ? 9 : 3);
  return [
    { id: 'moi', nom: 'Toi', val: `${pts} pts` },
    { id: 'lea', nom: 'Léa', val: `${Math.max(pts - 3, 0)} pts` },
    { id: 'sam', nom: 'Sam', val: `${Math.max(pts - 6, 0)} pts` },
    { id: 'hugo', nom: 'Hugo', val: '0 pt' },
  ];
}

export function Fin({ nav, p }: { nav: Nav; p: any }) {
  useEffect(() => { play('tada'); }, []);
  const manhunt = p.issue === 'trouve' || p.issue === 'capture';
  const temps = Math.max(Number(p.temps) || 0, 0);
  const titre = p.issue === 'trouve' ? 'Trouvé' : p.issue === 'capture' ? 'Capturé' : 'Partie terminée';
  const partager = () => nav.go('partage', p);
  return (
    <View style={{ flex: 1 }}>
      <MapClean />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(240,247,255,0.55)' }]} />
      <View style={f.root}>
        <Appear style={{ alignSelf: 'stretch' }}>
          <Pill style={{ paddingVertical: 16 }}><Text style={f.titre}>{titre}</Text></Pill>
        </Appear>
        <Appear delay={150} style={f.card}>
          {manhunt ? (
            <View style={{ alignItems: 'center', paddingVertical: 34 }}>
              <Text style={f.lbl}>{p.issue === 'capture' ? 'Hugo capturé en' : 'Tu as tenu'}</Text>
              <Text style={f.temps}>{mmss(temps)}</Text>
              <Image source={p.issue === 'capture' ? AV.hugo : AV.moi} style={f.avBig} />
            </View>
          ) : (
            classement(p).map((j, i) => (
              <View key={j.id} style={[f.row, i === 0 && f.rowTop]}>
                <Text style={[f.rk, i === 0 && { color: C.bleu }]}>{i + 1}</Text>
                <View>
                  <Image source={AV[j.id]} style={f.av} />
                  {i === 0 ? <View style={f.crown}><Ionicons name="trophy" size={14} color="#fff" /></View> : null}
                </View>
                <Text style={f.nom}>{j.nom}</Text>
                <Text style={f.val}>{j.val}</Text>
              </View>
            ))
          )}
        </Appear>
        {manhunt ? null : (
          <Appear delay={300} style={{ alignSelf: 'stretch' }}>
            <Pill style={{ paddingVertical: 14, flexDirection: 'row' }}>
              <Text style={f.cap}>{p.issue === 'geo' ? '3 lieux sur 3 retrouvés' : 'Boîte aux lettres trouvée en premier'}</Text>
            </Pill>
          </Appear>
        )}
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}><Btn label="Rejouer" onPress={() => nav.reset('home')} /></View>
          <View style={{ flex: 1 }}><Btn label="Partager" kind="blanc" onPress={partager} /></View>
        </View>
      </View>
    </View>
  );
}

const f = StyleSheet.create({
  root: { flex: 1, paddingTop: 70, paddingHorizontal: 20, paddingBottom: 40, gap: 16 },
  titre: { fontSize: 42, fontWeight: '900', color: C.texte },
  card: { backgroundColor: 'rgba(246,250,255,0.9)', borderRadius: 44, borderWidth: 2, borderColor: '#fff', padding: 12, gap: 8,
    shadowColor: C.azur, shadowOpacity: 0.7, shadowRadius: 20, shadowOffset: { width: 0, height: 4 } },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.55)', borderRadius: 30, paddingVertical: 10, paddingHorizontal: 14 },
  rowTop: { backgroundColor: '#fff', shadowColor: C.azur, shadowOpacity: 0.9, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } },
  rk: { fontSize: 26, fontWeight: '900', color: '#6B7A99', width: 28 },
  av: { width: 64, height: 64, borderRadius: 32, borderWidth: 4, borderColor: '#fff' },
  crown: { position: 'absolute', top: -4, left: -4, width: 26, height: 26, borderRadius: 13, backgroundColor: C.bleu, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  nom: { fontSize: 24, fontWeight: '900', color: C.texte, flex: 1 },
  val: { fontSize: 24, fontWeight: '900', color: C.bleu },
  lbl: { fontSize: 22, fontWeight: '800', color: C.texte },
  temps: { fontSize: 96, fontWeight: '900', color: C.bleu, letterSpacing: -3, lineHeight: 104 },
  avBig: { width: 96, height: 96, borderRadius: 48, borderWidth: 5, borderColor: '#fff', marginTop: 14 },
  cap: { fontSize: 18, fontWeight: '900', color: C.texte },
});
