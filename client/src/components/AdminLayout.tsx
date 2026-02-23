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
} from "lucide-react";
import { useTranslation } from "react-i18next";

interface AdminLayoutProps {
  children: React.ReactNode;
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

  // 如果未登录或不是管理员,重定向到首页
  if (!isLoading && (!user || user.role !== "admin")) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-[oklch(82%_0.18_85)] animate-pulse" />
          <p className="text-slate-400">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: t("admin.dashboard"),
      path: "/admin",
    },
    {
      icon: Package,
      label: t("admin.products"),
      path: "/admin/products",
    },
    {
      icon: ShoppingCart,
      label: t("admin.orders"),
      path: "/admin/orders",
    },
    {
      icon: Tag,
      label: t("admin.coupons"),
      path: "/admin/coupons",
    },
    {
      icon: Users,
      label: t("admin.customers"),
      path: "/admin/customers",
    },
    {
      icon: Truck,
      label: "物流管理",
      path: "/admin/batch-shipment",
    },
    {
      icon: Star,
      label: "服务订单",
      path: "/admin/service-orders",
    },
    {
      icon: Activity,
      label: "系统监控",
      path: "/admin/system-monitor",
    },
    {
      icon: BarChart3,
      label: "每日数据",
      path: "/admin/daily-report",
    },
    {
      icon: MessageSquare,
      label: "评价管理",
      path: "/admin/reviews",
    },
    {
      icon: FileText,
      label: "能量报告",
      path: "/admin/destiny-reports",
    },
    {
      icon: Settings,
      label: t("admin.settings"),
      path: "/admin/settings",
    },
  ];

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
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
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </a>
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-800">
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
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
