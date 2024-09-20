import { defineConfig } from "vitepress";
import VueMacros from 'unplugin-vue-macros/vite'

// https://vitepress.vuejs.org/config/app-configs

export default defineConfig({
  title: "Asor Documentation",
  description: "JavaScript framework for dynamic web applications",
  lang: "es-ES",
  vite: {
    plugins: [
      VueMacros({
        defineOptions: true,
      }),
    ],
  },
  lastUpdated: true,
  themeConfig: {
    logo: "/logo.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Guide", link: "/guide/introduction" },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "What is Asor", link: "/guide/introduction" },
          { text: "Starting", link: "/guide/getting-started" },
          { text: "Key Concepts", link: "/guide/core-concepts" },
        ],
      },
      {
        text: "Directives",
        items: [
          { text: "a-ref", link: "/directives/a-ref" },
          { text: "a-def", link: "/directives/a-def" },
          { text: "a-bind", link: "/directives/a-bind" },
          { text: "a-init", link: "/directives/a-init" },
          { text: "a-effect", link: "/directives/a-effect" },
          { text: "a-confirm", link: "/directives/a-confirm" },
          { text: "a-xhr", link: "/directives/a-xhr" },
          { text: "a-on", link: "/directives/a-on" },
          { text: "a-for", link: "/directives/a-for" },
          { text: "a-if", link: "/directives/a-if" },
          { text: "a-show", link: "/directives/a-show" },
          { text: "a-navigate", link: "/directives/a-navigate" },
          { text: "a-transition", link: "/directives/a-transition" },
          { text: "a-loading", link: "/directives/a-loading" },
          { text: "a-offline", link: "/directives/a-offline" },
          { text: "a-stream", link: "/directives/a-stream" },
        ],  
      },
      {
        text: "Methods",
        items: [
          { text: "$el", link: "/methods/$el" },
          { text: "$root", link: "/methods/$root" },
          { text: "$event", link: "/methods/$event" },
          { text: "$refs", link: "/methods/$refs" },
          { text: "$dispatch", link: "/methods/$dispatch" },
          { text: "$persist", link: "/methods/$persist" },
        ],  
      },
    ],
    footer: {
      message: "Released under the MIT License.",
      copyright: "Copyright © 2024-presente Asor Developers",
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/Asorjs/asor" },
      { icon: "twitter", link: "https://x.com/ros527343866592" },
    ],
    search: {
      provider: "local",
    },
    darkModeSwitchLabel: 'Dark / Light',
    editLink: {
      pattern: "https://github.com/Asorjs/doc/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
  },
});