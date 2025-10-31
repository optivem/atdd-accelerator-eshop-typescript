import { TestConfiguration } from '../../src/test-configuration';

interface PlaceOrderRequest {
  productId: number;
  quantity: number;
}

interface PlaceOrderResponse {
  orderNumber: string;
  totalPrice: number;
}

interface GetOrderResponse {
  orderNumber: string;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
}

describe('API E2E Test', () => {
  const BASE_URL = TestConfiguration.getBaseUrl();

  it('placeOrder_shouldReturnOrderNumber', async () => {
    // Arrange
    const requestDto: PlaceOrderRequest = {
      productId: 10,
      quantity: 5,
    };

    // Act
    const response = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestDto),
    });

    // Assert
    expect(response.status).toBe(201);

    const responseDto = (await response.json()) as PlaceOrderResponse;

    // Verify response contains orderNumber
    expect(responseDto.orderNumber).toBeDefined();
    expect(responseDto.orderNumber).toMatch(/^ORD-/);
  });

  it('getOrder_shouldReturnOrderDetails', async () => {
    // Arrange - First place an order
    const placeOrderRequest: PlaceOrderRequest = {
      productId: 11,
      quantity: 3,
    };

    const postResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placeOrderRequest),
    });

    const placeOrderResponse = (await postResponse.json()) as PlaceOrderResponse;
    const orderNumber = placeOrderResponse.orderNumber;

    // Act - Get the order details
    const getResponse = await fetch(`${BASE_URL}/api/orders/${orderNumber}`, {
      method: 'GET',
    });

    // Assert
    expect(getResponse.status).toBe(200);

    const getOrderResponse = (await getResponse.json()) as GetOrderResponse;

    expect(getOrderResponse.orderNumber).toBe(orderNumber);
    expect(getOrderResponse.productId).toBe(11);
    expect(getOrderResponse.quantity).toBe(3);

    // Price will come from DummyJSON API for product 11
    expect(getOrderResponse.unitPrice).toBeDefined();
    expect(getOrderResponse.totalPrice).toBeDefined();
  });

  it('cancelOrder_shouldSetStatusToCancelled', async () => {
    // Arrange - First place an order
    const placeOrderRequest: PlaceOrderRequest = {
      productId: 12,
      quantity: 2,
    };

    const postResponse = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(placeOrderRequest),
    });

    const placeOrderResponse = (await postResponse.json()) as PlaceOrderResponse;
    const orderNumber = placeOrderResponse.orderNumber;

    // Act - Cancel the order
    const deleteResponse = await fetch(
      `${BASE_URL}/api/orders/${orderNumber}`,
      {
        method: 'DELETE',
      },
    );

    // Assert - Verify cancel response
    expect(deleteResponse.status).toBe(204);

    // Verify order status is CANCELLED
    const getResponse = await fetch(`${BASE_URL}/api/orders/${orderNumber}`, {
      method: 'GET',
    });

    expect(getResponse.status).toBe(200);

    const getOrderResponse = (await getResponse.json()) as GetOrderResponse;
    expect(getOrderResponse.status).toBe('CANCELLED');
  });
});