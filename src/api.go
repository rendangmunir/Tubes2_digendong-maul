package main

//TODO
//-Import BFS.go
//-Import IDS.go
import (
	"encoding/json"
	"errors"
	"strings"
	"fmt"
	"main/BFS"
	"main/IDS"
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

//Dummy function, bakal diganti sama import dari file lain
func IDSSearch(source string,dest string) ([]string, error){
	dummyArray := []string{source, dest}
	
  return dummyArray, nil
}

func sanitizeTitle(title string) string{
	sanitizedTitle := strings.ReplaceAll(title, " ", "_")
	return sanitizedTitle
}

func searchHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	mode := r.URL.Query().Get("mode")
	sourceLink := sanitizeTitle(r.URL.Query().Get("source"))
	destLink := sanitizeTitle(r.URL.Query().Get("dest"))

	fmt.Println(sourceLink)
	fmt.Println(destLink)
	fmt.Println(mode)
	var titles []string
	var err error
	var found bool
	fmt.Println(found)

	if mode == "IDS" {
			linkMap := make(map[string]bool)
			var jumlahArtikel uint64 = 0 // kembangin lagi
			pathContainer := make([]string, 0, 10)
			found, titles = IDS.IDS(sourceLink, destLink, &linkMap, &jumlahArtikel,4, pathContainer)
	} else {
			titles, err = BFS.BFS(sourceLink, destLink)
	}

	if err != nil {
			http.Error(w, "Failed to search Wikipedia", http.StatusInternalServerError)
			return
	}
	fmt.Println(titles)

	json.NewEncoder(w).Encode(titles)

}




func main() {
	//Testing fungsi dari BFS
	http.HandleFunc("/suggest", suggestionHandler)
	http.HandleFunc("/search", searchHandler)
	fmt.Println("Server running on port 8080")
	http.ListenAndServe(":8080", nil)
}
