import { Injectable } from '@nestjs/common';
import { ErpGateway } from './erp-gateway.interface';

@Injectable()
export class DummyJsonErpGateway implements ErpGateway {
  async getUnitPrice(productId: number): Promise<number> {
    const response = await fetch(
      `https://dummyjson.com/products/${productId}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch product ${productId}`);
    }

    const product = await response.json();
    return product.price;
  }
}
