import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ThemeButton } from '@site/src/components/ThemePicker';

// The hyprsimple theme picker takes the place of the light and dark switch, since every theme already knows whether it is light or dark.
export default function ColorModeToggle(): React.ReactNode {
  return <BrowserOnly>{() => <ThemeButton />}</BrowserOnly>;
}
