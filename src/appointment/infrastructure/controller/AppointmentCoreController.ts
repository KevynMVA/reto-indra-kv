import { SQSEvent } from "aws-lambda";
import { Appointment } from "../../domain/entities/Appointment";
import { AppointmentCoreApplicationService } from "../../application/services/AppointmentCoreApplicationService";
import { HANDLER_EVENTS, HTTP_STATUS_CODE, HTTP_STATUS_CODE_MESSAGE } from "../../../common/utils/Constants";
import { CustomException } from "../../../common/exceptions/CustomException";
import { BaseBody } from "../../../common/dto/BaseBody";
import { Logger } from "../../../common/utils/Logger";
import { ApiMapper } from "../../../common/mappers/ApiMapper";

const appointmentCoreApplicationService = new AppointmentCoreApplicationService();

export const main = async (event: any) => {
    Logger.info('Iniciando Core Controller');
    try {
        let response;
        if (HANDLER_EVENTS.SQS in event) {
            response = await handleSQSEvent(event as SQSEvent);
        } else {
            Logger.error("Tipo de evento desconocido", event);
            throw new CustomException("Tipo de evento desconocido", HTTP_STATUS_CODE.BAD_REQUEST);
        }
        return ApiMapper.toResponse(BaseBody.success(response, HTTP_STATUS_CODE_MESSAGE.OK), HTTP_STATUS_CODE.OK);
    } catch (error: any) {
        if (error instanceof CustomException) {
            return ApiMapper.toResponse(BaseBody.error(error.message, error.errors), error.statusCode || HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        }
        return ApiMapper.toResponse(BaseBody.error(error.message), HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
}

const handleSQSEvent = async (event: SQSEvent) => {
    Logger.info('Iniciando handleSQSEvent');
    for (const record of event.Records) {

        const message = JSON.parse(record.body);
        const appointmentData = JSON.parse(message.Message);
        const appointment = new Appointment({
            id: appointmentData.id,
            insuredId: appointmentData.insuredId,
            scheduleId: appointmentData.scheduleId,
            countryISO: appointmentData.countryISO,
            status: appointmentData.status,
            createdAt: new Date(appointmentData.createdAt),
            updatedAt: new Date(appointmentData.updatedAt),
        });

        await appointmentCoreApplicationService.createAppointment(appointment);
    }

    return { appointments: event.Records.length };
}