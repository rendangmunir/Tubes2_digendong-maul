document.addEventListener('DOMContentLoaded', function() {
  const searchButton = document.getElementById('search-button');
  const resultDetails = document.querySelector('.result-details');
  const results = document.querySelector('.results');

  searchButton.addEventListener('click', function() {
      // Create a new element for the result details
      const newResultDetail = document.createElement('p');
      newResultDetail.textContent = 'Result details';
      console.log("Searching...")

      // Create a new element for the result
      const newResult = document.createElement('div');
      newResult.textContent = 'Result';

      // Append the new elements to their respective divs
      resultDetails.appendChild(newResultDetail);
      results.appendChild(newResult);
  });
});
