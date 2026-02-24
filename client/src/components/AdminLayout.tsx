import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tag,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Sparkles,
  Activity,
  BarChart3,
  Truck,
  Star,
  MessageSquare,
  FileText,
  Headphones,
  AlertTriangle,
  Banknote,
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const ADMIN_PASS_KEY = "cneraart_admin_auth";
const ADMIN_PASSWORD = "fugenyu*168";

function AdminPasswordGate({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authenticated, setAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(ADMIN_PASS_KEY) === "1";
    } catch { return false; }
  });

  if (authenticated) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      try { sessionStorage.setItem(ADMIN_PASS_KEY, "1"); } catch {}
    } else {
      setError("密码错误，请重试");
      setPassword("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 w-full max-w-sm shadow-2xl">
        <div className="text-center mb-6">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-[oklch(82%_0.18_85)]" />
          <h2 className="text-xl font-bold text-white">管理后台</h2>
          <p className="text-sm text-slate-400 mt-1">请输入访问密码</p>
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          placeholder="请输入密码"
          className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-[oklch(82%_0.18_85)] transition-colors mb-3"
          autoFocus
        />
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-[oklch(82%_0.18_85)] text-slate-900 font-semibold hover:opacity-90 transition-opacity"
        >
          进入后台
        </button>
      </form>
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isLoading } = useAuth();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { t } = useTranslation();
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      navigate("/");
    },
  });

  // 密码门优先：先通过密码验证，再检查 admin 登录态
  // 不再直接重定向到首页

  if (isLoading) {
    return (
      <AdminPasswordGate>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[oklch(82%_0.18_85)] animate-pulse" />
            <p className="text-slate-400">{t("common.loading")}</p>
          </div>
        </div>
      </AdminPasswordGate>
    );
  }

  // 通过密码门后，如果未登录 admin 账号，显示提示信息
  const needsAdminLogin = !user || user.role !== "admin";

  // 获取待确认付款数量
  const { data: stats } = trpc.admin.getStats.useQuery(undefined, {
    refetchInterval: 30000, // 每30秒自动刷新
  });
  const pendingPaymentCount = stats?.pendingOfflinePayments || 0;

  const menuItems: Array<{
    icon: any;
    label: string;
    path: string;
    badge?: boolean;
  }> = [
    {
      icon: LayoutDashboard,
      label: t("admin.dashboard"),
      path: "/wobifa888",
    },
    {
      icon: Package,
      label: t("admin.products"),
      path: "/wobifa888/products",
    },
    {
      icon: ShoppingCart,
      label: t("admin.orders"),
      path: "/wobifa888/orders",
    },
    {
      icon: Banknote,
      label: "待确认付款",
      path: "/wobifa888/pending-payments",
      badge: true,
    },
    {
      icon: Tag,
      label: t("admin.coupons"),
      path: "/wobifa888/coupons",
    },
    {
      icon: Users,
      label: t("admin.customers"),
      path: "/wobifa888/customers",
    },
    {
      icon: Truck,
      label: "物流管理",
      path: "/wobifa888/batch-shipment",
    },
    {
      icon: Star,
      label: "服务订单",
      path: "/wobifa888/service-orders",
    },
    {
      icon: Activity,
      label: "系统监控",
      path: "/wobifa888/system-monitor",
    },
    {
      icon: BarChart3,
      label: "每日数据",
      path: "/wobifa888/daily-report",
    },
    {
      icon: MessageSquare,
      label: "评价管理",
      path: "/wobifa888/reviews",
    },
    {
      icon: FileText,
      label: "能量报告",
      path: "/wobifa888/destiny-reports",
    },
    {
      icon: Settings,
      label: t("admin.settings"),
      path: "/wobifa888/settings",
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <AdminPasswordGate>
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-slate-900/50 backdrop-blur-sm border-r border-slate-800 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
          {sidebarOpen ? (
            <Link href="/">
              <a className="flex items-center gap-2 text-[oklch(82%_0.18_85)] font-bold text-xl">
                <Sparkles className="w-6 h-6" />
                <span className="font-['Ma_Shan_Zheng']">源·华渡</span>
              </a>
            </Link>
          ) : (
            <Sparkles className="w-6 h-6 text-[oklch(82%_0.18_85)]" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-[oklch(82%_0.18_85)]/20 text-[oklch(82%_0.18_85)] shadow-lg shadow-[oklch(82%_0.18_85)]/20"
                      : item.badge && pendingPaymentCount > 0
                      ? "text-red-400 hover:bg-red-950/30 hover:text-red-300 bg-red-950/10"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {item.badge && pendingPaymentCount > 0 && !sidebarOpen && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[9px] text-white font-bold">
                          {pendingPaymentCount}
                        </span>
                      </span>
                    )}
                  </div>
                  {sidebarOpen && (
                    <span className="font-medium flex-1 flex items-center justify-between">
                      {item.label}
                      {item.badge && pendingPaymentCount > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 text-[10px] font-bold rounded-full bg-red-500 text-white animate-pulse">
                          {pendingPaymentCount}
                        </span>
                      )}
                    </span>
                  )}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full ${
                    sidebarOpen ? "justify-start" : "justify-center"
                  } hover:bg-slate-800/50`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[oklch(82%_0.18_85)]/20 text-[oklch(82%_0.18_85)]">
                      {user?.name?.[0]?.toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  {sidebarOpen && (
                    <span className="ml-3 text-sm font-medium text-slate-300 truncate">
                      {user?.name}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
                <DropdownMenuLabel className="text-slate-300">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-800" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-300 hover:bg-slate-800 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3 px-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-slate-700 text-slate-400">
                  ?
                </AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <span className="text-sm font-medium text-slate-500 truncate">
                  未登录
                </span>
              )}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">
          {needsAdminLogin && (
            <div className="mb-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-amber-300 font-medium">需要管理员账号登录</p>
                <p className="text-amber-400/70 text-sm mt-1">
                  您已通过密码验证进入后台，但数据接口需要管理员账号登录后才能正常加载。
                  请先前往 <a href="/" className="underline hover:text-amber-300">首页</a> 使用管理员账号登录，然后再返回此页面。
                </p>
              </div>
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
    </AdminPasswordGate>
  );
}
