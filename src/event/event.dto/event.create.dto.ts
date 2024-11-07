import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDate } from 'class-validator';

@InputType('CreateEvent')
export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  @Field()
  name!: string;

  @IsNotEmpty()
  @IsDate()
  @Field()
  date!: Date;

  @IsNotEmpty()
  @Field(() => ID)
  templateId!: string;

  @IsNotEmpty()
  @Field(() => ID)
  businessId!: string;
}
