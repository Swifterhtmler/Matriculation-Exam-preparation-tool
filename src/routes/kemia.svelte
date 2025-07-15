<script>
  import { writable } from "svelte/store";
  import { todoItems } from './stores.js';






  // import { cards } from "./stores.js"; 
  // import { cards } from "./stores.js";
  import Flashcards from "./flashcards.svelte";
	import Matematiikka from "./matematiikka.svelte";
  // import { cards } from "./stores.js";
  import Linechart from "./linechart.svelte";
  import Fysiikka from "./fysiikka.svelte";
  import Arcchart from "./arcchart.svelte";
  import Arcchartto from "./arcchartto.svelte";
  import { motivationval } from "./stores.js";



  import Todo from "./todo.svelte";

  import { onMount } from 'svelte';

  import { editorDivStore } from './stores.js';

  import { Chart, Svg, Axis, Bars } from 'layerchart';

  import { editorTextStore } from "./stores.js";

  import Artificialintelligence from "./artificialintelligence.svelte";


  import ContentManager from "./contentManager.svelte";


 import { get } from "svelte/store";

//  import { initializeStores } from './stores.js';

  let kemiaCards = writable([]);



 

  let todoText = "";

   

  function markDoneTask() {
     removeItem();
  }

  function handleKeyDownList(event) {
      if (event.key === "Enter") {
        AddItem();
        console.log($todoItems)
      }
  }


  function AddItem() {
     $todoItems = [...$todoItems, todoText];
     todoText = ""
  }

  function removeItem() {
    $todoItems.pop()
    $todoItems = [...$todoItems]
  }



</script> 

<div id="charts-container">

<Arcchart usecase={"Kemian Muistikortit"} subject="Kemia"/>



<Arcchartto usecase={"Kemian Tehtävien määrä"} subject="kemia" />

<!-- <button on:click={saveAllData}>Save</button> -->


<!-- <SvelteCalenderDisplay /> -->

<Artificialintelligence />

</div>





<!--Now add the library LayerChart tailwdin installed "!important for over ridind styles."-->

<div class="usecase-container">
<div class="container">  
 
<!-- <Flashcards  subject="Kemia"/> -->

<ContentManager />

<!-- 

<div id="to-do">
<section class="content-block">
<h2>Tehtävälista</h2>
{#if $todoItems.length == 0}
<div class="results">
<div class="live-preview-hint">(Lisää tehtäviä listalle esim. luettavat luvut)
</div>
</div>
{:else}
<div class="results">
<ul>
  {#each $todoItems as item}     
     <li><button class="element" type="button" on:click={markDoneTask}>{item}</button></li>
  {/each}
</ul>
</div>
{/if}

  <br>
{#if $todoItems.length >= 10}
    <input 
      bind:value={todoText} 
      type="text" 
      placeholder="kirjoita jotain lisäteksesi tehtävän"
      on:keypress={handleKeyDownList}
      disabled
    >
{:else}
 <input 
      bind:value={todoText} 
      type="text" 
      placeholder="kirjoita jotain lisäteksesi tehtävän"
      on:keypress={handleKeyDownList}
    >
 {/if}

 <br>

<div class="rowButtons">
{#if $todoItems.length >= 10 || todoText.length >= 40}
<button class="taskButton" disabled on:click={AddItem}>Lyhennä tekstiä</button>  
{:else}
<button class="taskButton" on:click={AddItem}>Lisää tehtävä</button>  
{/if}
<br>
<button on:click={removeItem}>Poista tehtävä</button>
</div>
 


</section>
</div> -->

<Todo subject="kemia" />



</div>
</div>

<style>
  
 

  .container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(520px, 1fr));
    justify-content: center;
    /* gap: 2rem; */
    max-width: 95%;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    align-items: start;
    margin-left: 50px;
  }

  /* #to-do {
    margin-top: 20px;
    width: 100%;
    
  } */



  #charts-container {
    margin-top: 25px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 40px;
    background-color: #e5ecf0;
    padding: 26px;
    border-radius: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

  .usecase-container {
    margin-top: 30px;
    background-color: #e5ecf0;
    border-radius: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }

</style>
