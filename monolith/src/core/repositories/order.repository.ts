import { Injectable } from '@nestjs/common';
import { Order } from '../entities';
import { randomUUID } from 'crypto';

@Injectable()
export class OrderRepository {
  private static readonly orders = new Map<string, Order>();

  addOrder(order: Order): void {
    if (OrderRepository.orders.has(order.orderNumber)) {
      throw new Error(
        `Order with order number ${order.orderNumber} already exists.`,
      );
    }

    OrderRepository.orders.set(order.orderNumber, order);
  }

  updateOrder(order: Order): void {
    if (!OrderRepository.orders.has(order.orderNumber)) {
      throw new Error(
        `Order with order number ${order.orderNumber} does not exist.`,
      );
    }

    OrderRepository.orders.set(order.orderNumber, order);
  }

  getOrder(orderNumber: string): Order | undefined {
    return OrderRepository.orders.get(orderNumber);
  }

  nextOrderNumber(): string {
    return `ORD-${randomUUID()}`;
  }
}
