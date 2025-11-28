import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { nanoid } from 'nanoid';

// We need to set the env var before importing the module
const TEST_DB_PATH = path.resolve(process.cwd(), 'data', 'test-db.json');
process.env.AGENT_CRM_DB_PATH = TEST_DB_PATH;

describe('shared/data', () => {

  beforeEach(() => {
    // Reset the module registry to reload the module with fresh state/env
    vi.resetModules();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  it('getPipeline should handle "constructor" stage safely', async () => {
    const maliciousDeal = {
      id: nanoid(),
      title: "Malicious Deal",
      value: 1000,
      status: "open",
      stage: "constructor",
      updatedAt: new Date().toISOString(),
    };

    const snapshot = {
      clients: [],
      deals: [maliciousDeal],
    };

    fs.mkdirSync(path.dirname(TEST_DB_PATH), { recursive: true });
    fs.writeFileSync(TEST_DB_PATH, JSON.stringify(snapshot));

    const { getPipeline } = await import('../../shared/data');

    // This should not throw
    const pipeline = getPipeline();

    expect(pipeline).toBeDefined();

    // After fix, we expect the malicious deal to be in "Discovery" stage
    const discoveryStage = pipeline.find(s => s.id === 'discovery');
    expect(discoveryStage).toBeDefined();
    expect(discoveryStage?.deals).toContainEqual(expect.objectContaining({ id: maliciousDeal.id }));
  });
});
