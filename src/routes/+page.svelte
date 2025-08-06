<script lang="ts">
  import Kemia from "./kemia.svelte";
  import Aidinkieli from "./aidinkieli.svelte";
  import Matematiikka from "./matematiikka.svelte";
  import Englanti from "./englanti.svelte";
  import Aloitussivu from "./aloitussivu.svelte";
  import NewSubject from "./newSubject.svelte";
  import { customSubjects } from "./stores";
  import "./style.css";

  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  // import { StatementSync } from "node:sqlite";

  interface Props {
    data?: any;
    children?: import('svelte').Snippet;
  }

  let { data = {}, children }: Props = $props();

  let showPopUp = $state(false);

  function abortClick() {
    showPopUp = false;
  }

  let seoTitle = $derived(data.title || 'YO-Kirjoitusten Harjoitustyökalu | Ilmainen Ylioppilastutkinto Harjoittelu');
  let seoDescription = $derived(data.description || 'Ilmainen, nopea ja luotettava työkalu ylioppilaskirjoitusten harjoitteluun. Suunniteltu suomalaisille opiskelijoille. Harjoittele tehtäviä ja paranna tuloksiasi.');
  let canonicalUrl = $derived(`https://yo-harjoittelu.fi${$page.url.pathname}`);

  // Structured data for search engines
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "YO-Kirjoitusten Harjoitustyökalu",
    "description": "Ilmainen työkalu ylioppilaskirjoitusten harjoitteluun suomalaisille opiskelijoille",
    "url": "https://yo-harjoittelu.fi",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR"
    },
    "creator": {
      "@type": "Organization",
      "name": "YO-Harjoitustyökalu"
    },
    "audience": {
      "@type": "EducationalAudience",
      "educationalRole": "student"
    },
    "educationalLevel": "SecondaryEducation",
    "inLanguage": "fi",
    "isAccessibleForFree": true,
    "keywords": "ylioppilastutkinto, yo-kirjoitukset, harjoittelu, opiskelu, suomi, ilmainen",
    "featureList": [
      "Ilmainen käyttö",
      "Nopea ja luotettava",
      "Suunniteltu suomalaisille opiskelijoille",
      "Tehtävien harjoittelu",
      "Edistymisen seuranta"
    ]
  };

  onMount(() => {
    // Add structured data to page
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  });

  let ainevalinta = $state("Aloitussivu");
  let uusiAine = $state("");

  // Use $customSubjects directly in template and logic
  // No localStorage, no manual subscription needed

function addNewSubject() {
  if (uusiAine.trim() !== "") {
    const newSubject = {
      name: uusiAine.trim(),
      config: {
        subjectName: uusiAine.trim(),
        title: uusiAine.trim(),
        createdAt: new Date().toISOString(),
        enableTodoList: true,
        enableFlashcards: true,
        enableAI: true,
        enableContentManager: true,
        enableCharts: true,
        customFeatures: [
          "Tehtävien harjoittelu",
          "Muistiinpanot",
          "Edistymisen seuranta"
        ]
      }
    };
    customSubjects.update(subjects => [...subjects, newSubject]); // <-- FIXED
    ainevalinta = uusiAine.trim();
    uusiAine = "";
  }
}

// function removeSubject(subjectName: string) {
//   showPopUp = true;
//   customSubjects.update(subjects => subjects.filter(subject => subject.name !== subjectName)); // <-- FIXED
//   if (ainevalinta === subjectName) {
//     ainevalinta = "Aloitussivu";
//   }
// }

let subjectToRemove = $state("");

function removeSubject(subjectName: string) {
  subjectToRemove = subjectName;
  showPopUp = true;
}

function confirmRemove() {
  customSubjects.update(subjects => subjects.filter(subject => subject.name !== subjectToRemove));
  if (ainevalinta === subjectToRemove) {
    ainevalinta = "Aloitussivu";
  }
  showPopUp = false;
  subjectToRemove = "";
}

function getCurrentSubjectConfig() {
  const currentSubject = $customSubjects.find(subject => subject.name === ainevalinta);
  return currentSubject?.config || {};
}
</script>

<svelte:head>
  <title>Yo-StudySuite</title>
  <meta name="description" content={seoDescription} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Page-specific Open Graph tags -->
  <meta property="og:title" content={seoTitle} />
  <meta property="og:description" content={seoDescription} />
  <meta property="og:url" content={canonicalUrl} />

  <!-- Page-specific Twitter tags -->
  <meta name="twitter:title" content={seoTitle} />
  <meta name="twitter:description" content={seoDescription} />
</svelte:head>

<header class="header">
  <div>
    <h1><span>YO</span>-StudySuite</h1>
    <p>Valittu sivu: {ainevalinta}</p>
  </div>

  <!-- Subject selection dropdown -->
  <select bind:value={ainevalinta}>
    <option value="Aloitussivu">Aloitussivu</option>
    <option value="Kemia">Kemia</option>
    {#each $customSubjects as subject}
      <option value={subject.name}>{subject.name}</option>
    {/each}
  </select>

  <!-- {#if $customSubjects.some(subject => subject.name === ainevalinta)}
    <button class="remove-btn" onclick={() => removeSubject(ainevalinta)}>
      Poista "{ainevalinta}"
    </button>
  {/if} -->

  <!-- Add new subject section -->
  <div id="adding-subject">
    <div class="add-subject-section">
      <input 
        type="text" 
        bind:value={uusiAine} 
        placeholder="Uuden aineen nimi"
        onkeydown={(e) => e.key === 'Enter' && addNewSubject()}
      />
      <button onclick={addNewSubject} disabled={!uusiAine.trim()}>
        Lisää aine
      </button>
    </div>
    <!-- Show remove button for custom subjects -->

    {#if $customSubjects.some(subject => subject.name === ainevalinta)}
      <button 
        class="remove-btn" 
        onclick={() => removeSubject(ainevalinta)}
      >
        Poista "{ainevalinta}"
      </button>
    {/if}

  </div>
</header>

<main>
  {#key ainevalinta}
    {#if ainevalinta === "Kemia"}
      <Kemia />
    {:else if $customSubjects.some(subject => subject.name === ainevalinta)}
      <!-- Pass the subject configuration to NewSubject component -->
      <NewSubject config={getCurrentSubjectConfig()} />
    {:else}
      <Aloitussivu />
    {/if}
  {/key}
</main>

{#if showPopUp === true}
  <div class="popup-bg">
    <div class="popup">
    <h1>Oletko varma olet poistamssa sivua: {subjectToRemove}</h1>
    <button id="cancel" onclick={abortClick}>Peru</button>
     <button id="delete" onclick={confirmRemove}>Vahvista poisto</button>
      </div>
    </div>
{/if}

<style>
  h1 {
    font-size: 32px !important;
    margin-left: 25px !important;
    margin-top: 5px !important;
  }

  p {
    margin-left: 25px !important;
    margin-bottom: 6px !important;
  }

  select {
    width: 130px !important;
  }

  .add-subject-section {
    display: flex;
    gap: 10px;
    align-items: center;
    margin: 10px 0;
  }

  .add-subject-section input {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .add-subject-section button {
    padding: 5px 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .add-subject-section button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  .remove-btn {
    padding: 5px 10px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
    margin-bottom: 5px;
  }

  .remove-btn:hover {
    background-color: #c82333;
  }


  #adding-subject {
    background-color: rgb(240, 242, 243);
    padding-top: 2px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 2px;
    border-radius: 5px;
  }
.popup-bg {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  .popup {
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 2px 16px rgba(0,0,0,0.15);
    padding: 32px 24px;
    text-align: center;
    min-width: 320px;
  }
  .popup h1 {
    font-size: 22px !important;
    margin-bottom: 18px !important;
    margin-left: 0 !important;
    margin-top: 0 !important;
  }
   #cancel {
    margin: 0 10px;
    font-size: 16px;
    padding: 7px 16px;
    background-color: #3d89db;
    border-radius: 5px;
    color: white;
  }

  #delete {
    margin: 0 10px;
    font-size: 16px;
    padding: 7px 16px;
    background-color: #ca353c;
    border-radius: 5px;
    color: white;
  }



</style>