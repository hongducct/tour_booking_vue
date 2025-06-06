import {
  mdiMenu,
  mdiClockOutline,
  mdiCloud,
  mdiCrop,
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
  mdiGithub,
  mdiReact,
  mdiFacebook,
} from '@mdi/js'

export default [
  // {
  //   icon: mdiMenu,
  //   label: 'Sample menu',
  //   menu: [
  //     {
  //       icon: mdiClockOutline,
  //       label: 'Item One',
  //     },
  //     {
  //       icon: mdiCloud,
  //       label: 'Item Two',
  //     },
  //     {
  //       isDivider: true,
  //     },
  //     {
  //       icon: mdiCrop,
  //       label: 'Item Last',
  //     },
  //   ],
  // },
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'Trang cá nhân',
        to: '/admin/profile',
      },
      {
        icon: mdiCogOutline,
        label: 'Tạo tài khoản Admin',
        to: '/admin/create-account',
      },
      // {
      //   icon: mdiEmail,
      //   label: 'Messages',
      // },
      {
        isDivider: true,
      },
      {
        icon: mdiLogout,
        label: 'Đăng xuất',
        isLogout: true,
      },
    ],
  },
  {
    icon: mdiThemeLightDark,
    label: 'Light/Dark',
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
  {
    icon: mdiGithub,
    label: 'GitHub',
    isDesktopNoLabel: true,
    href: 'https://github.com/hongducct/tour_booking_vue',
    target: '_blank',
  },
  {
    icon: mdiFacebook,
    label: 'Facebook',
    isDesktopNoLabel: true,
    href: 'https://facebook.com/hongducct23',
    target: '_blank',
  },
  {
    icon: mdiLogout,
    label: 'Log out',
    isDesktopNoLabel: true,
    isLogout: true,
  },
]
