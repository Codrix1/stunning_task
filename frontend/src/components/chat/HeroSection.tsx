import React from "react";
import { Lightbulb, Wand2, Target, Rocket } from "lucide-react";
import ChatInput from "./ChatInput";

interface HeroSectionProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

const suggestions = [
  { icon: Lightbulb, text: "I want to build an e-commerce site for handmade jewelry" },
  { icon: Target, text: "Help me create a portfolio website for my photography business" },
  { icon: Rocket, text: "I need a landing page for my SaaS startup idea" },
];

const HeroSection: React.FC<HeroSectionProps> = ({ onSend, isLoading }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-accent/20 mb-8 glow-effect">
          <Wand2 className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Turn Your <span className="gradient-text">Website Ideas</span><br />
          Into Perfect Prompts
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Have a rough idea for a website? Let our AI help you transform it into a clear, 
          detailed prompt that will get you exactly what you envision.
        </p>
      </div>

      {/* Value Proposition */}
      <div className="w-full max-w-4xl mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50">
            <Lightbulb className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Clarify Your Vision</h3>
            <p className="text-sm text-muted-foreground">Transform vague ideas into specific requirements</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50">
            <Target className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Define Your Goals</h3>
            <p className="text-sm text-muted-foreground">Identify key features and functionality needs</p>
          </div>
          <div className="text-center p-6 rounded-2xl bg-card/5 0 border border-border/50">
            <Rocket className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Get Better Results</h3>
            <p className="text-sm  text-muted-foreground">Create prompts that deliver exactly what you want</p>
          </div>
        </div> 
      </div>

      {/* Call to Action */}
      <div className="w-full max-w-4xl mb-8 text-center">
        <p className="text-lg font-medium mb-4">Ready to refine your website idea?</p>
        <p className="text-muted-foreground mb-6">
          Describe your website concept below, no matter how rough or incomplete it is.
        </p>
      </div>

      {/* Input */}
      <div className="w-full max-w-4xl">
        <ChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default HeroSection;
