import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
          <p className="text-slate-400">三大系统运营数据概览</p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-400">
            <BarChart3 className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            加载数据中...
          </div>
        ) : (
          <>
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
                        <div>
                          <p className="font-medium text-white">订单 #{order.orderNumber}</p>
                          <p className="text-sm text-slate-400">
                            {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                          </p>
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
