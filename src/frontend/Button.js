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

function urltostring(title){
  const stringTitle = title.replace(/_/g, ' ');
  return stringTitle;
}


function ErrorMsg() {
  const result = document.getElementById('result');
  result.innerHTML = '';
  const msg = document.createElement('p');
  msg.innerHTML = `Failed Fetching Result, API maybe down or Result not found`
  result.appendChild(msg);
}
function updateResults(data, mode, time) {
  const result = document.getElementById('result');
  result.innerHTML = '';
  const ResultMsg = document.createElement('p');
  ResultMsg.innerHTML = `Found Result using ${mode} Algorithm with processing time ${time} ms`
  result.appendChild(ResultMsg);
  const ul = document.createElement('ul');
    data.forEach(result => {
      const a = document.createElement('a');
      const li = document.createElement('li');
      const stringResult = urltostring(result);
      li.textContent = stringResult;
      a.href = titleToUrl(result);
      a.target = "_blank";
      a.appendChild(li);
      ul.appendChild(a);
    });
  result.appendChild(ul);
};

idsButton.addEventListener('click', () =>{
  const result = document.getElementById('result');
  result.innerHTML = '';
  const loadingGif = document.createElement('img');
  loadingGif.src = "public/loading-azurlane.gif";
  result.appendChild(loadingGif);

  const SourceLink = sourceInput.value;
  const DestLink = destInput.value;
  bfsButton.setAttribute('disabled', 'disabled');
  idsButton.setAttribute('disabled', 'disabled');
  const start = performance.now();

  fetch(`http://localhost:8080/search?mode=IDS&source=${SourceLink}&dest=${DestLink}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const endTime = performance.now();
    const processingTime = Math.round(endTime-start);
    updateResults(data, "IDS", processingTime);
  })
  .catch( error =>{
    ErrorMsg();
    console.error('Error fetching results', error);
  })
  .finally(() =>{
    bfsButton.removeAttribute('disabled');
    idsButton.removeAttribute('disabled');
  });

  
  console.log("IDS button");
  console.log(sourceInput.value);
  console.log(destInput.value);
});

bfsButton.addEventListener('click', () => {
  const result = document.getElementById('result');
  result.innerHTML = '';
  const loadingGif = document.createElement('img');
  loadingGif.src = "public/loading-azurlane.gif";
  result.appendChild(loadingGif);

  const SourceLink = sourceInput.value;
  const DestLink = destInput.value;
  bfsButton.setAttribute('disabled', 'disabled');
  idsButton.setAttribute('disabled', 'disabled');
  const start = performance.now();
  fetch(`http://localhost:8080/search?mode=BFS&source=${SourceLink}&dest=${DestLink}`)
  .then(response => response.json())
  .then(data => {
    console.log(data);
    const endTime = performance.now();
    const processingTime = Math.round(endTime-start);
    updateResults(data,"BFS", processingTime);
  })
  .catch( error =>{
    ErrorMsg();
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