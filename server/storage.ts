import { PostgresStorage } from './postgres-storage';
import type { IStorage } from './storage-types';

// Export storage instance that uses PostgreSQL
const storage: IStorage = new PostgresStorage();

export { storage };
