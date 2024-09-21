import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Asor framework",
  description: "Documentation for the Asor JavaScript framework",
  lang: 'en-US',
  
  locales: {
    root: {
      label: 'English',
      lang: 'en'
    },
    es: {
      label: 'Spanish',
      lang: 'es',
      link: '/es/guide'
    }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/introduction' }
    ],

    sidebar: [
      {
        text: 'Introduction',
        collapsible: true,
        collapsed: true,
        items: [
          { text: 'What is Asor?', link: '/guide/introduction' },
          { text: 'Concepts', link: '/guide/core-concepts' },
          { text: 'Initiating', link: '/guide/getting-started' },
        ]
      },

      {
        text: 'Directives',
        collapsible: true,
        collapsed: false,
        items: [
          { text: 'a-bind', link: '/directives/a-bind' },
          { text: 'a-confirm', link: '/directives/a-confirm' },
          { text: 'a-def', link: '/directives/a-def' },
          { text: 'a-for', link: '/directives/a-for' },
          { text: 'a-if', link: '/directives/a-if' },
          { text: 'a-navigate', link: '/directives/a-navigate' },
          { text: 'a-on', link: '/directives/a-on' },
          { text: 'a-ref', link: '/directives/a-ref' },
          { text: 'a-show', link: '/directives/a-show' },
          { text: 'a-effect', link: '/directives/a-effect' },
          { text: 'a-init', link: '/directives/a-init' },
          { text: 'a-loading', link: '/directives/a-loading' },
          { text: 'a-xhr', link: '/directives/a-xhr' },
          { text: 'a-offline', link: '/directives/a-offline' },
          { text: 'a-stream', link: '/directives/a-stream' },
          { text: 'a-swap', link: '/directives/a-swap' },
          { text: 'a-target', link: '/directives/a-target' },
          { text: 'a-transition', link: '/directives/a-transition' },
        ]
      },
      
      {
        text: 'Methods',
        collapsible: true,
        collapsed: true,
        items: [
          { text: '$dispatch', link: '/methods/$dispatch' },
          { text: '$event', link: '/methods/$event' },
          { text: '$el', link: '/methods/$el' },
          { text: '$refs', link: '/methods/$refs' },
          { text: '$persist', link: '/methods/$persist' },
          { text: '$root', link: '/methods/$root' },
        ]
      }

    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/asorjs/asor' },
      { icon: 'x', link: 'https://x.com/@ros527343866592' }
    ],

    footer: {
      message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2024-present <a href="https://github.com/juancristobalgd1">Juan Cristobal</a>'
    }
  },


})
