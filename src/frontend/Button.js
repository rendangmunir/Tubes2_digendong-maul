const idsButton = document.getElementById('ids-button');
const bfsButton = document.getElementById('bfs-button');
const sourceInput = document.getElementById('sourceLink');
const destInput = document.getElementById('destLink');

function titleToUrl(title) {
  // Encode the title for use in a URL
  const encodedTitle = encodeURIComponent(title);
  
  // Construct the Wikipedia URL
  const wikipediaUrl = `https://en.wikipedia.org/wiki/${encodedTitle}`;

  return wikipediaUrl;
}

idsButton.addEventListener('click', () =>{
  const SourceLink = sourceInput.value;
  const DestLink = destInput.value;
  fetch(`http://localhost:8080/search?mode=BFS&source=${encodeURIComponent(SourceLink)}&dest=${encodeURIComponent(DestLink)}`)
  .then(response => response.json())
  .catch( error =>{
    console.error('Error fetching results', error);
  });
  console.log("IDS button");
  console.log(sourceInput.value);
  console.log(destInput.value);
});
bfsButton.addEventListener('click', () =>{
  const SourceLink = titleToUrl(sourceInput.value);
  const DestLink = titleToUrl(destInput.value);
  bfsButton.setAttribute('disabled', 'disabled');
  idsButton.setAttribute('disabled', 'disabled');
  fetch(`http://localhost:8080/search?mode=BFS&source=${encodeURIComponent(SourceLink)}&dest=${encodeURIComponent(DestLink)}`)
  .then(response => response.json())
  .catch( error =>{
    console.error('Error fetching results', error);
  })
  .finally(() =>{
    bfsButton.removeAttribute('disabled');
    idsButton.removeAttribute('disabled');
  });
  // fetch()
  console.log("BFS button");
  console.log(SourceLink);
  console.log(DestLink);
});