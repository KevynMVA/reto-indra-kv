import { Appointment } from "../entities/Appointment";

export interface AppointmentCloudRepository {
    getAppointmentsByInsuredId(insuredId: string): Promise<Appointment[]>;
    createAppointment(appointment: Appointment): Promise<Appointment>;
    updateAppointment(appointmentId: string): Promise<any>;
}