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
		Spinner.show();
		const response = await this.collectionRef.orderBy('created_at', 'desc').get();
		this.docs = response.docs.filter((doc) => {
			const data = doc.data().data;
			const workers = doc.data().worker;
			if (data && filter && data[filter] != 'undefined' && value) {
				console.log(data[filter].length);
				if (data[filter]) {
					if (filter === 'date' && data.date) {
						const inputDate = new Date(value + ' 12:00 PM UTC').toDateString();
						const dataDate = data.date.toDate().toDateString();
						console.log(inputDate, dataDate);
						return inputDate === dataDate;
					} else if (filter === 'workers' && workers) {
						return workers.toLowerCase().includes(value) || value.includes(data.workers.toLowerCase());
					} else {
						return data[filter].toLowerCase().includes(value) || value.includes(data[filter].toLowerCase());
					}
				} else {
					return false;
				}
			} else {
				return true;
			}
		});
		renderList(this.docs);
		Spinner.hide();
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
