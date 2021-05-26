import { NgModule }           	    from '@angular/core';
import { Routes, RouterModule }     from '@angular/router';
import { DocsComponent } 		        from './docs.component';
import { DocsMenuComponent } 		    from './docs-menu.component';
import { SharedModule }             from '../../shared/shared.module';


const routes: Routes = [{
  path: '',
  component: DocsComponent,
}];

@NgModule({
  imports:      [
  	SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ DocsComponent, DocsMenuComponent ],
  exports:      [ RouterModule ],
  providers:    []
})
export class DocsModule { }
