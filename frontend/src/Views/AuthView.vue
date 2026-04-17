<template>
  <div class="auth-page">
    <!-- Left panel -->
    <div class="auth-left">
      <div class="auth-left-content">
        <div class="brand-logo">
          <i class="bi bi-book-half"></i>
        </div>
        <h1>Votre <em>bibliothèque</em><br />en ligne.</h1>
        <p>
          Découvrez, gérez et partagez vos livres préférés.
          Une expérience de lecture moderne et élégante.
        </p>
      </div>
    </div>

    <!-- Right panel -->
    <div class="auth-right">
      <div class="auth-card">
        <!-- Login -->
        <template v-if="mode === 'login'">
          <h2>Connexion</h2>
          <p class="auth-sub">Bon retour parmi nous 👋</p>

          <div v-if="error" class="alert-pro danger">
            <i class="bi bi-exclamation-circle"></i> {{ error }}
          </div>

          <div class="mb-3">
            <label class="form-label-pro">Nom d'utilisateur</label>
            <input class="form-control-pro" v-model="form.username"
              placeholder="votre_username" @keyup.enter="handleLogin" />
          </div>
          <div class="mb-4">
            <label class="form-label-pro">Mot de passe</label>
            <div style="position:relative">
              <input class="form-control-pro" :type="showPw ? 'text' : 'password'"
                v-model="form.password" placeholder="••••••••" @keyup.enter="handleLogin"
                style="padding-right:42px" />
              <button type="button"
                style="position:absolute;right:12px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:#9ca3af;font-size:1rem"
                @click="showPw = !showPw">
                <i :class="showPw ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>
          <button class="btn-gold" style="width:100%;justify-content:center" @click="handleLogin" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-arrow-right-circle"></i>
            Se connecter
          </button>

          <div class="auth-toggle">
            Pas encore de compte ?
            <a @click="switchMode('register')">Créer un compte</a>
          </div>
        </template>

        <!-- Register -->
        <template v-else>
          <h2>Inscription</h2>
          <p class="auth-sub">Rejoignez la bibliothèque ✨</p>

          <div v-if="error" class="alert-pro danger">
            <i class="bi bi-exclamation-circle"></i> {{ error }}
          </div>
          <div v-if="success" class="alert-pro success">
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
            <a @click="switchMode('login')">Se connecter</a>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth.js'

const auth   = useAuthStore()
const router = useRouter()

const mode    = ref('login')
const error   = ref('')
const success = ref('')
const loading = ref(false)
const showPw  = ref(false)
const form    = reactive({ username: '', email: '', password: '' })

function switchMode(m) {
  mode.value = m
  error.value = ''
  success.value = ''
  Object.assign(form, { username: '', email: '', password: '' })
}

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login({ username: form.username, password: form.password })
   router.push(auth.isAdmin ? '/home' : '/user-home')

  } catch (e) {
    error.value = e.response?.data?.message || 'Identifiants incorrects'
  }
}

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await auth.register({ username: form.username, email: form.email, password: form.password })
    success.value = 'Compte créé ! Vous pouvez maintenant vous connecter.'
    setTimeout(() => switchMode('login'), 1800)
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de l\'inscription'
  } finally {
    loading.value = false
  }
}
</script>
