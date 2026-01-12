import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  BookOpen, 
  Car, 
  CreditCard, 
  Shield, 
  MessageCircle, 
  FileText,
  Users,
  Headphones,
  Mail,
  Phone,
  Clock
} from 'lucide-react';

const HelpCenterPage = () => {
  const helpCategories = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of using Drivaro",
      articles: [
        "How to create an account",
        "Verifying your identity",
        "Understanding user roles",
        "Account security tips"
      ]
    },
    {
      icon: Car,
      title: "Booking & Rentals",
      description: "Everything about renting cars",
      articles: [
        "How to book a car",
        "Modifying your reservation",
        "Cancellation policy",
        "Pickup and return process"
      ]
    },
    {
      icon: CreditCard,
      title: "Payments & Billing",
      description: "Payment methods and billing",
      articles: [
        "Payment methods accepted",
        "Understanding security deposits",
        "Refund process",
        "Viewing invoices"
      ]
    },
    {
      icon: Shield,
      title: "Safety & Insurance",
      description: "Stay protected on the road",
      articles: [
        "Insurance coverage explained",
        "Reporting damage",
        "Accident procedures",
        "Safety guidelines"
      ]
    },
    {
      icon: Users,
      title: "For Car Owners",
      description: "Vendor resources and guides",
      articles: [
        "Listing your first car",
        "Pricing strategies",
        "Managing bookings",
        "Payout information"
      ]
    },
    {
      icon: FileText,
      title: "Policies & Legal",
      description: "Terms, policies, and regulations",
      articles: [
        "Terms of Service",
        "Privacy Policy",
        "Cancellation policy",
        "Dispute resolution"
      ]
    }
  ];

  const contactOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team",
      availability: "Available 9 AM - 6 PM EST",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "support@Drivaro.com",
      availability: "Response within 24 hours",
      action: "Send Email"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "+1 (234) 567-890",
      availability: "Mon-Fri, 9 AM - 6 PM EST",
      action: "Call Now"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <Headphones className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            How can we help you?
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Search our knowledge base or browse categories to find answers
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search for help articles..." 
                className="pl-10 h-12 text-base"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold mb-8">Browse by Category</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((category, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <category.icon className="h-8 w-8 text-primary mb-3" />
                <CardTitle className="text-xl">{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIdx) => (
                    <li key={articleIdx}>
                      <button className="text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                        {article}
                      </button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="border-t bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold mb-8">Popular Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "How to book your first car on Drivaro",
              "Understanding the security deposit process",
              "What to do if you need to cancel a booking",
              "How vendors receive their payouts",
              "Steps to verify your driver's license",
              "Insurance options and what they cover"
            ].map((article, idx) => (
              <button
                key={idx}
                className="text-left p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{article}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Still need help?</h2>
            <p className="text-muted-foreground">
              Our support team is ready to assist you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {contactOptions.map((option, idx) => (
              <Card key={idx}>
                <CardHeader className="text-center">
                  <option.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription className="text-base font-medium text-foreground">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{option.availability}</span>
                  </div>
                  <Button className="w-full">{option.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="border-t bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <button className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </button>
            <span className="text-muted-foreground">•</span>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <span className="text-muted-foreground">•</span>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              Community Guidelines
            </button>
            <span className="text-muted-foreground">•</span>
            <button className="text-muted-foreground hover:text-primary transition-colors">
              Trust & Safety
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;