import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandX } from '@tabler/icons-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'About Us', href: '#' },
      { label: 'Our Fleet', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' }
    ],
    services: [
      { label: 'Luxury Rentals', href: '#' },
      { label: 'Long Term Lease', href: '#' },
      { label: 'Airport Transfer', href: '#' },
      { label: 'Chauffeur Service', href: '#' }
    ],
    support: [
      { label: 'Help Center', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Privacy Policy', href: '#' },
      { label: 'FAQs', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: IconBrandFacebook, href: 'https://www.facebook.com', label: 'Facebook' },
    { icon: IconBrandX, href: 'https://x.com/@Nehanahmed988', label: 'Twitter' },
    { icon: IconBrandInstagram, href: 'https://instagram.com/__nehanansari', label: 'Instagram' },
    { icon: IconBrandLinkedin, href: '#', label: 'LinkedIn' }
  ];

  const contactInfo = [
    { icon: Phone, text: '+92 300 1234567' },
    { icon: Mail, text: 'info@Drivaro.com' },
    { icon: MapPin, text: 'Karachi, Sindh, Pakistan' }
  ];

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-2xl font-bold text-foreground">
                Drivaro
              </h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                Premium car rental service offering the finest vehicles for your journey. Experience luxury, comfort, and style.
              </p>
              
              {/* Contact Info */}
              <div className="space-y-2 pt-2">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <item.icon className="w-4 h-4" />
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Services
              </h4>
              <ul className="space-y-3">
                {footerLinks.services.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                Support
              </h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link, index) => (
                  <li key={index}>
                    <a 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted-foreground">
              © {currentYear} Drivaro. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;