import { createApp }   from 'vue'
import { createPinia } from 'pinia'
import App             from './App.vue'
import router          from './router/index.js'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import './assets/main.css'


const pinia = createPinia()
const app   = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

//  ki yconnecti l user w 3andou id, besh nshargiou les favoris mta3ou mel backend w n7otouha fel state mtaa l store
import { useAuthStore } from './store/auth.js'
import { useFavStore }  from './store/favourites.js'

const auth = useAuthStore()
if (auth.isLoggedIn && auth.user?.id) {
  useFavStore().load(auth.user.id)
}
