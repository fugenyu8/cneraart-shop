import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Link } from "wouter";

export default function Login() {
  const [, navigate] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const utils = trpc.useUtils();

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      toast.success("Welcome back!");
      // 登录成功后跳转：优先回到来源页，否则去首页
      const returnTo = new URLSearchParams(window.location.search).get("returnTo") || "/";
      navigate(returnTo);
    },
    onError: (err) => {
      toast.error(err.message || "Login failed. Please check your credentials.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    loginMutation.mutate({ email, password });
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

        <Card className="border-0 shadow-2xl" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(20px)", borderColor: "rgba(212,175,55,0.3)" }}>
          <div className="border rounded-xl" style={{ borderColor: "rgba(212,175,55,0.3)" }}>
            <CardHeader className="pb-4 pt-8 px-8">
              <CardTitle className="text-2xl font-serif text-center" style={{ color: "#D4AF37" }}>
                Sign In
              </CardTitle>
              <CardDescription className="text-center" style={{ color: "rgba(255,255,255,0.5)" }}>
                Welcome back to Yuan Hua Du
              </CardDescription>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-5">
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
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        borderColor: "rgba(212,175,55,0.3)",
                      }}
                      autoComplete="email"
                      disabled={loginMutation.isPending}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" style={{ color: "rgba(255,255,255,0.7)" }}>
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(212,175,55,0.6)" }} />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 border-0 focus-visible:ring-1"
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        color: "white",
                        borderColor: "rgba(212,175,55,0.3)",
                      }}
                      autoComplete="current-password"
                      disabled={loginMutation.isPending}
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

                <Button
                  type="submit"
                  className="w-full h-11 font-medium text-base mt-2"
                  disabled={loginMutation.isPending}
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8962E)",
                    color: "#1a0a00",
                    border: "none",
                  }}
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Don't have an account?{" "}
                  <Link href="/register" className="font-medium hover:underline" style={{ color: "#D4AF37" }}>
                    Create one
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
