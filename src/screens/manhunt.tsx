import React, { useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { Nav } from '../nav';
import { AV } from '../theme';
import { Btn, useCountdown } from '../ui';
import { BasPhoto, Cible, TILE, usePhoto } from '../jeuui';
import { play } from '../sound';

export function Manhunt({ nav, p }: { nav: Nav; p: any }) {
  return p.role === 'fuyard' ? <Fuyard nav={nav} p={p} /> : <Chasseur nav={nav} p={p} />;
}

const rond = { width: TILE, height: TILE, borderRadius: TILE / 2, borderWidth: 4, borderColor: '#fff' } as const;

function Fuyard({ nav, p }: { nav: Nav; p: any }) {
  const t0 = useRef(Date.now()).current;
  const t = useCountdown(14 * 60 + 32);
  const trouve = () => { play('impact'); nav.replace('fin', { ...p, issue: 'trouve', temps: Math.floor((Date.now() - t0) / 1000) }); };
  return (
    <Cible t={t} viseur={false} legende="2 chasseurs"
      tile={<View style={m.duo}>{[AV.lea, AV.sam].map((a, i) => <Image key={i} source={a} style={[m.mini, i > 0 && { marginLeft: -22 }]} />)}</View>}
      bas={<Btn label="J'ai été trouvé" kind="blanc" onPress={trouve} style={{ alignSelf: 'stretch' }} />} />
  );
}

function Chasseur({ nav, p }: { nav: Nav; p: any }) {
  const t0 = useRef(Date.now()).current;
  const t = useCountdown(7 * 60 + 42);
  const { etat, flash, shoot } = usePhoto();
  const fin = () => nav.replace('fin', { ...p, issue: 'capture', temps: Math.floor((Date.now() - t0) / 1000) });
  return (
    <Cible t={t} flash={flash} legende="à 84 m"
      tile={<Image source={AV.hugo} style={rond} />}
      bas={<BasPhoto etat={etat} shoot={shoot} ok="Hugo capturé" label="Voir le résultat" suite={fin} />} />
  );
}

const m = StyleSheet.create({
  duo: { flexDirection: 'row', height: TILE, alignItems: 'center', paddingHorizontal: 11 },
  mini: { width: 66, height: 66, borderRadius: 33, borderWidth: 3, borderColor: '#fff' },
});
