import ProductsRepository from '../typeorm/repositories/ProductsRepository';
import Product from '../typeorm/entities/Product';
import RedisCache from '@shared/cache/RedisCache';

class ListProductService {
  constructor(
    private repository: ProductsRepository,
    private cache: RedisCache,
  ) {
    this.repository = repository;
    this.cache = cache;
  }
  public async execute(): Promise<Product[]> {
    const cacheProducts = await this.cache.recorver<Product[]>(
      'api-vendas-PRODUCTS_LIST',
    );

    console.log('CACHE: ', cacheProducts);
    return cacheProducts ?? (await this.findAndCacheProducts());
  }

  private async findAndCacheProducts(): Promise<Product[]> {
    const products = await this.repository.find();
    console.log('PRODUCTS: ', products);
    await this.cache.save('api-vendas-PRODUCTS_LIST', products);
    return products;
  }
}

export default ListProductService;
