import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser', fullyParallel:false, workers:1,
  timeout:60000, reporter:'list',
  // The homepage drifts, crossfades and slides on requestAnimationFrame while pulling in a 1,205
  // file hero sequence, so a first run on a cold CI machine can lose a race that is not a defect.
  // Retries in CI only: a test that passes on a retry is reported as flaky rather than green, so
  // the signal is kept, but one lost race no longer blocks a deploy. Locally, failures stay hard.
  retries: process.env.CI ? 2 : 0,
  use:{baseURL:'http://127.0.0.1:3107',channel:'chrome',trace:'retain-on-failure'},
  webServer:{
    command:'npm start',
    url:'http://127.0.0.1:3107/api/health/',
    reuseExistingServer:!process.env.CI,
    timeout:120000,
    env:{SITE_ENV:'preview'},
  },
});
