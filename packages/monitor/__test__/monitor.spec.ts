// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { createMonitor } from '../src';

describe('monitor', () => {
  const logs: any[] = [];
  const logger = createMonitor({
    loggerOptions: {
      noOutput: true,
      logConfig: {
        event: { inherit: 'info', kind: 'event' },
        system: { inherit: 'info', kind: 'system' },
      },
    },
    reportLog: info => logs.push(info),
  });

  it('custom logger', () => {
    expect(logs).toMatchInlineSnapshot(`[]`);
    logger.event('custom event', { test: 1 });
    expect(logs).toMatchInlineSnapshot(`
      [
        {
          "config": {
            "loggerOptions": {
              "logConfig": {
                "event": {
                  "borderColor": "#d9d9d9",
                  "contentBg": "#fff",
                  "contentColor": "#000",
                  "inherit": "info",
                  "kind": "event",
                  "tagBg": "#d9d9d9",
                  "tagColor": "#000",
                },
                "system": {
                  "borderColor": "#d9d9d9",
                  "contentBg": "#fff",
                  "contentColor": "#000",
                  "inherit": "info",
                  "kind": "system",
                  "tagBg": "#d9d9d9",
                  "tagColor": "#000",
                },
              },
              "noOutput": true,
            },
            "reportLog": [Function],
          },
          "logInfo": {
            "kind": "event",
            "logConf": {
              "borderColor": "#d9d9d9",
              "contentBg": "#fff",
              "contentColor": "#000",
              "inherit": "info",
              "kind": "event",
              "tagBg": "#d9d9d9",
              "tagColor": "#000",
            },
            "messages": [
              "custom event",
              {
                "test": 1,
              },
            ],
            "preventDefault": [Function],
          },
        },
      ]
    `);
  });
});
