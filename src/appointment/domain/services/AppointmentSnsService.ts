import { Appointment } from "../entities/Appointment";

export interface AppointmentSnsService {
    publishAppointmentCreated(appointment: Appointment): Promise<void>;
}