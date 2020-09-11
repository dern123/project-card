const TABLES = {
	login: 'login',
	cards: 'cards',
};

const BASE_PATH = 'http://cards.danit.com.ua/';

export { TABLES, BASE_PATH };

export default function PostData(url, options = {}) {
	return fetch(url, options);
}
export function GetData(url, options = {}) {
	return fetch(url, options);
}
export function PutData(url, options) {
	return fetch(url, options);
}
export function DeleteData(url, options) {
	return fetch(url, options);
}
;

import { default as Form } from './tables/_formCard.js';
import { default as Modal } from './tables/_modal.js';
import { default as Visit } from './visits/visit.js';
import { btnSearch } from './filter/_filter.js';

// import { BASE_PATH, TABLES } from './fetch/_fetchApi.js';
// import { GetData } from './fetch/_fetchApi.js';

class Sign {
	constructor() {
		btnSearch;
		const fieldCard = document.querySelector('.field__card');
		this.clickSignBtn();
	}

	clickSignBtn() {
		this.btnSign = document.querySelector('.btn__sign');
		this.btnSign.addEventListener('click', () => this.createFormEntrance());
	}

	createFormEntrance() {
		const form = document.createElement('div');

		const modal = new Modal(form);

		const inputEmail = document.createElement('input');
		const inputPassword = document.createElement('input');

		// ctrl + alt + l console.log("Sign -> createFormEntrance -> inputPassword", inputPassword)

		this.btnSignIn = document.getElementById('btn__save');

		inputEmail.placeholder = 'Enter email';
		inputPassword.placeholder = 'Enter password';

		inputEmail.classList.add('enter__field');
		inputPassword.classList.add('enter__field');

		inputEmail.id = 'emailSign';
		inputPassword.id = 'passwordSign';

		form.append(inputEmail, inputPassword);

		this.btnSignIn.addEventListener('click', event => {
			event.preventDefault();
			this.field();
			const createCardBtn = document.querySelector('.btn__visit');
			this.btnSign.remove();
			modal.cencel();
			const content = {};
			createCardBtn.style.display = 'inline-block';
			const formModal = new Form(content);
			formModal.createCardBtn();
		});
	}

	field() {
		const inputMail = document.getElementById('emailSign').value;
		const inputPass = document.getElementById('passwordSign').value;

		const data = {
			email: inputMail,
			password: inputPass,
		};
		this.fetchData(data);
	}

	async fetchData(data) {
		const response = await PostData(`${BASE_PATH}${TABLES.login}`, {
			method: 'POST',
			body: JSON.stringify({
				email: data.email,
				password: data.password,
			}),
		});
		const { status, token } = await response.json();

		localStorage.setItem('ipToken', token);

		const res = await GetData(`${BASE_PATH}${TABLES.cards}`, {
			method: 'GET',
			headers: { Authorization: 'Bearer ' + localStorage.getItem('ipToken') },
		});
		const dataCard = await res.json();

		const arrData = Array.from(dataCard);
		arrData.forEach(item => {
			const visit = new Visit();
			visit.createElement(item);
		});
	}
}
const sign = new Sign();
