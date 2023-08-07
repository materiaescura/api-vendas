import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/User';

interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

@EntityRepository(User)
class UsersRepository extends Repository<User> {
  private async findBy(field: Partial<IUser>): Promise<User | undefined> {
    const user = await this.findOne({
      where: { ...field },
    });
    return user;
  }
  public async findByName(name: string): Promise<User | undefined> {
    return await this.findBy({ name });
  }
  public async findById(id: string): Promise<User | undefined> {
    return await this.findBy({ id });
  }
  public async findByEmail(email: string): Promise<User | undefined> {
    return await this.findBy({ email });
  }
}

export default UsersRepository;
