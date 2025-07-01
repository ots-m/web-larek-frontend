export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
}

export interface IProductList {
  items: IProduct[];
}

export interface IAppState {
    catalog: IProduct[];
    basket: IProduct[];
    preview: string | null;
    order: IOrder | null;
}

export type TPaymentMethod = 'online' | 'offline';

export interface IAddressData {
  address: string;
  payment: TPaymentMethod;
}

export interface IContactData {
	email: string;
	phone: string;
}

export interface IOrder {
	payment: TPaymentMethod;
	email: string;
	phone: string;
	address: string;
}
