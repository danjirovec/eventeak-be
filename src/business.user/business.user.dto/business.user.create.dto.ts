import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsDefined, IsEnum } from 'class-validator';
import { Role } from 'src/enum/enum';

@InputType('CreateBusinessUser')
export class CreateBusinessUserDto {
  @IsNotEmpty()
  @Field(() => ID)
  businessId!: string;

  @IsNotEmpty()
  @Field(() => ID)
  userId!: string;

  @IsDefined()
  @IsEnum(Role, { each: true })
  @Field(() => Role, { defaultValue: Role.User })
  role!: Role;
}
