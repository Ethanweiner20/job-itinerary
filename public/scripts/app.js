dateInput.valueAsDate = new Date();
let jobRoom;
const jobUI = new JobUI(jobForm);

workersSelect.addEventListener('change', async (e) => {
	if (e.target.classList.contains('workers-select')) {
		jobRoom.updateWorker(e.target.value);
		jobRoom.getJob((data) => {
			jobUI.fillForm(data);
		});
	}
});

newWorkerForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	jobUI.resetForm();
	const worker = newWorkerForm.name.value;
	jobRoom.addWorker(worker);

	newWorkerForm.name.value = '';
	workersSelect.value = worker;
});

jobUI.form.addEventListener('keyup', () => {
	jobRoom.saveJob(jobUI.getData());
});

jobUI.form.addEventListener('click', () => {
	jobRoom.saveJob(jobUI.getData());
});
