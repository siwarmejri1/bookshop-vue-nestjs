import { defineStore } from 'pinia'
import { signIn, signUp } from '../services/api.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user:  JSON.parse(localStorage.getItem('user') || 'null'),
  }),

  getters: {
    isLoggedIn: (s) => !!s.token,
    //  Accepte ROLE_ADMIN et admin pour être safe
    isAdmin: (s) =>
      s.user?.role === 'ROLE_ADMIN' || s.user?.role === 'admin',
    initials: (s) => {
      const u = s.user?.username || 'U'
      return u.slice(0, 2).toUpperCase()
    },
  },

  actions: {
    async login(credentials) {
      const res = await signIn({
        identifiant: credentials.username,
        password:    credentials.password,
      })

      this.token = res.data.access_token

      // Stocker id, username, email, role
      this.user = {
        id:       res.data.id,
        username: res.data.username,
        email:    res.data.email,
        role:     res.data.role,
      }

      localStorage.setItem('token', this.token)
      localStorage.setItem('user',  JSON.stringify(this.user))

      // Charger les favoris de cet utilisateur
      const { useFavStore } = await import('./favourites.js')
      useFavStore().load(this.user.id)
    },

    async register(data) {
      await signUp(data)
    },

   async logout() {
  // Vider les favoris
  const { useFavStore } = await import('./favourites.js')
  useFavStore().clear()

  //  Vider le state ET le localStorage
  this.token = null
  this.user  = null
  localStorage.removeItem('token')
  localStorage.removeItem('user')
},
  },
})