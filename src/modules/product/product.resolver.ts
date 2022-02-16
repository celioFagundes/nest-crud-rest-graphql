import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { Image } from './dto/image'
import { Product } from './dto/product'
import { ProductInput } from './dto/product.input'
import { ProductCategoryFilter } from './dto/productCategory.input'
import { ProductUpdateInput } from './dto/productUpdate.input'
import { ProductService } from './product.service'

@Resolver(() => Product)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  @Query(() => [Product], { name: 'getAllProducts' })
  async getAllProducts(): Promise<Product[]> {
    const products = await this.productService.findAll()
    const productsToReturn = products.map((product) => {
      const productToReturn = new Product()
      productToReturn.id = product.id
      productToReturn.product = product.product
      productToReturn.price = product.price
      productToReturn.images = product.images
      return productToReturn
    })
    return productsToReturn
  }

  @Query(() => [Product], { name: 'getProductsByCategory' })
  async getProductsByCategory(
    @Args('input') input: ProductCategoryFilter,
  ): Promise<Product[]> {
    const products = await this.productService.findByCategory(input.categoryID)
    const productsToReturn = products.map((product) => {
      const productToReturn = new Product()
      productToReturn.id = product.id
      productToReturn.product = product.product
      productToReturn.price = product.price
      productToReturn.images = product.images
      return productToReturn
    })

    return productsToReturn
  }

  @Query(() => Product, { name: 'getProductById' })
  async getProductById(@Args('id') id: number): Promise<Product> {
    const product = await this.productService.findById(id)
    return product[0]
  }

  @Mutation(() => Product, { name: 'createProduct' })
  async createProduct(@Args('input') input: ProductInput): Promise<Product> {
    return this.productService.create(input)
  }
  @Mutation(() => Product, { name: 'updateProduct' })
  async updateProduct(
    @Args('input') input: ProductUpdateInput,
  ): Promise<Product> {
    return this.productService.update(input)
  }
  @Mutation(() => Boolean, { name: 'removeProduct' })
  async removeProduct(@Args('id') id: number): Promise<boolean> {
    return this.productService.remove(id)
  }
  @Mutation(() => Boolean, { name: 'removeImage' })
  async removeImage(
    @Args('product_id') product_id: number,
    @Args('image_id') image_id: number,
  ): Promise<boolean> {
    return this.productService.removeImage(product_id, image_id)
  }
  @Mutation(() => Image, { name: 'addImage' })
  async addImage(@Args('input') input: Image): Promise<Image> {
    return this.productService.addImage(input)
  }
}
