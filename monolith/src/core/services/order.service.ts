import { Injectable, Inject } from '@nestjs/common';
import { Order, OrderStatus } from '../entities';
import { ValidationException } from '../exceptions';
import { OrderRepository } from '../repositories';
import type { ErpGateway } from './external';
import {
  PlaceOrderRequest,
  PlaceOrderResponse,
  GetOrderResponse,
} from '../dtos';

@Injectable()
export class OrderService {
  public static readonly DECEMBER_31 = { month: 12, day: 31 };
  private static readonly CANCELLATION_BLOCK_START = { hour: 22, minute: 0 };
  private static readonly CANCELLATION_BLOCK_END = { hour: 23, minute: 0 };

  constructor(
    private readonly orderRepository: OrderRepository,
    @Inject('ErpGateway')
    private readonly erpGateway: ErpGateway,
  ) {}

  async placeOrder(request: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    const { productId, quantity } = request;

    if (productId <= 0) {
      throw new ValidationException(
        `Product ID must be greater than 0, received: ${productId}`,
      );
    }
    if (quantity <= 0) {
      throw new ValidationException(
        `Quantity must be greater than 0, received: ${quantity}`,
      );
    }

    const orderNumber = this.orderRepository.nextOrderNumber();
    const unitPrice = await this.erpGateway.getUnitPrice(productId);
    const totalPrice = unitPrice * quantity;
    const order = new Order(
      orderNumber,
      productId,
      quantity,
      unitPrice,
      totalPrice,
      OrderStatus.PLACED,
    );

    this.orderRepository.addOrder(order);

    const response = new PlaceOrderResponse();
    response.orderNumber = orderNumber;
    response.totalPrice = totalPrice;
    return response;
  }

  getOrder(orderNumber: string): GetOrderResponse {
    const order = this.orderRepository.getOrder(orderNumber);
    
    if (!order) {
      throw new Error(`Order with number ${orderNumber} not found`);
    }

    const response = new GetOrderResponse();
    response.orderNumber = orderNumber;
    response.productId = order.productId;
    response.quantity = order.quantity;
    response.unitPrice = order.unitPrice;
    response.totalPrice = order.totalPrice;
    response.status = order.status;

    return response;
  }

  cancelOrder(orderNumber: string): void {
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const currentDay = now.getDate();
    const currentTime = {
      hour: now.getHours(),
      minute: now.getMinutes(),
    };

    if (
      currentMonth === OrderService.DECEMBER_31.month &&
      currentDay === OrderService.DECEMBER_31.day &&
      this.isTimeBetween(
        currentTime,
        OrderService.CANCELLATION_BLOCK_START,
        OrderService.CANCELLATION_BLOCK_END,
      )
    ) {
      throw new ValidationException(
        'Order cancellation is not allowed on December 31st between 22:00 and 23:00',
      );
    }

    const order = this.orderRepository.getOrder(orderNumber);
    
    if (!order) {
      throw new Error(`Order with number ${orderNumber} not found`);
    }
    
    order.status = OrderStatus.CANCELLED;
    this.orderRepository.updateOrder(order);
  }

  private isTimeBetween(
    time: { hour: number; minute: number },
    start: { hour: number; minute: number },
    end: { hour: number; minute: number },
  ): boolean {
    const timeMinutes = time.hour * 60 + time.minute;
    const startMinutes = start.hour * 60 + start.minute;
    const endMinutes = end.hour * 60 + end.minute;

    return timeMinutes > startMinutes && timeMinutes < endMinutes;
  }
}
