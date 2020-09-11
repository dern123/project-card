import { default as PostData } from '../fetch/_fetchApi.js';
import { TABLES, BASE_PATH } from '../fetch/_fetchApi.js';
import { default as Modal } from '../tables/_modal.js';
import { default as Visit } from '../visits/visit.js';

export default class Form {
	constructor(visit) {
		this.doctor = visit.doctor || '---Choice doctor---';
		this.title = visit.title || '';
		this.discription = visit.description || '';
		this.priorety = visit.preority || '---Choice preority---';
	}

	createCardBtn() {
		this.createCard = document.querySelector('.btn__visit');

		this.createCard.addEventListener('click', () => {
			this.createModal();
		});
	}

	createModal(doctor) {
		this.createFormField();
		const selectDoc = document.getElementById('select-doctor');
		const obj = {};
		selectDoc.addEventListener('change', event => {
			if (event.target.value === 'Cardiologist' || doctor === 'Cardiologist') {
				const prependForm = document.querySelector('.form__modal');
				prependForm.remove();
				const form = document.createElement('div');
				form.className = 'form__modal';
				this.div.append(form);
				const specDoc = new FormCardiologist(obj);
				specDoc.render(form);
			} else if (event.target.value === 'Dentist' || doctor === 'Dentist') {
				const prependForm = document.querySelector('.form__modal');
				prependForm.remove();
				const form = document.createElement('div');
				form.className = 'form__modal';
				this.div.append(form);
				const specDoc = new FormDentist(obj);
				specDoc.render(form);
			} else {
				const prependForm = document.querySelector('.form__modal');
				prependForm.remove();
				const form = document.createElement('div');
				form.className = 'form__modal';
				this.div.append(form);
				const specDoc = new FormTherapist(obj);
				specDoc.render(form);
			}
		});

		const btnSave = document.getElementById('btn__save');
		btnSave.addEventListener('click', () => this.createCardVisit());
	}

	async createCardVisit() {
		const fieldData = this.serialize();

		const response = await PostData(`${BASE_PATH}${TABLES.cards}`, {
			method: 'POST',
			body: JSON.stringify({ fieldData }),
			headers: { Authorization: 'Bearer ' + localStorage.getItem('ipToken') },
		});
		const data = await response.json();
		this.modals.cencel();
		const headersFieldCard = document.querySelector('.headers-title');
		headersFieldCard.classList.add('dn');
		const visit = new Visit();
		visit.createElement(data);
	}

	serialize() {
		const prependForm = document.querySelectorAll('.enter__field');
		const data = {};
		prependForm.forEach(item => (data[item.name] = item.value));

		return data;
	}

	createFormField() {
		this.div = document.createElement('div');
		const form = document.createElement('div');
		form.className = 'form__modal';
		this.modals = new Modal(this.div);
		this.div.append(this.createSelectDoctor(), form);
	}

	render(form) {
		const targetVisit = document.createElement('input');
		const shortDescription = document.createElement('textarea');
		const labelTargetVisit = document.createElement('label');
		const labelShortDescription = document.createElement('label');
		const labelPreority = document.createElement('label');

		labelTargetVisit.innerText = 'Enter target visit';
		labelShortDescription.innerText = 'Enter short description visit';
		labelPreority.innerText = 'Choose preority';
		targetVisit.placeholder = 'title';
		shortDescription.placeholder = 'short description';

		targetVisit.value = this.title;
		shortDescription.value = this.discription;

		targetVisit.name = 'title';
		shortDescription.name = 'description';

		targetVisit.classList.add('enter__field');
		shortDescription.classList.add('enter__field');

		form.append(
			labelTargetVisit,
			targetVisit,
			labelShortDescription,
			shortDescription,
			labelPreority,
			this.urgencySelect()
		);
	}

	createSelectDoctor() {
		this.choiceDoctor = document.createElement('select');
		this.choiceDoctor.id = 'select-doctor';
		this.choiceDoctor.classList.add('enter__field');
		this.choiceDoctor.name = 'doctor';
		const firstOption = new Option(
			'---Choice doctor---',
			'---Choice doctor---'
		);
		const Cardiologist = new Option('Cardiologist', 'Cardiologist');
		const Dentist = new Option('Dentist', 'Dentist');
		const Therapist = new Option('Therapist', 'Therapist');

		this.choiceDoctor.append(firstOption, Cardiologist, Dentist, Therapist);
		return this.choiceDoctor;
	}

	urgencySelect() {
		this.choiceUrgency = document.createElement('select');

		this.choiceUrgency.id = 'choice-urgency';
		this.choiceUrgency.classList.add('enter__field');
		this.choiceUrgency.name = 'preority';
		const firstOption = new Option(
			'---Choice preority---',
			'---Choice preority---'
		);

		const low = document.createElement('option');
		const middle = document.createElement('option');
		const hard = document.createElement('option');
		low.innerText = 'low';
		middle.innerText = 'middle';
		hard.innerText = 'hard';
		low.value = 'low';
		middle.value = 'middle';
		hard.value = 'hard';
		this.choiceUrgency.append(firstOption, low, middle, hard);
		console.dir(this.choiceUrgency);
		const urgency = Array.from(this.choiceUrgency);
		urgency.forEach(item => {
			if (this.priorety === item.value) {
				console.log();
				this.choiceUrgency.value = item.value;
			}
		});
		return this.choiceUrgency;
		// if (this.priorety === firstOption.value) {
		// 	this.choiceUrgency.append(firstOption, low, middle, hard);
		// 	return this.choiceUrgency;
		// } else if (this.priorety === low.value) {
		// 	this.choiceUrgency.append(low, firstOption, middle, hard);
		// 	return this.choiceUrgency;
		// } else if (this.priorety === middle.value) {
		// 	this.choiceUrgency.append(middle, firstOption, low, hard);
		// 	return this.choiceUrgency;
		// } else if (this.priorety === hard.value) {
		// 	this.choiceUrgency.append(hard, firstOption, low, middle);
		// 	return this.choiceUrgency;
		// }
		// если селект масив, то если приорити валью равно какойто опшин, он становится на позицию 0 элемента
	}
}

export class FormDentist extends Form {
	//  дата последнего посещения, ФИО.
	constructor(visit) {
		super(visit);
		this.dateLastVisit = visit.date_last_visit || '';
		this.firstName = visit.first_name || '';
		this.lastName = visit.last_name || '';
		this.nameFather = visit.name_father || '';
	}

	render(form) {
		super.render(form);
		const idSelectPreorety = document.querySelector('#choice-urgency');
		this.container = document.createElement('div');
		const dateLastVisit = document.createElement('input');
		const firstName = document.createElement('input');
		const lastName = document.createElement('input');
		const nameFather = document.createElement('input');
		const labelВateLastVisit = document.createElement('label');
		const labelName = document.createElement('label');

		dateLastVisit.name = 'date_last_visit';
		firstName.name = 'first_name';
		lastName.name = 'last_name';
		nameFather.name = 'name_father';

		dateLastVisit.value = this.dateLastVisit;
		firstName.value = this.firstName;
		lastName.value = this.lastName;
		nameFather.value = this.nameFather;

		labelВateLastVisit.innerText = 'Choose your last date visit';
		labelName.innerText = 'Enter your full name';

		dateLastVisit.classList.add('enter__field');
		firstName.classList.add('enter__field');
		lastName.classList.add('enter__field');
		nameFather.classList.add('enter__field');

		firstName.placeholder = 'Enter your name';
		lastName.placeholder = 'Enter your last name';
		nameFather.placeholder = 'Enter your father name';

		dateLastVisit.type = 'date';
		this.container.append(
			labelВateLastVisit,
			dateLastVisit,
			labelName,
			firstName,
			lastName,
			nameFather
		);
		idSelectPreorety.insertAdjacentElement('afterend', this.container);
		return {
			labelВateLastVisit,
			dateLastVisit,
			labelName,
			firstName,
			lastName,
			nameFather,
		};
	}
}

export class FormCardiologist extends Form {
	// обычное давление, индекс массы тела, перенесенные заболевания сердечно-сосудистой системы, возраст, ФИО.
	constructor(visit) {
		super(visit);
		this.pressure = visit.pressure || '';
		this.indexWeightBody = visit.index_weight_body || '';
		this.diseasesCardiovascularSystem =
			visit.diseases_cardiovascular_system || '';
		this.age = visit.age || '';
		this.firstName = visit.first_name || '';
		this.lastName = visit.last_name || '';
		this.nameFather = visit.name_father || '';
	}

	render(form) {
		super.render(form);
		this.container = document.createElement('div');
		const idSelectPreorety = document.querySelector('#choice-urgency');

		const pressure = document.createElement('input');
		const indexWeightBody = document.createElement('input');
		const diseasesCardiovascularSystem = document.createElement('textarea');
		const age = document.createElement('input');
		const firstName = document.createElement('input');
		const lastName = document.createElement('input');
		const nameFather = document.createElement('input');
		const labelAge = document.createElement('label');
		const labelName = document.createElement('label');
		const labelPressure = document.createElement('label');
		const labelIndexWeightBody = document.createElement('label');
		const labelDiseasesCardiovascularSystem = document.createElement('label');

		pressure.name = 'pressure';
		indexWeightBody.name = 'index_weight_body';
		diseasesCardiovascularSystem.name = 'diseases_cardiovascular_system';
		age.name = 'age';
		firstName.name = 'first_name';
		lastName.name = 'last_name';
		nameFather.name = 'name_father';

		pressure.value = this.pressure;
		indexWeightBody.value = this.indexWeightBody;
		diseasesCardiovascularSystem.value = this.diseasesCardiovascularSystem;
		age.value = this.age;
		firstName.value = this.firstName;
		lastName.value = this.lastName;
		nameFather.value = this.nameFather;

		diseasesCardiovascularSystem.setAttribute('cols', 35);
		diseasesCardiovascularSystem.setAttribute('rows', 5);

		labelAge.innerText = 'Enter your age';
		labelName.innerText = 'Enter your full name';
		labelPressure.innerText = 'Enter your just pressure';
		labelIndexWeightBody.innerText = 'Enter index weight body';
		labelDiseasesCardiovascularSystem.innerText =
			'Enter past diseases of the cardiovascular system';

		pressure.classList.add('enter__field');
		indexWeightBody.classList.add('enter__field');
		diseasesCardiovascularSystem.classList.add('enter__field');
		age.classList.add('enter__field');
		firstName.classList.add('enter__field');
		lastName.classList.add('enter__field');
		nameFather.classList.add('enter__field');

		pressure.placeholder = 'Enter your just pressure';
		indexWeightBody.placeholder = 'Enter index weight body';
		diseasesCardiovascularSystem.placeholder =
			'Enter past diseases of the cardiovascular system';
		age.placeholder = 'Your age';
		firstName.placeholder = 'Enter your name';
		lastName.placeholder = 'Enter your last name';
		nameFather.placeholder = 'Enter your father name';

		this.container.append(
			labelPressure,
			pressure,
			labelIndexWeightBody,
			indexWeightBody,
			labelDiseasesCardiovascularSystem,
			diseasesCardiovascularSystem,
			labelAge,
			age,
			labelName,
			firstName,
			lastName,
			nameFather
		);

		idSelectPreorety.insertAdjacentElement('afterend', this.container);
	}
}
export class FormTherapist extends Form {
	// возраст, ФИО.
	constructor(visit) {
		super(visit);
		this.age = visit.age || '';
		this.firstName = visit.first_name || '';
		this.lastName = visit.last_name || '';
		this.nameFather = visit.name_father || '';
	}

	render(form) {
		super.render(form);
		this.container = document.createElement('div');
		const idSelectPreorety = document.querySelector('#choice-urgency');

		const age = document.createElement('input');
		const firstName = document.createElement('input');
		const lastName = document.createElement('input');
		const nameFather = document.createElement('input');
		const labelAge = document.createElement('label');
		const labelName = document.createElement('label');

		labelAge.innerText = 'Enter your age';
		labelName.innerText = 'Enter your full name';

		age.value = this.age;
		firstName.value = this.firstName;
		lastName.value = this.lastName;
		nameFather.value = this.nameFather;

		age.name = 'age';
		firstName.name = 'first_name';
		lastName.name = 'last_name';
		nameFather.name = 'name_father';

		age.classList.add('enter__field');
		firstName.classList.add('enter__field');
		lastName.classList.add('enter__field');
		nameFather.classList.add('enter__field');

		age.placeholder = 'Your age';
		firstName.placeholder = 'Enter your name';
		lastName.placeholder = 'Enter your last name';
		nameFather.placeholder = 'Enter your father name';

		this.container.append(
			labelAge,
			age,
			labelName,
			firstName,
			lastName,
			nameFather
		);
		idSelectPreorety.insertAdjacentElement('afterend', this.container);
	}
}
