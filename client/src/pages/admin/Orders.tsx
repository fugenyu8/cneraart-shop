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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Search,
  Eye,
  Package,
  Banknote,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  MessageCircle,
} from "lucide-react";

export default function AdminOrders() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  >("all");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [transactionId, setTransactionId] = useState("");
  const utils = trpc.useUtils();

  // 确认收款 mutation
  const confirmMutation = trpc.orders.confirmOfflinePayment.useMutation({
    onSuccess: () => {
      toast.success("已确认收款，订单状态已更新");
      setConfirmDialogOpen(false);
      setSelectedOrder(null);
      setTransactionId("");
      utils.admin.orders.listAll.invalidate();
    },
    onError: (err: any) => {
      toast.error(err.message || "确认失败，请重试");
    },
  });

  const handleConfirmPayment = () => {
    if (!selectedOrder) return;
    confirmMutation.mutate({
      orderId: selectedOrder.id,
      paymentId: transactionId || undefined,
    });
  };

  // 获取订单列表
  const { data: orders, isLoading } = trpc.admin.orders.listAll.useQuery({
    status: statusFilter === "all" ? undefined : statusFilter,
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; color: string }> = {
      pending: { variant: "secondary", label: "待处理", color: "text-yellow-400" },
      processing: { variant: "default", label: "处理中", color: "text-blue-400" },
      shipped: { variant: "default", label: "已发货", color: "text-purple-400" },
      delivered: { variant: "default", label: "已送达", color: "text-green-400" },
      cancelled: { variant: "outline", label: "已取消", color: "text-red-400" },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getPaymentBadge = (paymentMethod: string, paymentStatus: string) => {
    const pendingCls =
      "bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse";
    const paidCls =
      "bg-green-500/20 text-green-300 border border-green-500/30";
    const defaultCls = "bg-slate-700/50 text-slate-400";
    const cls =
      paymentStatus === "pending"
        ? pendingCls
        : paymentStatus === "paid"
        ? paidCls
        : defaultCls;

    if (paymentMethod === "bank_transfer") {
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${cls}`}>
          <Banknote className="w-3 h-3" />
          银行转账
          {paymentStatus === "pending" && <AlertCircle className="w-3 h-3 text-red-400" />}
        </span>
      );
    }
    if (paymentMethod === "alipay") {
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${cls}`}>
          <CreditCard className="w-3 h-3" />
          支付宝
          {paymentStatus === "pending" && <AlertCircle className="w-3 h-3 text-red-400" />}
        </span>
      );
    }
    if (paymentMethod === "wechat") {
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${cls}`}>
          <MessageCircle className="w-3 h-3" />
          微信支付
          {paymentStatus === "pending" && <AlertCircle className="w-3 h-3 text-red-400" />}
        </span>
      );
    }
    if (paymentMethod === "paypal") {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
          PayPal
        </span>
      );
    }
    return null;
  };

  const filteredOrders = orders?.filter((order: any) =>
    search ? order.orderNumber.toLowerCase().includes(search.toLowerCase()) : true
  );

  // 统计待确认付款数量（含微信）
  const pendingOfflineCount =
    orders?.filter(
      (o: any) =>
        (o.paymentMethod === "bank_transfer" ||
          o.paymentMethod === "alipay" ||
          o.paymentMethod === "wechat") &&
        o.paymentStatus === "pending"
    ).length || 0;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t("admin.orders")}</h1>
            <p className="text-slate-400">管理所有订单和发货信息</p>
          </div>
        </div>

        {/* 待确认付款提醒条 */}
        {pendingOfflineCount > 0 && (
          <div className="flex items-center justify-between p-4 rounded-lg bg-red-950/60 border border-red-500/40">
            <div className="flex items-center gap-3">
              <div className="relative">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
              </div>
              <span className="text-red-300 font-medium">
                有{" "}
                <span className="text-red-200 font-bold">{pendingOfflineCount}</span>{" "}
                笔线下付款订单待确认
              </span>
            </div>
            <Link href="/wobifa888/pending-payments">
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/50 text-red-300 hover:bg-red-500/20"
              >
                去确认
              </Button>
            </Link>
          </div>
        )}

        {/* 搜索和筛选 */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="搜索订单号..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-800 text-white"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value: any) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-40 bg-slate-900/50 border-slate-800 text-white">
              <SelectValue placeholder="状态筛选" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="all">全部状态</SelectItem>
              <SelectItem value="pending">待处理</SelectItem>
              <SelectItem value="processing">处理中</SelectItem>
              <SelectItem value="shipped">已发货</SelectItem>
              <SelectItem value="delivered">已送达</SelectItem>
              <SelectItem value="cancelled">已取消</SelectItem>
            </SelectContent>
          </Select>
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
                  <TableHead className="text-slate-300">商品</TableHead>
                  <TableHead className="text-slate-300">金额</TableHead>
                  <TableHead className="text-slate-300">支付方式</TableHead>
                  <TableHead className="text-slate-300">状态</TableHead>
                  <TableHead className="text-slate-300">下单时间</TableHead>
                  <TableHead className="text-slate-300 text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order: any) => {
                  const isOfflinePending =
                    (order.paymentMethod === "bank_transfer" ||
                      order.paymentMethod === "alipay" ||
                      order.paymentMethod === "wechat") &&
                    order.paymentStatus === "pending";
                  return (
                    <TableRow
                      key={order.id}
                      className={`border-slate-800 hover:bg-slate-800/50 ${
                        isOfflinePending ? "bg-red-950/20 hover:bg-red-950/30" : ""
                      }`}
                    >
                      <TableCell className="font-mono text-white">
                        <div className="flex items-center gap-2">
                          {order.orderNumber}
                          {isOfflinePending && (
                            <span className="flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div>
                          <p className="font-medium">{order.user?.name || "未知用户"}</p>
                          <p className="text-sm text-slate-400">{order.user?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        {order.items?.length || 0} 件商品
                      </TableCell>
                      <TableCell className="text-[oklch(82%_0.18_85)] font-semibold">
                        ${parseFloat(order.total).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {getPaymentBadge(order.paymentMethod, order.paymentStatus)}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-slate-300">
                        {new Date(order.createdAt).toLocaleDateString("zh-CN")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          {isOfflinePending && (
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedOrder(order);
                                setTransactionId("");
                                setConfirmDialogOpen(true);
                              }}
                              className="bg-green-600 hover:bg-green-500 text-white text-xs h-8 px-3"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                              确认收款
                            </Button>
                          )}
                          <Link href={`/wobifa888/orders/${order.id}`}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-white"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-slate-400 hover:text-white"
                            title="更新物流"
                          >
                            <Package className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">暂无订单</p>
            </div>
          )}
        </div>
      </div>

      {/* 确认收款对话框 */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              确认收款
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              确认后系统将自动更新订单状态
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">订单号</span>
                  <span className="font-mono text-white">{selectedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">支付方式</span>
                  <span className="text-white">
                    {selectedOrder.paymentMethod === "bank_transfer"
                      ? "银行转账"
                      : selectedOrder.paymentMethod === "alipay"
                      ? "支付宝"
                      : selectedOrder.paymentMethod === "wechat"
                      ? "微信支付"
                      : selectedOrder.paymentMethod}
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
              <div className="space-y-2">
                <Label htmlFor="transactionId" className="text-slate-300">
                  转账流水号 <span className="text-slate-500">(选填)</span>
                </Label>
                <Input
                  id="transactionId"
                  placeholder="输入银行流水号 / 支付宝 / 微信交易号..."
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-xs text-slate-500">
                  填写流水号有助于后续对账，不填也可以确认
                </p>
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
