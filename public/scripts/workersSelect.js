class WorkersSelect {
	constructor(currentWorker) {
		this.collectionRef = db.collection('users').doc(user.uid).collection('workers');
		this.select = workersSelect;
		this.worker = currentWorker;
		document.querySelector('.new-worker').addEventListener('click', (e) => {});
	}
	showWorker(worker) {
		this.select.innerHTML += `
			<option class="text-success worker value=${worker.name}">
				${worker.name}
			</option>
		`;
	}
	async listenForDeletes() {}

	async onSnapshot() {
		db
			.collection('users')
			.doc(user.uid)
			.collection('workers')
			.orderBy('created_at', 'desc')
			.onSnapshot((snapshot) => {
				snapshot.docChanges().forEach((change) => {
					if (change.type === 'added') {
						this.showWorker(change.doc.data());
					}
				});
			});
	}
}
