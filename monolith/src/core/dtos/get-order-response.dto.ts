import { OrderStatus } from '../entities';

export class GetOrderResponse {
  orderNumber: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: OrderStatus;
}
