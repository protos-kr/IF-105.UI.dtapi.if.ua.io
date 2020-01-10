import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { HttpService } from "../../shared/http.service";
import { Group } from "../entity.interface";
import { MatTableDataSource, MatTable } from "@angular/material";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { GroupDialogAddComponent } from '../groupDialogAdd/groupDialogAdd.component';
import { GroupDialogDelComponent } from '../groupDialogDel/groupDialogDel.component';
import { GroupDialogEditComponent } from '../groupDialogEdit/groupDialogEdit.component';
import { GroupDialogViewComponent } from '../groupDialogView/groupDialogView.component';

@Component({
  selector: "app-group",
  templateUrl: "./group.component.html",
  styleUrls: ["./group.component.scss"],
})
export class GroupComponent implements OnInit {
  listGroups: Group[] = [];
  dataSource = new MatTableDataSource<Group>();
  displayedColumns: string[] = [
    "id",
    "name",
    "but_student",
    "but_edit",
    "but_del"
  ];

  @ViewChild("table", { static: true }) table: MatTable<Group>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(protected httpService: HttpService, public dialog: MatDialog) {}

  ngOnInit() {
    this.viewAllGroups();
  }

  viewAllGroups() {
    this.httpService.getRecords("group").subscribe((result: Group[]) => {
      this.listGroups = result;
      this.dataSource.data = this.listGroups;
      console.log(result);
    });
    this.dataSource.paginator = this.paginator;
  }

  // add modal window for add new group
  addGroupDialog(group: Group): void {
    const dialogRef = this.dialog.open(GroupDialogAddComponent, {
      width: "500px",
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      console.log(result);
      if (result) {
        this.addGroup(result);
      }
    });
  }
  /** Add new group*/
  addGroup(group: Group) {
    this.httpService.insertData("group", group).subscribe((result: Group[]) => {
      this.listGroups.push(result[0]);
      this.table.renderRows();
      this.dataSource.paginator = this.paginator;
      console.log(result);
    });
  }
  // add modal window for confirm delete
  deleteGroupDialog(group: Group): void {
    const dialogRef = this.dialog.open(GroupDialogDelComponent, {
      width: "300px",
      data: group
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      if (result) {
        this.delGroup(result);
      }
    });
  }
  /** Delete group */
  delGroup(group: Group) {
    this.httpService.del("group", group.group_id).subscribe((result: any) => {
      if (result) {
        this.listGroups = this.listGroups.filter(gr => gr !== group);
        this.dataSource.data = this.listGroups;
        this.table.renderRows();
        this.dataSource.paginator = this.paginator;
      }
      console.log(result);
    }, (error: any) => {
      alert("You don't delete group with students!");
    });
  }
  // add modal window for edit group
  editGroupDialog(group: Group): void {
    const dialogRef = this.dialog.open(GroupDialogEditComponent, {
      width: "500px",
      data: group
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      console.log(result);
      if (result) {
        this.editGroup(result);
      }
    });
  }
  /** Edit group */
  editGroup(group: Group): void {
    this.httpService.update('group', group.group_id, group).subscribe((result: Group[]) => {
      console.log(result);
      const index: number = result
        ? this.listGroups.findIndex(
            gr => gr.group_id === result[0].group_id
          )
        : -1;
      if (index > -1) {
        this.listGroups[index] = result[0];
        console.log(this.dataSource.data);
        this.table.renderRows();
      }
    });
  }

  // add modal window for view groups by speciality or faculty
  viewGroupDialog(action: string): void {
    const dialogRef = this.dialog.open(GroupDialogViewComponent, {
      width: "500px",
      data: {action: action}
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      console.log(result);
      if (result) {
        this.viewGroups(result.action, result.id);
      }
    });
  }
  /** View groups by speciality or faculty */
  viewGroups(action: string, id: number): void {
    this.httpService.getGroups(action, id).subscribe((result: any) => {
      console.log(result);
      if (result.hasOwnProperty('response')) {
        this.dataSource.data = [];
        //this.table.renderRows();
      }
      else {
        this.dataSource.data = result;
        this.table.renderRows();
        this.dataSource.paginator = this.paginator;
      }
    });
  }

}