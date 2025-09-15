jest.mock('../../../../../src/appointment/infrastructure/config/MysqlDatabaseConfig', () => ({
    __esModule: true,
    default: jest.fn()
}));



import getConnectionMysqlCl from '../../../../../src/appointment/infrastructure/config/MysqlDatabaseConfig';
import { AppointmentCoreMysqlRepository } from '../../../../../src/appointment/infrastructure/repository/mysql/AppointmentCoreMysqlRepository';
import { mysqlClConnectionMock } from '../../../mocks/mysql.mock';
import { mockAppointmentEntity } from '../../../steps/appointmentSteps';



describe('AppointmentCoreMysqlRepository', () => {
    let repository: AppointmentCoreMysqlRepository;

    beforeEach(() => {
        (getConnectionMysqlCl as jest.Mock).mockResolvedValue(mysqlClConnectionMock);
        repository = new AppointmentCoreMysqlRepository();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createAppointment', () => {
        it('debería insertar exitosamente', async () => {
            mysqlClConnectionMock.execute.mockResolvedValueOnce({});
            await repository.createAppointment(mockAppointmentEntity());
            expect(mysqlClConnectionMock.execute).toHaveBeenCalled();
        });

        it('debería lanzar error si falla ejecución', async () => {
            mysqlClConnectionMock.execute.mockRejectedValue(new Error('Mysql error'));
            await expect(repository.createAppointment(mockAppointmentEntity()))
                .rejects.toThrow('Error insertar appointment');
        });
    });
});