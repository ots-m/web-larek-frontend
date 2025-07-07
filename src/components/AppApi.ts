import { IOrder, IOrderSuccess, IProductList } from '../types';
import { Api } from './base/api';

export class AppApi extends Api {
	getProductCatalog(): Promise<IProductList> {
		return this.get<IProductList>('/product');
	}

	sendOrder(order: IOrder): Promise<IOrderSuccess> {
		return this.post<IOrderSuccess>(`/order/`, order);
	}
}
