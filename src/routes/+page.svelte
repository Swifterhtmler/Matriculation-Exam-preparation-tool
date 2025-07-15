<script lang="ts">
  import Kemia from "./kemia.svelte"
  import Aidinkieli from "./aidinkieli.svelte"
  import Matematiikka from "./matematiikka.svelte";
  import Englanti from "./englanti.svelte";
  import Aloitussivu from "./aloitussivu.svelte";
//   import { writable } from "svelte/store";  
  let ainevalinta = $state("Aloitussivu");
  let options = ["Kemia", "Fysiikka", "Matematiikka"];
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
	<!-- <meta http-equiv="content-security-policy" content="script-src 'self'; object-src 'self'" /> -->

</svelte:head>


<header class="header">
<div>
<h1><span>YO</span>-StudySuite</h1>
<p>Valittu sivu: {ainevalinta}</p>
</div>
<!-- <label for="ainevalinta">Valitse oppiaine:</label> -->
<select bind:value={ainevalinta}>
  <option value="Aloitussivu">Aloitussivu</option>
  <option value="Kemia">Kemia</option>
  <option value="Matematiikka">Matematiikka</option>
  <option value="Englanti">Englanti</option>
  <option value="Äidinkieli">Äidinkieli</option>
</select>



</header>


<main>
   {#key ainevalinta}
  {#if ainevalinta === "Kemia"}
    <Kemia />
  {:else if ainevalinta === "Matematiikka"}
    <Matematiikka />
  {:else if ainevalinta === "Englanti"}
    <Englanti />
  {:else if ainevalinta === "Äidinkieli"}
    <Aidinkieli /> 
  {:else}
    <Aloitussivu />
  {/if}
  {/key}
</main>