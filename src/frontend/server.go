package main

import (
	"encoding/json"
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
	params.Set("action", "query")
	params.Set("format", "json")
	params.Set("list", "search")
	params.Set("srsearch", query)

	url := baseURL + "?" + params.Encode()

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var searchRes SearchResponse
	if err := json.NewDecoder(resp.Body).Decode(&searchRes); err != nil {
		return nil, err
	}

	titles := make([]string, len(searchRes.Query.Search))
	for i, result := range searchRes.Query.Search {
		titles[i] = result.Title
	}

	return titles, nil
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
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
	http.HandleFunc("/search", searchHandler)
	fmt.Println("Server running on port 8080")
	http.ListenAndServe(":8080", nil)
}
