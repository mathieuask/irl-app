import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, IMG } from './theme';
import { play } from './sound';
import { Appear, Btn } from './ui';

export const { width: W, height: H } = Dimensions.get('window');

export const pad2 = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

// Zone propre de carte.jpg : l'intérieur du cercle, sans les artefacts du bord.
const SRC = { w: 853, h: 1794, x: 237, y: 380, cw: 379, ch: 820 };
export function MapClean({ children }: { children?: React.ReactNode }) {
  const k = Math.max(W / SRC.cw, H / SRC.ch);
  const left = -SRC.x * k - (SRC.cw * k - W) / 2;
  const top = -SRC.y * k - (SRC.ch * k - H) / 2;
  return (
    <View style={[StyleSheet.absoluteFill, { overflow: 'hidden', backgroundColor: '#DCE8F2' }]}>
      <Image source={IMG.carte} style={{ position: 'absolute', left, top, width: SRC.w * k, height: SRC.h * k }} />
      {children}
    </View>
  );
}

// Zone de jeu : intérieur net, extérieur éclairci, bord blanc lumineux.
export function Ring({ cx, cy, d }: { cx: number; cy: number; d: number }) {
  const B = 900;
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>
      <View style={{ position: 'absolute', left: cx - d / 2 - B, top: cy - d / 2 - B, width: d + 2 * B, height: d + 2 * B,
        borderRadius: (d + 2 * B) / 2, borderWidth: B, borderColor: 'rgba(238,245,252,0.5)' }} />
      <View style={{ position: 'absolute', left: cx - d / 2, top: cy - d / 2, width: d, height: d, borderRadius: d / 2,
        borderWidth: 4, borderColor: '#fff', backgroundColor: 'rgba(79,179,244,0.10)',
        shadowColor: C.azur, shadowOpacity: 1, shadowRadius: 22, shadowOffset: { width: 0, height: 0 } }} />
    </View>
  );
}

export function Seg({ a, b, color, w = 12 }: { a: { x: number; y: number }; b: { x: number; y: number }; color: string; w?: number }) {
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: (a.x + b.x) / 2 - len / 2, top: (a.y + b.y) / 2 - w / 2, width: len, height: w,
      borderRadius: w / 2, backgroundColor: color, transform: [{ rotate: `${ang}deg` }] }} />
  );
}

export function Pill({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[s.pill, style]}>{children}</View>;
}

export function Chrono({ s: sec, color = C.texte, size = 78 }: { s: number; color?: string; size?: number }) {
  return (
    <Pill style={{ paddingHorizontal: 30, paddingVertical: 4, alignSelf: 'center' }}>
      <Text style={{ fontSize: size, fontWeight: '900', color, letterSpacing: -2, fontVariant: ['tabular-nums'], lineHeight: size * 1.12 }}>{pad2(sec)}</Text>
    </Pill>
  );
}

export function PhotoPin({ x, y, src, size = 74, ring = C.blanc, line1, line2, dot, onPress }: {
  x: number; y: number; src: ImageSourcePropType; size?: number; ring?: string; line1?: string; line2: string; dot?: string; onPress?: () => void;
}) {
  return (
    <Pressable disabled={!onPress} onPress={onPress} style={{ position: 'absolute', left: x - 90, top: y - size / 2, width: 180, alignItems: 'center' }}>
      <View style={{ borderRadius: size / 2, backgroundColor: '#fff', shadowColor: ring, shadowOpacity: 0.9, shadowRadius: 14, shadowOffset: { width: 0, height: 0 } }}>
        <Image source={src} style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 5, borderColor: ring === C.blanc ? '#fff' : '#fff' }} />
        <View style={{ position: 'absolute', inset: -4, borderRadius: size, borderWidth: 3, borderColor: ring }} />
        {dot ? <View style={{ position: 'absolute', right: -2, bottom: 2, width: 20, height: 20, borderRadius: 10, backgroundColor: dot, borderWidth: 3, borderColor: '#fff' }} /> : null}
      </View>
      {line1 ? <View style={[s.tag, { marginTop: 6, backgroundColor: '#fff' }]}><Text style={[s.tagT, { fontSize: 16 }]}>{line1}</Text></View> : null}
      <View style={[s.tag, { marginTop: line1 ? 3 : 6, backgroundColor: ring === C.rouge ? '#FFE3E6' : '#EAF3FD' }]}>
        <Text style={[s.tagT, { color: ring === C.rouge ? C.rouge : C.bleu }]}>{line2}</Text>
      </View>
    </Pressable>
  );
}

export function Marker({ x, y, color = C.bleu }: { x: number; y: number; color?: string }) {
  const sz = 64;
  return (
    <View pointerEvents="none" style={{ position: 'absolute', left: x - sz / 2, top: y - sz / 2, width: sz, height: sz, borderRadius: sz / 2, backgroundColor: 'rgba(255,255,255,0.92)',
      alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: color, shadowColor: color, shadowOpacity: 0.8, shadowRadius: 16, shadowOffset: { width: 0, height: 0 } }}>
      <Ionicons name="navigate" size={34} color={color} style={{ marginRight: 3, marginTop: 2 }} />
    </View>
  );
}

export function ScaleBar({ px, label }: { px: number; label: string }) {
  return (
    <View style={{ position: 'absolute', left: 22, bottom: 186, flexDirection: 'row', alignItems: 'flex-end' }} pointerEvents="none">
      <View style={{ width: px, height: 8, borderWidth: 2, borderTopWidth: 0, borderColor: C.texte }} />
      <Text style={{ marginLeft: 6, fontWeight: '800', fontSize: 13, color: C.texte }}>{label}</Text>
    </View>
  );
}

// Squelette commun des jeux (modèle : Trouve l'objet) : caméra, chrono géant, cible, bouton du bas.
export function usePhoto(son: 'ding' | 'tada' = 'ding') {
  const [etat, setEtat] = useState<'vise' | 'envoi' | 'ok'>('vise');
  const flash = useRef(new Animated.Value(0)).current;
  const shoot = () => {
    play('shutter');
    flash.setValue(1);
    Animated.timing(flash, { toValue: 0, duration: 500, useNativeDriver: true }).start();
    setEtat('envoi');
    setTimeout(() => { play(son); setEtat('ok'); }, 1300);
  };
  return { etat, flash, shoot };
}

export function Cible({ t, tile, legende, bas, flash, viseur = true }: {
  t: number; tile: React.ReactNode; legende?: string; bas: React.ReactNode; flash?: Animated.Value; viseur?: boolean;
}) {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Image source={IMG.rue} style={StyleSheet.absoluteFill as any} resizeMode="cover" />
      <View style={s.top}>
        <Chrono s={t} />
        <View style={s.target}>
          {tile}
          {legende ? <Text style={s.leg}>{legende}</Text> : null}
        </View>
      </View>
      {viseur ? (
        <View pointerEvents="none" style={s.viseur}>
          <View style={[s.corner, { top: 0, left: 0, borderTopWidth: 5, borderLeftWidth: 5, borderTopLeftRadius: 26 }]} />
          <View style={[s.corner, { top: 0, right: 0, borderTopWidth: 5, borderRightWidth: 5, borderTopRightRadius: 26 }]} />
          <View style={[s.corner, { bottom: 0, left: 0, borderBottomWidth: 5, borderLeftWidth: 5, borderBottomLeftRadius: 26 }]} />
          <View style={[s.corner, { bottom: 0, right: 0, borderBottomWidth: 5, borderRightWidth: 5, borderBottomRightRadius: 26 }]} />
        </View>
      ) : null}
      <View style={s.bas}>{bas}</View>
      {flash ? <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#fff', opacity: flash }]} /> : null}
    </View>
  );
}

export const TILE = 88;

export function Capturer({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center' }}>
      <View style={s.shutter}><View style={s.shutterIn} /></View>
      <Text style={s.capt}>Capturer</Text>
    </Pressable>
  );
}

export function BasPhoto({ etat, shoot, ok, suite, label }: {
  etat: 'vise' | 'envoi' | 'ok'; shoot: () => void; ok: string; suite: () => void; label: string;
}) {
  if (etat === 'vise') return <Capturer onPress={shoot} />;
  if (etat === 'envoi') return <Pill style={{ paddingHorizontal: 22, paddingVertical: 16 }}><Text style={s.pillT}>Photo envoyée, validation...</Text></Pill>;
  return (
    <Appear style={{ width: '100%', alignItems: 'center', gap: 14 }}>
      <Pill style={{ paddingHorizontal: 24, paddingVertical: 14, flexDirection: 'row' }}>
        <Ionicons name="checkmark-circle" size={28} color={C.bleu} />
        <Text style={[s.pillT, { marginLeft: 8, fontSize: 24 }]}>{ok}</Text>
      </Pill>
      <Btn label={label} onPress={suite} style={{ alignSelf: 'stretch' }} />
    </Appear>
  );
}

const s = StyleSheet.create({
  pill: { backgroundColor: 'rgba(246,250,255,0.9)', borderRadius: 44, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: C.azur, shadowOpacity: 0.75, shadowRadius: 18, shadowOffset: { width: 0, height: 4 } },
  tag: { borderRadius: 14, paddingHorizontal: 11, paddingVertical: 3, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  tagT: { fontWeight: '900', fontSize: 13, color: C.texte },
  top: { position: 'absolute', top: 54, left: 0, right: 0, alignItems: 'center' },
  target: { backgroundColor: 'rgba(20,24,40,0.55)', borderRadius: 30, padding: 12, marginTop: 18, borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', alignItems: 'center' },
  leg: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 6 },
  viseur: { position: 'absolute', top: '36%', left: '22%', right: '22%', height: '24%' },
  corner: { position: 'absolute', width: 44, height: 44, borderColor: '#fff' },
  bas: { position: 'absolute', left: 20, right: 20, bottom: 44, alignItems: 'center' },
  shutter: { width: 96, height: 96, borderRadius: 48, borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: C.bleu, shadowOpacity: 1, shadowRadius: 20, shadowOffset: { width: 0, height: 0 } },
  shutterIn: { width: 74, height: 74, borderRadius: 37, backgroundColor: C.bleu },
  capt: { color: '#fff', fontSize: 20, fontWeight: '900', marginTop: 8, textShadowColor: 'rgba(0,0,0,0.45)', textShadowRadius: 6 },
  pillT: { fontWeight: '900', fontSize: 18, color: C.texte },
});
