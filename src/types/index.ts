/**
 * 通用辅助类型工具
 */

/**
 * 去掉类型中的 createdAt 和 updatedAt 字段
 * @template T - 源类型
 * @example
 * ```typescript
 * interface User {
 *   id: string;
 *   name: string;
 *   createdAt: Date;
 *   updatedAt: Date;
 * }
 *
 * type UserWithoutTimestamps = OmitTimestamps<User>;
 * // 结果: { id: string; name: string; }
 * ```
 */
export type OmitTimestamps<T> = Omit<
  T,
  'createdAt' | 'updatedAt' | 'accessedAt'
>;

/**
 * 使时间戳字段变为可选
 * @template T - 源类型
 */
export type OptionalTimestamps<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt?: T extends { createdAt: infer U } ? U : never;
  updatedAt?: T extends { updatedAt: infer U } ? U : never;
};
