import { Image } from './dto/image'

export class Product {
  id: number
  product: string
  price: number
  images: Image[]
}
