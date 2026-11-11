import React, { type ReactNode } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { PickerDialog } from '@site/src/components/ThemePicker';

export default function Root({ children }: { children: ReactNode }): ReactNode {
  return (
    <>
      {children}
      <BrowserOnly>{() => <PickerDialog />}</BrowserOnly>
    </>
  );
}
