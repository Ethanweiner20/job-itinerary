dateInput.valueAsDate = new Date();

// ADD ALL THIS TO DAYVIEW CLASS
let toolOptions = [
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
	'Post Hole Diggers',
	'Scythe'
];

const getToolHTML = (toolNumber, name) => {
	let selectInnerHTML = '';
	toolOptions.forEach((tool, index) => {
		selectInnerHTML += `<option value="${tool}">${tool}</option>`;
	});
	return `
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
};

const addTool = (toolNumber, name, outToJob, backToShop) => {
	const newToolInput = document.createElement('div');
	newToolInput.classList.add('tool-input-group', 'input-group', 'my-1');
	newToolInput.innerHTML = getToolHTML(toolNumber, name, outToJob, backToShop);
	newToolInput.querySelector('.out-to-job').checked = outToJob;
	newToolInput.querySelector('.back-to-shop').checked = backToShop;
	toolsForm.appendChild(newToolInput);
};

newToolButton.addEventListener('click', (e) => {
	e.preventDefault();
	const toolNumber = document.querySelectorAll('.tool-input-group').length;
	addTool(toolNumber, '');
	document.querySelector('.tools-form').lastElementChild.children[1].focus();
});

toolsForm.addEventListener('keydown', (e) => {
	if (e.target.nodeName === 'INPUT' && e.key === 'Enter') {
		e.preventDefault();
		const toolNumber = document.querySelectorAll('.tool-input-group').length;
		addTool(toolNumber, '');
		e.target.parentElement.nextElementSibling.children[1].focus();
	}
});

const addTask = (name, completed, notes) => {
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
	tasksForm.appendChild(newTaskInput);
};

newTaskButton.addEventListener('click', (e) => {
	e.preventDefault();
	addTask('', false, '');
	document.querySelector('.tasks-form').lastElementChild.firstElementChild.lastElementChild.focus();
});

tasksForm.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		e.preventDefault();
		if (e.target.tagName.toLowerCase() === 'textarea') {
			if (!e.target.parentElement.nextElementSibling) {
				addTask('', false, '');
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

toolsForm.addEventListener('change', (e) => {
	if (e.target.tagName.toLowerCase() === 'select') {
		const toolOption = e.target.value;
		e.target.parentElement.parentElement.querySelector('input[type="text"]').value = toolOption;
	}
});

toolsForm.addEventListener('click', (e) => {
	const length = toolsForm.children.length > 2;
	if (e.target.tagName.toLowerCase() === 'button' && length) {
		e.preventDefault();
		e.target.parentElement.remove();
	} else if (e.target.tagName.toLowerCase() === 'span' && length) {
		e.preventDefault();
		e.target.parentElement.parentElement.remove();
	}
});

tasksForm.addEventListener('click', (e) => {
	const length = tasksForm.children.length > 2;
	if (e.target.tagName.toLowerCase() === 'button' && length) {
		e.preventDefault();
		e.target.parentElement.parentElement.remove();
	} else if (e.target.tagName.toLowerCase() === 'span' && length) {
		e.preventDefault();
		e.target.parentElement.parentElement.parentElement.remove();
	}
});

tasksForm.addEventListener('click', (e) => {
	if (e.target.classList.contains('close') && tasksForm.children.length > 2) {
		e.target.parentElement.parentElement.remove();
	}
});

// Archives Tab

const searchForm = document.querySelector('#search-form');
const searchFilter = document.querySelector('#search-filter');

searchFilter.addEventListener('change', (e) => {
	searchForm.search.value = '';
	if (e.target.value === 'Date') {
		searchForm.search.type = 'date';
	} else {
		searchForm.search.type = 'text';
	}
});

// Tab Functionality

document.querySelector('#new-day-tab').addEventListener('click', () => {
	form.classList.remove('d-none');
	resetForm();
	document.querySelector('#submit').classList.remove('d-none');
	document.querySelector('#update').classList.add('d-none');
	document.querySelector('#reset').classList.remove('d-none');
	showDay().then(() => {
		Spinner.hide();
	});
});

document.querySelector('#archives-tab').addEventListener('click', () => {
	form.classList.add('d-none');
	document.querySelector('#submit').classList.add('d-none');
	document.querySelector('#reset').classList.add('d-none');
	document.querySelector('.list-group').classList.remove('d-none');
});

const resetForm = () => {
	form.reset();
	dateInput.valueAsDate = new Date();
	document.querySelectorAll('.tool-input-group').forEach((group) => {
		group.remove();
	});
	document.querySelectorAll('.task-input-group').forEach((group) => {
		group.remove();
	});
	document.querySelectorAll('.task-notes').forEach((group) => {
		group.remove();
	});
};

resetButton.addEventListener('click', (e) => {
	resetForm();
});
