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
  Globe,
  Languages,
  Percent,
  Repeat,
  Filter,
  Activity,
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

            {/* ====== 市场运营数据板块 ====== */}
            <div className="mt-8 pt-8 border-t border-slate-700">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20">
                    <Activity className="w-6 h-6 text-violet-400" />
                  </div>
                  市场运营数据
                </h2>
                <p className="text-slate-400 mt-1">四大系统综合转化分析 · 为提升转化率服务</p>
              </div>

              {/* 关键转化指标卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                  title="总体转化率"
                  value={`${stats?.marketingData?.conversionFunnel?.overallRate || 0}%`}
                  icon={Target}
                  color="text-violet-400"
                  bgColor="bg-violet-500/10"
                  subtitle="注册→付费"
                />
                <StatCard
                  title="平均客单价"
                  value={`$${stats?.marketingData?.avgOrderValue || 0}`}
                  icon={DollarSign}
                  color="text-emerald-400"
                  bgColor="bg-emerald-500/10"
                  subtitle="已支付订单"
                />
                <StatCard
                  title="复购率"
                  value={`${stats?.marketingData?.repeatBuyerRate || 0}%`}
                  icon={Repeat}
                  color="text-amber-400"
                  bgColor="bg-amber-500/10"
                  subtitle="≥ 2单用户比例"
                />
                <StatCard
                  title="命理服务转化"
                  value={`${stats?.marketingData?.fortuneConversion?.rate || 0}%`}
                  icon={Sparkles}
                  color="text-pink-400"
                  bgColor="bg-pink-500/10"
                  subtitle={`${stats?.marketingData?.fortuneConversion?.completed || 0}/${stats?.marketingData?.fortuneConversion?.booked || 0}`}
                />
              </div>

              {/* 转化漏斗 + VIP转化指标 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 转化漏斗 */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Filter className="w-5 h-5 text-violet-400" />
                      用户转化漏斗
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ConversionFunnel data={stats?.marketingData?.conversionFunnel} />
                  </CardContent>
                </Card>

                {/* VIP系统转化指标 */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Crown className="w-5 h-5 text-amber-400" />
                      VIP系统转化指标
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {stats?.vipStats ? (
                      <div className="space-y-4">
                        <MetricBar label="付费转化率" value={stats.vipStats.paidConversionRate || 0} color="bg-amber-500" />
                        <MetricBar label="任务完成率" value={stats.vipStats.taskCompletionRate || 0} color="bg-green-500" />
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                          <span className="text-slate-400">平均订单金额</span>
                          <span className="text-xl font-bold text-amber-400">${stats.vipStats.avgOrderValue || 0}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-slate-500">VIP数据暂时无法获取</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 语言分布 + 国家分布 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* 用户语言分布 */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Languages className="w-5 h-5 text-blue-400" />
                      用户语言分布
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LanguageDistribution data={stats?.marketingData?.languageDistribution} />
                  </CardContent>
                </Card>

                {/* 国家分布 */}
                <Card className="bg-slate-900/50 border-slate-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-cyan-400" />
                      客户国家分布 TOP 10
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CountryDistribution data={stats?.marketingData?.countryDistribution} />
                  </CardContent>
                </Card>
              </div>

              {/* 7天趋势图 */}
              <Card className="bg-slate-900/50 border-slate-800 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    近 7 天运营趋势
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <DailyTrendChart data={stats?.marketingData?.dailyTrend7d} />
                </CardContent>
              </Card>

              {/* 四系统转化路径概览 */}
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-fuchsia-400" />
                    四系统转化路径概览
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CrossSystemOverview stats={stats} />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}

// ====== 市场运营组件 ======

const LANG_NAMES: Record<string, string> = {
  zh: "中文", en: "English", de: "Deutsch", fr: "Français", es: "Español",
  it: "Italiano", pt: "Português", ru: "Русский", ja: "日本語", ko: "한국어",
  ar: "العربية", hi: "हिन्दी", th: "ไทย", vi: "Tiếng Việt", id: "Indonesia",
  ms: "Melayu", km: "ខ្មែរ", "zh-Hant": "繁體中文",
};

const LANG_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-violet-500",
  "bg-cyan-500", "bg-orange-500", "bg-pink-500", "bg-teal-500", "bg-indigo-500",
  "bg-lime-500", "bg-fuchsia-500", "bg-sky-500", "bg-red-500", "bg-green-500",
  "bg-yellow-500", "bg-purple-500", "bg-slate-500",
];

function LanguageDistribution({ data }: { data?: Record<string, number> }) {
  if (!data || Object.keys(data).length === 0) {
    return <div className="text-center py-8 text-slate-500">暂无语言数据</div>;
  }
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const total = sorted.reduce((sum, [, v]) => sum + v, 0);

  return (
    <div className="space-y-3">
      {sorted.map(([lang, count], i) => {
        const pct = total > 0 ? ((count / total) * 100).toFixed(1) : "0";
        return (
          <div key={lang} className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${LANG_COLORS[i % LANG_COLORS.length]}`} />
            <span className="text-sm text-slate-300 w-24 truncate">{LANG_NAMES[lang] || lang}</span>
            <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${LANG_COLORS[i % LANG_COLORS.length]} transition-all`} style={{ width: `${pct}%` }} />
            </div>
            <span className="text-sm text-slate-400 w-16 text-right">{count} ({pct}%)</span>
          </div>
        );
      })}
    </div>
  );
}

function CountryDistribution({ data }: { data?: Array<{ country: string; users: number }> }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-slate-500">暂无国家数据</div>;
  }
  const maxUsers = data[0]?.users || 1;

  return (
    <div className="space-y-3">
      {data.slice(0, 10).map((item, i) => (
        <div key={item.country} className="flex items-center gap-3">
          <span className="text-sm font-medium text-slate-400 w-6">#{i + 1}</span>
          <span className="text-sm text-slate-300 w-28 truncate">{item.country}</span>
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-cyan-500 transition-all" style={{ width: `${(item.users / maxUsers) * 100}%` }} />
          </div>
          <span className="text-sm text-slate-400 w-12 text-right">{item.users}</span>
        </div>
      ))}
    </div>
  );
}

function ConversionFunnel({ data }: { data?: any }) {
  if (!data) {
    return <div className="text-center py-8 text-slate-500">暂无漏斗数据</div>;
  }

  const steps = [
    { label: "注册用户", value: data.registered, color: "from-blue-500 to-blue-600" },
    { label: "下单用户", value: data.ordered, color: "from-violet-500 to-violet-600", rate: data.registerToOrderRate },
    { label: "已支付", value: data.paid, color: "from-emerald-500 to-emerald-600", rate: data.orderToPaidRate },
    { label: "已完成", value: data.completed, color: "from-amber-500 to-amber-600", rate: data.paidToCompleteRate },
  ];

  const maxVal = steps[0]?.value || 1;

  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={step.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-300">{step.label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">{step.value}</span>
              {step.rate !== undefined && (
                <span className="text-xs px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {step.rate}%
                </span>
              )}
            </div>
          </div>
          <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${step.color} transition-all duration-500`}
              style={{ width: `${maxVal > 0 ? (step.value / maxVal) * 100 : 0}%` }}
            />
          </div>
          {i < steps.length - 1 && (
            <div className="flex justify-center my-1">
              <ArrowRight className="w-4 h-4 text-slate-600 rotate-90" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="text-sm font-bold text-white">{value}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${Math.min(value, 100)}%` }} />
      </div>
    </div>
  );
}

function DailyTrendChart({ data }: { data?: Array<{ date: string; orders: number; revenue: number; newUsers: number }> }) {
  if (!data || data.length === 0) {
    return <div className="text-center py-8 text-slate-500">暂无趋势数据</div>;
  }

  const maxOrders = Math.max(...data.map(d => d.orders), 1);
  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);

  return (
    <div className="space-y-4">
      {/* 图例 */}
      <div className="flex items-center gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-blue-500" />订单数</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-emerald-500" />营收($)</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-violet-500" />新用户</div>
      </div>

      {/* 柱状图 */}
      <div className="flex items-end gap-2 h-40">
        {data.map((day) => (
          <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
            {/* 订单柱 */}
            <div className="w-full flex gap-0.5 items-end" style={{ height: '120px' }}>
              <div className="flex-1 bg-blue-500/80 rounded-t transition-all" style={{ height: `${(day.orders / maxOrders) * 100}%`, minHeight: day.orders > 0 ? '4px' : '0' }} />
              <div className="flex-1 bg-emerald-500/80 rounded-t transition-all" style={{ height: `${(day.revenue / maxRevenue) * 100}%`, minHeight: day.revenue > 0 ? '4px' : '0' }} />
              <div className="flex-1 bg-violet-500/80 rounded-t transition-all" style={{ height: `${day.newUsers > 0 ? Math.max((day.newUsers / maxOrders) * 100, 10) : 0}%`, minHeight: day.newUsers > 0 ? '4px' : '0' }} />
            </div>
            <span className="text-[10px] text-slate-500">{day.date.slice(5)}</span>
          </div>
        ))}
      </div>

      {/* 数据摘要 */}
      <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-800">
        <div className="text-center">
          <p className="text-lg font-bold text-blue-400">{data.reduce((s, d) => s + d.orders, 0)}</p>
          <p className="text-xs text-slate-500">7天总订单</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-emerald-400">${data.reduce((s, d) => s + Number(d.revenue), 0).toFixed(2)}</p>
          <p className="text-xs text-slate-500">7天总营收</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-violet-400">{data.reduce((s, d) => s + d.newUsers, 0)}</p>
          <p className="text-xs text-slate-500">7天新用户</p>
        </div>
      </div>
    </div>
  );
}

function CrossSystemOverview({ stats }: { stats: any }) {
  const systems = [
    {
      name: "电商商城",
      icon: ShoppingCart,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      metrics: [
        { label: "用户", value: stats?.totalCustomers || 0 },
        { label: "订单", value: stats?.totalOrders || 0 },
        { label: "营收", value: `$${Number(stats?.totalRevenue || 0).toFixed(0)}` },
      ],
    },
    {
      name: "VIP专属",
      icon: Crown,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      metrics: [
        { label: "订单", value: stats?.vipStats?.totalOrders || 0 },
        { label: "报告", value: stats?.vipStats?.totalReports || 0 },
        { label: "营收", value: `$${Number(stats?.vipStats?.totalRevenue || 0).toFixed(0)}` },
      ],
    },
    {
      name: "客服系统",
      icon: Headphones,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      metrics: [
        { label: "会话", value: stats?.serviceStats?.totalSessions || 0 },
        { label: "高意向", value: stats?.serviceStats?.highIntentSessions || 0 },
        { label: "已转化", value: stats?.serviceStats?.convertedSessions || 0 },
      ],
    },
    {
      name: "命理服务",
      icon: Sparkles,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      metrics: [
        { label: "预约", value: stats?.fortuneStats?.totalBookings || 0 },
        { label: "完成", value: stats?.fortuneStats?.completed || 0 },
        { label: "评价", value: stats?.fortuneStats?.totalReviews || 0 },
      ],
    },
  ];

  // 计算总收入
  const totalRevenue = Number(stats?.totalRevenue || 0) + Number(stats?.vipStats?.totalRevenue || 0);

  return (
    <div className="space-y-6">
      {/* 总收入概览 */}
      <div className="text-center p-4 rounded-lg bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-amber-500/10 border border-slate-700">
        <p className="text-sm text-slate-400 mb-1">四系统综合营收</p>
        <p className="text-3xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
      </div>

      {/* 四系统卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systems.map((sys) => (
          <div key={sys.name} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2 mb-3">
              <div className={`p-1.5 rounded ${sys.bgColor}`}>
                <sys.icon className={`w-4 h-4 ${sys.color}`} />
              </div>
              <span className="font-medium text-white">{sys.name}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sys.metrics.map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-lg font-bold text-white">{m.value}</p>
                  <p className="text-xs text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 转化路径提示 */}
      <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
        <p className="text-sm text-slate-400 mb-2 font-medium">转化路径分析</p>
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-400">商城浏览</span>
          <ArrowRight className="w-3 h-3" />
          <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">客服咨询</span>
          <ArrowRight className="w-3 h-3" />
          <span className="px-2 py-1 rounded bg-pink-500/10 text-pink-400">命理服务/VIP</span>
          <ArrowRight className="w-3 h-3" />
          <span className="px-2 py-1 rounded bg-amber-500/10 text-amber-400">下单转化</span>
          <ArrowRight className="w-3 h-3" />
          <span className="px-2 py-1 rounded bg-violet-500/10 text-violet-400">复购留存</span>
        </div>
      </div>
    </div>
  );
}
