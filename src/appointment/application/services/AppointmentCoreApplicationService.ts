import { CustomException } from "../../../common/exceptions/CustomException";
import { HTTP_STATUS_CODE } from "../../../common/utils/Constants";
import { Appointment } from "../../domain/entities/Appointment";
import { EventBridgeService } from "../../infrastructure/aws/eventbridge/EventbridgeService";
import { AppointmentCoreMysqlRepository } from "../../infrastructure/repository/mysql/AppointmentCoreMysqlRepository";
import { appointmentCoreSchema } from "../validations/AppointmentCoreSchema";


export class AppointmentCoreApplicationService {
    private readonly appointmentCoreRepository;
    private readonly eventBridgeService;

    constructor() {
        this.appointmentCoreRepository = new AppointmentCoreMysqlRepository();
        this.eventBridgeService = new EventBridgeService();
    }

    async createAppointment(appointment: Appointment): Promise<any> {
        const result = appointmentCoreSchema.safeParse(appointment);
        if (!result.success) {
            const zodError = result.error;
            const formattedErrors = zodError.flatten().fieldErrors;
            throw new CustomException("Datos inválidos", HTTP_STATUS_CODE.BAD_REQUEST, formattedErrors);
        }
        await this.appointmentCoreRepository.createAppointment(appointment);
        await this.eventBridgeService.publishAppointmentConfirmed(appointment.id);
        return appointment;
    }
}