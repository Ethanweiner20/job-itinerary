let user;

// Make Changes Based on User Status

const renderUserUI = async () => {
	accountStatus.innerText = user.email;
	accountStatus.classList.add('dropdown-toggle');
	jumbotron.classList.add('d-none');
	mainContainer.classList.remove('d-none');

	jobRoom = new Jobroom('');
	select = new WorkersSelect();
	select.onSnapshot();
	list = new List();
	list.onSnapshot((docs) => {
		listUI.renderList(docs);
	});
};

const renderNonUserUI = () => {
	accountStatus.innerText = 'Not Signed In';
	accountStatus.classList.remove('dropdown-toggle');
	jumbotron.classList.remove('d-none');
	mainContainer.classList.add('d-none');
};

auth.onAuthStateChanged((currentUser) => {
	if (currentUser) {
		user = currentUser;
		db.collection('users').doc(user.uid).set({
			email: user.email
		});
		renderUserUI();
	} else {
		renderNonUserUI();
	}
});

// Jumbotron Functionality
signInButton.addEventListener('click', (e) => {
	e.preventDefault();
	signInButton.classList.add('shadow');
	signUpButton.classList.remove('shadow');

	signInForm.classList.toggle('d-none');
	signUpForm.classList.add('d-none');
});

signUpButton.addEventListener('click', (e) => {
	e.preventDefault();
	signUpButton.classList.add('shadow');
	signInButton.classList.remove('shadow');

	signUpForm.classList.toggle('d-none');
	signInForm.classList.add('d-none');
});

// Signing Up
signUpForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = signUpForm.email.value;
	const password = signUpForm.password.value;
	const passwordRegex = /^^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
	if (passwordRegex.test(password)) {
		signUpForm.querySelector('p').classList.add('d-none');
		signUpForm.password.classList.remove('border-danger');
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((cred) => {
				user = cred.user;
				signUpForm.classList.add('d-none');
			})
			.catch((err) => {
				signUpForm.querySelector('p').classList.remove('d-none');
				signUpForm.querySelector('p').innerText = err.message;
			});
		signUpForm.reset();
	} else {
		signUpForm.password.classList.add('border-danger');
		signUpForm.querySelector('p').classList.remove('d-none');
	}
});

// Signing In
signInForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const email = signInForm.email.value;
	const password = signInForm.password.value;
	auth
		.signInWithEmailAndPassword(email, password)
		.then(() => {
			signInForm.classList.add('d-none');
		})
		.catch((err) => {
			console.log(err);
			signInForm.email.classList.add('border-danger');
			signInForm.password.classList.add('border-danger');
			signInForm.querySelector('p').classList.remove('d-none');
		});
});

// Signing Out
signOutButton.addEventListener('click', (e) => {
	e.preventDefault();
	auth.signOut();
	jobUI.resetForm();
	workersSelect.innerHTML = '<option selected="" class="font-italic" disabled="">Select worker or group</option>';
});
