<script lang="ts">
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
  import ContentManagerEditor from "./contentManagerEditor.svelte";


 import QuillEditor from './QuillEditor.svelte';
  
  let editorContent = $state('<p>Hello World!</p><p>Some initial <strong>bold</strong> text</p><p><br /></p>');
  let editorRef: any = $state();
  
  function handleTextChange(html: string) {
    console.log('Content changed:', html);
  }
  
  function getEditorContent() {
    if (editorRef) {
      console.log('HTML:', editorRef.getHTML());
      console.log('Text:', editorRef.getText());
    }
  }
  
  function setNewContent() {
    if (editorRef) {
      editorRef.setHTML('<p>New content set programmatically!</p>');
    }
  }





  import { Chart, Svg, Axis, Bars } from 'layerchart';



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



<!-- <div id="ai-container">
<Artificialintelligence />
</div> -->

<Linechart />

</div>



<!--Now add the library LayerChart tailwdin installed "!important for over ridind styles."-->

<div class="usecase-container">
<div class="container">  
 
<!-- <Flashcards  subject="Kemia"/> -->

<!-- <div id="content-manager-container-section"> -->
<ContentManager />
<!-- </div> -->
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

<!--Added containers to make the speration easier-->
<div class="outercontainer-container">
<div id="todo-and-artificialintelligence-section-container">

  <div id="todo-container-section">
  <Todo subject="kemia" />
  </div>
<!-- <div id="ai-container-and-editor-container-stack-div"> -->
<div id="ai-container">
  <Artificialintelligence />
</div>

</div>

<div id="editor-container">
<QuillEditor />
</div>



<ContentManagerEditor />

</div>

<!-- </div> -->
</div>
</div>

<style>
  
 

  .container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    justify-content: center;
        /* gap: 2rem; */
    max-width: 95%;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    align-items: start;
    margin-left: 40px;
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

  #todo-container-section {
    width: 50%;
    height: 600px;
  }

  .usecase-container {
    margin-top: 30px;
    background-color: #e5ecf0;
    border-radius: 10px;
    margin-left: 20px;
    margin-right: 20px;
  }


  #ai-container {
    width: 50%;
    height: 600px;
    margin-top: 20px;
    /* margin-left: 30px; */
  }

#editor-container {
  width: 92%;
  height: 320px;
  margin-right: 50px;
  margin-left: 50px;
}

 /* #ai-container-and-editor-container-stack-div {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
  margin-top: 20px;
  gap: 10px;
} */

#todo-and-artificialintelligence-section-container {
  display: flex;
  flex-direction: row;
  margin-bottom: 20px;
  gap: 50px;
  margin-right: 50px;
  margin-left: 50px;
}

.outercontainer-container {
  display: flex;
  flex-direction: column; 
  margin-left: 10px;
  /* border: solid black 1px; */ 
  /* border: solid black 1px was just for testing */
}


@media (max-width: 1300px) {


  #todo-and-artificialintelligence-section-container {
    flex-direction: column;
    gap: 20px;
    margin-left: 10px;
    margin-right: 10px;
  }

  #todo-container-section,
  #ai-container {
    width: 100%;
    height: auto;
    min-height: 350px;
    margin-top: 0;
  }

  .container {
    grid-template-columns: 1fr;
    margin-left: 0;
    padding: 0.5rem;
  }

  .usecase-container,
  #charts-container {
    margin-left: 5px;
    margin-right: 5px;
    padding: 10px;
  }

  #editor-container {
    width: 98%;
    margin-left: 1%;
    margin-right: 1%;
  }
}

</style>
