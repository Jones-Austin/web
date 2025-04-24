const API_BASE_URL = "https://webapi-x0zj.onrender.com/api/v1/cars/"; // Base URL
const modifyForm = document.getElementById('modify-brand-form');
const brandIdInput = document.getElementById('brand-id');
const newBrandNameInput = document.getElementById('new-brand-name');
const statusMessageEl = document.getElementById('status-message');

function showMessage(message, type = 'error') {
    statusMessageEl.textContent = message;
    statusMessageEl.className = `status ${type}`;
}

function clearMessage() {
    statusMessageEl.textContent = '';
    statusMessageEl.className = 'status';
}

modifyForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    clearMessage(); // Clear previous messages

    const brandId = brandIdInput.value.trim();
    const newBrandName = newBrandNameInput.value.trim();

    // Validate ID
    if (!brandId || isNaN(parseInt(brandId, 10)) || parseInt(brandId, 10) <= 0) {
        showMessage("Please enter a valid positive Brand ID.");
        return;
    }
    const numericId = parseInt(brandId, 10);

    // Validate Name
    if (!newBrandName) {
        showMessage("New brand name cannot be empty.");
        return;
    }

    // Data to send - must match backend expectation { "name": "..." }
    const brandData = {
        name: newBrandName
    };

    // Construct the full URL for the specific brand
    const API_URL_PUT = `${API_BASE_URL}${numericId}`;

    fetch(API_URL_PUT, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData)
    })
    .then(async response => { // Use async to parse JSON body on error
         const isJson = response.headers.get('content-type')?.includes('application/json');
         const data = isJson ? await response.json() : null;

        if (!response.ok) {
             const error = (data && data.error) || response.statusText || `Error ${response.status}`;
              // Specific handling for Not Found (404)
             if (response.status === 404) {
                 throw new Error(`Brand with ID ${numericId} not found.`);
             }
             // Specific handling for conflict (409) - e.g., new name already exists
             if (response.status === 409) {
                 throw new Error(data.error || `Cannot update: Name '${newBrandName}' might already exist.`);
             }
             // Specific handling for bad request (400)
             if (response.status === 400) {
                 throw new Error(data.error || 'Invalid input provided.');
            }
            throw new Error(error);
        }
         return data; // Return the parsed JSON data (the updated brand)
    })
    .then(data => {
        showMessage(`Brand ID ${data.id} updated successfully to '${data.carbrand}'!`, 'success');
        // Optionally clear the form, or just the name field
        // modifyForm.reset();
        newBrandNameInput.value = ''; // Clear only the name field after success
    })
    .catch(error => {
        console.error('Error updating brand:', error);
        showMessage(`Error: ${error.message}`);
    });
});