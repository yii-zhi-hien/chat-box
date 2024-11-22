// Import the necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCloVDvWfwYpd5Bfw60Gn5M1fftm1ikeEQ",
    authDomain: "freeplan-ffce2.firebaseapp.com",
    databaseURL: "https://freeplan-ffce2-default-rtdb.asia-southeast1.firebasedatabase.app/",
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

// Function to send a message to Firebase
document.getElementById("send-button").addEventListener("click", () => {
    const messageInput = document.getElementById("message-input");
    const message = messageInput.value.trim();

    if (message) {
        try {
            // Push the new message to Firebase
            push(messagesRef, {
                text: message,
                timestamp: Date.now(),
                sender: "You" // You can customize this to show the sender's name
            });
            messageInput.value = ""; // Clear the input field after sending
        } catch (error) {
            console.error("Error writing data: ", error);
            if (error.message.includes('offline')) {
                alert("You are offline. Please check your connection.");
            }
        }
    }
});

// Listen for new messages in Firebase Realtime Database
const messageContainer = document.getElementById("message-container");

// Fetch and display messages in real-time
onValue(messagesRef, (snapshot) => {
    messageContainer.innerHTML = ""; // Clear current messages
    snapshot.forEach(childSnapshot => {
        const message = childSnapshot.val();
        const messageElement = document.createElement("div");
        messageElement.textContent = `${message.sender}: ${message.text}`;
        messageContainer.appendChild(messageElement);
    });
}, (error) => {
    console.error("Error reading data: ", error);
    if (error.message.includes('offline')) {
        alert("You are offline. Please check your connection.");
    }
});
