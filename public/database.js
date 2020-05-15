// MOVE TO DAYVIEW CLASS
class Day {
	constructor(form) {
		const { customer, workers, location, time, hours, additionalNotes } = form;
		this.customer = customer.value.trim();
		this.workers = workers.value.trim();
		this.date = new Date(getDateInput());
		this.location = location.value.trim();
		this.startTime = time.value.trim();
		this.hours = hours.value.trim();
		this.tools = getItemsFromList('tool');
		this.tasks = getItemsFromList('task');
		this.additionalNotes = additionalNotes.value.trim();
	}
	toFirestore() {
		return {
			customer: this.customer,
			workers: this.workers,
			date: this.date,
			location: this.location,
			startTime: this.startTime,
			hours: this.hours,
			tools: this.tools,
			tasks: this.tasks,
			additionalNotes: this.additionalNotes
		};
	}
	async submit(dataId) {
		const docRef = db.collection('users').doc(user.uid);
		Spinner.show();
		if (dataId) {
			await docRef.collection('days').doc(dataId).set(this.toFirestore());
		} else {
			await docRef.collection('days').add(this.toFirestore());
			await docRef.collection('current day').doc('current').delete();
		}
		Spinner.hide();
		return this;
	}
	async setAsCurrent() {
		const docRef = db.collection('users').doc(user.uid);
		await docRef.collection('current day').doc('current').set(this.toFirestore());
	}
}

// MOVE TO APP.JS (create event listener inside DAYVIEW class)
submitButton.addEventListener('click', (e) => {
	e.preventDefault();
	const day = new Day(form);
	day
		.submit()
		.then(() => {
			resetForm();
		})
		.catch((err) => {
			console.log(err.message);
		});
});

// MOVE TO APP.JS (create event listener inside DAYVIEW class)
updateButton.addEventListener('click', (e) => {
	e.preventDefault();
	const day = new Day(form);
	day.submit(form.getAttribute('data-id'));
});

// Save Form on Change
// MOVE TO DAYVIEW.JS
const refreshCurrentDay = () => {
	if (document.querySelector('#new-day-tab').classList.contains('active')) {
		const day = new Day(form);
		day.setAsCurrent();
	}
};

form.addEventListener('keyup', (e) => {
	refreshCurrentDay();
});

form.addEventListener('click', (e) => {
	refreshCurrentDay();
});

// Search List
// MOVE TO LISTVIEW.JS
class List {
	getListItemHTML(data, id) {
		let innerHTML = `
		<a href="#" data-id="${id}" class="data-link list-group-item list-group-item-action">
			<button type="button" class="exit close mr-1 d-inline-block" aria-label="Close">
				<span class="exit" aria-hidden="true">&times;</span>
			</button>
			<h6 data-id="${id}" class="data-link">${data.date.toDate().toDateString()}</h6>
			<ul data-id="${id}" class="data-link list-unstyled">
				<li data-id="${id}" class="data-link text-secondary d-block d-lg-inline">Customer: <span data-id="${id}" class="data-link text-dark">${data.customer}</span></li>
				<span data-id="${id}" class="data-link d-none d-lg-inline text-black"> | </span>
				<li data-id="${id}" class="data-link text-secondary d-block d-lg-inline">Location: <span data-id="${id}" class="data-link text-dark">${data.location}</span></li>
				<span data-id="${id}" class="data-link d-none d-lg-inline text-black"> | </span>
				<li data-id="${id}" class="data-link text-secondary d-block d-lg-inline">Workers: <span data-id="${id}" class="data-link text-dark">${data.workers}</span></li>
			</ul>
			<p data-id="${id}" class="data-link text-primary font-italic">Click to see full day</p>
		</a>
		`;
		return innerHTML;
	}
	async update(filter, value) {
		Spinner.show();
		let listHTML = '';
		const docRef = db.collection('users').doc(user.uid);
		const response = await docRef.collection('days').orderBy('date', 'desc').get();
		if (filter === 'all days' || filter === 'search by') {
			response.docs.forEach((doc) => {
				listHTML += this.getListItemHTML(doc.data(), doc.id);
			});
		} else {
			const filteredDocs = response.docs.filter((doc) => {
				const data = doc.data();
				if (data[filter]) {
					if (filter === 'date') {
						const inputDate = new Date(value + ' 12:00 PM UTC').toDateString();
						const dataDate = data.date.toDate().toDateString();
						return inputDate === dataDate;
					} else {
						return data[filter].toLowerCase().includes(value) || value.includes(data[filter].toLowerCase());
					}
				}
			});
			filteredDocs.forEach((doc) => {
				listHTML += this.getListItemHTML(doc.data(), doc.id);
			});
		}
		list.innerHTML = listHTML;
		list.classList.remove('d-none');
		Spinner.hide();
	}
}

// MOVE TO LIST VIEW.JS
searchForm.addEventListener('submit', (e) => {
	e.preventDefault();
	form.classList.add('d-none');
	resetButton.classList.add('d-none');
	updateButton.classList.add('d-none');
	const list = new List();
	list.update(searchForm['search-filter'].value.trim().toLowerCase(), searchForm.search.value.trim().toLowerCase());
});

// MOVE TO DAYVIEW.JS
async function showDay(dataId) {
	Spinner.show();
	const docRef = await db.collection('users').doc(user.uid);
	let doc;
	if (dataId) {
		doc = await docRef.collection('days').doc(dataId).get();
		updateButton.classList.remove('d-none');
		resetButton.classList.remove('d-none');
	} else {
		doc = await docRef.collection('current day').doc('current').get();
	}
	const data = doc.data();
	list.classList.add('d-none');
	form.classList.remove('d-none');
	if (data) {
		const { customer, workers, date, location, startTime, hours, additionalNotes } = data;

		form.setAttribute('data-id', dataId);
		form.customer.value = customer;
		form.workers.value = workers;
		form.date.valueAsDate = date.toDate();
		form.location.value = location;
		form.time.value = startTime;
		form.hours.value = hours;
		form.additionalNotes.value = additionalNotes;

		toolsForm.innerHTML = '<label for="tools" class="font-weight-bold">Tools</label>';
		data.tools.forEach((tool, index) => {
			addTool(index, tool.name, tool.outToJob, tool.backToShop);
		});
		tasksForm.innerHTML = '<label for="tasks" class="font-weight-bold">Tasks</label>';
		data.tasks.forEach((task) => {
			addTask(task.name, task.completed, task.notes);
		});
	}
}

// MOVE TO LISTVIEW CLASS
const deleteListItem = async (dataId) => {
	Spinner.show();
	await db.collection('users').doc(user.uid).collection('days').doc(dataId).delete();
	Spinner.hide();
	searchForm.reset();
};

list.addEventListener('click', (e) => {
	if (e.target.classList.contains('data-link')) {
		showDay(e.target.getAttribute('data-id')).then(() => {
			Spinner.hide();
		});
	} else if (e.target.tagName.toLowerCase() === 'button' && e.target.classList.contains('exit')) {
		e.preventDefault();
		deleteListItem(e.target.parentElement.getAttribute('data-id'));
	} else if (e.target.tagName.toLowerCase() === 'span' && e.target.classList.contains('exit')) {
		e.preventDefault();
		deleteListItem(e.target.parentElement.parentElement.getAttribute('data-id'));
	}
});
