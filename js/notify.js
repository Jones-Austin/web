// --- DOM Elements ---
const notifyForm = document.getElementById('notify-form');
const titleInput = document.getElementById('notify-title');
const messageInput = document.getElementById('notify-message');
const iconInput = document.getElementById('notify-icon');
const sendButton = document.getElementById('send-notify-btn');
const statusMessageEl = document.getElementById('status-message');

// --- Utility Functions (similar to other files) ---
function showMessage(message, type = 'error') {
    if (!statusMessageEl) return;
    statusMessageEl.textContent = message;
    statusMessageEl.className = `status ${type}`; // Apply 'error' or 'success' class
    statusMessageEl.style.display = 'block';
}

function clearMessage() {
     if (!statusMessageEl) return;
    statusMessageEl.textContent = '';
    statusMessageEl.className = 'status';
    statusMessageEl.style.display = 'none';
}

// --- Notification Logic ---

/**
 * Displays the browser notification.
 * @param {string} title - The notification title.
 * @param {string} message - The notification body text.
 * @param {string} [iconUrl] - Optional URL for the notification icon.
 */
function showNotification(title, message, iconUrl) {
    const options = {
        body: message,
        // You can add more options here if needed (e.g., requireInteraction, tag)
    };

    // Only add icon if a URL was provided
    if (iconUrl && iconUrl.trim() !== '') {
        // Basic check if it looks like a URL (can be improved)
        if (iconUrl.startsWith('http://') || iconUrl.startsWith('https://')) {
             options.icon = iconUrl.trim();
        } else {
            console.warn("Invalid icon URL provided, ignoring:", iconUrl);
            showMessage("Warning: Invalid icon URL format was ignored.", "error"); // Show a non-blocking warning
        }
    }

    // Use a default title if none is provided
    const notificationTitle = title.trim() || "Notification Alert";

    try {
        // Create and show the notification
        const notification = new Notification(notificationTitle, options);

        // Optional: Handle click/close events on the notification itself
        notification.onclick = () => {
            console.log('Notification clicked!');
            // Example: window.focus(); // Bring the window to the front
        };
        notification.onclose = () => {
            console.log('Notification closed.');
        };

        showMessage("Notification sent successfully!", "success");
         // Optionally clear the form after sending
         // notifyForm.reset();

    } catch (err) {
        console.error("Error creating notification:", err);
        showMessage(`Error sending notification: ${err.message}`, "error");
    }
}


// --- Event Listener ---
if (notifyForm) {
    notifyForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default form submission
        clearMessage();

        const title = titleInput.value;
        const message = messageInput.value;
        const iconUrl = iconInput.value;

        // 1. Check if message is empty
        if (!message || message.trim() === '') {
            showMessage("Notification message cannot be empty.", "error");
            messageInput.focus(); // Put cursor back in the message field
            return;
        }

        // 2. Check if Notification API is supported
        if (!('Notification' in window)) {
            showMessage("Sorry, your browser does not support desktop notifications.", "error");
            return;
        }

        // 3. Check current permission status
        const currentPermission = Notification.permission;

        if (currentPermission === "granted") {
            // Permission already granted - show notification
            showNotification(title, message, iconUrl);
        } else if (currentPermission === "denied") {
            // Permission denied - inform user
            showMessage("Notification permission has been denied. Please enable it in your browser settings if you want to receive notifications.", "error");
        } else { // currentPermission === "default"
            // Permission not yet requested - ask the user
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    showMessage("Permission granted!", "success");
                    showNotification(title, message, iconUrl);
                } else {
                    showMessage("Notification permission was not granted.", "error");
                }
            }).catch(err => {
                 console.error("Error requesting notification permission:", err);
                 showMessage("An error occurred while requesting permission.", "error");
            });
        }
    });
} else {
    console.error("Notification form not found!");
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
     // Clear any previous status messages on page load
     clearMessage();
     // Check support on load (optional, provides early feedback)
     if (!('Notification' in window)) {
         showMessage("This browser does not support desktop notifications.", "error");
         if (sendButton) sendButton.disabled = true; // Disable button if not supported
     } else if (Notification.permission === "denied") {
         showMessage("Notifications are currently blocked in browser settings.", "error");
     }
});