import { Component } from './base/Component';
import { IEvents } from './base/events';

export interface ISuccess {
	totalPrice: void;
}

export class Success extends Component<ISuccess> {
	protected totalElement: HTMLElement;
	protected successButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this.totalElement = container.querySelector('.order-success__description');
		this.successButton = container.querySelector('.order-success__close');

		this.successButton.addEventListener('click', (evt) => {
			events.emit('order:finally');
		});
	}

	totalPrice(total: number): void {
		this.setText(this.totalElement, `Списано ${total} синапсов`);
	}
}
