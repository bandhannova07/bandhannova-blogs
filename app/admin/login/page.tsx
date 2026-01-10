"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Mail, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      router.push("/admin/passkey");
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
          <CardTitle className="text-3xl font-bold">Admin Login 🔐</CardTitle>
          <CardDescription className="text-base">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              <Input
                type="email"
                placeholder="arthur.b@blinders.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 text-base"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Password
              </label>
              <Input
                type="password"
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 text-base"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Continue to Passkey →"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
