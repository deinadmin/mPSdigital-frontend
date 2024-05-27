import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/groups',
    name: 'groups',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // this generates a separate chunk (groups.[hash].js) for this route
    component: () => import(/* webpackChunkName: "groups" */ '../views/GroupsView.vue')
  },
  {
    path: '/requests',
    name: 'requests',
    component: () => import('../views/RequestsView.vue')
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('../views/UsersView.vue')
  },
  {
    path: '/pinwall',
    name: 'pinwall',
    component: () => import('../views/PinWallView.vue')
  },
  {
    path: '/users/:username',
    name: 'user',
    component: () => import('../views/UserView.vue')
  },
  {
    path: '/my-group',
    name: 'my-group',
    component: () => import('../views/MyGroupView.vue')
  },
  {
    path: '/group/:id',
    name: 'group',
    component: () => import('../views/TeacherGroupView.vue')
  },
  {
    path: '/my-requests',
    name: 'my-requests',
    component: () => import('../views/MyRequestsView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
