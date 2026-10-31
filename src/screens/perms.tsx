import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Nav } from '../nav';
import { AV, C } from '../theme';
import { Appear, Avatar, Btn, MapBg, Me, st } from '../ui';
import { play } from '../sound';

export function Selfie({ nav, p }: { nav: Nav; p: any }) {
  const [ok, setOk] = useState(false);
  return (
    <View style={[st.screen, { backgroundColor: '#fff' }]}>
      <Etape n={2} />
      <Appear><Text style={st.h1}>Ta tête, {p.pseudo || 'Mathieu'}</Text></Appear>
      <Appear delay={100}><Text style={[st.p, { marginTop: 8 }]}>C'est ce que tes potes verront sur la carte.</Text></Appear>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Pressable onPress={() => { play('shutter'); setOk(true); }} style={k.selfie}>
          {ok ? <Appear from={0}><Avatar src={AV.moi} size={220} ring={C.bleu} /></Appear> : <Ionicons name="camera" size={64} color={C.bleu} />}
        </Pressable>
        <Text style={[st.p, { marginTop: 16 }]}>{ok ? 'Parfait.' : 'Touche pour prendre un selfie'}</Text>
      </View>
      <Btn label={ok ? 'Continuer' : 'Prendre un selfie'} onPress={() => (ok ? nav.go('position', p) : (play('shutter'), setOk(true)))} />
      <Pressable onPress={() => nav.go('position', p)}><Text style={k.later}>Plus tard</Text></Pressable>
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
  const [pop, setPop] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <MapBg zone={240}><View style={k.center}><Me /></View></MapBg>
      <View style={k.sheet}>
        <Etape n={3} />
        <Text style={st.h1}>Active ta position</Text>
        <Text style={[st.p, { marginVertical: 10 }]}>Pour savoir qui est dans la zone. Seulement pendant une partie, jamais visible par des inconnus.</Text>
        <Btn label="Autoriser" icon="location" onPress={() => setPop(true)} />
      </View>
      {pop && <Popup titre="Autoriser « IRL » à utiliser votre position ?" texte="Ta position sert uniquement pendant une partie, pour la zone et les autres joueurs."
        oui="Autoriser pendant l'utilisation" non="Ne pas autoriser" onOui={() => nav.go('notifs', p)} onNon={() => nav.go('notifs', p)} />}
    </View>
  );
}

export function Notifs({ nav }: { nav: Nav; p: any }) {
  const [pop, setPop] = useState(false);
  return (
    <View style={[st.screen, { backgroundColor: C.nuit }]}>
      <Etape n={4} light />
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Appear style={k.notif}>
          <View style={k.notifIc}><Ionicons name="flash" size={22} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={k.notifT}>IRL</Text>
            <Text style={k.notifS}>Léa lance un Manhunt à 300 m. Rejoins avant 18h.</Text>
          </View>
        </Appear>
        <Appear delay={200} style={{ ...k.notif, opacity: 0.8 } as any}>
          <View style={[k.notifIc, { backgroundColor: C.rouge }]}><Ionicons name="eye" size={22} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={k.notifT}>IRL</Text>
            <Text style={k.notifS}>Ta position est révélée dans 10 s.</Text>
          </View>
        </Appear>
        <Text style={k.nT}>Ne rate aucune partie</Text>
        <Text style={k.nS}>On te prévient quand tes potes lancent un jeu près de toi.</Text>
      </View>
      <Btn label="Activer les notifs" kind="blanc" icon="notifications" onPress={() => setPop(true)} />
      <Pressable onPress={() => nav.reset('home')}><Text style={[k.later, { color: '#fff' }]}>Continuer sans</Text></Pressable>
      {pop && <Popup titre="« IRL » souhaite vous envoyer des notifications" texte="Alertes, sons et pastilles."
        oui="Autoriser" non="Refuser" onOui={() => nav.reset('home')} onNon={() => nav.reset('home')} />}
    </View>
  );
}

export function Etape({ n, light }: { n: number; light?: boolean }) {
  return (
    <View style={k.steps}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={[k.step, { backgroundColor: light ? 'rgba(255,255,255,0.3)' : '#E3EAF7' }, i <= n && { backgroundColor: light ? '#fff' : C.bleu }]} />
      ))}
    </View>
  );
}

const k = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  selfie: { width: 230, height: 230, borderRadius: 115, backgroundColor: '#F2F6FF', alignItems: 'center', justifyContent: 'center' },
  later: { textAlign: 'center', color: C.gris, fontWeight: '700', fontSize: 15, paddingVertical: 14 },
  sheet: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#fff', borderTopLeftRadius: 34, borderTopRightRadius: 34, padding: 24, paddingBottom: 44 },
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
