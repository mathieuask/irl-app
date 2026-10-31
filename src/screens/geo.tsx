import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C, IMG } from '../theme';
import { Btn, useCountdown } from '../ui';
import { Chrono, Pill } from '../jeuui';
import { play } from '../sound';

// 3 manches : le même visuel de lieu tant que les deux autres photos ne sont pas générées.
const MANCHES = [
  { photo: IMG.lieu, par: 'Hugo', av: AV.hugo },
  { photo: IMG.lieu, par: 'Léa', av: AV.lea },
  { photo: IMG.lieu, par: 'Sam', av: AV.sam },
];

export function Geo({ nav, p }: { nav: Nav; p: any }) {
  const manche = Number(p.manche) || 1;
  const pts = Number(p.pts) || 0;
  const info = MANCHES[manche - 1];
  const t = useCountdown(4 * 60 + 15);
  const [etat, setEtat] = useState<'cherche' | 'viseur' | 'envoi' | 'ok'>('cherche');
  const flash = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (etat !== 'envoi') return;
    const id = setTimeout(() => { play('tada'); setEtat('ok'); }, 1200);
    return () => clearTimeout(id);
  }, [etat]);
  const shoot = () => {
    play('shutter');
    flash.setValue(1);
    Animated.timing(flash, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    setEtat('envoi');
  };
  const suite = () => (manche < 3
    ? nav.replace('geo', { ...p, manche: manche + 1, pts: pts + 3 })
    : nav.replace('fin', { ...p, issue: 'geo', pts: pts + 3 }));

  if (etat !== 'cherche') {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Image source={IMG.rue} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
        <View style={g.topCam}><Chrono s={t} /></View>
        <View style={g.targetRow}>
          <Image source={info.photo} style={g.thumb} />
          <View style={[g.tag, { marginLeft: 10 }]}><Text style={g.tagT}>Retrouve ce lieu</Text></View>
        </View>
        {etat === 'viseur' ? <View pointerEvents="none" style={g.frame} /> : null}
        <View style={g.bottomCam}>
          {etat === 'viseur' && (
            <Pressable onPress={shoot} style={g.shutter}><View style={g.shutterIn} /></Pressable>
          )}
          {etat === 'envoi' && <Pill style={{ paddingHorizontal: 22, paddingVertical: 16 }}><Text style={g.pillT}>Photo envoyée, validation...</Text></Pill>}
          {etat === 'ok' && (
            <View style={{ width: '100%', alignItems: 'center', gap: 14 }}>
              <Pill style={{ paddingHorizontal: 24, paddingVertical: 14, flexDirection: 'row' }}>
                <Ionicons name="checkmark-circle" size={28} color={C.bleu} />
                <Text style={[g.pillT, { marginLeft: 8, fontSize: 24 }]}>Lieu trouvé</Text>
                <Text style={[g.pillT, { color: C.bleu, marginLeft: 10, fontSize: 24 }]}>+3</Text>
              </Pill>
              <Btn label={manche < 3 ? 'Manche suivante' : 'Voir le classement'} onPress={suite} style={{ alignSelf: 'stretch' }} />
            </View>
          )}
        </View>
        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', opacity: flash }]} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#DCE8F2' }}>
      <Image source={info.photo} style={[StyleSheet.absoluteFill as any, { opacity: 0.35 }]} blurRadius={24} resizeMode="cover" />
      <View style={g.top}><Chrono s={t} color={C.bleu} /></View>
      <View style={g.card}>
        <Image source={info.photo} style={g.photo} resizeMode="cover" />
        <View style={g.manche}><Text style={g.mancheT}>Manche {manche}/3</Text></View>
        <View style={g.par}>
          <Image source={info.av} style={g.parAv} />
          <View style={g.parPill}><Text style={g.parT}>Photo de {info.par}</Text></View>
        </View>
      </View>
      <View style={g.bottom}>
        <Pill style={{ alignSelf: 'stretch', paddingVertical: 14 }}>
          <Text style={g.consigne}>Retrouve ce lieu</Text>
          <Text style={g.sous}>3 points pour le premier arrivé</Text>
        </Pill>
        <Btn label="Capturer" icon="camera" onPress={() => { play('pop'); setEtat('viseur'); }} style={{ alignSelf: 'stretch', marginTop: 12 }} />
      </View>
    </View>
  );
}

const g = StyleSheet.create({
  top: { position: 'absolute', top: 54, left: 0, right: 0, alignItems: 'center' },
  card: { position: 'absolute', top: 178, left: 18, right: 18, height: 440, borderRadius: 40, overflow: 'hidden', borderWidth: 4, borderColor: '#fff',
    shadowColor: C.azur, shadowOpacity: 0.9, shadowRadius: 20, shadowOffset: { width: 0, height: 0 } },
  photo: { width: '100%', height: '100%' },
  manche: { position: 'absolute', top: 14, right: 14, backgroundColor: 'rgba(246,250,255,0.92)', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 6 },
  mancheT: { fontWeight: '900', color: C.texte, fontSize: 15 },
  par: { position: 'absolute', left: 12, bottom: 12, flexDirection: 'row', alignItems: 'center' },
  parAv: { width: 56, height: 56, borderRadius: 28, borderWidth: 4, borderColor: '#fff', zIndex: 2 },
  parPill: { backgroundColor: 'rgba(246,250,255,0.94)', borderRadius: 22, paddingLeft: 22, paddingRight: 16, paddingVertical: 11, marginLeft: -16 },
  parT: { fontWeight: '900', fontSize: 18, color: C.texte },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 36 },
  consigne: { fontSize: 28, fontWeight: '900', color: C.texte },
  sous: { fontSize: 15, fontWeight: '800', color: C.bleu, marginTop: 2 },
  topCam: { position: 'absolute', top: 54, left: 0, right: 0, alignItems: 'center' },
  targetRow: { position: 'absolute', top: 178, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  thumb: { width: 64, height: 64, borderRadius: 20, borderWidth: 3, borderColor: '#fff' },
  tag: { backgroundColor: 'rgba(246,250,255,0.94)', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 12 },
  tagT: { fontWeight: '900', fontSize: 18, color: C.texte },
  frame: { position: 'absolute', top: '34%', left: '14%', right: '14%', height: '28%', borderWidth: 3, borderColor: 'rgba(255,255,255,0.9)', borderRadius: 28 },
  bottomCam: { position: 'absolute', left: 20, right: 20, bottom: 44, alignItems: 'center' },
  shutter: { width: 92, height: 92, borderRadius: 46, borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: C.bleu, shadowOpacity: 1, shadowRadius: 18, shadowOffset: { width: 0, height: 0 } },
  shutterIn: { width: 70, height: 70, borderRadius: 35, backgroundColor: C.bleu },
  pillT: { fontWeight: '900', fontSize: 18, color: C.texte },
});
