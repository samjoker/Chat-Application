// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.9.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.9.1/firebase-messaging.js');

// Firbase Initilaize.
var firebaseConfig = {
	apiKey: 'AIzaSyCJc-PE4XwmNAtZsU8dtpRB1TPmusyT_TI',
	authDomain: 'chat-app-f8a7a.firebaseapp.com',
	projectId: 'chat-app-f8a7a',
	messagingSenderId: '467925614199',
	appId: '1:467925614199:web:de4f20ab48c50efc3b9072',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
	console.log(
		'[firebase-messaging-sw.js] Received background message ',
		payload
	);
	// Customize notification here
	const notificationTitle = 'Got a New Message from My Application';
	const notificationOptions = {
		body: payload.data.message,
		icon: payload.data.img,
	};

	self.registration.showNotification(notificationTitle, notificationOptions);
});
