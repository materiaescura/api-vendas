import Product from '@modules/products/typeorm/entities/Product';
import AppError from '@shared/errors/AppError';

interface IProduct {
  id: string;
  quantity: number;
}

class ProductsValidator {
  products: IProduct[];

  constructor(products: IProduct[]) {
    this.products = products;
  }

  ifThereAreNotProducts(products: Product[]): ProductsValidator {
    const productIds = products.map(product => product.id);

    const checkInexistentProducts = this.products.filter(
      productOrder => !productIds.includes(productOrder.id),
    );

    if (checkInexistentProducts.length)
      throw new AppError(
        `Could not find product ${checkInexistentProducts[0].id}`,
      );

    return this;
  }

  ifQuantityIsInvalid(products: Product[]): ProductsValidator {
    const invalids = this.products.filter(productOrder =>
      products.some(product => {
        return (
          product.id === productOrder.id &&
          productOrder.quantity > product.quantity
        );
      }),
    );

    if (invalids.length)
      throw new AppError(`
        The quantity ${invalids[0].quantity}
        is not available for ${invalids[0].id}
    `);

    return this;
  }

  static create(products: IProduct[]): ProductsValidator {
    return new ProductsValidator(products);
  }
}

export default ProductsValidator;
