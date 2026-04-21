 <!-- lhome mtaa l user (personnalisé) -->
<template>
  <AppLayout title="Accueil">
    <div class="page-header">
      <div>
        <h1 class="page-title">Bonjour, {{ auth.user?.username }} 👋</h1>
        <p class="page-subtitle">Bienvenue dans votre espace lecture</p>
      </div>
    </div>
 <!--  lktob lmaoujoudin -->
    <!-- Stat cards -->
    <div class="row g-4 mb-4">
      <div class="col-md-6">
        <div class="stat-card">
          <div class="stat-icon" style="background:#f0f4ff">
            <i class="bi bi-journal-richtext" style="color:#3a5bd9"></i>
          </div>
          <div class="stat-value">{{ totalBooks }}</div>
          <div class="stat-label">Livres disponibles</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="stat-card">
          <div class="stat-icon" style="background:#fff8e6">
            <i class="bi bi-heart-fill" style="color:#c9a84c"></i>
          </div>
          <!-- besh n'affichiou le nombre mtaa l favoris mta3ou -->
          <div class="stat-value">{{ fav.count }}</div>
          <div class="stat-label">Mes favoris</div>
        </div>
      </div>
    </div>
    <!-- l'affichage mtaa ekher ktob tzedou -->
    <!-- Derniers livres ajoutés -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h4 style="font-family:'Playfair Display',serif;font-size:1.3rem">
        Derniers ajouts
      </h4>
      <router-link
        to="/books"
        style="color:var(--gold);font-weight:700;font-size:0.88rem;text-decoration:none"
      >
        Voir tout <i class="bi bi-arrow-right"></i>
      </router-link>
    </div>

    <div v-if="loading" class="spinner-wrap">
      <div class="spinner-pro"></div>
    </div>

    <div class="row g-3" v-else>
  <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6" v-for="book in recentBooks" :key="book.id">
        <div class="book-card">
          <div class="book-card-img">
            <img :src="book.image" :alt="book.title" @error="onImgError" />
            <button
              class="fav-btn"
              :class="{ active: fav.isFav(book.id) }"
              @click="fav.toggle(book, auth.user?.id)"
              :title="fav.isFav(book.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            >
              <i :class="fav.isFav(book.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            </button>
          </div>
          <div class="book-card-body">
            <div class="book-title">{{ book.title }}</div>
            <div class="book-meta">
              <span class="meta-chip year">
                <i class="bi bi-calendar3"></i> {{ book.year }}
              </span>
              <span class="meta-chip editor">{{ book.editor }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useAuthStore } from '../store/auth.js'
import { useFavStore }  from '../store/favourites.js'
import { getAllBooks }   from '../services/api.js'

const auth = useAuthStore()
const fav  = useFavStore()
// besh nehssbou el total mtaa lktob o naffichiouh
const totalBooks  = ref(0)
const recentBooks = ref([])
const loading     = ref(true)

onMounted(async () => {
  try {
    const res = await getAllBooks()
    const books      = res.data.listeBooks || []
    totalBooks.value  = books.length
    recentBooks.value = books.slice(-4).reverse()
  } finally {
    loading.value = false
  }
})

function onImgError(e) {
  e.target.src = 'https://placehold.co/300x260/1e2f45/c9a84c?text=📖'
}
</script>