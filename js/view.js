const API_URL = "https://webapi-x0zj.onrender.com/api/v1/cars/";
const gridContainer = document.getElementById('grid-container');
const statusMessageEl = document.getElementById('status-message');

function showMessage(message, type = 'error') {
    if (!statusMessageEl) return; // Guard clause
    statusMessageEl.textContent = message;
    statusMessageEl.className = `status ${type}`;
    statusMessageEl.style.display = 'block'; // Ensure it's visible
}

function clearMessage() {
     if (!statusMessageEl) return;
    statusMessageEl.textContent = '';
    statusMessageEl.className = 'status';
    statusMessageEl.style.display = 'none'; // Hide it again
}

console.log("View.js loaded"); // Debug log

// Fetch data and initialize Grid.js
fetch(API_URL)
    .then(response => {
        if (!response.ok) {
            // Try to get error details from response if possible
            return response.json().catch(() => null).then(errBody => {
                const errorMsg = errBody?.error || `HTTP error! status: ${response.status}`;
                throw new Error(errorMsg);
            });
        }
        return response.json();
    })
    .then(data => {
        clearMessage(); // Clear previous messages
        console.log("Data received:", data); // Debug log

        if (!Array.isArray(data)) {
             console.error("API did not return an array:", data);
             showMessage("Error: Received invalid data format from server.");
             if (gridContainer) gridContainer.innerHTML = ''; // Clear grid container
             return;
        }

        if (data.length === 0) {
             showMessage("No car brands found in the database.", "success"); // Use success style for info
             if (gridContainer) gridContainer.innerHTML = ''; // Clear grid container
             return;
        }

        // Map data for Grid.js - using 'id' and 'carbrand'
        const formattedData = data.map(brand => ({
            id: brand.id,
            name: brand.carbrand // Ensure this matches your backend response field
        }));
         console.log("Formatted data for grid:", formattedData); // Debug log


        // Initialize Grid.js
        if (gridContainer) {
             gridContainer.innerHTML = ''; // Clear previous grid if any
             try {
                 new gridjs.Grid({
                    columns: [
                        { id: 'id', name: 'ID' },
                        { id: 'name', name: 'Brand Name' }
                    ],
                    data: formattedData,
                    search: true,
                    sort: true,
                    pagination: {
                        enabled: true,
                        limit: 10
                    },
                     style: { // Optional: Add some basic styling
                        table: {
                           'border': '1px solid #ccc'
                        },
                        th: {
                           'background-color': '#f2f2f2',
                           'border-bottom': '1px solid #ccc'
                        },
                        td: {
                           'padding': '8px',
                           'border': '1px solid #eee'
                        }
                     }
                }).render(gridContainer);
                console.log("Grid rendered successfully."); // Debug log
             } catch (gridError) {
                  console.error("Error rendering Grid.js:", gridError);
                  showMessage(`Error displaying data table: ${gridError.message}`);
             }

        } else {
             console.error("Grid container element (#grid-container) not found in the DOM.");
             showMessage("Error: Could not find the area to display the data table.");
        }

    })
    .catch(error => {
        console.error('Error fetching car brands:', error);
        showMessage(`Failed to load car brands: ${error.message}`);
        if (gridContainer) {
             gridContainer.innerHTML = '<p style="color: red;">Could not load data. Please check the API connection or console for errors.</p>';
        }
    });