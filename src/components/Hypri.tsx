import React, { type ReactNode } from 'react';
import useBaseUrl from '@docusaurus/useBaseUrl';

// Hypri, the hyprsimple mascot, beside a message for a list that came up empty.
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="hs-empty">
      <div className="hs-empty__art" data-slot="hypri-empty" data-kind="product">
        <img src={useBaseUrl('/img/mascot/empty.webp')} alt="" width={960} height={640} loading="lazy" decoding="async" />
      </div>
      <div className="hs-empty__text">{children}</div>
    </div>
  );
}
