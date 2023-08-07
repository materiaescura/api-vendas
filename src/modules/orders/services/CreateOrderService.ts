import { getCustomRepository } from 'typeorm';
import Order from '../typeorm/entities/Order';
import OrdersRepository from '../typeorm/repositories/OrdersRepository';
import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRepository';
import ProductsRepository from '@modules/products/typeorm/repositories/ProductsRepository';
import AppError from '@shared/errors/AppError';
import ProductsValidator from './ProductsValidator';

interface IProduct {
  id: string;
  quantity: number;
}
interface IRequest {
  customer_id: string;
  products: IProduct[];
}
class CreateOrderService {
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRepository = getCustomRepository(OrdersRepository);
    const customersRepository = getCustomRepository(CustomersRepository);
    const productRepository = getCustomRepository(ProductsRepository);

    const customer = await customersRepository.findById(customer_id);

    if (!customer)
      throw new AppError('Could not find any customer with the given id');

    const productsFound = await productRepository.findByIds(products);

    if (!productsFound.length)
      throw new AppError('Could not find any products with given ids');

    ProductsValidator.create(products)
      .ifThereAreNotProducts(productsFound)
      .ifQuantityIsInvalid(productsFound);

    const serializedProducts = productsFound.map(product => ({
      product_id: product.id,
      quantity: products.filter(p => p.id === product.id)[0].quantity,
      price: product.price,
    }));

    const order = await ordersRepository.createOrder({
      customer,
      products: serializedProducts,
    });

    const { order_products } = order;

    const updatedProductQuantity = order_products.map(orderProduct => ({
      id: orderProduct.product_id,
      quantity:
        productsFound.filter(({ id }) => id === orderProduct.product_id)[0]
          .quantity - orderProduct.quantity,
    }));

    await productRepository.save(updatedProductQuantity);

    return order;
  }
}

export default CreateOrderService;
