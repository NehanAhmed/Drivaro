import React from 'react';
import { Target, Shield, Sparkles, Github, Instagram, Twitter, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconBrandGithub, IconBrandInstagram, IconBrandX, IconGlobe, IconPhone } from '@tabler/icons-react';

const AboutUsPage = () => {
    const values = [
        {
            icon: Target,
            title: "Our Mission",
            description: "To revolutionize car rentals by connecting car owners directly with customers, creating a seamless, transparent, and trustworthy marketplace."
        },
        {
            icon: Shield,
            title: "Trust & Safety",
            description: "Every vendor is verified, every vehicle is inspected, and every booking is protected. Your peace of mind is our priority."
        },
        {
            icon: Sparkles,
            title: "Innovation First",
            description: "We leverage cutting-edge technology to provide real-time availability, instant bookings, and comprehensive damage documentation."
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section - Our Story */}
            <section className="border-b border-border">
                <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
                    <div className="text-center space-y-6 mb-12">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                            Our Story
                        </h1>
                        <div className="w-20 h-1 bg-accent mx-auto rounded-full"></div>
                    </div>

                    <div className="prose prose-lg max-w-none space-y-6 text-foreground/80">
                        <p className="text-lg md:text-xl leading-relaxed">
                            RentDrive was born from a simple observation: car rental should be easier, more transparent,
                            and more accessible. Traditional rental companies often come with hidden fees, limited selection,
                            and impersonal service. We knew there had to be a better way.
                        </p>

                        <p className="text-lg md:text-xl leading-relaxed">
                            Our founder, Nehan Ahmed, recognized that countless car owners had vehicles sitting idle while
                            travelers and locals alike struggled to find affordable, reliable transportation. The solution
                            was clear—create a platform that brings both sides together in a safe, efficient marketplace.
                        </p>

                        <p className="text-lg md:text-xl leading-relaxed">
                            Today, RentDrive is a thriving multi-vendor platform where verified car owners can monetize
                            their vehicles and customers can access a diverse fleet of cars at competitive prices. We've
                            built more than just a rental platform; we've created a community built on trust, convenience,
                            and mutual benefit.
                        </p>
                    </div>
                </div>
            </section>

            {/* Problem We Solve Section */}
            <section className="py-16 md:py-24">
                <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                            The Problem We Solve
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Traditional car rental is broken. We're here to fix it.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* For Customers */}
                        <Card className="border border-border">
                            <CardContent className="p-8 space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                                    <span className="text-2xl">🚗</span>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">For Customers</h3>
                                <ul className="space-y-3 text-foreground/70">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                        <span><strong className="text-foreground">Hidden fees and surprises</strong> at checkout from traditional rental companies</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                        <span><strong className="text-foreground">Limited vehicle selection</strong> with outdated or generic options</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                        <span><strong className="text-foreground">Inflexible rental terms</strong> and inconvenient pickup/return locations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                        <span><strong className="text-foreground">Poor customer service</strong> and lack of transparency in damage claims</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* For Car Owners */}
                        <Card className="border border-border">
                            <CardContent className="p-8 space-y-4">
                                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                                    <span className="text-2xl">🔑</span>
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">For Car Owners</h3>
                                <ul className="space-y-3 text-foreground/70">
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                        <span><strong className="text-foreground">Cars sitting idle</strong> and depreciating without generating income</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                        <span><strong className="text-foreground">No easy way</strong> to connect with reliable renters</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                        <span><strong className="text-foreground">Safety concerns</strong> about who's renting their vehicle</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0"></span>
                                        <span><strong className="text-foreground">Complex logistics</strong> for managing bookings and payments</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Our Solution */}
                    <Card className="border-2 border-accent bg-accent/5">
                        <CardContent className="p-8 md:p-10">
                            <div className="text-center space-y-4 mb-8">
                                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto">
                                    <Sparkles className="w-8 h-8 text-accent-foreground" />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-foreground">Our Solution</h3>
                            </div>
                            <p className="text-lg text-center text-foreground/80 leading-relaxed max-w-3xl mx-auto">
                                RentDrive connects verified car owners with customers through a secure, transparent platform.
                                We handle verification, insurance, payments, and support—so both parties can focus on what
                                matters: a great rental experience. With real-time availability, instant bookings, competitive
                                pricing, and comprehensive damage documentation, we've made car rental simple, safe, and satisfying.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* How We Serve You Section */}
            <section className="border-t border-border py-16 md:py-24 bg-card">
                <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                            How We Serve You
                        </h2>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Our commitment goes beyond connecting renters and owners
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {values.map((value, index) => (
                            <Card key={index} className="border border-border hover:shadow-lg transition-shadow duration-300">
                                <CardContent className="p-8 text-center space-y-4">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
                                        <value.icon className="w-8 h-8 text-primary" strokeWidth={2} />
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                                    <p className="text-foreground/70 leading-relaxed">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Service Features */}
                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        <Card className="border border-border">
                            <CardContent className="p-6">
                                <h4 className="text-lg font-semibold text-foreground mb-3">For Customers</h4>
                                <ul className="space-y-2 text-foreground/70">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        Browse verified vehicles without signup
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        Instant booking with transparent pricing
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        Secure payment with deposit protection
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        24/7 customer support
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        Photo documentation for damage claims
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="border border-border">
                            <CardContent className="p-6">
                                <h4 className="text-lg font-semibold text-foreground mb-3">For Vendors</h4>
                                <ul className="space-y-2 text-foreground/70">
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        Easy vehicle listing with photo gallery
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        Automated booking management
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        Direct payouts with transparent commission
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        Analytics dashboard for earnings tracking
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                                        Verified customer bookings only
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Founder Section */}
                    <Card className="border-2 border-primary/20 bg-gradient-to-br from-card to-primary/5">
                        <CardContent className="p-8 md:p-12">
                            <div className="text-center space-y-6">
                                <div>
                                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                                        Built by Nehan Ahmed
                                    </h3>
                                    <p className="text-muted-foreground">
                                        Full-Stack Developer & Entrepreneur
                                    </p>
                                </div>

                                <p className="text-foreground/80 leading-relaxed max-w-2xl mx-auto">
                                    Passionate about building technology that solves real-world problems and creates
                                    opportunities for people. RentDrive is a testament to what happens when innovation
                                    meets purpose.
                                </p>

                                {/* Contact & Social Links */}
                                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                                    <Button variant="outline" size="sm" asChild>
                                        <a href="https://nehan.vercel.app" target="_blank" rel="noopener noreferrer" className="gap-2">
                                            <IconGlobe className="w-4 h-4" />
                                            Portfolio
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <a href="https://github.com/NehanAhmed" target="_blank" rel="noopener noreferrer" className="gap-2">
                                            <IconBrandGithub className="w-4 h-4" />
                                            GitHub
                                        </a>
                                    </Button>

                                    <Button variant="outline" size="sm" asChild>
                                        <a href="https://instagram.com/__nehanahmed" target="_blank" rel="noopener noreferrer" className="gap-2">
                                            <IconBrandInstagram className="w-4 h-4" />
                                            Instagram
                                        </a>
                                    </Button>

                                    <Button variant="outline" size="sm" asChild>
                                        <a href="https://x.com/Nehanahmed988" target="_blank" rel="noopener noreferrer" className="gap-2">
                                            <IconBrandX className="w-4 h-4" />
                                            Twitter
                                        </a>
                                    </Button>

                                    <Button variant="outline" size="sm" asChild>
                                        <a href="tel:03111088051" className="gap-2">
                                            <IconPhone className="w-4 h-4" />
                                            03111088051
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
};

export default AboutUsPage;