document.addEventListener('DOMContentLoaded', () => {

    const API_BASE_URL = 'https://web-uwen.onrender.com';

    const feedback = document.getElementById('feedback');
    const addForm = document.getElementById('addForm');
    const confirmationModalElement = document.getElementById('confirmationModal');
    let confirmationModal = null;
    if (confirmationModalElement && typeof bootstrap !== 'undefined') {
         confirmationModal = new bootstrap.Modal(confirmationModalElement);
    }

    const dataList = document.getElementById('dataList');

    const selectDataToModify = document.getElementById('selectDataToModify');
    const editSection = document.getElementById('editSection');
    const modifyItemIdInput = document.getElementById('modifyItemId');
    const modifyKeyInput = document.getElementById('modifyKey');
    const modifyValueInput = document.getElementById('modifyValue');
    const saveChangesButton = document.getElementById('saveChangesButton');
    const deleteItemButton = document.getElementById('deleteItemButton');


    function showFeedback(message, isError = false) {
        if (feedback) {
            feedback.textContent = message;
            feedback.style.color = isError ? 'red' : 'green';
            setTimeout(() => { feedback.textContent = ''; }, isError ? 5000 : 3000);
        } else {
            console.log(`Feedback (${isError ? 'Error' : 'Info'}): ${message}`);
            if(!isError && message === 'Record has been saved.' && confirmationModal) {
                 confirmationModal.show();
            } else if (!isError && message === 'Record has been saved.') {
                alert('Record has been saved.');
            }
        }
    }


    async function fetchData() {
        try {
            const response = await fetch(API_BASE_URL);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            showFeedback('Failed to load data from API.', true);
            return [];
        }
    }

     async function addData(key, value) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key, value }),
            });
            const result = await response.json();
            if (!response.ok) {
                 throw new Error(result.message || `HTTP error! Status: ${response.status}`);
            }
            showFeedback(result.message || 'Record has been saved.');
            return true;
        } catch (error) {
            console.error('Error adding data:', error);
            showFeedback(`Error: ${error.message}`, true);
            return false;
        }
    }

    async function updateData(id, key, value) {
        try {
             const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ key, value }),
            });
             const result = await response.json();
             if (!response.ok) {
                 throw new Error(result.message || `HTTP error! Status: ${response.status}`);
             }
             showFeedback(result.message || 'Update successful.');
             return true;
        } catch (error) {
             console.error('Error updating data:', error);
             showFeedback(`Error updating record: ${error.message}`, true);
             return false;
        }
    }

     async function deleteData(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE',
            });
             const result = await response.json();
             if (!response.ok) {
                  throw new Error(result.message || `HTTP error! Status: ${response.status}`);
             }
             showFeedback(result.message || 'Record deleted.');
             return true;
        } catch (error) {
            console.error('Error deleting data:', error);
            showFeedback(`Error deleting record: ${error.message}`, true);
            return false;
        }
    }


    async function displayDataOnViewPage() {
        if (!dataList) return;
        dataList.innerHTML = '<li>Loading...</li>';
        const data = await fetchData();
        dataList.innerHTML = '';
        if (data.length === 0) {
            dataList.innerHTML = '<li>No data found in the database.</li>';
            return;
        }
        data.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `ID: ${item.id} - Key: ${item.key} - Value: ${item.value}`;
            dataList.appendChild(li);
        });
    }


    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const keyInput = document.getElementById('dataKey');
            const valueInput = document.getElementById('dataValue');
            const key = keyInput.value.trim();
            const value = valueInput.value.trim();

            if (key && value) {
                const success = await addData(key, value);
                if (success) {
                    keyInput.value = '';
                    valueInput.value = '';
                }
            } else {
                 showFeedback('Error: Both key and value are required.', true);
            }
        });
    }


    async function populateModifyDropdownAndSetupListeners() {
        if (!selectDataToModify) return;

        const data = await fetchData();
        selectDataToModify.innerHTML = '<option value="">-- Select Item --</option>';

        if (data.length === 0) {
            editSection.style.display = 'none';
            return;
        }

        data.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.textContent = `${item.key} (ID: ${item.id})`;
            option.dataset.key = item.key;
            option.dataset.value = item.value;
            selectDataToModify.appendChild(option);
        });


        selectDataToModify.addEventListener('change', () => {
            const selectedOption = selectDataToModify.options[selectDataToModify.selectedIndex];
            const selectedId = selectedOption.value;

            if (selectedId) {
                modifyItemIdInput.value = selectedId;
                modifyKeyInput.value = selectedOption.dataset.key || '';
                modifyValueInput.value = selectedOption.dataset.value || '';
                editSection.style.display = 'block';
                feedback.textContent = '';
            } else {
                editSection.style.display = 'none';
                modifyItemIdInput.value = '';
                modifyKeyInput.value = '';
                modifyValueInput.value = '';
            }
        });


         if (saveChangesButton) {
             saveChangesButton.addEventListener('click', async () => {
                 const idToUpdate = modifyItemIdInput.value;
                 const newKey = modifyKeyInput.value.trim();
                 const newValue = modifyValueInput.value.trim();

                 if (!idToUpdate) {
                     showFeedback("No item selected to update.", true);
                     return;
                 }
                  if (newKey && newValue) {
                     const success = await updateData(idToUpdate, newKey, newValue);
                     if (success) {
                         await populateModifyDropdownAndSetupListeners();
                     }
                 } else {
                     showFeedback('Error: Key and Value cannot be empty for update.', true);
                 }
             });
         }


        if (deleteItemButton) {
            deleteItemButton.addEventListener('click', async () => {
                const idToDelete = modifyItemIdInput.value;
                 const selectedOptionText = selectDataToModify.options[selectDataToModify.selectedIndex]?.textContent;


                if (idToDelete && confirm(`Are you sure you want to delete item: "${selectedOptionText}"?`)) {
                    const success = await deleteData(idToDelete);
                    if (success) {
                        modifyKeyInput.value = '';
                        modifyValueInput.value = '';
                        modifyItemIdInput.value = '';
                        editSection.style.display = 'none';
                        await populateModifyDropdownAndSetupListeners();
                    }
                } else if (!idToDelete) {
                     showFeedback("No item selected to delete.", true);
                }
            });
        }
    }


    if (dataList) {
        displayDataOnViewPage();
    }
    if (selectDataToModify) {
        populateModifyDropdownAndSetupListeners();
    }

});