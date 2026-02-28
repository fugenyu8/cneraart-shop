import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { Link } from "wouter";

export default function Register() {
  const [, navigate] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const utils = trpc.useUtils();

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success("Account created! Welcome to Yuan Hua Du.");
      navigate("/");
    },
    onError: (err) => {
      if (err.data?.code === "CONFLICT") {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(err.message || "Registration failed. Please try again.");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    registerMutation.mutate({ name, email, password });
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
              <div className="text-sm tracking-widest uppercase" style={{ color: "#D4AF37", opacity: 0.7 }}>
                Yuan Hua Du
              </div>
            </div>
          </Link>
        </div>

        <Card className="border-0 shadow-2xl" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}>
          <div className="border rounded-xl" style={{ borderColor: "rgba(212,175,55,0.3)" }}>
            <CardHeader className="pb-4 pt-8 px-8">
              <CardTitle className="text-2xl font-serif text-center" style={{ color: "#D4AF37" }}>
                Create Account
              </CardTitle>
              <CardDescription className="text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
                Join Yuan Hua Du to begin your spiritual journey
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 姓名 */}
                <div className="space-y-2">
                  <Label htmlFor="name" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 border-0 focus-visible:ring-1"
                      style={{ background: "rgba(255,255,255,0.08)", color: "white", borderColor: "rgba(212,175,55,0.3)" }}
                      autoComplete="name"
                      disabled={registerMutation.isPending}
                    />
                  </div>
                </div>

                {/* 邮箱 */}
                <div className="space-y-2">
                  <Label htmlFor="email" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-0 focus-visible:ring-1"
                      style={{ background: "rgba(255,255,255,0.08)", color: "white", borderColor: "rgba(212,175,55,0.3)" }}
                      autoComplete="email"
                      disabled={registerMutation.isPending}
                    />
                  </div>
                </div>

                {/* 密码 */}
                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-0 focus-visible:ring-1"
                      style={{ background: "rgba(255,255,255,0.08)", color: "white", borderColor: "rgba(212,175,55,0.3)" }}
                      autoComplete="new-password"
                      disabled={registerMutation.isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* 确认密码 */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 border-0 focus-visible:ring-1"
                      style={{ background: "rgba(255,255,255,0.08)", color: "white", borderColor: "rgba(212,175,55,0.3)" }}
                      autoComplete="new-password"
                      disabled={registerMutation.isPending}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 font-medium text-base mt-2"
                  disabled={registerMutation.isPending}
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8962E)",
                    color: "#1a0a00",
                    border: "none",
                  }}
                >
                  {registerMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium hover:underline" style={{ color: "#D4AF37" }}>
                    Sign in
                  </Link>
                </div>
                <div>
                  <Link href="/" className="text-xs hover:underline" style={{ color: "rgba(255,255,255,0.3)" }}>
                    ← Back to Store
                  </Link>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
}
