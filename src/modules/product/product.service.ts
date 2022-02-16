import { Inject, Injectable } from '@nestjs/common'
import { MySQLProvider } from '../../database/mysql.provider'
import { Image } from './dto/image'
import { ProductUpdateInput } from './dto/productUpdate.input'
import { Product } from './product.entity'

@Injectable()
export class ProductService {
  constructor(@Inject('DATABASE') private readonly mysql: MySQLProvider) {}
  async findAll(): Promise<Product[]> {
    const conn = await this.mysql.getConnection()
    const [results] = await conn.query('select * from products')
    const resultsPlain = JSON.parse(JSON.stringify(results))
    const products = resultsPlain.map((product) => {
      const productEntity = new Product()
      productEntity.id = product.id
      productEntity.product = product.product
      productEntity.price = product.price
      return productEntity
    })
    const productsWithImages = await this.getImages(products)
    return productsWithImages
  }
  async findByCategory(categoryID: number): Promise<Product[]> {
    const conn = await this.mysql.getConnection()
    const [results] = await conn.query(
      `select * from products where id in (select product_id from category_product where category_id =?)`,
      [categoryID],
    )
    const resultsPlain = JSON.parse(JSON.stringify(results))
    const products = resultsPlain.map((product) => {
      const productEntity = new Product()
      productEntity.id = product.id
      productEntity.product = product.product
      productEntity.price = product.price
      return productEntity
    })
    const productsWithImages = await this.getImages(products)
    return productsWithImages
  }
  async findById(id: number): Promise<Product> {
    const conn = await this.mysql.getConnection()
    const [results] = await conn.query('select * from products where id = ?', [
      id,
    ])
    const [images] = await conn.query(
      `select * from images where product_id = ${id}`,
    )
    const imagesPlain = JSON.parse(JSON.stringify(images))
    const resultsPlain = JSON.parse(JSON.stringify(results))
    const products = resultsPlain.map((product) => {
      const productEntity = new Product()
      productEntity.id = product.id
      productEntity.product = product.product
      productEntity.price = product.price
      productEntity.images = imagesPlain
      return productEntity
    })
    return products
  }
  async getImages(results: Product[]): Promise<Product[]> {
    if (results.length === 0) {
      return []
    }
    const conn = await this.mysql.getConnection()
    const idsProducts = results.map((product) => product.id).join(',')
    const [images] = await conn.query(
      'select * from images where product_id in (' +
        idsProducts +
        ') group by product_id',
    )
    const imagesPlain = JSON.parse(JSON.stringify(images))
    const mapImages = imagesPlain.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.product_id]: curr,
      }
    }, {})
    const products = results.map((product) => {
      return {
        ...product,
        images: [mapImages[product.id]],
      }
    })
    return products
  }
  async addImage(entity: Image, id?: number): Promise<Image> {
    const conn = await this.mysql.getConnection()
    const product_id = entity.product_id || id
    await conn.query(
      `insert into images (product_id,description,url) values(?,?,?)`,
      [product_id, entity.description, entity.url],
    )
    return entity
  }
  async removeImage(product_id: number, image_id: number): Promise<boolean> {
    const conn = await this.mysql.getConnection()
    await conn.query(`delete from images where product_id = ? and id = ? `, [
      product_id,
      image_id,
    ])
    return true
  }
  async create(entity: Product): Promise<Product> {
    const conn = await this.mysql.getConnection()
    await conn.query(`insert into products (product,price) values (?,?)`, [
      entity.product,
      entity.price,
    ])
    return entity
  }
  async update(entity: ProductUpdateInput, id?: number): Promise<Product> {
    const conn = await this.mysql.getConnection()
    const product_id = entity.id || id
    const [oldProduct] = await conn.query(
      'select * from products where id = ?',
      [product_id],
    )

    const newProduct = oldProduct[0]

    if (entity.product) {
      newProduct.product = entity.product
    }
    if (entity.price) {
      newProduct.price = entity.price
    }
    await conn.query(`update products set product =? , price = ? where id =?`, [
      newProduct.product,
      newProduct.price,
      product_id,
    ])
    if (entity.categories) {
      await this.updateCategories(product_id, entity.categories)
    }
    return newProduct
  }
  async updateCategories(product_id: number, categoriesID: number[]) {
    const conn = await this.mysql.getConnection()
    await conn.query(`delete from category_product where product_id=?`, [
      product_id,
    ])
    for await (const category of categoriesID) {
      await conn.query(
        `insert into category_product (product_id, category_id) values (?,?)`,
        [product_id, category],
      )
    }
  }
  async remove(id: number): Promise<boolean> {
    const conn = await this.mysql.getConnection()
    await conn.query(`delete from products where id=? limit 1`, [id])
    return true
  }
}
