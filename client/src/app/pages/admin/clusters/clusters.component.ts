import { Component, ViewChild }             from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';
import { MatSort }                          from '@angular/material/sort';
import {MatTableDataSource}                 from '@angular/material/table';

import { ConfirmDialogComponent }     from '../../../components/confirm-dialog/confirm-dialog.component';

import { PageService }        from '../../../services/page.service';
import { CloudGuardDataSource }        from '../../../services/cloudguard.data-source';
import { ClusterService } from 'src/app/services/cluster.service';

@Component({
  selector: 'app-admin-clusters',
  templateUrl: './clusters.component.html',
  styleUrls: ['./clusters.component.scss']
})

export class ClustersComponent {
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatSort) sort: MatSort;
  public clusters: any[] = [];
  displayedColumns: string[] = ['name', 'project.name', 'vendorState', 'action'];
  public filterText = "";

  constructor(
    public pageService: PageService,
    private clusterService: ClusterService,
    private cloudGuardDataSource: CloudGuardDataSource,
    public dialog: MatDialog,
    public router: Router
  ) { 

    this.pageService.initBreadcrumbs("Admin", "/admin");
    this.pageService.addBreadcrumb("Clusters");

    this.dataSource = new MatTableDataSource();

    this.cloudGuardDataSource.getClusters().subscribe((response:any) => {
      this.dataSource.data = response;
    });

  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    
  }

  public filterTextChanged(event: Event) {
    console.log("CHANGED");
    this.dataSource.filter = this.filterText.trim().toLowerCase();
  }


  deleteCluster(clusterToDelete): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          message: "Confirm deletion of " + clusterToDelete.name,
          verifiyText: clusterToDelete.name
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.clusterService.deleteCluster(clusterToDelete).subscribe(result => {
          this.router.navigate(['/admin/clusters']);
        });

      }
    });
  }



}
