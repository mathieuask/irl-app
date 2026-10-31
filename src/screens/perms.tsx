import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C, IMG } from '../theme';
import { Appear, Dots, Fond, LienSouligne, MoiPin, Pill, Verre } from '../ui';
import { play } from '../sound';

export function Selfie({ nav, p }: { nav: Nav; p: any }) {
  const [ok, setOk] = useState(p?.ok === '1');
  const prendre = () => { play('shutter'); setOk(true); };
  return (
    <View style={{ flex: 1, backgroundColor: '#dfeaf5' }}>
      <Fond veil={0.08} />
      <View style={k.dotsTop}><Etape n={2} /></View>
      <View style={k.selfieBox}>
        <Pressable onPress={prendre}>
          <View style={k.selfie}>
            {ok ? <Appear from={0}><Image source={AV.moi} style={k.selfieImg} /></Appear> : <Ionicons name="person" size={130} color="#BCCBE6" style={{ marginTop: 40 }} />}
          </View>
          {!ok && <View style={k.cam}><Ionicons name="camera" size={26} color="#fff" /></View>}
        </Pressable>
      </View>
      <View style={k.selfieBottom}>
        <Verre radius={30} style={{ paddingVertical: 20, alignItems: 'center' }}>
          <Text style={k.selfieT}>{ok ? 'Parfait, ' + (p?.pseudo || 'Mathieu') : 'Ta tête sur la carte'}</Text>
          <Text style={k.selfieS}>{ok ? 'Voilà comme tes potes te verront.' : 'Tes potes te verront comme ça.'}</Text>
        </Verre>
        <Pill label={ok ? 'Continuer' : 'Prendre un selfie'} onPress={() => (ok ? nav.go('position', p) : prendre())} style={{ marginTop: 12 }} />
        {ok ? <View style={{ height: 38 }} /> : <LienSouligne label="Plus tard" onPress={() => nav.go('position', p)} />}
        <Text style={k.foot}>Seulement pour ton selfie et tes photos de partie.</Text>
      </View>
    </View>
  );
}

function Popup({ titre, texte, oui, non, onOui, onNon }: any) {
  return (
    <View style={k.veil}>
      <Appear from={40} style={k.pop}>
        <Text style={k.popT}>{titre}</Text>
        <Text style={k.popS}>{texte}</Text>
        <Pressable onPress={onOui} style={k.popB}><Text style={k.popBT}>{oui}</Text></Pressable>
        <Pressable onPress={onNon} style={k.popB}><Text style={[k.popBT, { fontWeight: '400' }]}>{non}</Text></Pressable>
      </Appear>
    </View>
  );
}

export function Position({ nav, p }: { nav: Nav; p: any }) {
  const [pop, setPop] = useState(p?.pop === '1');
  const lignes = [
    { ic: 'location-outline', t: 'Visible seulement pendant une partie' },
    { ic: 'people-outline', t: 'Seulement par tes potes' },
    { ic: 'time-outline', t: 'Coupée à la fin' },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: '#dfeaf5' }}>
      <Fond veil={0.02} />
      <View style={k.dotsTop}><Etape n={3} /></View>
      <View style={k.posCenter}><MoiPin size={70} halo={140} /></View>
      <Verre radius={40} style={k.sheet}>
        <Text style={k.sheetT}>Active ta position</Text>
        {lignes.map((l) => (
          <View key={l.t} style={k.ligne}>
            <View style={k.ligneIc}><Ionicons name={l.ic as any} size={26} color={C.bleu} /></View>
            <Text style={k.ligneT}>{l.t}</Text>
          </View>
        ))}
        <Pill label="Activer la localisation" onPress={() => setPop(true)} style={{ marginTop: 14 }} />
        <LienSouligne label="Plus tard" onPress={() => nav.go('notifs', p)} />
      </Verre>
      {pop && <Popup titre="Autoriser « IRL » à utiliser votre position ?" texte="Ta position sert uniquement pendant une partie, pour la zone et les autres joueurs."
        oui="Autoriser pendant l'utilisation" non="Ne pas autoriser" onOui={() => nav.go('notifs', p)} onNon={() => nav.go('notifs', p)} />}
    </View>
  );
}

export function Notifs({ nav, p }: { nav: Nav; p: any }) {
  const [pop, setPop] = useState(p?.pop === '1');
  return (
    <View style={{ flex: 1, backgroundColor: '#dfeaf5' }}>
      <Fond veil={0.1} />
      <View style={k.dotsTop}><Etape n={4} /></View>
      <Appear style={k.banner}>
        <Verre radius={24} style={{ flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 }}>
          <Image source={IMG.logo} style={k.bannerIc} />
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={k.bannerApp}>irl</Text><Text style={k.bannerApp}>maintenant</Text>
            </View>
            <Text style={k.bannerT}>Hugo a lancé une partie de Manhunt près de toi</Text>
          </View>
        </Verre>
      </Appear>
      <View style={k.notifBottom}>
        <Verre radius={34} style={{ paddingVertical: 24, paddingHorizontal: 20 }}>
          <Text style={k.notifTitre}>Sois prévenu quand tes potes lancent une partie</Text>
          <Pill label="Activer les notifications" onPress={() => setPop(true)} style={{ marginTop: 18 }} />
          <LienSouligne label="Plus tard" onPress={() => nav.reset('home')} />
        </Verre>
      </View>
      {pop && <Popup titre="« IRL » souhaite vous envoyer des notifications" texte="Alertes, sons et pastilles."
        oui="Autoriser" non="Refuser" onOui={() => nav.reset('home')} onNon={() => nav.reset('home')} />}
    </View>
  );
}

export function Etape({ n, light }: { n: number; light?: boolean }) {
  return <Dots n={5} i={n} />;
}

const k = StyleSheet.create({
  dotsTop: { position: 'absolute', top: 66, left: 0, right: 0 },
  selfieBox: { position: 'absolute', top: 190, left: 0, right: 0, alignItems: 'center' },
  selfie: { width: 230, height: 230, borderRadius: 115, backgroundColor: 'rgba(225,238,255,0.92)', borderWidth: 5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', shadowColor: C.bleu, shadowOpacity: 0.5, shadowRadius: 24 },
  selfieImg: { width: 230, height: 230 },
  cam: { position: 'absolute', right: 2, bottom: 12, width: 58, height: 58, borderRadius: 29, backgroundColor: C.bleu, borderWidth: 4, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  selfieBottom: { position: 'absolute', left: 16, right: 16, bottom: 28 },
  selfieT: { fontSize: 29, fontWeight: '900', color: C.texte, letterSpacing: -0.6 },
  selfieS: { fontSize: 17, color: '#4A5670', marginTop: 4 },
  foot: { textAlign: 'center', color: '#4A5670', fontSize: 13, marginTop: 6 },
  posCenter: { position: 'absolute', top: 250, left: 0, right: 0, alignItems: 'center' },
  sheet: { position: 'absolute', left: 6, right: 6, bottom: 6, paddingHorizontal: 22, paddingTop: 24, paddingBottom: 22 },
  sheetT: { fontSize: 32, fontWeight: '900', color: C.texte, textAlign: 'center', letterSpacing: -0.8, marginBottom: 14 },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 7 },
  ligneIc: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#EAF1FC', alignItems: 'center', justifyContent: 'center' },
  ligneT: { flex: 1, fontSize: 18, fontWeight: '500', color: C.texte },
  banner: { position: 'absolute', top: 210, left: 18, right: 18 },
  bannerIc: { width: 50, height: 50, borderRadius: 13 },
  bannerApp: { fontSize: 14, fontWeight: '600', color: '#6B7690' },
  bannerT: { fontSize: 16, fontWeight: '800', color: C.texte, marginTop: 2 },
  notifBottom: { position: 'absolute', left: 16, right: 16, bottom: 56 },
  notifTitre: { fontSize: 30, fontWeight: '900', color: '#141A44', textAlign: 'center', letterSpacing: -0.8, lineHeight: 35 },
  veil: { ...(StyleSheet.absoluteFill as object), backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  pop: { width: 280, backgroundColor: 'rgba(245,245,247,0.98)', borderRadius: 16, overflow: 'hidden', alignItems: 'center' },
  popT: { fontSize: 17, fontWeight: '700', textAlign: 'center', paddingHorizontal: 16, paddingTop: 18, color: '#000' },
  popS: { fontSize: 13, textAlign: 'center', paddingHorizontal: 16, paddingVertical: 8, color: '#333' },
  popB: { width: '100%', borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#C6C6C8', paddingVertical: 12 },
  popBT: { color: '#0A84FF', fontSize: 17, fontWeight: '600', textAlign: 'center' },
  notif: { flexDirection: 'row', gap: 12, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 22, padding: 14, marginBottom: 10, width: '100%' as const },
  notifIc: { width: 40, height: 40, borderRadius: 10, backgroundColor: C.bleu, alignItems: 'center', justifyContent: 'center' },
  notifT: { fontWeight: '800', color: C.texte },
  notifS: { color: C.texte, fontSize: 14 },
  nT: { color: '#fff', fontSize: 32, fontWeight: '900', marginTop: 30, textAlign: 'center' },
  nS: { color: 'rgba(255,255,255,0.8)', fontSize: 17, marginTop: 8, textAlign: 'center' },
  steps: { flexDirection: 'row', gap: 6, marginBottom: 20 },
  step: { flex: 1, height: 5, borderRadius: 3 },
});
