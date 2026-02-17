import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package, Truck, MapPin, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ShipmentTrackingProps {
  orderId: number;
}

export default function ShipmentTracking({ orderId }: ShipmentTrackingProps) {
  const { t } = useTranslation();
  const { data: tracking, isLoading } = trpc.orders.getTracking.useQuery({ orderId });

  if (isLoading) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t("shipment_tracking")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!tracking || !tracking.order.trackingNumber) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Truck className="h-5 w-5" />
            {t("shipment_tracking")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-slate-400">
            <AlertCircle className="h-5 w-5" />
            <p>{t("tracking_not_available")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case "picked_up":
      case "shipped":
        return <Package className="h-4 w-4" />;
      case "in_transit":
        return <Truck className="h-4 w-4" />;
      case "out_for_delivery":
        return <MapPin className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "out_for_delivery":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "in_transit":
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Truck className="h-5 w-5" />
          {t("shipment_tracking")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 物流基本信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-800/50 rounded-lg">
          <div>
            <p className="text-sm text-slate-400 mb-1">{t("carrier")}</p>
            <p className="text-white font-medium">{tracking.order.shippingCarrier || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-1">{t("tracking_number")}</p>
            <p className="text-white font-medium font-mono text-sm">
              {tracking.order.trackingNumber}
            </p>
          </div>
          {tracking.order.shippedAt && (
            <div className="md:col-span-2">
              <p className="text-sm text-slate-400 mb-1">{t("shipped_date")}</p>
              <p className="text-white font-medium">
                {new Date(tracking.order.shippedAt).toLocaleString()}
              </p>
            </div>
          )}
        </div>

        <Separator className="bg-slate-800" />

        {/* 物流时间轴 */}
        <div>
          <h3 className="text-white font-semibold mb-4">{t("tracking_history")}</h3>
          {tracking.events && tracking.events.length > 0 ? (
            <div className="space-y-4">
              {tracking.events.map((event: any, index: number) => (
                <div key={event.id} className="flex gap-4">
                  {/* 时间轴线 */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-full p-2 border ${getEventColor(event.eventType)}`}
                    >
                      {getEventIcon(event.eventType)}
                    </div>
                    {index < tracking.events.length - 1 && (
                      <div className="w-0.5 h-full min-h-[40px] bg-slate-700 my-1"></div>
                    )}
                  </div>

                  {/* 事件详情 */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-white font-medium">{event.eventDescription}</p>
                      <Badge variant="outline" className="text-xs text-slate-400 border-slate-700 whitespace-nowrap">
                        {new Date(event.eventTime).toLocaleString()}
                      </Badge>
                    </div>
                    {event.location && (
                      <p className="text-sm text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>{t("no_tracking_events")}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
