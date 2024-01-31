import { PoolConnection, QueryOptions } from "mariadb";

export declare type Dict<T> = { [key: string]: T };

export type MySqlRow<T = string | number | boolean | Dict<any> | void> = {
    [column: string]: T;
}

export type OkPacket = {
    affectedRows: number;
    insertId: number;
    warningStatus: any;
}

export interface DbConnection extends PoolConnection {
    execute<T = Object[] & OkPacket>(query: string | QueryOptions, values?: any[]): Promise<T>;
    query<T = Object[] & OkPacket>(query: string | QueryOptions, values?: any[]): Promise<T>;
    [Symbol.dispose](): void;
}