
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
    constructor() {
      this.inputs = document.querySelectorAll('.form-control');
      this.suggestionLists = document.querySelectorAll('.suggestions');
      this.baseUrl = 'https://en.wikipedia.org/w/api.php';
      this.suggestions = [];
  
      this.attachEvents();
    }
  
    attachEvents() {
      console.log("HandlingEvent");
      console.log(this.inputs);
      this.inputs.forEach((input, index) => {
        console.log(input);
        input.addEventListener('input', (event) => {
          this.handleInput(event, index);
          console.log(event);
        });
      });
  
      document.addEventListener('click', (event) => {
        if (!event.target.closest('.suggestions')) {
          this.hideAllSuggestions();
        }
      });
    }
  
    handleInput(event, index) {
      console.log("HandlingInput");
      const inputValue = event.target.value.toLowerCase();
      const filteredSuggestions = this.suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(inputValue)
      );
  
      // Fetch suggestions from Wikipedia API

      // let url = this.baseUrl+inputValue;
      // loadJSON(url, gotURL, 'jsonp');
      fetch(`http://localhost:8080/search?q=${encodeURIComponent(inputValue)}`)
        .then(response => response.json())
        .then(data => {
          this.updateSuggestions(data, index);
          console.log(data);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
        });
    }
  
    updateSuggestions(filteredSuggestions, index) {
      const suggestionList = this.suggestionLists[index];
      suggestionList.innerHTML = '';
  
      filteredSuggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.addEventListener('click', () => {
          this.inputs[index].value = suggestion;
          this.hideAllSuggestions();
        });
        suggestionList.appendChild(li);
      });
  
      suggestionList.style.display = filteredSuggestions.length ? 'block' : 'none';
    }
  
    hideAllSuggestions() {
      this.suggestionLists.forEach(suggestionList => {
        suggestionList.style.display = 'none';
      });
    }
  }
  
  new SearchSuggestions();