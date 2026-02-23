import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  ShoppingCart,
  DollarSign,
  Users,
  CreditCard,
  Clock,
  Sparkles,
  TrendingUp,
  Calendar,
  ArrowLeft,
  ArrowRight,
  BarChart3,
} from "lucide-react";

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  subtitle,
}: {
  title: string;
  value: string | number;
  icon: any;
  color: string;
  bgColor: string;
  subtitle?: string;
}) {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400 mb-1">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
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

function MiniBarChart({ data, maxValue }: { data: number[]; maxValue: number }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 bg-[oklch(82%_0.18_85)]/60 rounded-t-sm transition-all hover:bg-[oklch(82%_0.18_85)]"
          style={{ height: `${maxValue > 0 ? (val / maxValue) * 100 : 0}%`, minHeight: val > 0 ? "4px" : "2px" }}
          title={`${val}`}
        />
      ))}
    </div>
  );
}

export default function DailyReport() {
  const { t } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);

  // 获取当日数据
  const { data: dailyData, isLoading } = trpc.admin.systemMonitor.getDailySummary.useQuery(
    { date: selectedDate }
  );

  // 获取7天趋势
  const { data: weeklyTrend } = trpc.admin.systemMonitor.getWeeklyTrend.useQuery();

  // 日期导航
  const goToDate = (offset: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + offset);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const isToday = selectedDate === new Date().toISOString().split("T")[0];

  // 趋势数据
  const trendOrders = useMemo(() => weeklyTrend?.map((d) => d.orders) || [], [weeklyTrend]);
  const trendRevenue = useMemo(() => weeklyTrend?.map((d) => d.revenue) || [], [weeklyTrend]);
  const trendUsers = useMemo(() => weeklyTrend?.map((d) => d.newUsers) || [], [weeklyTrend]);
  const maxOrders = Math.max(...trendOrders, 1);
  const maxRevenue = Math.max(...trendRevenue, 1);
  const maxUsers = Math.max(...trendUsers, 1);

  const shop = dailyData?.shop;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题和日期选择 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">每日数据</h1>
            <p className="text-slate-400">查看每日运营数据汇总</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToDate(-1)}
              className="border-slate-700 text-slate-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 bg-slate-900/50 border-slate-700 text-white w-44"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToDate(1)}
              disabled={isToday}
              className="border-slate-700 text-slate-300"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            {!isToday && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDate(new Date().toISOString().split("T")[0])}
                className="border-slate-700 text-slate-300"
              >
                今天
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-slate-400">
            <BarChart3 className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            加载数据中...
          </div>
        ) : (
          <>
            {/* 商城数据卡片 */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[oklch(82%_0.18_85)]" />
                商城数据 · {selectedDate}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                  title="新订单"
                  value={shop?.newOrders || 0}
                  icon={ShoppingCart}
                  color="text-blue-400"
                  bgColor="bg-blue-500/10"
                />
                <StatCard
                  title="营收"
                  value={`$${(shop?.revenue || 0).toFixed(2)}`}
                  icon={DollarSign}
                  color="text-green-400"
                  bgColor="bg-green-500/10"
                />
                <StatCard
                  title="新用户"
                  value={shop?.newUsers || 0}
                  icon={Users}
                  color="text-purple-400"
                  bgColor="bg-purple-500/10"
                />
                <StatCard
                  title="已支付"
                  value={shop?.paidOrders || 0}
                  icon={CreditCard}
                  color="text-emerald-400"
                  bgColor="bg-emerald-500/10"
                />
                <StatCard
                  title="待处理"
                  value={shop?.pendingOrders || 0}
                  icon={Clock}
                  color="text-yellow-400"
                  bgColor="bg-yellow-500/10"
                />
                <StatCard
                  title="命理预约"
                  value={shop?.serviceBookings || 0}
                  icon={Sparkles}
                  color="text-[oklch(82%_0.18_85)]"
                  bgColor="bg-[oklch(82%_0.18_85)]/10"
                />
              </div>
            </div>

            {/* 7天趋势 */}
            {weeklyTrend && weeklyTrend.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[oklch(82%_0.18_85)]" />
                  近7天趋势
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* 订单趋势 */}
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-400">订单趋势</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MiniBarChart data={trendOrders} maxValue={maxOrders} />
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        {weeklyTrend.map((d) => (
                          <span key={d.date}>{d.date.substring(5)}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 营收趋势 */}
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-400">营收趋势 ($)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MiniBarChart data={trendRevenue} maxValue={maxRevenue} />
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        {weeklyTrend.map((d) => (
                          <span key={d.date}>{d.date.substring(5)}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 用户趋势 */}
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-400">新用户趋势</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MiniBarChart data={trendUsers} maxValue={maxUsers} />
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        {weeklyTrend.map((d) => (
                          <span key={d.date}>{d.date.substring(5)}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
