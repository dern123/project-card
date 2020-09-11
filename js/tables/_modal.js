export default class Modal {
	constructor(field) {
		this.render(field);
	}

	render(field) {
		this.main = document.getElementById('main');
		this.containerForm = document.createElement('div');
		this.modalContainer = document.createElement('form');
		const btnSave = document.createElement('button');
		const cencel = document.createElement('button');
		const btnContainer = document.createElement('div');
		cencel.type = 'button';
		btnSave.innerText = 'Save';

		this.containerForm.classList.add('container__autorization-form');
		this.modalContainer.className = 'form';
		this.modalContainer.classList.add('form__modal-card');
		btnContainer.classList.add('btn__form');
		btnSave.classList.add('btn');
		cencel.classList.add('btn');
		cencel.classList.add('btn__cencel');
		btnSave.id = 'btn__save';

		btnContainer.append(btnSave, cencel);
		this.main.append(this.containerForm);
		this.containerForm.append(this.modalContainer);
		this.modalContainer.append(field, btnContainer);

		cencel.addEventListener('click', this.cencel.bind(this));

		this.containerForm.addEventListener('click', event =>
			this.clickWindow(event)
		);
	}

	clickWindow(event) {
		event.preventDefault();
		if (event.target === this.containerForm) {
			this.containerForm.remove();
		}
	}

	cencel() {
		this.containerForm.remove();
	}
}
