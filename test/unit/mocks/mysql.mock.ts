export const mysqlClConnectionMock = {
    execute: jest.fn(),
    end: jest.fn()
};

export const getConnectionMysql = jest.fn().mockResolvedValue(mysqlClConnectionMock);