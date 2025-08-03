<script lang="ts">
  import { cards } from "./stores.js"; 

  export let subject = ""; 

  let showPopUp = false;

  // --- NEW/ADJUSTED: Variables for popup state ---
  let currentCardIndex = 0; // To track which card is being viewed inside the popup
  let popupCardFlipped = false; // Separate flip state for the card inside the popup

  // --- NEW: Functions for popup card navigation and flip ---
  function togglePopupCardFlip() {
    popupCardFlipped = !popupCardFlipped;
  }

  function removeCurrentCard() {
    if (subjectCards.length === 0) return; // No cards to remove

    cards.update(allSubjectsCards => {
      const updated = { ...allSubjectsCards };
      // Create a new array, excluding the card at currentCardIndex
      updated[subject] = updated[subject].filter((_, index) => index !== currentCardIndex);
      return updated;
    });

    // After removal, adjust currentCardIndex:
    // If the last card was removed, move to the previous one
    // If it was the only card, currentCardIndex will naturally be 0 for an empty array
    if (currentCardIndex >= subjectCards.length - 1 && subjectCards.length > 1) {
      currentCardIndex--;
    } else if (subjectCards.length === 1) { // If it was the last card in the list
      currentCardIndex = 0; // Reset to 0 as the list is now empty or about to be empty
      // Optionally, close the popup if all cards are deleted
      closePopup();
    }
    // No need to reset popupCardFlipped here, as the card itself is gone.
    // The next card will load unflipped if the index changes.
    console.log(`Card at index ${currentCardIndex} removed from ${subject}!`);
  }

  function showNextCard() {
    if (currentCardIndex < subjectCards.length - 1) {
      currentCardIndex++;
      popupCardFlipped = false; // Reset flip when moving to a new card
    } else {
      // Optional: Loop back to the first card if at the end
      currentCardIndex = 0;
      popupCardFlipped = false;
    }
  }

  function showPreviousCard() {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      popupCardFlipped = false; // Reset flip when moving to a new card
    } else {
      // Optional: Loop to the last card if at the beginning
      currentCardIndex = subjectCards.length - 1;
      popupCardFlipped = false;
    }
  }

  function previewCard() {
    showPopUp = true;
    currentCardIndex = 0; // Always start at the first card when opening the popup
    popupCardFlipped = false; // Ensure it's unflipped
    console.log("Opening popup. Current subject cards:", subjectCards);
  }

  function closePopup() { // Consolidated popup closing function
    showPopUp = false;
  }

  function escapeEvent(event: KeyboardEvent) {  
    if (event.key === "Escape") {
      closePopup();
    }
  }

  // Use the derived value from the 'cards' store for this subject
  $: subjectCards = $cards[subject] ?? [];

  let cardText = ""; // Binds to the front input field
  let cardTextBack = ""; // Binds to the back input field
  let isFlipped = false; // Controls card flip animation for the main input card

  // Reactive declaration for number of cards (now derived from the store)
  $: number = subjectCards.length;

  function flipCard() { // This is for the main input card
    isFlipped = !isFlipped;
  }

  // --- REVISED ADD CARD LOGIC TO USE THE SVELTE STORE ---
  function addCard(event: Event) {
    if (event) event.preventDefault(); // Prevent form submission
    if (cardText.trim() === "" || cardTextBack.trim() === "") return; // Don't add empty cards

    // Update the 'cards' store using its update method
    cards.update(allSubjectsCards => {
      const updated = { ...allSubjectsCards }; // Create a shallow copy of the entire cards object
      // Add the new card to the specific subject's array
      updated[subject] = [...(updated[subject] ?? []), { front: cardText, back: cardTextBack }];
      return updated; // Return the updated object to the store
    });

    // After adding, clear inputs and reset flip state
    cardText = "";
    cardTextBack = "";
    isFlipped = false; // Reset flip for next new card

    console.log(`Card Added to ${subject}! Current cards for ${subject}:`, $cards[subject]);
  }

  // --- NEW: Function to remove the last card ---
  function removeLastCard() {
    if (subjectCards.length > 0) {
      cards.update(allSubjectsCards => {
        const updated = { ...allSubjectsCards };
        // Create a new array that excludes the last element
        updated[subject] = updated[subject].slice(0, -1);
        return updated;
      });
      isFlipped = false; // Reset flip state after removal
      // --- IMPORTANT: Adjust currentCardIndex if the last card was removed ---
      // If the current card was the last one, move index back if possible
      if (currentCardIndex >= subjectCards.length - 1 && subjectCards.length > 1) {
          currentCardIndex--;
      } else if (subjectCards.length === 1) { // If it was the only card, reset to 0 (for empty array)
          currentCardIndex = 0;
      }
    }
  }

  // Input-related keydown handlers (kept as is)
  function handleFrontInputKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      isFlipped = true; // Automatically flip to back on Enter
      // (Focus management for input fields would go here if bind:this were used)
    }
  }

  function handleBackInputKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      event.preventDefault();
      addCard(event); // Call addCard directly
    }
  }

  let bulkImportText = ""; // For textarea input
  let showBulkImport = false; // Toggle for bulk import UI

function parseBulkCards(text) {
  const lines = text.trim().split('\n');
  const cards = [];
  
  for (let i = 0; i < lines.length; i += 2) {
    if (i + 1 < lines.length) {
      cards.push({
        front: lines[i].trim(),      // FIXED: First line becomes front
        back: lines[i + 1].trim()    // FIXED: Second line becomes back
      });
    }
  }
  return cards;
}

  function addBulkCards() {
    if (bulkImportText.trim() === "") return;
    
    const bulkCards = parseBulkCards(bulkImportText);
    
    cards.update(allSubjectsCards => {
      const updated = { ...allSubjectsCards };
      updated[subject] = [...(updated[subject] ?? []), ...bulkCards];
      return updated;
    });
    
    bulkImportText = "";
    showBulkImport = false;
    console.log(`Added ${bulkCards.length} cards to ${subject}!`);
  }
</script>

<div class="container">
  <section class="content-block">

    <h2>{subject}</h2>
    <br>

    <div id="card-Block" role="region">
      <div
        class="card"
        class:flipped={isFlipped}
        onclick={flipCard} onkeydown={(e) => { // Added full keyboard handler for accessibility
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            flipCard();
          }
        }}
        role="button"
        tabindex="0"
      >
        <div class="card-front">
          {cardText || "Kirjoita etupuolen teksti tähän..."}
        </div>
        <div class="card-back">
          {cardTextBack || "Kirjoita takapuolen teksti tähän..."}
        </div>
      </div>

      <br>
      <h5>
        Muistikorttien lukumäärä: {number}
      </h5>

      <br>

      <input
        bind:value={cardText}
        type="text"
        placeholder="Kirjoita etupuolen teksti"
        onkeydown={handleFrontInputKeydown}
      >

      <br>

      <input
        bind:value={cardTextBack}
        type="text"
        placeholder="Kirjoita takapuolen teksti"
        onkeydown={handleBackInputKeydown}
      >
      <br>

      <div class="input-controls">
        <button disabled={cardText.trim() === "" || cardTextBack.trim() === ""} onclick={addCard}>
          Lisää kortti
        </button>
        <button disabled={number === 0} onclick={removeLastCard}>
          Poista viimeisin kortti
        </button>
        <button onclick={previewCard}>
         Katsele lisättyjä Kortteja
        </button>
        <button onclick={() => showBulkImport = !showBulkImport}>Bulk Import</button>

      {#if showBulkImport}
        <div class="bulk-import">
         <textarea bind:value={bulkImportText} placeholder="Paste your terms here..." style="width: 300px; height: 100px; margin: 8px;"></textarea>
         <button onclick={addBulkCards}>Add All Cards</button>
         <button onclick={() => showBulkImport = false}>Cancel</button>
        </div>
      {/if}
      </div>

      {#if number === 0}
        <p style="margin-top: 20px; text-align: center; color: #555;">
          Aloita lisäämällä uusi kortti yllä olevilla kentillä.
        </p>
      {/if}
     
    </div>
  </section>

{#if showPopUp}
  <div class="popup-overlay" onkeydown={escapeEvent} tabindex="-1" role="dialog" aria-modal="true">
    <div id="overlayPopUpPreview">
      <div class="topBarPreviewWindow">
         <h5>Muistikortit ({currentCardIndex + 1}/{subjectCards.length})</h5> 
         <button onclick={closePopup}>X</button>
      </div>

      <div class="popup-body-single-card">
        {#if subjectCards.length === 0}
          <p style="text-align: center; margin-top: 50px;">
            Ei muistikortteja tälle aiheelle vielä. <br>
            Lisää kortteja pääikkunasta!
          </p>
        {:else}
          <div
            class="card popup-display-card" 
            class:flipped={popupCardFlipped}
            onclick={togglePopupCardFlip}
            onkeydown={(e) => { // Accessibility: keyboard flip
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                togglePopupCardFlip();
              }
            }}
            role="button"
            tabindex="0"
          >
            <div class="card-front">
              {subjectCards[currentCardIndex].front}
            </div>
            <div class="card-back">
              {subjectCards[currentCardIndex].back}
            </div>
          </div>
        {/if}
        
        <!-- NAVIGATION BUTTONS COMPLETELY OUTSIDE THE CARD AND IF BLOCK -->
        {#if subjectCards.length > 0}
          <div class="card-navigation-buttons">
            <button onclick={showPreviousCard} disabled={currentCardIndex === 0}>
              Edellinen
            </button>

            <button onclick={removeCurrentCard} disabled={false} style="background-color: #d32f2f;">
              Poista kortti
            </button>

            <button onclick={showNextCard} disabled={currentCardIndex === subjectCards.length - 1}>
              Seuraava
            </button>
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

</div>

<style>
  /* All your existing styles are kept intact */
  .content-block {
    background-color: #ffffffcc;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    max-width: 500px;
    min-height: fit-content;
    height: 800px;
    margin: 0 auto;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h2 {
    margin: 0;
    font-size: 2.8rem;
    color: #003366;
    text-align: center;
  }

  input {
    width: 300px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }

  #card-Block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .card {
    position: relative;
    width: 460px;
    height: 220px;
    transition: transform 0.8s;
    transform-style: preserve-3d;
    cursor: pointer;
    margin: 0 auto;
    transform-origin: center center;
  }

  .card.flipped {
    transform: rotateY(180deg);
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 90%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid rgb(1, 0, 0);
    border-radius: 5px;
    padding: 10px;
    font-size: 1.1rem;
    background-color: white;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(610px, 1fr));
    justify-content: center;
    max-width: 95%;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    align-items: start;
  }

  button {
    padding: 8px 16px;
    margin: 4px;
    border: none;
    border-radius: 4px;
    background-color: #0277bd;
    color: white;
    cursor: pointer;
    font-size: 1rem;
  }

  button:hover:not(:disabled) {
    background-color: #0288d1;
  }

  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .input-controls {
    display: flex;
    gap: 8px;
    margin: 8px 0;
    flex-wrap: wrap;
    justify-content: center;
  }

  .bulk-import {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
  }

  /* --- Styles for the Dimming Overlay (Covers full screen) --- */
  .popup-overlay {
    position: fixed; /* Fixes it to the viewport */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6); /* This is your dimming effect */
    display: flex; /* Use flexbox to center content */
    justify-content: center; /* Center horizontally */
    align-items: center; /* Center vertically */
    z-index: 999; /* Changed to 999 to be just under the popup (1000) */
    backdrop-filter: blur(5px); /* Optional: Adds a blur effect */
     perspective: 1200px;
  }

  /* --- Styles for the Actual Popup Content Box (OPAQUE) --- */
  #overlayPopUpPreview {
    width: 1200px;
    height: 700px;
    background-color: #ffffff; /* Make this OPAQUE white, as it's the content box */
    border-radius: 10px;
    border: 2px solid black;
    position: fixed; /* Keep fixed position for centering */
    top: 50%;      
    left: 50%;     
    transform: translate(-50%, -50%); 
    z-index: 1000;   /* Ensures it appears on top of the overlay */
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2); /* Reduced opacity for shadow */

    display: flex; /* Make it a flex container */
    flex-direction: column; /* Stack children vertically (header, body) */
    overflow: hidden; /* Hide overflow if content pushes outside */

  }

  .topBarPreviewWindow {
    display: flex;
    flex-direction: row;
    justify-content: center; 
    align-items: center;
    width: 100%; /* Ensure it takes full width of its parent */
    padding: 10px 15px; /* Add some padding for spacing */
    background-color: #f0f0f0; /* Example background */
    border-bottom: 1px solid #eee; /* Example separator */
  }

  .topBarPreviewWindow button {
    margin-left: auto; 
    background: none; 
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #555;
    padding: 5px 10px;
    line-height: 1;
  }
  .topBarPreviewWindow button:hover {
    color: #000;
  }

  .topBarPreviewWindow h5 {
    flex-grow: 1; /* Allows h5 to grow and push the button */
    text-align: center; /* Re-center the text within its expanded space */
    margin: 0; /* Remove default margin */
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: 1.8rem;
    color: #003366;   
    /* Removed margin-left: 20px as flex-grow takes care of centering */
  }

  /* --- NEW: Style for the popup's main content body (single card + buttons) --- */
  .popup-body-single-card {
    flex-grow: 1; /* This will make it take up all available vertical space */
    overflow-y: auto; /* Enable scrolling for very tall card content if it doesn't fit */
    padding: 15px; /* Padding inside the body */
    
    display: flex; /* Use flexbox to arrange card and buttons */
    flex-direction: column; /* Stack card and buttons vertically */
    justify-content: center; /* Center content vertically */
    align-items: center; /* Center content horizontally */
  }

  /* --- NEW: Style for the card specifically in the popup --- */
  /* This reuses your .card styles, but allows for size adjustment in the popup */
  .card.popup-display-card { /* Target the card inside the popup specifically */
    width: 680px; /* Same width as your main card, adjust if needed */
    height: 320px; /* Same height as your main card, adjust if needed */
    margin: 20px auto; /* Add vertical margin and center horizontally */
  }

  /* --- NEW: Style for navigation buttons --- */
  .card-navigation-buttons {
    display: flex;
    justify-content: center; /* Center the buttons horizontally */
    gap: 15px; /* Space between buttons */
    margin-top: 20px; /* Space above the buttons */
  }

  .card-navigation-buttons button {
    /* Inherit your general button styles, or define specific ones here */
    padding: 10px 20px;
    font-size: 1.1rem;
    background-color: #0277bd;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .card-navigation-buttons button:hover:not(:disabled) {
    background-color: #0288d1;
  }

  .card-navigation-buttons button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
</style>