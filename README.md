# Car Brand Management Frontend

## 1. Project Overview

This project is a simple web-based frontend application built with plain **HTML, CSS, and JavaScript**. It utilizes the **Grid.js** library for displaying tabular data.

**Purpose:** To provide a user interface for managing car brand data by interacting with a backend REST API.
**Goals:**
*   Allow users to view a list of car brands.
*   Allow users to add new car brands.
*   Allow users to update existing car brands.

## 2. Table of Contents

*   [Project Overview](#1-project-overview)
*   [Table of Contents](#2-table-of-contents)
*   [Installation & Setup](#3-installation--setup)
*   [Usage Instructions](#4-usage-instructions)
*   [API Integration](#5-api-integration)
*   [Contributing Guidelines](#6-contributing-guidelines)
*   [License](#7-license)

## 3. Installation & Setup

### Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge, Safari).
*   Git (for cloning the repository).
*   (Optional but Recommended for Development) A simple local web server to serve the files (e.g., VS Code Live Server extension, Python's `http.server`) to avoid potential issues when making API calls from `file:///` URLs.

### Steps

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url> # Replace <your-repository-url> with the actual URL
    cd <frontend-project-directory> # Navigate into the frontend directory
    ```

2.  **Run the application:**
    *   **Using a local web server (Recommended):** Start your server in the project directory and navigate to the appropriate URL (e.g., `http://localhost:8080` or `http://127.0.0.1:5500`).
    *   **Directly opening the file:** Open the `index.html` file directly in your web browser.

    *Note: No `npm install` or build steps are required as this project uses plain HTML, CSS, and JavaScript.*

## 4. Usage Instructions

The application provides three main pages for interacting with car brand data:

1.  **View Brands (`index.html`):**
    *   This is the main page loaded by default.
    *   It fetches and displays all car brands from the API in a sortable and searchable table powered by Grid.js.
    *   Use the navigation header to move to other pages.
    *   *(Optional: Add screenshot)*
        ```html
        <!-- <img src="images/view-brands.png" width="600" alt="View Brands Page Screenshot"> -->
        ```

2.  **Add Brand (`add.html`):**
    *   Navigate to this page using the "Add Brand" link in the header.
    *   Enter the name of the new car brand in the text field.
    *   Click the "Add Brand" button.
    *   On successful submission, a modal dialog will appear confirming "Record has been saved."
    *   You can then navigate back to the "View Brands" page to see the newly added record.
    *   *(Optional: Add screenshot)*
        ```html
        <!-- <img src="images/add-brand.png" width="600" alt="Add Brand Page Screenshot"> -->
        <!-- <img src="images/add-confirm-modal.png" width="400" alt="Add Confirmation Modal Screenshot"> -->
        ```

3.  **Modify Brand (`modify.html`):**
    *   Navigate to this page using the "Modify Brand" link in the header.
    *   Select the brand you wish to update from the dropdown list. The list is populated with existing brands fetched from the API.
    *   Once a brand is selected, its current name will automatically appear in the "New Brand Name" text field.
    *   Modify the name in the text field as desired.
    *   Click the "Update Brand" button.
    *   A status message will indicate success or failure. The updated name will be reflected if you revisit the "View Brands" page or refresh the dropdown on the Modify page.
    *   *(Optional: Add screenshot)*
        ```html
        <!-- <img src="images/modify-brand.png" width="600" alt="Modify Brand Page Screenshot"> -->
        ```

## 5. API Integration

This frontend connects to the backend Car Brands API to perform CRUD operations.

*   **Base API URL:** `https://webapi-x0zj.onrender.com/api/v1/cars/`

*   **Endpoints Used:**
    *   `GET /api/v1/cars/`: Fetches all car brands. Used on the "View Brands" page (`js/view.js`) and to populate the dropdown on the "Modify Brand" page (`js/modify.js`).
      ```javascript
      // Example from js/view.js
      fetch("https://webapi-x0zj.onrender.com/api/v1/cars/")
          .then(response => response.json())
          .then(data => { /* ... process data ... */ });
      ```
    *   `POST /api/v1/cars/`: Adds a new car brand. Used on the "Add Brand" page (`js/add.js`). Expects a JSON body like `{"name": "NewBrandName"}`.
      ```javascript
      // Example from js/add.js
      fetch("https://webapi-x0zj.onrender.com/api/v1/cars/", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: brandName })
      })
      .then(/* ... handle response ... */);
      ```
    *   `PUT /api/v1/cars/:id`: Updates an existing car brand specified by `:id`. Used on the "Modify Brand" page (`js/modify.js`). Expects a JSON body like `{"name": "UpdatedBrandName"}`.
      ```javascript
      // Example from js/modify.js
      const API_URL_PUT = `https://webapi-x0zj.onrender.com/api/v1/cars/${selectedId}`;
      fetch(API_URL_PUT, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newBrandName })
      })
      .then(/* ... handle response ... */);
      ```

## 6. Contributing Guidelines

Contributions are welcome! Please follow these steps:

1.  **Fork** the repository.
2.  Create a new **branch** for your feature or bug fix (`git checkout -b feature/your-feature-name` or `bugfix/issue-description`).
3.  Make your changes.
4.  **Commit** your changes with clear, descriptive messages.
5.  **Push** your branch to your forked repository.
6.  Create a **Pull Request** back to the main repository.

Please try to adhere to the existing coding style (plain HTML, CSS, JavaScript) and ensure your changes function correctly before submitting a pull request.

## 7. License

This project is licensed under the MIT License.

```text
MIT License

Copyright (c) [Year] [Your Name or Organization]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.