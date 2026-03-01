import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Lock, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setToken(params.get("token") || "");
    setEmail(params.get("email") || "");
  }, []);

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login"), 3000);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to reset password. The link may have expired.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (!token || !email) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }
    resetMutation.mutate({ email, token, newPassword });
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
            {success ? (
              <>
                <div className="flex justify-center mb-3">
                  <CheckCircle2 className="w-12 h-12 text-green-400" />
                </div>
                <CardTitle className="text-xl" style={{ color: "#D4AF37" }}>
                  Password Reset Successful
                </CardTitle>
                <CardDescription style={{ color: "#8a7060" }}>
                  Redirecting you to login...
                </CardDescription>
              </>
            ) : (
              <>
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(212,175,55,0.15)" }}>
                    <Lock className="w-6 h-6" style={{ color: "#D4AF37" }} />
                  </div>
                </div>
                <CardTitle className="text-xl" style={{ color: "#D4AF37" }}>
                  Reset Your Password
                </CardTitle>
                <CardDescription style={{ color: "#8a7060" }}>
                  Enter your new password below
                </CardDescription>
              </>
            )}
          </CardHeader>

          {!success && (
            <CardContent>
              {(!token || !email) && (
                <div className="flex items-start gap-2 bg-red-900/20 border border-red-700/40 rounded-lg p-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-300">
                    Invalid reset link. Please request a new password reset from the login page.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label style={{ color: "#c8a96e" }}>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8a7060" }} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="pl-10 pr-10 h-11"
                      style={{
                        background: "rgba(61,32,16,0.5)",
                        borderColor: "#5a3020",
                        color: "#f5e6c8",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#8a7060" }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label style={{ color: "#c8a96e" }}>Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8a7060" }} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      className="pl-10 h-11"
                      style={{
                        background: "rgba(61,32,16,0.5)",
                        borderColor: "#5a3020",
                        color: "#f5e6c8",
                      }}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={resetMutation.isPending || !token || !email}
                  className="w-full h-11 font-semibold text-base"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8962E)",
                    color: "#1a0a00",
                  }}
                >
                  {resetMutation.isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin mr-2" />Resetting...</>
                  ) : (
                    "Reset Password"
                  )}
                </Button>

                <p className="text-center text-sm" style={{ color: "#8a7060" }}>
                  Remember your password?{" "}
                  <Link href="/login" className="underline" style={{ color: "#D4AF37" }}>
                    Sign in
                  </Link>
                </p>
              </form>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
