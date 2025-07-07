import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IBasketView {
	renderBasket: void;
	setDisabled: void;
}

export class BasketView extends Component<IBasketView> {
	protected basketContainer: HTMLElement;
	protected totalElement: HTMLElement;
	protected basketButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this.basketContainer = container.querySelector(
			'.basket__list'
		) as HTMLElement;
		this.totalElement = container.querySelector(
			'.basket__price'
		) as HTMLElement;
		this.basketButton = container.querySelector(
			'.basket__button'
		) as HTMLButtonElement;

		this.basketButton.addEventListener('click', (evt) => {
			this.events.emit('order:submited');
		});
	}

	renderBasket(items: HTMLElement[], total: number): void {
		this.basketContainer.replaceChildren(...items);
		this.setPrice(this.totalElement, total);
	}

	setButtonDisabled(state: boolean): void {
		this.basketButton.disabled = state;
	}
}
