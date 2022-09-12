import { getToken } from '@/utils/token'
import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '@/views/Login'
// import Layout from '@/views/Layout'
// import Home from '@/views/Home'
// import User from '@/views/User/index'
// import Search from '@/views/Search/index'
// import SearchResult from '@/views/Search/SearchResult'
// import ArticleDetail from '@/views/ArticleDetail'
// import UserEdit from '@/views/User/UserEdit'
// import Chat from '@/views/Chat'

Vue.use(VueRouter)

// 路由懒加载
const routes = [
  {
    path: '/',
    redirect: '/layout'
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "Login" */ '@/views/Login')
  },
  {
    path: '/layout',
    component: () => import(/* webpackChunkName: "Layout" */ '@/views/Layout'),
    redirect: '/layout/home',
    children: [
      {
        path: 'home',
        component: () => import(/* webpackChunkName: "Home" */ '@/views/Home'),
        meta: {
          scrollT: 0 // 保存首页离开时,滚动条的位置
        }
      },
      {
        path: 'user',
        component: () => import(/* webpackChunkName: "User" */ '@/views/User')
      }
    ]
  },
  {
    path: '/search',
    component: () => import(/* webpackChunkName: "Search" */ '@/views/Search')
  },
  {
    path: '/search_result/:keywords',
    component: () => import(/* webpackChunkName: "SearchResult" */ '@/views/Search/SearchResult')
  },
  {
    path: '/article_detail/:artId?',
    component: () => import(/* webpackChunkName: "ArticleDetail" */ '@/views/ArticleDetail')
  },
  {
    path: '/user_edit',
    component: () => import(/* webpackChunkName: "UserEdit" */ '@/views/User/UserEdit')
  },
  {
    path: '/chat',
    component: () => import(/* webpackChunkName: "Chat" */ '@/views/Chat')
  }
]

const router = new VueRouter({
  routes
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  if (getToken()?.length > 0 && to.path === '/login') {
    // 有token证明已经登录了就不能爱回到登录页面
    next(false)
  } else {
    next()
  }
})

export default router
