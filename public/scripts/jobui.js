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
			if (e.target.nodeName === 'INPUT' && e.key === 'Tab') {
				e.preventDefault();
				if (!e.target.parentElement.nextElementSibling) {
					const toolNumber = this.form.querySelectorAll('.tool-input-group').length;
					this.addTool(toolNumber, '');
					this.form.querySelector('.tools-form').lastElementChild.children[1].focus();
				} else {
					e.target.parentElement.nextElementSibling.children[1].focus();
				}
			}
		});
		this.form.querySelector('.tasks-button').addEventListener('click', (e) => {
			e.preventDefault();
			this.addTask('', false, '');
			this.form.querySelector('.tasks-form').lastElementChild.firstElementChild.lastElementChild.focus();
		});
		this.form.querySelector('.tasks-form').addEventListener('keydown', (e) => {
			if (e.key === 'Tab') {
				e.preventDefault();
				if (e.target.name === 'notes') {
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

		// Adding New Images
		this.form.querySelector('.images-button').addEventListener('click', (e) => {
			e.preventDefault();
			this.addImage();
		});

		// Tool Select Functionality
		this.form.querySelector('.tools-form').addEventListener('change', (e) => {
			if (e.target.tagName.toLowerCase() === 'select') {
				const toolOption = e.target.value;
				e.target.parentElement.parentElement.querySelector('input[type="text"]').value = toolOption;
			}
		});

		// Deleting Tools, Tasks, & Images
		this.form.querySelector('.tools-form').addEventListener('click', (e) => {
			const length = this.form.querySelector('.tools-form').children.length > 1;
			if (e.target.tagName.toLowerCase() === 'button' && length) {
				e.preventDefault();
				e.target.parentElement.remove();
			} else if (e.target.tagName.toLowerCase() === 'span' && length) {
				e.preventDefault();
				e.target.parentElement.parentElement.remove();
			}
		});
		this.form.querySelector('.tasks-form').addEventListener('click', (e) => {
			const length = this.form.querySelector('.tasks-form').children.length > 1;
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
		this.form.querySelector('.images-container').addEventListener('click', function(e) {
			const hasLength = this.children.length >= 1;
			if (e.target.tagName.toLowerCase() === 'button' && hasLength) {
				e.preventDefault();
				e.target.parentElement.parentElement.remove();
			} else if (e.target.tagName.toLowerCase() === 'span' && hasLength) {
				e.preventDefault();
				e.target.parentElement.parentElement.parentElement.remove();
			}
		});
	}
	fillForm(data) {
		this.form.classList.remove('d-none');
		const formItems = data.data;
		this.resetForm();
		if (formItems) {
			const { customer, date, location, startTime, hours, additionalNotes } = formItems;
			this.form.customer.value = customer;
			this.form.date.valueAsDate = date.toDate();
			this.form.location.value = location;
			this.form.time.value = startTime;
			this.form.hours.value = hours;
			this.form.additionalNotes.value = additionalNotes;
			this.form.querySelector('.tools-form').innerHTML =
				'<label for="tools" class="font-weight-bold">Tools</label>';
			formItems.tools.forEach((tool, index) => {
				this.addTool(index, tool.name, tool.outToJob, tool.backToShop);
			});
			this.form.querySelector('.tasks-form').innerHTML =
				'<label for="tasks" class="font-weight-bold">Tasks</label>';
			formItems.tasks.forEach((task) => {
				this.addTask(task.name, task.completed, task.notes);
			});
			formItems.images.forEach((image) => {
				if (image && image.path) {
					storage.ref(image.path).getDownloadURL().then((url) => {
						this.addImage(url, image);
						expandTextAreas();
					});
				}
			});
		}
		expandTextAreas();
		currentWorkerSpan.innerText = data.worker;
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
			additionalNotes: additionalNotes.value.trim(),
			images: this.getItemsFromList('image')
		};
	}
	// Utilities
	getItemsFromList(type) {
		const items = [];
		switch (type) {
			case 'tool':
				this.form.querySelectorAll(`.${type}-input-group`).forEach((item) => {
					items.push({
						name: item.querySelector('input[type="text"]').value,
						outToJob: item.querySelector('.out-to-job').checked,
						backToShop: item.querySelector('.back-to-shop').checked
					});
				});
				break;
			case 'task':
				this.form.querySelectorAll(`.${type}-input-group`).forEach((item) => {
					items.push({
						name: item.querySelector('#task').value,
						completed: item.querySelector('.completed').checked,
						notes: item.nextElementSibling.value
					});
				});
				break;
			case 'image':
				this.form.querySelectorAll(`.image`).forEach((image) => {
					const path = image.querySelector('.image-preview').getAttribute('data-id');
					const notes = image.querySelector('.image-notes').value;
					if (path !== 'undefined') {
						items.push({
							path,
							notes
						});
					}
				});
				break;
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
                <textarea id="task" rows=1 class="form-control" placeholder="Task">${name}</textarea>
            </div>
            <textarea class="task-notes form-control ml-3 font-italic" rows=1 name="notes" placeholder="Notes">${notes}</textarea>

	    `;
		newTaskInput.querySelector('.completed').checked = completed;
		this.form.querySelector('.tasks-form').appendChild(newTaskInput);
	}
	addImage(source, image) {
		const imageContainer = document.createElement('div');
		imageContainer.classList.add('image', 'my-2');
		let imageNotes;
		let imagePath;
		if (image) {
			imageNotes = image.notes ? image.notes : '';
			imagePath = image.path ? image.path : '';
		} else {
			imageNotes = '';
			imagePath = '';
		}
		imageContainer.innerHTML = `
			<div class="image-input-group input-group">
				<button type="button" class="close mr-1" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				<input class="file-input" type="file" name="input-file" id="input-file" accept="image/*">
			</div>
			<div class="image-preview ml-3 mt-1 d-none" data-id=${imagePath}>
				<img src="${source}" alt="No Image Selected" class="img-thumbnail image-preview__image">
			</div>
			<textarea class="ml-3 form-control image-notes d-none" rows=1 placeholder="Image Notes">${imageNotes}</textarea>
		`;
		if (source) {
			imageContainer.querySelector('input').remove();
			imageContainer.querySelector('.image-preview').classList.remove('d-none');
			imageContainer.querySelector('.image-notes').classList.remove('d-none');
		}
		this.form.querySelector('.images-container').appendChild(imageContainer);
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
		this.form.querySelectorAll('.image').forEach((group) => {
			group.remove();
		});
	}
}
