let jobRoom;
const jobUI = new JobUI(jobForm);
let list;
const listUI = new ListUI(listGroup);

deleteWorkerButton.disabled = true;

const refreshForm = (worker) => {
	jobRoom.updateWorker(worker);
	jobRoom.getJob((data) => {
		jobUI.fillForm(data);
	});
	currentWorkerSpan.innerText = worker;
};

const selectFirstWorker = () => {
	if (workersSelect.children[1]) {
		workersSelect.children[0].selected = false;
		workersSelect.children[1].selected = true;
		workersSelect.dispatchEvent(new Event('change'));
	} else {
		jobForm.classList.add('d-none');
	}
};

// Selecting Worker
workersSelect.addEventListener('change', async (e) => {
	if (e.target.classList.contains('workers-select')) {
		refreshForm(e.target.value);
	}
	deleteWorkerButton.disabled = false;
});

setTimeout(selectFirstWorker, 1200);

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
	setTimeout(selectFirstWorker, 500);
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
	setTimeout(() => {
		document.querySelectorAll('textarea').forEach((textarea) => {
			autoExpand(textarea);
		});
	}, 500);
});

resetButton.addEventListener('click', (e) => {
	e.preventDefault();
	jobUI.resetForm();
});

// Updating the List
searchForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	jobForm.classList.add('d-none');
	listGroup.classList.remove('d-none');
	Spinner.show();
	await list.update(
		(docs) => {
			listUI.renderList(docs);
		},
		searchForm.search.value.trim().toLowerCase(),
		searchForm['search-filter'].value.trim().toLowerCase()
	);
	Spinner.hide();
});

listGroup.addEventListener('click', (e) => {
	if (e.target.classList.contains('data-link')) {
		jobRoom.getJob((data) => {
			jobUI.fillForm(data);
		}, e.target.getAttribute('data-id'));
		listGroup.classList.add('d-none');
	} else if (e.target.tagName.toLowerCase() === 'button' && e.target.classList.contains('exit')) {
		e.preventDefault();
		list.deleteJob(e.target.parentElement.getAttribute('data-id'));
	} else if (e.target.tagName.toLowerCase() === 'span' && e.target.classList.contains('exit')) {
		e.preventDefault();
		list.deleteJob(e.target.parentElement.parentElement.getAttribute('data-id'));
	}
});

// Changing Tabs
document.querySelector('#archives-tab').addEventListener('click', () => {
	jobForm.classList.add('d-none');
	searchForm.classList.remove('d-none');
	listGroup.classList.remove('d-none');
	newJobButton.classList.add('d-none');
	recentJobInfo.classList.add('d-none');
});

document.querySelector('#recent-jobs-tab').addEventListener('click', () => {
	jobForm.classList.remove('d-none');
	searchForm.classList.add('d-none');
	newJobButton.classList.remove('d-none');
	recentJobInfo.classList.remove('d-none');

	refreshForm(workersSelect.value);
});
