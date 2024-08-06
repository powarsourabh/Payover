import { Component, OnInit } from '@angular/core';
import { Appointment, AppointmentService } from '../appointment.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrls: ['./calendar-view.component.css']
})
export class CalendarViewComponent implements OnInit{
  appointments: Appointment[] = [];
  currentMonth: Date = new Date();
  daysInMonth: number[] = [];
  selectedDay: number | null = null;



  constructor(private appointmentService: AppointmentService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadMonthDays();

    this.appointmentService.getAppointments().subscribe(appointments => {
      this.appointments = appointments;
    });
  }
 
  loadMonthDays(): void {
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const numDays = new Date(year, month + 1, 0).getDate();
    this.daysInMonth = Array.from({ length: numDays }, (_, i) => i + 1);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AppointmentFormComponent, {
      width: '400px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.appointmentService.addAppointment(result);
        const newAppointment: Appointment = {
          id: Date.now(),
          title: result.title,
          date: new Date(result.date)
        };
        this.appointmentService.addAppointment(newAppointment);
      }
      console.log('The dialog was closed');
    });
  }


  getAppointmentsForDay(day: number): Appointment[] {
    const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate.toDateString() === date.toDateString();
    });
  }

// 
  drop(event: CdkDragDrop<Appointment[]>, day: number) {
    const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
    const appointment = event.item.data as Appointment;
    appointment.date = date;
    this.appointmentService.updateAppointment(appointment);
  }


  

  dropInCalendar(event: CdkDragDrop<Appointment[]>, day: number) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      const appointment = event.container.data[event.currentIndex];
      const date = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), day);
      appointment.date = date;
      this.appointmentService.updateAppointment(appointment);
    }
  }

  deleteAppointment(id: number, ) {
    this.appointmentService.deleteAppointment(id);
    this.appointments = this.appointments.filter(appointment => appointment.id !== id);

  }

  toggleAppointments(day: number): void {
    this.selectedDay = this.selectedDay === day ? null : day;
  }

  isDaySelected(day: number): boolean {
    return this.selectedDay === day;
  }
}
