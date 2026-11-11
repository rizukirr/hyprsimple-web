import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { ThemeButton } from '@site/src/components/ThemePicker';

// The light and dark switch is replaced by the hyprsimple theme picker:
// every theme already knows whether it is light or dark.
export default function ColorModeToggle(): React.ReactNode {
  return <BrowserOnly>{() => <ThemeButton />}</BrowserOnly>;
}
