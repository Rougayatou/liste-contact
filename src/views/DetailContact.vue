<script setup>
import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getInitials, useContacts } from '../data/contacts'

const route = useRoute()
const router = useRouter()
const { getContact, saveContact, createContact } = useContacts()
const isNew = computed(() => route.params.id === 'nouveau')
const originalContact = isNew.value ? createContact() : getContact(route.params.id)
const contact = reactive({ ...(originalContact || createContact()) })
const photoInput = ref(null)
const videoElement = ref(null)
const cameraStream = ref(null)
const showCamera = ref(false)
const errorMessage = ref('')

function choosePhoto() {
  photoInput.value?.click()
}

function updatePhoto(event) {
  const file = event.target.files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    errorMessage.value = 'Veuillez choisir un fichier image.'
    return
  }
  contact.photo = URL.createObjectURL(file)
  errorMessage.value = ''
}

async function openCamera() {
  if (!navigator.mediaDevices?.getUserMedia) {
    errorMessage.value = 'La caméra n’est pas disponible dans ce navigateur. Utilisez la galerie.'
    return
  }

  try {
    cameraStream.value = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
    showCamera.value = true
    await new Promise((resolve) => requestAnimationFrame(resolve))
    videoElement.value.srcObject = cameraStream.value
    await videoElement.value.play()
    errorMessage.value = ''
  } catch {
    errorMessage.value = 'Impossible d’accéder à la caméra. Autorisez-la ou choisissez une photo dans la galerie.'
    stopCamera()
  }
}

function takePhoto() {
  const canvas = document.createElement('canvas')
  canvas.width = videoElement.value.videoWidth
  canvas.height = videoElement.value.videoHeight
  canvas.getContext('2d').drawImage(videoElement.value, 0, 0)
  contact.photo = canvas.toDataURL('image/jpeg', 0.9)
  stopCamera()
}

function stopCamera() {
  cameraStream.value?.getTracks().forEach((track) => track.stop())
  cameraStream.value = null
  showCamera.value = false
}

onBeforeUnmount(stopCamera)

function save() {
  if (!contact.nom.trim() || !contact.prenom.trim() || !contact.telephone.trim()) {
    errorMessage.value = 'Le nom, le prénom et le téléphone sont obligatoires.'
    return
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    errorMessage.value = 'Veuillez saisir une adresse e-mail valide.'
    return
  }
  saveContact({ ...contact, nom: contact.nom.trim(), prenom: contact.prenom.trim() })
  router.push('/')
}
</script>

<template>
  <main class="detail-page">
    <section class="detail-card">
      <div class="detail-heading">
        <h1>Fiche contact — {{ isNew ? 'Ajout' : 'Modification' }}</h1>
      </div>

      <div class="profile-area">
        <img v-if="contact.photo" class="large-avatar" :src="contact.photo" :alt="`Photo de ${contact.prenom} ${contact.nom}`" />
        <div v-else class="large-avatar avatar-initials" :aria-label="`Initiales de ${contact.prenom} ${contact.nom}`">
          {{ getInitials(contact) }}
        </div>
      </div>

      <div v-if="showCamera" class="camera-panel">
        <video ref="videoElement" autoplay muted playsinline aria-label="Aperçu de la caméra"></video>
        <div class="camera-actions">
          <button class="button button-primary" type="button" @click="takePhoto">Prendre la photo</button>
          <button class="button button-light" type="button" @click="stopCamera">Fermer</button>
        </div>
      </div>

      <form @submit.prevent="save" novalidate>
        <div class="form-grid">
          <label>Nom <input v-model="contact.nom" type="text" placeholder="Ex. Diallo" /></label>
          <label>Prénom <input v-model="contact.prenom" type="text" placeholder="Ex. Aminata" /></label>
          <label>Téléphone <input v-model="contact.telephone" type="tel" placeholder="06 00 00 00 00" /></label>
          <label>E-mail <input v-model="contact.email" type="email" placeholder="nom@example.com" /></label>
        </div>
        <p v-if="errorMessage" class="error-message" role="alert">{{ errorMessage }}</p>
        <div class="actions">
          <a class="button button-call" :href="`tel:${contact.telephone.replaceAll(' ', '')}`">Appeler</a>
          <a class="button button-email" :href="`mailto:${contact.email}`">E-mail</a>
          <button class="button button-gallery" type="button" @click="choosePhoto">Galerie</button>
          <button class="button button-camera" type="button" @click="openCamera">Caméra</button>
          <RouterLink class="button button-light" to="/">Retour</RouterLink>
          <button class="button button-save" type="submit">Enregistrer</button>
        </div>
      </form>
      <input ref="photoInput" class="hidden-input" type="file" accept="image/*" capture="environment" @change="updatePhoto" />
    </section>
  </main>
</template>

<style scoped>
.detail-page { max-width: 760px; margin: 0 auto; }
.detail-card { background: white; border: 1px solid #cbd5e1; border-radius: 0 0 8px 8px; padding: 1.25rem 1.5rem 2.5rem; box-shadow: 0 8px 18px #1e3a8a10; }
h1 { color: #1e293b; font-size: 1.8rem; font-weight: 800; margin: 0 0 1rem; }
.profile-area { display: flex; justify-content: center; margin-bottom: 1rem; }
.large-avatar { align-items: center; background: #dbeafe; border-radius: 50%; display: flex; height: 130px; justify-content: center; object-fit: cover; width: 130px; }
.avatar-initials { color: #3654ae; font-size: 2rem; font-weight: 800; }
.hidden-input { display: none; }
.camera-panel { background: #0f172a; border-radius: 16px; margin: -1rem 0 1.8rem; padding: 1rem; }
.camera-panel video { background: #020617; border-radius: 10px; display: block; max-height: 320px; object-fit: cover; width: 100%; }
.camera-actions { display: flex; gap: .75rem; justify-content: center; margin-top: 1rem; }
.button { border: 0; border-radius: 11px; cursor: pointer; display: inline-flex; font: inherit; font-weight: 700; padding: .75rem 1rem; text-decoration: none; }
.button-primary { background: #2563eb; color: white; }
.button-call { background: #15936c; color: white; }
.button-email { background: #287bd3; color: white; }
.button-gallery, .button-camera { background: #6651bc; color: white; }
.button-light { background: #f1f5f9; color: #475569; }
.form-grid { display: grid; gap: 1.1rem; grid-template-columns: 1fr 1fr; }
label { color: #334155; display: flex; flex-direction: column; font-size: .9rem; font-weight: 700; gap: .4rem; }
input { border: 2px solid #cbd5e1; border-radius: 6px; color: #334155; font: inherit; padding: .65rem .75rem; }
input:focus { border-color: #2563eb; outline: 3px solid #dbeafe; }
.error-message { background: #fef2f2; border-radius: 8px; color: #b91c1c; margin-top: 1rem; padding: .7rem; }
.actions { display: grid; gap: .75rem; grid-template-columns: repeat(4, 1fr); margin-top: 1.6rem; }
.actions .button { justify-content: center; }
.actions .button-light { grid-column: 3; }
.button-save { background: #15936c; color: white; grid-column: 4; }
@media (max-width: 560px) {
  .form-grid { grid-template-columns: 1fr; }
  .actions { grid-template-columns: 1fr 1fr; }
  .actions .button-light, .button-save { grid-column: auto; }
}
</style>
