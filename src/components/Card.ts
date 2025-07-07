import { IBasketIndex, IProduct } from '../types';
import { CDN_URL } from '../utils/constants';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ICard {
	renderCard: HTMLElement;
	renderPreview: HTMLElement;
	renderBasket: HTMLElement;
}

export class Card extends Component<ICard> {
	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
	}

	renderCard(data: IProduct): HTMLElement {
		const card = cloneTemplate<HTMLElement>('#card-catalog');

		const cardTitle = ensureElement('.card__title', card);
		const cardCategory = ensureElement('.card__category', card);
		const cardImage = ensureElement('.card__image', card) as HTMLImageElement;
		const cardPrice = ensureElement('.card__price', card);

		if (cardTitle) this.setText(cardTitle, data.title);
		if (cardCategory) {
			this.setText(cardCategory, data.category);
			const categoryClass = `card__category_${this.getCategoryClass(
				data.category
			)}`;
			cardCategory.classList.add('card__category', categoryClass);
		}

		if (cardImage) this.setImage(cardImage, CDN_URL + data.image, data.title);
		if (cardPrice) this.setPrice(cardPrice, data.price);

		card.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('catalog:card_preview', data);
		});

		return card;
	}

	renderPreview(data: IProduct, isInBasket: boolean): HTMLElement {
		const preview = cloneTemplate<HTMLElement>('#card-preview');

		const cardTitle = ensureElement('.card__title', preview);
		const cardCategory = ensureElement('.card__category', preview);
		const cardImage = ensureElement(
			'.card__image',
			preview
		) as HTMLImageElement;
		const cardPrice = ensureElement('.card__price', preview);
		const cardText = ensureElement('.card__text', preview);
		const cardButton = ensureElement(
			'.card__button',
			preview
		) as HTMLButtonElement;

		if (cardTitle) this.setText(cardTitle, data.title);
		if (cardCategory) {
			this.setText(cardCategory, data.category);
			const categoryClass = `card__category_${this.getCategoryClass(
				data.category
			)}`;
			cardCategory.classList.add('card__category', categoryClass);
		}

		if (cardImage) this.setImage(cardImage, CDN_URL + data.image, data.title);
		if (cardPrice) this.setPrice(cardPrice, data.price);
		if (cardText) this.setText(cardText, data.description);

		const updateButtonState = () => {
			if (cardButton) {
				if (data.price === null) {
					cardButton.disabled = true;
					cardButton.textContent = 'Бесценный товар';
				} else if (isInBasket) {
					cardButton.textContent = 'Удалить из корзины';
				} else {
					cardButton.textContent = 'Купить';
				}
			}
		};

		updateButtonState();

		if (cardButton) {
			cardButton.addEventListener('click', (evt) => {
				evt.preventDefault();
				this.events.emit(isInBasket ? 'basket:deleted' : 'basket:added', data);
				this.events.emit('basket:changed');
				this.events.emit('catalog:card_preview', data);
			});
		}

		return preview;
	}

	renderBasket(data: IBasketIndex): HTMLElement {
		const basket = cloneTemplate<HTMLElement>('#card-basket');

		const cardTitle = ensureElement('.card__title', basket);
		const cardPrice = ensureElement('.card__price', basket);
		const cardIndex = ensureElement('.basket__item-index', basket);
		const deleteButton = ensureElement(
			'.basket__item-delete',
			basket
		) as HTMLButtonElement;

		if (cardTitle) this.setText(cardTitle, data.title);
		if (cardPrice) this.setPrice(cardPrice, data.price);
		if (cardIndex) this.setText(cardIndex, data.index);

		deleteButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('basket:deleted', data);
			this.events.emit('basket:changed');
		});

		return basket;
	}

	private getCategoryClass(category: string): string {
		const categorys: Record<string, string> = {
			'софт-скил': 'soft',
			другое: 'other',
			дополнительное: 'additional',
			кнопка: 'button',
			'хард-скил': 'hard',
		};
		return categorys[category] || 'other';
	}

}
