class WorkersSelect {
	constructor(currentWorker) {
		this.collectionRef = db.collection('users').doc(user.uid).collection('jobs');
		this.select = workersSelect;
		this.worker = currentWorker;
	}
	showWorker(name) {
		this.select.innerHTML += `
			<option class="text-success worker value=${name}">
				${name}
			</option>
		`;
	}

	async onSnapshot() {
		// Reduce to array of workers w/ same name
		this.collectionRef.orderBy('created_at', 'desc').onSnapshot((snapshot) => {
			let addedWorkers = [];
			snapshot.docChanges().forEach((change) => {
				if (change.type === 'added') {
					if (!addedWorkers.includes(change.doc.data().worker)) {
						addedWorkers.push(change.doc.data().worker);
					}
				}
			});
			addedWorkers.forEach((worker) => {
				this.showWorker(worker);
			});
		});
	}
}
