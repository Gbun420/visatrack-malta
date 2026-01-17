"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
  Globe,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Visa Expiry Tracking",
    description:
      "Automated monitoring of work permit and visa expiration dates with configurable multi-stage alerts.",
  },
  {
    icon: Bell,
    title: "Smart Compliance Alerts",
    description:
      "Proactive notifications via email and SMS when documents approach expiry or regulatory changes occur.",
  },
  {
    icon: FileCheck,
    title: "Document Vault",
    description:
      "Enterprise-grade secure storage for passports, identity documents, and work permits with audit trails.",
  },
  {
    icon: Users,
    title: "Workforce Management",
    description:
      "Comprehensive digital records for your international workforce with full compliance history.",
  },
  {
    icon: TrendingUp,
    title: "Real-time Analytics",
    description:
      "Visual intelligence dashboards showing workforce compliance health and upcoming renewal pipelines.",
  },
  {
    icon: Shield,
    title: "GDPR & Data Security",
    description:
      "Built on industry-leading security standards to ensure your sensitive employee data remains protected.",
  },
];

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 selection:bg-accent/30">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <motion.div
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-8 shadow-premium"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Zap className="w-4 h-4 text-accent" />
                <span>The Standard for Compliance in Malta</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight text-slate-900 leading-[1.1] mb-8">
                Manage Your TCN Workforce with <span className="text-secondary">Precision</span>
              </h1>

              <p className="text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
                Automate visa tracking, work permit renewals, and document compliance for your international team. Designed for Maltese enterprises.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  href="/register"
                  className="group flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1"
                >
                  Start Your Free Trial
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-50 transition-all duration-300"
                >
                  Explore Dashboard
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300" />
                    </div>
                  ))}
                </div>
                <div className="text-sm text-slate-500">
                  <span className="font-bold text-slate-900">500+</span> teams staying compliant
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex-1 relative w-full max-w-2xl lg:max-w-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Decorative Elements */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

              <div className="relative bg-white rounded-2xl shadow-premium border border-slate-100 overflow-hidden lg:rotate-2 hover:rotate-0 transition-transform duration-700">
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                    <div className="w-3 h-3 rounded-full bg-slate-200" />
                    <div className="w-3 h-3 rounded-full bg-slate-100" />
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Enterprise Dashboard</div>
                </div>
                <div className="p-8">
                  {/* Dashboard Mockup Content */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 p-4">
                      <div className="w-8 h-2 bg-slate-200 rounded mb-3" />
                      <div className="w-16 h-6 bg-primary/10 rounded" />
                    </div>
                    <div className="h-24 bg-slate-50 rounded-xl border border-slate-100 p-4">
                      <div className="w-8 h-2 bg-slate-200 rounded mb-3" />
                      <div className="w-16 h-6 bg-accent/10 rounded" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50">
                        <div className="w-10 h-10 rounded-lg bg-slate-100" />
                        <div className="flex-1 space-y-2">
                          <div className="h-2.5 w-32 bg-slate-200 rounded" />
                          <div className="h-2 w-20 bg-slate-100 rounded" />
                        </div>
                        <div className="w-16 h-5 bg-green-50 rounded-full flex items-center justify-center">
                          <div className="w-10 h-1.5 bg-green-400 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Quote Section */}
      <section className="py-20 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <Globe className="w-64 h-64 text-white" />
        </div>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="w-6 h-6 text-accent fill-current" />
              ))}
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-10 leading-tight">
              &quot;VisaTrack has fundamentally changed how we manage our international workforce. What used to be a spreadsheet headache is now a seamless, automated process.&quot;
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-700" />
              <div className="text-left">
                <div className="text-white font-bold">Elena Borg</div>
                <div className="text-slate-400 text-sm">HR Director, Malta Tech Hub</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-base font-bold text-secondary uppercase tracking-[0.2em] mb-4">Powerful Capabilities</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-6">Designed for Compliance, Built for Performance</h3>
            <p className="text-lg text-slate-600">Every feature you need to manage Third Country National employees within Malta&apos;s regulatory framework.</p>
          </div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="group bg-white p-8 rounded-2xl shadow-premium border border-slate-100 hover:shadow-premium-hover hover:border-accent/30 transition-all duration-300"
                variants={fadeIn}
              >
                <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h4>
                <p className="text-slate-500 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Compliance Showcase */}
      <section className="py-24 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-[32px] p-8 lg:p-16 relative overflow-hidden">
            {/* Abstract light */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />

            <div className="relative z-10 grid lg:grid-cols-2 items-center gap-16">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-1.5 rounded-full text-xs font-bold mb-6 backdrop-blur-md">
                  <Globe className="w-4 h-4 text-accent" />
                  <span>Regulatory Ready</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8 leading-tight">
                  Stay Ahead of <span className="text-accent underline decoration-accent/30 underline-offset-8">Regulatory Changes</span>
                </h2>
                <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                  Identity management and visa tracking is a moving target. Our platform continuously updates to align with Identity Malta and Jobsplus requirements.
                </p>
                <ul className="space-y-4 mb-10">
                  {[
                    "Automated Single Permit Renewals",
                    "Key Employee Initiative (KEI) Support",
                    "Jobsplus Termination Alerts",
                    "Digital Passport Vault"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-white font-medium">
                      <CheckCircle2 className="w-5 h-5 text-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
                <button className="flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all">
                  View Compliance Roadmap
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
              <div className="relative">
                <div className="aspect-square bg-white shadow-premium rounded-2xl border border-white/10 p-2 overflow-hidden transform lg:rotate-6">
                  <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center">
                    <Shield className="w-32 h-32 text-slate-200" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 lg:py-32 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-8 tracking-tight">
              Ready to Secure Your Workforce?
            </h2>
            <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
              Join the leading Maltese companies that trust VisaTrack for their TCN compliance management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-primary text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-premium hover:shadow-premium-hover transition-all duration-300 hover:-translate-y-1"
              >
                Get Started Now
              </Link>
              <Link
                href="#"
                className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all duration-300"
              >
                Talk to Sales
              </Link>
            </div>
            <p className="mt-8 text-sm text-slate-400">No credit card required · 14-day free trial</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
