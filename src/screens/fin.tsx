import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, AvKey, C } from '../theme';
import { Appear, Avatar, Btn, mmss } from '../ui';
import { play } from '../sound';

const CLASSEMENT: { id: AvKey; nom: string; pts: number }[] = [
  { id: 'moi', nom: 'Toi', pts: 9 }, { id: 'lea', nom: 'Léa', pts: 6 }, { id: 'hugo', nom: 'Hugo', pts: 3 }, { id: 'sam', nom: 'Sam', pts: 0 },
];

export function Fin({ nav, p }: { nav: Nav; p: any }) {
  useEffect(() => { play('tada'); }, []);
  const manhunt = p.issue === 'trouve' || p.issue === 'capture';
  const titre = p.issue === 'trouve' ? 'Trouvé' : p.issue === 'capture' ? 'Capturé' : 'Victoire';
  const rouge = p.issue === 'trouve';
  return (
    <View style={[f.root, { backgroundColor: rouge ? C.rouge : C.nuit }]}>
      <Appear style={{ alignItems: 'center' }}>
        <Ionicons name={rouge ? 'skull' : 'trophy'} size={80} color="#fff" />
        <Text style={f.t}>{titre}</Text>
        {manhunt ? (
          <Text style={f.s}>{p.issue === 'capture' ? 'Hugo capturé en' : 'Tu as tenu'} {mmss(Math.max(p.temps || 0, 0) + 6 * 60)}</Text>
        ) : <Text style={f.s}>{p.issue === 'geo' ? '3 lieux sur 3 retrouvés' : 'Boîte aux lettres trouvée en premier'}</Text>}
      </Appear>
      {!manhunt && (
        <View style={{ marginTop: 26, gap: 10 }}>
          {CLASSEMENT.map((j, i) => (
            <Appear key={j.id} delay={200 + i * 120}>
              <View style={f.row}>
                <Text style={f.rk}>{i + 1}</Text>
                <Avatar src={AV[j.id]} size={44} />
                <Text style={f.nom}>{j.nom}</Text>
                <Text style={f.pts}>{j.pts} pts</Text>
              </View>
            </Appear>
          ))}
        </View>
      )}
      <View style={{ flex: 1 }} />
      <View style={{ gap: 12 }}>
        <Btn label="Rejouer" kind="blanc" icon="refresh" onPress={() => nav.reset('home')} />
        <Btn label="Partager" kind="ghost" icon="share-outline" onPress={() => {}} style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
      </View>
    </View>
  );
}

const f = StyleSheet.create({
  root: { flex: 1, paddingTop: 90, paddingHorizontal: 24, paddingBottom: 44 },
  t: { color: '#fff', fontSize: 64, fontWeight: '900', marginTop: 10 },
  s: { color: 'rgba(255,255,255,0.9)', fontSize: 20, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 24, padding: 12 },
  rk: { color: '#fff', fontSize: 22, fontWeight: '900', width: 24 },
  nom: { color: '#fff', fontSize: 18, fontWeight: '800', flex: 1 },
  pts: { color: '#fff', fontSize: 18, fontWeight: '900' },
});
