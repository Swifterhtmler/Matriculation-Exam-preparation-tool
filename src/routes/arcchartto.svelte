<script>
  import { Chart, Svg, Arc } from 'layerchart';
  import { todoItems } from './stores';


  export let subject = "";
  

  $: subjectTodos = $todoItems[subject] ?? [];
  $: value = subjectTodos.length

  let domain = [0,10]

 export let usecase = "Määrä" 

//     $: value = domainsecondelement > 0 ? Math.round(($cards.length / domainsecondelement) * 100) : 0;

//    function handleInput(e) {
//     domainsecondelement = e.target.value ? Number(e.target.value) : 100;
//   }

</script>


<div class="w-[300px] h-[300px] border bg-gray-100 rounded-2xl flex flex-col items-center justify-center">
  <div class="w-[200px] h-[200px] relative">
    <Chart>
      <Svg center>
        <Arc
          {value}
          {domain}
          range={[0, 360]}
          outerRadius={80}
          innerRadius={60}
          fill="blue"
          track={{ fill: "lightgray" }}
        />
      </Svg>
    </Chart>
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="text-2xl font-bold text-gray-700">{value}</span>
    </div>
    <span class=" block w-full text-1xl font-bold text-gray-600 text-center">{usecase}</span>
  
  </div>
</div>

