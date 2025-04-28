import { checkRole } from './auth.middleware';
import { Request, Response } from 'express';

describe('Role Middleware', () => {
  it('should allow user with correct role', () => {
    const req = { user: { role: 'admin' } } as unknown as Request;
    const res = {} as Response;
    const next = jest.fn();

    const middleware = checkRole('admin');
    middleware(req, res, next);

    expect(next).toBeCalled();
  });

  it('should deny user with wrong role', () => {
    const req = { user: { role: 'user' } } as unknown as Request;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    const next = jest.fn();
    const middleware = checkRole('admin');
    middleware(req, res, next);

    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({ message: 'Access Denied' });
  });
});
