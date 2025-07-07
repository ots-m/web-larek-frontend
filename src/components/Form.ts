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
	private selectedPaymentMethod: TPaymentMethod | null = null;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.addressInput = container.querySelector('input[name="address"]');
		this.submitButton = container.querySelector('.order__button');
		this.onlineButton = container.querySelector('button[name="card"]');
		this.offlineButton = container.querySelector('button[name="cash"]');
		this.errors = container.querySelector('.form__errors');

		this.addressInput.addEventListener('input', () => this.checkFormValidity());
		this.onlineButton.addEventListener('click', () =>
			this.selectPaymentMethod('online')
		);
		this.offlineButton.addEventListener('click', () =>
			this.selectPaymentMethod('offline')
		);
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('order:payment_submited', this.getFormData());
		});
	}

	private selectPaymentMethod(method: TPaymentMethod): void {
		this.selectedPaymentMethod = method;
		if (method === 'online') {
			this.onlineButton.classList.add('button_alt-active');
			this.offlineButton.classList.remove('button_alt-active');
		} else {
			this.offlineButton.classList.add('button_alt-active');
			this.onlineButton.classList.remove('button_alt-active');
		}
		this.checkFormValidity();
	}

	private isAddressFilled(): boolean {
		return this.addressInput.value.trim() !== '';
	}

	private isPaymentSelected(): boolean {
		return this.selectedPaymentMethod !== null;
	}

	private checkFormValidity(): void {
		const isValid = this.isAddressFilled() && this.isPaymentSelected();

		this.validate(isValid);

		if (isValid) {
			this.setErrors('');
		} else {
			if (!this.isAddressFilled()) {
				this.setErrors('Необходимо указать адрес.');
			} else if (!this.isPaymentSelected()) {
				this.setErrors('Необходимо выбрать способ оплаты.');
			}
		}
	}

	getFormData(): { address: string; payment: TPaymentMethod } {
		const payment = this.onlineButton.classList.contains('button_alt-active')
			? 'online'
			: 'offline';
		return {
			address: this.addressInput.value,
			payment,
		};
	}

	setErrors(value: string): void {
		this.setText(this.errors, value);
	}

	validate(value: boolean): void {
		this.submitButton.disabled = !value;
	}

	clear(): void {
		this.addressInput.value = '';
		this.setErrors('');
		this.validate(false);
		this.onlineButton.classList.remove('button_alt-active');
		this.offlineButton.classList.remove('button_alt-active');
		this.selectedPaymentMethod = null;
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
			this.onInputChange('email');
		});
		this.phoneInput.addEventListener('input', () => {
			this.onInputChange('phone');
		});
		this.submitButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('order:contacts_submited', this.getFormData());
		});
	}

	private checkFormValidity(): void {
		const isEmailValid =
			this.emailInput.validity.valid && this.emailInput.value.trim() !== '';
		const isPhoneValid = this.phoneInput.value.trim() !== '';

		if (isEmailValid && isPhoneValid) {
			this.setErrors('');
			this.validate(true);
		} else {
			this.validate(false);
		}
	}

	onInputChange<T>(field: keyof T): void {
		switch (field) {
			case 'email':
				if (
					!this.emailInput.validity.valid ||
					this.emailInput.value.trim() === ''
				) {
					this.setErrors('Необходимо ввести корректный email.');
					this.validate(false);
				} else {
					this.setErrors('');
					this.checkFormValidity();
				}
				break;
			case 'phone':
				if (this.phoneInput.value.trim() === '') {
					this.setErrors('Необходимо ввести телефон.');
					this.validate(false);
				} else {
					this.setErrors('');
					this.checkFormValidity();
				}
				break;
			default:
				this.checkFormValidity();
				break;
		}
	}

	getFormData(): { email: string; phone: string } {
		return {
			email: this.emailInput.value,
			phone: this.phoneInput.value,
		};
	}

	setErrors(value: string): void {
		this.setText(this.errors, value);
	}

	validate(value: boolean): void {
		this.submitButton.disabled = !value;
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
