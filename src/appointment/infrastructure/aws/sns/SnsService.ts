import { PublishCommand } from "@aws-sdk/client-sns";
import { Appointment } from "../../../domain/entities/Appointment";
import { EnvConfig } from "../../config/EnvConfig";
import { snsClient } from "../../config/SnsConfig";
import { AppointmentSnsService } from "../../../domain/services/AppointmentSnsService";
import { CustomException } from "../../../../common/exceptions/CustomException";
import { HTTP_STATUS_CODE } from "../../../../common/utils/Constants";
import { Logger } from "../../../../common/utils/Logger";

export class SnsService implements AppointmentSnsService {
    private readonly topicArn: string;
    private readonly envConfig: EnvConfig;

    constructor() {
        this.envConfig = new EnvConfig();
        this.topicArn = this.envConfig.get<string>('SNS_APPOINTMENT_CREATED_TOPIC_ARN');
    }

    async publishAppointmentCreated(appointment: Appointment): Promise<void> {

        try {
            const params = {
                Message: JSON.stringify(appointment),
                TopicArn: this.topicArn,
                MessageAttributes: {
                    countryISO: {
                        DataType: 'String',
                        StringValue: appointment.countryISO,
                    }
                }     
            };
    
            await snsClient.send(new PublishCommand(params));
        } catch (error) {
            Logger.log('Error al publicar en SNS');
            throw new CustomException(`Error al publicar en SNS`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR); 
        }
        
    }
}