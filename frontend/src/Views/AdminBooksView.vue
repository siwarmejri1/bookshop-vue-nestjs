
<template>
  <AppLayout title="Gestion des livres">
    <div class="page-header">
      <div>
        <h1 class="page-title">Livres</h1>
        <p class="page-subtitle">{{ books.length }} livre(s) enregistré(s)</p>
      </div>
      <button class="btn-gold" @click="openAdd">
        <i class="bi bi-plus-lg"></i> Nouveau livre
      </button>
    </div>

    <!-- Table -->
    <div v-if="loading" class="spinner-wrap"><div class="spinner-pro"></div></div>
    <div v-else-if="error" class="alert-pro danger"><i class="bi bi-exclamation-circle"></i> {{ error }}</div>

    <div class="data-table-wrap" v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Couverture</th>
            <th>Titre</th>
            <th>Éditeur</th>
            <th>Année</th>
            <th>Auteur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="!books.length">
            <td colspan="7" class="text-center py-5" style="color:var(--text-muted)">
              Aucun livre trouvé
            </td>
          </tr>
          <tr v-for="book in books" :key="book.id">
            <td style="color:var(--text-muted);font-weight:700">{{ book.id }}</td>
            <td>
              <img :src="book.image" class="table-img-thumb" @error="onImgError" :alt="book.title" />
            </td>
            <td style="font-weight:700;max-width:200px">{{ book.title }}</td>
            <td>{{ book.editor }}</td>
            <td>
              <span class="meta-chip year">{{ book.year }}</span>
            </td>
            <td>
              <span v-if="book.author" class="author-chip">
                <i class="bi bi-person"></i> {{ book.author.prenom }} {{ book.author.nom }}
              </span>
              <span v-else style="color:var(--text-muted);font-size:0.82rem">—</span>
            </td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn-icon-action btn-edit" @click="openEdit(book)" title="Modifier">
                  <i class="bi bi-pencil"></i>
                </button>
                <button class="btn-icon-action btn-delete" @click="openDelete(book)" title="Supprimer">
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Modal -->
    <div class="modal-overlay" v-if="showAdd" @click.self="showAdd = false">
      <div class="modal-panel">
        <div class="modal-panel-header">
          <span class="modal-panel-title">
            <i class="bi bi-plus-circle-fill"></i> Nouveau livre
          </span>
          <button class="modal-close-btn" @click="showAdd = false"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-panel-body">
          <div v-if="modalErr" class="alert-pro danger mb-3"><i class="bi bi-exclamation-circle"></i> {{ modalErr }}</div>
          <BookForm :form="addForm" :authors="authors" />
        </div>
        <div class="modal-panel-footer">
          <button class="btn-navy" @click="showAdd = false" style="padding:10px 20px">Annuler</button>
          <button class="btn-gold" @click="submitAdd" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check-lg"></i> Ajouter
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal-overlay" v-if="showEdit" @click.self="showEdit = false">
      <div class="modal-panel">
        <div class="modal-panel-header">
          <span class="modal-panel-title">
            <i class="bi bi-pencil-fill"></i> Modifier le livre
          </span>
          <button class="modal-close-btn" @click="showEdit = false"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="modal-panel-body">
          <div v-if="modalErr" class="alert-pro danger mb-3"><i class="bi bi-exclamation-circle"></i> {{ modalErr }}</div>
          <BookForm :form="editForm" :authors="authors" />
        </div>
        <div class="modal-panel-footer">
          <button class="btn-navy" @click="showEdit = false" style="padding:10px 20px">Annuler</button>
          <button class="btn-gold" @click="submitEdit" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check-lg"></i> Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div class="modal-overlay" v-if="showDelete" @click.self="showDelete = false">
      <div class="modal-panel" style="max-width:380px">
        <div class="modal-panel-body" style="padding:36px 28px;text-align:center">
          <div class="confirm-icon"><i class="bi bi-trash3"></i></div>
          <h4 style="font-family:'Playfair Display',serif;margin-bottom:8px">Supprimer ce livre ?</h4>
          <p style="color:var(--text-muted);font-size:0.9rem">
            « <strong>{{ selected?.title }}</strong> » sera définitivement supprimé.
          </p>
          <div class="d-flex gap-3 justify-content-center mt-4">
            <button class="btn-navy" @click="showDelete = false" style="padding:10px 22px">Annuler</button>
            <button class="btn-gold" style="background:linear-gradient(135deg,#e05252,#b83535);box-shadow:0 2px 12px rgba(224,82,82,0.35)"
              @click="submitDelete" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-trash"></i> Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import BookForm   from '../components/BookForm.vue'
import { getAllBooks, addBook, updateBook, deleteBook, getAllAuthors } from '../services/api.js'

const books   = ref([])
const authors = ref([])
const loading = ref(true)
const saving  = ref(false)
const error   = ref('')
const modalErr = ref('')

const showAdd    = ref(false)
const showEdit   = ref(false)
const showDelete = ref(false)
const selected   = ref(null)

const addForm  = reactive({ title: '', image: '', editor: '', year: '', description: '', author_id: '' })
const editForm = reactive({ title: '', image: '', editor: '', year: '', description: '', author_id: '' })

//chargement mte3 les auteurs m3a l Onmounted mte3 Dom bech naffichi les auteurs fi select

onMounted(async () => {
  await loadBooks()
  try { authors.value = (await getAllAuthors()).data } catch {}
})

//fonction bech njibou les livres mel API w n7otouhom fi books.value bech naffichiw fi table
async function loadBooks() {
  loading.value = true
  error.value = ''
  try {
    const res = await getAllBooks()
    books.value = res.data.listeBooks || []
  } catch { error.value = 'Impossible de charger les livres' }
  finally   { loading.value = false }
}

//fonction bech n7el modal ta3 ajout 
function openAdd() {
  Object.keys(addForm).forEach((k) => (addForm[k] = ''))
  modalErr.value = ''
  showAdd.value  = true
}

//fonction bech n7el modal ta3 modification 
function openEdit(book) {
  selected.value = book
  Object.assign(editForm, {
    title: book.title, image: book.image, editor: book.editor,
    year: book.year, description: book.description || '', author_id: book.author?.id || '',
  })
  modalErr.value = ''
  showEdit.value = true
}
//fonction bech n7el modal ta3 suppression
function openDelete(book) {
  selected.value = book
  showDelete.value = true
}
//fonction bch najoutiw livre mel form
async function submitAdd() {
  modalErr.value = ''
  saving.value   = true
  try {
    await addBook({ ...addForm })
    showAdd.value = false
    await loadBooks()
  } catch (e) {
    modalErr.value = e.response?.data?.message || 'Erreur lors de l\'ajout'
  } finally { saving.value = false }
}

//fonction bch nmodifiw livre mel form
async function submitEdit() {
  modalErr.value = '';
  saving.value = true;
  try {
    const bookId = selected.value?.id;
    if (!bookId) throw new Error('ID du livre manquant');

    await updateBook(bookId, { ...editForm, author: { id: editForm.author_id } });
    showEdit.value = false;
    await loadBooks();
  } catch (e) {
    modalErr.value = e.response?.data?.message || e.message || 'Erreur lors de la modification';
  } finally { saving.value = false; }
}
//fonction lel suppression livre
async function submitDelete() {
  saving.value = true
  try {
    await deleteBook(selected.value.id)
    showDelete.value = false
    await loadBooks()
  } catch { error.value = 'Erreur lors de la suppression' }
  finally  { saving.value = false }
}

function onImgError(e) {
  e.target.src = 'https://placehold.co/42x52/1e2f45/c9a84c?text=📖'
}
</script>
