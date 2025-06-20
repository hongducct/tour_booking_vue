import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '@/views/BlogView.vue'
import BlogDetail from '@/views/BlogDetail.vue'
import TourView from '@/views/TourView.vue'
import TourDetail from '@/views/TourDetail.vue'

import LoginView from '@/views/LoginView.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import RegisterView from '@/views/RegisterView.vue'
import ProfileView from '@/views//user/ProfileView.vue'
import BookingsView from '@/views/user/BookingsView.vue'
import BookingDetail from '@/views/user/BookingDetail.vue'
import WishlistView from '../views/user/WishlistView.vue'
import WishlistBlog from '@/views/user/WishlistBlog.vue'
import SettingsView from '../views/SettingsView.vue'

import DestinationView from '@/views/DestinationView.vue'

import PaymentResult from '@/views/PaymentResult.vue'

// route admin
import AdminLogin from '@/views/admin/AdminLogin.vue'

import AdminDashboard from '@/views/admin/AdminDashboard.vue'
import AdminTours from '@/views/admin/TourList.vue'
import AdminTourCreate from '@/views/admin/TourCreate.vue'
import AdminTourEdit from '@/views/admin/TourEdit.vue'
import AdminBookings from '@/views/admin/BookingList.vue'
import AdminUsers from '@/views/admin/UserList.vue'
import AdminDestination from '@/views/admin/DestinationList.vue'

import AdminBlog from '@/views/admin/BlogList.vue'
import AdminBlogDetail from '@/views/admin/BlogDetail.vue'
import AdminBlogEdit from '@/views/admin/BlogEdit.vue'
import AdminBlogCreate from '@/views/admin/BlogCreate.vue'
import ReviewList from '@/views/admin/ReviewList.vue'
import VoucherManager from '@/views/admin/VoucherManager.vue'
import AdminSettings from '@/views/admin/AdminSettings.vue'
import AdminProfile from '@/views/admin/AdminProfile.vue'
import CreateAccountAdmin from '@/views/admin/CreateAccountAdmin.vue'
import AdminChat from '@/views/admin/AdminChat.vue'

// import AuthCallback from '../views/AuthCallback.vue'

// định nghĩa các route cho admin
const adminRoutes = [
  {
    path: '/admin',
    redirect: '/admin/dashboard',
    children: [
      {
        path: 'login',
        name: 'AdminLogin',
        component: AdminLogin,
        meta: { title: 'Admin Login' },
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { title: 'Admin Dashboard' },
      },
      {
        path: 'tours',
        name: 'AdminTours',
        component: AdminTours,
        meta: { title: 'Manage Tours' },
      },
      {
        path: 'tours/create',
        name: 'AdminTourCreate',
        component: AdminTourCreate,
        meta: { title: 'Create Tour' },
      },
      {
        path: 'tours/:id/edit',
        name: 'AdminTourEdit',
        component: AdminTourEdit,
        props: true,
        meta: { title: 'Edit Tour' },
      },
      {
        path: 'bookings',
        name: 'AdminBookings',
        component: AdminBookings,
        meta: { title: 'Manage Bookings' },
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: { title: 'Manage Users' },
      },
      {
        path: 'destinations',
        name: 'AdminDestinations',
        component: AdminDestination,
        meta: { title: 'Manage Destinations' },
      },
      {
        path: 'blogs',
        name: 'AdminBlog',
        component: AdminBlog,
        meta: { title: 'Manage Blogs' },
      },
      {
        path: 'blogs/:id',
        name: 'AdminBlogDetail',
        component: AdminBlogDetail,
        props: true,
        meta: { title: 'Blog Detail' },
      },
      {
        path: 'blogs/edit/:id',
        name: 'AdminBlogEdit',
        component: AdminBlogEdit,
        props: true,
        meta: { title: 'Edit Blog' },
      },
      {
        path: 'blogs/create',
        name: 'AdminBlogCreate',
        component: AdminBlogCreate,
        props: true,
        meta: { title: 'Create Blog' },
      },
      {
        path: 'reviews',
        name: 'AdminReviews',
        component: ReviewList,
        meta: { title: 'Manage Reviews' },
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: AdminSettings,
        meta: { title: 'Admin Settings' },
      },
      {
        path: 'vouchers',
        name: 'VoucherManager',
        component: VoucherManager,
        meta: { title: 'Voucher Manager' },
      },
      {
        path: 'profile',
        name: 'AdminProfile',
        component: AdminProfile,
        meta: { title: 'Admin Profile' },
      },
      {
        path: 'create-account',
        name: 'CreateAccountAdmin',
        component: CreateAccountAdmin,
        meta: { title: 'Create Account Admin' },
      },
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/admin/Test.vue'),
        meta: { title: 'Admin Test' },
      },
      {
        path: 'chat',
        name: 'AdminChat',
        component: AdminChat,
        meta: { title: 'Admin Chat' },
      }
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login',
      },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPassword,
      meta: {
        title: 'Forgot Password',
      },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        title: 'Register',
      },
    },
    {
      path: '/blog',
      name: 'blog',
      component: BlogView,
      meta: {
        title: 'Blog',
      },
    },
    {
      path: '/blog/:id',
      name: 'BlogDetail',
      component: BlogDetail,
      props: true,
      meta: {
        title: 'Blog Detail',
      },
    },
    {
      path: '/tour',
      name: 'tour',
      component: TourView,
      meta: {
        title: 'Tour',
      },
    },
    {
      path: '/tour/:id',
      name: 'tour-detail',
      component: TourDetail,
      props: true,
      meta: {
        title: 'Tour Detail',
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      props: true,
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/bookings',
      name: 'bookings',
      component: BookingsView,
      props: true,
      meta: {
        title: 'Bookings',
        requiresAuth: true,
      },
    },
    {
      path: '/booking/:id',
      name: 'booking-detail',
      component: BookingDetail,
      props: true,
      meta: {
        title: 'Booking Detail',
        requiresAuth: true,
      },
    },
    {
      path: '/wishlist/tours',
      name: 'wishlistTours',
      component: WishlistView,
      props: true,
      meta: {
        title: 'Wishlist',
        requiresAuth: true,
      },
    },
    {
      path: '/wishlist/blogs',
      name: 'wishlistBlogs',
      component: WishlistBlog,
      props: true,
      meta: {
        title: 'Wishlist Blogs',
        requiresAuth: true,
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      props: true,
      meta: {
        title: 'Settings',
        requiresAuth: true,
      },
    },
    {
      path: '/destination',
      name: 'destination',
      component: DestinationView,
      meta: {
        title: 'Destination',
      },
    },
    // chi tiết tour theo địa điểm với url là text thay vì id
    {
      path: '/destination/:id',
      name: 'destination-detail',
      component: () => import('@/views/DestinationDetail.vue'),
      props: true,
      meta: {
        title: 'Destination Detail',
      },
    },
    {
      path: '/payment-result',
      name: 'PaymentResult',
      component: PaymentResult,
      props: (route) => ({ status: route.query.status, bookingId: route.query.booking_id }),
    },
    {
      path: '/emTien',
      name: 'emTien',
      component: () => import('@/views/emTien.vue'),
      props: true,
      meta: {
        title: 'Em Tiên xinh đẹp',
      },
    },
    ...adminRoutes,
  ],
})

router.beforeEach((to, from, next) => {
  const isAdminRoute = to.path.startsWith('/admin') && to.name !== 'AdminLogin'
  const isAdminLoggedIn = localStorage.getItem('adminToken')
  const isUserLoggedIn = localStorage.getItem('userToken')
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Chặn admin chưa đăng nhập
  if (isAdminRoute && !isAdminLoggedIn) {
    return next({ name: 'AdminLogin' })
  }

  // Chặn người dùng chưa đăng nhập
  if (requiresAuth && !isUserLoggedIn) {
    return next({ name: 'login' })
  }

  // Cập nhật tiêu đề
  if (to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'Travel Booking'
  }

  // Cho phép chuyển route
  next()
})

export default router
