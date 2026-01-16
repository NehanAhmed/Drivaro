// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configure your allowed IPs and device fingerprints
const ALLOWED_IPS = [
  '192.168.1.100', // Example: Your office IP
  '144.48.129.236',
  '103.255.4.50',  // Example: Your home IP
  '::1',           // localhost IPv6
  '127.0.0.1',     // localhost IPv4
];

const ALLOWED_DEVICE_FINGERPRINTS = [
  'TW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTQ0LjAuMC4wIFNhZmFyaS81MzcuMzYtZW4tVVMsZW47cT0wLjctZ3ppcCwgZGVmbGF0ZSwgYnIsIHpzdGQ=',
  'your-device-fingerprint-hash-2',
];

function getClientIP(request: NextRequest): string {
  // Try different headers where IP might be stored (in order of reliability)
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  const cfConnecting = request.headers.get('cf-connecting-ip');
  const vercelForwarded = request.headers.get('x-vercel-forwarded-for');
  
  if (cfConnecting) {
    return cfConnecting.trim();
  }
  
  if (vercelForwarded) {
    return vercelForwarded.split(',')[0].trim();
  }
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real.trim();
  }
  
  // Fallback - in development this might be undefined
  return 'unknown';
}

function generateDeviceFingerprint(request: NextRequest): string {
  const userAgent = request.headers.get('user-agent') || '';
  const acceptLanguage = request.headers.get('accept-language') || '';
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  
  // Create a simple hash from device characteristics
  const fingerprint = `${userAgent}-${acceptLanguage}-${acceptEncoding}`;
  return Buffer.from(fingerprint).toString('base64');
}

export function proxy(request: NextRequest) {
  // Only protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const clientIP = getClientIP(request);
    const deviceFingerprint = generateDeviceFingerprint(request);
    
    console.log('Access attempt:', { 
      clientIP, 
      deviceFingerprint,
      path: request.nextUrl.pathname 
    });
    
    // Check IP whitelist
    const isIPAllowed = ALLOWED_IPS.includes(clientIP);
    
    // Check device fingerprint
    const isDeviceAllowed = ALLOWED_DEVICE_FINGERPRINTS.includes(deviceFingerprint);
    
    if (!isIPAllowed || !isDeviceAllowed) {
      console.warn('Unauthorized access attempt:', { 
        clientIP, 
        deviceFingerprint,
        isIPAllowed,
        isDeviceAllowed,
        path: request.nextUrl.pathname
      });
      
      // Return 403 Forbidden
      return new NextResponse(
        JSON.stringify({ 
          error: 'Access Denied',
          message: 'You are not authorized to access this resource.'
        }),
        {
          status: 403,
          headers: { 'content-type': 'application/json' },
        }
      );
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};