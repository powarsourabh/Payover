import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../appointment.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent implements OnInit {

  appointmentForm!: FormGroup;
  
  constructor(
    public dialogRef: MatDialogRef<AppointmentFormComponent>,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    this.appointmentForm = this.fb.group({
      title: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit(): void {
    if (this.appointmentForm.valid) {
      console.log('Form submitted:', this.appointmentForm.value);
      this.dialogRef.close(this.appointmentForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
