// // // stores.js
// // import { writable } from 'svelte/store';

// // export const todoItems = writable([]);
// // export const cards = writable([]);

// // export const motivationval = writable([0,0]);

// // export const editorDivStore = writable(null);
// // export const editorTextStore = writable('');

// // // // New store for handling two-sided cards
// // // export const twoSidedCards = writable([]);

// import { writable, get } from "svelte/store"



// // Create the stores
// export const todoItems = writable({
//   Kemia: [],
//   matematiikka: [],
// })

// // export const cards = writable([])
// export const cards = writable({
//   kemia: [],
//   matematiikka: [],
// })


// export const motivationval = writable([0, 0])
// // export const editorTextStore = writable("")

// export const editorTextStore = writable({
//   kemia: "",
//   matematiikka: "",
//   // lisää esimerkkejä
// });

// export const editorDivStore = writable(null)

// let initialized = false
// let isLoading = false
// let isSaving = false

// // Initialize stores immediately when module loads
// if (typeof window !== "undefined" && window.electronAPI) {
//   initializeStores()
// }

// async function initializeStores() {
//   if (initialized || isLoading) return
  
//   isLoading = true
//   console.log("Starting store initialization...")
  
//   try {
//     const data = await window.electronAPI.loadFile()
//     console.log("Loaded data:", data)
    
//     // Set initial values without triggering saves
//     if (data?.todoItems) todoItems.set(data.todoItems)
//     if (data?.cards) cards.set(data.cards)
//     if (data?.motivationval) motivationval.set(data.motivationval)
    
//     // Handle editor text specially
//     if (data?.editorText && data.editorText.trim() !== '') {
//       console.log("Setting editor text:", data.editorText)
//       editorTextStore.set(data.editorText)
//     } else {
//       console.log("No editor text found, setting default")
//       editorTextStore.set('')
//     }
    
//     // Set up last values after initialization
//     setTimeout(() => {
//       lastTodoItems = get(todoItems)
//       lastCards = get(cards)
//       lastMotivationval = get(motivationval)
//       lastEditorText = get(editorTextStore)
      
//       initialized = true
//       isLoading = false
//       console.log("Stores initialized successfully")
//     }, 100)
    
//   } catch (error) {
//     console.error("Error initializing stores:", error)
//     editorTextStore.set('')
//     initialized = true
//     isLoading = false
//   }
// }

// // Save function
// function saveAll() {
//   if (!initialized || isLoading || isSaving || typeof window === "undefined" || !window.electronAPI) return
  
//   isSaving = true
  
//   const payload = {
//     todoItems: get(todoItems),
//     cards: get(cards),
//     motivationval: get(motivationval),
//     editorText: get(editorTextStore),
//   }
  
//   console.log("Saving payload:", payload)
  
//   try {
//     window.electronAPI.saveFile(payload)
//   } catch (error) {
//     console.error("Error saving:", error)
//   } finally {
//     // Reset saving flag after a short delay
//     setTimeout(() => {
//       isSaving = false
//     }, 500)
//   }
// }

// // Debounce saves
// function debounce(func, wait) {
//   let timeout
//   return function executedFunction(...args) {
//     const later = () => {
//       clearTimeout(timeout)
//       func(...args)
//     }
//     clearTimeout(timeout)
//     timeout = setTimeout(later, wait)
//   }
// }

// const debouncedSave = debounce(saveAll, 2000) // 2 second debounce

// // Track last values to prevent unnecessary saves
// let lastTodoItems = null
// let lastCards = null
// let lastMotivationval = null
// let lastEditorText = null

// // Set up subscriptions
// todoItems.subscribe((value) => {
//   if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastTodoItems)) {
//     lastTodoItems = structuredClone(value)
//     console.log("Todo items changed, saving...")
//     debouncedSave()
//   }
// })

// cards.subscribe((value) => {
//   if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastCards)) {
//     lastCards = structuredClone(value)
//     console.log("Cards changed, saving...")
//     debouncedSave()
//   }
// })

// motivationval.subscribe((value) => {
//   if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastMotivationval)) {
//     lastMotivationval = structuredClone(value)
//     console.log("Motivation val changed, saving...")
//     debouncedSave()
//   }
// })

// editorTextStore.subscribe((value) => {
//   if (initialized && !isLoading && !isSaving && value !== lastEditorText && value !== undefined) {
//     lastEditorText = value
//     console.log("Editor text changed, saving...", value?.substring(0, 50))
//     debouncedSave()
//   }
// })

// // Export initialization function
// export { initializeStores }


// stores.js
import { writable, get } from "svelte/store";

// --- New Type Definitions (for clarity, can be removed if not using JSDoc/TypeScript) ---
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
// --- End Type Definitions ---


// Create the stores
export const todoItems = writable({
  Kemia: [],
  matematiikka: [],
});

// --- CHANGE 1: cards store now uses flattened keys ---
export const cards = writable({}); // Initialize as empty object, will be populated on load


export const motivationval = writable([0, 0]);

// --- CHANGE 2: editorTextStore also uses flattened keys ---
export const editorTextStore = writable({}); // Initialize as empty object, will be populated on load


export const editorDivStore = writable(null);

let initialized = false;
let isLoading = false;
let isSaving = false;

// Initialize stores immediately when module loads
if (typeof window !== "undefined" && window.electronAPI) {
  initializeStores();
}

async function initializeStores() {
  if (initialized || isLoading) return;

  isLoading = true;
  console.log("Starting store initialization...");

  try {
    const data = await window.electronAPI.loadFile();
    console.log("Loaded data:", data);

    // Set initial values without triggering saves
    if (data?.todoItems) todoItems.set(data.todoItems);
    // --- CHANGE 3: Handle cards with flattened structure ---
    if (data?.cards) {
        cards.set(data.cards);
    } else {
        cards.set({}); // Ensure it's an empty object if no data
    }

    if (data?.motivationval) motivationval.set(data.motivationval);

    // --- CHANGE 4: Handle editorTextStore with flattened structure ---
    if (data?.editorText) {
      editorTextStore.set(data.editorText);
    } else {
      editorTextStore.set({}); // Ensure it's an empty object if no data
    }


    // Set up last values after initialization
    setTimeout(() => {
      lastTodoItems = get(todoItems);
      lastCards = get(cards);
      lastMotivationval = get(motivationval);
      lastEditorText = get(editorTextStore); // lastEditorText now holds an object

      initialized = true;
      isLoading = false;
      console.log("Stores initialized successfully");
    }, 100);

  } catch (error) {
    console.error("Error initializing stores:", error);
    // On error, ensure stores are in a predictable, empty state
    cards.set({});
    editorTextStore.set({});
    initialized = true;
    isLoading = false;
  }
}

// Save function
function saveAll() {
  if (!initialized || isLoading || isSaving || typeof window === "undefined" || !window.electronAPI) return;

  isSaving = true;

  const payload = {
    todoItems: get(todoItems),
    // --- CHANGE 5: cards store is already in the correct flattened format ---
    cards: get(cards),
    motivationval: get(motivationval),
    // --- CHANGE 6: editorTextStore is already in the correct flattened format ---
    editorText: get(editorTextStore),
  };

  console.log("Saving payload:", payload);

  try {
    window.electronAPI.saveFile(payload);
  } catch (error) {
    console.error("Error saving:", error);
  } finally {
    // Reset saving flag after a short delay
    setTimeout(() => {
      isSaving = false;
    }, 500);
  }
}

// Debounce saves
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

const debouncedSave = debounce(saveAll, 2000); // 2 second debounce

// Track last values to prevent unnecessary saves
let lastTodoItems = null;
let lastCards = null;
let lastMotivationval = null;
// --- CHANGE 7: lastEditorText now tracks an object, so JSON.stringify for comparison ---
let lastEditorText = null;


// Set up subscriptions
todoItems.subscribe((value) => {
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastTodoItems)) {
    lastTodoItems = structuredClone(value);
    console.log("Todo items changed, saving...");
    debouncedSave();
  }
});

cards.subscribe((value) => {
  // --- CHANGE 8: Comparison for cards needs to be deep if structure changes ---
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastCards)) {
    lastCards = structuredClone(value);
    console.log("Cards changed, saving...");
    debouncedSave();
  }
});

motivationval.subscribe((value) => {
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastMotivationval)) {
    lastMotivationval = structuredClone(value);
    console.log("Motivation val changed, saving...");
    debouncedSave();
  }
});

editorTextStore.subscribe((value) => {
  // --- CHANGE 9: Comparison for editorTextStore needs to be deep ---
  if (initialized && !isLoading && !isSaving && JSON.stringify(value) !== JSON.stringify(lastEditorText) && value !== undefined) {
    lastEditorText = structuredClone(value); // Deep clone for object comparison
    console.log("Editor text store changed, saving..."); // Removed substring as value is now an object
    debouncedSave();
  }
});

// Export initialization function
export { initializeStores };
