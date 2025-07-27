<script lang="ts">
  import { quillEditorContent } from './stores'; // Ensure correct path to your stores.js
  import QuillEditor from './QuillEditor.svelte'; // Import QuillEditor

  // State for managing the selected "folder" (flattened key)
  let selectedSubjectChapterKey: string | null = $state(null); // E.g., "kemia__luku1"

  // State for filtering by main subject tag
  let selectedSubjectTag: string | null = $state(null); // e.g., 'kemia', 'matematiikka', or null for 'all'

  // Input for creating new flattened keys (e.g., "Kemia Luku 1", "Matematiikka Kpl 3")
  let newFolderName = $state("");

  // Reactive variables to derive all existing flattened keys for display
  // The key fix: wrap the store access in a function
  let allFolderItems = $derived(() => {
    const storeValue = $quillEditorContent; // Get the current store value
    return Object.keys(storeValue)
      .filter(key => {
        // Filter out Svelte store methods and only include valid folder keys
        // A valid folder key should contain '__' and its value should be a string
        return key.includes('__') && typeof storeValue[key] === 'string';
      })
      .map(key => {
        const parts = key.split('__');
        const subjectTag = parts[0];
        const chapterSlug = parts.slice(1).join('_'); // e.g., 'luku1' or 'default'
        let chapterDisplayName = chapterSlug.replace(/_/g, ' ');

        // Special handling for 'default' chapter
        if (chapterSlug === 'default') {
          chapterDisplayName = 'Yleistä'; // Or 'Pääkansio', 'Perusteet', etc.
        } else {
          // Capitalize first letter of chapter display name (only if not 'default')
          chapterDisplayName = chapterDisplayName.charAt(0).toUpperCase() + chapterDisplayName.slice(1);
        }

        const subjectDisplayName = subjectTag.charAt(0).toUpperCase() + subjectTag.slice(1).replace(/_/g, ' ');
        const fullDisplayName = chapterSlug === 'default'
          ? subjectDisplayName // If default chapter, just show subject name
          : `${subjectDisplayName}: ${chapterDisplayName}`; // Otherwise, show Subject: Chapter

        return {
          rawKey: key, // kemia__luku1
          subjectTag: subjectTag, // kemia
          chapterSlug: chapterSlug, // luku1
          displayName: fullDisplayName // Kemia: Luku 1 or Kemia (for default)
        };
      })
      .sort((a, b) => a.displayName.localeCompare(b.displayName)); // Sort alphabetically by display name
  });

  // Derive unique subject tags for the filter buttons
  let uniqueSubjectTags = $derived(() => {
    return Array.from(new Set(allFolderItems().map(item => item.subjectTag))).sort();
  });

  // Filtered list of folders based on selectedSubjectTag
  let filteredFolderItems = $derived(() => {
    return selectedSubjectTag
      ? allFolderItems().filter(item => item.subjectTag === selectedSubjectTag)
      : allFolderItems();
  });

  // Functions to manage folders (flattened keys)
  // Function to create a new folder (e.g., "Kemia Luku 1" -> "kemia__luku1")
  function createNewFolder() {
    if (newFolderName.trim() === "") {
      alert('Kansion nimi ei voi olla tyhjä!');
      return;
    }

    // Attempt to parse "Subject Chapter" or just "Subject"
    const parts = newFolderName.trim().split(/\s*[:\-_]\s*|\s+/); // Split by space, :, -, or _
    let subjectPart = parts[0] ? parts[0].toLowerCase() : '';
    let chapterPart = parts.slice(1).join('_').toLowerCase() || 'default'; // Use 'default' if no chapter specified

    if (!subjectPart) {
      alert('Kansion nimen täytyy alkaa aineella (esim. "Kemia Luku 1" tai "Fysiikka").');
      return;
    }

    const newFlattenedKey = `${subjectPart}__${chapterPart}`;

    // Check for duplicates using the current store value
    const currentStoreValue = $quillEditorContent;
    if (newFlattenedKey in currentStoreValue) {
      alert('Kansio tällä nimellä on jo olemassa!');
      return;
    }

    // Update quillEditorContent properly using update method
    console.log('Creating folder:', newFlattenedKey);
    quillEditorContent.update(prev => ({
      ...prev,
      [newFlattenedKey]: "<p>Start writing...</p>"
    }));

    selectedSubjectChapterKey = newFlattenedKey; // Select the newly created folder
    newFolderName = ""; // Clear input
  }

  // Function to select a folder (flattened key)
  function selectFolder(rawKey: string) {
    console.log('Selecting folder:', rawKey);
    selectedSubjectChapterKey = rawKey;
  }

  // Function to delete a specific folder (flattened key)
  function deleteFolder(rawKey: string, displayName: string) {
    if (confirm(`Oletko varma, että haluat poistaa kansion "${displayName}" kaikkine sisältöineen? Tätä ei voi peruuttaa.`)) {
      console.log('Deleting folder:', rawKey);
      
      quillEditorContent.update(prev => {
        const { [rawKey]: _, ...rest } = prev; // Destructure to remove the key
        console.log('Store after deletion:', rest);
        return rest;
      });

      if (selectedSubjectChapterKey === rawKey) {
        selectedSubjectChapterKey = null; // Deselect if the current folder was deleted
      }

      // Check if we need to reset the filter
      const currentItems = allFolderItems();
      if (!currentItems.some(item => item.subjectTag === selectedSubjectTag) && selectedSubjectTag !== null) {
        selectedSubjectTag = null; // Reset filter if the only subject for filter is deleted
      }
    }
  }

  // Helper to get the display name of the currently selected folder
  let currentSelectedDisplayName = $derived(() => {
    if (!selectedSubjectChapterKey) return 'Valitse tai luo kansio';
    const found = allFolderItems().find(f => f.rawKey === selectedSubjectChapterKey);
    return found?.displayName || 'Valitse tai luo kansio';
  });
</script>

<div class="content-manager-container">
  {#if selectedSubjectChapterKey}
    <div class="header-section">
      <button onclick={() => selectedSubjectChapterKey = null} class="back-to-selection">← Takaisin valikkoon</button>
      <h2>{currentSelectedDisplayName()}</h2>
    </div>
    <QuillEditor subject={selectedSubjectChapterKey} />
  {:else}
    <div class="selection-ui">
      <h1>Tekstieditorin Hallinta</h1>
      <p class="description">Luo uusi kansio tai valitse olemassa oleva.</p>
      <hr>

      <section class="folder-management-section">
        <h3>Kansiot</h3>

        <div class="subject-tag-filters">
          <button
            onclick={() => selectedSubjectTag = null}
            class:active={selectedSubjectTag === null}
          >
            Kaikki
          </button>
          {#each uniqueSubjectTags() as tag (tag)}
            <button
              onclick={() => selectedSubjectTag = tag}
              class:active={selectedSubjectTag === tag}
            >
              {tag.charAt(0).toUpperCase() + tag.slice(1).replace(/_/g, ' ')}
            </button>
          {/each}
        </div>

        <div class="folder-list">
          {#each filteredFolderItems() as folder (folder.rawKey)}
            <div class="folder-item">
              <button onclick={() => selectFolder(folder.rawKey)}>
                {folder.displayName}
              </button>
              <button onclick={() => deleteFolder(folder.rawKey, folder.displayName)} class="delete-button">
                X
              </button>
            </div>
          {/each}
          {#if filteredFolderItems().length === 0}
            <p class="empty-message">
              Ei kansioita {selectedSubjectTag ? `aineessa "${selectedSubjectTag.charAt(0).toUpperCase() + selectedSubjectTag.slice(1).replace(/_/g, ' ')}"` : ''} vielä. Luo uusi!
            </p>
          {/if}
        </div>

        <div class="new-input-group">
          <input
            type="text"
            bind:value={newFolderName}
            placeholder="Uuden kansion nimi (esim. 'Kemia Luku 1')"
            onkeydown={(e) => { if (e.key === 'Enter') createNewFolder(); }}
          />
          <button onclick={createNewFolder} disabled={newFolderName.trim() === ""}>
            Luo Kansio
          </button>
        </div>
      </section>
    </div>
  {/if}
</div>

<style>
  .content-manager-container {
    width: 100%;
    height: 100%;
    min-width: 120px;
    min-height: 120px;
    max-width: 100vw;
    max-height: 100vh;
    background-color: #f0f8ff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: sans-serif;
    z-index: 998;
    border: black 1px solid;

  }


  .header-section {
    padding: 10px 15px;
    background-color: #e3f2fd;
    border-bottom: 1px solid #c0e0fa;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0; /* Don't shrink when QuillEditor is large */
  }

  .header-section h2 {
    margin: 0;
    color: #003366;
    font-size: 1.5rem;
    text-align: center;
    flex-grow: 1; /* Allows h2 to take available space */
  }

  .back-to-selection {
    background-color: #0277bd;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    flex-shrink: 0; /* Don't shrink */
  }

  .back-to-selection:hover {
    background-color: #0288d1;
  }

  .selection-ui {
    padding: 1.5rem;
    flex-grow: 1; /* Allow content to grow and fill space */
    overflow-y: auto; /* Enable scrolling for content if it exceeds height */
  }

  h1 {
    text-align: center;
    color: #003366;
    font-size: 2.2rem;
    margin-bottom: 0.5rem;
  }

  .description {
    text-align: center;
    color: #555;
    margin-bottom: 1.5rem;
  }

  hr {
    border: none;
    border-top: 1px solid #cfe2f3;
    margin: 1.5rem 0;
  }

  h3 {
    color: #0277bd;
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
    text-align: center;
  }

  /* Style for subject tag filters */
  .subject-tag-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-bottom: 1.5rem;
    padding: 10px;
    background-color: #eaf6ff;
    border-radius: 8px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  }

  .subject-tag-filters button {
    padding: 6px 12px;
    background-color: #bbdefb; /* Light blue */
    color: #003366;
    border: 1px solid #90caf9;
    border-radius: 20px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .subject-tag-filters button:hover {
    background-color: #90caf9; /* Darker blue on hover */
  }

  .subject-tag-filters button.active {
    background-color: #2196F3; /* Primary blue for active */
    color: white;
    border-color: #2196F3;
    font-weight: bold;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
  }

  .folder-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 1rem;
    max-height: 250px;
    overflow-y: auto;
    padding-right: 5px;
  }

  .folder-item {
    display: flex;
    align-items: center;
    background-color: #e3f2fd;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .folder-item button:first-child {
    padding: 8px 12px;
    background-color: transparent;
    color: #003366;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    flex-grow: 1;
  }

  .folder-item button:first-child:hover {
    background-color: #c0e0fa;
  }

  .delete-button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 8px 10px;
    cursor: pointer;
    font-size: 0.8rem;
    border-radius: 0 5px 5px 0;
  }

  .delete-button:hover {
    background-color: #d32f2f;
  }

  .new-input-group {
    display: flex;
    gap: 8px;
    justify-content: center;
    margin-top: 1rem;
  }

  .new-input-group input {
    flex-grow: 1;
    max-width: 250px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .new-input-group button {
    padding: 8px 15px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .new-input-group button:hover:not(:disabled) {
    background-color: #45a049;
  }

  .new-input-group button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .empty-message {
    color: #777;
    font-style: italic;
    text-align: center;
    margin-top: 15px;
    width: 100%;
  }

  .content-manager-container > :global(.editor-wrapper) {
    width: 100%;
    height: calc(100% - 60px);
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
</style>