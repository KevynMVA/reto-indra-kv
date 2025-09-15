import { BaseBody } from '../dto/BaseBody';

export class ApiMapper {
    static toResponse = (baseBody: BaseBody<any>, statusCode: number) => {
        return {
            statusCode,
            body: JSON.stringify(baseBody)
        }
    }
}
