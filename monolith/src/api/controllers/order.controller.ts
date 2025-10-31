import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  HttpCode,
} from '@nestjs/common';
import { OrderService } from '../../core/services';
import {
  PlaceOrderRequest,
  PlaceOrderResponse,
  GetOrderResponse,
} from '../../core/dtos';

@Controller('api/orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async placeOrder(
    @Body() request: PlaceOrderRequest,
  ): Promise<PlaceOrderResponse> {
    return this.orderService.placeOrder(request);
  }

  @Get(':orderNumber')
  getOrder(@Param('orderNumber') orderNumber: string): GetOrderResponse {
    return this.orderService.getOrder(orderNumber);
  }

  @Delete(':orderNumber')
  @HttpCode(204)
  cancelOrder(@Param('orderNumber') orderNumber: string): void {
    this.orderService.cancelOrder(orderNumber);
  }
}
