document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('addForm');
    const dataList = document.getElementById('dataList');
    const selectDataToModify = document.getElementById('selectDataToModify');
    const modifyValueInput = document.getElementById('modifyValue');
    const saveChangesButton = document.getElementById('saveChangesButton');
    const deleteItemButton = document.getElementById('deleteItemButton');
    const editSection = document.getElementById('editSection');
    const feedback = document.getElementById('feedback');

    function showFeedback(message, isError = false) {
        if (feedback) {
            feedback.textContent = message;
            feedback.style.color = isError ? 'red' : 'green';
            setTimeout(() => { feedback.textContent = ''; }, 3000);
        }
    }

    function getAllData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        return data;
    }

    function displayData() {
        if (!dataList) return;
        dataList.innerHTML = '';
        const data = getAllData();
        if (Object.keys(data).length === 0) {
            dataList.innerHTML = '<li>No data stored yet.</li>';
            return;
        }
        for (const key in data) {
            const li = document.createElement('li');
            li.textContent = `${key}: ${data[key]}`;
            dataList.appendChild(li);
        }
    }

    function populateModifyDropdown() {
         if (!selectDataToModify) return;
         selectDataToModify.innerHTML = '<option value="">--Select Key--</option>'; // Reset
         const data = getAllData();
         if (Object.keys(data).length === 0) {
             editSection.style.display = 'none'; // Hide edit if no data
             return;
         }
         for (const key in data) {
             const option = document.createElement('option');
             option.value = key;
             option.textContent = key;
             selectDataToModify.appendChild(option);
         }
    }

    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const keyInput = document.getElementById('dataKey');
            const valueInput = document.getElementById('dataValue');
            const key = keyInput.value.trim();
            const value = valueInput.value.trim();

            if (key && value) {
                 if (localStorage.getItem(key)) {
                    showFeedback(`Error: Key "${key}" already exists. Use Modify page to update.`, true);
                 } else {
                    localStorage.setItem(key, value);
                    showFeedback(`Data added: ${key}: ${value}`);
                    keyInput.value = '';
                    valueInput.value = '';
                 }
            } else {
                 showFeedback('Error: Both key and value are required.', true);
            }
        });
    }

    if (selectDataToModify) {
        populateModifyDropdown();

        selectDataToModify.addEventListener('change', () => {
            const selectedKey = selectDataToModify.value;
            if (selectedKey) {
                modifyValueInput.value = localStorage.getItem(selectedKey) || '';
                editSection.style.display = 'block';
                feedback.textContent = '';
            } else {
                editSection.style.display = 'none';
                modifyValueInput.value = '';
            }
        });
    }

     if (saveChangesButton) {
         saveChangesButton.addEventListener('click', () => {
             const selectedKey = selectDataToModify.value;
             const newValue = modifyValueInput.value.trim();
             if (selectedKey && newValue) {
                 localStorage.setItem(selectedKey, newValue);
                 showFeedback(`Data updated for key "${selectedKey}"`);
                 populateModifyDropdown(); // Refresh dropdown in case key name changes logic is added later
                 selectDataToModify.value = selectedKey; // Keep selection
             } else if (!newValue) {
                 showFeedback('Error: Value cannot be empty.', true);
             }
         });
     }

     if (deleteItemButton) {
         deleteItemButton.addEventListener('click', () => {
             const selectedKey = selectDataToModify.value;
             if (selectedKey && confirm(`Are you sure you want to delete the item with key "${selectedKey}"?`)) {
                 localStorage.removeItem(selectedKey);
                 showFeedback(`Item with key "${selectedKey}" deleted.`);
                 modifyValueInput.value = '';
                 editSection.style.display = 'none';
                 populateModifyDropdown(); // Refresh dropdown
             }
         });
     }

    if (dataList) {
        displayData();
    }
});