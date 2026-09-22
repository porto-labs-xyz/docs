import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Porto',
  tagline: 'Network-owned infrastructure for music distribution',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.portolabs.xyz',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'porto-labs-xyz',
  projectName: 'docs',
  deploymentBranch: 'gh-pages',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  markdown: {mermaid: true},
  themes: ['@docusaurus/theme-mermaid'],
  plugins: [
    ['@docusaurus/plugin-content-docs', {
      id: 'london',
      path: 'london-0.1.0',
      routeBasePath: 'london-0.1.0',
      sidebarPath: './sidebars.london.ts',
      editUrl: 'https://github.com/porto-labs-xyz/docs/tree/main/',
    }],
  ],

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: ({docPath}) => {
            if (docPath.startsWith('pips/')) {
              return `https://github.com/porto-labs-xyz/PIPs/tree/main/${docPath.replace('pips/', '').replace('index.md', 'README.md')}`;
            }
            if (docPath.startsWith('whitepaper')) {
              return 'https://github.com/porto-labs-xyz/whitepaper/tree/main/porto-whitepaper.md';
            }
            return `https://github.com/porto-labs-xyz/docs/tree/main/docs/${docPath}`;
          },
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/logo.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Porto',
      logo: {
        alt: 'Porto Logo',
        src: 'img/logo.svg',
      },
      items: [
        {type: 'doc', docsPluginId: 'london', docId: 'index', label: 'London 0.1.0 (Draft)', position: 'left'},
        {
          type: 'doc',
          docId: 'whitepaper',
          position: 'left',
          label: 'Whitepaper',
        },
        {
          type: 'doc',
          docId: 'pips/index',
          position: 'left',
          label: 'PIPs',
        },
        {
          href: 'https://github.com/porto-labs-xyz',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {label: 'Whitepaper', to: '/whitepaper'},
            {label: 'PIPs', to: '/pips'},
          ],
        },
        {
          title: 'Repos',
          items: [
            {label: 'PIPs', href: 'https://github.com/porto-labs-xyz/PIPs'},
            {label: 'Whitepaper', href: 'https://github.com/porto-labs-xyz/whitepaper'},
            {label: 'porto-core', href: 'https://github.com/porto-labs-xyz/porto-core'},
          ],
        },
        {
          title: 'More',
          items: [
            {label: 'GitHub Org', href: 'https://github.com/porto-labs-xyz'},
          ],
        },
      ],
    copyright: `Copyright © ${new Date().getFullYear()} Entropy Tech Ltd. Documentation licensed under CC BY 4.0.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
