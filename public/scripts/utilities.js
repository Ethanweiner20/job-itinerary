// DOM Elements
const signInButton = document.querySelector('#sign-in');
const signUpButton = document.querySelector('#sign-up');
const signInForm = document.querySelector('#sign-in-form');
const signUpForm = document.querySelector('#sign-up-form');
const accountStatus = document.querySelector('#account-status');
const signOutButton = document.querySelector('#sign-out-button');
const jumbotron = document.querySelector('.jumbotron');
const mainContainer = document.querySelector('#main-container');
const submitButton = document.querySelector('#submit');
const list = document.querySelector('.list-group');
const updateButton = document.querySelector('#update');
const resetButton = document.querySelector('#reset-form');
const jobForm = document.querySelector('#job-form');
const dateInput = document.querySelector('#date');
const workersSelect = document.querySelector('.workers-select');
const newWorkerForm = document.querySelector('.new-worker-form');
const newJobButton = document.querySelector('#new-job-button');
const deleteWorkerButton = document.querySelector('.delete-worker');
const deletedWorkerSpan = document.querySelector('#deleted-worker');
const deleteWorkerForm = document.querySelector('.delete-worker-form');
const currentWorkerSpan = document.querySelector('.current-worker');

dateInput.valueAsDate = new Date();

Spinner();
Spinner.hide();

var autoExpand = function(field) {
	// Reset field height
	field.style.height = 'inherit';

	// Get the computed styles for the element
	var computed = window.getComputedStyle(field);

	// Calculate the height
	var height =
		parseInt(computed.getPropertyValue('border-top-width'), 10) +
		parseInt(computed.getPropertyValue('padding-top'), 10) +
		field.scrollHeight +
		parseInt(computed.getPropertyValue('padding-bottom'), 10) +
		parseInt(computed.getPropertyValue('border-bottom-width'), 10);

	field.style.height = height + 'px';
};

document.addEventListener(
	'input',
	function(event) {
		if (event.target.tagName.toLowerCase() !== 'textarea') return;
		autoExpand(event.target);
	},
	false
);

const getDateInput = () => {
	const date =
		dateInput.valueAsDate.getFullYear() +
		'-' +
		String(dateInput.valueAsDate.getMonth() + 1).padStart(2, '0') +
		'-' +
		String(dateInput.valueAsDate.getDate() + 1).padStart(2, '0') +
		'T12:00:00Z';
	return date;
};
