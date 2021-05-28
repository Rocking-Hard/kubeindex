import { Component, Input }     from '@angular/core';

import { interval }             from 'rxjs';

import { PreferenceService }    from '../../services/preference.service';
import { ClusterService }       from '../../services/cluster.service';
import { NamespaceService }     from '../../services/namespace.service';
import { ProjectsService }      from '../../services/projects.service';

@Component({
  selector: 'cluster-status',
  templateUrl: './cluster-status.component.html',
  styleUrls: ['./cluster-status.component.scss']
})
export class ClusterStatusComponent {

  @Input() cluster: any;
  @Input() placeholder: string;

  public pollTimeout = null;
  public estimate = null;
  public progressbarType = "determinate";
  public progressbarValue = 100;
  public progressStart = 100;
  public progressbarTick: number = 0;

  constructor(
    public clusterService: ClusterService, 
    public namespaceService: NamespaceService,
    public preferenceService: PreferenceService,
    public projectsService: ProjectsService
    ) { 
  }
    
  ngOnDestroy() {
    this.stopPollTimer();
  }

  async pollClusterState(){
    const self = this;
    var projectFormatName = this.projectsService.currentProject.formatName;
    if(this.cluster.project && this.cluster.project.formatName){
      projectFormatName = this.cluster.project.formatName;
    }else if(this.cluster.projects && this.cluster.projects[0] && this.cluster.projects[0].formatName){
      projectFormatName = this.cluster.projects[0].formatName;
    }    
    this.cluster['vendorState'] = await this.clusterService.fetchProjectClusterStatus(projectFormatName, this.cluster).toPromise();
    if(!this.clusterService.needsPolling(this.cluster)){
      
      this.stopPollTimer();
      // One final refresh;
      await this.clusterService.refresh(this.cluster);
      return;
    }else{
      if(!this.estimate){
        await this.getAndStartEstimation(this.cluster.vendorState);
      }
    }
    return setTimeout(function(){
      self.pollClusterState();
    }, 7000);
  }

  async stopPollTimer(){
    clearTimeout(this.pollTimeout);
    this.pollTimeout = null;
  }

  
  /*
  * TODO make this more compact
  */
  public async getAndStartEstimation(type?: string){
    this.progressbarTick = 0;

    if(!this.estimate && this.cluster?.formatName){
      this.estimate = await this.clusterService.getEstimation(this.cluster, type).toPromise();

      if(!this.estimate.averageTime){
        this.estimate['timeMessage'] = "Can't estimate time for modification.";
        this.progressbarType = "indeterminate";
        return false;
      }

      var startTime = new Date(this.estimate.startTime);
      var currentTime = new Date(this.estimate.currentTime);
      var elapsedSeconds = Math.abs((currentTime.getTime() - startTime.getTime()) / 1000);
      var timeLeft = this.estimate.averageTime - elapsedSeconds;
      timeLeft = Math.round(timeLeft > 0 ? timeLeft : 0);
      this.estimate['timeMessage'] = "Estimating it to take " + Math.round(this.estimate.averageTime - elapsedSeconds) + " seconds in total.";
      this.progressbarValue = 100;
      this.progressStart = this.progressbarValue - (elapsedSeconds / this.estimate.averageTime) * 100
      this.startTimer(timeLeft);
    }

    return true;
  }

  startTimer(seconds: number) {
    const limit = seconds * 5;
    const timer$ = interval(200);

    const sub = timer$.subscribe((tick) => {
      if (!limit || this.progressbarTick >= limit) {
        sub.unsubscribe();
        return;
      }
      this.progressbarValue = this.progressStart - tick * 100 / limit;
      this.progressbarTick = tick;
      
    });
  }

  ngOnChanges(changes) {
    this.pollTimeout = this.pollClusterState();
  }

}
