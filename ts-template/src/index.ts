import { LambdaContext } from './interfaces';

export const handler = (event: any, context: LambdaContext, callback: () => any) => {
  context.callbackWaitsForEmptyEventLoop = false;
  // Get started here:
  callback();
};
