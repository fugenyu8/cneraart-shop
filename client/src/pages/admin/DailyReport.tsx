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
  Eye,
  Hand,
  Home,
  Ban,
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

function TrendChart({ title, data, dates, color }: { title: string; data: number[]; dates: string[]; color: string }) {
  const maxValue = Math.max(...data, 1);
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-slate-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <MiniBarChart data={data} maxValue={maxValue} color={color} />
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          {dates.map((d) => (
            <span key={d}>{d.substring(5)}</span>
          ))}
        </div>
      </CardContent>
    </Card>
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
  const shopDates = useMemo(() => shopTrend?.map((d) => d.date) || [], [shopTrend]);

  // 报告趋势数据
  const reportTrend = weeklyTrend?.reports;
  const trendNewReports = useMemo(() => reportTrend?.map((d) => d.newReports) || [], [reportTrend]);
  const trendCompletedReports = useMemo(() => reportTrend?.map((d) => d.completedReports) || [], [reportTrend]);
  const reportDates = useMemo(() => reportTrend?.map((d) => d.date) || [], [reportTrend]);

  // 命理服务趋势数据
  const fortuneTrend = weeklyTrend?.fortune;
  const trendNewBookings = useMemo(() => fortuneTrend?.map((d) => d.newBookings) || [], [fortuneTrend]);
  const trendCompletedBookings = useMemo(() => fortuneTrend?.map((d) => d.completedBookings) || [], [fortuneTrend]);
  const trendFace = useMemo(() => fortuneTrend?.map((d) => d.face) || [], [fortuneTrend]);
  const trendPalm = useMemo(() => fortuneTrend?.map((d) => d.palm) || [], [fortuneTrend]);
  const trendFengshui = useMemo(() => fortuneTrend?.map((d) => d.fengshui) || [], [fortuneTrend]);
  const fortuneDates = useMemo(() => fortuneTrend?.map((d) => d.date) || [], [fortuneTrend]);

  const shop = dailyData?.shop;
  const reviews = dailyData?.reviews;
  const coupons = dailyData?.coupons;
  const reports = dailyData?.reports;
  const fortune = dailyData?.fortune;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题和日期选择 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">每日数据</h1>
            <p className="text-slate-400">三大系统运营数据汇总</p>
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
                <ShoppingCart className="w-5 h-5 text-blue-400" />
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

            {/* ====== 命理服务数据 ====== */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[oklch(82%_0.18_85)]" />
                命理服务 · {selectedDate}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-8 gap-4">
                <StatCard
                  title="新预约"
                  value={fortune?.newBookings || 0}
                  icon={Sparkles}
                  color="text-[oklch(82%_0.18_85)]"
                  bgColor="bg-[oklch(82%_0.18_85)]/10"
                />
                <StatCard
                  title="面相"
                  value={fortune?.byType?.face || 0}
                  icon={Eye}
                  color="text-pink-400"
                  bgColor="bg-pink-500/10"
                />
                <StatCard
                  title="手相"
                  value={fortune?.byType?.palm || 0}
                  icon={Hand}
                  color="text-orange-400"
                  bgColor="bg-orange-500/10"
                />
                <StatCard
                  title="风水"
                  value={fortune?.byType?.fengshui || 0}
                  icon={Home}
                  color="text-cyan-400"
                  bgColor="bg-cyan-500/10"
                />
                <StatCard
                  title="已完成"
                  value={fortune?.completedBookings || 0}
                  icon={CheckCircle2}
                  color="text-green-400"
                  bgColor="bg-green-500/10"
                />
                <StatCard
                  title="进行中"
                  value={fortune?.inProgressBookings || 0}
                  icon={Loader2}
                  color="text-blue-400"
                  bgColor="bg-blue-500/10"
                />
                <StatCard
                  title="已取消"
                  value={fortune?.cancelledBookings || 0}
                  icon={Ban}
                  color="text-red-400"
                  bgColor="bg-red-500/10"
                />
                <StatCard
                  title="待处理(全局)"
                  value={fortune?.totalPendingAll || 0}
                  icon={Clock}
                  color="text-yellow-400"
                  bgColor="bg-yellow-500/10"
                  subtitle="所有待处理"
                />
              </div>
            </div>

            {/* ====== 评价 & 优惠券 ====== */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-400" />
                评价 & 优惠券 · {selectedDate}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
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
                  title="服务评价"
                  value={fortune?.newReviews || 0}
                  icon={Star}
                  color="text-amber-400"
                  bgColor="bg-amber-500/10"
                  subtitle="命理服务评价"
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
            <div>
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[oklch(82%_0.18_85)]" />
                近7天趋势
              </h2>

              {/* 商城趋势 */}
              {shopTrend && shopTrend.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> 商城
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TrendChart title="订单趋势" data={trendOrders} dates={shopDates} color="oklch(62% 0.19 250)" />
                    <TrendChart title="营收趋势 ($)" data={trendRevenue} dates={shopDates} color="oklch(72% 0.19 150)" />
                    <TrendChart title="新用户趋势" data={trendUsers} dates={shopDates} color="oklch(72% 0.19 300)" />
                  </div>
                </div>
              )}

              {/* 命理服务趋势 */}
              {fortuneTrend && fortuneTrend.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> 命理服务
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <TrendChart title="新预约趋势" data={trendNewBookings} dates={fortuneDates} color="oklch(82% 0.18 85)" />
                    <TrendChart title="完成趋势" data={trendCompletedBookings} dates={fortuneDates} color="oklch(72% 0.19 150)" />
                    <TrendChart title="面相趋势" data={trendFace} dates={fortuneDates} color="oklch(72% 0.19 350)" />
                    <TrendChart title="手相趋势" data={trendPalm} dates={fortuneDates} color="oklch(72% 0.19 50)" />
                    <TrendChart title="风水趋势" data={trendFengshui} dates={fortuneDates} color="oklch(72% 0.19 200)" />
                  </div>
                </div>
              )}

              {/* 能量报告趋势 */}
              {reportTrend && reportTrend.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> 能量报告
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TrendChart title="新报告趋势" data={trendNewReports} dates={reportDates} color="oklch(62% 0.19 270)" />
                    <TrendChart title="完成报告趋势" data={trendCompletedReports} dates={reportDates} color="oklch(72% 0.19 150)" />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
