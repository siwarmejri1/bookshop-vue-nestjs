<template>
  <AppLayout title="Catalogue">
    <div class="page-header">
      <div>
        <h1 class="page-title">Catalogue de livres</h1>
        <p class="page-subtitle">{{ displayed.length }} livre(s) trouvé(s)</p>
      </div>
    </div>

    <div class="filter-bar">
      <i class="bi bi-funnel" style="color:var(--gold);font-size:1.1rem"></i>
      <label>Année début</label>
      <input class="filter-input" type="number" v-model="startYear" placeholder="2000" />
      <label>Année fin</label>
      <input class="filter-input" type="number" v-model="endYear" placeholder="2025" />
      <button class="btn-gold" @click="filterBooks">
        <i class="bi bi-search"></i> Filtrer
      </button>
      <button v-if="startYear || endYear" class="btn-navy" @click="resetFilter" style="padding:10px 16px">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div v-if="loading" class="spinner-wrap"><div class="spinner-pro"></div></div>
    <div v-else-if="error" class="alert-pro danger"><i class="bi bi-exclamation-circle"></i> {{ error }}</div>
    <div v-else-if="!displayed.length" class="empty-state">
      <i class="bi bi-journal-x"></i>
      <h4>Aucun livre trouvé</h4>
      <p>Essayez d'ajuster vos filtres.</p>
    </div>

   <div class="row g-4" v-else>
 <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6" v-for="book in displayed" :key="book.id">
        <div class="book-card" @click="openModal(book)" style="cursor:pointer">
          <div class="book-card-img">
            <img :src="book.image" :alt="book.title" @error="onImgError" />
            <button
  class="fav-btn"
  :class="{ active: fav.isFav(book.id) }"
  @click.stop="toggleFav(book)"
>
  <i :class="fav.isFav(book.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
</button>
          </div>
          <div class="book-card-body">
            <div class="book-title">{{ book.title }}</div>
            <div class="book-meta">
              <span class="meta-chip year"><i class="bi bi-calendar3"></i> {{ book.year }}</span>
              <span class="meta-chip editor">{{ book.editor }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BookDetailModal :book="selectedBook" @close="closeModal" />
  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import BookDetailModal from '../components/BookDetailModal.vue'
import { getAllBooks } from '../services/api.js'
import { useFavStore } from '../store/favourites.js'



const fav = useFavStore()
const books        = ref([])
const displayed    = ref([])
const loading      = ref(true)
const error        = ref('')
const startYear    = ref('')
const endYear      = ref('')
const selectedBook = ref(null)

onMounted(async () => {
  try {
    const res = await getAllBooks()
    books.value     = res.data.listeBooks || []
    displayed.value = [...books.value]
  } catch { error.value = 'Impossible de charger les livres' }
  finally   { loading.value = false }
})

function filterBooks() {
  displayed.value = books.value.filter((b) => {
    const ok1 = startYear.value ? b.year >= Number(startYear.value) : true
    const ok2 = endYear.value   ? b.year <= Number(endYear.value)   : true
    return ok1 && ok2
  })
}

function resetFilter() {
  startYear.value = ''
  endYear.value   = ''
  displayed.value = [...books.value]
}

function openModal(book) {
  selectedBook.value = book
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  selectedBook.value = null
  document.body.style.overflow = ''
}

function onImgError(e) {
  e.target.src = 'https://placehold.co/300x260/1e2f45/c9a84c?text=📖'
}
async function toggleFav(book) {
  try {
    await fav.toggle(book)
  } catch (e) {
    console.error('Erreur favori:', e)
  }
}
</script>