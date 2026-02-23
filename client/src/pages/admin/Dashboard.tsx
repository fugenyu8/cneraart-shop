import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { getLocalized } from "@/lib/localized";

export default function AdminDashboard() {
  const { t } = useTranslation();
  
  // 获取统计数据
  const { data: stats, isLoading } = trpc.admin.getStats.useQuery();

  const statCards = [
    {
      title: "总销售额",
      value: stats?.totalRevenue ? `$${stats.totalRevenue.toFixed(2)}` : "$0.00",
      icon: DollarSign,
      trend: stats?.revenueTrend || 0,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "总订单数",
      value: stats?.totalOrders || 0,
      icon: ShoppingCart,
      trend: stats?.ordersTrend || 0,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "产品数量",
      value: stats?.totalProducts || 0,
      icon: Package,
      trend: stats?.productsTrend || 0,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "客户数量",
      value: stats?.totalCustomers || 0,
      icon: Users,
      trend: stats?.customersTrend || 0,
      color: "text-[oklch(82%_0.18_85)]",
      bgColor: "bg-[oklch(82%_0.18_85)]/10",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t("admin.dashboard")}</h1>
          <p className="text-slate-400">欢迎回来,这是您的商城数据概览</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const isPositive = stat.trend >= 0;
            return (
              <Card key={index} className="bg-slate-900/50 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="flex items-center text-sm">
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>
                      {Math.abs(stat.trend)}%
                    </span>
                    <span className="text-slate-500 ml-1">vs 上月</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 最近订单 */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">最近订单</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-slate-400">{t("common.loading")}</div>
            ) : stats?.recentOrders && stats.recentOrders.length > 0 ? (
              <div className="space-y-4">
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
                        ${order.totalAmount.toFixed(2)}
                      </p>
                      <p className="text-sm text-slate-400">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">暂无订单</div>
            )}
          </CardContent>
        </Card>

        {/* 热销产品 */}
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-white">热销产品</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-slate-400">{t("common.loading")}</div>
            ) : stats?.topProducts && stats.topProducts.length > 0 ? (
              <div className="space-y-4">
                {stats.topProducts.map((product: any, index: number) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[oklch(82%_0.18_85)]/20 flex items-center justify-center">
                      <span className="text-[oklch(82%_0.18_85)] font-bold">#{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{getLocalized(product.name)}</p>
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
      </div>
    </AdminLayout>
  );
}
