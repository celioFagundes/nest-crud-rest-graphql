import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class ProductCategoryFilter {
  @Field({ nullable: true })
  categoryID: number
}
