import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


export interface Appointment {
  id: number;
  title: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {


  private appointments: Appointment[] = [];
  // private appointmentsSubject = new BehaviorSubject<Appointment[]>(this.loadAppointments());
  private appointmentsSubject: BehaviorSubject<Appointment[]> = new BehaviorSubject<Appointment[]>([]);

  constructor() {
    this.loadAppointments();
  }

  getAppointments() {
    return this.appointmentsSubject.asObservable();
  }




  addAppointment(appointment: Appointment) {
    const appointments = this.loadAppointments();
    appointments.push(appointment);
    this.saveAppointments(appointments);
    this.appointmentsSubject.next(appointments);

  }
  saveAppointments(appointments: Appointment[]) {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }



  deleteAppointment(id: number) {
    let appointments = this.loadAppointments();
    appointments = appointments.filter(appointment => appointment.id !== id);
    this.saveAppointments(appointments);
    this.appointmentsSubject.next(appointments);
  }



  private loadAppointments(): Appointment[] {
    const appointments = localStorage.getItem('appointments');
    if(appointments){
      this.appointments = JSON.parse(appointments).map((appointment : any) => ({
        ...appointment,
        date : new Date(appointment.date)
      }));
    }
    this.appointmentsSubject.next(this.appointments);

    return appointments ? JSON.parse(appointments) : [];
  }

  updateAppointment(updatedAppointment: Appointment) {
    const appointments = this.loadAppointments();
    const index = appointments.findIndex(appointment => appointment.id === updatedAppointment.id);
    if (index !== -1) {
      appointments[index] = updatedAppointment;
      this.saveAppointments(appointments);
      this.appointmentsSubject.next(appointments);
    }
  }

}
