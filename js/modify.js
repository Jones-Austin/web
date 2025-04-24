const API_BASE_URL = "https://webapi-x0zj.onrender.com/api/v1/cars/";
const modifyForm = document.getElementById('modify-brand-form');
const brandSelect = document.getElementById('brand-select'); // Dropdown
const newBrandNameInput = document.getElementById('new-brand-name');
const statusMessageEl = document.getElementById('status-message');
const updateButton = document.getElementById('update-button');

let brandsData = []; // To store fetched brands data {id, carbrand}

function showMessage(message, type = 'error') {
    if (!statusMessageEl) return;
    statusMessageEl.textContent = message;
    statusMessageEl.className = `status ${type}`;
    statusMessageEl.style.display = 'block';
}

function clearMessage() {
     if (!statusMessageEl) return;
    statusMessageEl.textContent = '';
    statusMessageEl.className = 'status';
    statusMessageEl.style.display = 'none';
}

// --- AC3 Part I: Populate Dropdown ---
function populateBrandDropdown(brands) {
    if (!brandSelect) return;

    brandSelect.innerHTML = '<option value="">-- Select a Brand --</option>'; // Reset dropdown

    brands.forEach(brand => {
        const option = document.createElement('option');
        option.value = brand.id; // The value is the ID
        option.textContent = brand.carbrand; // The displayed text is the name
        brandSelect.appendChild(option);
    });
}

// Fetch brands when the page loads to populate the dropdown
function fetchBrandsForDropdown() {
    clearMessage();
    fetch(API_BASE_URL)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error("Received invalid data format for brands list.");
            }
            brandsData = data; // Store the raw data
            populateBrandDropdown(brandsData);
        })
        .catch(error => {
            console.error('Error fetching brands for dropdown:', error);
            showMessage(`Failed to load brands list: ${error.message}`);
            // Optionally disable the form if brands can't be loaded
            if(updateButton) updateButton.disabled = true;
            if(brandSelect) brandSelect.disabled = true;
            if(newBrandNameInput) newBrandNameInput.disabled = true;
        });
}

// --- AC3 Part I: Auto-fill form on dropdown change ---
if (brandSelect) {
    brandSelect.addEventListener('change', () => {
        clearMessage();
        const selectedId = brandSelect.value;
        const selectedBrand = brandsData.find(brand => brand.id == selectedId); // Use == for string/number comparison if needed, === is safer if types match

        if (selectedBrand) {
            newBrandNameInput.value = selectedBrand.carbrand; // Auto-fill name
            if(updateButton) updateButton.disabled = false; // Enable update button
            newBrandNameInput.disabled = false;
        } else {
            newBrandNameInput.value = ''; // Clear name field if "-- Select --" is chosen
            if(updateButton) updateButton.disabled = true; // Disable update button
             newBrandNameInput.disabled = true;
        }
    });
}

// --- AC3 Part II: Implement Update Method (PUT) ---
if (modifyForm) {
    modifyForm.addEventListener('submit', (event) => {
        event.preventDefault();
        clearMessage();

        const selectedId = brandSelect.value; // Get ID from dropdown
        const newBrandName = newBrandNameInput.value.trim();

        // Validation
        if (!selectedId) {
            showMessage("Please select a brand to modify.");
            return;
        }
        if (!newBrandName) {
            showMessage("New brand name cannot be empty.");
            return;
        }

        const brandData = { name: newBrandName };
        const API_URL_PUT = `${API_BASE_URL}${selectedId}`; // Construct specific URL

        // Disable button during fetch
        if(updateButton) updateButton.disabled = true;

        fetch(API_URL_PUT, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(brandData)
        })
        .then(async response => {
            const isJson = response.headers.get('content-type')?.includes('application/json');
            const data = isJson ? await response.json() : null;

            if (!response.ok) {
                const error = (data && data.error) || response.statusText || `Error ${response.status}`;
                 if (response.status === 404) {
                     throw new Error(`Brand with ID ${selectedId} not found.`);
                 }
                throw new Error(error);
            }
            return data;
        })
        .then(data => {
            showMessage(`Brand ID ${data.id} updated successfully to '${data.carbrand}'!`, 'success');
            // Update the dropdown text and stored data immediately
            const updatedBrandIndex = brandsData.findIndex(b => b.id == data.id);
            if (updatedBrandIndex !== -1) {
                brandsData[updatedBrandIndex].carbrand = data.carbrand; // Update local data
                const optionToUpdate = brandSelect.querySelector(`option[value="${data.id}"]`);
                if (optionToUpdate) {
                    optionToUpdate.textContent = data.carbrand; // Update dropdown text
                }
            }
             // Optionally reset selection or keep it
            // brandSelect.value = ""; // Reset dropdown selection
            // newBrandNameInput.value = ""; // Clear input
            // updateButton.disabled = true; // Disable button again
        })
        .catch(error => {
            console.error('Error updating brand:', error);
            showMessage(`Error updating brand: ${error.message}`);
        })
        .finally(() => {
             // Re-enable button only if a valid brand is still selected
             if(brandSelect.value) {
                if(updateButton) updateButton.disabled = false;
             }
        });
    });
}

// --- Initialize ---
// Fetch brands when the script loads
document.addEventListener('DOMContentLoaded', () => {
     if (window.location.pathname.endsWith('modify.html')) {
         fetchBrandsForDropdown();
         // Initially disable name input and button
         newBrandNameInput.disabled = true;
         if(updateButton) updateButton.disabled = true;
     }
});