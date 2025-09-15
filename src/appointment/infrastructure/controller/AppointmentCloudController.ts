import { APIGatewayEvent, SQSEvent } from "aws-lambda";
import { AppointmentCloudApplicationService } from "../../application/services/AppointmentCloudApplicationService";
import { HANDLER_EVENTS, HTTP_METHODS, HTTP_STATUS_CODE_MESSAGE, HTTP_STATUS_CODE } from "../../../common/utils/Constants";
import { CustomException } from "../../../common/exceptions/CustomException";
import { BaseBody } from "../../../common/dto/BaseBody";
import { Logger } from "../../../common/utils/Logger";
import { ApiMapper } from "../../../common/mappers/ApiMapper";

const appointmentCloudApplicationService = new AppointmentCloudApplicationService();

export const handler = async (event: any) => {
    Logger.info('Iniciando handler');
    try {
        let response;
        if (HANDLER_EVENTS.API_GATEWAY in event ) {     
            response = await handleAPIGatewayEvent(event as APIGatewayEvent);
        } else if ( HANDLER_EVENTS.SQS in event ) {
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

const handleAPIGatewayEvent = async (event: APIGatewayEvent) => {
    let response;
    if (event.httpMethod === HTTP_METHODS.GET) {
        response = await appointmentCloudApplicationService.getAppointmentsByInsuredId(event.pathParameters?.insuredId || '');
    }else if (event.httpMethod === HTTP_METHODS.POST) {
        response = await appointmentCloudApplicationService.createAppointment(JSON.parse(event.body || '{}'));
    } else {
        throw new CustomException(HTTP_STATUS_CODE_MESSAGE[HTTP_STATUS_CODE.METHOD_NOT_ALLOWED], HTTP_STATUS_CODE.METHOD_NOT_ALLOWED);
    }
    return response;
}

const handleSQSEvent = async (event: SQSEvent) => {
    const data:any = JSON.parse(event.Records[0].body);
    await appointmentCloudApplicationService.updateAppointment(data?.detail?.appointmentId);
    return data;
}
 