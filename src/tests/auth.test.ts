import mockingoose from 'mockingoose'; 
import request from 'supertest';
import app from '../app';
import User from '../models/user.model';

describe('Auth API', () => {
  beforeEach(() => {
    (mockingoose as any).reset(); 
  });

  it('should login a user', async () => {
    const userData = { email: 'test@example.com', password: 'hashedPassword' }; 


    (mockingoose as any)(User).toReturn(userData, 'findOne');

    const response = await request(app)
      .post('/api/auth/login') 
      .send({ email: 'test@example.com', password: 'password' }); 

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined(); 
  });
});
