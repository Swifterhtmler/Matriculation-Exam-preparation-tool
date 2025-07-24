<script>
  import { LineChart } from 'layerchart';
  import { motivationval } from './stores';
  import { onMount } from 'svelte';

  import { get } from 'svelte/store';

  let newVal = '';
  let multiSeriesData = [];

  $: $motivationval, multiSeriesData = $motivationval.map((val, index) => {
    const date = new Date();
    date.setDate(date.getDate() - ($motivationval.length - 1 - index));

    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;

    return {
      date,
      motivaatio: val
    };
  });



  function addMot() {
    const number = parseFloat(newVal);
    if (!isNaN(number)) {
      motivationval.update(curr => [...curr, number]);
      newVal = '';
    }
  }

function enforceMinMax(event) {
  const el = event.target;
  if (el.value !== "") {
    if (parseInt(el.value) < parseInt(el.min)) {
      el.value = el.min;
    }
    if (parseInt(el.value) > parseInt(el.max)) {
      el.value = el.max;
    }
  }
}

  function handleEnter(event) {
    if (event.key === 'Enter') {
      addMot();
    }
  }
</script>


<div id="align-container-setup">
<div class="data">
  <div class="h-[300px] p-4 border rounded">
    <LineChart
      data={multiSeriesData}
      x="date"
      series={[{ key: "motivaatio", color: "#3b82f6" }]}
    />
  </div>
<div class="input-container">
  <input
    type="number"
    bind:value={newVal}
    on:keypress={handleEnter}
    placeholder="Anna numero"
    min="1"
    max="10"
    on:input={enforceMinMax}
    class="input-field"
  />
</div>
</div>
</div>
<style>
  .data {
    width: 700px;
    height: 330px;
    background-color: #f3f4f5;
    padding: 10px;
    border-radius: 10px;
  }

  input {
    width: 160px !important;
    height: 28px !important;
  }

  .data :global(svg path),
  .data :global(svg .area),
  .data :global(svg .mark-line),
  .data :global(svg .mark-area) {
    fill: none !important;
  }


   #align-container-setup {
     background-color: #f3f4f5;
     padding-bottom: 25px;
     border-radius: 11px;

   }


  .input-field {
   display: block;
   margin: 10px auto 0 auto;
   width: 150px;
   background-color: rgb(241, 242, 241);
  }


  .data :global(svg .line) {
    stroke-width: 2px !important;
    stroke: #3b82f6 !important;
  }

  .data :global(svg text),
  .data :global(svg .axis text) {
    fill: #374151 !important;
    font-size: 12px;
  }

  .data :global(svg .axis line),
  .data :global(svg .tick line) {
    stroke: #d1d5db !important;
  }

  .data :global(svg rect:not(.background)) {
    fill: var(--bar-color, #3b82f6) !important;
  }
</style>