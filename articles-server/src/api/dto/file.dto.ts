import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { File } from 'shared/api';

export class FileDto implements File {
  @IsString()
  @ApiProperty()
  @Expose()
  fileUrl: string;

  @IsString()
  @ApiProperty()
  @Expose()
  fileName: string;

  @ApiProperty()
  @IsString()
  @Expose()
  mimeType: string;
}
