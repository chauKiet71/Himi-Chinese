let database;
export function setSepayTestDb(value) { database = value; }
export function writeDb(operation) { return operation(database); }
export const readDb = writeDb;
