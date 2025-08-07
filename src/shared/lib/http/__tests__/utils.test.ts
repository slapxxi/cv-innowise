import { ClientError } from '../graphql.http';
import { handleAuthError, getHandleException, getHandleResult } from '../utils';

jest.mock('graphql-request', () => ({
  ...jest.requireActual('graphql-request'),
  ClientError: class {
    response;

    constructor(message: string) {
      this.response = { errors: [{ message }] };
    }
  },
}));

describe('utils', () => {
  describe('getHandleException', () => {
    it('handles generic exception by returning result', async () => {
      const p = Promise.reject(new Error('test')).catch(getHandleException('Test error occurred'));
      expect(await p).toEqual({ ok: false, error: { message: 'Test error occurred' } });
    });
  });

  describe('handleAuthError', () => {
    it('handles auth error by returning result', async () => {
      const p = Promise.reject(new ClientError('Unauthorized')).catch(handleAuthError);
      expect(await p).toEqual({ ok: false, error: { message: 'Unauthorized', status: 401 } });
    });
  });

  describe('getHandleResult', () => {
    it('handles result by returning result', async () => {
      const p = Promise.resolve({ test: 'testResult' }).then(getHandleResult('test'));
      expect(await p).toEqual({ ok: true, data: 'testResult' });
    });
  });
});
