import { Field, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@ObjectType('PublishableKey')
export class PublishableKeyDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  publishableKey!: string;
}
