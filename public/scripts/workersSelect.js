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
	deleteWorker() {
		const workerOption = this.select.querySelector(`option[value="${this.select.value}"]`);
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
						this.selectFirstWorker();
					}
				}
			});
		});
	}

	selectFirstWorker() {
		if (this.select.children[1]) {
			this.select.children[0].selected = false;
			this.select.children[1].selected = true;
			this.select.dispatchEvent(new Event('change'));
		} else {
			jobForm.classList.add('d-none');
		}
	}
}
