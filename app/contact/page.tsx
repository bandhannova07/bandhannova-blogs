import { Footer } from "@/components/footer";
import { Mail, MessageSquare, Globe, Send, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-mesh relative">
            <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <h1 className="text-6xl font-black tracking-tighter">Get in <span className="text-gradient">Touch</span></h1>
                            <p className="text-xl text-muted-foreground font-medium max-w-md leading-relaxed">
                                Have questions about our research or interested in collaboration? Our team is ready to connect.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-primary border-white/10 group-hover:scale-110 transition-transform">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Email Intelligence</p>
                                    <p className="text-lg font-black">support@bandhannova.in</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-primary border-white/10 group-hover:scale-110 transition-transform">
                                    <Globe size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Official Node</p>
                                    <p className="text-lg font-black">www.bandhannova.in</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 group">
                                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-primary border-white/10 group-hover:scale-110 transition-transform">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">Headquarters</p>
                                    <p className="text-lg font-black">Digital Intelligence Hub, India</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass p-8 md:p-12 rounded-[3rem] border-white/10 bg-background/40 backdrop-blur-3xl shadow-2xl space-y-8">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-black tracking-tight">Send a Transmission</h2>
                            <p className="text-muted-foreground font-medium">Direct communication channel to our engineering team.</p>
                        </div>

                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Full Name</label>
                                    <Input placeholder="John Doe" className="rounded-2xl glass border-white/10 py-6" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Email Address</label>
                                    <Input placeholder="john@example.com" className="rounded-2xl glass border-white/10 py-6" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Subject</label>
                                <Input placeholder="Technical Inquiry" className="rounded-2xl glass border-white/10 py-6" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Message</label>
                                <Textarea placeholder="How can we help you?" className="rounded-[2rem] glass border-white/10 min-h-[150px] p-6" />
                            </div>
                            <Button className="w-full rounded-2xl py-8 font-black uppercase tracking-[0.2em] shadow-[0_20px_40px_rgba(32,149,243,0.3)] transition-all hover:scale-[1.02] active:scale-95">
                                <Send className="mr-2 h-4 w-4" />
                                Send Transmission
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
