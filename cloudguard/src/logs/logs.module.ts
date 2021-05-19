import { Module }               from '@nestjs/common';
import { TypeOrmModule }        from '@nestjs/typeorm';

import { LogsController }   from './logs.controller';
import { ResponseService }  from '../common/response.service';

import { LogEntry } from './log-entry.entity';

import { LoggerService }        from './logs.service';


@Module({
  controllers: [ LogsController ],
  imports: [
    TypeOrmModule.forFeature([LogEntry])
  ],
  providers: [
    LoggerService,
    ResponseService
  ],
  exports: [
    LoggerService,
    ResponseService
  ]
})
export class LoggerModule {}
