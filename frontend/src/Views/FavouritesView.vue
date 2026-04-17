<template>
  <AppLayout title="Favoris">
    <div class="page-header">
      <div>
        <h1 class="page-title">Mes favoris</h1>
        <p class="page-subtitle">{{ fav.count }} livre(s) sauvegardé(s)</p>
      </div>
    </div>

  // l'affichage mtaa les favoris mta3ou
    <div v-if="loading" class="spinner-wrap">
      <div class="spinner-pro"></div>
    </div>
    <!-- ken mafamesh favoris yetaffichiou message w lien besh yrouhou ychoufou les livres -->
    <div v-else-if="!fav.favourites.length" class="empty-state">
      <i class="bi bi-heart"></i>
      <h4>Aucun favori pour le moment</h4>
      <p>Parcourez le catalogue et cliquez sur ❤️ pour sauvegarder vos livres.</p>
      <router-link
        to="/books"
        class="btn-gold"
        style="margin-top:20px;display:inline-flex;align-items:center;gap:8px;text-decoration:none"
      >
        <i class="bi bi-grid-3x3-gap"></i> Voir le catalogue
      </router-link>
    </div>

    <!--  l grille mtaa les favoris  -->
    <div class="row g-4" v-else>
      <div
        class="col-xl-3 col-lg-3 col-md-4 col-sm-6"
        v-for="item in fav.favourites"
        :key="item.id"
      >
       // ken l'item 3andou book (structure API) n'affichiouha, sinon n'affichiou l'item (ancienne structure localStorage)
        <div class="book-card" style="cursor:pointer" @click="selectedBook = getBook(item)">
          <div class="book-card-img">
            <img
              :src="getBook(item).image"
              :alt="getBook(item).title"
              @error="onImgError"
            />
            <button
              class="fav-btn active"
              @click.stop="removeFav(item)"
              title="Retirer des favoris"
            >
              <i class="bi bi-heart-fill"></i>
            </button>
          </div>
          <div class="book-card-body">
            <div class="book-title">{{ getBook(item).title }}</div>
            <div class="book-meta">
              <span class="meta-chip year">
                <i class="bi bi-calendar3"></i> {{ getBook(item).year }}
              </span>
              <span class="meta-chip editor">{{ getBook(item).editor }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Modal détail -->
    <BookDetailModal :book="selectedBook" @close="selectedBook = null" />

  </AppLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppLayout        from '../components/AppLayout.vue'
import BookDetailModal  from '../components/BookDetailModal.vue'
import { useFavStore }  from '../store/favourites.js'
import { useAuthStore } from '../store/auth.js'

const fav          = useFavStore()
const auth         = useAuthStore()
const selectedBook = ref(null)
const loading      = ref(true)

//  besh nchargiou les favoris mta3ou mel backend w n7otouha fel state mtaa l store
onMounted(async () => {
  await fav.load()
  loading.value = false
})

//  besh ngeriou  les deux structures :
// - { id, book: { id, title, ... } }  ← mel API 
// - { id, title, image, ... }         ← ancienne structure localStorage
function getBook(item) {
  return item.book ? item.book : item
}

// besh nfasskhou bel book ID 
async function removeFav(item) {
  const bookId = item.book ? item.book.id : item.id
  await fav.remove(bookId)
}

function onImgError(e) {
  e.target.src = 'https://placehold.co/300x260/1e2f45/c9a84c?text=📖'
}
</script>
