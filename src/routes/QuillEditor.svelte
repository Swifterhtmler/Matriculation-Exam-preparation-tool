<script lang="ts">
  import { onMount } from 'svelte';
  import { quillEditorContent } from './stores.js';

  // Props for customization
  let {
    subject = null, // The flattened key like "kemia__luku1"
    placeholder = 'Start writing...',
    onContentChange = undefined
  } = $props();

  let editorElement: HTMLDivElement;
  let quill: any = null;
  let isInitialized = false;

  onMount(async () => {
    // Only proceed if we have a valid subject that looks like a folder key
    if (!subject || !subject.includes('__')) {
      console.warn('QuillEditor: Invalid subject provided, or not a folder key:', subject);
      return;
    }

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

    // Load initial content
    loadContentForSubject();

    // Listen for content changes and update the store for this specific subject
    quill.on('text-change', () => {
      if (!isInitialized) return; // Don't save during initial load
      
      const html = quill.root.innerHTML;
      
      // Update the store for this specific subject
      if (subject && subject.includes('__')) {
        console.log(`Saving content for ${subject}:`, html.substring(0, 50) + '...');
        quillEditorContent.update(content => {
          content[subject] = html;
          return content;
        });
      }

      // Call the onContentChange callback if provided
      if (onContentChange) {
        onContentChange(html);
      }
    });

    isInitialized = true;

    return () => {
      if (quill) {
        quill = null;
      }
    };
  });

  function loadContentForSubject() {
    if (!quill || !subject || !subject.includes('__')) return;
    
    // Get current content for this subject
    const currentContent = $quillEditorContent[subject];
    let contentToLoad = currentContent || '<p>Start writing...</p>';
    
    console.log(`Loading content for ${subject}:`, contentToLoad.substring(0, 50) + '...');
    
    // Temporarily disable initialization flag to prevent saving during load
    isInitialized = false;
    quill.root.innerHTML = contentToLoad;
    isInitialized = true;
  }

  // Watch for subject changes and update content accordingly
  $effect(() => {
    if (quill && subject && subject.includes('__') && isInitialized) {
      loadContentForSubject();
    }
  });

  // Public methods to interact with the editor
  export function getContent() {
    return quill ? quill.root.innerHTML : '';
  }

  export function setContent(html: string) {
    if (quill && subject && subject.includes('__')) {
      isInitialized = false;
      quill.root.innerHTML = html;
      quillEditorContent.update(content => {
        content[subject] = html;
        return content;
      });
      isInitialized = true;
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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    border-radius: 10px;
  }

  .editor-container {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    border: 1px solid #e1e5e9;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .editor-content {
    flex-grow: 1;
    min-height: 200px;
  }

  /* Custom styling for Quill toolbar */
  :global(.ql-toolbar) {
    background-color: #f8f9fa;
    border-bottom: 1px solid #e1e5e9;
    border-top: none;
    border-left: none;
    border-right: none;
    padding: 12px 16px;
    flex-shrink: 0;
  }

  :global(.ql-container) {
    border: none;
    font-size: 16px;
    line-height: 1.6;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  :global(.ql-editor) {
    padding: 20px;
    font-size: 16px;
    line-height: 1.6;
    color: #333;
    flex-grow: 1;
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