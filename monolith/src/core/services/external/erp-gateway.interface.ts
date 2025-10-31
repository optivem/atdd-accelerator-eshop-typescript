export interface ErpGateway {
  getUnitPrice(productId: number): Promise<number>;
}
