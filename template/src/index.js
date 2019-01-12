export const handler = (event, context, callback) => {
  context.callbackWaitsForEmptyEventLoop = false;
  //Get started here:
    
  callback();
};