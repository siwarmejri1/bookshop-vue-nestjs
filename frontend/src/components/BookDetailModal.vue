<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="book" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-pro">
          <button class="modal-close-btn" @click="$emit('close')">
            <i class="bi bi-x-lg"></i>
          </button>

          <div class="modal-body-pro">
            <!-- Left: cover -->
            <div class="modal-cover">
              <img :src="book.image" :alt="book.title" @error="onImgError" />
              <button
                class="fav-btn modal-fav-btn"
                :class="{ active: fav.isFav(book.id) }"
                @click="fav.toggle(book)"
                :title="fav.isFav(book.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
              >
                <i :class="fav.isFav(book.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                {{ fav.isFav(book.id) ? 'Favori' : 'Ajouter aux favoris' }}
              </button>
            </div>

            <!-- Right: details -->
            <div class="modal-details">
              <h2 class="modal-book-title">{{ book.title }}</h2>

              <div class="modal-chips">
                <span class="meta-chip year"><i class="bi bi-calendar3"></i> {{ book.year }}</span>
                <span class="meta-chip editor">{{ book.editor }}</span>
              </div>

              <div class="modal-info-grid">
                <div class="modal-info-item" v-if="book.author">
                  <span class="info-label"><i class="bi bi-person"></i> Auteur</span>
                  <span class="info-value">{{ book.author.prenom }} {{ book.author.nom }}</span>
                </div>
              </div>

              <div class="modal-description" v-if="book.description">
                <span class="info-label"><i class="bi bi-card-text"></i> Description</span>
                <p>{{ book.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useFavStore } from '../store/favourites.js'

defineProps({
  book: { type: Object, default: null }
})
const emit = defineEmits(['close'])
const fav = useFavStore()

function onImgError(e) {
  e.target.src = 'https://placehold.co/300x260/1e2f45/c9a84c?text=📖'
}

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 18, 30, 0.75);
  backdrop-filter: blur(4px);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-pro {
  background: var(--card-bg, #fff);
  border: 1px solid rgba(201, 168, 76, 0.25);
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
  width: 100%;
  max-width: 780px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 2rem;
}

.modal-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(201, 168, 76, 0.12);
  border: 1px solid rgba(201, 168, 76, 0.3);
  color: var(--gold, #c9a84c);
  border-radius: 8px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 1;
}
.modal-close-btn:hover {
  background: rgba(201, 168, 76, 0.25);
}

.modal-body-pro {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.modal-cover {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.modal-cover img {
  width: 100%;
  border-radius: 10px;
  object-fit: cover;
  aspect-ratio: 3 / 4;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.modal-fav-btn {
  width: 100%;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.5rem;
  border-radius: 8px;
  font-size: 0.82rem;
  display: flex;
  align-items: center;
}

.modal-details {
  flex: 1;
  min-width: 0;
}

.modal-book-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--navy, #1e2f45);
  margin: 0 0 0.75rem;
  line-height: 1.3;
  padding-right: 2.5rem;
}

.modal-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.modal-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1rem;
  margin-bottom: 1.25rem;
}

.modal-info-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.info-label {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--gold, #c9a84c);
  opacity: 0.85;
}

.info-value {
  font-size: 0.9rem;
  color: var(--navy, #1e2f45);
  font-weight: 500;
}

.modal-description {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}
.modal-description p {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--navy, #1e2f45);
  opacity: 0.8;
  margin: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-pro,
.modal-leave-to .modal-pro {
  transform: translateY(20px) scale(0.97);
}

@media (max-width: 600px) {
  .modal-body-pro {
    flex-direction: column;
  }
  .modal-cover {
    flex: none;
    width: 140px;
    align-self: center;
  }
  .modal-info-grid {
    grid-template-columns: 1fr;
  }
  .modal-book-title {
    font-size: 1.15rem;
  }
}
</style>