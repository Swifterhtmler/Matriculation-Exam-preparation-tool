

let texting = `funktioisomeria
(functional isomerism) on rakenneisomerian laji, jossa isomeereillä on eri funktionaalinen ryhmä.
isomeria
(isomerism) on ilmiö, jolloin usealla yhdisteellä on sama molekyylikaava, mutta eri rakennekaava.
paikkaisomeria
(positional isomerism) on rakenneisomerian laji, jossa saman funktionaalisen ryhmän paikka molekyylissä vaihtelee.
rakenneisomeria
(structural/constitutional isomerism) on isomerian laji, jossa samaa molekyylikaavaa vastaavien yhdisteiden atomien keskinäinen sitoutumisjärjestys on erilainen.
runkoisomeria
(chain isomerism) on rakenneisomerian laji, jossa isomeerien hiilivetyketju on eri tavoin haarautunut tai syklinen.
`;


function parseCards(text) {
  const lines = text.trim().split('\n');
  const cards = [];
  
   for (let i = 0; i < lines.length; i += 2) {
    if (i + 1 < lines.length) {
      cards.push({
        front: lines[i].trim(),      
        back: lines[i + 1].trim()    
      });
    }
  }
  
  return cards;
}

console.log(parseCards(texting))

