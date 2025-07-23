<script lang="ts">
  import { onMount } from 'svelte';
  import { quillEditorContent } from './stores.js'; // Import from stores.js
  
  // Props for customization
  let { 
    initialContent = '<p>Hello World!</p><p>Some initial <strong>bold</strong> text</p><p><br /></p>',
    placeholder = 'Start writing...',
    onContentChange = undefined 
  } = $props();
  
  let editorElement: HTMLDivElement;
  let quill: any = null;
  
  onMount(async () => {
    // Dynamically import Quill
    const Quill = (await import('quill')).default;
    
    // Initialize Quill editor
    quill = new Quill(editorElement, {
      theme: 'snow',
      placeholder: placeholder,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          [{ 'header': 1 }, { 'header': 2 }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['link'],
          ['clean']
        ]
      }
    });
    
    // Load saved content from store first, then localStorage as fallback
    let contentToLoad = '';
    
    // Subscribe to store to get current value
    const unsubscribe = quillEditorContent.subscribe(storeContent => {
      if (storeContent) {
        contentToLoad = storeContent;
      }
    });
    unsubscribe(); // Immediately unsubscribe after getting value
    
    // Fallback to localStorage if store is empty
    if (!contentToLoad) {
      const savedContent = localStorage.getItem('quill-content');
      if (savedContent) {
        contentToLoad = savedContent;
      } else {
        contentToLoad = initialContent;
      }
    }
    
    // Set the content
    quill.root.innerHTML = contentToLoad;
    quillEditorContent.set(contentToLoad);
    
    // Listen for content changes and update both store and localStorage
    quill.on('text-change', () => {
      const html = quill.root.innerHTML;
      
      // Update the store (this will trigger save to saved.json)
      quillEditorContent.set(html);
      
      // Also save to localStorage as backup
      localStorage.setItem('quill-content', html);
      
      // Call optional callback
      if (onContentChange) {
        onContentChange(html);
      }
    });
    
    return () => {
      if (quill) {
        quill = null;
      }
    };
  });
  
  // Public methods to interact with the editor
  export function getContent() {
    return quill ? quill.root.innerHTML : '';
  }
  
  export function setContent(html: string) {
    if (quill) {
      quill.root.innerHTML = html;
      quillEditorContent.set(html);
    }
  }
  
  export function getText() {
    return quill ? quill.getText() : '';
  }
  
  export function focus() {
    if (quill) {
      quill.focus();
    }
  }
</script>

<svelte:head>
  <link href="https://cdn.jsdelivr.net/npm/quill@2.0.3/dist/quill.snow.css" rel="stylesheet" />
</svelte:head>

<div class="editor-wrapper">
  <div class="editor-container">
    <div bind:this={editorElement} class="editor-content">
      <!-- Initial content will be set by JavaScript -->
    </div>
  </div>
</div>

<style>
  .editor-wrapper {
  width: 100%;
    height: 100%;
    min-width: 120px;
    max-width: 100vw;
    max-height: 100vh;
    margin: 0 auto;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border: 1px black solid;
    border-radius: 10px;
  }
  
  .editor-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid #e1e5e9;
    border-radius: 10px;
    padding: 5px;
  }
  
  .editor-content {
    min-height: 260px;
  }
  
  /* Custom styling for Quill toolbar */
  :global(.ql-toolbar) {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e1e5e9;
    border-top: none;
    border-left: none;
    border-right: none;
    padding: 12px 16px;
  }
  
  :global(.ql-container) {
    border: none;
    font-size: 16px;
    line-height: 1.6;
  }
  
  :global(.ql-editor) {
    padding: 20px;
    min-height: 180px;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
  }
  
  :global(.ql-editor.ql-blank::before) {
    color: #999;
    font-style: italic;
  }
  
  /* Style the toolbar buttons */
  :global(.ql-toolbar .ql-formats) {
    margin-right: 15px;
  }
  
  :global(.ql-toolbar button) {
    padding: 6px;
    margin: 2px;
    border-radius: 4px;
    transition: background-color 0.2s ease;
  }
  
  :global(.ql-toolbar button:hover) {
    background-color: #e9ecef;
  }
  
  :global(.ql-toolbar button.ql-active) {
    background-color: #007bff;
    color: white;
  }
</style>
