import { IProduct, IOrder, IBasketIndex } from '../types';
import { IEvents } from './base/events';

export class AppState {
	protected _catalog: IProduct[];
	protected _basket: IBasketIndex[];
	protected _order: Partial<IOrder>;

	constructor(protected events: IEvents) {
		this._catalog = [];
		this._basket = [];
		this._order = {};
	}

	addToBasket(item: IBasketIndex): void {
		this._basket.push(item);
	}

	removeFromBasket(id: string): void {
		this._basket = this.basket.filter((product) => product.id !== id);
	}

	isInBasket(id: string): boolean {
		return this._basket.some((item) => item.id === id);
	}

	get basket(): IBasketIndex[] {
		return this._basket;
	}

	clearBasket(): void {
		this._basket = [];
		this.events.emit('basket:changed');
	}

	getBasketTotal(): number {
		return this._basket.reduce((total, product) => total + product.price, 0);
	}

	getBasketCount(): number {
		return this._basket.length;
	}

	set catalog(items: IProduct[]) {
		this._catalog = items;
		this.events.emit('catalog:loaded');
	}

	get catalog(): IProduct[] {
		return this._catalog;
	}

	set order(data: Partial<IOrder>) {
		Object.assign(this._order, data ?? {});
	}

	get order() {
		return this._order;
	}

	clearOrder(): void {
		this._order = {};
	}

	changeOrder(key: string, value: any): void {
		this._order = { ...this._order, [key]: value };
		this.validate();
	}

	private validate(): void {
		const hasAddressOrPayment =
			this._order.address !== undefined || this._order.payment !== undefined;
		const hasEmailOrPhone =
			this._order.email !== undefined || this._order.phone !== undefined;

		if (hasAddressOrPayment && !hasEmailOrPhone) {
			const errors = this.validateAddressForm();
			this.events.emit('address_form:errors:show', errors);
		} else if (hasEmailOrPhone) {
			const errors = this.validateContactsForm();
			this.events.emit('contacts_form:errors:show', errors);
		}
	}

	private validateAddressForm(): { [key: string]: string } {
		const errors: { [key: string]: string } = {};

		if (!this._order.address || this._order.address.trim() === '') {
			errors['address'] = 'Необходимо указать адрес.';
		}
		if (!this._order.payment) {
			errors['payment'] = 'Необходимо выбрать способ оплаты.';
		}

		return errors;
	}

	private validateContactsForm(): { [key: string]: string } {
		const errors: { [key: string]: string } = {};

		if (
			!this._order.email ||
			this._order.email.trim() === '' ||
			!this.isValidEmail(this._order.email)
		) {
			errors['email'] = 'Необходимо указать почту.';
		}
		if (
			!this._order.phone ||
			this._order.phone.trim() === ''
		) {
			errors['phone'] = 'Необходимо указать корректный телефон.';
		} else if(!this.isValidPhone(this._order.phone)) {
			errors['phone'] = 'Телефон должен состоять из цифр.';
		}

		return errors;
	}

	private isValidEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	private isValidPhone(phone: string): boolean {
		const phoneRegex = /^\+?[0-9]/;
		return phoneRegex.test(phone);
	}
}
