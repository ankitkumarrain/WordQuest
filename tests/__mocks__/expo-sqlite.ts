// Jest mock for expo-sqlite

class MockDatabase {
  private tables: Record<string, any[]> = {};

  async execAsync(_sql: string): Promise<void> {
    return Promise.resolve();
  }

  async runAsync(
    sql: string,
    ...params: any[]
  ): Promise<{ lastInsertRowId: number; changes: number }> {
    if (sql.includes('INSERT') && sql.includes('sync_queue')) {
      const [mutation_id, entity_type, entity_id, payload, created_at, retry_count] = params;
      if (!this.tables['sync_queue']) this.tables['sync_queue'] = [];
      this.tables['sync_queue'] = this.tables['sync_queue'].filter(
        (r) => r.mutation_id !== mutation_id
      );
      this.tables['sync_queue'].push({
        mutation_id,
        entity_type,
        entity_id,
        payload,
        created_at,
        retry_count: retry_count ?? 0,
      });
    } else if (sql.includes('DELETE FROM sync_queue')) {
      if (this.tables['sync_queue']) {
        const deletedIds = new Set(params);
        this.tables['sync_queue'] = this.tables['sync_queue'].filter(
          (r) => !deletedIds.has(r.mutation_id)
        );
      }
    }
    return Promise.resolve({ lastInsertRowId: 1, changes: 1 });
  }

  async getAllAsync<T>(sql: string, ...params: any[]): Promise<T[]> {
    if (sql.includes('FROM sync_queue')) {
      const limit = params[0] ?? 50;
      return Promise.resolve((this.tables['sync_queue'] || []).slice(0, limit) as T[]);
    }
    return Promise.resolve([] as T[]);
  }

  async getFirstAsync<T>(sql: string, ..._params: any[]): Promise<T | null> {
    if (sql.includes('COUNT(*) as count FROM sync_queue')) {
      const count = (this.tables['sync_queue'] || []).length;
      return Promise.resolve({ count } as unknown as T);
    }
    return Promise.resolve(null);
  }

  async withTransactionAsync<T>(callback: () => Promise<T>): Promise<T> {
    return callback();
  }
}

const mockDb = new MockDatabase();

export async function openDatabaseAsync(_dbName: string): Promise<MockDatabase> {
  return Promise.resolve(mockDb);
}
