class Jobroom {
	constructor(worker) {
		this.worker = worker;
		this.jobs = db.collection('users').doc(user.uid).collection('jobs');
		this.job = this.jobs.where('worker', '==', worker).orderBy('created_at', 'desc').limit(1);
	}
	async getJob(render) {
		Spinner.show();
		const snapshot = await this.job.get();
		const job = snapshot.docs[0];
		render(job.data().data);
		Spinner.hide();
		return job;
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
		const snapshot = await this.job.get();
		const job = this.jobs.doc(snapshot.docs[0].id);
		await job.set({
			data: data,
			worker: this.worker,
			created_at: new Date()
		});
	}
	async updateWorker(worker) {
		this.worker = worker;
		this.job = this.jobs.where('worker', '==', worker).orderBy('created_at', 'desc').limit(1);
		return this;
	}
	async addWorker(worker) {
		this.worker = worker;
		this.addJob();
	}
}
