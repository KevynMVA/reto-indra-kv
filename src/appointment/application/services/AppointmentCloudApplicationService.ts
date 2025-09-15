import { CustomException } from "../../../common/exceptions/CustomException";
import { zodToCustomException } from "../../../common/mappers/CustomExceptionMapper";
import { HTTP_STATUS_CODE } from "../../../common/utils/Constants";
import { Logger } from "../../../common/utils/Logger";
import { AppointmentCloudDynamoRepository } from "../../infrastructure/repository/dynamodb/AppointmentCloudDynamoRepository";
import { SnsService } from "../../infrastructure/aws/sns/SnsService";
import { CreateAppointmentRequestDto } from "../dto/request/CreateAppointmentRequestDto";
import { AppointmentMapper } from "../mappers/AppointmentMapper";
import { createAppointmentCloudSchema } from "../validations/CreateAppointmentCloudSchema";
import { GetAppointmentResponseDto } from "../dto/response/GetAppointmentResponseDto";

export class AppointmentCloudApplicationService {
    private readonly appointmentCloudRepository;
    private readonly snsService;
    constructor() {
        this.appointmentCloudRepository = new AppointmentCloudDynamoRepository();
        this.snsService = new SnsService();
    }

    async createAppointment(data: CreateAppointmentRequestDto): Promise<GetAppointmentResponseDto> {
        Logger.info('Inicio del createAppointment');
        const result = createAppointmentCloudSchema.safeParse(data);

        if (!result.success) {
            throw new CustomException("Datos inválidos", HTTP_STATUS_CODE.BAD_REQUEST, zodToCustomException(result.error));
        }

        const appointment = AppointmentMapper.toDomain(data);
        const response = await this.appointmentCloudRepository.createAppointment(appointment);
        await this.snsService.publishAppointmentCreated(appointment);
        return AppointmentMapper.entityToDto(response);
    }

    async updateAppointment(appointmentId: string): Promise<any> {
        Logger.info('Inicio del updateAppointment');
        if (!appointmentId) {
            throw new CustomException("Es necesario appointmentId", HTTP_STATUS_CODE.BAD_REQUEST);
        }
        return await this.appointmentCloudRepository.updateAppointment(appointmentId);
    }

    async getAppointmentsByInsuredId(insuredId: string): Promise<any> {
        Logger.info('Inicio del getAppointmentsByInsuredId');
        if (!insuredId) {
            throw new CustomException("Es necesario insuredId", HTTP_STATUS_CODE.BAD_REQUEST);
        }
        return await this.appointmentCloudRepository.getAppointmentsByInsuredId(insuredId);
    }
}