// Import the Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, set, push, child, get } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCloVDvWfwYpd5Bfw60Gn5M1fftm1ikeEQ",
    authDomain: "freeplan-ffce2.firebaseapp.com",
    databaseURL: "https://freeplan-ffce2-default-rtdb.firebaseio.com/",
    projectId: "freeplan-ffce2",
    storageBucket: "freeplan-ffce2.appspot.com",
    messagingSenderId: "277892113021",
    appId: "1:277892113021:web:3933c7816f0674c1658714",
    measurementId: "G-9MQ2T1P7W9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Reference to the "messages" node in the Firebase Realtime Database
const messagesRef = ref(database, "messages");

// Function to send a message
document.getElementById("send-button").addEventListener("click", () => {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (message) {
        push(messagesRef, {
            text: message,
            timestamp: Date.now(),
            sender: "You" // Customize sender as needed
        });
        messageInput.value = ""; // Clear input field after sending
    }
});

// Listen for new messages in Firebase Realtime Database
get(messagesRef)
  .then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const message = childSnapshot.val();
      displayMessage(message);
    });
  })
  .catch((error) => {
    console.error("Error reading data: ", error);
  });

// Function to display a message in the chatbox
function displayMessage(message) {
    const messageContainer = document.getElementById("message-container");

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.textContent = `${message.sender}: ${message.text}`;

    // Style the message based on the sender
    if (message.sender === "You") {
        messageElement.classList.add("message-sent");
    } else {
        messageElement.classList.add("message-received");
    }

    messageContainer.appendChild(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll to latest message
}
