class JobUI {
	constructor(form) {
		this.form = form;

		// Adding New Tools & Tasks
		this.form.querySelector('.tools-button').addEventListener('click', (e) => {
			e.preventDefault();
			const toolNumber = this.form.querySelectorAll('.tool-input-group').length;
			this.addTool(toolNumber, '');
			this.form.querySelector('.tools-form').lastElementChild.children[1].focus();
		});
		this.form.querySelector('.tools-form').addEventListener('keydown', (e) => {
			if (e.target.nodeName === 'INPUT' && e.key === 'Enter') {
				e.preventDefault();
				const toolNumber = this.form.querySelectorAll('.tool-input-group').length;
				this.addTool(toolNumber, '');
				e.target.parentElement.nextElementSibling.children[1].focus();
			}
		});
		this.form.querySelector('.tasks-button').addEventListener('click', (e) => {
			e.preventDefault();
			this.addTask('', false, '');
			this.form.querySelector('.tasks-form').lastElementChild.firstElementChild.lastElementChild.focus();
		});
		this.form.querySelector('.tasks-form').addEventListener('keydown', (e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
				if (e.target.tagName.toLowerCase() === 'textarea') {
					if (!e.target.parentElement.nextElementSibling) {
						this.addTask('', false, '');
						if (e.target.name === 'notes') {
							e.target.parentElement.nextElementSibling.firstElementChild.lastElementChild.focus();
						} else if ((e.target.id = 'task')) {
							e.target.parentElement.parentElement.nextElementSibling.firstElementChild.lastElementChild.focus();
						}
					} else {
						e.target.parentElement.nextElementSibling.firstElementChild.lastElementChild.focus();
					}
				} else {
					e.target.parentElement.nextElementSibling.focus();
				}
			}
		});

		// Tool Select Functionality
		this.form.querySelector('.tools-form').addEventListener('change', (e) => {
			if (e.target.tagName.toLowerCase() === 'select') {
				const toolOption = e.target.value;
				e.target.parentElement.parentElement.querySelector('input[type="text"]').value = toolOption;
			}
		});

		// Deleting Tools & Tasks
		this.form.querySelector('.tools-form').addEventListener('click', (e) => {
			const length = this.form.querySelector('.tools-form').children.length > 2;
			if (e.target.tagName.toLowerCase() === 'button' && length) {
				e.preventDefault();
				e.target.parentElement.remove();
			} else if (e.target.tagName.toLowerCase() === 'span' && length) {
				e.preventDefault();
				e.target.parentElement.parentElement.remove();
			}
		});
		this.form.querySelector('.tasks-form').addEventListener('click', (e) => {
			const length = this.form.querySelector('.tasks-form').children.length > 2;
			if (e.target.tagName.toLowerCase() === 'button' && length) {
				e.preventDefault();
				e.target.parentElement.parentElement.remove();
			} else if (e.target.tagName.toLowerCase() === 'span' && length) {
				e.preventDefault();
				e.target.parentElement.parentElement.parentElement.remove();
			}
		});
		this.form.querySelector('.tasks-form').addEventListener('click', (e) => {
			if (e.target.classList.contains('close') && this.form.querySelector('.tasks-form').children.length > 2) {
				e.target.parentElement.parentElement.remove();
			}
		});
	}
	fillForm(data) {
		this.form.classList.remove('d-none');
		this.resetForm();
		if (data) {
			const { customer, date, location, startTime, hours, additionalNotes } = data;
			this.form.customer.value = customer;
			this.form.date.valueAsDate = date.toDate();
			this.form.location.value = location;
			this.form.time.value = startTime;
			this.form.hours.value = hours;
			this.form.additionalNotes.value = additionalNotes;
			this.form.querySelector('.tools-form').innerHTML =
				'<label for="tools" class="font-weight-bold">Tools</label>';
			data.tools.forEach((tool, index) => {
				this.addTool(index, tool.name, tool.outToJob, tool.backToShop);
			});
			this.form.querySelector('.tasks-form').innerHTML =
				'<label for="tasks" class="font-weight-bold">Tasks</label>';
			data.tasks.forEach((task) => {
				this.addTask(task.name, task.completed, task.notes);
			});
		}
	}
	getData() {
		const { customer, location, time, hours, additionalNotes } = this.form;
		return {
			customer: customer.value.trim(),
			date: new Date(getDateInput()),
			location: location.value.trim(),
			startTime: time.value.trim(),
			hours: hours.value.trim(),
			tools: this.getItemsFromList('tool'),
			tasks: this.getItemsFromList('task'),
			additionalNotes: additionalNotes.value.trim()
		};
	}
	// Utilities
	getItemsFromList(type) {
		const items = [];
		if (type === 'tool') {
			this.form.querySelectorAll(`.${type}-input-group`).forEach((item) => {
				items.push({
					name: item.querySelector('input[type="text"]').value,
					outToJob: item.querySelector('.out-to-job').checked,
					backToShop: item.querySelector('.back-to-shop').checked
				});
			});
		} else if (type === 'task') {
			this.form.querySelectorAll(`.${type}-input-group`).forEach((item) => {
				items.push({
					name: item.querySelector('input[type="text"]').value,
					completed: item.querySelector('.completed').checked,
					notes: item.nextElementSibling.value
				});
			});
		}
		return items;
	}
	addTool(toolNumber, name, outToJob, backToShop) {
		let selectInnerHTML = '';
		const toolOptions = [
			'Spring Rake',
			'Plastic Rake',
			'Spade',
			'Flat Shovel',
			'Iron Rake',
			'Edger',
			'Snow Shovel',
			'Small Rake',
			'Wheelbarrow',
			'Pitchfork',
			'Broom',
			'Pickaxe',
			'Tamper',
			'Sledge Hammer',
			'Tarp',
			'Cone',
			'Loppers',
			'Snips',
			'Snips',
			'Scuffhoe',
			'Bucket',
			'Barrel',
			'Hedgetrimmer',
			'Leafblower',
			'Dandelion Puller',
			'Weeder',
			'Hori-Hori Knife',
			'Weedwacker',
			'Lawnmower',
			'Post Hole Digger'
		];
		toolOptions.forEach((tool) => {
			selectInnerHTML += `<option value="${tool}">${tool}</option>`;
		});

		const newToolInput = document.createElement('div');
		newToolInput.classList.add('tool-input-group', 'input-group', 'my-1');
		newToolInput.innerHTML = `
            
            <button type="button" class="close mr-1" aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
			<input type="text" class="form-control" placeholder="Enter a tool" value="${name}">
			<div class="input-group-append">
				<select name="Select Tool" id="tool-select" class="custom-select">
					<option selected>OR Choose</option>
					${selectInnerHTML}
				</select>
			</div>
			<div>
				<div class="row">
					<div class="col-12">
						<div class="form-check">
							<input type="checkbox" class="out-to-job" id="checkbox1-${toolNumber}">
							<label class="form-check-label text-danger" for="checkbox1-${toolNumber}">Out to Job</label>
						</div>
					</div>
				</div>
				
				<div class="row">
					<div class="col-12">
						<div class="form-check">
							<input type="checkbox" class="back-to-shop" id="checkbox2-${toolNumber}">
							<label class="form-check-label text-success" for="checkbox2-${toolNumber}">Back to Shop</label>
						</div>
					</div>
				</div>
            </div>
        `;
		newToolInput.querySelector('.out-to-job').checked = outToJob;
		newToolInput.querySelector('.back-to-shop').checked = backToShop;
		this.form.querySelector('.tools-form').appendChild(newToolInput);
	}
	addTask(name, completed, notes) {
		const newTaskInput = document.createElement('div');
		newTaskInput.innerHTML = `

            <div class="task-input-group input-group mt-2">
                <button type="button" class="close mr-1" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <div class="input-group-prepend">
                        <div class="input-group-text">
                            <input class="completed" type="checkbox" aria-label="Checkbox for following text input">
                        </div>
                    </div>
                <input value="${name}" type="text" id="task" class="form-control" placeholder="Task">
            </div>
            <textarea class="task-notes form-control ml-3 font-italic" rows=1 name="notes" placeholder="Notes">${notes}</textarea>

	    `;
		newTaskInput.querySelector('.completed').checked = completed;
		this.form.querySelector('.tasks-form').appendChild(newTaskInput);
	}
	resetForm() {
		this.form.reset();
		dateInput.valueAsDate = new Date();
		this.form.querySelectorAll('.tool-input-group').forEach((group) => {
			group.remove();
		});
		this.form.querySelectorAll('.task-input-group').forEach((group) => {
			group.remove();
		});
		this.form.querySelectorAll('.task-notes').forEach((group) => {
			group.remove();
		});
	}
}