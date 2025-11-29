import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Star, Mail, ArrowRight, Sparkles, Heart } from "lucide-react";
import { InteractiveImageReveal } from "@/components/InteractiveImageReveal";

// Import images directly to ensure they load correctly
import frontHandImg from "@assets/front_hand.jpg";
import backExternalImg from "@assets/back_external.jpg";
import internalImg from "@assets/internal.jpg";
import chipImg from "@assets/chip.jpg";
// Using new logo
import logoImg from "@assets/zero_logo_header.jpg";
import logoFooterImg from "@assets/logo_footer.jpg";
import logoGlowImg from "@assets/logo_glow.jpg";
import geminiLogoImg from "@assets/gemini_logo_new.png";

const ASSETS = {
  frontHand: frontHandImg,
  back: backExternalImg,
  internal: internalImg,
  chip: chipImg,
  logo: logoImg,
  logoFooter: logoFooterImg,
  logoGlow: logoGlowImg,
  geminiLogo: geminiLogoImg
};

function PreorderModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    shippingDetails: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error("Please rate us before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/preorders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          shippingDetails: formData.shippingDetails,
          rating: rating
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast.success("Preorder submitted successfully!", {
          description: "Thank you! We've sent your order details to founderzero1@gmail.com",
        });
        setIsOpen(false);
        setFormData({ email: '', shippingDetails: '' });
        setRating(0);
      } else {
        toast.error("Failed to submit preorder", {
          description: data.error || "Please try again later",
        });
      }
    } catch (error) {
      console.error("Error submitting preorder:", error);
      toast.error("Connection error", {
        description: "Please check your internet connection and try again",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center gap-2">
          Preorder Now <ArrowRight className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white text-black border-neutral-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Preorder ZERO</DialogTitle>
          <DialogDescription className="text-neutral-500">
            Secure your device for ₹5,500. Limited stock available.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              required 
              className="bg-neutral-50 border-neutral-200"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="details">Shipping Details</Label>
            <Textarea 
              id="details" 
              placeholder="Full name, address, city, state, pincode, contact number" 
              required 
              className="bg-neutral-50 border-neutral-200"
              value={formData.shippingDetails}
              onChange={(e) => setFormData({ ...formData, shippingDetails: e.target.value })}
              rows={4}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Rate Us (Required)</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform active:scale-95"
                >
                  <Star 
                    className={cn(
                      "w-6 h-6 transition-colors", 
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"
                    )} 
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-400">Your feedback will be sent directly to the founder.</p>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit" disabled={isSubmitting} className="w-full bg-black hover:bg-neutral-800 text-white">
              {isSubmitting ? "Sending..." : "Confirm Preorder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md border-b border-neutral-200"
    >
      <div className="text-xl font-bold tracking-tighter flex items-center gap-3 text-black">
        <img src={ASSETS.logo} alt="ZERO Logo" className="h-28 w-auto object-contain" />
      </div>
      <div className="hidden md:flex gap-8 text-sm font-medium text-neutral-500">
        <span className="text-black">India's First Offline AI Assistant</span>
      </div>
      <div className="hidden md:block">
        <PreorderModal />
      </div>
    </motion.nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden pt-24">
      
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="z-10 text-center max-w-4xl px-4"
      >
        <div className="flex items-center justify-center gap-2 mb-6">
           <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-medium tracking-wider uppercase border border-neutral-200">
             Production Ready
           </span>
        </div>
        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-6 text-black">
          ZERO
        </h1>
        <p className="text-2xl md:text-4xl text-neutral-500 font-light max-w-3xl mx-auto leading-tight mb-8">
          India's first pocket AI assistant. <br/>
          <span className="text-black font-medium">Intelligence, offline.</span>
        </p>
        
        <div className="max-w-xl mx-auto text-neutral-400 text-sm md:text-base leading-relaxed mb-10">
          Powered by a dual-core RISC AI engine Z1 processor. 
          Features a 4MP AI vision camera for real-time analysis.
          All enclosed in a high-quality space-grade aluminium body.
          Includes 4GB SD card, charger, and cable in the box.
        </div>

        <div className="mt-8 md:hidden">
           <PreorderModal />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 100 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
        className="relative z-0 w-full flex justify-center items-end mt-10"
      >
        <div className="relative w-full max-w-[500px] aspect-[3/4]">
            <img 
              src={ASSETS.frontHand} 
              alt="ZERO in hand" 
              className="w-full h-full object-cover object-top"
              style={{
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}

function FeatureGrid() {
  return (
    <section className="py-32 bg-neutral-50 text-black px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-bold mb-24 tracking-tighter text-center text-black">
          Power in your pocket.
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Chip - Enhanced Dark with Glow */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-[2.5rem] bg-black border border-neutral-800 aspect-square md:aspect-[4/3] shadow-2xl"
          >
            {/* Ambient glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-black/0 blur-2xl group-hover:opacity-100 opacity-0 transition-opacity duration-700" />
            
            {/* Chip image with enhanced contrast */}
            <img 
              src={ASSETS.chip} 
              alt="Z1 Chip" 
              className="absolute inset-0 w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-700 group-hover:scale-105 transition-transform" 
            />
            
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
            
            {/* Shimmer effect on hover */}
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />

            <div className="relative z-10 h-full flex flex-col justify-end p-10">
              <div>
                <h3 className="text-2xl font-medium text-neutral-400 mb-2">Processing</h3>
                <p className="text-4xl font-bold text-white tracking-tight">Dual Core RISC<br/>AI Engine Z1</p>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Camera - White */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-white border border-neutral-200 aspect-square md:aspect-[4/3] shadow-sm hover:shadow-xl transition-all duration-500">
             <img 
              src={ASSETS.back} 
              alt="Camera Module" 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-700" 
            />
            <div className="relative z-10 h-full flex flex-col justify-between p-10">
              <div>
                <h3 className="text-2xl font-medium text-neutral-500 mb-2">Vision</h3>
                <p className="text-4xl font-semibold text-black">4MP AI Vision<br/>Camera</p>
              </div>
              <div className="text-neutral-500 font-mono">Photos & Video Recording</div>
            </div>
          </div>

          {/* Card 3: Intelligence - Gemini Integration */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-[2.5rem] bg-white border border-neutral-200 aspect-auto md:aspect-[2.5/1] shadow-xl">
             {/* Gemini Logo Background - Large and subtle */}
             <div className="absolute -right-20 -bottom-20 md:-right-40 md:-bottom-40 w-[100%] md:w-[120%] opacity-5 rotate-[-10deg]">
               <img src={ASSETS.geminiLogo} alt="Gemini Watermark" className="w-full h-auto" />
             </div>

            <div className="relative z-10 h-full flex flex-col justify-center p-6 md:p-24 max-w-3xl">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-4 mb-6 md:mb-8">
                 <div className="h-20 w-20 md:h-32 md:w-32 bg-white rounded-xl shadow-sm flex items-center justify-center border border-neutral-100 p-2 flex-shrink-0">
                    <img src={ASSETS.geminiLogo} alt="Gemini Logo" className="w-full h-full object-contain" />
                 </div>
                 <span className="text-neutral-500 font-medium tracking-wide text-sm md:text-base">Powered by Google Gemini</span>
              </div>
              <h3 className="text-2xl md:text-6xl font-bold text-black mb-4 md:mb-6 tracking-tight">Gemini AI Integrated</h3>
              <p className="text-base md:text-2xl text-neutral-600 font-light leading-relaxed">
                Seamlessly integrates with advanced LLMs for offline translation and real-time assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SpecsList() {
  const specs = [
    { label: "Price", value: "₹5,500" },
    { label: "Processor", value: "Dual Core RISC AI Engine Z1" },
    { label: "Connectivity", value: "2.4 GHz WiFi + Offline Mode" },
    { label: "Updates", value: "30+ Lifetime OTA Updates" },
    { label: "Storage", value: "4GB SD Card (Pre-installed)" },
    { label: "Camera", value: "4MP AI Vision" },
    { label: "In the Box", value: "Device, Charger, Cable, User Guide" },
  ];

  return (
    <section className="py-24 bg-white border-t border-neutral-200">
      <div className="max-w-4xl mx-auto px-6">
        <h3 className="text-sm font-semibold text-neutral-400 uppercase tracking-widest mb-12">Technical Specifications</h3>
        <div className="grid grid-cols-1 gap-px bg-neutral-200 border border-neutral-200">
          {specs.map((spec, i) => (
            <div key={i} className="bg-white p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-2 group hover:bg-neutral-50 transition-colors">
              <span className="text-neutral-500 font-medium">{spec.label}</span>
              <span className="text-black text-lg font-semibold">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-16 bg-neutral-50 border-t border-neutral-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Top section with logo and branding */}
        <div className="flex flex-col items-center text-center mb-12">
          <img src={ASSETS.logoFooter} alt="ZERO Logo" className="h-24 w-auto object-contain mb-6" />
          <div className="flex items-center justify-center gap-2 text-neutral-600 mb-4">
            <span className="text-lg font-medium">Made in India</span>
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
            <span className="text-lg font-medium">Made with love</span>
          </div>
        </div>

        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-neutral-200">
          <div>
            <h4 className="font-semibold text-black mb-3">Product</h4>
            <p className="text-neutral-600 text-sm leading-relaxed">India's first pocket AI assistant with offline capabilities and Gemini AI integration.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-black mb-3">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="text-neutral-600 hover:text-black transition-colors text-sm">Privacy Policy</a><br/>
              <a href="#" className="text-neutral-600 hover:text-black transition-colors text-sm">Terms of Use</a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-black mb-3">Support</h4>
            <a href="mailto:founderzero1@gmail.com" className="text-neutral-600 hover:text-black transition-colors text-sm flex items-center gap-2">
              <Mail className="w-4 h-4" />
              founderzero1@gmail.com
            </a>
            <p className="text-neutral-500 text-xs mt-2">For business queries and support</p>
          </div>
        </div>

        {/* Bottom section */}
        <div className="text-center text-neutral-500 text-sm">
          <p>&copy; 2025 ZERO Intelligence. All rights reserved.</p>
          <p className="text-xs mt-2">Engineered with precision. Designed for the future.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-neutral-200">
      <Toaster />
      <Navbar />
      <Hero />
      
      {/* New Interactive Scroll Reveal Section */}
      <div className="py-24 bg-white">
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-black mb-4">Inner Beauty</h3>
           <p className="text-lg text-neutral-600 max-w-xl mx-auto">
             Precision engineered. Scroll to explore.
           </p>
        </div>
        
        <InteractiveImageReveal 
          externalImage={ASSETS.back}
          internalImage={ASSETS.internal}
        />
      </div>

      <FeatureGrid />
      <SpecsList />
      <Footer />
    </div>
  );
}
