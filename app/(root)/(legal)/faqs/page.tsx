import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, MessageCircle, BookOpen, Car, CreditCard, Shield, Mail, Phone } from 'lucide-react';

const FAQPage = () => {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      faqs: [
        {
          question: "How do I create an account?",
          answer: "Click on the 'Sign Up' button in the top right corner. You can register using your email address or sign in with Google. After registration, verify your email to complete the setup."
        },
        {
          question: "What documents do I need to rent a car?",
          answer: "You'll need a valid driver's license and a government-issued ID. Upload these documents in your profile section. Our team will verify them within 24 hours."
        },
        {
          question: "Can I browse cars without creating an account?",
          answer: "Yes, you can browse all available cars, view pricing, and check availability without an account. However, you'll need to register to complete a booking."
        }
      ]
    },
    {
      title: "Booking & Rentals",
      icon: Car,
      faqs: [
        {
          question: "How do I book a car?",
          answer: "Select your desired car, choose your rental dates, review the pricing details, and proceed to payment. You'll receive instant confirmation via email once the booking is complete."
        },
        {
          question: "What is instant booking?",
          answer: "Instant booking allows you to confirm your rental immediately without waiting for vendor approval. Cars with this feature are marked with an 'Instant Booking' badge."
        },
        {
          question: "Can I cancel or modify my booking?",
          answer: "Yes, you can cancel your booking from your dashboard. Cancellation policies vary by vendor, but generally, cancellations made 24 hours before pickup receive a full refund minus processing fees."
        },
        {
          question: "What happens if I return the car late?",
          answer: "Late returns are subject to additional charges as per the vendor's policy. Please contact your vendor immediately if you anticipate a delay to avoid penalties."
        },
        {
          question: "Is there a minimum rental period?",
          answer: "Most vendors require a minimum rental period of 24 hours, though some may offer shorter rentals. Check the car listing for specific requirements."
        }
      ]
    },
    {
      title: "Payment & Pricing",
      icon: CreditCard,
      faqs: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit and debit cards through our secure Stripe payment gateway. Your payment information is never stored on our servers."
        },
        {
          question: "What is the security deposit for?",
          answer: "The security deposit is held on your card during the rental period to cover potential damages or policy violations. It's automatically released within 3-5 business days after a successful return."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No. All costs including base rental, taxes, platform fees, and any optional add-ons are clearly displayed before you confirm your booking."
        },
        {
          question: "Do you offer weekly or monthly discounts?",
          answer: "Yes! Rentals of 7+ days receive a 10% discount, and monthly rentals receive up to 20% off. Discounts are automatically applied at checkout."
        },
        {
          question: "When will I be charged?",
          answer: "Payment is processed immediately upon booking confirmation. The security deposit is held separately and released after the rental period ends."
        }
      ]
    },
    {
      title: "Safety & Insurance",
      icon: Shield,
      faqs: [
        {
          question: "Is insurance included in the rental?",
          answer: "Basic coverage is included with all rentals. You can upgrade to premium insurance during checkout for additional protection and lower deductibles."
        },
        {
          question: "What should I do if there's damage to the car?",
          answer: "Document the damage with photos immediately and report it through your booking dashboard. Our support team will guide you through the claims process."
        },
        {
          question: "Are cars inspected before rental?",
          answer: "Yes. All vendors are required to maintain their vehicles to safety standards. You'll also complete a pre-rental inspection with photos to document the car's condition."
        },
        {
          question: "What happens in case of an accident?",
          answer: "Contact emergency services first if needed, then notify the vendor and Drivaro support immediately. Your insurance will cover damages as per the policy terms."
        }
      ]
    },
    {
      title: "For Car Owners",
      icon: Car,
      faqs: [
        {
          question: "How do I list my car on Drivaro?",
          answer: "Register as a vendor, complete your business verification, and add your vehicles with photos and details. Our team will review your application within 48 hours."
        },
        {
          question: "How much commission does Drivaro charge?",
          answer: "Our standard commission is 15-20% per booking, which covers payment processing, insurance administration, customer support, and platform maintenance."
        },
        {
          question: "When do I receive my earnings?",
          answer: "Payments are transferred to your account within 3-5 business days after a rental is completed and both parties have submitted their post-rental reports."
        },
        {
          question: "Can I set my own pricing?",
          answer: "Yes! You have complete control over your daily, weekly, and monthly rates. You can also adjust pricing based on demand or special events."
        },
        {
          question: "What if a renter damages my car?",
          answer: "Security deposits cover minor damages. For major incidents, insurance claims are processed through our system. You're protected by our vendor guarantee program."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find answers to common questions about Drivaro
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search for answers..." 
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {faqCategories.map((category, idx) => (
            <div key={idx}>
              <div className="flex items-center gap-3 mb-6">
                <category.icon className="h-5 w-5 text-primary" />
                <h2 className="text-2xl font-semibold">{category.title}</h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {category.faqs.map((faq, faqIdx) => (
                  <AccordionItem 
                    key={faqIdx} 
                    value={`item-${idx}-${faqIdx}`}
                    className="border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>

      {/* Still Have Questions Section */}
      <div className="border-t bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <MessageCircle className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-3xl font-bold mb-2">Still have questions?</h2>
            <p className="text-muted-foreground">
              Can't find the answer you're looking for? We're here to help.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-card border rounded-lg p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="What's your question about?" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <textarea 
                  id="message"
                  placeholder="Describe your question in detail..."
                  className="w-full min-h-32 px-3 py-2 text-sm border border-input rounded-md bg-background resize-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <Button className="w-full">
                Send Message
              </Button>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Or reach us directly
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="mailto:support@Drivaro.com" 
                  className="text-primary hover:underline"
                >
                  support@Drivaro.com
                </a>
              </div>
              <span className="hidden sm:inline text-muted-foreground">•</span>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <a 
                  href="tel:+1234567890" 
                  className="text-primary hover:underline"
                >
                  +1 (234) 567-890
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;