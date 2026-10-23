<script setup>
import { RouterLink } from 'vue-router'
import { getInitials, useContacts } from '../data/contacts'

const { contacts } = useContacts()
</script>

<template>
  <main class="page">
    <section class="hero">
      <div>
        <p class="eyebrow">Mon répertoire</p>
        <h1>Mes contacts</h1>
        <p class="intro">Retrouvez facilement les personnes importantes pour vous.</p>
      </div>
      <RouterLink class="button button-primary" to="/contact/nouveau">
        <span aria-hidden="true">+</span>
        Ajouter un contact
      </RouterLink>
    </section>

    <section class="contact-list" aria-label="Liste des contacts">
      <article v-for="contact in contacts" :key="contact.id" class="contact-card">
        <img v-if="contact.photo" class="avatar" :src="contact.photo" :alt="`Photo de ${contact.prenom} ${contact.nom}`" />
        <div v-else class="avatar avatar-initials" :aria-label="`Initiales de ${contact.prenom} ${contact.nom}`">
          {{ getInitials(contact) }}
        </div>
        <div class="contact-info">
          <h2>{{ contact.prenom }} {{ contact.nom }}</h2>
          <a :href="`tel:${contact.telephone.replaceAll(' ', '')}`" class="phone">
            <span aria-hidden="true">☎</span>
            {{ contact.telephone }}
          </a>
          <p class="email">{{ contact.email }}</p>
        </div>
        <RouterLink class="button button-secondary" :to="`/contact/${contact.id}`">
          Modifier
        </RouterLink>
      </article>
    </section>

    <p v-if="contacts.length === 0" class="empty-state">
      Aucun contact pour le moment. Cliquez sur « Ajouter un contact » pour commencer.
    </p>
  </main>
</template>

<style scoped>
.page { max-width: 920px; margin: 0 auto; }
.hero { display: flex; justify-content: space-between; align-items: end; gap: 2rem; margin-bottom: 2rem; }
.eyebrow { color: #64748b; font-size: .8rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
h1 { color: #172554; font-size: clamp(2rem, 5vw, 3.25rem); font-weight: 800; line-height: 1.1; margin: .35rem 0 .65rem; }
.intro { color: #64748b; font-size: 1.05rem; }
.button { border: 0; border-radius: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: .5rem; font: inherit; font-weight: 700; padding: .8rem 1rem; text-decoration: none; white-space: nowrap; }
.button-primary { background: #2563eb; color: white; box-shadow: 0 8px 18px #2563eb33; }
.button-primary:hover { background: #1d4ed8; }
.button-secondary { background: #eff6ff; color: #1d4ed8; }
.button-secondary:hover { background: #dbeafe; }
.contact-list { display: grid; gap: 1rem; }
.contact-card { align-items: center; background: white; border: 1px solid #e2e8f0; border-radius: 18px; display: flex; gap: 1rem; padding: 1rem 1.2rem; box-shadow: 0 5px 18px #1e3a8a0d; }
.avatar { background: #dbeafe; border: 3px solid #dbeafe; border-radius: 50%; height: 72px; object-fit: cover; width: 72px; }
.contact-info { flex: 1; min-width: 0; }
h2 { color: #172554; font-size: 1.1rem; font-weight: 700; margin-bottom: .3rem; }
.phone { color: #2563eb; font-weight: 600; text-decoration: none; }
.phone span { font-size: .85rem; margin-right: .35rem; }
.email { color: #64748b; font-size: .9rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.empty-state { background: white; border: 1px dashed #94a3b8; border-radius: 14px; color: #64748b; padding: 2rem; text-align: center; }
@media (max-width: 620px) {
  .hero { align-items: stretch; flex-direction: column; gap: 1rem; }
  .hero .button { justify-content: center; }
  .contact-card { align-items: flex-start; flex-wrap: wrap; }
  .contact-card .button { margin-left: 88px; width: calc(100% - 88px); justify-content: center; }
}
</style>
