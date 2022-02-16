import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Put,
  Query,
} from '@nestjs/common'
import { Image } from './dto/image'
import { ProductUpdateInput } from './dto/productUpdate.input'
import { Product } from './product.entity'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productService.findAll()
  }
  @Get('filter')
  async findByCategory(
    @Query('categoryId') categoryId: number,
  ): Promise<Product[]> {
    return this.productService.findByCategory(categoryId)
  }
  @Get('/:id')
  async findById(@Param('id') id: number): Promise<Product> {
    return this.productService.findById(id)
  }
  @Post()
  async create(@Body() product: Product): Promise<Product> {
    return this.productService.create(product)
  }
  @Delete('/:id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.productService.remove(id)
  }
  @Put('/:id')
  async update(
    @Body() product: ProductUpdateInput,
    @Param('id') id: number,
  ): Promise<Product> {
    return this.productService.update(product, id)
  }
  @Post('/:id/images')
  async addImage(
    @Body() image: Image,
    @Param('id') id: number,
  ): Promise<Image> {
    return this.productService.addImage(image, id)
  }
  @Delete('/:id/images/:imageId')
  async removeImage(
    @Param('id') id: number,
    @Param('imageId') imageId: number,
  ): Promise<boolean> {
    return this.productService.removeImage(id, imageId)
  }
}
