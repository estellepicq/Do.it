import Vue from 'vue'
import Router from 'vue-router'
import Todolist from '@/components/Todolist'
import Createtodolist from '@/components/CreateTodolist'
import Welcome from '@/components/Welcome'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Welcome',
      component: Welcome
    },
    {
      path: '/create-todolist',
      name: 'Createtodolist',
      component: Createtodolist
    },
    {
      path: '/todolist/:id',
      name: 'Todolist',
      component: Todolist
    },
    { path: '*', redirect: '/' }
  ]
})
