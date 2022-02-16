import { Field, InputType } from '@nestjs/graphql'
import { Image } from './image'

@InputType()
export class ProductInput {
  @Field({ nullable: true })
  id: number
  @Field()
  product: string
  @Field()
  price: number
  @Field(() => [Image], { nullable: true })
  images: Image[]
}
