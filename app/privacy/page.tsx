import { Footer } from "@/components/footer";
import { ShieldCheck, Lock, Eye, Cookie, FileText } from "lucide-react";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-mesh relative">
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-16">
                <div className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck size={14} />
                        Data Security Hub
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Privacy Policy</h1>
                    <p className="text-xl text-muted-foreground font-medium">Last updated: April 27, 2026</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none glass p-8 md:p-16 rounded-[3rem] border-white/10 bg-background/40 backdrop-blur-3xl shadow-2xl space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Eye className="text-primary" />
                            1. Information We Collect
                        </h2>
                        <p className="font-medium text-muted-foreground/80 leading-relaxed">
                            BandhanNova Blogs collects minimal data to provide a better user experience. This includes:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground/80 font-medium">
                            <li>Usage data (IP address, browser type, pages visited) via Vercel Analytics.</li>
                            <li>Personal information (name, email) only if you voluntarily subscribe to our newsletter or comment.</li>
                            <li>Device information to optimize our high-performance UI for your screen.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Cookie className="text-primary" />
                            2. Cookies and Advertising
                        </h2>
                        <p className="font-medium text-muted-foreground/80 leading-relaxed">
                            We use cookies to personalize content and ads, to provide social media features, and to analyze our traffic. 
                        </p>
                        <div className="bg-primary/5 p-8 rounded-[2rem] border border-primary/10">
                            <h4 className="font-black uppercase tracking-widest text-xs text-primary mb-4">Google AdSense Disclosure</h4>
                            <p className="text-sm font-medium leading-relaxed">
                                We use third-party advertising companies to serve ads when you visit our website. These companies may use information (not including your name, address, email address, or telephone number) about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                            </p>
                            <ul className="mt-4 list-disc pl-6 text-sm space-y-2">
                                <li>Google, as a third-party vendor, uses cookies to serve ads on your site.</li>
                                <li>Google's use of the DART cookie enables it to serve ads to your users based on their visit to your sites and other sites on the Internet.</li>
                                <li>Users may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Lock className="text-primary" />
                            3. Data Protection
                        </h2>
                        <p className="font-medium text-muted-foreground/80 leading-relaxed">
                            BandhanNova employs industry-standard encryption and security protocols (AES-256) to ensure that any data stored within our BFOBS ecosystem remains secure and inaccessible to unauthorized parties.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <FileText className="text-primary" />
                            4. Your Rights
                        </h2>
                        <p className="font-medium text-muted-foreground/80 leading-relaxed">
                            Depending on your location (GDPR, CCPA), you have the right to access, correct, or delete your personal data. To exercise these rights, please contact our data protection officer at support@bandhannova.in.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
