import { Link } from "react-router-dom";
import { Video, Upload, Shield, Zap, Play, CheckCircle, ArrowRight, Sparkles, Globe, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Upload,
    title: "Easy Upload",
    description: "Drag & drop your videos with support for all major formats",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description: "Automated transcoding and optimization for all devices",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Shield,
    title: "Content Safety",
    description: "AI-powered moderation to keep your content safe",
    color: "from-emerald-500 to-teal-500"
  },
  {
    icon: BarChart3,
    title: "Analytics",
    description: "Deep insights into viewer engagement and performance",
    color: "from-violet-500 to-purple-500"
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Lightning-fast delivery to viewers worldwide",
    color: "from-rose-500 to-pink-500"
  },
  {
    icon: Sparkles,
    title: "AI Enhancement",
    description: "Auto-generate captions, thumbnails, and highlights",
    color: "from-indigo-500 to-blue-500"
  }
];

const stats = [
  { value: "10K+", label: "Videos Processed" },
  { value: "99.9%", label: "Uptime" },
  { value: "50+", label: "Countries" },
  { value: "24/7", label: "Support" }
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
              <Video className="h-5 w-5 text-primary-foreground" />
              <div className="absolute inset-0 rounded-xl bg-primary/50 blur-md -z-10" />
            </div>
            <span className="text-xl font-bold text-foreground">StreamHub</span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" className="font-medium">Sign in</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl" />
          <div className="absolute top-40 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute top-60 right-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Enterprise-grade video platform</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Upload, Process &
            <br />
            <span className="relative">
              <span className="text-primary">Stream Videos</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 4 100 2 150 6C200 10 250 4 298 8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30" />
              </svg>
            </span>
          </h1>
          
          <p className="mt-8 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            The all-in-one platform for video management. Upload your content, 
            let our AI handle processing and moderation, then stream anywhere.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link to="/register">
              <Button size="lg" className="bg-primary text-primary-foreground font-semibold h-14 px-8 text-base shadow-xl shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="font-semibold h-14 px-8 text-base border-2 hover:bg-muted/50">
                <Play className="mr-2 h-5 w-5 fill-current" />
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Floating badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Free 14-day trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Cancel anytime
            </span>
          </div>
        </div>

        {/* Hero Preview */}
        <div className="relative mt-20 mx-auto max-w-5xl animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50 bg-muted/30">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-amber-400" />
              <div className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-4 text-xs text-muted-foreground">StreamHub Dashboard</span>
            </div>
            <div className="p-6 bg-gradient-to-br from-muted/10 to-muted/30">
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="group aspect-video rounded-xl bg-gradient-to-br from-muted/60 to-muted/80 flex items-center justify-center cursor-pointer hover:from-primary/10 hover:to-primary/20 transition-all duration-300">
                    <div className="h-10 w-10 rounded-full bg-background/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-4 w-4 text-foreground ml-0.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-4xl sm:text-5xl font-bold text-primary">{stat.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Everything you need to succeed
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
              Powerful features to manage your video content from upload to delivery
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div 
                key={i} 
                className="group relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-primary/30 hover:bg-card transition-all duration-300"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="mx-auto max-w-4xl">
          <div className="relative rounded-3xl bg-primary p-12 sm:p-16 text-center overflow-hidden">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%)] bg-[size:60px_60px]" />
            </div>
            
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground">
                Ready to transform your video workflow?
              </h2>
              <p className="mt-4 text-primary-foreground/80 text-lg max-w-lg mx-auto">
                Join thousands of creators and businesses streaming with StreamHub
              </p>
              <div className="mt-10">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="font-semibold h-14 px-10 text-base shadow-xl hover:-translate-y-0.5 transition-all">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10 px-6">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">StreamHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 StreamHub. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
