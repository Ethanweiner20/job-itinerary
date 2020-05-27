class List {
	constructor() {
		this.value;
		this.filter;
		this.docs = [];
		this.collectionRef = db.collection('users').doc(user.uid).collection('jobs');
	}
	async update(renderList, value, filter) {
		this.value = value;
		this.filter = filter;
		const response = await this.collectionRef.orderBy('data.date', 'desc').get();
		this.docs = response.docs.filter((doc) => {
			const data = doc.data().data;
			const worker = doc.data().worker;
			if (data && filter && data[filter] != 'undefined' && value) {
				if (data[filter]) {
					if (filter === 'date' && data.date) {
						const inputDate = new Date(value + ' 12:00 PM UTC').toDateString();
						const dataDate = data.date.toDate().toDateString();
						return inputDate === dataDate;
					} else {
						return data[filter].toLowerCase().includes(value) || value.includes(data[filter].toLowerCase());
					}
				} else if (filter === 'workers' && worker) {
					console.log('workers');
					return worker.toLowerCase().includes(value) || value.includes(worker.toLowerCase());
				} else {
					return false;
				}
			} else {
				return true;
			}
		});
		renderList(this.docs);
	}
	async deleteJob(dataId) {
		Spinner.show();
		await this.collectionRef.doc(dataId).delete();
		Spinner.hide();
	}
	onSnapshot(renderList) {
		this.collectionRef.onSnapshot(() => {
			this.update(renderList, this.value, this.filter);
		});
	}
}
