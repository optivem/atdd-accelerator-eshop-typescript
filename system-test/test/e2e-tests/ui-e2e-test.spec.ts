import { chromium, Browser, Page, Locator } from 'playwright';
import { TestConfiguration } from '../../src/test-configuration';

describe('UI E2E Test', () => {
  const BASE_URL = TestConfiguration.getBaseUrl();
  const WAIT_SECONDS = TestConfiguration.getWaitSeconds();

  let browser: Browser;
  let page: Page;

  beforeEach(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  afterEach(async () => {
    await browser.close();
  });

  it('shouldCalculateTotalOrderPrice', async () => {
    // Arrange
    await page.goto(`${BASE_URL}/shop.html`);

    const productIdInput: Locator = page.getByLabel('Product ID');
    const quantityInput: Locator = page.getByLabel('Quantity');
    const placeOrderButton: Locator = page.getByRole('button', {
      name: 'Place Order',
    });
    const orderNumberOutput: Locator = page.locator('[data-testid="order-number"]');
    const totalPriceOutput: Locator = page.locator('[data-testid="total-price"]');

    // Act
    await productIdInput.fill('10');
    await quantityInput.fill('5');
    await placeOrderButton.click();

    // Wait for the order confirmation to appear
    await orderNumberOutput.waitFor({ timeout: WAIT_SECONDS * 1000 });

    // Assert
    const orderNumber = await orderNumberOutput.textContent();
    expect(orderNumber).toMatch(/^ORD-/);

    const totalPriceText = await totalPriceOutput.textContent();
    expect(totalPriceText).toBeTruthy();

    // Price should be a number > 0
    const totalPrice = parseFloat(totalPriceText || '0');
    expect(totalPrice).toBeGreaterThan(0);
  });

  it('shouldRetrieveOrderHistory', async () => {
    // Arrange - First place an order
    await page.goto(`${BASE_URL}/shop.html`);

    const productIdInput: Locator = page.getByLabel('Product ID');
    const quantityInput: Locator = page.getByLabel('Quantity');
    const placeOrderButton: Locator = page.getByRole('button', {
      name: 'Place Order',
    });
    const orderNumberOutput: Locator = page.locator('[data-testid="order-number"]');

    await productIdInput.fill('11');
    await quantityInput.fill('3');
    await placeOrderButton.click();

    await orderNumberOutput.waitFor({ timeout: WAIT_SECONDS * 1000 });
    const orderNumber = await orderNumberOutput.textContent();

    // Act - Navigate to order history and search
    await page.goto(`${BASE_URL}/order-history.html`);

    const orderNumberSearch: Locator = page.getByLabel('Order Number');
    const searchButton: Locator = page.getByRole('button', { name: 'Search' });

    await orderNumberSearch.fill(orderNumber || '');
    await searchButton.click();

    // Wait for the order details to appear
    const orderDetails: Locator = page.locator('[data-testid="order-details"]');
    await orderDetails.waitFor({ timeout: WAIT_SECONDS * 1000 });

    // Assert - Check specific fields
    const displayOrderNumber: Locator = page.locator('#displayOrderNumber');
    const displayProductId: Locator = page.locator('#displayProductId');
    const displayQuantity: Locator = page.locator('#displayQuantity');
    const displayStatus: Locator = page.locator('#displayStatus');

    expect(await displayOrderNumber.inputValue()).toBe(orderNumber || '');
    expect(await displayProductId.inputValue()).toBe('11');
    expect(await displayQuantity.inputValue()).toBe('3');
    expect(await displayStatus.inputValue()).toBe('PLACED');
  });

  it('shouldCancelOrder', async () => {
    // Arrange - First place an order
    await page.goto(`${BASE_URL}/shop.html`);

    const productIdInput: Locator = page.getByLabel('Product ID');
    const quantityInput: Locator = page.getByLabel('Quantity');
    const placeOrderButton: Locator = page.getByRole('button', {
      name: 'Place Order',
    });
    const orderNumberOutput: Locator = page.locator('[data-testid="order-number"]');

    await productIdInput.fill('12');
    await quantityInput.fill('2');
    await placeOrderButton.click();

    await orderNumberOutput.waitFor({ timeout: WAIT_SECONDS * 1000 });
    const orderNumber = await orderNumberOutput.textContent();

    // Act - Navigate to order history and cancel
    await page.goto(`${BASE_URL}/order-history.html`);

    const orderNumberSearch: Locator = page.getByLabel('Order Number');
    const searchButton: Locator = page.getByRole('button', { name: 'Search' });

    await orderNumberSearch.fill(orderNumber || '');
    await searchButton.click();

    // Wait for the cancel button to appear
    const cancelButton: Locator = page.getByRole('button', {
      name: 'Cancel Order',
    });
    await cancelButton.waitFor({ timeout: WAIT_SECONDS * 1000 });
    await cancelButton.click();

    // Wait for cancellation confirmation
    await page.waitForTimeout(1000);

    // Re-search to verify status
    await searchButton.click();

    const orderDetails: Locator = page.locator('[data-testid="order-details"]');
    await orderDetails.waitFor({ timeout: WAIT_SECONDS * 1000 });

    // Assert - Check that status is now CANCELLED
    const displayStatus: Locator = page.locator('#displayStatus');
    expect(await displayStatus.inputValue()).toBe('CANCELLED');
  });
});