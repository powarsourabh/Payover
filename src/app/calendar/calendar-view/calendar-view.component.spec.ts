import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarViewComponent } from './calendar-view.component';
import { AppointmentService } from '../appointment.service';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CalendarViewComponent', () => {
  let component: CalendarViewComponent;
  let fixture: ComponentFixture<CalendarViewComponent>;
  let appointmentServiceSpy: jasmine.SpyObj<AppointmentService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const appointmentServiceSpyObj = jasmine.createSpyObj('AppointmentService', ['getAppointments', 'addAppointment', 'updateAppointment', 'deleteAppointment']);
    const dialogSpyObj = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ CalendarViewComponent ],
      imports: [
        MatDialogModule,
        DragDropModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AppointmentService, useValue: appointmentServiceSpyObj },
        { provide: MatDialog, useValue: dialogSpyObj }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarViewComponent);
    component = fixture.componentInstance;
    appointmentServiceSpy = TestBed.inject(AppointmentService) as jasmine.SpyObj<AppointmentService>;
    dialogSpy = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    appointmentServiceSpy.getAppointments.and.returnValue(of([]));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load month days correctly', () => {
    component.loadMonthDays();
    expect(component.daysInMonth.length).toBeGreaterThan(0);
  });

  it('should open dialog when Create button is clicked', () => {
    const openDialogSpy = spyOn(component, 'openDialog').and.callThrough();
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    expect(openDialogSpy).toHaveBeenCalled();
    expect(dialogSpy.open).toHaveBeenCalled();
  });

  it('should add new appointment after dialog is closed with result', () => {
    const newAppointment = { title: 'Test Appointment', date: new Date() };
    const dialogRefSpy = jasmine.createSpyObj({ afterClosed: of(newAppointment) });
    dialogSpy.open.and.returnValue(dialogRefSpy);

    component.openDialog();
    fixture.detectChanges();

    expect(appointmentServiceSpy.addAppointment).toHaveBeenCalledWith(jasmine.objectContaining(newAppointment));
  });

  it('should filter appointments for a specific day', () => {
    const date = new Date();
    const appointment = { id: 1, title: 'Test Appointment', date: date };
    component.appointments = [appointment];

    const appointmentsForDay = component.getAppointmentsForDay(date.getDate());
    expect(appointmentsForDay.length).toBe(1);
    expect(appointmentsForDay[0]).toEqual(appointment);
  });

  it('should delete an appointment', () => {
    const appointment = { id: 1, title: 'Test Appointment', date: new Date() };
    component.appointments = [appointment];

    component.deleteAppointment(1);
    expect(appointmentServiceSpy.deleteAppointment).toHaveBeenCalledWith(1);
    expect(component.appointments.length).toBe(0);
  });

  it('should toggle appointments visibility', () => {
    component.toggleAppointments(1);
    expect(component.isDaySelected(1)).toBeTrue();

    component.toggleAppointments(1);
    expect(component.isDaySelected(1)).toBeFalse();
  });

  it('should handle drop event correctly', () => {
    const appointment = { id: 1, title: 'Test Appointment', date: new Date() };
    component.appointments = [appointment];

    
  });
});
