import Link from "next/link";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import {
  Shield,
  Clock,
  Bell,
  FileCheck,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Lock,
  Globe,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Visa Expiry Tracking",
    description:
      "Automatic monitoring of work permit and visa expiration dates with configurable alerts at 90, 60, and 30 days.",
  },
  {
    icon: Bell,
    title: "Smart Alerts",
    description:
      "Proactive notifications via email and dashboard when documents are approaching expiry or action is required.",
  },
  {
    icon: FileCheck,
    title: "Document Management",
    description:
      "Secure storage for all employee documents including passports, visas, and work permits in one central location.",
  },
  {
    icon: Users,
    title: "Employee Profiles",
    description:
      "Comprehensive employee records with complete visa history, document attachments, and compliance status.",
  },
  {
    icon: TrendingUp,
    title: "Compliance Dashboard",
    description:
      "Real-time compliance health score and visual analytics showing your workforce's documentation status.",
  },
  {
    icon: Lock,
    title: "Secure & GDPR Compliant",
    description:
      "Enterprise-grade security with data encryption, audit logs, and full GDPR compliance for peace of mind.",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "€49",
    period: "/month",
    description: "Perfect for small businesses",
    features: [
      "Up to 25 employees",
      "Email alerts",
      "Basic reporting",
      "Document storage (5GB)",
      "Email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "€99",
    period: "/month",
    description: "For growing companies",
    features: [
      "Up to 100 employees",
      "SMS & Email alerts",
      "Advanced analytics",
      "Document storage (25GB)",
      "Priority support",
      "API access",
      "Custom branding",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations",
    features: [
      "Unlimited employees",
      "Multi-location support",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
      "On-premise option",
      "SSO/SAML",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  {
    quote:
      "VisaTrack has transformed how we manage our international workforce. We've reduced compliance incidents by 95% since implementation.",
    author: "Maria Borg",
    role: "HR Director",
    company: "Malta Gaming Authority",
    avatar: "MB",
  },
  {
    quote:
      "The automated alerts alone have saved us countless hours. We never miss a renewal deadline anymore.",
    author: "James Azzopardi",
    role: "Operations Manager",
    company: "GrandHarbour Logistics",
    avatar: "JA",
  },
  {
    quote:
      "Simple to use, incredibly effective. Our compliance health went from 72% to 100% in just two months.",
    author: "Elena Vella",
    role: "CEO",
    company: "Fintech Solutions Malta",
    avatar: "EV",
  },
];

const stats = [
  { value: "500+", label: "Companies" },
  { value: "15,000+", label: "Employees Tracked" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-cyan-50" />
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-primary/5 to-transparent" />

        {/* Animated circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full filter blur-3xl animate-pulse delay-1000" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              Trusted by 500+ Maltese Employers
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              TCN Compliance{" "}
              <span className="bg-gradient-to-r from-primary to-teal-500 bg-clip-text text-transparent">
                Made Simple
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Track work permits, manage visa renewals, and stay compliant with
              Malta&apos;s immigration requirements—all in one powerful platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/register"
                className="group flex items-center gap-2 bg-gradient-to-r from-primary to-teal-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-primary hover:text-primary transition-all"
              >
                View Demo
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                14-day free trial
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10 pointer-events-none" />
            <div className="bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="ml-4 text-xs text-gray-400">dashboard.visatrack.mt</span>
              </div>
              <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                {/* Stats Cards Preview */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Total TCNs", value: "47", color: "text-gray-900" },
                    { label: "Expiring Soon", value: "8", color: "text-amber-500" },
                    { label: "Expired", value: "2", color: "text-red-500" },
                    { label: "Compliance", value: "95%", color: "text-green-500" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
                      <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>
                {/* Table Preview */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 border-b bg-gray-50 flex justify-between items-center">
                    <span className="font-semibold text-gray-700">Employee Compliance List</span>
                    <div className="w-48 h-8 bg-gray-100 rounded-md" />
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[1, 2, 3].map((row) => (
                      <div key={row} className="px-4 py-3 flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10" />
                        <div className="flex-1 space-y-1">
                          <div className="h-3 w-32 bg-gray-100 rounded" />
                          <div className="h-2 w-24 bg-gray-50 rounded" />
                        </div>
                        <div className="h-6 w-20 bg-green-100 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for TCN Compliance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed specifically for Maltese employers managing
              Third Country National employees.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-teal-100 rounded-xl flex items-center justify-center mb-6 group-hover:from-primary group-hover:to-teal-500 transition-all">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <div
                key={i}
                className={`relative rounded-2xl p-8 ${plan.popular
                  ? "bg-gradient-to-br from-primary to-teal-600 text-white shadow-2xl shadow-primary/30 scale-105"
                  : "bg-white border border-gray-200"
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> MOST POPULAR
                  </div>
                )}
                <h3 className={`text-xl font-semibold mb-2 ${plan.popular ? "text-white" : "text-gray-900"}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? "text-white/80" : "text-gray-500"}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900"}`}>
                    {plan.price}
                  </span>
                  <span className={plan.popular ? "text-white/80" : "text-gray-500"}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-5 h-5 ${plan.popular ? "text-white" : "text-green-500"}`} />
                      <span className={`text-sm ${plan.popular ? "text-white" : "text-gray-600"}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className={`block text-center py-3 rounded-lg font-semibold transition-all ${plan.popular
                    ? "bg-white text-primary hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                    }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Leading Maltese Companies
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say about VisaTrack.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-teal-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-primary to-teal-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="w-16 h-16 text-white/20 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Stay Compliant?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join 500+ Maltese employers who trust VisaTrack for their TCN compliance management.
            Start your free trial today—no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition-colors border border-white/20"
            >
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
