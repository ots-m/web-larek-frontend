import { TPaymentMethod } from '../types';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IFormState {
	validate: boolean;
	setErrors: string[];
}

export class AddressForm extends Component<IFormState> {
	protected errors: HTMLElement;
	protected addressInput: HTMLInputElement;
	protected submitButton: HTMLButtonElement;
	protected onlineButton: HTMLElement;
	protected offlineButton: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.addressInput = container.querySelector('input[name="address"]');
		this.submitButton = container.querySelector('.order__button');
		this.onlineButton = container.querySelector('button[name="card"]');
		this.offlineButton = container.querySelector('button[name="cash"]');
		this.errors = container.querySelector('.form__errors');
		this.addressInput.addEventListener('input', () => {
			this.events.emit('order:change', {
				key: this.addressInput.name,
				value: this.addressInput.value,
			});
		});

		this.onlineButton.addEventListener('click', () => {
			this.events.emit('order:change', { key: 'payment', value: 'online' });
			this.selectPaymentMethod('online');
		});

		this.offlineButton.addEventListener('click', () => {
			this.events.emit('order:change', { key: 'payment', value: 'offline' });
			this.selectPaymentMethod('offline');
		});
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('order:payment_submited');
		});
	}

	private selectPaymentMethod(method: TPaymentMethod): void {
		if (method === 'online') {
			this.onlineButton.classList.add('button_alt-active');
			this.offlineButton.classList.remove('button_alt-active');
		} else {
			this.offlineButton.classList.add('button_alt-active');
			this.onlineButton.classList.remove('button_alt-active');
		}
	}

	setErrors(value: string): void {
		this.setText(this.errors, value);
	}

	validate(value: boolean): void {
		this.submitButton.disabled = !value;
	}

	validateForm(errors: { [key: string]: string }): void {
		const hasErrors = Object.keys(errors).length > 0;
		this.validate(!hasErrors);

		const firstError = Object.values(errors)[0] || '';
		this.setErrors(firstError);
	}

	clear(): void {
		this.addressInput.value = '';
		this.setErrors('');
		this.validate(false);
		this.onlineButton.classList.remove('button_alt-active');
		this.offlineButton.classList.remove('button_alt-active');
	}

	render(): HTMLElement {
		return this.container;
	}
}

export class ContactForm extends Component<IFormState> {
	protected errors: HTMLElement;
	protected submitButton: HTMLButtonElement;
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this.submitButton = container.querySelector('.button');
		this.phoneInput = container.querySelector('input[name="phone"]');
		this.emailInput = container.querySelector('input[name="email"]');
		this.errors = container.querySelector('.form__errors');

		this.emailInput.addEventListener('input', () => {
			this.events.emit('order:change', {
				key: this.emailInput.name,
				value: this.emailInput.value,
			});
		});

		this.phoneInput.addEventListener('input', () => {
			this.events.emit('order:change', {
				key: this.phoneInput.name,
				value: this.phoneInput.value,
			});
		});
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('order:contacts_submited');
		});
	}

	setErrors(value: string): void {
		this.setText(this.errors, value);
	}

	validate(value: boolean): void {
		this.submitButton.disabled = !value;
	}

	validateForm(errors: { [key: string]: string }): void {
		const hasErrors = Object.keys(errors).length > 0;
		this.validate(!hasErrors);

		const firstError = Object.values(errors)[0] || '';
		this.setErrors(firstError);
	}

	clear(): void {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.setErrors('');
		this.validate(false);
	}

	render(): HTMLElement {
		return this.container;
	}
}
