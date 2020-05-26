class ListUI {
	constructor(list) {
		this.list = list;
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
	}
	renderList(docs) {
		this.list.innerHTML = '';
		docs.forEach((doc) => {
			this.addListItem(doc);
		});
	}
	addListItem(doc) {
		const data = doc.data().data;
		const id = doc.id;
		if (data) {
			this.list.innerHTML += `
            	<a href="#" data-id="${id}" class="data-link list-group-item list-group-item-action">
					<button type="button" class="exit close mr-1 d-inline-block" aria-label="Close">
						<span class="exit" aria-hidden="true">&times;</span>
					</button>
					<h6 data-id="${id}" class="data-link">${data.date.toDate().toDateString()}</h6>
					<ul data-id="${id}" class="data-link list-unstyled">
						<li data-id="${id}" class="data-link text-secondary d-block d-lg-inline">Customer: <span data-id="${id}" class="data-link text-dark">${data.customer}</span></li>
						<span data-id="${id}" class="data-link d-none d-lg-inline text-black"> | </span>
						<li data-id="${id}" class="data-link text-secondary d-block d-lg-inline">Location: <span data-id="${id}" class="data-link text-dark">${data.location}</span></li>
						<span data-id="${id}" class="data-link d-none d-lg-inline text-black"> | </span>
						<li data-id="${id}" class="data-link text-secondary d-block d-lg-inline">Workers: <span data-id="${id}" class="data-link text-dark">${doc.data()
				.worker}</span></li>
						<span data-id="${id}" class="data-link d-none d-lg-inline text-black"> | </span>
						<li data-id="${id}" class="data-link text-secondary d-block d-lg-inline">Hours: <span data-id="${id}" class="data-link text-dark">${data.hours}</span></li>
					</ul>
					<p data-id="${id}" class="data-link text-primary font-italic">Click to see full day</p>
            	</a>
        	`;
		}
	}
}
