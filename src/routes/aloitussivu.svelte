<script>
  import { writable } from "svelte/store";

  // import { cards } from "./stores.js"; 
  // import { cards } from "./stores.js";
  import Flashcards from "./flashcards.svelte";
	import Matematiikka from "./matematiikka.svelte";
  import { cards } from "./stores.js";
  import Linechart from "./linechart.svelte";
 
  import Fysiikka from "./fysiikka.svelte";
  import Arcchart from "./arcchart.svelte";
  import Arcchartto from "./arcchartto.svelte";

  
  import Artificialintelligence from "./artificialintelligence.svelte";

  import Todo from "./todo.svelte";




  import { onMount } from 'svelte';



  import { Chart, Svg, Axis, Bars } from 'layerchart';






</script>

<div id="charts-container">

<Arcchart usecase={"Muistikortit"} subject="Yleiset muistikortit" />



<Arcchartto usecase={"Tehtävien määrä"} subject="Yleiset tehtävät" />


<Linechart />



<!-- <SvelteCalenderDisplay /> -->

</div>





<!--Now add the library LayerChart tailwdin installed "!important for over ridind styles."-->

<div class="usecase-container">
<div class="container">  
 
<Flashcards subject={"Yleiset muistikortit"} />


<Todo subject="Yleiset tehtävät" />



<div id="ai-div">
 <Artificialintelligence />
</div>



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

  #ai-div {
    margin-top: 20px;
    width: 540px;
    height: 600px;
    margin-left: 30px;
  }

</style>
