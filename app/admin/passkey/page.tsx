"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function PasskeyPage() {
  const router = useRouter();
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/passkey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passkey }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid passkey");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-purple-500/10 to-background p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="relative w-48 h-16">
              <Image
                src="/bandhannova-logo-final.svg"
                alt="BandhanNova"
                fill
                className="object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Security Verification 🛡️</CardTitle>
          <CardDescription className="text-base">
            Enter your passkey to complete authentication
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Passkey (8 digits)
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                required
                maxLength={8}
                className="h-12 text-base text-center text-2xl tracking-widest"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Access Admin Panel ✨"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => router.push("/admin/login")}
              disabled={loading}
            >
              ← Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
