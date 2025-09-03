import type { UserThemeConfig } from 'valaxy-theme-yun'
import { defineValaxyConfig } from 'valaxy'

// add icons what you will need
const safelist = [
  'i-ri-home-line',
]

/**
 * User Config
 */
export default defineValaxyConfig<UserThemeConfig>({
  // site config see site.config.ts

  theme: 'yun',

  themeConfig: {
    banner: {
      enable: true,
      title: '隐栈',
    },

    pages: [
      {
        name: '项目橱窗',
        url: '/projects/',
        icon: 'i-ri-code-s-slash-line',
        color: 'dodgerblue',
      },
      // {
      //   name: '我的小伙伴们',
      //   url: '/links/',
      //   icon: 'i-ri-genderless-line',
      //   color: 'dodgerblue',
      // },
      // {
      //   name: '喜欢的女孩子',
      //   url: '/girls/',
      //   icon: 'i-ri-women-line',
      //   color: 'hotpink',
      // },
    ],

    footer: {
      since: 2024,
      icon: {
        enable: false
      },
      powered: false,
      beian: {
        enable: true,
        icp: '渝ICP备2025051403号',
      },
    },
  },

  unocss: { safelist },
})
