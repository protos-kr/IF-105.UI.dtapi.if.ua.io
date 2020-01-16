import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Faculty } from 'src/app/shared/entity.interface';


@Component({
  selector: 'app-create-edit',
  templateUrl: './create-edit.component.html',
  styleUrls: ['./create-edit.component.scss']
})
export class CreateEditComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<CreateEditComponent>, @Inject(MAT_DIALOG_DATA) public data: Faculty) {}
  @ViewChild('addform', { static: false }) addform;

  addForm = new FormGroup({
    faculty_name: new FormControl('',
      [
        Validators.required,
        Validators.pattern('[а-яА-ЯіІїЄє ]*')
      ]),
    faculty_description: new FormControl('',
      [
        Validators.required,
        Validators.pattern('[а-яА-ЯіІїЄє ]*')
      ])
  });
  onSubmit(): void {
    this.dialogRef.close(this.addForm.value);
}

onDismiss(): void {
  this.dialogRef.close(false);
}

getErrorMessageName(form: FormGroup) {
  return form.get('faculty_name').hasError('required') ? 'Це поле є обовязкове*' :
    form.get('faculty_name').hasError('pattern') ? 'Поле містить недопустимі символи або (Цифри, латинські букви)' :
      '';
}

getErrorMessageDescription(form: FormGroup) {
  return form.get('faculty_description').hasError('required') ? 'Це поле є обовязкове*' :
    form.get('faculty_description').hasError('pattern') ? 'Поле містить недопустимі символи або (Цифри, латинські букви)' :
      '';
}
ngOnInit() {

  if (this.data) {
    this.addForm.patchValue({
      faculty_name: this.data.faculty_name,
      faculty_description: this.data.faculty_description,
    });
  }
}
}