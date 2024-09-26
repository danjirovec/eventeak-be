import { IsNotEmpty, IsString } from 'class-validator';
import { InputType, Field, ID } from '@nestjs/graphql';

@InputType('AnonymizeUser')
export class AnonymizeUserDto {
  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  userId!: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  businessId!: string;
}
