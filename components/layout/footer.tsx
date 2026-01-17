import Link from "next/link";
import { Shield, Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
    product: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Integrations", href: "#" },
        { label: "API", href: "#" },
    ],
    company: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Press", href: "#" },
    ],
    legal: [
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
        { label: "Cookie Policy", href: "#" },
        { label: "GDPR", href: "#" },
    ],
    support: [
        { label: "Help Center", href: "#" },
        { label: "Documentation", href: "#" },
        { label: "Contact Us", href: "#contact" },
        { label: "Status", href: "#" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    {/* Brand Column */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-display font-bold text-white tracking-tight">
                                VisaTrack<span className="text-secondary">Malta</span>
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-8 max-w-xs leading-relaxed">
                            The enterprise-grade standard for TCN compliance management in Malta. Precision tracking for your international workforce.
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                <span>hello@visatrack.mt</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                <span>+356 2123 4567</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>Valletta, Malta</span>
                            </div>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Product</h4>
                        <ul className="space-y-2">
                            {footerLinks.product.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm hover:text-primary transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Company</h4>
                        <ul className="space-y-2">
                            {footerLinks.company.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm hover:text-primary transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2">
                            {footerLinks.legal.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm hover:text-primary transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            {footerLinks.support.map((link) => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm hover:text-primary transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-500">
                        © {new Date().getFullYear()} VisaTrack Malta. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a href="#" aria-label="Follow us on Twitter" className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors">
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a href="#" aria-label="Connect on LinkedIn" className="p-2 rounded-full bg-gray-800 hover:bg-primary transition-colors">
                            <Linkedin className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
