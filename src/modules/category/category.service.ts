import { Inject, Injectable } from '@nestjs/common'
import { MySQLProvider } from 'src/database/mysql.provider'
import { Category } from './dto/category'

@Injectable()
export class CategoryService {
  constructor(@Inject('DATABASE') private readonly mysql: MySQLProvider) {}
  async findAll(): Promise<Category[]> {
    const conn = await this.mysql.getConnection()
    const [results] = await conn.query('select * from categories')
    const resultsPlain = JSON.parse(JSON.stringify(results))
    const categories = resultsPlain.map((category) => {
      const categoryEntity = new Category()
      categoryEntity.id = category.id
      categoryEntity.category = category.category
      return categoryEntity
    })
    return categories
  }
  async createCategory(entity: Category): Promise<Category> {
    const conn = await this.mysql.getConnection()
    await conn.query(`insert into categories (category) values (?)`, [
      entity.category,
    ])
    return entity
  }
  async removeCategory(id: number): Promise<boolean> {
    const conn = await this.mysql.getConnection()
    await conn.query(`delete from categories where id=? limit 1`, [id])
    return true
  }
  async updateCategory(entity: Category, id?: number): Promise<Category> {
    const conn = await this.mysql.getConnection()
    const catId = entity.id || id
    await conn.query(`update categories set category =? where id =?`, [
      entity.category,
      catId,
    ])
    return entity
  }
}
