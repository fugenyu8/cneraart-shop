import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Sparkles,
  FileText,
  Eye,
  Hand,
  Home,
  CheckCircle2,
  Clock,
  Loader2,
  BarChart3,
  Star,
  AlertTriangle,
  Banknote,
  CreditCard,
  ArrowRight,
  Bell,
  MessageSquare,
  Headphones,
  Target,
  Zap,
  Crown,
  Gift,
  Receipt,
  Wallet,
} from "lucide-react";
import { getLocalized } from "@/lib/localized";

function TrendBadge({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <div className="flex items-center text-sm">
      {isPositive ? (
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
      )}
      <span className={isPositive ? "text-green-500" : "text-red-500"}>
        {Math.abs(value)}%
      </span>
      <span className="text-slate-500 ml-1">vs 上月</span>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  trend,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
  trend?: number;
  subtitle?: string;
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
            {trend !== undefined && <TrendBadge value={trend} />}
            {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
          </div>
          <div className={`p-3 rounded-lg ${bgColor}`}>
            <Icon className={`w-6 h-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SectionTitle({ icon: Icon, title, color }: { icon: any; title: string; color: string }) {
  return (
    <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
      <Icon className={`w-5 h-5 ${color}`} />
      {title}
    </h2>
  );
}

/** 待确认付款提醒横幅 */
function PendingPaymentAlert({ count, orders: pendingOrders }: { count: number; orders: any[] }) {
  if (count === 0) return null;

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "bank_transfer": return "银行转账";
      case "alipay": return "支付宝";
      default: return method;
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "bank_transfer": return <Banknote className="w-4 h-4" />;
      case "alipay": return <CreditCard className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border-2 border-red-500/50 bg-gradient-to-r from-red-950/80 via-red-900/60 to-orange-950/80 shadow-lg shadow-red-500/10">
      {/* 闪烁动画背景 */}
      <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
      
      <div className="relative p-5">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2.5 rounded-full bg-red-500/20 border border-red-500/30">
                <Bell className="w-6 h-6 text-red-400" />
              </div>
              {/* 闪烁红点 */}
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 items-center justify-center text-[10px] text-white font-bold">
                  {count}
                </span>
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-300">
                待确认付款提醒
              </h3>
              <p className="text-sm text-red-400/80">
                有 <span className="font-bold text-red-300 text-base">{count}</span> 笔线下付款订单等待确认
              </p>
            </div>
          </div>
          <Link href="/wobifa888/pending-payments">
            <Button
              variant="outline"
              className="border-red-500/50 text-red-300 hover:bg-red-500/20 hover:text-red-200 hover:border-red-400"
            >
              立即处理
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* 待确认订单列表 */}
        {pendingOrders && pendingOrders.length > 0 && (
          <div className="space-y-2">
            {pendingOrders.map((order: any) => (
              <Link key={order.id} href={`/wobifa888/orders/${order.id}`}>
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/60 hover:bg-slate-800/80 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-red-500/10">
                      {getPaymentMethodIcon(order.paymentMethod)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-red-300 transition-colors">
                        订单 #{order.orderNumber}
                      </p>
                      <p className="text-xs text-slate-400">
                        {getPaymentMethodLabel(order.paymentMethod)} · {new Date(order.createdAt).toLocaleString("zh-CN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-[oklch(82%_0.18_85)]">
                      ${Number(order.total).toFixed(2)}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
                      待确认
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useTranslation();
  
  // 获取统计数据
  const { data: stats, isLoading } = trpc.admin.getStats.useQuery();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("admin.dashboard")}</h1>
          <p className="text-slate-400">四大系统运营数据概览</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-400">
            <BarChart3 className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            加载数据中...
          </div>
        ) : (
          <>
            {/* ====== 待确认付款提醒（最醒目位置） ====== */}
            <PendingPaymentAlert
              count={stats?.pendingOfflinePayments || 0}
              orders={stats?.pendingOfflineOrders || []}
            />

            {/* ====== 电商系统概览 ====== */}
            <div>
              <SectionTitle icon={ShoppingCart} title="电商系统" color="text-blue-400" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="总销售额"
                  value={stats?.totalRevenue ? `$${Number(stats.totalRevenue).toFixed(2)}` : "$0.00"}
                  icon={DollarSign}
                  color="text-green-500"
                  bgColor="bg-green-500/10"
                  trend={stats?.revenueTrend || 0}
                />
                <StatCard
                  title="总订单数"
                  value={stats?.totalOrders || 0}
                  icon={ShoppingCart}
                  color="text-blue-500"
                  bgColor="bg-blue-500/10"
                  trend={stats?.ordersTrend || 0}
                />
                <StatCard
                  title="产品数量"
                  value={stats?.totalProducts || 0}
                  icon={Package}
                  color="text-purple-500"
                  bgColor="bg-purple-500/10"
                />
                <StatCard
                  title="客户数量"
                  value={stats?.totalCustomers || 0}
                  icon={Users}
                  color="text-[oklch(82%_0.18_85)]"
                  bgColor="bg-[oklch(82%_0.18_85)]/10"
                  trend={stats?.customersTrend || 0}
                />
              </div>
            </div>

            {/* ====== 命理服务系统概览 ====== */}
            <div>
              <SectionTitle icon={Sparkles} title="命理服务系统" color="text-[oklch(82%_0.18_85)]" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                <StatCard
                  title="总预约数"
                  value={stats?.fortuneStats?.totalBookings || 0}
                  icon={Sparkles}
                  color="text-[oklch(82%_0.18_85)]"
                  bgColor="bg-[oklch(82%_0.18_85)]/10"
                />
                <StatCard
                  title="面相服务"
                  value={stats?.fortuneStats?.byType?.face || 0}
                  icon={Eye}
                  color="text-pink-400"
                  bgColor="bg-pink-500/10"
                />
                <StatCard
                  title="手相服务"
                  value={stats?.fortuneStats?.byType?.palm || 0}
                  icon={Hand}
                  color="text-orange-400"
                  bgColor="bg-orange-500/10"
                />
                <StatCard
                  title="风水服务"
                  value={stats?.fortuneStats?.byType?.fengshui || 0}
                  icon={Home}
                  color="text-cyan-400"
                  bgColor="bg-cyan-500/10"
                />
                <StatCard
                  title="已完成"
                  value={stats?.fortuneStats?.completed || 0}
                  icon={CheckCircle2}
                  color="text-green-400"
                  bgColor="bg-green-500/10"
                />
                <StatCard
                  title="待处理"
                  value={stats?.fortuneStats?.pending || 0}
                  icon={Clock}
                  color="text-yellow-400"
                  bgColor="bg-yellow-500/10"
                />
                <StatCard
                  title="服务评价"
                  value={stats?.fortuneStats?.totalReviews || 0}
                  icon={Star}
                  color="text-amber-400"
                  bgColor="bg-amber-500/10"
                />
              </div>
            </div>

            {/* ====== 客服系统概览 ====== */}
            <div>
              <SectionTitle icon={Headphones} title="客服系统" color="text-emerald-400" />
              {stats?.serviceStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <StatCard
                    title="总会话数"
                    value={stats.serviceStats.totalSessions || 0}
                    icon={MessageSquare}
                    color="text-emerald-400"
                    bgColor="bg-emerald-500/10"
                  />
                  <StatCard
                    title="今日会话"
                    value={stats.serviceStats.todaySessions || 0}
                    icon={Zap}
                    color="text-lime-400"
                    bgColor="bg-lime-500/10"
                  />
                  <StatCard
                    title="总消息数"
                    value={stats.serviceStats.totalMessages || 0}
                    icon={FileText}
                    color="text-teal-400"
                    bgColor="bg-teal-500/10"
                  />
                  <StatCard
                    title="今日消息"
                    value={stats.serviceStats.todayMessages || 0}
                    icon={TrendingUp}
                    color="text-cyan-400"
                    bgColor="bg-cyan-500/10"
                  />
                  <StatCard
                    title="高意向会话"
                    value={stats.serviceStats.highIntentSessions || 0}
                    icon={Target}
                    color="text-orange-400"
                    bgColor="bg-orange-500/10"
                  />
                  <StatCard
                    title="已转化"
                    value={stats.serviceStats.convertedSessions || 0}
                    icon={CheckCircle2}
                    color="text-green-400"
                    bgColor="bg-green-500/10"
                  />
                </div>
              ) : (
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="py-6 text-center text-slate-500">
                    客服系统数据暂时无法获取
                  </CardContent>
                </Card>
              )}
            </div>

            {/* ====== VIP专属服务系统概览 ====== */}
            <div>
              <SectionTitle icon={Crown} title="VIP专属服务系统" color="text-amber-400" />
              {stats?.vipStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                  <StatCard
                    title="总订单数"
                    value={stats.vipStats.totalOrders || 0}
                    icon={Receipt}
                    color="text-amber-400"
                    bgColor="bg-amber-500/10"
                  />
                  <StatCard
                    title="今日订单"
                    value={stats.vipStats.todayOrders || 0}
                    icon={Zap}
                    color="text-yellow-400"
                    bgColor="bg-yellow-500/10"
                  />
                  <StatCard
                    title="免费兑换"
                    value={stats.vipStats.freeOrders || 0}
                    icon={Gift}
                    color="text-rose-400"
                    bgColor="bg-rose-500/10"
                  />
                  <StatCard
                    title="付费订单"
                    value={stats.vipStats.paidOrders || 0}
                    icon={Wallet}
                    color="text-green-400"
                    bgColor="bg-green-500/10"
                  />
                  <StatCard
                    title="已完成报告"
                    value={stats.vipStats.totalReports || 0}
                    icon={FileText}
                    color="text-blue-400"
                    bgColor="bg-blue-500/10"
                  />
                  <StatCard
                    title="待处理任务"
                    value={stats.vipStats.pendingTasks || 0}
                    icon={Clock}
                    color="text-orange-400"
                    bgColor="bg-orange-500/10"
                  />
                </div>
              ) : (
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardContent className="py-6 text-center text-slate-500">
                    VIP系统数据暂时无法获取
                  </CardContent>
                </Card>
              )}
            </div>

            {/* ====== 能量报告系统概览 ====== */}
            <div>
              <SectionTitle icon={FileText} title="能量报告系统" color="text-indigo-400" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  title="总报告数"
                  value={stats?.destinyStats?.total || 0}
                  icon={FileText}
                  color="text-indigo-400"
                  bgColor="bg-indigo-500/10"
                />
                <StatCard
                  title="今日新增"
                  value={stats?.destinyStats?.todayCount || 0}
                  icon={TrendingUp}
                  color="text-blue-400"
                  bgColor="bg-blue-500/10"
                />
                <StatCard
                  title="已完成"
                  value={stats?.destinyStats?.statusCounts?.completed || 0}
                  icon={CheckCircle2}
                  color="text-green-400"
                  bgColor="bg-green-500/10"
                />
                <StatCard
                  title="处理中"
                  value={stats?.destinyStats?.statusCounts?.processing || 0}
                  icon={Loader2}
                  color="text-yellow-400"
                  bgColor="bg-yellow-500/10"
                  subtitle="全局处理中"
                />
              </div>
            </div>

            {/* ====== 最近订单 ====== */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">最近订单</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentOrders.map((order: any) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium text-white">订单 #{order.orderNumber}</p>
                            <p className="text-sm text-slate-400">
                              {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                            </p>
                          </div>
                          {/* 支付方式标识 */}
                          {(order.paymentMethod === "bank_transfer" || order.paymentMethod === "alipay") && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                              order.paymentStatus === "pending"
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : "bg-slate-700/50 text-slate-400"
                            }`}>
                              {order.paymentMethod === "bank_transfer" ? (
                                <><Banknote className="w-3 h-3" /> 银行转账</>
                              ) : (
                                <><CreditCard className="w-3 h-3" /> 支付宝</>
                              )}
                              {order.paymentStatus === "pending" && " · 待确认"}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[oklch(82%_0.18_85)]">
                            ${Number(order.total).toFixed(2)}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            order.status === "delivered" ? "bg-green-500/20 text-green-400" :
                            order.status === "shipped" ? "bg-blue-500/20 text-blue-400" :
                            order.status === "processing" ? "bg-yellow-500/20 text-yellow-400" :
                            order.status === "cancelled" ? "bg-red-500/20 text-red-400" :
                            "bg-slate-500/20 text-slate-400"
                          }`}>
                            {order.status === "pending" ? "待处理" :
                             order.status === "processing" ? "处理中" :
                             order.status === "shipped" ? "已发货" :
                             order.status === "delivered" ? "已送达" :
                             order.status === "cancelled" ? "已取消" : order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">暂无订单</div>
                )}
              </CardContent>
            </Card>

            {/* ====== 热销产品 ====== */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">热销产品</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.topProducts && stats.topProducts.length > 0 ? (
                  <div className="space-y-3">
                    {stats.topProducts.map((product: any, index: number) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[oklch(82%_0.18_85)]/20 flex items-center justify-center">
                          <span className="text-[oklch(82%_0.18_85)] font-bold text-sm">#{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate">{getLocalized(product.name)}</p>
                          <p className="text-sm text-slate-400">销量: {product.salesCount}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-[oklch(82%_0.18_85)]">
                            ${product.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">暂无数据</div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
