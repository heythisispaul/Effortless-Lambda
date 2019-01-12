import { handler } from '../src/index';

describe('index', () => {
  const mockCallback = jest.fn();
  test('it runs the callback at completion', () => {
    handler({}, {}, mockCallback);
    expect(mockCallback).toHaveBeenCalled();
  });
  test('it updates the context properties so the callback does not fire immediately', () => {
    const context = {};
    handler({}, context, mockCallback);
    expect(context).toHaveProperty('callbackWaitsForEmptyEventLoop', false);
  });
});

