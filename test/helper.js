'use strict';

import {
  webpackHelper,
} from 'macaca-wd';

export const {
  driver,
} = webpackHelper;

driver.configureHttp({
  timeout: 100 * 1000,
  retries: 5,
  retryDelay: 5,
});

const webpackDevServerPort = 8080;

export const BASE_URL = `http://127.0.0.1:${webpackDevServerPort}`;
