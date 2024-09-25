import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType('CreateBusiness')
export class CreateBusinessDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  logoUrl?: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => ID)
  userId!: string;
}
