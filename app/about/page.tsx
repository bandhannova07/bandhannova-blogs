import { Footer } from "@/components/footer";
import { Brain, Globe, Shield, Zap, Target, Users, Award } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-mesh relative">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="space-y-8 text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                        Architecting the <span className="text-gradient">Future of Intelligence</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
                        BandhanNova Blogs is a premier destination for high-fidelity technical insights, AI research, and digital skill development.
                    </p>
                </div>
            </div>

            {/* Mission Section */}
            <section className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass border-white/10 text-primary text-xs font-black uppercase tracking-widest">
                            <Target size={14} />
                            Our Mission
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Empowering the next generation of digital architects.</h2>
                        <p className="text-lg text-muted-foreground font-medium leading-relaxed">
                            At BandhanNova, we believe that access to high-quality, structured information is the key to personal and professional growth in the AI era. Our blog platform is designed to bridge the gap between complex technology and actionable knowledge.
                        </p>
                        <div className="grid grid-cols-2 gap-8 pt-8">
                            <div className="space-y-2">
                                <h4 className="text-3xl font-black text-primary">100+</h4>
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Research Nodes</p>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-3xl font-black text-primary">50k+</h4>
                                <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Active Learners</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-square glass rounded-[3rem] overflow-hidden border-white/10 shadow-2xl group">
                         <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-purple-500/20" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <Brain className="w-32 h-32 text-primary/40 animate-pulse" />
                         </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 px-6 bg-primary/5">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Our Core Architecture</h2>
                        <p className="text-muted-foreground font-medium">The principles that drive every piece of content we produce.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Shield,
                                title: "Technical Accuracy",
                                desc: "Every tutorial and insight is rigorously tested and verified by our engineering team."
                            },
                            {
                                icon: Zap,
                                title: "High Fidelity",
                                desc: "We focus on premium, in-depth content that provides real-world value over surface-level clickbait."
                            },
                            {
                                icon: Globe,
                                title: "Open Intelligence",
                                desc: "We believe in the democratization of AI knowledge and making cutting-edge research accessible to all."
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass p-10 rounded-[2.5rem] border-white/10 space-y-6 hover:-translate-y-2 transition-all">
                                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                                <p className="text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
