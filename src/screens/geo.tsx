import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Nav } from '../nav';
import { C, IMG } from '../theme';
import { Appear, BigTimer, Btn, Glass, MapBg, Me, useCountdown } from '../ui';
import { play } from '../sound';

export function Geo({ nav, p }: { nav: Nav; p: any }) {
  const t = useCountdown(4 * 60 + 50);
  const manche = p.manche || 1;
  const [ok, setOk] = useState(false);
  const trouve = () => { play('tada'); setOk(true); };
  const suite = () => manche < 3 ? nav.replace('geo', { ...p, manche: manche + 1 }) : nav.replace('fin', { ...p, issue: 'geo' });
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Image source={IMG.lieu} style={g.photo} resizeMode="cover" />
      <View style={g.top}>
        <View style={g.manche}><Text style={g.mancheT}>Manche {manche}/3</Text></View>
        <BigTimer s={t} color="#fff" />
      </View>
      <View style={g.map}>
        <MapBg zone={150}><View style={g.center}><Me /></View></MapBg>
      </View>
      <View style={g.bottom}>
        {ok ? (
          <Appear>
            <Glass style={{ alignItems: 'center', marginBottom: 12 }}>
              <Text style={g.okT}>Trouvé !</Text>
              <Text style={g.okS}>Premier sur place · +3 points</Text>
            </Glass>
            <Btn label={manche < 3 ? 'Manche suivante' : 'Voir le classement'} onPress={suite} />
          </Appear>
        ) : (
          <Btn label="Je suis sur place" icon="location" onPress={trouve} />
        )}
      </View>
    </View>
  );
}

const g = StyleSheet.create({
  photo: { position: 'absolute', top: 0, left: 0, right: 0, height: '58%' },
  top: { position: 'absolute', top: 56, left: 20, right: 20, alignItems: 'center' },
  manche: { backgroundColor: 'rgba(0,0,0,0.45)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  mancheT: { color: '#fff', fontWeight: '800' },
  map: { position: 'absolute', top: '56%', left: 0, right: 0, bottom: 0, borderTopLeftRadius: 32, borderTopRightRadius: 32, overflow: 'hidden' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bottom: { position: 'absolute', left: 20, right: 20, bottom: 40 },
  okT: { fontSize: 40, fontWeight: '900', color: C.bleu },
  okS: { fontSize: 16, fontWeight: '700', color: C.texte },
});
