<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="auth-left-content">
        <router-link to="/" class="back-link">
          <i class="bi bi-arrow-left"></i> Retour à l'accueil
        </router-link>
        <div class="brand-logo" style="margin-top:32px">
          <i class="bi bi-book-half"></i>
        </div>
        <h1>Rejoignez<br /><em>BookShop</em></h1>
        <p>Créez votre compte et accédez à votre bibliothèque personnelle.</p>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-card">
        <h2>Créer un compte</h2>
        <p class="auth-sub">Inscription gratuite ✨</p>

        <div v-if="error"   class="alert-pro danger mb-3">
          <i class="bi bi-exclamation-circle"></i> {{ error }}
        </div>
        <div v-if="success" class="alert-pro success mb-3">
          <i class="bi bi-check-circle"></i> {{ success }}
        </div>

        <div class="mb-3">
          <label class="form-label-pro">Nom d'utilisateur</label>
          <input class="form-control-pro" v-model="form.username" placeholder="jean_dupont" />
        </div>
        <div class="mb-3">
          <label class="form-label-pro">Email</label>
          <input class="form-control-pro" type="email" v-model="form.email" placeholder="jean@exemple.com" />
        </div>
        <div class="mb-4">
          <label class="form-label-pro">Mot de passe</label>
          <input class="form-control-pro" type="password" v-model="form.password" placeholder="••••••••" />
        </div>

        <button class="btn-gold" style="width:100%;justify-content:center" @click="handleRegister" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm"></span>
          <i v-else class="bi bi-person-plus"></i>
          Créer mon compte
        </button>

        <div class="auth-toggle">
          Déjà membre ?
          <router-link to="/login">Se connecter</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter }     from 'vue-router'
import { useAuthStore }  from '../store/auth.js'

const auth    = useAuthStore()
const router  = useRouter()
const error   = ref('')
const success = ref('')
const loading = ref(false)
const form    = reactive({ username: '', email: '', password: '' })

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register({ username: form.username, email: form.email, password: form.password })
    success.value = 'Compte créé ! Redirection...'
    setTimeout(() => router.push('/login'), 1500)
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.back-link {
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 0.88rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
}
.back-link:hover { color: var(--gold); }
</style>