class DayView {
	constructor(form, dataId) {
		this.form = form;
		this.dayDoc = dataId
			? db.collection('users').doc(user.uid).collection('daysV2').doc(dataId)
			: db.collection('users').doc(user.uid).collection('daysV2').doc();
	}
	async save() {
		Spinner.show();
		const { customer, workers, location, time, hours, additionalNotes } = this.form;
		const response = await this.dayDoc.set({
			customer: customer.value.trim(),
			worker: workers.value.trim(),
			date: new Date(getDateInput()),
			location: location.value.trim(),
			startTime: time.value.trim(),
			hours: hours.value.trim(),
			tools: this.getItemsFromList('tool'),
			tasks: this.getItemsFromList('task'),
			additionalNotes: additionalNotes.value.trim()
		});
		Spinner.hide();
		return response;
	}
	async show(worker) {}
	getItemsFromList(type) {
		const items = [];
		if (type === 'tool') {
			document.querySelectorAll(`.${type}-input-group`).forEach((item) => {
				items.push({
					name: item.querySelector('input[type="text"]').value,
					outToJob: item.querySelector('.out-to-job').checked,
					backToShop: item.querySelector('.back-to-shop').checked
				});
			});
		} else if (type === 'task') {
			document.querySelectorAll(`.${type}-input-group`).forEach((item) => {
				items.push({
					name: item.querySelector('input[type="text"]').value,
					completed: item.querySelector('.completed').checked,
					notes: item.nextElementSibling.value
				});
			});
		}
		return items;
	}
}
