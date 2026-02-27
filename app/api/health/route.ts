/**
 * API Health Check: GET /api/health
 *
 * Returns a simple health status. Useful for monitoring and load balancers.
 */

import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "0.1.0",
    });
}
