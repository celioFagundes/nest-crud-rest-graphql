import { Field, ObjectType } from '@nestjs/graphql'
import { Image } from './image'

@ObjectType()
export class Product {
  @Field()
  id: number
  @Field()
  product: string
  @Field()
  price: number
  @Field((type) => [Image], { nullable: 'items' })
  images: Image[]
}
