// Hilfsfunktion zur Normalisierung der Suchanfrage
function normalizeSearchString(str) {
    return str
        .toLowerCase()
        .replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss');
}

async function loadCSV() {
    let response = await fetch('data.csv');
    let data = await response.text();
    let rows = data.split('\n');
    rows.shift(); // Entfernt die Kopfzeile
    let csvData = rows.map(row => {
        let [code, name] = row.split(',');
        return { code: parseInt(code, 10), name };
    }).sort((a, b) => a.code - b.code); // Sortierung nach Code
    displayResults(csvData); // Zeige alle Daten beim Laden
    return csvData;
}

async function searchInCSV() {
    let query = normalizeSearchString(document.getElementById('searchQuery').value);
    let csvData = await loadCSV();
    if (query) {
        csvData = csvData.filter(row => 
            row.code.toString().includes(query) || normalizeSearchString(row.name).includes(query)
        );
    }
    displayResults(csvData);
}

function displayResults(results) {
    let resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = results.map(row => `<div>Code: ${row.code}, Name: ${row.name}</div>`).join('');
}

// Initial load
loadCSV();

// Registriere den Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/codefinder_Web/service-worker.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
