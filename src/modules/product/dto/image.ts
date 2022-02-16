import { Field, ObjectType, InputType } from '@nestjs/graphql'

@ObjectType()
@InputType('ImageInput')
export class Image {
  @Field({ nullable: true })
  id: number
  @Field()
  product_id: number
  @Field()
  description: string
  @Field()
  url: string
}
