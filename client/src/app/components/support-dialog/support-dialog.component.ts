import { Component, Inject }                from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA }    from '@angular/material/dialog';
import { Router }                           from '@angular/router';


@Component({
  selector: 'support-dialog',
  templateUrl: './support-dialog.component.html',
  styleUrls: ['./support-dialog.component.scss']
})
export class SupportDialogComponent {

  public supportSubject: string = "";
  public supportText: string = "";
  
  constructor(
    public dialogRef: MatDialogRef<SupportDialogComponent>, 
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {

  }
}
