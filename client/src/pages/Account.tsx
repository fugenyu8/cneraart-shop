import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, Package, MapPin, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getLocalized } from "@/lib/localized";

export default function Account() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  // 获取用户订单
  const { data: orders, isLoading: ordersLoading } = trpc.orders.list.useQuery(undefined, {
    enabled: !!user,
  });

  // 退出登录
  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/";
    },
  });

  // 未登录跳转到登录页
  useEffect(() => {
    if (!authLoading && !user) {
      const loginUrl = getLoginUrl();
      if (loginUrl) {
        window.location.href = loginUrl;
      }
    }
  }, [user, authLoading]);

  // 未登录且无OAuth配置时显示提示
  if (!authLoading && !user) {
    const loginUrl = getLoginUrl();
    if (!loginUrl) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="container mx-auto px-4 py-16 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Please Sign In</h1>
            <p className="text-slate-400 mb-6">You need to sign in to view your account.</p>
            <Button onClick={() => navigate("/")} className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900">
              Back to Home
            </Button>
          </div>
        </div>
      );
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; key: string }> = {
      pending: { variant: "secondary", key: "status.pending" },
      processing: { variant: "default", key: "status.processing" },
      shipped: { variant: "default", key: "status.shipped" },
      delivered: { variant: "default", key: "status.delivered" },
      cancelled: { variant: "outline", key: "status.cancelled" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{t(config.key)}</Badge>;
  };

  if (authLoading || ordersLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-white">{t("account.my_account")}</h1>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-slate-400 hover:text-white"
            >
              {t("nav.home")}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 侧边栏 */}
            <div className="space-y-4">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[oklch(82%_0.18_85)] to-[oklch(72%_0.18_85)] rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-slate-900" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{user?.name}</p>
                      <p className="text-sm text-slate-400">{user?.email}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="pt-6 space-y-2">
                  <Link href="/account">
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50 text-white hover:bg-slate-800 transition-colors">
                      <Package className="w-5 h-5" />
                      {t("account.orders")}
                    </a>
                  </Link>
                  <Link href="/account/addresses">
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors">
                      <MapPin className="w-5 h-5" />
                      {t("account.addresses")}
                    </a>
                  </Link>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800/50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    {t("nav.logout")}
                  </button>
                </CardContent>
              </Card>
            </div>

            {/* 主内容区 */}
            <div className="md:col-span-2">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">{t("account.orders")}</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div
                          key={order.id}
                          className="border border-slate-800 rounded-lg p-4 hover:border-slate-700 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-mono text-white text-sm">{order.orderNumber}</p>
                              <p className="text-slate-400 text-sm">
                                {new Date(order.createdAt).toLocaleString("zh-CN")}
                              </p>
                            </div>
                            {getStatusBadge(order.status)}
                          </div>

                          <div className="space-y-2 mb-3">
                            {order.items?.map((item: any) => (
                              <div key={item.id} className="flex gap-3">
                                {item.product?.images?.[0] && (
                                  <img
                                    src={item.product.images[0].url}
                                    alt={getLocalized(item.product.name)}
                                    className="w-16 h-16 rounded object-cover"
                                  />
                                )}
                                <div className="flex-1">
                                  <p className="text-white text-sm font-medium">
                                    {getLocalized(item.product?.name) || t("account.product_unavailable")}
                                  </p>
                                  <p className="text-slate-400 text-sm">
                                    {t("account.quantity")}: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                            <p className="text-slate-400 text-sm">
                              {t("cart.item_total")}: {order.items?.length || 0}
                            </p>
                            <div className="flex items-center gap-4">
                              <p className="text-[oklch(82%_0.18_85)] font-semibold">
                                {t("account.total")}: ${parseFloat(order.total).toFixed(2)}
                              </p>
                              <Link href={`/orders/${order.id}`}>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                >
                                  {t("account.view_details")}
                                </Button>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                      <p className="text-slate-400 mb-4">{t("cart.empty")}</p>
                      <Link href="/products">
                        <Button className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900">
                          {t("cart.browse_products")}
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
