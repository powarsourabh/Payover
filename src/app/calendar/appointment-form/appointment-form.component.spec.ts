import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppointmentFormComponent } from './appointment-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { By } from '@angular/platform-browser';

describe('AppointmentFormComponent', () => {
  let component: AppointmentFormComponent;
  let fixture: ComponentFixture<AppointmentFormComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AppointmentFormComponent>>;

  beforeEach(async () => {
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['close']);
    
    await TestBed.configureTestingModule({
      declarations: [ AppointmentFormComponent ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpyObj },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentFormComponent);
    component = fixture.componentInstance;
    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<AppointmentFormComponent>>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with title and date fields', () => {
    const titleInput = fixture.debugElement.query(By.css('input[formControlName="title"]')).nativeElement;
    const dateInput = fixture.debugElement.query(By.css('input[formControlName="date"]')).nativeElement;

    expect(titleInput).toBeTruthy();
    expect(dateInput).toBeTruthy();
  });

  it('should show error messages when fields are empty', () => {
    component.appointmentForm.controls['title'].markAsTouched();
    component.appointmentForm.controls['date'].markAsTouched();
    fixture.detectChanges();

    const titleError = fixture.debugElement.query(By.css('mat-error')).nativeElement;
    expect(titleError).toBeTruthy();
    expect(titleError.textContent).toContain('Title is required');

    const dateError = fixture.debugElement.queryAll(By.css('mat-error'))[1].nativeElement;
    expect(dateError).toBeTruthy();
    expect(dateError.textContent).toContain('Date is required');
  });

  it('should close the dialog with form data on submit when the form is valid', () => {
    component.appointmentForm.controls['title'].setValue('Test Appointment');
    component.appointmentForm.controls['date'].setValue('2024-08-01');
    fixture.detectChanges();

    const saveButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    saveButton.click();

    fixture.whenStable().then(() => {
      expect(dialogRefSpy.close).toHaveBeenCalledWith({
        title: 'Test Appointment',
        date: '2024-08-01'
      });
    });
  });

  it('should close the dialog without form data on cancel', async () => {
    const cancelButton = fixture.debugElement.query(By.css('button[mat-button]')).nativeElement;
    cancelButton.click();
    await fixture.whenStable();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
