async function loadCSV() {
    let response = await fetch('data.csv');
    let data = await response.text();
    let rows = data.split('\n');
    rows.shift(); // Entfernt die Kopfzeile
    let csvData = rows.map(row => {
        let [code, name] = row.split(',');
        return { code: parseInt(code, 10), name };
    });
    displayResults(csvData); // Zeige alle Daten beim Laden
    return csvData;
}

async function searchInCSV() {
    let query = document.getElementById('searchQuery').value.toLowerCase();
    let csvData = await loadCSV();
    if (query) { // Führe Suche nur durch, wenn eine Abfrage vorhanden ist
        csvData = csvData.filter(row => 
            row.code.toString().includes(query) || row.name.toLowerCase().includes(query)
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

// Registrierung des Service Workers
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/service-worker.js').then(function(registration) {
            // Registrierung erfolgreich
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // Registrierung fehlgeschlagen :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
