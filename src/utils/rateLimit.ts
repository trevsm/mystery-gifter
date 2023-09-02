interface RateLimitData {
  ipRequestCount: Record<string, number>;
  ipLastRequestTime: Record<string, number>;
}

const rateLimitData: RateLimitData = {
  ipRequestCount: {}, // Store IP request count
  ipLastRequestTime: {}, // Store last request time per IP
};

export const isRateLimited = (ip: string): boolean => {
  const currentTime = Date.now();
  const lastRequestTime = rateLimitData.ipLastRequestTime[ip] || 0;

  if (
    rateLimitData.ipRequestCount[ip] &&
    currentTime - lastRequestTime < 60000
  ) {
    rateLimitData.ipRequestCount[ip]++;
    if (rateLimitData.ipRequestCount[ip] > 10) {
      return true;
    }
  } else {
    rateLimitData.ipRequestCount[ip] = 1;
    rateLimitData.ipLastRequestTime[ip] = currentTime;
  }

  return false;
};
