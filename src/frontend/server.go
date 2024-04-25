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
func searchWikipedia2(query string) ([]map[string]interface{}, error) {
	params := url.Values{}
	params.Set("action", "opensearch")
	params.Set("format", "json")
	params.Set("prop", "pageimages|pageterms")
	params.Set("generator", "search")
	params.Set("piprop", "thumbnail")
	params.Set("pithumbsize", "300")
	params.Set("pilimit", "10")
	params.Set("wbptterms", "description")
	params.Set("gsrsearch", query)
	params.Set("gsrlimit", "5")

	resp, err := http.Get(baseURL + "?" + params.Encode())
	if err != nil {
			return nil, err
	}
	defer resp.Body.Close()

	var searchRes map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&searchRes); err != nil {
			return nil, err
	}

	pages := searchRes["query"].(map[string]interface{})["pages"].(map[string]interface{})
	searchResults := make([]map[string]interface{}, 0, len(pages))
	for _, page := range pages {
			pageData := page.(map[string]interface{})
			title := pageData["title"].(string)
			description := ""
			if terms, ok := pageData["terms"].(map[string]interface{}); ok {
					if desc, ok := terms["description"].([]interface{}); ok && len(desc) > 0 {
							description = desc[0].(string)
					}
			}
			thumbnailURL := ""
			if thumbnail, ok := pageData["thumbnail"].(map[string]interface{}); ok {
					thumbnailURL = thumbnail["source"].(string)
			}
			wikipediaURL := "https://en.wikipedia.org/wiki/" + url.PathEscape(title)

			searchResults = append(searchResults, map[string]interface{}{
					"title":       title,
					"description": description,
					"thumbnail":   thumbnailURL,
					"wikipedia":   wikipediaURL,
			})
	}

	return searchResults, nil
}

func suggestionHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	query := r.URL.Query().Get("q")
	titles, err := searchWikipedia2(query)
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
	fmt.Println(sourceLink)
	fmt.Println(destLink)
	fmt.Println(mode)
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
