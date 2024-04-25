import React, { useEffect,useState } from 'react';
import { Button } from 'react-bootstrap';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';

class SearchSuggestions {
  constructor(inputId, suggestionId) {
    this.input = inputId;
    this.suggestion = suggestionId;
    this.baseUrl = 'https://en.wikipedia.org/w/api.php';
    this.suggestions = [];

    
    this.attachEvents();

  }

  attachEvents() {
    console.log(this.input);
    document.addEventListener('DOMContentLoaded', ()=>{
      console.log("loaded");
      this.input = document.getElementById(this.input);
      this.suggestion = document.getElementById(this.suggestion);
      console.log(this.input);
      this.input.addEventListener('input', (event) => {
        this.handleInput(event);
      });
  
      document.addEventListener('click', (event) => {
        if (!event.target.closest('.suggestions')) {
          this.hideAllSuggestions();
        }
      });
    });
  }

  handleInput(event) {
    const inputValue = event.target.value.toLowerCase();
    console.log(inputValue);
    fetch(`http://localhost:8080/suggest?q=${encodeURIComponent(inputValue)}`)
      .then(response => response.json())
      .then(data => {
        this.updateSuggestions(data);
      })
      .catch(error => {
        console.error('Error fetching suggestions:', error);
      });
  }

  updateSuggestions(filteredSuggestions) {
    this.suggestion.innerHTML = '';

    filteredSuggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.textContent = suggestion;
      li.addEventListener('click', () => {
        this.input.value = suggestion;
        this.hideAllSuggestions();
      });
      this.suggestion.appendChild(li);
    });

    this.suggestion.style.display = filteredSuggestions.length ? 'block' : 'none';
  }

  hideAllSuggestions() {
    this.suggestion.style.display = 'none';
  }
}

function SearchBox() {
  new SearchSuggestions('sourceLink', "sourceLink-suggestion");
  new SearchSuggestions("destLink", "destLink-suggestion");
  // const [isSearchMode, setisSearchMode] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [searchMode, setSearchMode] = useState("IDS"); // Default value for ID
  const [sourceLink, setSourceLink] = useState("");
  const [destLink, setDestLink] = useState("");

  const handleSearchModeChange = (value) => {
    setSearchMode(value);
  };

  useEffect(() => {
    if (isLoading) {
      fetch(`http://localhost:8080/search?mode=${encodeURIComponent(searchMode)}&source=${encodeURIComponent(sourceLink)}&dest=${encodeURIComponent(destLink)}`)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching results', error);
      });
    }
  }, [isLoading, searchMode, sourceLink, destLink]);

  const handleClick = () => setLoading(true);
  // const handleToggle = () => {
  //   setSearchMode(!isSearchMode);
  //   // send data to API
  // };

  return (
    <div className="container mt-5 mb-5 bg">
      <h1 className="text-center">Wiki Search</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form className="row justify-content-center">
            <div className="col justify-content-center text-center mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label ">Source Link</label>
              <input type="text" className="form-control" id="sourceLink" value={sourceLink} placeholder="Search..." autoComplete="off" onChange={(e) => setSourceLink(e.target.value)}/>
              <ul className="suggestions" id="sourceLink-suggestions"></ul>
            </div>
            <div className="col justify-content-center text-center mb-3">
              <label htmlFor="exampleInputEmail2" className="form-label">Destination Link</label>
              <input type="text" className="form-control" id="destLink" value={destLink} placeholder="Search..." autoComplete="off" onChange={(e) => setDestLink(e.target.value)}/>
              <ul className="suggestions" id="destLink-suggestions"></ul>
            </div>
            <p className='justify-content-center text-center'>Mode</p>
            <ToggleButtonGroup type="radio" name="options" defaultValue={[1,2]} className="mb-4">
              <ToggleButton id="tbg-check-1" value={1}>
                IDS
              </ToggleButton>
              <ToggleButton id="tbg-check-2" value={2}>
                BFS
              </ToggleButton>
            </ToggleButtonGroup>
            <Button 
              variant="success"
              className='row mb-2 position-relative justify-content-center'
              disabled={isLoading}
              onClick={!isLoading ? handleClick : null}>
              {isLoading ? "Loading..." : "Search"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
