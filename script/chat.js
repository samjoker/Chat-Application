// alert('welcomehome');
function startChat(id) {
	document
		.getElementById('chat-startup')
		.setAttribute('style', 'display:none');
	document.getElementById('chat-panel').removeAttribute('style');
	hideNewChat();
}

function startNewChat() {
	document
		.getElementById('contact-list')
		.classList.remove('d-none', 'd-md-block');
	document.getElementById('chat-startup').classList.add('d-none');
	document.getElementById('chat-panel').setAttribute('style', 'display:none');
	// hideNewChat();
}

function hideNewChat() {
	document
		.getElementById('contact-list')
		.classList.add('d-none', 'd-md-block');
	document.getElementById('chat-startup').classList.remove('d-none');
}

function enterKey() {
	document.addEventListener('keydown', function (key) {
		if (key.which === 13) {
			sendMessage();
		}
	});
}
let messages;
const textField = document.getElementById('txtmsg');
function sendMessage() {
	messages = `<div class="row justify-content-end">
	<div class="col-6 col-sm-7 col-md-7 col-lg-6">
		<p class="sent-msg">
		${document.getElementById('txtmsg').value}	
		<span
				class="text-time"
				>12:00pm</span
			>
		</p>
	</div>
	<div class="col-2 col-sm-1 col-md-1">
		<img
			src="./img/6.jpg"
			alt="User-img"
			class="user-chat-img"
		/>
	</div>
</div>`;
	document.getElementById('enterMessage').innerHTML += messages;
	document.getElementById('txtmsg').value = '';
	document.getElementById('txtmsg').focus();
	document
		.getElementById('enterMessage')
		.scrollTo(0, document.getElementById('enterMessage').clientHeight);
}

function iconSendMsg() {
	sendMessage();
}
// ? FireBase initaiallization

function signIn() {
	let provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithPopup(provider);

	console.log(provider);
	// const secondProvider = new firebase.auth.FacebookAuthProvider();
	// firebase.auth().signInWithPopup(secondProvider);
}

function signOut() {
	firebase.auth().signOut();
}
function onFirebaseStateChanged() {
	firebase
		.auth()
		.onAuthStateChanged(onStateChanged)
		.catch(function (error) {
			console.log(error);
		});
}
function onStateChanged(user) {
	if (user) {
		alert(
			firebase.auth().currentUser.email +
				'\n' +
				firebase.auth().currentUser.displayName
		);
	}
}
///////////////////call auth state changed
onFirebaseStateChanged();
