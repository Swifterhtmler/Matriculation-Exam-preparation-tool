<script lang="ts">
   import { Math } from 'svelte-math';

   export let aiResponse;
  
  // Parse AI response to separate text and math
  function parseResponse(text: string) {
    const parts = [];

    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

    const regex = /(\$\$[^$]+\$\$|\$[^$]+\$)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before math
      if (match.index > lastIndex) {
        parts.push({ 
          type: 'text', 
          content: text.slice(lastIndex, match.index) 
        });
      }
      
      // Add math
      const isDisplay = match[0].startsWith('$$');
      const latex = match[0].replace(/\$+/g, '');
      parts.push({ 
        type: 'math', 
        latex, 
        displayMode: isDisplay 
      });
      
      lastIndex = regex.lastIndex;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push({ 
        type: 'text', 
        content: text.slice(lastIndex) 
      });
    }
    
    return parts;
  }
  
  $: parts = parseResponse(aiResponse);
</script>

<div class="chemistry-response">
  {#each parts as part}
    {#if part.type === 'text'}
      <!-- <span>{part.content}</span> -->
       <span>{@html part.content}</span>
    {:else}
      <Math latex={part.latex} displayMode={part.displayMode} />
    {/if}
  {/each}
</div>



<style>

.chemistry-response :global(math),
.chemistry-response :global(math *) {
  color: #5572b4 !important;
  fill: #5070af !important; 
  font-size: 1.3rem;
}
  .chemistry-response {
    color: inherit; /* or whatever color you want */
    line-height: 1.6;
  }
  
  .chemistry-response span {
    color: #000000;
  }


</style>