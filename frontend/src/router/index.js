 import { createRouter, createWebHistory } from 'vue-router'
 import { useAuthStore } from '../store/auth.js'
 
import UserHomeView from '../views/UserHomeView.vue' 
import AuthView     from '../views/AuthView.vue'
import SignupView from '../views/SignupView.vue' 
import FavouritesView  from '../views/FavouritesView.vue'
import LandingView     from '../views/LandingView.vue'
import HomeView        from '../views/HomeView.vue'
import AllBooksView    from '../views/AllBooksView.vue'
import AuthorsView from "../views/AuthorsView.vue";
import AddBookView from '../Views/AddBookView.vue'
import AdminBooksView from '../views/AdminBooksView.vue'

//hadhrna les routes w 3mlna l mapping bin les path w les components
const routes = [
  { path: '/',        component: LandingView },
  { path: '/home',    component: HomeView,        meta: { requiresAuth: true , requiresAdmin: true } },
  { path: '/login',   component: AuthView    },
  { path: '/signup',  component: SignupView  },
  { path: '/user-home',      component: UserHomeView,    meta: { requiresAuth: true, requiresUser: true }},
  { path: '/books',          component: AllBooksView,    meta: { requiresAuth: true } },
  { path: '/favourites',     component: FavouritesView,  meta: { requiresAuth: true , requiresUser: true} },

   { path: '/admin/authors', component: AuthorsView,        meta: { requiresAuth: true , requiresAdmin: true } }, //view gestion des auteurs 
  { path: '/add', component: AddBookView,        meta: { requiresAuth: true , requiresAdmin: true } }, //view ajout livre
    { path: '/admin/books', component: AdminBooksView,        meta: { requiresAuth: true , requiresAdmin: true } }, //view gestion des livres



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