document.querySelectorAll('input[type="radio"]').forEach((radio) => {
  radio.addEventListener('change', (event) => {
    if (event.target.checked) {
      if (event.target.value === 'option1') {
        console.log('IDS mode selected');
        return IDBObjectStore;
        // Do something for IDS mode
      } else if (event.target.value === 'option2') {
        console.log('BFS mode selected');
        // Do something for BFS mode
      }
    }
  });
});

class SearchHalndler {
  constructor() {
    this.inputs = document.querySelectorAll(input[type="radio"])
  }
}
