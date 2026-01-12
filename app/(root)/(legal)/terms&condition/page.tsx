import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileText, Download, Calendar } from 'lucide-react';

const TermsOfServicePage = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using Drivaro (the "Platform"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Platform. We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of any changes.`
    },
    {
      title: "2. Definitions",
      content: `"Platform" refers to Drivaro and all its services. "User" refers to anyone who accesses the Platform. "Customer" refers to users who rent vehicles. "Vendor" refers to car owners who list vehicles on the Platform. "Booking" refers to a confirmed vehicle rental transaction. "Service Fee" refers to the commission charged by the Platform.`
    },
    {
      title: "3. Eligibility",
      content: `You must be at least 18 years old and possess a valid driver's license to use our services as a Customer. Vendors must be at least 21 years old and provide proof of vehicle ownership and valid business documentation. By creating an account, you represent that all information provided is accurate and current.`
    },
    {
      title: "4. User Accounts",
      content: `You are responsible for maintaining the confidentiality of your account credentials. All activities conducted through your account are your responsibility. You must immediately notify us of any unauthorized use of your account. We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.`
    },
    {
      title: "5. For Customers",
      subsections: [
        {
          subtitle: "5.1 Booking Process",
          text: "Customers can browse available vehicles and make bookings through the Platform. All bookings are subject to vendor approval unless marked as instant booking. Payment is processed immediately upon booking confirmation."
        },
        {
          subtitle: "5.2 Driver Requirements",
          text: "Customers must possess a valid driver's license and provide proof of identity. Additional documentation may be required for certain vehicle categories. International customers may need an International Driving Permit."
        },
        {
          subtitle: "5.3 Vehicle Use",
          text: "Vehicles must be used in accordance with all applicable laws and regulations. Smoking, illegal activities, and unauthorized modifications are strictly prohibited. Vehicles may not be used for commercial purposes unless explicitly agreed upon."
        },
        {
          subtitle: "5.4 Insurance and Liability",
          text: "Basic insurance is included with all rentals. Customers are liable for damage to the vehicle during the rental period. Security deposits will be held and may be used to cover damages, cleaning fees, or policy violations."
        }
      ]
    },
    {
      title: "6. For Vendors",
      subsections: [
        {
          subtitle: "6.1 Listing Requirements",
          text: "Vendors must provide accurate information about their vehicles including condition, features, and availability. All vehicles must meet safety standards and be properly insured. Regular maintenance records may be required."
        },
        {
          subtitle: "6.2 Pricing and Availability",
          text: "Vendors set their own pricing for daily, weekly, and monthly rentals. Vendors must maintain accurate availability calendars and honor confirmed bookings. Price changes do not affect existing bookings."
        },
        {
          subtitle: "6.3 Commission Structure",
          text: "The Platform charges a service fee of 15-20% on each completed booking. This fee covers payment processing, insurance administration, customer support, and platform maintenance. Commission rates may vary based on vendor tier and booking volume."
        },
        {
          subtitle: "6.4 Payout Terms",
          text: "Payments are transferred within 3-5 business days after a rental is completed and damage reports are submitted. Vendors must provide valid banking information for payouts. Disputed amounts may be withheld pending resolution."
        }
      ]
    },
    {
      title: "7. Payments and Fees",
      content: `All payments are processed through our secure payment gateway. Service fees, taxes, and additional charges are clearly displayed before booking confirmation. Refunds are subject to the cancellation policy and vendor approval. Security deposits are held separately and released after successful vehicle return.`
    },
    {
      title: "8. Cancellation and Refunds",
      content: `Cancellation policies vary by vendor but generally include: Full refund for cancellations made 48+ hours before pickup. 50% refund for cancellations made 24-48 hours before pickup. No refund for cancellations made less than 24 hours before pickup. Platform fees are non-refundable. Vendors may set their own policies with customer agreement.`
    },
    {
      title: "9. Damage and Disputes",
      content: `Both parties must complete pre-rental and post-rental inspections with photographic documentation. Any damage discovered must be reported immediately through the Platform. Disputes are handled through our resolution process. Security deposits may be used to cover legitimate damage claims. The Platform serves as a mediator but is not liable for disputes between users.`
    },
    {
      title: "10. Prohibited Activities",
      content: `The following activities are strictly prohibited: Fraudulent bookings or listings. Circumventing Platform fees by conducting transactions outside the Platform. Harassment or discrimination of any kind. Using vehicles for illegal activities. Sharing account credentials. Manipulating reviews or ratings. Listing vehicles you do not own or have authority to rent.`
    },
    {
      title: "11. Intellectual Property",
      content: `All content on the Platform including logos, text, graphics, and software is owned by Drivaro or its licensors. Users retain ownership of content they upload but grant Drivaro a license to use this content for Platform operations. Unauthorized use of Platform content is prohibited.`
    },
    {
      title: "12. Privacy and Data",
      content: `Your use of the Platform is subject to our Privacy Policy. We collect and process data as described in the Privacy Policy. By using the Platform, you consent to such collection and processing. We implement security measures to protect your data but cannot guarantee absolute security.`
    },
    {
      title: "13. Limitation of Liability",
      content: `The Platform is provided "as is" without warranties of any kind. Drivaro is not liable for any indirect, incidental, or consequential damages. Our total liability is limited to the amount of fees paid to us in the twelve months preceding the claim. We are not responsible for the condition, safety, or legality of vehicles listed by vendors.`
    },
    {
      title: "14. Indemnification",
      content: `You agree to indemnify and hold Drivaro harmless from any claims, damages, or expenses arising from your use of the Platform, violation of these terms, or violation of any rights of another party. This includes legal fees and costs incurred in defending against such claims.`
    },
    {
      title: "15. Termination",
      content: `We may terminate or suspend your account immediately for violations of these terms or for any reason we deem appropriate. Upon termination, your right to use the Platform ceases immediately. Sections that should survive termination will remain in effect.`
    },
    {
      title: "16. Governing Law",
      content: `These terms are governed by the laws of the jurisdiction where Drivaro is incorporated. Any disputes shall be resolved through binding arbitration in accordance with applicable arbitration rules. You waive the right to participate in class action lawsuits.`
    },
    {
      title: "17. Changes to Terms",
      content: `We reserve the right to modify these terms at any time. Material changes will be communicated via email or Platform notification. Continued use after changes constitutes acceptance. It is your responsibility to review these terms periodically.`
    },
    {
      title: "18. Contact Information",
      content: `For questions about these Terms of Service, please contact us at legal@Drivaro.com or via our Help Center. We aim to respond to all inquiries within 48 hours.`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Terms of Service
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Last Updated: January 12, 2026</span>
                </div>
              </div>
            </div>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Please read these Terms of Service carefully before using Drivaro. By accessing or using our platform, you agree to be bound by these terms.
          </p>
          <div className="flex gap-3 mt-6">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="outline">Print</Button>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="border-b bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
            {sections.map((section, idx) => (
              <button
                key={idx}
                className="text-left text-muted-foreground hover:text-primary transition-colors py-1"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div key={idx}>
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              {section.content && (
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              )}
              {section.subsections && (
                <div className="space-y-6 mt-4">
                  {section.subsections.map((subsection, subIdx) => (
                    <div key={subIdx}>
                      <h3 className="text-lg font-medium mb-2">
                        {subsection.subtitle}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {subsection.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Notice */}
      <div className="border-t bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Questions about these terms?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions or concerns about our Terms of Service, please don't hesitate to reach out.
            </p>
            <div className="flex gap-3">
              <Button>Contact Legal Team</Button>
              <Button variant="outline">Visit Help Center</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;