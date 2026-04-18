 import { createRouter, createWebHistory } from 'vue-router'
 import { useAuthStore } from '../store/auth.js'
 
import HomeView        from '../views/HomeView.vue'
import AuthView        from '../views/AuthView.vue'
import SignupView from '../views/SignupView.vue' 
import AuthorsView from "../views/AuthorsView.vue";

//hadhrna les routes w 3mlna l mapping bin les path w les components
const routes = [
  { path: '/home',    component: HomeView  }, // home mte3 admin 
  { path: '/login',   component: AuthView    },
  { path: '/signup',  component: SignupView  },

   { path: '/admin/authors', component: AuthorsView}, //view gestion des auteurs 
 
]
const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) return next('/login')
  if ((to.path === '/login' || to.path === '/signup') && auth.isLoggedIn) {
    return next(auth.isAdmin ? '/home' : '/user-home')
  }
  if (to.meta.requiresAdmin && !auth.isAdmin) return next('/user-home')
  if (to.meta.requiresUser  &&  auth.isAdmin) return next('/home')

  next()
})

export default router