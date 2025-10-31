import { OrderStatus } from './order-status.enum';

export class Order {
  constructor(
    public readonly orderNumber: string,
    public readonly productId: number,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly totalPrice: number,
    public status: OrderStatus,
  ) {
    if (!orderNumber) {
      throw new Error('orderNumber cannot be null');
    }
    if (unitPrice == null) {
      throw new Error('unitPrice cannot be null');
    }
    if (totalPrice == null) {
      throw new Error('totalPrice cannot be null');
    }
    if (!status) {
      throw new Error('status cannot be null');
    }
  }
}
