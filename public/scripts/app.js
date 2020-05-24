let jobRoom;
const jobUI = new JobUI(jobForm);

deleteWorkerButton.disabled = true;

// Selecting Worker
workersSelect.addEventListener('change', async (e) => {
	if (e.target.classList.contains('workers-select')) {
		jobRoom.updateWorker(e.target.value);
		jobRoom.getJob((data) => {
			jobUI.fillForm(data);
		});
		currentWorkerSpan.innerText = e.target.value;
	}
	deleteWorkerButton.disabled = false;
});

setTimeout(() => {
	if (workersSelect.children[1]) {
		workersSelect.children[0].selected = false;
		workersSelect.children[1].selected = true;
		workersSelect.dispatchEvent(new Event('change'));
	}
}, 1200);

// Adding Worker
newWorkerForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	jobUI.resetForm();
	const worker = newWorkerForm.name.value;
	jobRoom.addWorker(worker);
	jobRoom.getJob();

	newWorkerForm.name.value = '';
	$('#new-worker-modal').modal('hide');
});

// Deleting Worker
deleteWorkerButton.addEventListener('click', (e) => {
	deletedWorkerSpan.innerText = workersSelect.value;
});

deleteWorkerForm.addEventListener('submit', (e) => {
	e.preventDefault();
	jobRoom.deleteWorker();
	jobUI.resetForm();
	$('#delete-worker-modal').modal('hide');
});

// Saving Data
jobUI.form.addEventListener('keyup', () => {
	jobRoom.saveJob(jobUI.getData());
});

jobUI.form.addEventListener('click', () => {
	jobRoom.saveJob(jobUI.getData());
});

newJobButton.addEventListener('click', (e) => {
	e.preventDefault();
	jobRoom.addJob();
	jobUI.resetForm();
});

resetButton.addEventListener('click', (e) => {
	e.preventDefault();
	jobUI.resetForm();
});
