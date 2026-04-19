 <!-- Component BookForm --> 
<template>
  <div class="row g-3">
    <div class="col-12">
      <label class="form-label-pro">Titre *</label>
      <input class="form-control-pro" v-model="form.title" placeholder="Titre du livre" />
    </div>
    <div class="col-md-6">
      <label class="form-label-pro">Éditeur</label>
      <input class="form-control-pro" v-model="form.editor" placeholder="Ex: Gallimard" />
    </div>
    <div class="col-md-6">
      <label class="form-label-pro">Année</label>
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
      <textarea class="form-control-pro" v-model="form.description" rows="3"
        placeholder="Résumé ou notes..."></textarea>
    </div>
    <div class="col-12">
      <label class="form-label-pro">Auteur</label>
      <select class="form-control-pro" v-model="form.author_id">
        <option value="">— Sélectionner un auteur —</option>
         <option v-for="author in authors" :key="author.id" :value="author.id"
         >
    {{ author.nom }} {{ author.prenom }}
  </option>
      </select>
    </div>
  </div>
</template>

<script setup>
//props bech na3tiwhom lel form w lel liste ta3 les auteurs mel parent component
defineProps({
  form:    { type: Object, required: true },
  authors: { type: Array,  default: () => [] },
})

function onImgError(e) {
  e.target.src = 'https://placehold.co/42x52/1e2f45/c9a84c?text=📖'
}
</script>
