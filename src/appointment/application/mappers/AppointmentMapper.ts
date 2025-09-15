import { v4 } from "uuid";
import { Appointment } from "../../domain/entities/Appointment";
import { CreateAppointmentRequestDto } from "../dto/request/CreateAppointmentRequestDto";
import { StatusEnum } from "../../domain/enums/StatusEnum";
import { GetAppointmentResponseDto } from "../dto/response/GetAppointmentResponseDto";

export class AppointmentMapper {
    static toDomain(appointment: CreateAppointmentRequestDto): Appointment {
        return new Appointment(
            {
                id: v4(),
                insuredId: appointment.insuredId,
                scheduleId: appointment.scheduleId,
                countryISO: appointment.countryISO,
                status: StatusEnum.PENDING,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        );
    }

    static entityToDto(appointment: Appointment): GetAppointmentResponseDto {
        return {
            id: appointment.id,
            insuredId: appointment.insuredId,
            scheduleId: appointment.scheduleId,
            countryISO: appointment.countryISO,
            status: appointment.status,
            createdAt: appointment.createdAt,
            updatedAt: appointment.updatedAt,
            schedule: appointment.schedule
        }
    }
}