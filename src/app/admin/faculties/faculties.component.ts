import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTable, MatSnackBar } from '@angular/material';
import { Faculty } from 'src/app/shared/entity.interface';
import { ModalService } from '../../shared/services/modal.service';
import { FacultiesService } from './faculties.service';
import { PaginatorService } from 'src/app/shared/paginator/paginator.service';
import { PaginationModel } from 'src/app/shared/paginator/PaganationModel';
import { PaginatorComponent } from 'src/app/shared/paginator/paginator.component';

@Component({
  selector: 'app-faculties',
  templateUrl: './faculties.component.html',
  styleUrls: ['./faculties.component.scss']
})
export class FacultiesComponent implements OnInit, AfterViewInit {

  /* TABLE  */
  displayedColumns: string[] = ['id', 'name', 'desc', 'action'];
  dataSource = new MatTableDataSource<Faculty>();
  @ViewChild('table', { static: false }) table: MatTable<Element>;
  @ViewChild(PaginatorComponent, {static: false}) paginatorComponent: PaginatorComponent;

  /* for Paginator component */
  length: number;
  paginator: PaginationModel;
  matpaginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private modalService: ModalService,
    private facultyService: FacultiesService,
    public paginatorService: PaginatorService) {
  }

  /*            For Paginator component        */

  PaginData(data: Array<any>) {
    this.dataSource.data = data;
    }

  /*        *****************************************       */

  ngOnInit(): void {}

  ngAfterViewInit(): void { }

  openFacultyModal(facultyObj?: Faculty) {
    if (!facultyObj) {
      this.facultyService.openAddFacultyDialog()
        .subscribe((dialogResult: Faculty) => {
          if (dialogResult) {
          this.createFaculty(dialogResult);
          }});
    } else {
      this.facultyService.openAddFacultyDialog(facultyObj)
        .subscribe((dialogResult: Faculty) => {
          if (dialogResult) {
            this.updateFaculty(facultyObj.faculty_id, dialogResult);
          }
        });
    }
  }

  createFaculty(faculty: Faculty) {
    this.facultyService.createFaculty(faculty)
      .subscribe(() => {
        this.paginatorComponent.getRange(data => this.dataSource.data = data);
        this.paginatorComponent.countRecords++;
        this.openSnackBar('Факультет додано');
      },
        err => {
          if (err.error.response.includes('Duplicate')) {
            this.modalService.openErrorModal(`Факультети "${faculty.faculty_name}" вже існує`);
          }
        }
      );
  }


  updateFaculty(id: number, faculty: Faculty) {
    this.facultyService.updateFaculty(id, faculty)
      .subscribe(() => {
        this.openSnackBar('Факультет оновлено');
        this.paginatorComponent.getRange(data => this.dataSource.data = data);
      },
        err => {
          if (err.error.response.includes('Error when update')) {
            this.openSnackBar('Інформація про факультет не змінювалась');
          }
        }
      );
  }

  openConfirmDialog(faculty: Faculty) {
    const message = `Підтвердіть видалення факультету "${faculty.faculty_name}"?`;
    this.modalService.openConfirmModal(message, () => this.removeFaculty(faculty.faculty_id));
  }


  removeFaculty(id: number) {
    this.facultyService.deleteFaculty(id)
      .subscribe(() => {
        this.openSnackBar('Факультет видалено');
        this.dataSource.data = this.dataSource.data.filter(item => item.faculty_id !== id);
        if (this.dataSource.data.length > 0) {
          this.paginatorComponent.getRange(data => this.dataSource.data = data);
          this.paginatorComponent.countRecords--;
        } else {
          this.matpaginator.previousPage();
          this.paginatorComponent.getRange(data => this.dataSource.data = data);
          this.paginatorComponent.countRecords--;
        }
      },
        err => {
          if (err.error.response.includes('Cannot delete')) {
            this.modalService.openInfoModal('Неможливо видалити факультет. Потрібно видалити групу цього факультету');
          } else {
            this.modalService.openErrorModal('Помилка видалення');
          }
        });
  }
  openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2500,
    });
  }
}
