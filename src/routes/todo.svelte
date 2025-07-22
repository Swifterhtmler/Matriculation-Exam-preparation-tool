<script>
import { todoItems } from './stores.js';

export let subject = "";
let todoText = "";

$: subjectTodos = $todoItems && $todoItems[subject] ? $todoItems[subject] : [];

function AddItem() {
  if (todoText.trim() === "") return;
  todoItems.update(all => {
    const updated = { ...all };
    updated[subject] = [...(updated[subject] ?? []), todoText];
    return updated;
  });
  todoText = "";
}

function removeItem() {
  todoItems.update(all => {
    const updated = { ...all };
    updated[subject] = (updated[subject] ?? []).slice(0, -1);
    return updated;
  });
}

function markDoneTask(item) {
  todoItems.update(all => {
    const updated = { ...all };
    updated[subject] = (updated[subject] ?? []).filter(i => i !== item);
    return updated;
  });
}

function handleKeyDownList(event) {
  if (event.key === "Enter") {
    AddItem();
  }
}
</script>


<!-- 
<div id="to-do">
<section class="content-block">
<h2>Tehtävälista</h2>
{#if $todoItems.length == 0}
<div class="results">
<div class="live-preview-hint">(Lisää tehtäviä listalle esim. luettavat luvut) </div>
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


<div id="to-do">
  <section class="content-block">
    <h2>Tehtävälista</h2>
    {#if subjectTodos.length == 0}
      <div class="results">
        <div class="live-preview-hint">(Lisää tehtäviä listalle esim. luettavat luvut)</div>
      </div>
    {:else}
      <div class="results">
        <ul>
          {#each subjectTodos as item}
            <li>
              <button class="element" type="button" on:click={() => markDoneTask(item)}>
                {item}
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {/if}

    <br>

    {#if subjectTodos.length >= 10}
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
      {#if subjectTodos.length >= 7 || todoText.length >= 40}
        <button class="taskButton" disabled on:click={AddItem}>Lyhennä tekstiä</button>
      {:else}
        <button class="taskButton" on:click={AddItem}>Lisää tehtävä</button>
      {/if}
      <br>
      <button on:click={removeItem}>Poista tehtävä</button>
    </div>
  </section>
</div>

<style>

  .content-block {
    background-color: #ffffffcc;
    padding: 1.5rem 2rem;
    border-radius: 12px;
    max-width: 500px;
    height: 600px;
    margin: 0 auto;
    box-shadow: 0 6px 12px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
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



  .live-preview-hint {
    font-size: 0.8rem;
    color: #666;
    margin-top: 8px;
    font-style: italic;
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

  /* #add {
    background-color: #1873d4;
  } */




  .rowButtons {
    display: flex;
    flex-direction: row;
    align-items: center;
  }


.results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 350px;
  width: 65%;
  border: rgb(0, 0, 0) 1px solid;
  border-radius: 8px;
  padding: 10px;
  margin: 10px;
  box-shadow: 2px 1px 2px rgb(123, 121, 121);
}

.element {
background: rgb(234, 240, 240);
 border-radius: 5px;
  color: inherit;
  border: none;
  padding: 3px;
  padding-right: 10px;
  padding-left: 10px;
  font: inherit;
  cursor: pointer;
  outline: inherit;
}

</style>