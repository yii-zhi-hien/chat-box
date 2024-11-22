import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
		import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";

		const firebaseConfig = {
			apiKey: "AIzaSyCloVDvWfwYpd5Bfw60Gn5M1fftm1ikeEQ",
			authDomain: "freeplan-ffce2.firebaseapp.com",
			databaseURL: "https://freeplan-ffce2-default-rtdb.asia-southeast1.firebasedatabase.app",
			projectId: "freeplan-ffce2",
			storageBucket: "freeplan-ffce2.appspot.com",
			messagingSenderId: "277892113021",
			appId: "1:277892113021:web:3933c7816f0674c1658714",
			measurementId: "G-9MQ2T1P7W9",
		};

		const app = initializeApp(firebaseConfig);
		const database = getDatabase(app);

		const messagesDiv = document.getElementById("messages");
		const chatInput = document.getElementById("chat-input");
		const sendButton = document.getElementById("send-button");
		const openChatButton = document.getElementById("open-chat-button");
		const closeModalButton = document.getElementById("close-modal");
		const chatModal = document.getElementById("chat-modal");

		let roomId = null;

		// Open chat modal
		openChatButton.addEventListener("click", () => {
			chatModal.classList.add("show");
			roomId = `room-${Date.now()}`;
			const roomRef = ref(database, `chatRooms/${roomId}`);
			set(roomRef, { createdAt: Date.now(), messages: {} });
			console.log("Chat room created:", roomId);
		});

		// Close chat modal
		closeModalButton.addEventListener("click", () => {
			chatModal.classList.remove("show");
			messagesDiv.innerHTML = "";
			roomId = null;
		});

		// Send a message
		sendButton.addEventListener("click", () => {
			sendMessage();
		});

		chatInput.addEventListener("keydown", (event) => {
			if (event.key === "Enter") {
				event.preventDefault();
				sendMessage();
			}
		});

		function sendMessage() {
			const message = chatInput.value.trim();
			if (message && roomId) {
				const messagesRef = ref(database, `chatRooms/${roomId}/messages`);
				push(messagesRef, {
					type: "client",
					message,
					timestamp: new Date().toLocaleString()
				});
				chatInput.value = "";
			}
		}

		// Listen for messages
		const listenForMessages = (roomId) => {
			const messagesRef = ref(database, `chatRooms/${roomId}/messages`);
			onChildAdded(messagesRef, (snapshot) => {
				const data = snapshot.val();
				const messageDiv = document.createElement("div");
				messageDiv.classList.add("message");
				messageDiv.classList.add(data.type === "client" ? "sender" : "receiver");
				messageDiv.textContent = data.message;
				messagesDiv.appendChild(messageDiv);
				messagesDiv.scrollTop = messagesDiv.scrollHeight;
			});
		};

		// Start listening when room is created
		openChatButton.addEventListener("click", () => {
			if (roomId) listenForMessages(roomId);
		});