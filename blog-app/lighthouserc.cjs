'use strict';

module.exports = {
  ci: {
    collect: {
      startServerCommand:
        'npm run build && npm run preview -- --host 127.0.0.1 --port 4322',
      startServerReadyPattern: 'Local',
      startServerReadyTimeout: 180000,
      url: [
        'http://127.0.0.1:4322/blog/',
        'http://127.0.0.1:4322/blog/editorial-policy/'
      ],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1440,
          height: 900,
          deviceScaleFactor: 1,
          disabled: false
        },
        throttlingMethod: 'simulate'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 1 }],
        'categories:seo': ['error', { minScore: 1 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }]
      }
    },
    upload: {
      target: 'filesystem',
      outputDir: './review/lighthouse'
    }
  }
};
