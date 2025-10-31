import { TestConfiguration } from '../../src/test-configuration';

describe('API Smoke Test', () => {
  it('echo_shouldReturn200OK', async () => {
    // DISCLAIMER: This is an example of a badly written test
    // which unfortunately simulates real-life software test projects.
    // This is the starting point for our ATDD Accelerator exercises.

    const response = await fetch(`${TestConfiguration.getBaseUrl()}/api/echo`, {
      method: 'GET'
    });

    expect(response.status).toBe(200);
  });
});