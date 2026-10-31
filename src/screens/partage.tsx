import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C, IMG } from '../theme';
import { Back } from '../ui';
import { MapClean, Pill, Seg, W, mmss } from '../jeuui';
import { play } from '../sound';

const CW = W - 40;
const CH = 440;
const PTS = [{ x: 70, y: 110 }, { x: 150, y: 190 }, { x: 250, y: 130 }, { x: 290, y: 260 }, { x: 200, y: 350 }];

export function Partage({ nav, p }: { nav: Nav; p: any }) {
  const [msg, setMsg] = useState('');
  const temps = Math.max(Number(p.temps) || 0, 0);
  const manhunt = p.issue === 'trouve' || p.issue === 'capture';
  const stats = manhunt
    ? [[mmss(temps), p.issue === 'capture' ? 'chasse' : 'tenu'], ['4', 'joueurs'], [p.issue === 'capture' ? '1' : '0', 'capture']]
    : [[String(Number(p.pts) || (p.issue === 'geo' ? 9 : 3)), 'points'], ['4', 'joueurs'], ['1er', 'rang']];
  const action = (t: string) => { play('pop'); setMsg(t); };
  const photos = [IMG.lieu, AV.lea, AV.hugo];
  return (
    <View style={{ flex: 1 }}>
      <MapClean />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(240,247,255,0.45)' }]} />
      <View style={s.back}><Back onPress={() => nav.back()} /></View>
      <Image source={IMG.logo} style={s.logo} />
      <View style={s.carte}>
        <View style={{ flex: 1, overflow: 'hidden', borderRadius: 34 }}>
          <MapClean>
            {PTS.slice(0, -1).map((a, i) => <Seg key={i} a={a} b={PTS[i + 1]} color="#fff" w={7} />)}
            {photos.map((src, i) => (
              <Image key={i} source={src} style={[s.photo, { left: PTS[i * 2].x - 36, top: PTS[i * 2].y - 36 }]} />
            ))}
            <View style={[s.dot, { left: PTS[4].x - 14, top: PTS[4].y - 14 }]} />
          </MapClean>
        </View>
        <View style={s.stats}>
          {stats.map(([v, l], i) => (
            <View key={i} style={s.stat}><Text style={s.v}>{v}</Text><Text style={s.l}>{l}</Text></View>
          ))}
        </View>
      </View>
      <View style={s.actions}>
        {([['logo-instagram', 'Story'], ['logo-tiktok', 'TikTok'], ['chatbubble-outline', 'Messages'], ['download-outline', 'Enregistrer']] as const).map(([ic, l]) => (
          <Pressable key={l} onPress={() => action(l === 'Enregistrer' ? 'Image enregistrée' : `Partagé sur ${l}`)} style={{ alignItems: 'center', width: 78 }}>
            <View style={s.round}><Ionicons name={ic} size={32} color={C.texte} /></View>
            <Text style={s.al}>{l}</Text>
          </Pressable>
        ))}
      </View>
      {msg ? <View style={s.toast}><Pill style={{ paddingHorizontal: 20, paddingVertical: 10 }}><Text style={s.al}>{msg}</Text></Pill></View> : null}
    </View>
  );
}

const s = StyleSheet.create({
  back: { position: 'absolute', top: 54, left: 16, zIndex: 5 },
  logo: { position: 'absolute', top: 50, alignSelf: 'center', width: 66, height: 66, borderRadius: 20, borderWidth: 3, borderColor: '#fff', zIndex: 4 },
  carte: { position: 'absolute', top: 100, left: 20, width: CW, height: CH + 100, borderRadius: 38, backgroundColor: 'rgba(246,250,255,0.92)', borderWidth: 3, borderColor: '#fff',
    padding: 6, shadowColor: C.azur, shadowOpacity: 0.9, shadowRadius: 22, shadowOffset: { width: 0, height: 0 } },
  photo: { position: 'absolute', width: 72, height: 72, borderRadius: 18, borderWidth: 4, borderColor: '#fff' },
  dot: { position: 'absolute', width: 28, height: 28, borderRadius: 14, backgroundColor: C.bleu, borderWidth: 4, borderColor: '#fff' },
  stats: { flexDirection: 'row', paddingVertical: 12 },
  stat: { flex: 1, alignItems: 'center' },
  v: { fontSize: 34, fontWeight: '900', color: C.bleu },
  l: { fontSize: 16, fontWeight: '800', color: C.texte },
  actions: { position: 'absolute', bottom: 46, left: 14, right: 14, flexDirection: 'row', justifyContent: 'space-between' },
  round: { width: 70, height: 70, borderRadius: 35, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center',
    shadowColor: C.azur, shadowOpacity: 0.6, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
  al: { fontSize: 14, fontWeight: '900', color: C.texte, marginTop: 6 },
  toast: { position: 'absolute', bottom: 150, left: 0, right: 0, alignItems: 'center' },
});
