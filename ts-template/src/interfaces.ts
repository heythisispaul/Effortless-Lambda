export interface LambdaContext {
  functionName?: string;
  functionVersion?: string;
  invokedFunctionArn?: string;
  memoryLimitInMB?: number;
  awsRequestId?: string;
  logGroupName?: string;
  logStreamName?: string;
  identity?: {
    cognitoIdentityId: string;
    cognitoIdentityPoolId: string;
  }
  clientContext?: any;
  callbackWaitsForEmptyEventLoop?: boolean;
};

