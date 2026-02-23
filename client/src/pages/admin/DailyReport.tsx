import { useState, useMemo } from "react";
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
  Star,
  MessageSquare,
  Ticket,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
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

function MiniBarChart({ data, maxValue, color = "oklch(82%_0.18_85)" }: { data: number[]; maxValue: number; color?: string }) {
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((val, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm transition-all"
          style={{
            height: `${maxValue > 0 ? (val / maxValue) * 100 : 0}%`,
            minHeight: val > 0 ? "4px" : "2px",
            backgroundColor: `${color}`,
            opacity: 0.7,
          }}
          onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '1'; }}
          onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '0.7'; }}
          title={`${val}`}
        />
      ))}
    </div>
  );
}

export default function DailyReport() {
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

  // 商城趋势数据
  const shopTrend = weeklyTrend?.shop;
  const trendOrders = useMemo(() => shopTrend?.map((d) => d.orders) || [], [shopTrend]);
  const trendRevenue = useMemo(() => shopTrend?.map((d) => d.revenue) || [], [shopTrend]);
  const trendUsers = useMemo(() => shopTrend?.map((d) => d.newUsers) || [], [shopTrend]);
  const maxOrders = Math.max(...trendOrders, 1);
  const maxRevenue = Math.max(...trendRevenue, 1);
  const maxUsers = Math.max(...trendUsers, 1);

  // 报告趋势数据
  const reportTrend = weeklyTrend?.reports;
  const trendNewReports = useMemo(() => reportTrend?.map((d) => d.newReports) || [], [reportTrend]);
  const trendCompletedReports = useMemo(() => reportTrend?.map((d) => d.completedReports) || [], [reportTrend]);
  const maxNewReports = Math.max(...trendNewReports, 1);
  const maxCompletedReports = Math.max(...trendCompletedReports, 1);

  const shop = dailyData?.shop;
  const reviews = dailyData?.reviews;
  const coupons = dailyData?.coupons;
  const reports = dailyData?.reports;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题和日期选择 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">每日数据</h1>
            <p className="text-slate-400">三系统运营数据汇总</p>
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
            {/* ====== 商城数据 ====== */}
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

            {/* ====== 评价 & 优惠券 ====== */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                评价 & 优惠券 · {selectedDate}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard
                  title="新评价"
                  value={reviews?.newReviews || 0}
                  icon={MessageSquare}
                  color="text-blue-400"
                  bgColor="bg-blue-500/10"
                />
                <StatCard
                  title="待审核评价"
                  value={reviews?.pendingReviews || 0}
                  icon={Clock}
                  color="text-yellow-400"
                  bgColor="bg-yellow-500/10"
                  subtitle="全部待审核"
                />
                <StatCard
                  title="已通过评价"
                  value={reviews?.approvedReviews || 0}
                  icon={CheckCircle2}
                  color="text-green-400"
                  bgColor="bg-green-500/10"
                />
                <StatCard
                  title="优惠券使用"
                  value={coupons?.usedToday || 0}
                  icon={Ticket}
                  color="text-pink-400"
                  bgColor="bg-pink-500/10"
                />
                <StatCard
                  title="活跃优惠券"
                  value={coupons?.activeCoupons || 0}
                  icon={Ticket}
                  color="text-cyan-400"
                  bgColor="bg-cyan-500/10"
                  subtitle="当前可用"
                />
                <StatCard
                  title="优惠金额"
                  value={`$${(coupons?.totalDiscount || 0).toFixed(2)}`}
                  icon={DollarSign}
                  color="text-orange-400"
                  bgColor="bg-orange-500/10"
                />
              </div>
            </div>

            {/* ====== 能量报告 ====== */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                能量报告 · {selectedDate}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <StatCard
                  title="新报告"
                  value={reports?.newReports || 0}
                  icon={FileText}
                  color="text-indigo-400"
                  bgColor="bg-indigo-500/10"
                />
                <StatCard
                  title="已完成"
                  value={reports?.completedReports || 0}
                  icon={CheckCircle2}
                  color="text-green-400"
                  bgColor="bg-green-500/10"
                />
                <StatCard
                  title="失败"
                  value={reports?.failedReports || 0}
                  icon={XCircle}
                  color="text-red-400"
                  bgColor="bg-red-500/10"
                />
                <StatCard
                  title="处理中"
                  value={reports?.processingReports || 0}
                  icon={Loader2}
                  color="text-blue-400"
                  bgColor="bg-blue-500/10"
                  subtitle="全局处理中"
                />
                <StatCard
                  title="总报告数"
                  value={reports?.totalReports || 0}
                  icon={BarChart3}
                  color="text-purple-400"
                  bgColor="bg-purple-500/10"
                  subtitle="累计"
                />
              </div>
            </div>

            {/* ====== 7天趋势 ====== */}
            {shopTrend && shopTrend.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[oklch(82%_0.18_85)]" />
                  近7天趋势
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {/* 订单趋势 */}
                  <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-slate-400">订单趋势</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MiniBarChart data={trendOrders} maxValue={maxOrders} color="oklch(62% 0.19 250)" />
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        {shopTrend.map((d) => (
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
                      <MiniBarChart data={trendRevenue} maxValue={maxRevenue} color="oklch(72% 0.19 150)" />
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        {shopTrend.map((d) => (
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
                      <MiniBarChart data={trendUsers} maxValue={maxUsers} color="oklch(72% 0.19 300)" />
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        {shopTrend.map((d) => (
                          <span key={d.date}>{d.date.substring(5)}</span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* 新报告趋势 */}
                  {reportTrend && reportTrend.length > 0 && (
                    <>
                      <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-slate-400">新报告趋势</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <MiniBarChart data={trendNewReports} maxValue={maxNewReports} color="oklch(62% 0.19 270)" />
                          <div className="flex justify-between mt-2 text-xs text-slate-500">
                            {reportTrend.map((d) => (
                              <span key={d.date}>{d.date.substring(5)}</span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm text-slate-400">完成报告趋势</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <MiniBarChart data={trendCompletedReports} maxValue={maxCompletedReports} color="oklch(72% 0.19 150)" />
                          <div className="flex justify-between mt-2 text-xs text-slate-500">
                            {reportTrend.map((d) => (
                              <span key={d.date}>{d.date.substring(5)}</span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
