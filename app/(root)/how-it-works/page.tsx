import React from 'react';
import { 
  Search, 
  Calendar, 
  CreditCard, 
  Key, 
  FileCheck, 
  Star,
  UserPlus,
  Car,
  Shield,
  DollarSign,
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorksPage = () => {
  const customerSteps = [
    {
      number: "01",
      icon: Search,
      title: "Browse & Select",
      description: "Explore our wide range of verified vehicles. Filter by location, category, price range, and features to find your perfect ride."
    },
    {
      number: "02",
      icon: Calendar,
      title: "Choose Dates",
      description: "Select your pickup and return dates. Our real-time availability system ensures you see only available vehicles."
    },
    {
      number: "03",
      icon: FileCheck,
      title: "Complete Verification",
      description: "Upload your driver's license and complete profile verification. This one-time process ensures safety for all users."
    },
    {
      number: "04",
      icon: CreditCard,
      title: "Secure Payment",
      description: "Book instantly with transparent pricing. Your payment is securely held and processed through Stripe."
    },
    {
      number: "05",
      icon: Key,
      title: "Pick Up & Drive",
      description: "Collect your car at the designated location. Complete a quick inspection report and you're ready to go."
    },
    {
      number: "06",
      icon: Star,
      title: "Return & Review",
      description: "Return the vehicle on time, complete final inspection, and share your experience with a review."
    }
  ];

  const vendorSteps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Register as Vendor",
      description: "Create your vendor account with business details. Submit required documents for verification."
    },
    {
      number: "02",
      icon: Shield,
      title: "Get Verified",
      description: "Our admin team reviews your application and documents. Approval typically takes 24-48 hours."
    },
    {
      number: "03",
      icon: Car,
      title: "List Your Vehicles",
      description: "Add your cars with photos, specifications, and pricing. Set availability and rental terms."
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Receive Bookings",
      description: "Accept booking requests from verified customers. Choose instant booking or manual approval."
    },
    {
      number: "05",
      icon: Key,
      title: "Hand Over Vehicle",
      description: "Meet the customer at pickup location. Complete pre-rental inspection with photo documentation."
    },
    {
      number: "06",
      icon: DollarSign,
      title: "Get Paid",
      description: "Receive automatic payouts after successful rentals. Track earnings through your dashboard."
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Verified Users",
      description: "All vendors and customers undergo verification"
    },
    {
      icon: FileCheck,
      title: "Damage Protection",
      description: "Comprehensive photo documentation system"
    },
    {
      icon: CreditCard,
      title: "Secure Payments",
      description: "Stripe-powered payment processing"
    },
    {
      icon: BarChart3,
      title: "Real-Time Tracking",
      description: "Monitor bookings and availability instantly"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            How It Works
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Whether you're renting a car or listing one, our platform makes the process simple, secure, and transparent
          </p>
        </div>
      </section>

      {/* For Customers Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              For Customers
            </h2>
            <p className="text-muted-foreground text-lg">
              Rent a car in six simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customerSteps.map((step, index) => (
              <Card key={index} className="border border-border hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                    </div>
                    <span className="text-4xl font-bold text-muted/20">{step.number}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* For Vendors Section */}
      <section className="py-16 md:py-20 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              For Car Owners
            </h2>
            <p className="text-muted-foreground text-lg">
              Start earning from your vehicle in six steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorSteps.map((step, index) => (
              <Card key={index} className="border border-border hover:shadow-lg transition-shadow duration-300 bg-background">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-accent-foreground" strokeWidth={2} />
                    </div>
                    <span className="text-4xl font-bold text-muted/20">{step.number}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Safety Features */}
      <section className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Built on Trust & Safety
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Every feature is designed to protect both renters and car owners
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border border-border text-center">
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                    <feature.icon className="w-7 h-7 text-foreground" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="border-t border-border py-16 md:py-20 bg-card">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of users who trust Drivaro for their car rental needs
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Card className="border-2 border-primary w-full sm:w-auto">
              <CardContent className="p-6 text-center space-y-3">
                <h3 className="text-xl font-bold text-foreground">Looking to Rent?</h3>
                <p className="text-sm text-muted-foreground">Browse available vehicles</p>
                <a 
                  href="/cars" 
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors w-full"
                >
                  Browse Cars
                </a>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent w-full sm:w-auto">
              <CardContent className="p-6 text-center space-y-3">
                <h3 className="text-xl font-bold text-foreground">Want to List?</h3>
                <p className="text-sm text-muted-foreground">Start earning today</p>
                <a 
                  href="/vendor/register" 
                  className="inline-flex items-center justify-center rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors w-full"
                >
                  Become a Vendor
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksPage;