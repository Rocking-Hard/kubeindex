import { NgModule }           	    from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';
import { LogsComponent } 		        from './logs.component';

import { SharedModule }             from '../../shared/shared.module';


const routes: Routes = [{
  path: '',
  component: LogsComponent,
}];

@NgModule({
  imports:      [
  	SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ LogsComponent ],
  exports:      [ RouterModule ],
  providers:    []
})
export class LogsModule { }
