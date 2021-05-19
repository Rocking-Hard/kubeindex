
import { Logger, Injectable, Scope }          from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { LogEntry } from './log-entry.entity';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  private readonly logger

  constructor(
    @InjectRepository(LogEntry)
    private logEntryRepository: Repository<LogEntry>
  ){
    super();
  }

  handleKubernetesError(error: any){
    if(error.code && error.code == 'ETIMEDOUT' && error.address){
      this.logger.error("Can't reach cluster " + error.address, error.stack);
    }else if(error.response && error.response.body && error.response.body.code && error.response.body.message){
      var code = error.response.body.code;
      if(code != 404){
        super.error(error.response.body.message, error.stack);
      }
      this.verbose(error.response.body);
    }else if(error){
      super.error(error, error.stack);
    }
    // Always go verbose if verbose
    this.verbose(error);
  }

  log(...args: any[]) {
    super.log(args);
  }

  error(error: any) {
    console.log("Started at ", (new Error().stack.split("at ")[2]).trim());
    super.error(error, error.stack);
  }

  warn(...args: any[]) {
    super.warn(args);
  }

  debug(...args: any[]) {
    super.debug(args);
  }

  verbose(...args: any[]) {
    super.verbose(args);
  }

  public async addLogEntry(message: string, metadata?: any, logType?: string, logAction?: string){
    if(!logType){
      logType = "common";
    }
    if(!logAction){
      logAction = "other";
    }
    this.debug(`Log entry type ${logType} (${logAction}) added with the message: ${message}`);
    const currentDate = new Date();

    var logEntry = {
      logType: logType,
      logAction: logAction,
      message: message,
      created: currentDate
    }
    
    if(metadata){
      logEntry['metadata'] = metadata
    }
    
    await this.logEntryRepository.save(logEntry);
    
  }

  public async logClusterCreated(cluster: any){
    var metadata = {
      clusterId: cluster['id'],
      vendorState: cluster['vendorState'] 
    };

    // We want trace of time
    var log = await this.logEntryRepository.createQueryBuilder("log_entry")
    .where("log_entry.logType = 'clusterChange'")
    .andWhere("log_entry.logAction = 'creating'")
    .andWhere(`log_entry.metadata::jsonb @> \'{"clusterId": ${cluster.id}}\'`)
    .orderBy('log_entry.created', 'DESC')
    .getOne();
    
    if(log.created){
      metadata["started"] = log.created;
    }

    this.addLogEntry(`Cluster ${cluster['formatName']} has been created in Azure and setup properly in CloudGuard.`, 
    metadata, "clusterChange", "created");
  }

  public async logClusterPatched(cluster: any){
    var metadata = {
      clusterId: cluster['id'],
      vendorState: cluster['vendorState'],
      versionInfo: cluster.platformVersionInfo
    };

    // We want trace of time, find entry in logs where it started
    var log = await this.logEntryRepository.createQueryBuilder("log_entry")
    .where("log_entry.logType = 'clusterChange'")
    .andWhere("log_entry.logAction = 'patching'")
    .andWhere(`log_entry.metadata::jsonb @> \'{"clusterId": ${cluster.id}}\'`)
    .orderBy('log_entry.created', 'DESC')
    .getOne();
    
    if(log.created){
      metadata["started"] = log.created;
    }

    this.addLogEntry(`Cluster ${cluster['formatName']} has been patched in Azure.`, metadata, "clusterChange", "patched");
  }

  public async getClusterStartLogEntry(cluster: any, logAction: string){

    var log = await this.logEntryRepository.createQueryBuilder("log_entry")
    .where("log_entry.logType = 'clusterChange'")
    .andWhere(`log_entry.logAction = '${logAction}'`)
    .andWhere(`log_entry.metadata::jsonb @> \'{"clusterId": ${cluster.id}}\'`)
    .orderBy('log_entry.created', 'DESC')
    .getOne();

    return log;
  }

  public async getClusterChangeLogEntries(query?: any){
    if(!query){query = {};}
    var logs = await this.logEntryRepository.find(query);
    return logs;
  }

  public demo(){
    super.error("Error logging activated.");
    this.warn("Warn logging activated.");
    this.debug("Debug logging activated.");
    this.verbose("Verbose logging activated.");
    this.log("Log logging activated");
  }

}