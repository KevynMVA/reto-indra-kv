import { Schedule } from "../../../domain/entities/Schedule";
import { CountriesEnum } from "../../../domain/enums/CountriesEnum";
import { StatusEnum } from "../../../domain/enums/StatusEnum";

export interface GetAppointmentResponseDto {
    id: string;
    insuredId: string;
    scheduleId: number;
    countryISO: CountriesEnum;
    status: StatusEnum;
    createdAt: Date;
    updatedAt: Date;
    schedule?: Schedule;
}