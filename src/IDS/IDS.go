package IDS

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

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

func IDS(target string, current string, unique *map[string]bool, jumlahArtikel *uint64, maxDepth int, prevPath []string) (bool, []string) {
	for i := 0; i <= maxDepth; i++ {

		check, arr := DLS(target, current, i, unique, jumlahArtikel, prevPath)

		// fmt.Println("iterasi", i, "path", arr)

		if check {
			return true, arr
		}
	}

	empty := make([]string, 0)
	return false, empty
}

func DLS(target string, current string, limit int, unique *map[string]bool, jumlahArtikel *uint64, prevPath []string) (bool, []string) {

	// cek apakah link sudah pernah dijumpai
	if !(*unique)[current] {
		(*unique)[current] = true
	}
	// copy slice awal, masukkan current
	tempArr := make([]string, len(prevPath), len(prevPath))
	copy(tempArr, prevPath)
	tempArr = append(tempArr, current)

	// fmt.Println("prev:", prevPath)

	// fmt.Println("arr:", tempArr)

	// fmt.Println("temp:", tempArr, "current", current)

	// url akhir ditemukan
	if target == current {
		return true, tempArr
	}

	// limitnya sudah maksimal. berhenti
	if limit <= 0 {
		clear(tempArr)
		return false, tempArr
	}

	// belum ditemukan, tapi belum mencapai limit
	// buat array yang isinya children (semua link wikipedia yang ada di webpage tersebut)
	// cek untuk setiap elemen array tersebut
	children := getLinks(current)
	for _, element := range children {

		check, arr := DLS(target, element, limit-1, unique, jumlahArtikel, tempArr)

		if check {
			return true, arr
		}
	}

	empty := make([]string, 0)
	return false, empty

}

func main() {
	// URL awal dan akhir
	url := "https://en.wikipedia.org/wiki/Hollywood%2C_Los_Angeles"
	target := "https://en.wikipedia.org/wiki/Indonesia"

	// var childLinks []string = getLinks(url)
	// for _, element := range childLinks {
	// 	fmt.Println(element)
	// }
	// fmt.Println(len(childLinks))

	// boolean found
	var destFound bool = false

	// jumlah artikel
	linkMap := make(map[string]bool)
	var jumlahArtikel uint64 = 0 // kembangin lagi

	// panjang path
	var panjangPath int = 0

	// container path dari link awal sampai link akhir
	path := make([]string, 0, 10)

	// mulai timer
	timerStart := time.Now()

	for i := 0; i <= 6; i++ {
		pathContainer := make([]string, 0, 10)
		check, array := IDS(target, url, &linkMap, &jumlahArtikel, i, pathContainer)

		// fmt.Println("array:", i, array)

		if check {
			destFound = true
			panjangPath = i
			path = make([]string, len(array))
			copy(path, array)
			break
		}
	}

	timerStop := time.Now()
	programDuration := timerStop.Sub(timerStart)

	if destFound {
		fmt.Println("found")
		fmt.Println("panjang path:", panjangPath)
		fmt.Println("jalur:")
		for _, element := range path {
			fmt.Println(element)
		}
		fmt.Println("durasi algoritma IDS:", programDuration.Milliseconds(), "ms")
		fmt.Println("jumlah artikel:", len(linkMap))
	} else { // !destFound
		fmt.Println("not found")
	}

}
