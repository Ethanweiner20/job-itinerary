class Jobroom {
	constructor(worker) {
		this.worker = worker;
		this.jobs = db.collection('users').doc(user.uid).collection('jobs');
		this.job;
	}
	async getJob(render, dataID) {
		console.log('getJob');
		Spinner.show();
		if (dataID) {
			this.job = this.jobs.doc(dataID);
		} else {
			const snapshot = await this.jobs
				.where('worker', '==', this.worker)
				.orderBy('data.date', 'desc')
				.limit(1)
				.get();
			this.job = this.jobs.doc(snapshot.docs[0].id);
		}

		if (render) {
			const job = await this.job.get();
			render(job.data());
		}
		Spinner.hide();
		return this.job;
	}
	async addJob() {
		Spinner.show();
		this.job = this.jobs.doc();
		this.job.set({
			worker: this.worker,
			created_at: new Date()
		});
		Spinner.hide();
		return this;
	}

	async saveJob(data) {
		this.job.update({
			data: data,
			worker: this.worker
		});
	}
	async deleteJob(resetForm) {
		Spinner.show();
		console.log(this.job);
		await this.job.delete();
		this.job = null;
		resetForm();
		await this.getJob((data) => {
			console.log(this.job);
			jobUI.fillForm(data);
		});
		Spinner.hide();
	}
	async updateWorker(worker) {
		this.worker = worker;
		this.getJob();
		return this;
	}
	async addWorker(worker) {
		this.worker = worker;
		this.addJob();
	}
	async deleteWorker() {
		const snapshot = await this.jobs.where('worker', '==', this.worker).get();
		snapshot.docs.forEach((doc) => {
			this.jobs.doc(doc.id).delete();
		});
	}
}
