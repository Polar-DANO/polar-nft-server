import { Logger } from 'tslog';
import config from './config';

const logger = new Logger({
  overwriteConsole: config.environment !== 'production',
  displayFunctionName: false,
});

export default logger;
