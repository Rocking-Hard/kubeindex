import { Injectable, EventEmitter }         from '@angular/core';
import { Router }  from '@angular/router';
import { BreakpointObserver, Breakpoints }  from '@angular/cdk/layout';
import { Observable }                       from 'rxjs';
import { Subject, zip }                from 'rxjs';
import { map, shareReplay }                 from 'rxjs/operators';

import { LocalStorageService }          from './localstorage.service';
import { AuthService }                  from './auth.service';
import { ProfileService }               from './profile.service';
import { ProjectsService }              from './projects.service';
import { NamespaceService }             from './namespace.service';
import { ClusterService }               from './cluster.service';
import { DeploymentService }            from './deployment.service';

import * as _                           from 'lodash';
import { LogService } from './log.service';

@Injectable({providedIn: 'root'})
export class PageService {

    sideNavOpen: boolean;
    
    public pageTitle: string;
    public breadcrumbs = [];
    public beforeLogin: string = "";
    public subscriptions: Array<any> = [];
    // Loader
    public somethingIsLoading = false;
    public whatIsLoading = "Something is loading";

    constructor(
        public authService: AuthService,
        public localStorageService: LocalStorageService,
        public logService: LogService,
        private breakpointObserver: BreakpointObserver,
        private router: Router,
        public profileService: ProfileService,
        public projectsService: ProjectsService,
        public namespaceService: NamespaceService,
        public clusterService: ClusterService,
        public deploymentService: DeploymentService
    ) {
        this.sideNavOpen = localStorageService.getItem("settingsSession.sideNavOpen");
    }

    toggleSideNav():boolean {
        this.sideNavOpen = !this.sideNavOpen;
        // Save everytime to session
        this.localStorageService.setItem("settingsSession.sideNavOpen", this.sideNavOpen)
        return this.sideNavOpen;
    }

    public pageInit(pageTitle?: string){
        this.wipeBreadcrumbs();
        this.pageTitle = pageTitle;
    }

    public startLoader(message = "Something is loading."){
        this.somethingIsLoading = true;
        this.whatIsLoading = message;
    }

    public stopLoader(){
        this.somethingIsLoading = false;
        this.whatIsLoading = "";
    }

    public trackSubscription(subscription: any){
        this.subscriptions.push(subscription);
    }

    public wipeSubscriptions(){
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    public guard(allowedRoles: string[]):Observable<boolean>{
        return zip(this.profileService.user$, this.projectsService.currentProjectSubject)
        .pipe(map(val => {  
            var user = {}, project = {};
            [user, project] = val;
            if(project['id']){
                return this.authService.hasCorrectRoleInProject(user, project['id'], allowedRoles);
            }
        }));
    }

    public initBreadcrumbs(title: string, url?: string, order?:number){
        this.wipeBreadcrumbs();
        this.addBreadcrumb(title, url, order);
    }

    public wipeBreadcrumbs(){
        this.breadcrumbs = [];
    }

    public addBreadcrumb(title: string, url?: string, order?:number){
        if(!order){order = 0;}
        this.breadcrumbs.push({title: title, url: url, order: order});
    }

    generateProjectBreadcrumbs(pagename: string, cluster?: any, namespace?: any){
        this.wipeBreadcrumbs();
        this.addBreadcrumb("Clusters", this.clusterService.getCurrentUri(), 0);
        if(cluster && cluster.name){
            this.addBreadcrumb(cluster.name, "", 1);
        }
        if(namespace && namespace.metadata && namespace.metadata.name){
            this.addBreadcrumb("Namespaces", this.namespaceService.getCurrentUri(), 2);
            this.addBreadcrumb(namespace.metadata.name, "", 3);
        }
        this.addBreadcrumb(pagename, "", 3);
    }

    public getOrderedBreadcrumbs(){
        return this.breadcrumbs.sort((a, b) => a.order - b.order);
    }

    public isActivePage(path: any, matchRootOnly = false): boolean {
        path = "/"+path;
        if(matchRootOnly){
          return this.router.url.startsWith(path);
        }
        return path === this.router.url;
    }

    public logout() {
        return this.authService.logout().subscribe(
          (resp) => {this.router.navigate(['/']);}
        )
      }

    public displayMessage(message: string, data?: any){
        this.logService.log(message, "message", data, true);
    }

    public isHandset$: Observable<boolean> = 
        this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe( map(result => result.matches), shareReplay());

}
