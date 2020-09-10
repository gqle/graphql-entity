module.exports = {
  title: 'GraphQL Entity',
  tagline: 'A framework for writing GraphQL servers.',
  url: 'https://www.graphql-entity.dev',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.png',
  organizationName: 'gqle',
  projectName: 'graphql-entity',
  themeConfig: {
    navbar: {
      title: 'GraphQL Entity',
      logo: {
        alt: 'GraphQL Entity',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs/getting-started',
          label: 'Getting Started',
          position: 'right',
        },
        {
          to: 'docs/reference/api',
          activeBasePath: 'docs/reference',
          label: 'API Reference',
          position: 'right',
        },
        {
          href: 'https://github.com/gqle/graphql-entity',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'GraphQL Entity',
          items: [
            {
              label: 'Introduction',
              to: 'docs/',
            },
          ],
        },
        {
          title: 'API Reference',
          items: [
            {
              label: 'Server',
              to: 'docs/reference/api/',
            },
            {
              label: 'Configuration',
              to: 'docs/reference/configuration/',
            },
            {
              label: 'CLI',
              to: 'docs/reference/cli/',
            },
          ],
        },
        // {
        //   title: 'Community',
        //   items: [
        //     {
        //       label: 'Stack Overflow',
        //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
        //     },
        //     {
        //       label: 'Discord',
        //       href: 'https://discordapp.com/invite/docusaurus',
        //     },
        //     {
        //       label: 'Twitter',
        //       href: 'https://twitter.com/docusaurus',
        //     },
        //   ],
        // },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/gqle/graphql-entity',
            },
          ],
        },
      ],
      // copyright: `Copyright © ${new Date().getFullYear()} GraphQL Entity. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/gqle/graphql-entity/edit/master/www/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/gqle/graphql-entity/edit/master/www/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
}
