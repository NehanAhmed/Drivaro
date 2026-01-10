// lib/auth.ts
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";
import { sendEmail } from "@/lib/email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  // ============================================
  // EMAIL VERIFICATION CONFIGURATION (DISABLED)
  // ============================================
  // Uncomment to enable email verification
  /*
  emailVerification: {
    // Send verification email when user signs up
    sendOnSignUp: true,

    // Auto sign in user after they verify their email
    autoSignInAfterVerification: true,

    // Send verification email on sign in attempts if email is not verified
    sendOnSignIn: true,

    // Send verification email function
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6; 
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header { 
                background-color: #0D3B66; 
                color: #FAF0CA; 
                padding: 40px 30px; 
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
              }
              .content { 
                padding: 40px 30px;
              }
              .content p {
                margin: 0 0 16px 0;
                color: #333;
                font-size: 16px;
              }
              .button-container {
                text-align: center;
                margin: 32px 0;
              }
              .button { 
                display: inline-block; 
                padding: 14px 32px; 
                background-color: #F4D35E; 
                color: #0D3B66; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: 600;
                font-size: 16px;
                transition: background-color 0.3s;
              }
              .button:hover {
                background-color: #e5c34d;
              }
              .link-container {
                background-color: #f9f9f9;
                padding: 16px;
                border-radius: 6px;
                margin: 24px 0;
                word-break: break-all;
              }
              .link-container p {
                margin: 0 0 8px 0;
                font-size: 14px;
                color: #666;
              }
              .link-text {
                color: #0D3B66;
                font-size: 13px;
                word-break: break-all;
              }
              .footer { 
                text-align: center; 
                padding: 30px; 
                color: #666; 
                font-size: 13px;
                background-color: #f9f9f9;
              }
              .footer p {
                margin: 0 0 8px 0;
              }
              .divider {
                height: 1px;
                background-color: #e0e0e0;
                margin: 24px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🚗 Verify Your Email Address</h1>
              </div>
              <div class="content">
                <p>Hi ${user.name || 'there'},</p>
                <p>Thank you for signing up! We're excited to have you on board. To complete your registration and start using our car rental service, please verify your email address.</p>
                
                <div class="button-container">
                  <a href="${url}" class="button">Verify Email Address</a>
                </div>
                
                <div class="divider"></div>
                
                <div class="link-container">
                  <p>If the button doesn't work, copy and paste this link into your browser:</p>
                  <div class="link-text">${url}</div>
                </div>
                
                <p style="margin-top: 24px; font-size: 14px; color: #666;">
                  <strong>⏱️ This link will expire in 24 hours.</strong>
                </p>
                
                <p style="margin-top: 16px; font-size: 14px; color: #666;">
                  If you didn't create an account with us, you can safely ignore this email.
                </p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your Car Rental. All rights reserved.</p>
                <p>Need help? Contact us at support@yourcarrental.com</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const emailText = `
Hi ${user.name || 'there'},

Thank you for signing up! Please verify your email address to complete your registration.

Verify your email by clicking this link:
${url}

This link will expire in 24 hours.

If you didn't create an account, please ignore this email.

---
© ${new Date().getFullYear()} Your Car Rental. All rights reserved.
Need help? Contact us at support@yourcarrental.com
      `;

      // Use void to prevent timing attacks
      void sendEmail({
        to: user.email,
        subject: "Verify your email address - Your Car Rental",
        html: emailHtml,
        text: emailText.trim(),
      });
    },

    // Run custom logic after successful email verification
    async afterEmailVerification(user, request) {
      console.log(`✅ Email verified successfully for: ${user.email}`);
      
      // Add any custom logic here:
      // - Send welcome email
      // - Grant initial credits
      // - Update analytics
      // - Notify admin
      
      // Example: Send welcome email
      // void sendEmail({
      //   to: user.email,
      //   subject: "Welcome to Your Car Rental!",
      //   html: "Welcome email content...",
      // });
    },
  },
  */

  // ============================================
  // EMAIL AND PASSWORD CONFIGURATION
  // ============================================
  emailAndPassword: {
    enabled: true,

    // Require email verification before allowing login (DISABLED)
    requireEmailVerification: false, // Set to true to enable

    // Password reset email function
    sendResetPassword: async ({ user, url, token }, request) => {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6; 
                color: #333;
                margin: 0;
                padding: 0;
                background-color: #f5f5f5;
              }
              .container { 
                max-width: 600px; 
                margin: 40px auto; 
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              }
              .header { 
                background-color: #0D3B66; 
                color: #FAF0CA; 
                padding: 40px 30px; 
                text-align: center;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: 600;
              }
              .content { 
                padding: 40px 30px;
              }
              .content p {
                margin: 0 0 16px 0;
                color: #333;
                font-size: 16px;
              }
              .button-container {
                text-align: center;
                margin: 32px 0;
              }
              .button { 
                display: inline-block; 
                padding: 14px 32px; 
                background-color: #F4D35E; 
                color: #0D3B66; 
                text-decoration: none; 
                border-radius: 6px; 
                font-weight: 600;
                font-size: 16px;
                transition: background-color 0.3s;
              }
              .button:hover {
                background-color: #e5c34d;
              }
              .link-container {
                background-color: #f9f9f9;
                padding: 16px;
                border-radius: 6px;
                margin: 24px 0;
                word-break: break-all;
              }
              .link-container p {
                margin: 0 0 8px 0;
                font-size: 14px;
                color: #666;
              }
              .link-text {
                color: #0D3B66;
                font-size: 13px;
                word-break: break-all;
              }
              .warning { 
                background-color: #fff3cd; 
                border-left: 4px solid #ffc107; 
                padding: 16px; 
                border-radius: 6px;
                margin: 24px 0;
              }
              .warning p {
                margin: 0;
                color: #856404;
                font-size: 14px;
              }
              .warning strong {
                display: block;
                margin-bottom: 8px;
                font-size: 15px;
              }
              .footer { 
                text-align: center; 
                padding: 30px; 
                color: #666; 
                font-size: 13px;
                background-color: #f9f9f9;
              }
              .footer p {
                margin: 0 0 8px 0;
              }
              .divider {
                height: 1px;
                background-color: #e0e0e0;
                margin: 24px 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔐 Reset Your Password</h1>
              </div>
              <div class="content">
                <p>Hi ${user.name || 'there'},</p>
                <p>We received a request to reset your password for your car rental account. Click the button below to create a new password:</p>
                
                <div class="button-container">
                  <a href="${url}" class="button">Reset Password</a>
                </div>
                
                <div class="divider"></div>
                
                <div class="link-container">
                  <p>If the button doesn't work, copy and paste this link into your browser:</p>
                  <div class="link-text">${url}</div>
                </div>
                
                <div class="warning">
                  <strong>⚠️ Security Notice</strong>
                  <p>This password reset link will expire in 1 hour for security reasons. If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
                </div>
                
                <p style="margin-top: 24px; font-size: 14px; color: #666;">
                  If you're having trouble or didn't request this, please contact our support team immediately.
                </p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your Car Rental. All rights reserved.</p>
                <p>Need help? Contact us at support@yourcarrental.com</p>
              </div>
            </div>
          </body>
        </html>
      `;

      const emailText = `
Hi ${user.name || 'there'},

We received a request to reset your password for your car rental account.

Reset your password by clicking this link:
${url}

⚠️ Security Notice:
This link will expire in 1 hour for security reasons.

If you didn't request a password reset, please ignore this email and your password will remain unchanged.

---
© ${new Date().getFullYear()} Your Car Rental. All rights reserved.
Need help? Contact us at support@yourcarrental.com
      `;

      // Use void to prevent timing attacks
      void sendEmail({
        to: user.email,
        subject: "Reset your password - Your Car Rental",
        html: emailHtml,
        text: emailText.trim(),
      });
    },
  },

  // ============================================
  // SOCIAL PROVIDERS
  // ============================================
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // ============================================
  // SESSION CONFIGURATION
  // ============================================
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
});