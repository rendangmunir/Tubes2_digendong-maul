function showPage(pageId) {
  const content = document.getElementById('content');
            fetch(`${pageId}.html`)
                .then(response => response.text())
                .then(html => {
                    content.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading page:', error);
                    content.innerHTML = '<h1>Error</h1><p>Failed to load page.</p>';
                });
}

function handleHashChange() {
  const hash = window.location.hash.substring(1);
  showPage(hash || 'home');
}

window.addEventListener('hashchange', handleHashChange);
window.addEventListener('DOMContentLoaded', handleHashChange);