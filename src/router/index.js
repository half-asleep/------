import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

// 定义路由器的所有路由
const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/home',
    component: () => import('@/views/home/HomeView.vue'),
    children: [
      {
        path: '',
        redirect: '/home/searchbook'
      },
      {     // 查询图书
        path: 'searchbook',
        component: () => import('@/views/home/SearchBookView.vue')
      },
      {     // 个人信息简介
        path: 'introduce',
        component: () => import('@/views/home/IntroduceView.vue')
      },
      {    // 评论记录
        path: 'comment',
        component: () => import('@/views/home/CommentView.vue')
      },
      {    // 读者预约记录
        path: 'readerreserve',
        component: () => import('@/views/home/ReaderReserveView.vue')
      },
      {    // 读者借阅记录
        path: 'readerborrow',
        component: () => import('@/views/home/ReaderBorrowView.vue')
      },
      // 管理员
      {
        //    人员管理
        path: 'person',
        component: () => import('@/views/home/AdminPersonView.vue'),
      },
      {
        //    管理员管理借阅记录
        path: 'adminborrow',
        component: () => import('@/views/home/AdminBorrowView.vue'),
      },
      {
        //    管理员管理预约记录
        path: 'adminreserve',
        component: () => import('@/views/home/AdminReserveView.vue'),
      }, {
        //    管理员添加图书
        path: 'adminaddbook',
        component: () => import('@/views/home/AdminAddBookView.vue'),
      },
    ]
  }
]

// 创建路由器实例
const router = createRouter({
  // 定义路由使用的模式
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from) => {
  var loginMessage = localStorage.getItem('loginMessage')
  if (to.path !== '/') {
    if (loginMessage === '管理员已登录') {
      console.log("管理员")
      switch (to.path) {
        case '/home/readerborrow':
        case '/home/readerreserve':
          return '/'
      }
    }
    else if (loginMessage === '读者已登录') {
      console.log("读者")
      switch (to.path) {
        case '/home/adminaddbook':
        case '/home/person':
        case '/home/adminborrow':
        case '/home/adminreserve':
          return '/'
      }
    }
    else return '/'
  }
}
)

export default router
