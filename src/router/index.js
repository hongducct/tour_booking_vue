import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BlogView from '@/views/BlogView.vue'
import BlogDetail from '@/views/BlogDetail.vue'
import TourView from '@/views/TourView.vue'
import TourDetail from '@/views/TourDetail.vue'

import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
// import ForgotPasswordView from '@/views/ForgotPasswordView.vue'
// import ResetPasswordView from '@/views/ResetPasswordView.vue'
// import ChangePasswordView from '@/views/ChangePasswordView.vue'
import UserProfileView from '@/views/UserProfileView.vue'
import ProfileView from '@/views/ProfileView.vue'
import BookingsView from '../views/BookingsView.vue'
import WishlistView from '../views/WishlistView.vue'
import SettingsView from '../views/SettingsView.vue'

import DestinationView from '@/views/DestinationView.vue'

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

import ReviewList from '@/views/admin/ReviewList.vue'
import VoucherManager from '@/views/admin/VoucherManager.vue'

import PaymentResult from '@/views/PaymentResult.vue'

// import AuthCallback from '../views/AuthCallback.vue'

import AdminSettings from '@/views/admin/AdminSettings.vue'

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
      },
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
      },
      {
        path: 'tours',
        name: 'AdminTours',
        component: AdminTours,
      },
      {
        path: 'tours/create',
        name: 'AdminTourCreate',
        component: AdminTourCreate,
      },
      {
        path: 'tours/:id/edit',
        name: 'AdminTourEdit',
        component: AdminTourEdit,
        props: true,
      },
      {
        path: 'bookings',
        name: 'AdminBookings',
        component: AdminBookings,
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
      },
      {
        path: 'destinations',
        name: 'AdminDestinations',
        component: AdminDestination,
      },
      {
        path: 'blogs',
        name: 'AdminBlog',
        component: AdminBlog,
      },
      {
        path: 'blogs/:id',
        name: 'AdminBlogDetail',
        component: AdminBlogDetail,
        props: true,
      },
      {
        path: 'blogs/edit/:id',
        name: 'AdminBlogEdit',
        component: AdminBlogEdit,
        props: true,
      },
      {
        path: 'reviews',
        name: 'AdminReviews',
        component: ReviewList,
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: AdminSettings,
      },
      {
        path: 'vouchers',
        name: 'VoucherManager',
        component: VoucherManager,
      },
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/admin/Test.vue'),
      },
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
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: {
        title: 'Register',
      },
    },
    // {
    //   path: '/auth/google/callback',
    //   name: 'AuthCallback',
    //   component: AuthCallback,
    // },
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
      name: 'blogdetail',
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
      path: '/wishlist',
      name: 'wishlist',
      component: WishlistView,
      props: true,
      meta: {
        title: 'Wishlist',
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
  const isLoggedIn = localStorage.getItem('adminToken') // hoặc flag bạn muốn

  if (isAdminRoute && !isLoggedIn) {
    next({ name: 'AdminLogin' })
  } else {
    next()
  }

  // Cập nhật tiêu đề trang
  if (to.meta.title) {
    document.title = to.meta.title
    console.log('Title:', to.meta.title)
  } else {
    document.title = 'Tour Booking'
  }

  // const token = localStorage.getItem('userToken')
  // if (to.meta.requiresAuth && !token) {
  //   next('/login')
  // } else {
  //   next()
  // }
})

export default router
