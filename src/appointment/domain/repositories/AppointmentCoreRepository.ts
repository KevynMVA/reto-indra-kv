import { Appointment } from "../entities/Appointment";

export interface AppointmentCoreRepository {
    createAppointment(appointment: Appointment): Promise<void>;
}