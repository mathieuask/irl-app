import React from 'react';
import { Dimensions, Image, ImageSourcePropType, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, IMG } from './theme';

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

const s = StyleSheet.create({
  pill: { backgroundColor: 'rgba(246,250,255,0.9)', borderRadius: 44, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center',
    shadowColor: C.azur, shadowOpacity: 0.75, shadowRadius: 18, shadowOffset: { width: 0, height: 4 } },
  tag: { borderRadius: 14, paddingHorizontal: 11, paddingVertical: 3, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } },
  tagT: { fontWeight: '900', fontSize: 13, color: C.texte },
});
