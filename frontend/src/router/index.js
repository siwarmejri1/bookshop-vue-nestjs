

import HomeView        from '../views/HomeView.vue'
import AuthView        from '../views/AuthView.vue'
import SignupView from '../views/SignupView.vue' 

//hadhrna les routes w 3mlna l mapping bin les path w les components
const routes = [
   { path: '/',           component: HomeView,  },
  { path: '/login',   component: AuthView    },
  { path: '/signup',  component: SignupView  },
 
]



export default router
