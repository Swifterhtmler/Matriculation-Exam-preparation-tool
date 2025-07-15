<!-- <script>
  import { get } from 'svelte/store';
  import { cards, todoItems, editorTextStore } from './stores.js';

  let userMessage = "";
  let assistantReply = "";
  let loading = false;

  async function askOpenAI() {
    loading = true;
    assistantReply = "";
    try {
      const allData = {
        cards: get(cards),
        todoItems: get(todoItems),
        editorText: get(editorTextStore),
      };

    const systemInstruction = `
You are an assistant that helps with study planning. 
Always use the provided user data to answer questions if it is relevant. 
If the answer cannot be found in the data, use your own knowledge to help the user, but do not mention that the data was missing or unavailable. 
You can use the user data to make quizzes and other challenges. 
You are a supportive study partner. 
Answer in Finnish, or in the language the user uses in their question. Do not suggest quizzes or other activities user does not ask just asnwer the question.
`.trim();

      const reply = await window.openaiAPI.chat([
      //   { role: "system", content: systemInstruction },
      //   { role: "user", content: userMessage },
        { role: "user", content: systemInstruction + "Here is my app data: " + JSON.stringify(allData) + userMessage }
      ]);

      assistantReply = reply;
    } catch (e) {
      assistantReply = "Virhe: " + e.message;
    }
    loading = false;
  }
</script>

<div class="container">
  <input
    type="text"
    bind:value={userMessage}
    placeholder="Kirjoita viesti tekoälylle"
    on:keydown={(e) => e.key === 'Enter' && askOpenAI()}
    style="width: 100%; max-width: 400px;"
  />
 
 <button class="btn" on:click={askOpenAI} disabled={loading || !userMessage}>
    <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" class="sparkle">
        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
    </svg>
   <span class="text">{loading ? "Kysytään..." : "Kysy"}</span>
  </button>
  <div style="margin-top: 1rem;">
    <strong>Vastaus:</strong>
    <div style="white-space: pre-wrap;">{assistantReply}</div>
  </div>
</div>

<style>
    .btn {
  border: none;
  width: 15em;
  height: 5em;
  border-radius: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: #1C1A1C;
  cursor: pointer;
  transition: all 450ms ease-in-out;
}

.sparkle {
  fill: #AAAAAA;
  transition: all 800ms ease;
}

.text {
  font-weight: 600;
  color: #AAAAAA;
  font-size: medium;
}

.btn:hover {
  background: linear-gradient(0deg,#A47CF3,#683FEA);
  box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
  inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
  0px 0px 0px 4px rgba(255, 255, 255, 0.2),
  0px 0px 180px 0px #9917FF;
  transform: translateY(-2px);
}

.btn:hover .text {
  color: white;
}

.btn:hover .sparkle {
  fill: white;
  transform: scale(1.2);
} 
</style> -->

<script lang="ts">
  import { get } from 'svelte/store';
  import { cards, todoItems, editorTextStore } from './stores.js'; // Adjust path based on where you save this component

  let userMessage = "";
  let assistantReply = "";
  let loading = false;

  // Use a reactive statement to debounce the user input for AI queries (optional but good for performance)
  // let debouncedUserMessage = userMessage;
  // let debounceTimer: NodeJS.Timeout;
  // $: {
  //   clearTimeout(debounceTimer);
  //   debounceTimer = setTimeout(() => {
  //     debouncedUserMessage = userMessage;
  //   }, 300); // 300ms debounce
  // }


  async function askOpenAI() {
    if (!userMessage.trim() || loading) {
      return; // Prevent empty or duplicate requests
    }

    loading = true;
    assistantReply = ""; // Clear previous reply

    try {
      const allData = {
        cards: get(cards),
        todoItems: get(todoItems),
        editorText: get(editorTextStore),
      };

      const systemInstruction = `
        You are an assistant that helps with study planning.
        Always use the provided user data to answer questions if it is relevant.
        If the answer cannot be found in the data, use your own knowledge to help the user, but do not mention that the data was missing or unavailable.
        You can use the user data to make quizzes and other challenges.
        You are a supportive study partner.
        Answer in Finnish, or in the language the user uses in their question. Do not suggest quizzes or other activities user does not ask just answer the question.
      `.trim();

      // Combine system instruction and user data with the actual user message
      const combinedMessage = `${systemInstruction}\n\nHere is my app data: ${JSON.stringify(allData)}\n\nUser question: ${userMessage}`;

      // Check if window.openaiAPI exists (for Electron context)
      if (typeof window !== 'undefined' && window.openaiAPI) {
        const reply = await window.openaiAPI.chat([
          { role: "user", content: combinedMessage }
        ]);
        assistantReply = reply;
      } else {
        assistantReply = "Virhe: OpenAI API ei ole käytettävissä. (Tarkista Electron preload.js)";
        console.error("window.openaiAPI is not defined. Are you running in Electron and is preload.js configured?");
      }

    } catch (e) {
      assistantReply = "Virhe: " + e.message;
      console.error("Error asking OpenAI:", e);
    } finally {
      loading = false;
      userMessage = ""; // Clear input field after sending
    }
  }
</script>

<div class="chatbot-container">
  <div class="chatbot-header">Tekoälyavustaja</div>
  <div class="chatbot-messages">
    {#if assistantReply}
      <div class="assistant-message" style="white-space: pre-wrap;">{assistantReply}</div>
    {/if}
    {#if loading}
      <div class="loading-indicator">Vastaus tulossa...</div>
    {/if}
  </div>
  <div class="chatbot-input-area">
    <input
      type="text"
      bind:value={userMessage}
      placeholder="Kysy jotain..."
      on:keydown={(e) => e.key === 'Enter' && askOpenAI()}
      disabled={loading}
    />
    <button class="send-btn" on:click={askOpenAI} disabled={loading || !userMessage.trim()}>
      {#if loading}
        <svg class="spinner" viewBox="0 0 50 50">
          <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
        </svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="send-icon">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      {/if}
    </button>
  </div>
</div>

<style>
 
 .chatbot-container {
    width: 400px; /* Fixed width */
    height: 300px; /* Fixed height */
    background-color: rgb(240, 241, 240);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: sans-serif; /* A neutral font */
    /* REMOVE position: fixed, left, transform, margin-top here */
    z-index: 998; /* Still good to keep this if it overlays other things */
   border: black 1px solid;
}

  .chatbot-header {
    background-color: #f0f0f0;
    padding: 10px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    text-align: center;
  }

  .chatbot-messages {
    flex-grow: 1; /* Takes up available space */
    padding: 10px;
    overflow-y: auto; /* Scroll for messages */
    display: flex;
    flex-direction: column;
    gap: 8px;
    background-color: #fdfdfd;
  }

  .assistant-message {
    background-color: #e6e6e6; /* Light grey bubble */
    padding: 8px 12px;
    border-radius: 12px;
    align-self: flex-start; /* Aligns to left for assistant */
    max-width: 85%; /* Don't stretch full width */
  }

  .loading-indicator {
    font-style: italic;
    color: #666;
    align-self: center;
    padding: 5px;
  }

  .chatbot-input-area {
    display: flex;
    padding: 10px;
    border-top: 1px solid #eee;
    background-color: #fff;
  }

  .chatbot-input-area input {
    flex-grow: 1;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 8px 15px;
    outline: none;
    font-size: 0.9em;
  }

  .chatbot-input-area input:focus {
    border-color: #a47cf3; /* Highlight on focus */
  }

  .send-btn {
    background: linear-gradient(0deg, #A47CF3, #683FEA); /* Your button gradient */
    border: none;
    border-radius: 50%; /* Make it round */
    width: 38px; /* Smaller size */
    height: 38px; /* Smaller size */
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 10px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    flex-shrink: 0; /* Prevent shrinking */
    padding: 0; /* Remove default padding */
  }

  .send-btn:hover {
    box-shadow: 0px 0px 8px 2px rgba(153, 23, 255, 0.4); /* Subtle hover glow */
    transform: translateY(-1px);
  }

  .send-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  .send-icon {
    color: white; /* Icon color */
  }

  /* Spinner for loading state */
  .spinner {
    animation: rotate 1s linear infinite;
    width: 20px;
    height: 20px;
  }
  .spinner .path {
    stroke: white;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
</style>