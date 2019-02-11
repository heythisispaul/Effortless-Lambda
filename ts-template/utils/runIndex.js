const handler = require('../dist/index').handler;
const testParams = require('../testParameters');

handler(testParams.event, testParams.context, testParams.callback);