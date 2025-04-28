import Task from './task.model';

describe('Task Model Validation', () => {
  it('should require a title', async () => {
    const task = new Task({});

    try {
      await task.validate();
    } catch (err: any) {
      expect(err.errors.title).toBeDefined(); 
    }
  });
});
