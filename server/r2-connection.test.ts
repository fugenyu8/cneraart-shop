/**
 * Vitest test: Cloudflare R2 connection validation
 */
import { describe, it, expect } from 'vitest';
import { storagePut, storageGet, storageDelete } from './storage';

describe('Cloudflare R2 Storage', () => {
  it('should upload, retrieve, and delete a test file', async () => {
    const testKey = `test/r2-connection-test-${Date.now()}.txt`;
    const testContent = 'R2 connection test - 源·华渡商城';

    // Upload
    const { key, url } = await storagePut(testKey, testContent, 'text/plain');
    expect(key).toBe(testKey);
    expect(url).toContain('r2.dev');
    expect(url).toContain(testKey);

    // Retrieve URL
    const { url: getUrl } = await storageGet(testKey);
    expect(getUrl).toBe(url);

    // Delete
    await storageDelete(testKey);
  }, 30000);
});
