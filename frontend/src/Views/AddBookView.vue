 <!-- Add book -->  
<template>
  <AppLayout title="Ajouter un livre">
    <div class="page-header">
      <div>
        <h1 class="page-title">Ajouter un livre</h1>
        <p class="page-subtitle">Enrichissez la bibliothèque</p>
      </div>
    </div>

    <div class="row justify-content-center">
      <div class="col-lg-7">
        <div class="data-table-wrap" style="padding:32px">
          <div v-if="error"   class="alert-pro danger mb-4"><i class="bi bi-exclamation-circle"></i> {{ error }}</div>
          <div v-if="success" class="alert-pro success mb-4"><i class="bi bi-check-circle"></i> {{ success }}</div>

          <div class="row g-3">
            <div class="col-12">
              <label class="form-label-pro">Titre *</label>
              <input class="form-control-pro" v-model="form.title" placeholder="Le titre du livre" />
            </div>
            <div class="col-md-6">
              <label class="form-label-pro">Éditeur</label>
              <input class="form-control-pro" v-model="form.editor" placeholder="Ex: Gallimard" />
            </div>
            <div class="col-md-6">
              <label class="form-label-pro">Année de publication</label>
              <input class="form-control-pro" type="number" v-model="form.year" placeholder="2026" />
            </div>
            <div class="col-12">
              <label class="form-label-pro">URL de l'image</label>
              <input class="form-control-pro" v-model="form.image" placeholder="https://..." />
              <div v-if="form.image" style="margin-top:10px;border-radius:8px;overflow:hidden;width:100px;height:120px;border:1px solid var(--border)">
                <img :src="form.image" style="width:100%;height:100%;object-fit:cover" @error="imgPreviewErr" />
              </div>
            </div>
            <div class="col-12">
              <label class="form-label-pro">Description</label>
              <textarea class="form-control-pro" v-model="form.description" rows="4"
                placeholder="Un résumé ou une note..."></textarea>
            </div>
           <div class="col-12">
  <label class="form-label-pro">Auteur</label>
  <select class="form-control-pro" v-model="form.authorId">
  <option disabled value="">-- Choisir un auteur --</option>
  <option 
    v-for="author in authors" 
    :key="author.id" 
    :value="author.id"
  >
    {{ author.nom }} {{ author.prenom }}
  </option>
</select>
</div>
          </div>

          <div class="d-flex justify-content-end gap-3 mt-4">
            <button class="btn-navy" @click="reset" style="padding:10px 22px">
              <i class="bi bi-arrow-counterclockwise"></i> Réinitialiser
            </button>
            <button class="btn-gold" @click="submit" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm"></span>
              <i v-else class="bi bi-plus-circle"></i>
              Ajouter le livre
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
import BookForm  from '../components/BookForm.vue'
import { getAllAuthors, addBook } from '../services/api.js'

const authors = ref([]) // bech nestockiw les auteurs jeyin mel API
const error   = ref('')
const success = ref('')
const loading = ref(false)
//sta3mlna reactive khtrr form fih des objets w bch nbadlou fih les valeurs mta3 les champs,
// contrairement lil ref li ken bech nbadlou la valeur kima form.value.title w reactive nbadlou form.title direct 
const form = reactive({ title: '', image: '', editor: '', year: '', description: '', author_id: '' })

//chargement mte3 les auteurs m3a l mounted mte3 Dom bech naffichi les auteurs fi select
onMounted(async () => {
  try {
    const res = await getAllAuthors()
     console.log(res.data)  
    authors.value = res.data
  } catch {}
})

function reset() {
  Object.keys(form).forEach((k) => (form[k] = ''))
}

//soumission du formulaire
async function submit() {
  error.value = ''
  success.value = ''
  if (!form.title) { error.value = 'Le titre est obligatoire'; return }
  loading.value = true
  try {
    //sta3mla await khtrr addBook fonction async 
    await addBook({ ...form })
    success.value = 'Livre ajouté avec succès !'
    reset()
  } catch (e) {
    error.value = e.response?.data?.message || 'Échec de l\'ajout'
  } finally {
    loading.value = false
  }
}
</script>