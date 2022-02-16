import { Field, InputType, Int } from '@nestjs/graphql'
import { Image } from './image'

@InputType()
export class ProductUpdateInput {
  @Field({ nullable: true })
  id: number
  @Field({ nullable: true })
  product: string
  @Field({ nullable: true })
  price: number
  @Field((type) => [Image], { nullable: true })
  images: Image[]
  @Field((type) => [Int], { nullable: true })
  categories: number[]
}
