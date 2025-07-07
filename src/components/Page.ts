import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IPage {
	setCatalog: void;
	setBasketCounter: void;
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected catalogContainer: HTMLElement;
	protected basketCounter: HTMLElement;
	protected basketButton: HTMLButtonElement;
	protected _wrapper: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);

		this.catalogContainer = ensureElement('.gallery', this.container);
		this.basketCounter = ensureElement(
			'.header__basket-counter',
			this.container
		);
		this.basketButton = ensureElement(
			'.header__basket',
			this.container
		) as HTMLButtonElement;

		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

		this.basketButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			events.emit('catalog:basket_open');
			events.emit('basket:changed');
		});
	}

	setCatalog(items: HTMLElement[]): void {
		this.catalogContainer.innerHTML = '';
		items.forEach((item) => {
			this.catalogContainer.appendChild(item);
		});
	}

	setBasketCounter(count: number): void {
		this.setText(this.basketCounter, count);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
