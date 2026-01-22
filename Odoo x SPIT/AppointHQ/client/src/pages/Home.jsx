import { Link } from 'react-router-dom';
import { Calendar, Clock, UserCheck, Shield, Zap, BarChart3, Users, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  const features = [
    {
      title: "Real-time Booking",
      description: "Live availability checking prevents double bookings and ensures smooth scheduling flow.",
      icon: Calendar,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Role-Based Access",
      description: "Dedicated portals for Customers, Organizers, and Admins with tailored features.",
      icon: UserCheck,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Flexible Scheduling",
      description: "Set custom durations, buffers, and capacity limits to match your requirements.",
      icon: Clock,
      color: "from-amber-500 to-orange-500"
    },
    {
      title: "Secure Platform",
      description: "Enterprise-grade security with JWT authentication and encrypted data.",
      icon: Shield,
      color: "from-emerald-500 to-green-500"
    },
    {
      title: "Instant Setup",
      description: "Get up and running in minutes with our intuitive onboarding process.",
      icon: Zap,
      color: "from-indigo-500 to-violet-500"
    },
    {
      title: "Analytics",
      description: "Gain insights into your booking trends and customer behavior.",
      icon: BarChart3,
      color: "from-cyan-500 to-sky-500"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
            >
              <Calendar className="h-4 w-4" />
              <span>Smart Appointment Booking Platform</span>
            </motion.div>

            {/* Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Booking Made
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Beautifully Simple
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Experience seamless appointment management with AppointHQ.
              Automate your schedule, delight your customers, and grow your business.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-card border border-border text-card-foreground rounded-lg font-semibold hover:bg-accent transition-all"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Bookings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Everything you need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features to streamline your appointment management
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:scale-105"
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${feature.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Ready to get started?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Join thousands of businesses already using AppointHQ to manage their appointments.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Start Free Trial
              <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
