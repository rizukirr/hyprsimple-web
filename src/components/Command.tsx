import React, { useState } from 'react';
import clsx from 'clsx';

// A shell command as a cut chip with a working copy key.
export default function Command({ lines, label, className }: { lines: string[]; label: string; className?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setState('copied');
    } catch {
      setState('failed');
    }
    window.setTimeout(() => setState('idle'), 1800);
  };
  return (
    <div className={clsx('hs-command', className)}>
      <pre aria-label={label}>
        {lines.map((l) => (
          <code key={l}>
            <span className="hs-command__prompt" aria-hidden="true">$ </span>
            {l}
          </code>
        ))}
      </pre>
      <button type="button" className="hs-key hs-key--small" onClick={copy}>
        {state === 'copied' ? 'Copied' : state === 'failed' ? 'Select to copy' : 'Copy'}
      </button>
    </div>
  );
}
