import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { Resolver } from '@nestjs/graphql';
import { RowDto } from './row.dto/row.dto';
import { Row } from './row.entity/row.entity';

@Resolver(() => RowDto)
export class RowResolver {
  constructor(
    @InjectQueryService(Row)
    readonly rowService: QueryService<RowDto>,
  ) {}
}
