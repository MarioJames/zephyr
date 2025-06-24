import dayjs from 'dayjs';
import { isNumber } from 'lodash-es';
import numeral from 'numeral';

import { ModelPriceCurrency } from '@/types/llm';
const USD_TO_CNY = 7.24;
export const formatSize = (
  bytes: number,
  fractionDigits: number = 1
): string => {
  if (!bytes && bytes !== 0) return '--';

  const kbSize = bytes / 1024;
  if (kbSize < 1024) {
    return `${kbSize.toFixed(fractionDigits)} KB`;
  } else if (kbSize < 1_048_576) {
    const mbSize = kbSize / 1024;
    return `${mbSize.toFixed(fractionDigits)} MB`;
  } else {
    const gbSize = kbSize / 1_048_576;
    return `${gbSize.toFixed(fractionDigits)} GB`;
  }
};

export const formatTokenNumber = (num: number): string => {
  if (!num && num !== 0) return '--';

  if (num > 0 && num < 1024) return '1K';

  let kiloToken = Math.floor(num / 1024);
  if ((num >= 1024 && num < 1024 * 41) || num >= 128_000) {
    kiloToken = Math.floor(num / 1000);
  }
  if (num === 131_072) return '128K';
  return kiloToken < 1000
    ? `${kiloToken}K`
    : `${Math.floor(kiloToken / 1000)}M`;
};
