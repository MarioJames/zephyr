// 请求去重工具模块
// 防止短时间内的重复API调用，提升性能

interface RequestKey {
  url: string;
  method: string;
  params: Record<string, any>;
}

interface PendingRequest {
  promise: Promise<any>;
  timestamp: number;
}

class RequestDeduplication {
  private pendingRequests = new Map<string, PendingRequest>();
  private defaultTimeout = 500; // 默认去重时间窗口：500ms

  /**
   * 生成请求的唯一标识符
   */
  private generateKey(request: RequestKey): string {
    const { url, method, params } = request;
    const sortedParams = this.sortObject(params || {});
    return `${method.toUpperCase()}_${url}_${JSON.stringify(sortedParams)}`;
  }

  /**
   * 对象键排序，确保相同参数生成相同标识
   */
  private sortObject(obj: Record<string, any>): Record<string, any> {
    const sorted: Record<string, any> = {};
    Object.keys(obj)
      .sort()
      .forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          sorted[key] = this.sortObject(obj[key]);
        } else {
          sorted[key] = obj[key];
        }
      });
    return sorted;
  }

  /**
   * 清理过期的请求缓存
   */
  private cleanupExpiredRequests(): void {
    const now = Date.now();
    for (const [key, request] of this.pendingRequests.entries()) {
      if (now - request.timestamp > this.defaultTimeout) {
        this.pendingRequests.delete(key);
      }
    }
  }

  /**
   * 执行去重请求
   * @param requestKey 请求标识
   * @param requestFn 实际的请求函数
   * @param timeout 自定义去重时间窗口
   */
  public async deduplicateRequest<T>(
    requestKey: RequestKey,
    requestFn: () => Promise<T>,
    timeout?: number
  ): Promise<T> {
    const key = this.generateKey(requestKey);
    const now = Date.now();
    const effectiveTimeout = timeout || this.defaultTimeout;

    // 清理过期请求
    this.cleanupExpiredRequests();

    // 检查是否有正在进行的相同请求
    const existing = this.pendingRequests.get(key);
    if (existing && (now - existing.timestamp) < effectiveTimeout) {
      // 返回现有请求的Promise
      return existing.promise;
    }

    // 创建新的请求
    const promise = requestFn().finally(() => {
      // 请求完成后删除缓存项
      this.pendingRequests.delete(key);
    });

    // 缓存新请求
    this.pendingRequests.set(key, {
      promise,
      timestamp: now
    });

    return promise;
  }

  /**
   * 清除所有缓存的请求
   */
  public clearAll(): void {
    this.pendingRequests.clear();
  }

  /**
   * 清除特定的请求缓存
   */
  public clearRequest(requestKey: RequestKey): void {
    const key = this.generateKey(requestKey);
    this.pendingRequests.delete(key);
  }

  /**
   * 获取当前缓存的请求数量
   */
  public getPendingRequestCount(): number {
    this.cleanupExpiredRequests();
    return this.pendingRequests.size;
  }

  /**
   * 设置默认超时时间
   */
  public setDefaultTimeout(timeout: number): void {
    this.defaultTimeout = timeout;
  }
}

// 创建全局实例
export const requestDeduplicator = new RequestDeduplication();

// 导出防抖函数，用于非API请求的去重
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;

  return function(this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
}

// 导出节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean;

  return function(this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  } as T;
}
