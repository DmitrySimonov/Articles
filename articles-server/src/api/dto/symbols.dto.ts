import { ApiProperty } from '@nestjs/swagger';
import { Symbols } from '@/shared/types/symbols';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class SymbolsDto implements Symbols {
  @IsString()
  @ApiProperty()
  @Expose()
  symbol: string;

  @IsString()
  @ApiProperty()
  @Expose()
  ric: string;
}
