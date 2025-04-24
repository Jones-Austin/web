const API_URL = "https://webapi-x0zj.onrender.com/api/v1/cars/";
const addForm = document.getElementById('add-brand-form');
const brandNameInput = document.getElementById('brand-name');
const statusMessageEl = document.getElementById('status-message');

function showMessage(message, type = 'error') {
    statusMessageEl.textContent = message;
    statusMessageEl.className = `status ${type}`;
}

function clearMessage() {
    statusMessageEl.textContent = '';
    statusMessageEl.className = 'status';
}

addForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission
    clearMessage(); // Clear previous messages

    const brandName = brandNameInput.value.trim();

    if (!brandName) {
        showMessage("Brand name cannot be empty.");
        return;
    }

    // Data to send to the backend - must match backend expectation { "name": "..." }
    const brandData = {
        name: brandName
    };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(brandData)
    })
    .then(async response => { // Use async to easily parse JSON body on error
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
            // Get error message from body or default to status
            const error = (data && data.error) || response.statusText || `Error ${response.status}`;
            // Specific handling for conflict (409)
            if (response.status === 409) {
                 throw new Error(data.error || 'Brand name already exists.');
            }
             // Specific handling for bad request (400)
            if (response.status === 400) {
                 throw new Error(data.error || 'Invalid input provided.');
            }
            throw new Error(error);
        }
        return data; // Return the parsed JSON data (the added brand)
    })
    .then(data => {
        showMessage(`Brand '${data.carbrand}' (ID: ${data.id}) added successfully!`, 'success');
        addForm.reset(); // Clear the form fields
    })
    .catch(error => {
        console.error('Error adding brand:', error);
        showMessage(`Error: ${error.message}`);
    });
});