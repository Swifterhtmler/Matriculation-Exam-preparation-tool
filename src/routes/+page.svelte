<script lang="ts">
  import Kemia from "./kemia.svelte"
  import Aidinkieli from "./aidinkieli.svelte"
  import Matematiikka from "./matematiikka.svelte";
  import Englanti from "./englanti.svelte";
  import Aloitussivu from "./aloitussivu.svelte";
  import NewSubject from "./newSubject.svelte"
  import "./style.css";

  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  interface Props {
    data?: any;
    children?: import('svelte').Snippet;
  }

  let { data = {}, children }: Props = $props();
  
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
    // Load subjects from localStorage first
    loadSubjects();
    
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
  
  // Store for custom subjects with their configurations
  let customSubjects = $state<Array<{name: string, config: any}>>([]);
  
  // Load subjects from localStorage on component mount
  function loadSubjects() {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('customSubjects');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          customSubjects = Array.isArray(parsed) ? parsed : [];
        } catch (e) {
          console.error('Error loading subjects from localStorage:', e);
          customSubjects = [];
        }
      }
    }
  }
  
  // Save subjects to localStorage
  function saveSubjects() {
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('customSubjects', JSON.stringify(customSubjects));
      } catch (e) {
        console.error('Error saving subjects to localStorage:', e);
      }
    }
  }
  
  // Function to add new subject
  function addNewSubject() {
    if (uusiAine.trim() !== "") {
      const newSubject = {
        name: uusiAine.trim(),
        config: {
          subjectName: uusiAine.trim(),
          title: uusiAine.trim(),
          createdAt: new Date().toISOString(),
          // Configuration for the subject's functionality
          enableTodoList: true,
          enableFlashcards: true,
          enableAI: true,
          enableContentManager: true,
          enableCharts: true,
          // You can add more subject-specific settings here
          customFeatures: [
            "Tehtävien harjoittelu",
            "Muistiinpanot",
            "Edistymisen seuranta"
          ]
        }
      };
      
      customSubjects.push(newSubject);
      customSubjects = [...customSubjects]; // Trigger reactivity
      saveSubjects(); // Save to localStorage
      
      // Automatically select the new subject
      ainevalinta = uusiAine.trim();
      
      // Clear the input
      uusiAine = "";
    }
  }
  
  // Function to remove a custom subject
  function removeSubject(subjectName: string) {
    customSubjects = customSubjects.filter(subject => subject.name !== subjectName);
    saveSubjects(); // Save to localStorage
    // If the removed subject was selected, switch to default
    if (ainevalinta === subjectName) {
      ainevalinta = "Aloitussivu";
    }
  }
  
  // Get configuration for current subject
  function getCurrentSubjectConfig() {
    const currentSubject = customSubjects.find(subject => subject.name === ainevalinta);
    return currentSubject?.config || {};
  }
</script>

<svelte:head>
  <title>Yo-StyduSuite</title>
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
    
    <!-- Dynamic custom subjects -->
    {#each customSubjects as subject}
      <option value={subject.name}>{subject.name}</option>
    {/each}
  </select>
  
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
  {#if customSubjects.some(subject => subject.name === ainevalinta)}
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
    {:else if customSubjects.some(subject => subject.name === ainevalinta)}
      <!-- Pass the subject configuration to NewSubject component -->
      <NewSubject config={getCurrentSubjectConfig()} />
    {:else}
      <Aloitussivu />
    {/if}
  {/key}
</main>

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


</style>