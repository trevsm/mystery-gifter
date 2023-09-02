import { NextResponse } from "next/server";
import { isRateLimited } from "./rateLimit";

export const withRateLimit = (handler: Function) => {
  return async (request: Request) => {
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("remote-addr") ||
      "";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 }
      );
    }
    return await handler(request);
  };
};
