import { CreateAppointmentRequestDto } from '../../../src/appointment/application/dto/request/CreateAppointmentRequestDto';
import { CountriesEnum } from '../../../src/appointment/domain/enums/CountriesEnum';
import { StatusEnum } from '../../../src/appointment/domain/enums/StatusEnum';

export const validAppointmentDto = (): CreateAppointmentRequestDto => ({
    insuredId: '12345',
    scheduleId: 1,
    countryISO: CountriesEnum.PE
});

export const invalidAppointmentDto = (): any => ({
    insuredId: 'abc',
    scheduleId: 'wrong',
    countryISO: CountriesEnum.PE
});

export const mockAppointmentEntity = () => ({
    id: 'uuid',
    insuredId: '12345',
    scheduleId: 1,
    countryISO: CountriesEnum.PE,
    status: StatusEnum.PENDING,
    createdAt: new Date(),
    updatedAt: new Date()
});