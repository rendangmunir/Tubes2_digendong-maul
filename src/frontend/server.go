package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"net/url"
)

const baseURL = "https://en.wikipedia.org/w/api.php"

func enableCors(w *http.ResponseWriter) {
    (*w).Header().Set("Access-Control-Allow-Origin", "*")
    (*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    (*w).Header().Set("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With")
}

type SearchResponse struct {
	Query struct {
		Search []struct {
			Title string `json:"title"`
		} `json:"search"`
	} `json:"query"`
}

func searchWikipedia(query string) ([]string, error) {
	params := url.Values{}
	params.Set("action", "opensearch")
	params.Set("format", "json")
	params.Set("search", query)

	url := baseURL + "?" + params.Encode()
	fmt.Println(url)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var searchRes []interface{}
    if err := json.NewDecoder(resp.Body).Decode(&searchRes); err != nil {
        return nil, err
    }

	if len(searchRes) < 2 {
        return nil, errors.New("invalid response format")
    }

    titles := make([]string, len(searchRes[1].([]interface{})))
    for i, title := range searchRes[1].([]interface{}) {
        titles[i] = title.(string)
    }

    return titles, nil

}

func suggestionHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	query := r.URL.Query().Get("q")
	titles, err := searchWikipedia(query)
	if err != nil {
		http.Error(w, "Failed to search Wikipedia", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(titles)
}

func IDSSearch(source string,dest string) ([]string, error){
	dummyArray := []string{"result1", "result2", "result3"}

  return dummyArray, nil
}
func BFSSearch(source string,dest string) ([]string, error){
	dummyArray := []string{"result1", "result2", "result3"}

  return dummyArray, nil
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	mode := r.URL.Query().Get("mode")
	sourceLink := r.URL.Query().Get("source")
	destLink := r.URL.Query().Get("dest")
	fmt.Println(mode)
	fmt.Println(sourceLink)
	fmt.Println(destLink)
	var titles []string
	var err error

	if mode == "IDS" {
			titles, err = IDSSearch(sourceLink, destLink)
	} else {
			titles, err = BFSSearch(sourceLink, destLink)
	}

	if err != nil {
			http.Error(w, "Failed to search Wikipedia", http.StatusInternalServerError)
			return
	}

	json.NewEncoder(w).Encode(titles)

}

func BFSHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	query := r.URL.Query().Get("q")
	titles, err := searchWikipedia(query)
	if err != nil {
		http.Error(w, "Failed to search Wikipedia", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(titles)
}



func main() {
	http.HandleFunc("/suggest", suggestionHandler)
	http.HandleFunc("/search", searchHandler)
	fmt.Println("Server running on port 8080")
	http.ListenAndServe(":8080", nil)
}
