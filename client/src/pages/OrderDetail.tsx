import { useParams, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react";
import ShipmentTracking from "@/components/ShipmentTracking";
import { useTranslation } from "react-i18next";
import { getLocalized } from "@/lib/localized";

export default function OrderDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const [, navigate] = useLocation();
  const orderId = parseInt(params.id || "0");

  const { data: order, isLoading } = trpc.orders.getById.useQuery({ orderId });

  if (isLoading) {
    return (
      <div className="container max-w-4xl py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container max-w-4xl py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">{t("order_not_found")}</p>
            <Button onClick={() => navigate("/account")} className="mt-4">
              {t("back_to_account")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      {/* 返回按钮 */}
      <Button
        variant="ghost"
        onClick={() => navigate("/account")}
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("back_to_orders")}
      </Button>

      {/* 订单基本信息 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{t("order_details")}</CardTitle>
            <Badge className={getStatusColor(order.status)}>
              <span className="flex items-center gap-1">
                {getStatusIcon(order.status)}
                {t(`order_status_${order.status}`)}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">{t("order_number")}</p>
              <p className="font-medium">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("order_date")}</p>
              <p className="font-medium">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("total_amount")}</p>
              <p className="font-medium text-lg">
                ${parseFloat(order.total).toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("payment_method")}</p>
              <p className="font-medium">{order.paymentMethod}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 订单状态时间线 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("order_timeline")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div
                className={`mt-1 rounded-full p-2 ${
                  order.status === "pending" ||
                  order.status === "processing" ||
                  order.status === "shipped" ||
                  order.status === "delivered"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("order_placed")}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`mt-1 rounded-full p-2 ${
                  order.status === "processing" ||
                  order.status === "shipped" ||
                  order.status === "delivered"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Package className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("order_processing")}</p>
                <p className="text-sm text-muted-foreground">
                  {order.status === "processing" ||
                  order.status === "shipped" ||
                  order.status === "delivered"
                    ? t("order_being_prepared")
                    : t("waiting_for_processing")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`mt-1 rounded-full p-2 ${
                  order.status === "shipped" || order.status === "delivered"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <Truck className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("order_shipped")}</p>
                {order.shippingCarrier && order.trackingNumber ? (
                  <div className="text-sm text-muted-foreground">
                    <p>
                      {t("carrier")}: {order.shippingCarrier || ""}
                    </p>
                    <p>
                      {t("tracking_number")}: {order.trackingNumber || ""}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t("waiting_for_shipment")}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className={`mt-1 rounded-full p-2 ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{t("order_delivered")}</p>
                <p className="text-sm text-muted-foreground">
                  {order.status === "delivered"
                    ? t("order_completed")
                    : t("waiting_for_delivery")}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 物流跟踪 */}
      {(order.status === "shipped" || order.status === "delivered") && order.trackingNumber && (
        <div className="mb-6">
          <ShipmentTracking orderId={orderId} />
        </div>
      )}

      {/* 收货地址 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("shipping_address")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {typeof order.shippingAddress === 'string' ? (
              <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
            ) : (
              <>
                <p className="font-medium">{(order.shippingAddress as any).name}</p>
                {(order.shippingAddress as any).phone && (
                  <p className="text-sm text-muted-foreground">
                    {(order.shippingAddress as any).phone}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  {(order.shippingAddress as any).addressLine1}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(order.shippingAddress as any).city}
                  {(order.shippingAddress as any).state && `, ${(order.shippingAddress as any).state}`}{" "}
                  {(order.shippingAddress as any).postalCode}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(order.shippingAddress as any).country}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 订单商品 */}
      <Card>
        <CardHeader>
          <CardTitle>{t("order_items")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex gap-4">
                {item.product?.images?.[0] && (
                  <img
                    src={item.product.images[0].imageUrl}
                    alt={getLocalized(item.product.name)}
                    className="h-20 w-20 rounded-md object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{getLocalized(item.product?.name) || t("product_unavailable")}</p>
                  {(item.productSku || item.product?.sku) && (
                    <p className="text-xs text-muted-foreground font-mono tracking-wide">
                      SKU: {item.productSku || item.product?.sku}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    {t("quantity")}: {item.quantity}
                  </p>
                  <p className="text-sm font-medium">
                    ${parseFloat(item.price).toFixed(2)} × {item.quantity} = $
                    {(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("subtotal")}</span>
                <span>${parseFloat(order.subtotal || "0").toFixed(2)}</span>
              </div>
              {parseFloat(order.discount || "0") > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("discount")}</span>
                  <span className="text-red-600">
                    -${parseFloat(order.discount || "0").toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{t("shipping")}</span>
                <span>${parseFloat(order.shipping || "0").toFixed(2)}</span>
              </div>
              {parseFloat(order.tax || "0") > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("tax")}</span>
                  <span>${parseFloat(order.tax || "0").toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span>${parseFloat(order.total || "0").toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
