import mysql from 'mysql2/promise';
import { CustomException } from '../../../common/exceptions/CustomException';
import { HTTP_STATUS_CODE } from '../../../common/utils/Constants';

const configDB = {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT),

};


const getConnectionMysql = async () => {
    try {
        const connection = await mysql.createConnection(configDB);
        return connection;
    } catch (error: any) {
        throw new CustomException(`Error al conectar Mysql`, HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR);
    }
}

export default getConnectionMysql;