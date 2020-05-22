class WorkersSelect {
	constructor(currentWorker) {
		this.collectionRef = db.collection('users').doc(user.uid).collection('jobs');
		this.select = workersSelect;
		this.worker = currentWorker;
		this.workers = [];
	}
	showWorker(name) {
		this.select.innerHTML += `
			<option class="text-success worker" value="${name}">
				${name}
			</option>
		`;
	}
	deleteWorker(name) {
		const workerOption = this.select.querySelector(`option[value="${name}"]`);
		if (workerOption) {
			workerOption.remove();
		}
	}

	async onSnapshot() {
		this.collectionRef.orderBy('created_at', 'desc').onSnapshot((snapshot) => {
			snapshot.docChanges().forEach((change) => {
				const worker = change.doc.data().worker;
				if (change.type === 'added') {
					if (!this.workers.includes(change.doc.data().worker)) {
						this.workers.push(change.doc.data().worker);
						this.showWorker(worker);
					}
				} else if (change.type === 'removed') {
					this.deleteWorker(worker);
				}
			});
		});
	}
}
