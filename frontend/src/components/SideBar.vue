<template>
  <aside class="sidebar">
    <!-- Brand -->
    <div class="sidebar-brand">
      <div class="brand-icon">
        <i class="bi bi-book-half"></i>
      </div>
      <div>
        <div class="brand-name">BookShop</div>
        <div class="brand-sub">Bibliothèque</div>
      </div>
    </div>

    <p class="sidebar-section-label">Navigation</p>
    <ul class="sidebar-nav">

      <!--  ADMIN uniquement -->
      <template v-if="auth.isAdmin">
        <li>
          <router-link to="/home">
            <i class="bi bi-house-door"></i> Accueil
          </router-link>
        </li>

        <p class="sidebar-section-label" style="padding-top:12px">Administration</p>

        <li>
          <router-link to="/add">
            <i class="bi bi-plus-circle"></i> Ajouter un livre
          </router-link>
        </li>
        <li>
          <router-link to="/admin/authors">
            <i class="bi bi-people"></i> Mes auteurs
          </router-link>
        </li>
        <li>
          <router-link to="/admin/books">
            <i class="bi bi-journal-richtext"></i> Mes livres
          </router-link>
        </li>
      </template>

      <!--  USER uniquement -->
      <template v-if="!auth.isAdmin">
        <li>
          <router-link to="/user-home">
            <i class="bi bi-house-door"></i> Accueil
          </router-link>
        </li>
        <li>
          <router-link to="/books">
            <i class="bi bi-grid-3x3-gap"></i> Catalogue
          </router-link>
        </li>
        <li>
          <router-link to="/favourites">
            <i class="bi bi-heart"></i> Favoris
            <span v-if="fav.count" class="badge-fav">{{ fav.count }}</span>
          </router-link>
        </li>
      </template>

    </ul>

    <!-- Footer utilisateur -->
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="avatar">{{ auth.initials }}</div>
        <div class="user-info">
          <div class="username">{{ auth.user?.username || 'Utilisateur' }}</div>
          <div class="role-badge">{{ auth.isAdmin ? 'Administrateur' : 'Membre' }}</div>
        </div>
        <button class="logout-btn" @click="logout" title="Déconnexion">
          <i class="bi bi-box-arrow-right"></i>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useAuthStore } from '../store/auth.js'
import { useFavStore }  from '../store/favourites.js'
import { useRouter }    from 'vue-router'

const auth   = useAuthStore()
const fav    = useFavStore()
const router = useRouter()

async function logout() {
  await auth.logout()        
  router.push('/login')      
}
</script>