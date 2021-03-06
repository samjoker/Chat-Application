let currentUserKey = '';
let msgChatKey = '';
let friend_id = '';

// !CHat functions
function startChat(friendKey, friendName, friendPhoto) {
	let friendList = {
		friendId: friendKey,
		userId: currentUserKey,
	};
	friend_id = friendKey;
	let db = firebase.database().ref('friend_list');
	let flag = false;
	db.on('value', function (friends) {
		friends.forEach(function (data) {
			let user = data.val();
			if (
				(user.friendId === friendList.friendId &&
					user.userId === friendList.userId) ||
				(user.friendId === friendList.userId &&
					user.userId === friendList.friendId)
			) {
				flag = true;
				msgChatKey = data.key;
			}
		});
		if (flag === false) {
			msgChatKey = firebase
				.database()
				.ref('friend_list')
				.push(friendList, function (error) {
					if (error) alert(error);
					else {
						document
							.getElementById('chat-startup')
							.setAttribute('style', 'display:none');
						document
							.getElementById('chat-panel')
							.removeAttribute('style');
						hideNewChat();
					}
				})
				.getKey();
		} else {
			document
				.getElementById('chat-startup')
				.setAttribute('style', 'display:none');
			document.getElementById('chat-panel').removeAttribute('style');
			hideNewChat();
		}
		enterKey();
		document.getElementById('txtmsg').value = '';
		document.getElementById('txtmsg').focus();
		//////////////////display Friend Name
		document.getElementById('divChatName').innerHTML = friendName;
		document.getElementById('divChatImg').src = friendPhoto;
		/////////////////////////Display chat mEssages
		document.getElementById('enterMessage').innerHTML = '';
		loadChatMessages(msgChatKey, friendPhoto);
	});
}

function loadChatMessages(msgChatKey, friendPhoto) {
	let db = firebase.database().ref('chatMessage').child(msgChatKey);

	db.on('value', function (chats) {
		let displayMessages = '';

		chats.forEach(function (data) {
			let chat = data.val();
			let dateTime = chat.dateTime.split(',');
			let msg = '';
			if (chat.msg.indexOf('base64') != -1) {
				msg = `<img src="${chat.msg}" class="img-fluid"/>`;
			} else {
				msg = chat.msg;
			}
			if (chat.userId != currentUserKey) {
				displayMessages += `<div class="row">
				<div class="col-2 col-sm-2 col-md-1">
					<img
						src="${friendPhoto}"
						alt="User-img"
						class="user-chat-img"
					/>
				</div>
				<div class="col-6 col-sm-7 col-md-7">
					<p class="recived-msg">
					${msg}	
					<span title="${dateTime[0]}"class="text-time">${dateTime[1]}</span>
					</p>
				</div>
			</div>`;
			} else {
				displayMessages += `<div class="row justify-content-end">
							<div class="col-6 col-sm-7 col-md-7 col-lg-6">
							<p class="sent-msg">
							${msg}	
							<span title="${dateTime[0]}"class="text-time">${dateTime[1]}</span>
								</p>
							</div>
										<div class="col-2 col-sm-1 col-md-1">
							<img src="${firebase.auth().currentUser.photoURL}"
							alt="User-img"	class="user-chat-img"/>
							</div>
						</div>`;
			}
		});
		document.getElementById('enterMessage').innerHTML = displayMessages;
		document
			.getElementById('enterMessage')
			.scrollTo(0, document.getElementById('enterMessage').clientHeight);
	});
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

function loadChatList() {
	let db = firebase.database().ref('friend_list');
	db.on('value', function (list) {
		document.getElementById(
			'chatList'
		).innerHTML = `<li class="list-group-item list-group-item-action"
													  style="background: #f8f8f8">
													  <input class="form-control form-search"
													  type="text"placeholder="Search" name=""
													  id=""/>
													</li>`;

		list.forEach(function (data) {
			let lst = data.val();
			let friendKey = '';
			if (lst.friendId === currentUserKey) {
				friendKey = lst.userId;
			} else if (lst.userId === currentUserKey) {
				friendKey = lst.friendId;
			}
			if (friendKey != '') {
				firebase
					.database()
					.ref('users')
					.child(friendKey)
					.on('value', function (data) {
						let user = data.val();
						document.getElementById(
							'chatList'
						).innerHTML += `<li onclick= "startChat('${data.key}','${user.name}','${user.photoURL}')"
														 		class="list-group-item list-group-item-action"
																style="cursor: pointer"
																>
																<div class="row" style="width: 100%">
																	<div class="col-3 col-sm-3 col-md-3 col-lg-2">
																	<img class="user-img" src="${user.photoURL}" alt="Profile Image"/>
																	</div>
																	<div class="col-8 col-sm-8 col-md-6 col-lg-9">
																	<div class="user-name">
																		${user.name};
																	</div>
																	<div class="user-text">
																			lorem Lorem Lorem Lorem Lorem
																	</div>
																	</div>
																	</div>
																</li>`;
					});
			}
		});
	});
}
function sendIconOpen(control) {
	if (control.value != '') {
		document.getElementById('sendIcon').removeAttribute('style');
		document
			.getElementById('microPhone')
			.setAttribute('style', 'display:none');
	} else {
		document.getElementById('microPhone').removeAttribute('style');
		document
			.getElementById('sendIcon')
			.setAttribute('style', 'display:none');
	}
}
// !SMily
loadEmoji();
function loadEmoji() {
	let emoji = '';
	for (let i = 128512; i <= 128567; i++) {
		emoji += ` <a herf="#" style="font-size:30px;" onclick="getEmoji(this)">&#${i};</a>`;
	}
	document.getElementById('smily').innerHTML = emoji;

	let symbol = '';
	for (let i = 128001; i <= 128210; i++) {
		symbol += ` <a herf="#" style="font-size:20px;" onclick="getEmoji(this)">&#${i};</a>`;
	}
	document.getElementById('symbols').innerHTML = symbol;

	let books = '';
	for (let i = 128211; i <= 128511; i++) {
		books += ` <a herf="#" style="font-size:20px;" onclick="getEmoji(this)">&#${i};</a>`;
	}
	document.getElementById('books').innerHTML = books;
}
function getEmoji(control) {
	document.getElementById('txtmsg').value += control.innerHTML;
}
function openSmilyPannel() {
	document.getElementById('emojiDiv').removeAttribute('style');
}
function closeSmilyPannel() {
	document.getElementById('emojiDiv').setAttribute('style', 'display:none');
}
// let messages;
// const textField = document.getElementById('txtmsg');
// !send mEssages functions here
function sendMessage() {
	let chatMessage = {
		userId: currentUserKey,
		msg: document.getElementById('txtmsg').value,
		dateTime: new Date().toLocaleString(),
	};
	firebase
		.database()
		.ref('chatMessage')
		.child(msgChatKey)
		.push(chatMessage, function (error) {
			if (error) {
				alert(error);
			} else {
				firebase
					.database()
					.ref('fcmTokens')
					.child(friend_id)
					.once('value')
					.then(function (data) {
						$.ajax({
							url: 'https://fcm.googleapis.com/fcm/send',
							method: 'POST',
							headers: {
								'content-type': 'application/json',
								Authorization:
									'key=AAAAbPKKPnc:APA91bHAg2a_9tB8M0g77IQcmVqnjQ-KvwYM0gwURyWri2sfRa8G04rHMVlCE9BfLzEd0QisjGK_r2SlRkU_GVPXo4V98L874UUEQVPEHtf_uYt7Dseo4xedsudd-7yBJ5jGyxhxR8-P',
							},
							data: JSON.stringify({
								to: data.val().token_id,
								data: {
									message:
										chatMessage.msg.substring(0, 30) +
										'.....',
									img: firebase.auth().currentUser.photoURL,
								},
								success: function (response) {
									console.log(response);
								},
								error: function (xhr, textStatus, error) {
									console.log(xhr.error);
								},
							}),
						});
					});
				document.getElementById('txtmsg').value = '';
				document.getElementById('txtmsg').focus();
			}
		});
}

function iconSendMsg() {
	sendMessage();
}
///////Send images

function openImage() {
	document.getElementById('imageFile').click();
}
function sendImage(event) {
	let file = event.files[0];
	if (!file.type.match('image.*')) {
		alert('please Select Image Type only');
	} else {
		let reader = new FileReader();
		reader.addEventListener(
			'load',
			function () {
				let chatMessage = {
					userId: currentUserKey,
					msg: reader.result,
					dateTime: new Date().toLocaleString(),
				};
				firebase
					.database()
					.ref('chatMessage')
					.child(msgChatKey)
					.push(chatMessage, function (error) {
						if (error) {
							alert(error);
						} else {
							document.getElementById('txtmsg').value = '';
							document.getElementById('txtmsg').focus();
						}
					});
			},
			false
		);
		if (file) {
			reader.readAsDataURL(file);
		}
	}
}
function openDocument() {
	document.getElementById('documentFile').click();
}
function openCamera() {
	document.getElementById('cameraFile').click();
}

// !Firebase
// !
function populateFriendList() {
	document.getElementById('lstFriend').innerHTML = `
										<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
										<lottie-player src="https://assets5.lottiefiles.com/packages/lf20_K1Cr3w.json"
										 background="transparent"  speed="1"
										 style="width: 300px;
										  height: 300px;"
										  loop
										  autoplay>
										  </lottie-player>`;
	let db = firebase.database().ref('users');
	let lst = '';
	db.on('value', function (users) {
		if (users.hasChildren()) {
			lst = `<li
			class="list-group-item list-group-item-action"
			style="background: #f8f8f8">
			<input
				class="form-control form-search"
				type="text"
				placeholder="Search"
				name=""
				id=""
			/>
		</li>
		`;
		}
		users.forEach(function (data) {
			let user = data.val();
			if (user.email != firebase.auth().currentUser.email) {
				lst += `<li onclick="startChat('${data.key}','${user.name}','${user.photoURL}')"
			data-dismiss="modal"
			class="list-group-item list-group-item-action"  style="cursor: pointer"	>
			<div class="row" style="width: 100%">
				<div class="col-3 col-sm-3 col-md-3 col-lg-2">
					<img class="user-img"
						src="${user.photoURL}"
						alt="Profile Image"
					/>
				</div>
				<div class="col-8 col-sm-8 col-md-6 col-lg-9">
					<div class="user-name">
						${user.name}
					</div>
				</div>
			</div>
		</li>`;
			}
		});
		document.getElementById('lstFriend').innerHTML = lst;
	});
}

function signIn() {
	var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithRedirect(provider);
}
function signOut() {
	firebase.auth().signOut();
}
function onFirebaseStateChanged() {
	firebase.auth().onAuthStateChanged(onStateChanged);
}
function onStateChanged(user) {
	if (user) {
		let userProfile = { email: '', name: '', photoURL: '' };
		userProfile.email = firebase.auth().currentUser.email;
		userProfile.name = firebase.auth().currentUser.displayName;
		userProfile.photoURL = firebase.auth().currentUser.photoURL;

		let db = firebase.database().ref('users');
		let flag = false;

		db.on('value', function (users) {
			users.forEach(function (data) {
				let user = data.val();
				if (user.email === userProfile.email) {
					currentUserKey = data.key;
					flag = true;
				}
			});
			if (flag === false) {
				firebase.database().ref('users').push(userProfile, callback);
			} else {
				document.getElementById('imgProfile').src =
					firebase.auth().currentUser.photoURL;
				document.getElementById('userName').innerHTML =
					firebase.auth().currentUser.displayName;
				document.getElementById('lknSignIn').style = 'display:none';
				document.getElementById('lknSignOut').style = '';
			}
			const messaging = firebase.messaging();
			messaging
				.requestPermission()
				.then(function () {
					return messaging.getToken();
				})
				.then(function (token) {
					firebase
						.database()
						.ref('fcmTokens')
						.child(currentUserKey)
						.set({ token_id: token });
				});
			document.getElementById('lnkNewChat').classList.remove('disabled');
			// document.getElementById('chat-startup').classList.add('d-none');
			// document.getElementById('contact-list').classList.remove('d-none');
		});
		loadChatList();
	} else {
		document.getElementById('imgProfile').src = './img/profile.png';

		document.getElementById('userName').innerHTML = 'Welcome SignIn';

		document.getElementById('lknSignIn').style = '';
		document.getElementById('lknSignOut').style = 'display:none';
		document.getElementById('lnkNewChat').classList.add('disabled');
		// document.getElementById('chat-startup').classList.remove('d-none');
	}
}
function callback(error) {
	if (error) {
		console.log(error);
	} else {
		document.getElementById('imgProfile').src =
			firebase.auth().currentUser.photoURL;
		document.getElementById('userName').innerHTML =
			firebase.auth().currentUser.displayName;
		document.getElementById('lknSignIn').style = 'display:none';
		document.getElementById('lknSignOut').style = '';
	}
}
onFirebaseStateChanged();
