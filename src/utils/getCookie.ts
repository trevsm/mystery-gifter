export function getCookie(cookieName: string, request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookieHeader.split("; ");

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === cookieName) {
      return decodeURIComponent(value);
    }
  }

  return null;
}
