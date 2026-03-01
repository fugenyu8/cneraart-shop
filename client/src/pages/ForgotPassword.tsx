import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Mail, CheckCircle2, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => {
      setSent(true);
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    forgotMutation.mutate({ email });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #1a0a00 0%, #3d1a00 50%, #1a0a00 100%)" }}
    >
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #D4AF37, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #8B1A1A, transparent)" }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-block cursor-pointer">
              <div className="text-3xl font-serif mb-1" style={{ color: "#D4AF37" }}>源・华渡</div>
              <div className="text-xs tracking-widest" style={{ color: "#8a7060" }}>YUAN HUA DU</div>
            </div>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl" style={{ background: "rgba(26,10,0,0.95)", borderColor: "#3d2010" }}>
          <CardHeader className="text-center pb-4">
            {sent ? (
              <>
                <div className="flex justify-center mb-3">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
                <CardTitle className="text-xl" style={{ color: "#D4AF37" }}>
                  Check Your Email
                </CardTitle>
                <CardDescription style={{ color: "#8a7060" }}>
                  If an account exists for <strong style={{ color: "#c8a96e" }}>{email}</strong>, you will receive a password reset link shortly.
                </CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(212,175,55,0.15)" }}>
                    <Mail className="w-6 h-6" style={{ color: "#D4AF37" }} />
                  </div>
                </div>
                <CardTitle className="text-xl" style={{ color: "#D4AF37" }}>
                  Forgot Password?
                </CardTitle>
                <CardDescription style={{ color: "#8a7060" }}>
                  Enter your email address and we'll send you a reset link
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent>
            {sent ? (
              <div className="space-y-4">
                <div className="bg-amber-950/30 border border-amber-800/40 rounded-lg p-3 text-xs text-amber-400/80 leading-relaxed">
                  The reset link will expire in <strong>1 hour</strong>. If you don't see the email, please check your spam folder.
                </div>
                <Link href="/login">
                  <Button className="w-full h-11" style={{ background: "linear-gradient(135deg, #D4AF37, #B8962E)", color: "#1a0a00" }}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label style={{ color: "rgba(255,255,255,0.7)" }}>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="pl-10 h-11 border-0 focus-visible:ring-1"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        borderColor: "rgba(212,175,55,0.3)",
                      }}
                      disabled={forgotMutation.isPending}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={forgotMutation.isPending}
                  className="w-full h-11 font-medium text-base"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8962E)",
                    color: "#1a0a00",
                    border: "none",
                  }}
                >
                  {forgotMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <Link href="/login">
                  <Button type="button" variant="ghost" className="w-full h-10 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Sign In
                  </Button>
                </Link>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
