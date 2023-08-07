import { getCustomRepository } from 'typeorm';
import Product from '../typeorm/entities/Product';
import AppError from '@shared/errors/AppError';
import ProductsRepository from '../typeorm/repositories/ProductsRepository';

interface IIdRequest {
  id: string;
}

class ShowProductService {
  public async execute(id: IIdRequest): Promise<Product | undefined> {
    const productRepository = getCustomRepository(ProductsRepository);
    const product = await productRepository.findOne(id);

    if (!product) {
      throw new AppError('Product not found');
    }

    return product;
  }
}

export default ShowProductService;
