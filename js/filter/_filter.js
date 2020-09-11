import { default as getData } from '../fetch/_fetchApi.js';
import { TABLES, BASE_PATH } from '../fetch/_fetchApi.js';
import { default as Visit } from '../visits/visit.js';

export const btnSearch = document.getElementById('btn-search');
btnSearch.addEventListener('click', e => onSearch(e));
async function onSearch(e) {
	const response = await getData(`${BASE_PATH}${TABLES.cards}`, {
		method: 'GET',
		headers: { Authorization: 'Bearer ' + localStorage.getItem('ipToken') },
	});
	const data = await response.json();
	document.getElementsByClassName('field__card')[0].innerHTML = '';
	const statusSearch = document.querySelector('.container__filter-search')
		.value;
	const statusPreority = document.getElementById('preority-filter').value;
	const statusDoctor = document.getElementById('doctor-filter').value;
	const newData = data.filter(item => {
		let { fieldData, id } = item;

		let { preority, doctor, title, description } = fieldData;
		if (
			(statusPreority === preority || statusPreority === 'all') &&
			(statusDoctor === doctor || statusDoctor === 'all') &&
			(title.includes(statusSearch) ||
				!statusSearch ||
				description.includes(statusSearch))
		) {
			const visit = new Visit();
			visit.serializeFilter(fieldData);
		}
	});
}
