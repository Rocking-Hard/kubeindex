import { Component }                        from '@angular/core';
import { Router, ActivatedRoute, Params }   from '@angular/router';
import { MatDialog }                        from '@angular/material/dialog';

import { CreateUserDialogComponent }        from './create-user-dialog.component'
import { ConfirmDialogComponent }           from '../../../components/confirm-dialog/confirm-dialog.component';

import { PageService }                      from '../../../services/page.service';
import { UsersService }                     from './users.service';


@Component({
  selector: 'app-admin-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  public filterText = "";

  constructor(
    public pageService: PageService,
    public usersService: UsersService,
    public dialog: MatDialog
  ) { 
    this.pageService.initBreadcrumbs("Admin", "/admin");
    this.pageService.addBreadcrumb("Users");
  }

  createUserDialog(): void {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '350px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {});
  }

  public filteredUsers(){
    if(!this.usersService.users || !this.usersService.users.length){
        return []; 
    }
    if(this.filterText == ""){
        return this.usersService.users;
    }
    return this.usersService.users.filter(user => user.username.includes(this.filterText));
  }

  confirmDelete(user): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '450px',
        data: {
          message: "Confirm deletion of user " + user.username
        }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.usersService.delete(user);
      }
    });
  }

}
