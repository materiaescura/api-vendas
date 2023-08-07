import { getCustomRepository } from 'typeorm';
import CustomersRepository from '../typeorm/repositories/CustomersRepository';
import Customer from '../typeorm/entities/Customer';
import AppError from '@shared/errors/AppError';

interface IRequest {
  id: string;
  name: string;
  email: string;
}

class UpdateCustomerService {
  public async execute({ id, name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository);
    const customer = await customersRepository.findOne(id);

    if (!customer) throw new AppError('Customer not found');

    const customerByEmail = await customersRepository.findByEmail(email);

    if (customerByEmail && email !== customer.email)
      throw new AppError('Email adress already used');

    customer.name = name;
    customer.email = email;

    customersRepository.save(customer);

    return customer;
  }
}

export default UpdateCustomerService;
