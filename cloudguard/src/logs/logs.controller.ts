import { Controller, Get, UseGuards, Param, Post, Patch, Body, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository }     from '@nestjs/typeorm';
import { Repository }           from 'typeorm';
import { ConfigService }        from '@nestjs/config';

import { MustHaveJwtGuard }         from '../auth/must-have-jwt.guard';
import { ProjectRolesGuard }    from '../auth/project-roles.guard';


import { LoggerService }    from './logs.service';
import { ResponseService }  from '../common/response.service';

import { LogEntry }          from './log-entry.entity';



@Controller('logs')
export class LogsController {
    
    constructor(
        private configService: ConfigService,
        private logger: LoggerService,
        @InjectRepository(LogEntry)
        private logEntryRepository: Repository<LogEntry>,
        private responseService: ResponseService
    ) {
        this.logger.setContext(LogsController.name);
    }

    @UseGuards(MustHaveJwtGuard)
    @Get()
    async findAll(): Promise<any> {
        this.logger.verbose("Finding all logs");
        var logEntries = await this.logEntryRepository.find({order: { created: "DESC" }});
        return this.responseService.createResponse(logEntries, "Retrieved all logs.");
    }

    @UseGuards(MustHaveJwtGuard)
    @Delete()
    async removeAll(): Promise<any> {
        this.logger.debug("Deleting all logs");
        var logEntries = await this.logEntryRepository.delete({});
        return this.responseService.createResponse([], "Removed all logs.");
    }
}
