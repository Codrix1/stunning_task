import React from "react";
import { ArrowRight, CheckCircle, Users, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CheckCircle,
      title: "Smart Question Framework",
      description: "Our AI asks the right questions to uncover what you really need from your website."
    },
    {
      icon: Zap,
      title: "Instant Clarity",
      description: "Transform vague ideas like 'I need a website for my business' into detailed, actionable prompts."
    },
    {
      icon: Shield,
      title: "Proven Results",
      description: "Get prompts that consistently deliver better websites from any AI or developer."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Small Business Owner",
      content: "I went from 'I need a website' to a detailed 3-page prompt that got me exactly what I wanted!",
      rating: 5
    },
    {
      name: "Mike Rodriguez",
      role: "Freelance Designer", 
      content: "This tool helped me understand my client's vision better than hours of back-and-forth emails.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      role: "Startup Founder",
      content: "The refined prompt saved me weeks of revisions. My developer knew exactly what to build.",
      rating: 5
    }
  ];

  const process = [
    {
      step: "1",
      title: "Share Your Idea",
      description: "Tell us about your website concept, no matter how rough or incomplete."
    },
    {
      step: "2", 
      title: "Answer Smart Questions",
      description: "Our AI guides you through clarifying questions about goals, audience, and features."
    },
    {
      step: "3",
      title: "Get Your Perfect Prompt",
      description: "Receive a detailed, actionable prompt ready for any AI tool or developer."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-sm">PC</span>
              </div>
              <span className="text-lg sm:text-xl font-bold gradient-text">PromptCraft</span>
            </div>
            <Button 
              onClick={() => navigate("/login")} 
              className="bg-primary hover:bg-primary/90 text-sm sm:text-base px-3 sm:px-4"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="ml-1 sm:ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 mb-6 sm:mb-8 glow-effect">
            <Zap className="h-8 sm:h-10 w-8 sm:w-10 text-primary" />
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight px-2">
            Turn Your <span className="gradient-text">Website Ideas</span><br className="hidden sm:block" />
            <span className="sm:hidden"> </span>Into Perfect Prompts
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
            Have a rough idea for a website? Let our AI help you transform it into a clear, 
            detailed prompt that will get you exactly what you envision. No more miscommunication, 
            no more endless revisions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              size="lg" 
              onClick={() => navigate("/login")}
              className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Start Refining Your Idea</span>
              <span className="sm:hidden">Start Refining</span>
              <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 w-full sm:w-auto"
            >
              See How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 px-2">Why PromptCraft Works</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Our AI understands the gap between ideas and implementation
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 sm:p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all">
                <feature.icon className="h-10 sm:h-12 w-10 sm:w-12 text-primary mx-auto mb-4 sm:mb-6" />
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{feature.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 px-2">How It Works</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Three simple steps to transform your idea into a perfect prompt
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            {process.map((step, index) => (
              <div key={index} className="text-center px-4">
                <div className="w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl sm:text-2xl font-bold mx-auto mb-4 sm:mb-6">
                  {step.step}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold mb-4 px-2">What Our Users Say</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Real results from real people who transformed their ideas
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-6 sm:p-8 rounded-2xl bg-card border border-border">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <p className="text-sm sm:text-base font-semibold">{testimonial.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-6 px-2">Ready to Build Your Perfect Website?</h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
            Stop struggling with unclear requirements. Get a crystal-clear prompt that delivers exactly what you want.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/login")}
            className="bg-primary hover:bg-primary/90 text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto"
          >
            <span className="hidden sm:inline">Start Your Free Prompt Session</span>
            <span className="sm:hidden">Start Free Session</span>
            <ArrowRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">PC</span>
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text">PromptCraft</span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground px-4">
            Transform your website ideas into perfect prompts
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
