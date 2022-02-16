import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType()
@InputType('CategoryInput')
export class Category {
  @Field({ nullable: true })
  id: number
  @Field()
  category: string
}
