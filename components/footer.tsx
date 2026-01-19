'use client'

import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandX } from '@tabler/icons-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Our Fleet', href: '/cars' },
      { label: 'Become a Vendor', href: '/vendor/register' },
      { label: 'Contact', href: '/contact' }
    ],
    services: [
      { label: 'Luxury Rentals', href: '#' },
      { label: 'Long Term Lease', href: '#' },
      { label: 'Airport Transfer', href: '#' },
      { label: 'Chauffeur Service', href: '#' }
    ],
    support: [
      { label: 'Help Center', href: '/help-center' },
      { label: 'Terms of Service', href: '/terms&condition' },
      { label: 'Privacy Policy', href: '/privacy-policy' },
      { label: 'FAQs', href: '/faqs' }
    ]
  };

  const socialLinks = [
    { icon: Globe, href: 'https://nehan.vercel.app', label: 'Portfolio' },
    { icon: IconBrandFacebook, href: 'https://www.facebook.com', label: 'Facebook' },
    { icon: IconBrandX, href: 'https://x.com/@Nehanahmed988', label: 'Twitter' },
    { icon: IconBrandInstagram, href: 'https://instagram.com/__nehanansari', label: 'Instagram' },
    { icon: IconBrandLinkedin, href: '#', label: 'LinkedIn' }
  ];

  const contactInfo = [
    { icon: Phone, text: '+92 300 1234567', href: 'tel:+923001234567' },
    { icon: Mail, text: 'info@Drivaro.com', href: 'mailto:info@Drivaro.com' },
    { icon: MapPin, text: 'Karachi, Sindh, Pakistan', href: '#' }
  ];

  return (
    <footer className="w-full bg-background border-t border-border font-hanken-grotesk z-50 relative">
      
      {/* Top Bar: Developer Signature (Tech-Luxury Style) */}
      <div className="border-b border-border/60 bg-secondary/20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row justify-between items-center text-[10px] md:text-xs tracking-widest uppercase text-muted-foreground">
          <span>Digital Experience by Nehan Ahmed</span>
          <a
            href="https://nehan.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-accent transition-colors mt-2 md:mt-0"
          >
            <span>View Portfolio</span>
            <Globe className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Section (Span 4 columns) */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-block">
              <h3 className="text-4xl font-cinzel font-bold text-foreground tracking-tight">
                DRIVARO<span className="text-accent">.</span>
              </h3>
            </Link>
            <p className="text-muted-foreground leading-relaxed text-sm max-w-sm font-light">
              Premium car rental service offering the finest vehicles for your journey. 
              We redefine mobility with luxury, comfort, and impeccable style.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              {contactInfo.map((item, index) => (
                <a 
                  key={index} 
                  href={item.href}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Spacer Column (Span 1) */}
          <div className="hidden lg:block lg:col-span-1" />

          {/* Links Section (Span 7 columns) */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            
            {/* Company */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] mb-6">
                Company
              </h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:pl-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] mb-6">
                Services
              </h4>
              <ul className="space-y-4">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:pl-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-xs font-bold text-foreground uppercase tracking-[0.2em] mb-6">
                Support
              </h4>
              <ul className="space-y-4">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-accent transition-all duration-300 hover:pl-1 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Copyright */}
          <p className="text-xs text-muted-foreground tracking-wide order-2 md:order-1">
            &copy; {currentYear} Drivaro. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2 order-1 md:order-2">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-background hover:bg-primary transition-all duration-300"
              >
                <social.icon className="w-5 h-5" strokeWidth={1.5} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;