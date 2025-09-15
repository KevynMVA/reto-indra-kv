import { CreateAppointmentRequestDto } from "../appointment/application/dto/request/CreateAppointmentRequestDto";
import { GetAppointmentResponseDto } from "../appointment/application/dto/response/GetAppointmentResponseDto";

export interface AppointmentRequest {
  insuredId: string,
  scheduleId: number,
  countryISO: "PE" | "CL"
};

export interface AppointmentResponse {
  success: true,
  data: {
    id: string,
    insuredId: string,
    scheduleId: number,
    countryISO: "PE" | "CL",
    status: "PENDING" | "COMPLETED",
    createdAt: string,
    updatedAt: string,
  }
}

export interface AppointmentListResponse {
  success: boolean;
  data: {
    id: string,
    insuredId: string,
    scheduleId: number,
    countryISO: "PE" | "CL",
    status: "PENDING" | "COMPLETED",
    createdAt: string,
    updatedAt: string,
  }[]
}