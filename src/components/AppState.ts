import { IProduct, IOrder, IBasketIndex } from '../types';
import { IEvents } from './base/events';

export class AppState {
	protected _catalog: IProduct[];
	protected _basket: IBasketIndex[];
	protected _order: object;

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
}
