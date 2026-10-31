import React from 'react';
import { Image } from 'react-native';
import { Nav } from '../nav';
import { IMG } from '../theme';
import { useCountdown } from '../ui';
import { BasPhoto, Cible, TILE, usePhoto } from '../jeuui';

// 3 manches ; le même visuel de lieu tant que les deux autres photos ne sont pas générées.
export function Geo({ nav, p }: { nav: Nav; p: any }) {
  const manche = Number(p.manche) || 1;
  const pts = Number(p.pts) || 0;
  const t = useCountdown(4 * 60 + 15);
  const { etat, flash, shoot } = usePhoto('tada');
  const suite = () => (manche < 3
    ? nav.replace('geo', { ...p, manche: manche + 1, pts: pts + 3 })
    : nav.replace('fin', { ...p, issue: 'geo', pts: pts + 3 }));
  return (
    <Cible t={t} flash={flash}
      tile={<Image source={IMG.lieu} style={{ width: TILE, height: TILE, borderRadius: 18 }} resizeMode="cover" />}
      bas={<BasPhoto etat={etat} shoot={shoot} ok="Lieu trouvé +3" label={manche < 3 ? `Manche ${manche + 1}/3` : 'Voir le classement'} suite={suite} />} />
  );
}
