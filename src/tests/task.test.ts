import mockingoose from 'mockingoose'; 
import request from 'supertest';
import app from '../app'; 
import Task from '../models/task.model'; 

describe('Task API', () => {
  beforeEach(() => {
    (mockingoose as any).reset(); 
  });

  it('should create a new task', async () => {
    const taskData = { title: 'Test Task', description: 'Testing', dueDate: '2025-04-30', status: 'pending' };


    (mockingoose as any)(Task).toReturn(taskData, 'save');  

    const response = await request(app)
      .post('/api/task') 
      .send(taskData);

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test Task');
  });

  it('should get task by id', async () => {
    const taskData = { _id: '12345', title: 'Test Task', description: 'Testing', status: 'pending' };

 
    (mockingoose as any)(Task).toReturn(taskData, 'findOne');  

    const response = await request(app).get('/api/task/12345'); 

    expect(response.status).toBe(200);
    expect(response.body._id).toBe('12345');
  });
});
