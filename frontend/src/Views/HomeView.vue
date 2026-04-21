 <!--  home mte3 l admin (dashboard)-->  
<template>
  <AppLayout title="Tableau de bord">
    <div class="page-header">
      <div>
        <h1 class="page-title">Tableau de bord</h1>
        <p class="page-subtitle">Vue d'ensemble de la bibliothèque</p>
      </div>
    </div>

    <!-- 3 cartes mte3 stats : livres/ favoris/auteurs -->   
    <div class="row g-4 mb-4">
      <div class="col-md-4">
        <div class="stat-card">
          <div class="stat-icon" style="background:#f0f4ff">
            <i class="bi bi-journal-richtext" style="color:#3a5bd9"></i>
          </div>
          <div class="stat-value">{{ totalBooks }}</div>
          <div class="stat-label">Livres au total</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card">
          <div class="stat-icon" style="background:#fff8e6">
            <i class="bi bi-heart-fill" style="color:#c9a84c"></i>
          </div>
          <div class="stat-value">{{ totalLikes }}</div>
          <div class="stat-label">Total favoris (tous users)</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="stat-card">
          <div class="stat-icon" style="background:#f0fdf4">
            <i class="bi bi-people-fill" style="color:#3dba7f"></i>
          </div>
          <div class="stat-value">{{ totalAuthors }}</div>
          <div class="stat-label">Auteurs référencés</div>
        </div>
      </div>
    </div>

    <!-- Top  mte3 les livres les plus aimés -->
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h4 style="font-family:'Playfair Display',serif;font-size:1.3rem">
        ❤️ Livres les plus aimés
      </h4>
    </div>

    <div v-if="loadingStats" class="spinner-wrap">
      <div class="spinner-pro"></div>
    </div>

    <!-- ken famech livre fl favotites yodhehr message -->
    <div v-else-if="!favStats.length" class="empty-state" style="padding:40px">
      <i class="bi bi-heart"></i>
      <h4>Aucun favori enregistré</h4>
      <p>Les statistiques apparaîtront quand des users ajouteront des favoris.</p>
    </div>

    <div class="data-table-wrap mb-4" v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>Rang</th>
            <th>Couverture</th>
            <th>Titre</th>
            <th>❤️ Likes</th>
            <th>Popularité</th>
          </tr>
        </thead>
        <tbody>
              <!-- rang mte3 livres w affectation lel medailles -->

              
          <tr v-for="(stat, index) in favStats" :key="stat.bookId">
            <td>
              <span
                :style="{
                  fontWeight: '800',
                  color: index === 0 ? '#c9a84c'
                       : index === 1 ? '#9ca3af'
                       : index === 2 ? '#b87333'
                       : 'var(--text-muted)'
                }"
              >
                {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}` }}
              </span>
            </td>
            <td>
              <img
                :src="stat.bookImage"
                class="table-img-thumb"
                @error="onImgError"
                :alt="stat.bookTitle"
              />
            </td>
            <td style="font-weight:700">{{ stat.bookTitle }}</td>
            <td>
              <span class="meta-chip year">
                <i class="bi bi-heart-fill" style="color:#e05252"></i>
                {{ stat.totalLikes }}
              </span>
            </td>
            <td style="min-width:140px">
              <!-- Barre de progression mte3 livre selon total mte3 like par rapport lel max -->
              <div style="background:#f0f0f0;border-radius:20px;height:8px;overflow:hidden">
                <div
                  :style="{
                    width: `${Math.min((stat.totalLikes / maxLikes) * 100, 100)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #c9a84c, #e8c97a)',
                    borderRadius: '20px',
                    transition: 'width 0.6s ease'
                  }"
                ></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Derniers livres ajoutés -->
    <div class="d-flex align-items-center justify-content-between mb-3 mt-4">
      <h4 style="font-family:'Playfair Display',serif;font-size:1.3rem">
        📚 Ajouts récents
      </h4>
      <router-link
        to="/admin/books"
        style="color:var(--gold);font-weight:700;font-size:0.88rem;text-decoration:none"
      >
        Voir tout <i class="bi bi-arrow-right"></i>
      </router-link>
    </div>

     <!-- loading mte3 recent books -->
    <div v-if="loading" class="spinner-wrap"><div class="spinner-pro"></div></div>
   <div class="row g-3" v-else>
  <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6" v-for="book in recentBooks" :key="book.id">
        <div class="book-card"  
        @click="openBook(book)"
          style="cursor:pointer">
          <div class="book-card-img">
            <img :src="book.image" :alt="book.title" @error="onImgError" />
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
<!-- Modal -->
    <BookDetailModal
      :book="selectedBook"
      @close="closeModal"
    />
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import BookDetailModal from '../components/BookDetailModal.vue'
import { getAllBooks, getAllAuthors, getFavStats } from '../services/api.js'

//les varaibles mte3 l etat mte3na
const totalBooks   = ref(0)
const totalAuthors = ref(0)
const totalLikes   = ref(0)
const favStats     = ref([])
const recentBooks  = ref([])
const loading      = ref(true) //hedhi mte3 chargement recent books
const loadingStats = ref(true) // w hedhi mte3 chargement stats favoris

//lel calcul de barre de progression
const maxLikes = computed(() =>
  Math.max(...favStats.value.map((s) => Number(s.totalLikes)), 1)
)
// jebna les donnees mel API ba3d ma l DOM tla33 bl onMounted 
onMounted(async () => {
  try {
  
    const [bRes, aRes] = await Promise.all([getAllBooks(), getAllAuthors()])
    const books        = bRes.data.listeBooks || []
    totalBooks.value   = books.length
    totalAuthors.value = aRes.data?.length || 0
    recentBooks.value  = books.slice(-4).reverse() //ekherr 4 livres
  } finally {
    loading.value = false //bech na7iw loading recent books
  }

 // stats des favoris
  try {
    const fRes     = await getFavStats()
    favStats.value = fRes.data || []
    totalLikes.value = favStats.value.reduce(
      (acc, s) => acc + Number(s.totalLikes), 0
    )
  } catch (e) {
    console.error('Erreur stats favoris:', e)
  } finally {
    loadingStats.value = false
  }
})

// en cas image fih erreur yet7att image mte3 lien hedha
function onImgError(e) {
  e.target.src = 'https://placehold.co/300x260/1e2f45/c9a84c?text=📖'
}

// MODAL STATE
const selectedBook = ref(null)

// METHODS
function openBook(book) {
  selectedBook.value = book
}

function closeModal() {
  selectedBook.value = null
}
</script>