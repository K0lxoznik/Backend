import { Request } from 'express';

/** Request body
 * The common request type with body
 */
export type RequestBody<T> = Request<{}, {}, T>;
