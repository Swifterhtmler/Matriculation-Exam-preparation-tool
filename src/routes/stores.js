import { writable, get } from "svelte/store"

// --- Type Definitions ---
/**
 * @typedef {Object} Flashcard
 * @property {string} front
 * @property {string} back
 */
/**
 * @typedef {Object.<string, Flashcard[]>} AllCards
 * Key is a flattened string like "subject__chapter" (e.g., "kemia__luku1")
 */
/**
 * @typedef {Object.<string, string>} EditorTexts
 * Key is a flattened string like "subject__chapter"
 */
/**
 * @typedef {Object.<string, string>} QuillEditorContents
 * Key is a flattened string like "subject__chapter"
 */

// Create the stores
export const todoItems = writable({
  Kemia: [],
  matematiikka: [],
})

// Cards store uses flattened keys
export const cards = writable({})

export const motivationval = writable([0, 0])

// EditorTextStore uses flattened keys
export const editorTextStore = writable({})

export const editorDivStore = writable(null)

// CHANGED: QuillEditor content now uses flattened keys like cards
export const quillEditorContent = writable({})

let initialized = false
let isLoading = false
let isSaving = false

// Initialize stores immediately when module loads
if (typeof window !== "undefined" && window.electronAPI) {
  initializeStores()
}

async function initializeStores() {
  if (initialized || isLoading) return
  isLoading = true
  console.log("Starting store initialization...")

  try {
    const data = await window.electronAPI.loadFile()
    console.log("Loaded data:", data)

    // Set initial values without triggering saves
    if (data?.todoItems) todoItems.set(data.todoItems)

    // Handle cards with flattened structure
    if (data?.cards) {
      cards.set(data.cards)
    } else {
      cards.set({})
    }

    if (data?.motivationval) motivationval.set(data.motivationval)

    // Handle editorTextStore with flattened structure
    if (data?.editorText) {
      editorTextStore.set(data.editorText)
    } else {
      editorTextStore.set({})
    }

    // CHANGED: Handle quillEditorContent with flattened structure
    if (data?.quillEditorContent) {
      // Check if it's the old single string format and migrate
      if (typeof data.quillEditorContent === "string") {
        console.log("Migrating quillEditorContent from string to object format")
        quillEditorContent.set({})
      } else {
        quillEditorContent.set(data.quillEditorContent)
      }
    } else {
      quillEditorContent.set({})
    }

    // Set up last values after initialization
    setTimeout(() => {
      lastTodoItems = get(todoItems)
      lastCards = get(cards)
      lastMotivationval = get(motivationval)
      lastEditorText = get(editorTextStore)
      lastQuillEditorContent = get(quillEditorContent)
      initialized = true
      isLoading = false
      console.log("Stores initialized successfully")
    }, 100)
  } catch (error) {
    console.error("Error initializing stores:", error)
    // On error, ensure stores are in a predictable, empty state
    cards.set({})
    editorTextStore.set({})
    quillEditorContent.set({})
    initialized = true
    isLoading = false
  }
}

// Save function
function saveAll() {
  if (!initialized || isLoading || isSaving || typeof window === "undefined" || !window.electronAPI) return
  isSaving = true

  const payload = {
    todoItems: get(todoItems),
    cards: get(cards),
    motivationval: get(motivationval),
    editorText: get(editorTextStore),
    quillEditorContent: get(quillEditorContent), // Now an object with flattened keys
  }

  console.log("Saving payload:", payload)

  try {
    window.electronAPI.saveFile(payload)
  } catch (error) {
    console.error("Error saving:", error)
  } finally {
    // Reset saving flag after a short delay
    setTimeout(() => {
      isSaving = false
    }, 500)
  }
}

// Debounce saves
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

const debouncedSave = debounce(saveAll, 2000)

// Track last values to prevent unnecessary saves
let lastTodoItems = null
let lastCards = null
let lastMotivationval = null
let lastEditorText = null
let lastQuillEditorContent = null

// Set up subscriptions
todoItems.subscribe((value) => {
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastTodoItems)) {
    lastTodoItems = structuredClone(value)
    console.log("Todo items changed, saving...")
    debouncedSave()
  }
})

cards.subscribe((value) => {
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastCards)) {
    lastCards = structuredClone(value)
    console.log("Cards changed, saving...")
    debouncedSave()
  }
})

motivationval.subscribe((value) => {
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastMotivationval)) {
    lastMotivationval = structuredClone(value)
    console.log("Motivation val changed, saving...")
    debouncedSave()
  }
})

editorTextStore.subscribe((value) => {
  if (
    initialized &&
    !isLoading &&
    !isSaving &&
    JSON.stringify(value) !== JSON.stringify(lastEditorText) &&
    value !== undefined
  ) {
    lastEditorText = structuredClone(value)
    console.log("Editor text store changed, saving...")
    debouncedSave()
  }
})

// CHANGED: QuillEditor content subscription now handles object comparison
quillEditorContent.subscribe((value) => {
  if (
    initialized &&
    !isLoading &&
    !isSaving &&
    JSON.stringify(value) !== JSON.stringify(lastQuillEditorContent) &&
    value !== undefined
  ) {
    lastQuillEditorContent = structuredClone(value)
    console.log("Quill editor content changed, saving...")
    debouncedSave()
  }
})

// Export initialization function
export { initializeStores }