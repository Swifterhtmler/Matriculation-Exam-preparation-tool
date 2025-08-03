<script lang="ts">
  import { writable } from "svelte/store";
  import { todoItems } from './stores.js';
  import Flashcards from "./flashcards.svelte";
  import Matematiikka from "./matematiikka.svelte";
  import Linechart from "./linechart.svelte";
  import Fysiikka from "./fysiikka.svelte";
  import Arcchart from "./arcchart.svelte";
  import Arcchartto from "./arcchartto.svelte";
  import { motivationval } from "./stores.js";
  import Todo from "./todo.svelte";
  import ContentManagerEditor from "./contentManagerEditor.svelte";
  import QuillEditor from './QuillEditor.svelte';
  import { Chart, Svg, Axis, Bars } from 'layerchart';
  import Artificialintelligence from "./artificialintelligence.svelte";
  import ContentManager from "./contentManager.svelte";
  import { get } from "svelte/store";

  interface Props {
    config?: {
      subjectName?: string;
      title?: string;
      createdAt?: string;
      enableTodoList?: boolean;
      enableFlashcards?: boolean;
      enableAI?: boolean;
      enableContentManager?: boolean;
      enableCharts?: boolean;
      customFeatures?: string[];
      [key: string]: any;
    };
  }
  
  let { config = {} }: Props = $props();
  
  // Use the configuration to customize the component
  let subjectName = $derived(config.subjectName || config.title || "Uusi Aine");
  let createdDate = $derived(config.createdAt ? new Date(config.createdAt).toLocaleDateString('fi-FI') : '');
  
  // Feature toggles based on config
  let showCharts = $derived(config.enableCharts !== false);
  let showTodoList = $derived(config.enableTodoList !== false);
  let showAI = $derived(config.enableAI !== false);
  let showContentManager = $derived(config.enableContentManager !== false);
  let showFlashcards = $derived(config.enableFlashcards !== false);
  
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

<div class="subject-header">
  <h1>{subjectName}</h1>
  {#if createdDate}
    <p class="created-date">Luotu: {createdDate}</p>
  {/if}
</div>

{#if showCharts}
<div id="charts-container">
  <Arcchart usecase="{subjectName} Muistikortit" subject={subjectName.toLowerCase()}/>
  <Arcchartto usecase={`${subjectName} Tehtävien määrä`} subject={subjectName.toLowerCase()} />
  <Linechart />
</div>
{/if}

<div class="usecase-container">
<div class="container">  
 
{#if showContentManager}
<ContentManager />
{/if}

<div class="outercontainer-container">
<div id="todo-and-artificialintelligence-section-container">

  {#if showTodoList}
  <div id="todo-container-section">
    <Todo subject={subjectName.toLowerCase()} />
  </div>
  {/if}

  {#if showContentManager}
  <div id="ai-container">
    <ContentManagerEditor />
  </div>
  {/if}

</div>

{#if showAI}
<div id="editor-container">
 <Artificialintelligence />
</div>
{/if}

</div>

</div>
</div>

<style>
  .subject-header {
    text-align: center;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    margin: 20px;
    border-radius: 10px;
  }
  
  .subject-header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: bold;
  }
  
  .created-date {
    margin: 10px 0 0 0;
    opacity: 0.9;
    font-style: italic;
  }

  .container {
    display: grid;
    grid-template-columns: 1fr 3fr;
    justify-content: center;
    max-width: 95%;
    margin: 0 auto;
    padding: 1rem;
    min-height: 100vh;
    align-items: start;
    margin-left: 40px;
  }

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
  }

  #editor-container {
    width: 92%;
    height: 480px;
    margin-right: 50px;
    margin-left: 50px;
  }

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
    
    .subject-header h1 {
      font-size: 2rem;
    }
  }
</style>