import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://liyangdev.cn/',
  lang: 'zh-CN',
  title: '励扬程序的小站',
  subtitle: 'All at sea.',
  author: {
    name: '励扬程序',
    avatar: '/images/avatar.jpg',
    email: '392013660@qq.com',
    status: {
      emoji: '😊',
    }
  },
  description: '希望能成为一个有趣的人',
  languages: ['zh-CN'],
  social: [
    {
      name: 'RSS',
      link: '/atom.xml',
      icon: 'i-ri-rss-line',
      color: 'orange',
    },
    // {
    //   name: 'QQ 群',
    //   link: '',
    //   icon: 'i-ri-qq-line',
    //   color: '#12B7F5',
    // },
    // {
    //   name: 'GitHub',
    //   link: '',
    //   icon: 'i-ri-github-line',
    //   color: '#6e5494',
    // },
    // {
    //   name: '微博',
    //   link: '',
    //   icon: 'i-ri-weibo-line',
    //   color: '#E6162D',
    // },
    // {
    //   name: '豆瓣',
    //   link: '',
    //   icon: 'i-ri-douban-line',
    //   color: '#007722',
    // },
    // {
    //   name: '网易云音乐',
    //   link: '',
    //   icon: 'i-ri-netease-cloud-music-line',
    //   color: '#C20C0C',
    // },
    // {
    //   name: '知乎',
    //   link: '',
    //   icon: 'i-ri-zhihu-line',
    //   color: '#0084FF',
    // },
    // {
    //   name: '哔哩哔哩',
    //   link: '',
    //   icon: 'i-ri-bilibili-line',
    //   color: '#FF8EB3',
    // },
    // {
    //   name: '微信公众号',
    //   link: '',
    //   icon: 'i-ri-wechat-2-line',
    //   color: '#1AAD19',
    // },
    // {
    //   name: 'Twitter',
    //   link: '',
    //   icon: 'i-ri-twitter-x-fill',
    //   color: 'black',
    // },
    // {
    //   name: 'Telegram Channel',
    //   link: '',
    //   icon: 'i-ri-telegram-line',
    //   color: '#0088CC',
    // },
    {
      name: 'E-Mail',
      link: 'mailto:392013660@qq.com',
      icon: 'i-ri-mail-line',
      color: '#8E71C1',
    },
    // {
    //   name: 'Travelling',
    //   link: 'https://www.travellings.cn/go.html',
    //   icon: 'i-ri-train-line',
    //   color: 'var(--va-c-text)',
    // },
  ],

  search: {
    enable: false,
  },

  sponsor: {
    enable: true,
    title: '我很可爱，请给我钱！',
    description: '感谢各位的支持，您的支持将鼓励我继续创作！',
    methods: [
      {
        name: '支付宝',
        url: '/images/alipay-qrcode.png',
        color: '#00A3EE',
        icon: 'i-ri-alipay-line',
      },
      // {
      //   name: 'QQ 支付',
      //   url: '',
      //   color: '#12B7F5',
      //   icon: 'i-ri-qq-line',
      // },
      {
        name: '微信支付',
        url: '/images/wechatpay-qrcode.png',
        color: '#2DC100',
        icon: 'i-ri-wechat-pay-line',
      },
    ],
  },
})
