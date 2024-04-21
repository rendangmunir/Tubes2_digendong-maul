// class SearchSuggestions {
//     constructor() {
//         this.inputs = document.querySelectorAll('.search-input');
//         this.suggestionLists = document.querySelectorAll('.suggestions');
//         this.suggestions = ['apple', 'banana', 'cherry', 'date'];

//         this.attachEvents();
//     }

//     attachEvents() {
//         this.inputs.forEach((input, index) => {
//         input.addEventListener('input', (event) => {
//             this.handleInput(event, index);
//         });
//         });

//         document.addEventListener('click', (event) => {
//         if (!event.target.closest('.suggestions')) {
//             this.hideAllSuggestions();
//         }
//         });
//     }

//     handleInput(event, index) {
//         const inputValue = event.target.value.toLowerCase();
//         const filteredSuggestions = this.suggestions.filter(suggestion =>
//         suggestion.toLowerCase().includes(inputValue)
//         );

//         this.updateSuggestions(filteredSuggestions, index);
//     }

//     updateSuggestions(filteredSuggestions, index) {
//         const suggestionList = this.suggestionLists[index];
//         suggestionList.innerHTML = '';

//         filteredSuggestions.forEach(suggestion => {
//         const li = document.createElement('li');
//         li.textContent = suggestion;
//         li.addEventListener('click', () => {
//             this.inputs[index].value = suggestion;
//             this.hideAllSuggestions();
//         });
//         suggestionList.appendChild(li);
//         });

//         suggestionList.style.display = filteredSuggestions.length ? 'block' : 'none';
//     }

//     hideAllSuggestions() {
//         this.suggestionLists.forEach(suggestionList => {
//         suggestionList.style.display = 'none';
//         });
//     }
//     }

//     new SearchSuggestions();

let searchUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&format=json&search=";
let contentUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&rvprop=content&format=json&titles=";

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
      this.inputs = document.querySelectorAll('.search-input');
      this.suggestionLists = document.querySelectorAll('.suggestions');
      this.baseUrl = 'https://en.wikipedia.org/w/api.php';
      this.suggestions = [];
  
      this.attachEvents();
    }
  
    attachEvents() {
      this.inputs.forEach((input, index) => {
        input.addEventListener('input', (event) => {
          this.handleInput(event, index);
        });
      });
  
      document.addEventListener('click', (event) => {
        if (!event.target.closest('.suggestions')) {
          this.hideAllSuggestions();
        }
      });
    }
  
    handleInput(event, index) {
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


// const searchInput = document.getElementById('search');
// const suggestionsList = document.getElementById('suggestions');
// const suggestions = ['apple', 'banana', 'cherry', 'date'];

// searchInput.addEventListener('input', function() {
//     const inputValue = this.value.toLowerCase();
//     console.log(inputValue)
//     console.log("test")
//     const filteredSuggestions = suggestions.filter(suggestion =>
//     suggestion.toLowerCase().includes(inputValue)
//     );

//     suggestionsList.innerHTML = '';
//     filteredSuggestions.forEach(suggestion => {
//     const li = document.createElement('li');
//     li.textContent = suggestion;
//     li.addEventListener('click', function() {
//         searchInput.value = suggestion;
//         suggestionsList.innerHTML = '';
//     });
//     suggestionsList.appendChild(li);
//     });

//     suggestionsList.style.display = filteredSuggestions.length ? 'block' : 'none';
// });

// document.addEventListener('click', function(event) {
//     if (!event.target.closest('#suggestions')) {
//     suggestionsList.style.display = 'none';
//     }
// });