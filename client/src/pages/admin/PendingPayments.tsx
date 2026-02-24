import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc";
import {
  Banknote,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  Search,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export default function PendingPayments() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [transactionId, setTransactionId] = useState("");

  // 获取待确认付款的订单
  const { data: pendingData, isLoading, refetch } = trpc.orders.getPendingPayments.useQuery({
    page: 1,
    pageSize: 100,
  });
  const pendingOrders = pendingData?.orders;

  // 确认付款 mutation
  const confirmMutation = trpc.orders.confirmOfflinePayment.useMutation({
    onSuccess: () => {
      toast.success("付款已确认！系统将自动处理后续流程。", {
        description: selectedOrder?.orderNumber,
        duration: 5000,
      });
      setConfirmDialogOpen(false);
      setSelectedOrder(null);
      setTransactionId("");
      refetch();
    },
    onError: (error: any) => {
      toast.error("确认失败: " + (error.message || "未知错误"));
    },
  });

  const handleConfirmPayment = () => {
    if (!selectedOrder) return;
    confirmMutation.mutate({
      orderId: selectedOrder.id,
      paymentId: transactionId || undefined,
    });
  };

  const openConfirmDialog = (order: any) => {
    setSelectedOrder(order);
    setTransactionId("");
    setConfirmDialogOpen(true);
  };

  const getPaymentMethodInfo = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return {
          label: "银行转账 (SWIFT/TT)",
          icon: <Banknote className="w-4 h-4" />,
          color: "text-blue-300",
          bgColor: "bg-blue-500/10",
          borderColor: "border-blue-500/30",
        };
      case "alipay":
        return {
          label: "支付宝",
          icon: <CreditCard className="w-4 h-4" />,
          color: "text-cyan-300",
          bgColor: "bg-cyan-500/10",
          borderColor: "border-cyan-500/30",
        };
      default:
        return {
          label: method,
          icon: null,
          color: "text-slate-300",
          bgColor: "bg-slate-500/10",
          borderColor: "border-slate-500/30",
        };
    }
  };

  const getTimeSince = (date: string) => {
    const now = new Date();
    const created = new Date(date);
    const diffMs = now.getTime() - created.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} 天前`;
    if (diffHours > 0) return `${diffHours} 小时前`;
    return "刚刚";
  };

  const filteredOrders = pendingOrders?.filter((order: any) =>
    search
      ? order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <div className="relative">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
              </div>
              待确认付款
            </h1>
            <p className="text-slate-400">
              以下订单通过银行转账或支付宝付款，需要人工确认收款后系统自动完成后续处理
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => refetch()}
            className="border-slate-700 text-slate-300 hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            刷新
          </Button>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">待确认总数</p>
                  <p className="text-3xl font-bold text-red-400">
                    {filteredOrders?.length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10">
                  <Clock className="w-6 h-6 text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">银行转账</p>
                  <p className="text-3xl font-bold text-blue-400">
                    {filteredOrders?.filter((o: any) => o.paymentMethod === "bank_transfer").length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <Banknote className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">支付宝</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {filteredOrders?.filter((o: any) => o.paymentMethod === "alipay").length || 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-cyan-500/10">
                  <CreditCard className="w-6 h-6 text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="搜索订单号或客户邮箱..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-slate-900/50 border-slate-800 text-white"
          />
        </div>

        {/* 订单列表 */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12 text-slate-400">{t("common.loading")}</div>
          ) : filteredOrders && filteredOrders.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-slate-800/50">
                  <TableHead className="text-slate-300">订单号</TableHead>
                  <TableHead className="text-slate-300">客户</TableHead>
                  <TableHead className="text-slate-300">支付方式</TableHead>
                  <TableHead className="text-slate-300">金额</TableHead>
                  <TableHead className="text-slate-300">下单时间</TableHead>
                  <TableHead className="text-slate-300">等待时长</TableHead>
                  <TableHead className="text-slate-300 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: any) => {
                  const pmInfo = getPaymentMethodInfo(order.paymentMethod);
                  const waitTime = getTimeSince(order.createdAt);
                  const isUrgent = new Date().getTime() - new Date(order.createdAt).getTime() > 24 * 60 * 60 * 1000;

                  return (
                    <TableRow
                      key={order.id}
                      className={`border-slate-800 ${
                        isUrgent
                          ? "bg-red-950/30 hover:bg-red-950/40"
                          : "hover:bg-slate-800/50"
                      }`}
                    >
                      <TableCell className="font-mono text-white">
                        <div className="flex items-center gap-2">
                          {order.orderNumber}
                          {isUrgent && (
                            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                              紧急
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div>
                          <p className="font-medium">{order.user?.name || "未知用户"}</p>
                          <p className="text-sm text-slate-400">{order.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full ${pmInfo.bgColor} ${pmInfo.color} border ${pmInfo.borderColor}`}>
                          {pmInfo.icon}
                          {pmInfo.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-[oklch(82%_0.18_85)] font-bold text-base">
                        ${parseFloat(order.total).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-slate-300 text-sm">
                        {new Date(order.createdAt).toLocaleString("zh-CN")}
                      </TableCell>
                      <TableCell>
                        <span className={`text-sm font-medium ${isUrgent ? "text-red-400" : "text-yellow-400"}`}>
                          {waitTime}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/wobifa888/orders/${order.id}`}>
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                              <Eye className="w-4 h-4 mr-1" />
                              详情
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            onClick={() => openConfirmDialog(order)}
                            className="bg-green-600 hover:bg-green-500 text-white"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            确认收款
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-16">
              <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <p className="text-lg text-white mb-2">没有待确认的付款</p>
              <p className="text-slate-400">所有线下付款订单已处理完毕</p>
            </div>
          )}
        </div>
      </div>

      {/* 确认付款对话框 */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              确认收款
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              确认后系统将自动更新订单状态并触发后续处理流程
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4 py-2">
              {/* 订单信息 */}
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">订单号</span>
                  <span className="font-mono text-white">{selectedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">支付方式</span>
                  <span className="text-white">
                    {selectedOrder.paymentMethod === "bank_transfer" ? "银行转账" : "支付宝"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">订单金额</span>
                  <span className="text-[oklch(82%_0.18_85)] font-bold text-lg">
                    ${parseFloat(selectedOrder.total).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">客户</span>
                  <span className="text-white">{selectedOrder.user?.email || "未知"}</span>
                </div>
              </div>

              {/* 流水号输入 */}
              <div className="space-y-2">
                <Label htmlFor="transactionId" className="text-slate-300">
                  转账流水号 <span className="text-slate-500">(选填)</span>
                </Label>
                <Input
                  id="transactionId"
                  placeholder="输入银行流水号或支付宝交易号..."
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-xs text-slate-500">
                  填写流水号有助于后续对账，不填也可以确认
                </p>
              </div>

              {/* 提醒 */}
              <div className="p-3 rounded-lg bg-yellow-950/30 border border-yellow-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-300/80">
                    <p className="font-medium text-yellow-300 mb-1">确认前请核实：</p>
                    <ul className="list-disc list-inside space-y-0.5 text-xs">
                      <li>已在银行/支付宝账户中确认收到对应金额</li>
                      <li>转账备注中包含该订单号</li>
                      <li>确认后系统将自动处理订单（不可撤销）</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              className="border-slate-700 text-slate-300"
            >
              取消
            </Button>
            <Button
              onClick={handleConfirmPayment}
              disabled={confirmMutation.isPending}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              {confirmMutation.isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  确认中...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  确认已收款
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
