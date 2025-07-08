import { AppState } from './components/AppState';
import { API_URL } from './utils/constants';
import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/AppApi';
import { Page } from './components/Page';
import { Modal } from './components/Modal';
import { Card } from './components/Card';
import { IBasketIndex, IOrder, IProduct } from './types';
import { BasketView } from './components/BasketView';
import { cloneTemplate } from './utils/utils';
import { AddressForm, ContactForm } from './components/Form';
import { Success } from './components/Success';

const pageWrapper = document.querySelector('.page__wrapper') as HTMLElement;
const _modal = document.querySelector('.modal') as HTMLElement;
const cardTemplate = document.querySelector(
	'#card-catalog'
) as HTMLTemplateElement;
const cardPreview = document.querySelector(
	'#card-preview'
) as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const basketCardTemplate = document.querySelector(
	'#card-basket'
) as HTMLTemplateElement;
const paymentTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector(
	'#contacts'
) as HTMLTemplateElement;
const successTemplate = document.querySelector(
	'#success'
) as HTMLTemplateElement;

const api = new AppApi(API_URL);
const events = new EventEmitter();

const appState = new AppState(events);
const page = new Page(pageWrapper, events);
const modal = new Modal(_modal, events);

const basketTemplateContent = cloneTemplate(basketTemplate);
const basketView = new BasketView(basketTemplateContent, events);

const paymentTemplateContent = cloneTemplate(paymentTemplate);
const addressForm = new AddressForm(paymentTemplateContent, events);

const contactsTemplateContent = cloneTemplate(contactsTemplate);
const contactsForm = new ContactForm(contactsTemplateContent, events);

const successTemplateContent = cloneTemplate(successTemplate);
const successForm = new Success(successTemplateContent, events);

api
	.getProductCatalog()
	.then((data) => {
		appState.catalog = data.items;
	})
	.catch((err) => console.log(err));

events.on('catalog:loaded', () => {
	const cardElements: HTMLElement[] = [];

	appState.catalog.forEach((product) => {
		const cardComponent = new Card(cardTemplate, events);
		const cardElement = cardComponent.renderCard(product);
		cardElements.push(cardElement);
	});

	page.setCatalog(cardElements);
});

events.on('catalog:card_preview', (product: IProduct) => {
	const isInBasket = appState.isInBasket(product.id);
	const cardComponent = new Card(cardPreview, events);
	const previewElement = cardComponent.renderPreview(product, isInBasket);
	modal.open(previewElement);
});

events.on('basket:added', (product: IBasketIndex) => {
	appState.addToBasket(product);
});

events.on('basket:deleted', (product: IBasketIndex) => {
	appState.removeFromBasket(product.id);
});

events.on('basket:changed', () => {
	const basketData = appState.basket;
	const cardElements = basketData.map((item, index) => {
		const basketItem: IBasketIndex = { ...item, index: index + 1 };
		const cardComponent = new Card(basketCardTemplate, events);
		return cardComponent.renderBasket(basketItem);
	});
	page.setBasketCounter(appState.getBasketCount());
	basketView.setButtonDisabled(appState.getBasketTotal() <= 0);
	basketView.renderBasket(cardElements, appState.getBasketTotal());
});

events.on('catalog:basket_open', () => {
	modal.open(basketView.render());
});

events.on('order:submited', () => {
	addressForm.clear();
	modal.open(addressForm.render());
});

events.on('order:change', (data: { key: string; value: string }) => {
	appState.changeOrder(data.key, data.value);
	console.log(appState.order);
});

events.on('order:payment_submited', () => {
	contactsForm.clear();
	modal.open(contactsForm.render());
});

events.on('order:contacts_submited', () => {
	const orderData = {
		...(appState.order as IOrder),
		total: appState.getBasketTotal(),
		items: appState.basket.map((item) => item.id),
	};
	api
		.sendOrder(orderData)
		.then(() => {
			successForm.totalPrice(appState.getBasketTotal());
			modal.open(successForm.render());
			appState.clearBasket();
			appState.clearOrder();
		})
		.catch((err) => console.log(err));
});

events.on('order:finally', () => {
	modal.close();
});

events.on('address_form:errors:show', (errors: { [key: string]: string }) => {
	addressForm.validateForm(errors);
	console.log(errors);
});

events.on('contacts_form:errors:show', (errors: { [key: string]: string }) => {
	contactsForm.validateForm(errors);
});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});
