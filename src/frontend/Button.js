const idsButton = document.getElementById('ids-button');
const bfsButton = document.getElementById('bfs-button');
const sourceInput = document.getElementById('sourceLink');
const destInput = document.getElementById('destLink');

function titleToUrl(title) {
  // Encode the title for use in a URL
  const baseUrl = 'https://en.wikipedia.org/wiki/';
  const sanitizedPageTitle = title.replace(/ /g, '_');
  return `${baseUrl}${encodeURIComponent(sanitizedPageTitle)}`;
}

function updateResults(data, mode) {
  const result = document.getElementById('result');
  result.innerHTML = '';
  const ResultMsg = document.createElement('p');
  ResultMsg.textContent = "Found Result using "+mode+" Algorithm with processing time"
  result.appendChild(ResultMsg);
  const ul = document.createElement('ul');
    data.forEach(result => {
      const a = document.createElement('a');
      const li = document.createElement('li');
      a.textContent = result;
      a.href = titleToUrl(result);
      a.target = "_blank";
      li.appendChild(a);
      ul.appendChild(li);
    });
  result.appendChild(ul);
};

idsButton.addEventListener('click', () =>{
  const SourceLink = sourceInput.value;
  const DestLink = destInput.value;
  fetch(`http://localhost:8080/search?mode=BFS&source=${SourceLink}&dest=${DestLink}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);

    updateResults(data, "IDS");
  })
  .catch( error =>{
    console.error('Error fetching results', error);
  });

  
  console.log("IDS button");
  console.log(sourceInput.value);
  console.log(destInput.value);
});
bfsButton.addEventListener('click', () =>{
  const SourceLink = sourceInput.value;
  const DestLink = destInput.value;
  bfsButton.setAttribute('disabled', 'disabled');
  idsButton.setAttribute('disabled', 'disabled');
  fetch(`http://localhost:8080/search?mode=IDS&source=${SourceLink}&dest=${DestLink}`)
  .then(response => response.json())
  .then(data => {
    updateResults(data,"BFS");
  })
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