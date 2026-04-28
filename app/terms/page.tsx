import { Footer } from "@/components/footer";
import { Scale, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-mesh relative">
            <div className="max-w-4xl mx-auto px-6 pt-32 pb-24 space-y-16">
                <div className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-white/10 text-primary text-[10px] font-black uppercase tracking-widest">
                        <Scale size={14} />
                        Legal Framework
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter">Terms of Service</h1>
                    <p className="text-xl text-muted-foreground font-medium">Last updated: April 27, 2026</p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none glass p-8 md:p-16 rounded-[3rem] border-white/10 bg-background/40 backdrop-blur-3xl shadow-2xl space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <BookOpen className="text-primary" />
                            1. Acceptance of Terms
                        </h2>
                        <p className="font-medium text-muted-foreground/80 leading-relaxed">
                            By accessing and using BandhanNova Blogs, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <CheckCircle2 className="text-primary" />
                            2. Use License
                        </h2>
                        <p className="font-medium text-muted-foreground/80 leading-relaxed">
                            Permission is granted to temporarily download one copy of the materials (information or software) on BandhanNova's website for personal, non-commercial transitory viewing only.
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground/80 font-medium">
                            <li>You may not modify or copy the materials.</li>
                            <li>You may not use the materials for any commercial purpose.</li>
                            <li>You may not attempt to decompile or reverse engineer any software contained on the website.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <AlertCircle className="text-primary" />
                            3. Disclaimer
                        </h2>
                        <p className="font-medium text-muted-foreground/80 leading-relaxed">
                            The materials on BandhanNova Blogs are provided on an 'as is' basis. BandhanNova makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                            <Scale className="text-primary" />
                            4. Limitations
                        </h2>
                        <p className="font-medium text-muted-foreground/80 leading-relaxed">
                            In no event shall BandhanNova or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on BandhanNova Blogs.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
