
// let contentUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=";

function searchWikipedia(query) {
  return fetch(`http://localhost:8080/search?q=${encodeURIComponent(query)}`)
    .then(response => response.json())
    .catch(error => {
      console.error('Error searching Wikipedia:', error);
      return [];
    });
}



function displayResults(results) {
  var resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h2>Search Results</h2><ul>";
  results.forEach(function(result) {
      resultsDiv.innerHTML += "<li>" + result + "</li>";
  });
  resultsDiv.innerHTML += "</ul>";
}
  

class SearchSuggestions {
    constructor(inputId, suggestionID) {
      this.input = document.getElementById(inputId);
      this.suggestion = document.getElementById(suggestionID);
      this.baseUrl = 'https://en.wikipedia.org/w/api.php';
      this.suggestions = [];
  
      this.attachEvents();
    }
  
    attachEvents() {
      console.log("HandlingEvent");
      console.log(this.input);
      this.input.addEventListener('input', (event) => {
        this.handleInput(event);
        console.log(event);
      });
  
      document.addEventListener('click', (event) => {
        if (!event.target.closest('.suggestion-box')) {
          this.hideAllSuggestions();
        }
      });
    }
  
    handleInput(event) {
      console.log("HandlingInput");
      const inputValue = event.target.value.toLowerCase();
      // const filteredSuggestions = this.suggestions.filter(suggestion =>
      // suggestion.toLowerCase().includes(inputValue)
      // );
  
      // Fetch suggestions from Wikipedia API

      fetch(`http://localhost:8080/suggest?q=${encodeURIComponent(inputValue)}`)
        .then(response => response.json())
        .then(data => {
          this.updateSuggestions(data);
          console.log(data);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    }
  
    updateSuggestions(filteredSuggestions) {

      this.suggestion.innerHTML = '';
      // const content = filteredSuggestions.map((list) =>{
      //   return "<li>" + list +"</li>"
      // });
      // this.suggestion.innerHTML = "<ul>" + content.join('') + "</ul>";
      const ul = document.createElement('ul');
      filteredSuggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.addEventListener('click', () => {
          this.input.value = suggestion;
          this.hideAllSuggestions();
        });
        ul.appendChild(li);
      });
      this.suggestion.appendChild(ul);
  
      this.suggestion.style.display = filteredSuggestions.length ? 'block' : 'none';
    }
  
    hideAllSuggestions() {
        this.suggestion.innerHTML = '';
    }
  }
  
  new SearchSuggestions("sourceLink","source-suggestion");
  new SearchSuggestions("destLink","dest-suggestion");