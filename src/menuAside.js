import {
  mdiViewDashboard,
  mdiMapMarkerMultiple,
  mdiClipboardTextClock,
  mdiAccountGroupOutline,
  mdiAirplane,
  mdiBookOpenPageVariant,
  mdiCommentTextMultiple,
  mdiTicketPercent,
  mdiAccount,
  mdiCog,
} from '@mdi/js'

export default [
  {
    to: '/admin/dashboard',
    icon: mdiViewDashboard,
    label: 'Dashboard',
  },
  {
    to: '/admin/tours',
    icon: mdiAirplane,
    label: 'Tours',
  },
  {
    to: '/admin/bookings',
    icon: mdiClipboardTextClock,
    label: 'Bookings',
  },
  {
    to: '/admin/users',
    icon: mdiAccountGroupOutline,
    label: 'Người dùng',
  },
  {
    to: '/admin/destinations',
    icon: mdiMapMarkerMultiple,
    label: 'Địa điểm',
  },
  {
    to: '/admin/blogs',
    icon: mdiBookOpenPageVariant,
    label: 'Bài viết',
  },
  {
    to: '/admin/reviews',
    icon: mdiCommentTextMultiple,
    label: 'Đánh giá',
  },
  {
    to: '/admin/vouchers',
    icon: mdiTicketPercent ,
    label: 'Vouchers',
  },
  {
    to: '/admin/profile',
    icon: mdiAccount,
    label: 'Hồ sơ',
  },
  {
    to: '/admin/settings',
    icon: mdiCog,
    label: 'Cài đặt',
  },
  {
    to: '/admin/test',
    icon: mdiCog,
    label: 'Test',
  },
]
