package main;

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/PuerkitoBio/goquery"
)



func main() {
    // URL of the Wikipedia page you want to scrape
    url := "https://en.wikipedia.org/wiki/Lionel_Messi"

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
            if strings.HasPrefix(href, "/wiki/") {
                // Print the title of the linked Wikipedia page
                title := strings.TrimPrefix(href, "/wiki/")
				fmt.Fprintf(file, "https://en.wikipedia.org/wiki/%s\n", title)
                title = strings.ReplaceAll(title, "_", " ")
                fmt.Println(title)
            }
        }
    })
}
// package main;