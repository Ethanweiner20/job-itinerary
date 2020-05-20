dateInput.valueAsDate = new Date();
let dayView;

document.querySelector('#new-day-tab').addEventListener('click', () => {
	document.querySelector('#reset').classList.remove('d-none');
	document.querySelector('.list-group').classList.add('d-none');
	const dayView = new DayView();
	dayView.setDayDoc().show();
});

document.querySelector('#archives-tab').addEventListener('click', () => {
	jobForm.classList.add('d-none');
	document.querySelector('#reset').classList.add('d-none');
	document.querySelector('.list-group').classList.remove('d-none');
});

workersSelect.addEventListener('change', async (e) => {
	if (e.target.classList.contains('workers-select')) {
		if (dayView) {
			dayView.resetForm();
			dayView.updateWorker(e.target.value);
		} else {
			dayView = new DayView(jobForm, e.target.value, {});
		}
		await dayView.setDayDoc();
		await dayView.show();
	}
});

newWorkerForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const name = newWorkerForm.name.value;
	await db.collection('users').doc(user.uid).collection('workers').doc(name).set({
		name: name,
		created_at: new Date()
	});
	dayView = new DayView(jobForm, name, { newJob: true });
	await dayView.setDayDoc();
	await dayView.show();
	newWorkerForm.name.value = '';
	workersSelect.value = name;
});
