package BFS;

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
)


func Main() {
	var awal, akhir string
	var solve []string
	var err error

	fmt.Print("Input Artikel Akhir: ")
	fmt.Scanln(&akhir)

	fmt.Print("Input Artikel Mulai: ")
	fmt.Scanln(&awal)

	solve, err = BFS(awal, akhir)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Print(solve)
}
func BFS(artAwal string, artDest string) ([]string, error) {
	var temp1, temp2 string
	var solusi []string
	ter, i, j, k := 0, 0, 0, 0

	MapArt := scrape(artAwal)
	MapArt2 := scrape(artAwal)
	MapArt[artAwal] = ""
	MapArt2[artAwal] = ""

	start := time.Now()
	for {
		fmt.Println(MapArt2[artDest])
		if _, exists := MapArt2[artDest]; exists {
			break
		}
		for key := range MapArt {
			// GET request
			if _, exists := MapArt2[artDest]; exists {
				break
			}
			fmt.Println(len(MapArt))
			fmt.Println(len(MapArt2))
			url := "https://en.wikipedia.org/wiki/" + key

			resp, err := http.Get(url)
			if err != nil {
				log.Fatal(err)
			}

			defer resp.Body.Close()

			// Parse HTML document
			doc, err := goquery.NewDocumentFromReader(resp.Body)
			if err != nil {
				log.Fatal(err)
			}

			// slice untuk menampung link yang sudah di scrape

			doc.Find("a").Each(func(_ int, selec *goquery.Selection) {
				href, exists := selec.Attr("href")
				if exists && strings.HasPrefix(href, "/wiki/") && !strings.Contains(href, ":") /* || strings.Contains(href, "Category:")  */ { // filter link yang awalannya /wiki/ dan tidak mengandung :
					title := strings.TrimPrefix(href, "/wiki/")
					if _, ada := MapArt2[title]; !ada {
						MapArt2[title] = key
						fmt.Println(title)
						j++
					}
				}
			})
			i++

		}
		fmt.Printf("%d,%d,%d \n", i, j, k)
		CopyMap(MapArt2, MapArt)
		k++
		if k > 8 {
			break
		}
	}
	temp1 = artDest
	solusi = append(solusi, artDest)
	for ter = 1; ter < 9; ter++ {
		temp2 = MapArt[temp1]

		if temp2 == "" {
			break
		}
		solusi = append(solusi, temp2)
		temp1 = temp2
	}
	elapsed := time.Since(start)
	fmt.Println("Elapsed time:", elapsed)
	fmt.Println("Hasil:", solusi)
	return solusi, nil
}
func scrape(str string) map[string]string {
	MapArt := make(map[string]string)
	// URL of the Wikipedia page you want to scrape
	url := "https://en.wikipedia.org/wiki/" + str

	// Make a GET request to the URL
	resp, err := http.Get(url)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()

	// Parse the HTML document
	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		log.Fatal(err)
	}

	// Create a new file to write the links
	file, err := os.Create("links.txt")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	// Find all links in the document
	doc.Find("a").Each(func(i int, s *goquery.Selection) {
		// Get the href attribute of the link
		href, exists := s.Attr("href")
		if exists {
			// Check if the link points to another Wikipedia page
			if strings.HasPrefix(href, "/wiki/") && !strings.HasPrefix(href, str) && (!strings.Contains(href, ":") || strings.Contains(href, "Category:")) {
				// Print the title of the linked Wikipedia page
				title := strings.TrimPrefix(href, "/wiki/")
				MapArt[title] = str
				//fmt.Fprintf(file, "https://en.wikipedia.org/wiki/%s\n", title)
				title = strings.ReplaceAll(title, "_", " ")
				fmt.Println(title)
			}
		}
	})
	return MapArt
}

func CopyMap(map1 map[string]string, map2 map[string]string) {
	for key, value := range map1 {
		map2[key] = value
	}
}
