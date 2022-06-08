import { NextResponse } from "next/server";
export async function middleware(req, ev) {
  const { pathname } = req.nextUrl;
  if (pathname == "/") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}
