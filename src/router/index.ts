import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'OpenList美化配置生成器'
      }
    }
  ]
})

// 路由守卫 - 设置页面标题
router.beforeEach((to) => {
  const title = to.meta?.title as string
  if (title) {
    document.title = title
  }
})

export default router