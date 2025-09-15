import { CustomException } from "../../../../common/exceptions/CustomException";
import { HTTP_STATUS_CODE } from "../../../../common/utils/Constants";
import { Appointment } from "../../../domain/entities/Appointment";
import { AppointmentCoreRepository } from "../../../domain/repositories/AppointmentCoreRepository";
import getConnectionMysql from "../../config/MysqlDatabaseConfig";

export class AppointmentCoreMysqlRepository implements AppointmentCoreRepository {

    async createAppointment(appointment: Appointment): Promise<void> {
        let connection;

        try {
            const formatDateToMySQL = (date: Date): string =>
                date.toISOString().slice(0, 19).replace('T', ' ');

            const query = `INSERT INTO appointments (id, insuredId, scheduleId, countryISO, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                appointment.id,
                appointment.insuredId,
                appointment.scheduleId,
                appointment.countryISO,
                appointment.status,
                formatDateToMySQL(appointment.createdAt),
                formatDateToMySQL(appointment.updatedAt)
            ];
            connection = await getConnectionMysql();
            await connection.execute(query, values);
        } catch (error: any) {
            throw new CustomException(`Error insertar appointment`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
        } finally {
            if (connection) {
                connection.end();
            }
        }
    }
}