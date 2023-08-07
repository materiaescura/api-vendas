import { Request, Response } from 'express';
import CreateSessionsService from '../services/CreateSessionsService';
import { instanceToInstance } from 'class-transformer';

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const sessionService = new CreateSessionsService();
    const user = await sessionService.execute({ email, password });
    return response.json(instanceToInstance(user));
  }
}

export default SessionsController;
