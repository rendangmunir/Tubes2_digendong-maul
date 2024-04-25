package main

import (
	"fmt"
	"log"
	"net/http"
	"strings"

	// "os"

	"github.com/PuerkitoBio/goquery"
)

// fungsi untuk menghapus duplikat dari slice
func removeDuplicate(arr *[]string) {
	seen := make(map[string]bool)

	// buat slice baru yang unik
	new := []string{}

	for _, element := range *arr {
		if !seen[element] {
			seen[element] = true
			new = append(new, element)
		}
	}
	// update slice yang lama
	*arr = new

}

func getLinks(aLink string) []string {
	// GET request
	response, err := http.Get(aLink)
	if err != nil {
		log.Fatal(err)
	}

	defer response.Body.Close()

	// Parse HTML document
	HTMLdoc, err := goquery.NewDocumentFromReader(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	// slice untuk menampung link yang sudah di scrape
	var linkContainer []string

	HTMLdoc.Find("a").Each(func(_ int, selec *goquery.Selection) {
		link, found := selec.Attr("href")
		if found && strings.HasPrefix(link, "/wiki/") && !strings.Contains(link, ":") { // filter link yang awalannya /wiki/ dan tidak mengandung :
			linkContainer = append(linkContainer, "https://en.wikipedia.org"+link)
		}
	})

	// menghapus duplikat yang ada
	removeDuplicate(&linkContainer)
	return linkContainer
}

// bool karena ada pengecekan
// ptr ke jumlahArtikel karena akan ngeupdate tiap iterasi

func IDS(target string, current string, jumlahArtikel *uint64, maxDepth int) bool {
	for i := 0; i <= maxDepth; i++ {
		if DLS(target, current, i, jumlahArtikel) {
			return true
		}
	}

	return false
}

func DLS(target string, current string, limit int, jumlahArtikel *uint64) bool {

	// url akhir ditemukan
	if target == current {
		return true
	}

	// limitnya sudah maksimal. berhenti
	if limit <= 0 {
		return false
	}

	// belum ditemukan, tapi belum mencapai limit
	// buat array yang isinya children (semua link wikipedia yang ada di webpage tersebut)
	// cek untuk setiap elemen array tersebut
	children := getLinks(current)
	for _, element := range children {
		if DLS(target, element, limit-1, jumlahArtikel) == true {
			return true
		}
	}

	return false

}

func main() {
	// URL awal dan akhir
	url := "https://en.wikipedia.org/wiki/Lionel_Messi"
	target := "https://en.wikipedia.org/wiki/Indonesia"

	var childLinks []string = getLinks(url)
	for _, element := range childLinks {
		fmt.Println(element)
	}
	fmt.Println(len(childLinks))

	// jumlah artikel
	var jumlahArtikel uint64 = 0 // kembangin lagi

	// panjang path
	var panjangPath int = 0

	// container path dari link awal sampai link akhir
	path := make([]string, 0)
	path = append(path, url)

	for i := 0; i <= 6; i++ {
		if IDS(target, url, &jumlahArtikel, i) == true {
			fmt.Println("found")
			panjangPath = i
			fmt.Println("panjang path:", panjangPath)
			break
		}
	}
}
