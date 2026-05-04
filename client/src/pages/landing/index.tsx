import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AUTH_ROUTES } from "@/routes/common/routePath";
import Hero3D from "./components/hero-3d";
import Logo from "@/components/logo/logo";
import { 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowRight,
  CheckCircle2,
  Users,
  Database,
  BarChart3,
  Mail,
  Github,
  Twitter,
  Linkedin,
  Plus
} from "lucide-react";

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  const stats = [
    { label: "Files Stored", value: "10M+", icon: <Database size={20} /> },
    { label: "Active Users", value: "50k+", icon: <Users size={20} /> },
    { label: "Uptime", value: "99.9%", icon: <Zap size={20} /> },
    { label: "Data Secured", value: "5PB+", icon: <ShieldCheck size={20} /> },
  ];

  const features = [
    {
      title: "End-to-End Encryption",
      desc: "Your data is encrypted before it even leaves your device. Only you hold the keys.",
      icon: <ShieldCheck className="text-primary" />
    },
    {
      title: "Global Distribution",
      desc: "Edge nodes across the globe ensure your files are delivered at lightning speed.",
      icon: <Globe className="text-primary" />
    },
    {
      title: "Real-time Analytics",
      desc: "Monitor your storage usage and file access patterns in real-time with beautiful charts.",
      icon: <BarChart3 className="text-primary" />
    }
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$0",
      features: ["5GB Storage", "Basic Analytics", "Community Support", "1 Project"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$19",
      features: ["100GB Storage", "Advanced Analytics", "Priority Support", "Unlimited Projects", "Custom Domain"],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      features: ["Unlimited Storage", "White-label Solution", "Dedicated Manager", "SSO & Audit Logs"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white overflow-x-hidden selection:bg-blue-500/30">
      {/* 3D Background */}
      <Hero3D />

      {/* Navigation */}
      <nav className="relative z-50 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto backdrop-blur-sm">
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Logo url="/" />
        </motion.div>
        
        <motion.div 
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400"
        >
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <div className="w-[1px] h-4 bg-white/10" />
          <Link to={AUTH_ROUTES.SIGN_IN} className="hover:text-white transition-colors">Sign In</Link>
          <Link to={AUTH_ROUTES.SIGN_UP}>
            <Button className="bg-primary hover:opacity-90 text-primary-foreground rounded-full px-6 shadow-lg shadow-primary/20 border-none">
              Get Started
            </Button>
          </Link>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 md:px-12 md:pt-40 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
            <Zap size={14} className="animate-pulse" />
            <span className="font-medium tracking-wide">V2.0 is now live with enhanced security</span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent leading-[1.1]"
          >
            Store your files <br />
            <span className="text-primary">beyond the clouds.</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            The fastest, most secure cloud storage solution for creators and teams. 
            Built on a decentralized global network for 100% availability.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to={AUTH_ROUTES.SIGN_UP} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto h-16 px-10 text-xl bg-primary hover:opacity-90 text-primary-foreground rounded-2xl shadow-2xl shadow-primary/30 flex items-center gap-3 group transition-all duration-300 transform hover:scale-105 border-none">
                Start Free Account
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto h-16 px-10 text-xl border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-2xl backdrop-blur-xl transition-all">
              Watch Demo
            </Button>
          </motion.div>
        </motion.div>
      </main>

      {/* Stats Section */}
      <section className="relative z-10 py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold mb-1 tracking-tight">{stat.value}</div>
                <div className="text-neutral-500 text-sm font-medium uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Designed for scale.</h2>
          <p className="text-neutral-400 text-xl max-w-2xl mx-auto">
            Our infrastructure is built to handle millions of requests without breaking a sweat.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group p-10 rounded-[2.5rem] bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 hover:border-blue-500/50 transition-all duration-500"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:bg-primary/20 transition-colors">
                <div className="scale-150">{feature.icon}</div>
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-neutral-400 leading-relaxed text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-32 bg-blue-600/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-10 leading-tight">
                Simplicity is at the <br /> 
                <span className="text-primary text-gradient bg-clip-text">core of DHR Nest.</span>
              </h2>
              <div className="space-y-10">
                {[
                  { title: "Connect your devices", desc: "Install our client on any device and authenticate securely." },
                  { title: "Drag and drop", desc: "Upload files of any size with our intuitive high-speed uploader." },
                  { title: "Share and collaborate", desc: "Generate secure links and work with your team in real-time." }
                ].map((step, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center font-bold text-xl text-primary-foreground">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="text-2xl font-semibold mb-2">{step.title}</h4>
                      <p className="text-neutral-400 text-lg leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full" />
              <div className="relative aspect-square rounded-[3rem] border border-white/10 bg-black overflow-hidden shadow-2xl">
                <div className="absolute top-0 left-0 right-0 h-8 bg-neutral-900 flex items-center px-4 gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="p-8 pt-16 h-full flex flex-col justify-center">
                   <div className="w-full h-4 bg-white/5 rounded-full mb-6" />
                   <div className="w-3/4 h-4 bg-white/5 rounded-full mb-6" />
                   <div className="w-full h-32 bg-primary/10 rounded-2xl border border-primary/20 border-dashed flex items-center justify-center">
                      <div className="flex flex-col items-center text-primary">
                        <Plus className="mb-2" />
                        <span className="text-sm font-medium uppercase tracking-wider">Drop files here</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Simple, fair pricing.</h2>
        <p className="text-neutral-400 text-xl mb-20">Choose the plan that's right for you or your business.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((plan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative p-10 rounded-[2.5rem] border transition-all duration-300 ${
                plan.popular 
                  ? "bg-primary border-primary shadow-2xl shadow-primary/20 scale-105 z-20" 
                  : "bg-white/[0.03] border-white/10 hover:border-white/20 z-10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-primary px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-8">
                <span className="text-5xl font-bold">{plan.price}</span>
                <span className={`${plan.popular ? "text-primary-foreground/70" : "text-neutral-500"}`}>/month</span>
              </div>
              <ul className="text-left space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle2 size={18} className={plan.popular ? "text-primary-foreground" : "text-primary"} />
                    <span className={plan.popular ? "text-primary-foreground/90" : "text-neutral-300"}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className={`w-full h-14 rounded-2xl text-lg font-bold transition-all border-none ${
                plan.popular 
                  ? "bg-white text-primary hover:bg-neutral-100" 
                  : "bg-primary text-primary-foreground hover:opacity-90"
              }`}>
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="relative rounded-[3rem] bg-gradient-to-br from-primary to-orange-900 p-16 md:p-24 overflow-hidden text-center">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
           <div className="relative z-10">
             <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to secure your digital assets?</h2>
             <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
               Join thousands of developers and teams who trust DHR Nest for their most important data.
             </p>
             <Link to={AUTH_ROUTES.SIGN_UP}>
               <Button className="h-16 px-12 text-xl bg-white text-primary hover:bg-neutral-100 rounded-2xl font-bold shadow-2xl transition-all hover:scale-105 border-none">
                 Get Started Now — It's Free
               </Button>
             </Link>
           </div>
        </div>
      </section>

      {/* Big Footer */}
      <footer className="relative z-10 pt-32 pb-16 bg-black/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
              <Logo url="/" />
              <p className="mt-6 text-neutral-400 leading-relaxed text-lg max-w-sm">
                Next-generation cloud storage for the modern decentralized web. Secure, fast, and reliable.
              </p>
              <div className="flex gap-5 mt-8">
                <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-primary transition-all text-neutral-400 hover:text-white border border-white/10"><Twitter size={20} /></a>
                <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-primary transition-all text-neutral-400 hover:text-white border border-white/10"><Github size={20} /></a>
                <a href="#" className="p-3 rounded-full bg-white/5 hover:bg-primary transition-all text-neutral-400 hover:text-white border border-white/10"><Linkedin size={20} /></a>
              </div>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-8 tracking-wide uppercase">Product</h5>
              <ul className="space-y-4 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Client SDKs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8 tracking-wide uppercase">Company</h5>
              <ul className="space-y-4 text-neutral-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-8 tracking-wide uppercase">Newsletter</h5>
              <p className="text-neutral-400 mb-6 leading-relaxed">Stay updated with our latest news and product updates.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex-1 focus:outline-none focus:border-primary transition-colors"
                />
                <Button className="bg-primary hover:opacity-90 text-primary-foreground p-3 rounded-xl border-none">
                  <Mail size={20} />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-neutral-500 text-sm">
            <div>© {new Date().getFullYear()} DHR Nest Inc. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
