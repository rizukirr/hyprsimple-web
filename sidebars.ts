import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    { type: 'category', label: 'Start', collapsible: false, items: ['overview', 'install', 'update', 'uninstall'] },
    { type: 'category', label: 'Use it', collapsible: false, items: ['keybindings', 'scripts', 'audio', 'network'] },
    { type: 'category', label: 'Make it yours', collapsible: false, items: ['theming', 'plugins'] },
    'faq',
  ],
};

export default sidebars;
