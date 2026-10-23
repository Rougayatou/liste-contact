import { computed, reactive } from 'vue'

const defaultContacts = [
  {
    id: 1,
    nom: 'Bah',
    prenom: 'Aboubacar',
    telephone: '06 23 45 67 89',
    email: 'bahaboubacar8958@gmail.com',
    photo: '/images/1.jpg',
  },
  {
    id: 2,
    nom: 'Diallo',
    prenom: 'Aïcha',
    telephone: '06 34 56 78 90',
    email: 'aicha.diallo@gmail.com',
    photo: '/images/2.jpg',
  },
  {
    id: 3,
    nom: 'Diallo',
    prenom: 'Mamadou Aliou',
    telephone: '06 56 78 90 12',
    email: 'alioudiallo@gmail.com',
    photo: '/images/3.jpg',
  },
  {
    id: 4,
    nom: 'DIALLO',
    prenom: 'Rougayatou',
    telephone: '06 12 34 56 78',
    email: 'rougayatou2205@gmail.com',
    photo: '/images/4.jpg',
  },
  {
    id: 5,
    nom: 'Tolno',
    prenom: 'Emile',
    telephone: '06 45 67 89 01',
    email: 'emiletolno12@gmail.com',
    photo: '/images/5.png',
  },
]

const storageKey = 'vue-contacts-v2'

function readContacts() {
  try {
    const savedContacts = localStorage.getItem(storageKey)
    return savedContacts ? JSON.parse(savedContacts) : defaultContacts
  } catch {
    return defaultContacts
  }
}

const contacts = reactive(readContacts())

function saveContacts() {
  localStorage.setItem(storageKey, JSON.stringify(contacts))
}

export function useContacts() {
  const sortedContacts = computed(() =>
    [...contacts].sort((first, second) =>
      `${first.nom} ${first.prenom}`.localeCompare(`${second.nom} ${second.prenom}`),
    ),
  )

  function getContact(id) {
    return contacts.find((contact) => contact.id === Number(id))
  }

  function saveContact(contactData) {
    const index = contacts.findIndex((contact) => contact.id === contactData.id)
    if (index === -1) {
      contacts.push(contactData)
    } else {
      contacts[index] = { ...contactData }
    }
    saveContacts()
  }

  function createContact() {
    return {
      id: Date.now(),
      nom: '',
      prenom: '',
      telephone: '',
      email: '',
      photo: '',
    }
  }

  return { contacts: sortedContacts, getContact, saveContact, createContact }
}

export function getInitials(contact) {
  return `${contact.prenom?.trim().charAt(0) || ''}${contact.nom?.trim().charAt(0) || ''}`.toUpperCase() || '?'
}
