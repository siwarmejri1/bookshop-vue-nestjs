<!--  page de gestion mte3 les auteurs  -->
<template>
  <AppLayout title="Gestion des auteurs">
    <div class="page-header">
      <div>
        <h1 class="page-title">Auteurs</h1>
        <p class="page-subtitle">{{ authors.length }} auteur(s) référencé(s)</p>
      </div>
      <!--  ken bch nzidou user boutton w yhel popup Modal  -->

      <button class="btn-gold" @click="openAdd">
        <i class="bi bi-person-plus-fill"></i> Nouvel auteur
      </button>
    </div>

    <div v-if="loading" class="spinner-wrap"><div class="spinner-pro"></div></div>
    <div v-else-if="error" class="alert-pro danger">
      <i class="bi bi-exclamation-circle"></i> {{ error }}
    </div>

<!--  tableau fih liste mte3 les auteurs  -->
    <div class="data-table-wrap" v-else>
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Livres publiés</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <!--  ken mafama hatta auteur yaffichi message  -->
          <tr v-if="!authors.length">
            <td colspan="5" class="text-center py-5"
              style="color:var(--text-muted)">
              Aucun auteur enregistré
            </td>
          </tr>
          <!--  boucle 3al les auteurs w nafichiw koul we7ed  nom +prenom +nb livres publiés-->
          <tr v-for="author in authors" :key="author.id">
            <td style="color:var(--text-muted);font-weight:700">
              {{ author.id }}
            </td>
            <td style="font-weight:600">{{ author.prenom }}</td>
            <td style="font-weight:700;font-family:'Playfair Display',serif">
              {{ author.nom }}
            </td>
            <td>
              <span class="meta-chip year">
                <i class="bi bi-journal-richtext"></i>
                {{ author.listeLivres?.length || 0 }} livre(s)
              </span>
            </td>
            <td>
              <div class="d-flex gap-2">
                <!-- Bouton Modifier -->
                <button
                  class="btn-icon-action btn-edit"
                  @click="openEdit(author)"
                  title="Modifier"
                >
                  <i class="bi bi-pencil"></i>
                </button>
                <!-- Bouton Supprimer -->
                <button
                  class="btn-icon-action btn-delete"
                  @click="openDelete(author)"
                  title="Supprimer"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal mte3 l 'ajout -->
    <div class="modal-overlay" v-if="showAdd" @click.self="showAdd = false">
      <div class="modal-panel" style="max-width:400px">
        <div class="modal-panel-header">
          <span class="modal-panel-title">
            <i class="bi bi-person-plus-fill"></i> Nouvel auteur
          </span>
          <button class="modal-close-btn" @click="showAdd = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-panel-body">
          <div v-if="modalErr" class="alert-pro danger mb-3">
            <i class="bi bi-exclamation-circle"></i> {{ modalErr }}
          </div>
          <div class="mb-3">
            <label class="form-label-pro">Prénom *</label>
            <input class="form-control-pro" v-model="addForm.prenom"
              placeholder="Ex: Victor" />
          </div>
          <div>
            <label class="form-label-pro">Nom *</label>
            <input class="form-control-pro" v-model="addForm.nom"
              placeholder="Ex: Hugo" />
          </div>
        </div>
        <div class="modal-panel-footer">
          <button class="btn-navy" @click="showAdd = false"
            style="padding:10px 20px">Annuler</button>
          <button class="btn-gold" @click="submitAdd" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check-lg"></i> Ajouter
          </button>
        </div>
      </div>
    </div>

    <!--  Modal mte3 l edit -->
    <div class="modal-overlay" v-if="showEdit" @click.self="showEdit = false">
      <div class="modal-panel" style="max-width:400px">
        <div class="modal-panel-header">
          <span class="modal-panel-title">
            <i class="bi bi-pencil-fill"></i> Modifier l'auteur
          </span>
          <button class="modal-close-btn" @click="showEdit = false">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="modal-panel-body">
          <div v-if="modalErr" class="alert-pro danger mb-3">
            <i class="bi bi-exclamation-circle"></i> {{ modalErr }}
          </div>
          <div class="mb-3">
            <label class="form-label-pro">Prénom *</label>
            <input class="form-control-pro" v-model="editForm.prenom"
              placeholder="Ex: Victor" />
          </div>
          <div>
            <label class="form-label-pro">Nom *</label>
            <input class="form-control-pro" v-model="editForm.nom"
              placeholder="Ex: Hugo" />
          </div>
        </div>
        <div class="modal-panel-footer">
          <button class="btn-navy" @click="showEdit = false"
            style="padding:10px 20px">Annuler</button>
          <button class="btn-gold" @click="submitEdit" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm"></span>
            <i v-else class="bi bi-check-lg"></i> Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!--  Modal l suppression-->
    <div class="modal-overlay" v-if="showDelete" @click.self="showDelete = false">
      <div class="modal-panel" style="max-width:360px">
        <div class="modal-panel-body" style="padding:36px 28px;text-align:center">
          <div class="confirm-icon"><i class="bi bi-trash3"></i></div>
          <h4 style="font-family:'Playfair Display',serif;margin-bottom:8px">
            Supprimer cet auteur ?
          </h4>
          <p style="color:var(--text-muted);font-size:0.9rem">
            <strong>{{ selected?.prenom }} {{ selected?.nom }}</strong>
            sera définitivement supprimé.
          </p>

              <!--  ken auteur 3andou livres attachées : impossible de supprimer -->
           <div v-if="selected?.listeLivres?.length" class="alert-pro danger mt-3">
       Impossible de supprimer ! cet auteur est lié à 
       {{ selected.listeLivres.length }} livre(s) 
      </div>

      <div class="d-flex gap-3 justify-content-center mt-4">

        <button
          class="btn-navy"
          @click="showDelete = false"
          style="padding:10px 22px"
        >
          Annuler
        </button>
        <button
          class="btn-gold"
          style="background:linear-gradient(135deg,#e05252,#b83535);
                 box-shadow:0 2px 12px rgba(224,82,82,0.35)"
                @click="submitDelete"
                  :style="selected?.listeLivres?.length > 0 
                  ? 'opacity:0.4;cursor:not-allowed;filter:grayscale(100%)' 
                : ''"
        >
            <span v-if="saving" class="spinner-border spinner-border-sm"></span>

            <i v-else class="bi bi-trash"></i>

            Supprimer
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
import { getAllAuthors, addAuthor, updateAuthor, deleteAuthor } from '../services/api.js'

const authors    = ref([])
const loading    = ref(true)
const saving     = ref(false)
const error      = ref('')
const modalErr   = ref('')
const showAdd    = ref(false)
const showEdit   = ref(false)
const showDelete = ref(false)
const selected   = ref(null)

//formulaires reactifs sta3mlna reactive bech directement n3aytou addForm.prenom 
const addForm  = reactive({ prenom: '', nom: '' })
const editForm = reactive({ prenom: '', nom: '' })

// jebna les auteurs mel API ba3ed matal3ou l DOM bel onMounted
onMounted(loadAuthors)

//fonction pour charger les auteurs
async function loadAuthors() {
  loading.value = true
  error.value   = ''
  try {
    const res     = await getAllAuthors()
    authors.value = res.data
  } catch {
    error.value = 'Impossible de charger les auteurs'
  } finally {
    loading.value = false
  }
}

//Modal ajout + yabda feragh
function openAdd() {
  addForm.prenom  = ''
  addForm.nom     = ''
  modalErr.value  = ''
  showAdd.value   = true
}

//Modal edit + fih les donnees l9dom eli bch na3mloulhom edit
function openEdit(author) {
  selected.value  = author
  editForm.prenom = author.prenom
  editForm.nom    = author.nom
  modalErr.value  = ''
  showEdit.value  = true
}

//modal delete
function openDelete(author) {
  selected.value   = author
  showDelete.value = true
}

//soumission ajout mte3 auteur jdid
async function submitAdd() {
  if (!addForm.prenom || !addForm.nom) {
    modalErr.value = 'Prénom et nom sont obligatoires'
    return
  }
  saving.value = true
  try {
    await addAuthor({ ...addForm })
    showAdd.value = false
    await loadAuthors()
  } catch (e) {
    modalErr.value = e.response?.data?.message || 'Erreur lors de l\'ajout'
  } finally {
    saving.value = false
  }
}

//soumission edit mte3 auteur 
async function submitEdit() {
  if (!editForm.prenom || !editForm.nom) {
    modalErr.value = 'Prénom et nom sont obligatoires'
    return
  }
  saving.value = true
  try {
    await updateAuthor(selected.value.id, { ...editForm })
    showEdit.value = false
    await loadAuthors()
  } catch (e) {
    modalErr.value = e.response?.data?.message || 'Erreur lors de la modification'
  } finally {
    saving.value = false
  }
}
//soumission delete mte3 auteur jdid
async function submitDelete() {
  saving.value = true
  try {
    await deleteAuthor(selected.value.id)
    showDelete.value = false
    await loadAuthors()
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur lors de la suppression'
    showDelete.value = false
  } finally {
    saving.value = false
  }
}
</script>