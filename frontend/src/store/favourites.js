import { defineStore } from 'pinia'
import { addFavourite, removeFavourite, getMyFavourites } from '../services/api.js'

// store mtaa l favoris mta3 l user
export const useFavStore = defineStore('favourites', {
  state: () => ({
    favourites: [],
  }),

  getters: {
    isFav:  (s) => (id) => s.favourites.some((b) => b.book?.id === id || b.id === id),
    count:  (s) => s.favourites.length,
  },

  actions: {
    // besh nshargiouha mel backend w n7otouha fel state
    async load() {
      try {
        const res = await getMyFavourites()
        this.favourites = res.data
      } catch {
        this.favourites = []
      }
    },

    // besh nfasskhou onzydou selon l cas 
    async toggle(book) {
      if (this.isFav(book.id)) {
        await removeFavourite(book.id)
        this.favourites = this.favourites.filter(
          (f) => (f.book?.id || f.id) !== book.id
        )
      } else {
        await addFavourite(book.id)
        this.favourites.push({ book })
      }
    },

    // besh nfasskhou 
    async remove(bookId) {
      await removeFavourite(bookId)
      this.favourites = this.favourites.filter(
        (f) => (f.book?.id || f.id) !== bookId
      )
    },

    // besh nfarghouha fel déconnexion
    clear() {
      this.favourites = []
    },
  },
})