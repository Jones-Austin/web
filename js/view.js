const API_URL = "https://webapi-x0zj.onrender.com/api/v1/cars/";
const gridContainer = document.getElementById('grid-container');
const statusMessageEl = document.getElementById('status-message');

function showMessage(message, type = 'error') {
    statusMessageEl.textContent = message;
    statusMessageEl.className = `status ${type}`; // Add type class (error or success)
}

function clearMessage() {
    statusMessageEl.textContent = '';
    statusMessageEl.className = 'status'; // Remove type classes
}

// Fetch data and initialize Grid.js
fetch(API_URL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        clearMessage(); // Clear previous messages

        // Ensure data is an array before mapping
        if (!Array.isArray(data)) {
             console.error("API did not return an array:", data);
             showMessage("Error: Received invalid data format from server.");
             return; // Stop execution if data is not an array
        }
        
        // Check if the array is empty
        if (data.length === 0) {
             showMessage("No car brands found.", "success"); // Use success style for info message
             gridContainer.innerHTML = ''; // Clear any previous grid
             return; // Stop if no data
        }

        // Map data for Grid.js - Use 'carbrand' field from backend
        const formattedData = data.map(brand => {
            return {
                id: brand.id,
                name: brand.carbrand // Use the correct field name from your backend
            };
        });

        // Initialize Grid.js
        if (gridContainer) {
             gridContainer.innerHTML = ''; // Clear previous grid if any
             new gridjs.Grid({
                columns: [
                    { id: 'id', name: 'ID' },
                    { id: 'name', name: 'Brand Name' }
                ],
                data: formattedData,
                search: true, // Enable search
                sort: true,   // Enable sorting
                pagination: { // Enable pagination
                    enabled: true,
                    limit: 10 // Show 10 rows per page
                }
            }).render(gridContainer);
        } else {
             console.error("Grid container not found");
             showMessage("Error: Could not display the data table.");
        }

    })
    .catch(error => {
        console.error('Error fetching car brands:', error);
        showMessage(`Failed to load car brands: ${error.message}`);
        if (gridContainer) {
             gridContainer.innerHTML = '<p>Could not load data.</p>'; // Show error in the grid area
        }
    });