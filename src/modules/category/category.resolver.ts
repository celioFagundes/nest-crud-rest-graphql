import { Resolver, Query, Args, Mutation } from '@nestjs/graphql'
import { CategoryService } from './category.service'
import { Category } from './dto/category'

@Resolver(() => Category)
export class CategoryResolver {
  constructor(private readonly categoryService: CategoryService) {}

  @Query(() => [Category], { name: 'getAllCategories' })
  async getAllCategories(): Promise<Category[]> {
    const categories = await this.categoryService.findAll()
    console.log(categories)
    const categoriesToReturn = categories.map((category) => {
      const categoryToReturn = new Category()
      categoryToReturn.id = category.id
      categoryToReturn.category = category.category
      return categoryToReturn
    })
    console.log(categoriesToReturn)
    return categoriesToReturn
  }
  @Mutation(() => Category, { name: 'createCategory' })
  async createCategory(@Args('input') input: Category): Promise<Category> {
    return this.categoryService.createCategory(input)
  }
  @Mutation(() => Boolean, { name: 'removeCategory' })
  async removeCategory(@Args('id') id: number): Promise<boolean> {
    return this.categoryService.removeCategory(id)
  }
  @Mutation(() => Category, { name: 'updateCategory' })
  async updateCategory(@Args('input') input: Category): Promise<Category> {
    return this.categoryService.updateCategory(input)
  }
}
