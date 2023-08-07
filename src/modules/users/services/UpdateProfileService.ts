import UsersRepository from '../typeorm/repositories/UsersRepository';
import User from '../typeorm/entities/User';
import AppError from '@shared/errors/AppError';
import { compare, hash } from 'bcryptjs';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password: string;
  old_password: string;
}

class UpdateProfileService {
  constructor(private userRepository: UsersRepository) {
    this.userRepository = userRepository;
  }
  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) throw new AppError('User not found');

    const userUpdateEmail = await this.userRepository.findByEmail(email);

    if (this.alreadyEmailUser(userUpdateEmail, user_id))
      throw new AppError('Email already exists');

    if (password && !old_password)
      throw new AppError('Old password is required');

    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password);
      if (!checkOldPassword) throw new AppError('Old password does not match');
      user.password = await hash(password, 8);
    }

    user.name = name;
    user.email = email;
    await this.userRepository.save(user);

    return user;
  }

  private alreadyEmailUser(userUpdateEmail: User | undefined, user_id: string) {
    return userUpdateEmail && userUpdateEmail.id !== user_id;
  }
}

export default UpdateProfileService;
