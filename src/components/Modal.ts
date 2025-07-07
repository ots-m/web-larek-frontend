import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IModal {
	open(content: HTMLElement): void;
	close(): void;
	setContent(content: HTMLElement): void;
}

export class Modal extends Component<IModal> {
	protected modalContent: HTMLElement;
	protected closeButton: HTMLButtonElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.modalContent = ensureElement<HTMLElement>(
			'.modal__content',
			container
		);

		this.closeButton.addEventListener('click', (evt) => {
			this.close();
		});

		document.addEventListener('keydown', (evt) => {
			if (
				evt.key === 'Escape' &&
				this.container.classList.contains('modal_active')
			) {
				this.close();
			}
		});

		this.container.addEventListener('click', (evt) => {
			if (evt.target === this.container) {
				this.close();
			}
		});
	}

	open(content: HTMLElement): void {
		this.setContent(content);
		this.container.classList.add('modal_active');
		document.body.style.overflow = 'hidden';
		this.events.emit('modal:open');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		document.body.style.overflow = '';
		this.events.emit('modal:close');
	}

	setContent(content: HTMLElement) {
		this.modalContent.replaceChildren(content);
	}
}
