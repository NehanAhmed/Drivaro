'use client'
import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Github,
  Instagram,
  Twitter,
  Globe,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleSubmit = () => {
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "nehanahmed@example.com",
      href: "mailto:nehanahmed@example.com"
    },
    {
      icon: Phone,
      label: "Phone",
      value: "03111088051",
      href: "tel:03111088051"
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Karachi, Sindh, Pakistan",
      href: null
    },
    {
      icon: Clock,
      label: "Working Hours",
      value: "Mon-Fri, 9:00 AM - 6:00 PM",
      href: null
    }
  ];

  const socialLinks = [
    {
      icon: Globe,
      label: "Portfolio",
      value: "nehan.vercel.app",
      href: "https://nehan.vercel.app"
    },
    {
      icon: Github,
      label: "GitHub",
      value: "@NehanAhmed",
      href: "https://github.com/NehanAhmed"
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: "@__nehanahmed",
      href: "https://instagram.com/__nehanahmed"
    },
    {
      icon: Twitter,
      label: "Twitter",
      value: "@Nehanahmed988",
      href: "https://x.com/Nehanahmed988"
    }
  ];

  const faqs = [
    {
      question: "How quickly will I get a response?",
      answer: "We typically respond within 24 hours during business days."
    },
    {
      question: "Can I schedule a call?",
      answer: "Yes! Mention your preferred time in the message and we'll arrange a call."
    },
    {
      question: "Do you offer vendor support?",
      answer: "Absolutely. We provide dedicated support for all our vendors."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have questions about RentDrive? We're here to help. Reach out and we'll respond as soon as possible.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border border-border">
                <CardContent className="p-6 md:p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Send us a Message
                    </h2>
                    <p className="text-muted-foreground">
                      Fill out the form below and we'll get back to you shortly
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="03XX XXXXXXX"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          id="subject"
                          name="subject"
                          placeholder="How can we help?"
                          value={formData.subject}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="resize-none"
                      />
                    </div>

                    <Button onClick={handleSubmit} className="w-full md:w-auto" size="lg">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              {/* Contact Details */}
              <Card className="border border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {info.label}
                          </p>
                          {info.href ? (
                            <a 
                              href={info.href}
                              className="text-sm text-muted-foreground hover:text-foreground transition-colors break-words"
                            >
                              {info.value}
                            </a>
                          ) : (
                            <p className="text-sm text-muted-foreground break-words">
                              {info.value}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="border border-border">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Connect With Me
                  </h3>
                  <div className="space-y-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted group-hover:bg-primary/10 flex items-center justify-center flex-shrink-0 transition-colors">
                          <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">
                            {social.label}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {social.value}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="border-2 border-accent/20 bg-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-5 h-5 text-accent-foreground" />
                    <h3 className="text-lg font-semibold text-foreground">
                      Need Immediate Help?
                    </h3>
                  </div>
                  <p className="text-sm text-foreground/70 mb-4">
                    For urgent matters, call us directly or check out our FAQ section for quick answers.
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="tel:03111088051">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-20 bg-card border-t border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers to common questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-border bg-background">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-foreground/70">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Built By Section */}
      
    </div>
  );
};

export default ContactPage;