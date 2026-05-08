import { PaginatedMeta } from './paginated-meta';

export class PaginatedResult<T> {
    data: T[];
    meta: PaginatedMeta;
}
