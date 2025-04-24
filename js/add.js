const API_URL = "https://webapi-x0zj.onrender.com/api/v1/cars/";
const addForm = document.getElementById('add-brand-form');
const brandNameInput = document.getElementById('brand-name');
const statusMessageEl = document.getElementById('status-message');

// Modal elements (AC2)
const modal = document.getElementById('confirmation-modal');
const modalMessageEl = document.getElementById('modal-message');
const closeButton = document.querySelector('.modal .close-button');

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

// Function to show the modal (AC2)
function showModal(message = "Record has been saved.") {
    if (!modal || !modalMessageEl) return;
    modalMessageEl.textContent = message;
    modal.style.display = 'block';
}

// Function to hide the modal (AC2)
function hideModal() {
    if (!modal) return;
    modal.style.display = 'none';
}

// Close modal when clicking the close button (AC2)
if (closeButton) {
    closeButton.onclick = hideModal;
}

// Close modal when clicking outside the modal content (AC2)
window.onclick = function(event) {
    if (event.target == modal) {
        hideModal();
    }
}

addForm.addEventListener('submit', (event) => {
    event.preventDefault();
    clearMessage(); // Clear status messages
    hideModal(); // Ensure modal is hidden initially

    const brandName = brandNameInput.value.trim();

    if (!brandName) {
        showMessage("Brand name cannot be empty.");
        return;
    }

    const brandData = { name: brandName };

    // Disable button during fetch (optional but good practice)
    const submitButton = addForm.querySelector('button[type="submit"]');
    if(submitButton) submitButton.disabled = true;


    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandData)
    })
    .then(async response => {
        const isJson = response.headers.get('content-type')?.includes('application/json');
        const data = isJson ? await response.json() : null;

        if (!response.ok) {
            const error = (data && data.error) || response.statusText || `Error ${response.status}`;
            throw new Error(error); // Let the catch block handle it
        }
        return data;
    })
    .then(data => {
        // AC2: Show modal confirmation
        showModal(`Brand '${data.carbrand}' (ID: ${data.id}) added successfully! Record has been saved.`);
        addForm.reset(); // Clear the form
        // AC2 Check: User can now navigate to View page to see the new record
    })
    .catch(error => {
        console.error('Error adding brand:', error);
        // Show error in the status message area, not the modal
        showMessage(`Error adding brand: ${error.message}`);
    })
    .finally(() => {
         // Re-enable button
         if(submitButton) submitButton.disabled = false;
    });
});