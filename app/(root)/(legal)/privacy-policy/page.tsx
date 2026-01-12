import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, Download, Calendar, Lock, Eye, Users, Share2, Database, Bell } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const quickLinks = [
    { icon: Database, title: "What We Collect", link: "#collection" },
    { icon: Eye, title: "How We Use Data", link: "#usage" },
    { icon: Share2, title: "Data Sharing", link: "#sharing" },
    { icon: Lock, title: "Your Rights", link: "#rights" }
  ];

  const sections = [
    {
      title: "1. Introduction",
      content: `At Drivaro, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform. By using Drivaro, you agree to the collection and use of information in accordance with this policy. We are committed to protecting your personal data and ensuring transparency in our practices.`
    },
    {
      title: "2. Information We Collect",
      subsections: [
        {
          subtitle: "2.1 Personal Information",
          text: "We collect information you provide directly, including your name, email address, phone number, date of birth, driver's license information, and payment details. For vendors, we also collect business information, tax identification numbers, and bank account details for payouts."
        },
        {
          subtitle: "2.2 Identity Verification Documents",
          text: "To ensure platform safety, we collect copies of government-issued identification, driver's licenses, and vehicle registration documents. These documents are stored securely and used solely for verification purposes."
        },
        {
          subtitle: "2.3 Booking and Transaction Data",
          text: "We collect information about your bookings including rental dates, vehicle details, pricing, payment information, and communication with vendors. This includes damage reports and photographs submitted during rental inspections."
        },
        {
          subtitle: "2.4 Automatically Collected Information",
          text: "We automatically collect device information, IP addresses, browser type, operating system, and usage data through cookies and similar technologies. This includes pages viewed, features used, and time spent on the platform."
        },
        {
          subtitle: "2.5 Location Data",
          text: "With your permission, we collect location data to show nearby vehicles, assist with navigation, and verify pickup/drop-off locations. You can disable location services in your device settings at any time."
        }
      ]
    },
    {
      title: "3. How We Use Your Information",
      content: `We use your information to provide, maintain, and improve our services. This includes processing bookings, facilitating payments, verifying user identity, preventing fraud, personalizing your experience, sending transactional notifications, providing customer support, analyzing platform usage, conducting research and development, complying with legal obligations, and enforcing our terms and policies.`
    },
    {
      title: "4. How We Share Your Information",
      subsections: [
        {
          subtitle: "4.1 With Other Users",
          text: "When you book a vehicle, we share necessary information with the vendor including your name, profile photo, and contact details. Similarly, vendors' information is shared with customers for their bookings."
        },
        {
          subtitle: "4.2 With Service Providers",
          text: "We share data with third-party service providers who help us operate the platform, including payment processors (Stripe), cloud storage providers (AWS), email services (SendGrid), analytics tools, and customer support platforms."
        },
        {
          subtitle: "4.3 For Legal Purposes",
          text: "We may disclose information when required by law, in response to legal process, to protect our rights and safety, to investigate fraud or violations, or in connection with a business transaction such as a merger or acquisition."
        },
        {
          subtitle: "4.4 With Your Consent",
          text: "We may share information with other parties when you explicitly give us consent to do so, such as when you authorize third-party integrations or participate in promotional activities."
        }
      ]
    },
    {
      title: "5. Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal information. This includes encryption of data in transit and at rest, secure servers, regular security audits, access controls and authentication, and employee training on data protection. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`
    },
    {
      title: "6. Data Retention",
      content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Account information is retained while your account is active. Booking and transaction data is retained for at least 7 years for legal and accounting purposes. After the retention period, we securely delete or anonymize your data.`
    },
    {
      title: "7. Your Privacy Rights",
      subsections: [
        {
          subtitle: "7.1 Access and Correction",
          text: "You have the right to access your personal information and request corrections to inaccurate data. You can view and update most information directly in your account settings."
        },
        {
          subtitle: "7.2 Data Portability",
          text: "You can request a copy of your personal data in a structured, commonly used format. We will provide this within 30 days of your request."
        },
        {
          subtitle: "7.3 Deletion",
          text: "You can request deletion of your personal information, subject to certain legal exceptions. We may retain some data as required for legal compliance, dispute resolution, or legitimate business purposes."
        },
        {
          subtitle: "7.4 Marketing Opt-Out",
          text: "You can opt out of marketing communications at any time by clicking the unsubscribe link in emails or updating your notification preferences in account settings."
        },
        {
          subtitle: "7.5 Cookie Management",
          text: "You can control cookies through your browser settings. Note that disabling certain cookies may affect platform functionality."
        }
      ]
    },
    {
      title: "8. Cookies and Tracking",
      content: `We use cookies and similar technologies to provide and improve our services. Essential cookies are necessary for platform functionality. Analytics cookies help us understand usage patterns. Marketing cookies enable personalized advertising. You can manage cookie preferences through your browser settings or our cookie consent tool.`
    },
    {
      title: "9. Third-Party Services",
      content: `Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies before providing any information. Third-party services integrated with our platform (such as social login) have their own privacy policies.`
    },
    {
      title: "10. Children's Privacy",
      content: `Our services are not intended for users under 18 years of age. We do not knowingly collect information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to delete that information promptly.`
    },
    {
      title: "11. International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. We ensure appropriate safeguards are in place, including standard contractual clauses and adherence to international frameworks.`
    },
    {
      title: "12. California Privacy Rights (CCPA)",
      content: `California residents have additional rights under the California Consumer Privacy Act (CCPA). This includes the right to know what personal information is collected, the right to delete personal information, the right to opt-out of sale of personal information (we do not sell personal information), and the right to non-discrimination for exercising CCPA rights.`
    },
    {
      title: "13. European Privacy Rights (GDPR)",
      content: `If you are in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR). This includes the right to access, rectification, erasure, restriction of processing, data portability, and the right to object to processing. You also have the right to lodge a complaint with your local data protection authority.`
    },
    {
      title: "14. Changes to This Policy",
      content: `We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of material changes via email or platform notification. The "Last Updated" date at the top indicates when changes were made. Continued use after changes constitutes acceptance of the updated policy.`
    },
    {
      title: "15. Contact Us",
      content: `If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at privacy@Drivaro.com. You can also reach our Data Protection Officer at dpo@Drivaro.com. We will respond to your inquiry within 30 days.`
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-10 w-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                Privacy Policy
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
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use Drivaro.
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

      {/* Quick Links */}
      <div className="border-b bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-lg font-semibold mb-6">Quick Navigation</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {quickLinks.map((item, idx) => (
              <button
                key={idx}
                className="flex items-center gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors text-left"
              >
                <item.icon className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{item.title}</span>
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

      {/* Privacy Commitment Card */}
      <div className="border-t">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-6 bg-muted/30">
            <div className="flex items-start gap-4">
              <Lock className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Our Privacy Commitment</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We are committed to protecting your privacy and being transparent about our data practices. Your trust is important to us, and we continuously work to maintain the highest standards of data protection.
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4 text-primary" />
                    <span className="text-sm">Encrypted Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" />
                    <span className="text-sm">Secure Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm">User Control</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="border-t bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Questions about your privacy?</h3>
            <p className="text-sm text-muted-foreground mb-4">
              If you have any questions or concerns about how we handle your personal information, our privacy team is here to help.
            </p>
            <div className="flex gap-3">
              <Button>Contact Privacy Team</Button>
              <Button variant="outline">Manage Preferences</Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;