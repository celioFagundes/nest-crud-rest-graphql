import { Controller, Get, Param, Post, Body, Delete, Put } from '@nestjs/common'

import { Category } from './category.entity'
import { CategoryService } from './category.service'

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async findAll(): Promise<Category[]> {
    return this.categoryService.findAll()
  }
  @Post()
  async create(@Body() category: Category): Promise<Category> {
    return this.categoryService.createCategory(category)
  }
  @Delete('/:id')
  async remove(@Param('id') id: number): Promise<boolean> {
    return this.categoryService.removeCategory(id)
  }
  @Put('/:id')
  async update(
    @Body() category: Category,
    @Param('id') id: number,
  ): Promise<Category> {
    return this.categoryService.updateCategory(category, id)
  }
}
