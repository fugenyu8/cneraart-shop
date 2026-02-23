import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRoute, Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
import { getLocalized } from "@/lib/localized";
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { toast } from "sonner";

export default function AdminOrderDetail() {
  const { t } = useTranslation();
  const [, params] = useRoute("/wobifa888/orders/:id");
  const orderId = params?.id ? parseInt(params.id) : 0;

  const [trackingNumber, setTrackingNumber] = useState("");
  const [shippingCarrier, setShippingCarrier] = useState("");

  // 获取订单详情
  const { data: order, isLoading, refetch } = trpc.admin.orders.getById.useQuery({ orderId });

  // 更新订单状态
  const updateStatusMutation = trpc.admin.orders.updateStatus.useMutation({
    onSuccess: () => {
      toast.success("订单状态已更新");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "更新失败");
    },
  });

  // 更新物流信息
  const updateTrackingMutation = trpc.admin.orders.updateTracking.useMutation({
    onSuccess: () => {
      toast.success("物流信息已更新");
      setTrackingNumber("");
      setShippingCarrier("");
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "更新失败");
    },
  });

  const handleUpdateStatus = (status: "pending" | "processing" | "shipped" | "delivered" | "cancelled") => {
    if (confirm(`确定要将订单状态更新为“${getStatusLabel(status)}”吗?`)) {
      updateStatusMutation.mutate({ orderId, status });
    }
  };

  const handleUpdateTracking = () => {
    if (!trackingNumber || !shippingCarrier) {
      toast.error("请填写物流公司和单号");
      return;
    }
    updateTrackingMutation.mutate({
      orderId,
      trackingNumber,
      shippingCarrier,
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "待处理",
      processing: "处理中",
      shipped: "已发货",
      delivered: "已送达",
      cancelled: "已取消",
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string; color: string }> = {
      pending: { variant: "secondary", label: "待处理", color: "text-yellow-400" },
      processing: { variant: "default", label: "处理中", color: "text-blue-400" },
      shipped: { variant: "default", label: "已发货", color: "text-purple-400" },
      delivered: { variant: "default", label: "已送达", color: "text-green-400" },
      cancelled: { variant: "outline", label: "已取消", color: "text-red-400" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-slate-400">{t("common.loading")}</div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-slate-400 mb-4">订单不存在</p>
          <Link href="/wobifa888/orders">
            <Button variant="outline">返回订单列表</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/wobifa888/orders">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">订单详情</h1>
              <p className="text-slate-400">订单号: {order.orderNumber}</p>
            </div>
          </div>
          {getStatusBadge(order.status)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧:订单商品和收货信息 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 订单商品 */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  订单商品
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
                    {item.product?.images?.[0] && (
                      <img
                        src={item.product.images[0].url}
                        alt={getLocalized(item.product.name)}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium">{item.product?.name || "商品已删除"}</p>
                      <p className="text-sm text-slate-400">
                        ${parseFloat(item.price).toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-[oklch(82%_0.18_85)] font-semibold">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 收货信息 */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  收货信息
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-slate-300">
                <p><span className="text-slate-400">收货人:</span> {order.shippingName}</p>
                <p><span className="text-slate-400">联系电话:</span> {order.shippingPhone}</p>
                <p><span className="text-slate-400">收货地址:</span> {order.shippingAddress}</p>
                {order.shippingCity && <p><span className="text-slate-400">城市:</span> {order.shippingCity}</p>}
                {order.shippingState && <p><span className="text-slate-400">州/省:</span> {order.shippingState}</p>}
                {order.shippingCountry && <p><span className="text-slate-400">国家:</span> {order.shippingCountry}</p>}
                {order.shippingPostalCode && <p><span className="text-slate-400">邮编:</span> {order.shippingPostalCode}</p>}
              </CardContent>
            </Card>
          </div>

          {/* 右侧:订单状态和物流信息 */}
          <div className="space-y-6">
            {/* 订单金额 */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  订单金额
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-slate-300">
                  <span>商品小计:</span>
                  <span>${parseFloat(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>运费:</span>
                  <span>${parseFloat(order.shipping || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>税费:</span>
                  <span>${parseFloat(order.tax || "0").toFixed(2)}</span>
                </div>
                {order.discount && parseFloat(order.discount) > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>优惠:</span>
                    <span>-${parseFloat(order.discount).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-slate-700 pt-2 flex justify-between text-[oklch(82%_0.18_85)] font-bold text-lg">
                  <span>总计:</span>
                  <span>${parseFloat(order.total).toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* 更新订单状态 */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">更新订单状态</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleUpdateStatus("processing")}
                  disabled={order.status === "processing"}
                >
                  标记为处理中
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleUpdateStatus("shipped")}
                  disabled={order.status === "shipped"}
                >
                  标记为已发货
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleUpdateStatus("delivered")}
                  disabled={order.status === "delivered"}
                >
                  标记为已送达
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-400 hover:text-red-300"
                  onClick={() => handleUpdateStatus("cancelled")}
                  disabled={order.status === "cancelled"}
                >
                  取消订单
                </Button>
              </CardContent>
            </Card>

            {/* 物流信息 */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">物流信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {order.trackingNumber ? (
                  <div className="space-y-2">
                    <p className="text-slate-400">物流公司: <span className="text-white">{order.shippingCarrier || "未设置"}</span></p>
                    <p className="text-slate-400">物流单号: <span className="text-white font-mono">{order.trackingNumber}</span></p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="shippingCarrier" className="text-slate-300">物流公司</Label>
                      <Input
                        id="shippingCarrier"
                        placeholder="例如: 顺丰速运"
                        value={shippingCarrier}
                        onChange={(e) => setShippingCarrier(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trackingNumber" className="text-slate-300">物流单号</Label>
                      <Input
                        id="trackingNumber"
                        placeholder="例如: SF1234567890"
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <Button
                      onClick={handleUpdateTracking}
                      className="w-full"
                      disabled={updateTrackingMutation.isPending}
                    >
                      {updateTrackingMutation.isPending ? "更新中..." : "添加物流信息"}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
