import React, { type ReactNode } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Hypri, the hyprsimple mascot, beside a message for a list that came up empty.
// `empty` is Hypri on her own. `empty-theme` adds the "No theme matches" panel drawn into the picture.
export function EmptyState({ children, art = 'empty' }: { children: ReactNode; art?: 'empty' | 'empty-theme' }) {
  const size = art === 'empty' ? { width: 572, height: 666 } : { width: 1024, height: 683 };
  return (
    <div className={`hs-empty hs-empty--${art}`}>
      <div className="hs-empty__art" data-slot={`hypri-${art}`} data-kind="product">
        <img src={useBaseUrl(`/img/mascot/${art}.webp`)} alt="" {...size} loading="lazy" decoding="async" />
      </div>
      <div className="hs-empty__text">{children}</div>
    </div>
  );
}
