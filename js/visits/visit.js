import { default as PutData, DeleteData } from '../fetch/_fetchApi.js';
import { TABLES, BASE_PATH } from '../fetch/_fetchApi.js';
import { default as Modal } from '../tables/_modal.js';

import {
	default as Form,
	FormDentist,
	FormCardiologist,
	FormTherapist,
} from '../tables/_formCard.js';

export default class Visit {
	constructor() {}

	editVisit(card) {
		const arr = new Array(card.container.children);

		const objectCard = this.serialize(arr);
		const cardId = this.container.id;

		this.form = new Form(objectCard);

		this.createFormFieldRedact();
		const save = document.getElementById('btn__save');
		if (objectCard.doctor === 'Cardiologist') {
			const form = document.createElement('div');
			this.div.append(form);
			const doc = new FormCardiologist(objectCard);
			doc.render(form);
		} else if (objectCard.doctor === 'Dentist') {
			const formdentist = document.createElement('div');
			this.div.append(formdentist);
			const doc = new FormDentist(objectCard);
			doc.render(formdentist);
		} else {
			const form = document.createElement('div');
			this.div.append(form);
			const doc = new FormTherapist(objectCard);
			doc.render(form);
		}

		save.addEventListener('click', () => this.onSave(cardId));
	}

	serializeRedact() {
		const prependForm = document.querySelectorAll('.enter__field');
		const data = {};
		prependForm.forEach(item => (data[item.name] = item.value));

		return data;
	}

	async onSave(cardId) {
		const card = this.serializeRedact();
		const response = await PutData(`${BASE_PATH}${TABLES.cards}/${cardId}`, {
			method: 'PUT',
			body: JSON.stringify(card),
			headers: { Authorization: 'Bearer ' + localStorage.getItem('ipToken') },
		});
		const data = await response.json();
		this.renderElement(data, cardId);
		this.modals.cencel();
	}

	createFormFieldRedact() {
		this.div = document.createElement('div');
		const form = document.createElement('div');
		form.className = 'form__modal';
		this.modals = new Modal(this.div);
		this.div.append(this.form.createSelectDoctor(), form);
	}

	serialize(lineCard) {
		const data = {};

		for (let i = 0; i < lineCard[0].length; i++) {
			data[i] = lineCard[0][i].textContent;
		}
		const dataCorrect = {};
		for (let [key, value] of Object.entries(data)) {
			const newKey = value.split(': ');
			key = newKey[0];
			value = newKey[1];
			dataCorrect[key] = value;
		}
		return dataCorrect;
	}

	renderElement(result, cardId) {
		const container = document.getElementById(cardId);
		const bntBox = container.querySelector('.container__btn');
		const line = container.querySelectorAll('.container__card--line');
		bntBox.remove();

		line.forEach(item => {
			item.remove();
		});

		for (let [key, value] of Object.entries(result)) {
			const el = document.createElement('p');
			const elTitle = document.createElement('span');

			if (value === 'Cardiologist' || 'Dentist' || 'Therapist') {
				el.dataset[key] = value;
			}
			elTitle.textContent = `${key}: `;
			elTitle.classList.add('container__card--title-line');
			el.classList.add('container__card--line');

			container.append(el, this.containerBtn);
			el.append(elTitle, value);
		}
	}

	createElement(result) {
		this.render();
		for (let [key, value] of Object.entries(result)) {
			if (key === 'id') {
				this.container.id = value;
			} else {
				for (let [key, content] of Object.entries(value)) {
					const elTitle = document.createElement('span');
					const el = document.createElement('p');
					if (content === 'Cardiologist' || 'Dentist' || 'Therapist') {
						el.dataset[key] = content;
					}
					elTitle.textContent = `${key}: `;
					elTitle.classList.add('container__card--title-line');
					el.classList.add('container__card--line');

					this.container.append(el, this.containerBtn);
					el.append(elTitle, content);
				}
			}
		}
	}

	serializeFilter(card) {
		this.render();
		for (let [key, content] of Object.entries(card)) {
			const elTitle = document.createElement('span');
			const el = document.createElement('p');
			if (content === 'Cardiologist' || 'Dentist' || 'Therapist') {
				el.dataset[key] = content;
			}
			elTitle.textContent = `${key}: `;
			elTitle.classList.add('container__card--title-line');
			el.classList.add('container__card--line');

			this.container.append(el, this.containerBtn);
			el.append(elTitle, content);
		}
	}

	render() {
		const fieldCard = document.querySelector('.field__card');
		this.container = document.createElement('div');
		const btnEdit = document.createElement('button');
		const btnRemove = document.createElement('button');
		const btnShowMore = document.createElement('button');

		this.containerBtn = document.createElement('div');
		btnShowMore.innerText = 'Show more';
		btnEdit.innerText = 'Edit';
		btnRemove.innerText = 'Remove';

		this.container.classList.add('container__card');
		this.containerBtn.classList.add('container__btn');
		btnRemove.classList.add('btn', 'btn__remove');
		btnEdit.classList.add('btn', 'btn__edit');
		btnShowMore.classList.add('btn', 'btn__show-more');

		btnShowMore.addEventListener('click', event => this.showMoreCard());
		btnEdit.addEventListener('click', this.editVisit.bind(this, this));
		btnRemove.addEventListener('click', event => this.removeCard(this));
		fieldCard.append(this.container);
		this.containerBtn.append(btnShowMore, btnEdit, btnRemove);
	}

	async removeCard(card) {
		const arr = new Array(card.container.children);

		const objectCard = this.serialize(arr);
		const cardId = this.container.id;
		const response = await DeleteData(`${BASE_PATH}${TABLES.cards}/${cardId}`, {
			method: 'DELETE',
			headers: { Authorization: 'Bearer ' + localStorage.getItem('ipToken') },
		});
		this.container.remove();
	}
}
