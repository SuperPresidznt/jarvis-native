/**
 * Base Repository Interface
 * Defines common CRUD operations for all repositories
 *
 * This abstraction layer provides:
 * - Clean interface for database operations
 * - Easy testing with mock implementations
 * - Future-proofing for backend swaps (e.g., SQLite -> API)
 */

/**
 * Base repository interface with common CRUD operations
 * @typeParam T - The entity type
 * @typeParam CreateInput - The input type for creating entities
 * @typeParam UpdateInput - The input type for updating entities
 */
export interface IRepository<T, CreateInput, UpdateInput> {
  /**
   * Get all entities
   */
  getAll(): Promise<T[]>;

  /**
   * Get a single entity by ID
   * @param id - Entity ID
   * @returns The entity or null if not found
   */
  getById(id: string): Promise<T | null>;

  /**
   * Create a new entity
   * @param data - Creation data
   * @returns The created entity
   */
  create(data: CreateInput): Promise<T>;

  /**
   * Update an existing entity
   * @param id - Entity ID
   * @param data - Update data
   * @returns The updated entity
   */
  update(id: string, data: UpdateInput): Promise<T>;

  /**
   * Delete an entity
   * @param id - Entity ID
   */
  delete(id: string): Promise<void>;
}

/**
 * Extended repository interface with filtering support
 */
export interface IFilterableRepository<T, CreateInput, UpdateInput, Filters>
  extends IRepository<T, CreateInput, UpdateInput> {
  /**
   * Get all entities with optional filters
   * @param filters - Optional filter criteria
   */
  getAll(filters?: Filters): Promise<T[]>;
}

/**
 * Extended repository interface with statistics support
 */
export interface IStatsRepository<T, CreateInput, UpdateInput, Stats>
  extends IRepository<T, CreateInput, UpdateInput> {
  /**
   * Get statistics for the entity type
   */
  getStats(): Promise<Stats>;
}
