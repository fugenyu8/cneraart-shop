import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";

export default function Checkout() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  // 收货信息表单
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "United States",
  });

  // 获取购物车
  const { data: cartItems, isLoading: cartLoading } = trpc.cart.get.useQuery(undefined, {
    enabled: !!user,
  });

  // TODO: 获取用户地址
  // const { data: addresses } = trpc.addresses.list.useQuery(undefined, {
  //   enabled: !!user,
  // });
  const addresses = [] as any;

  // 创建订单mutation
  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success("订单创建成功");
      // TODO: 跳转到支付页面
      console.log("Order created:", data);
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error.message || "订单创建失败");
    },
  });

  // 未登录跳转到登录页
  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = getLoginUrl();
    }
  }, [user, authLoading]);

  // 使用默认地址
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find((addr: any) => addr.isDefault) || addresses[0];
      if (defaultAddress) {
        setShippingInfo({
          name: defaultAddress.fullName,
          phone: defaultAddress.phone || "",
          addressLine1: defaultAddress.addressLine1,
          city: defaultAddress.city,
          state: defaultAddress.state || "",
          postalCode: defaultAddress.postalCode,
          country: defaultAddress.country,
        });
      }
    }
  }, [addresses]);

  // 计算订单金额
  const calculateTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return { subtotal: 0, shipping: 0, tax: 0, total: 0 };
    }

    const subtotal = cartItems.reduce((sum: number, item: any) => {
      const price = item.product.salePrice || item.product.regularPrice;
      return sum + parseFloat(price) * item.quantity;
    }, 0);

    const shipping = subtotal >= 100 ? 0 : 10; // 满$100免运费
    const tax = subtotal * 0.08; // 8%税率
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const { subtotal, shipping, tax, total } = calculateTotals();

  // 提交订单
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证
    if (!shippingInfo.name || !shippingInfo.addressLine1 || !shippingInfo.city || !shippingInfo.postalCode) {
      toast.error("请填写完整的收货信息");
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error("购物车为空");
      return;
    }

    // 创建订单
    createOrderMutation.mutate({
      items: cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: parseFloat(item.product.salePrice || item.product.regularPrice),
      })),
      subtotal,
      discount: 0,
      shipping,
      tax,
      total,
      shippingAddress: {
        name: shippingInfo.name,
        phone: shippingInfo.phone,
        addressLine1: shippingInfo.addressLine1,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
      },
      paymentMethod: "paypal",
    });
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[oklch(82%_0.18_85)]" />
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">购物车为空</h1>
            <p className="text-slate-400 mb-8">请先添加商品到购物车</p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900"
            >
              继续购物
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
      <div className="container mx-auto px-4 py-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          返回购物车
        </Button>

        <h1 className="text-4xl font-bold text-white mb-8">{t("checkout.title")}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 收货信息 */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">{t("checkout.shipping_info")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="name" className="text-slate-300">
                        收件人姓名 *
                      </Label>
                      <Input
                        id="name"
                        value={shippingInfo.name}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, name: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="phone" className="text-slate-300">
                        联系电话
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label htmlFor="addressLine1" className="text-slate-300">
                        街道地址 *
                      </Label>
                      <Input
                        id="addressLine1"
                        value={shippingInfo.addressLine1}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, addressLine1: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-slate-300">
                        城市 *
                      </Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="state" className="text-slate-300">
                        州/省
                      </Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <Label htmlFor="postalCode" className="text-slate-300">
                        邮政编码 *
                      </Label>
                      <Input
                        id="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="country" className="text-slate-300">
                        国家 *
                      </Label>
                      <Input
                        id="country"
                        value={shippingInfo.country}
                        onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 订单摘要 */}
            <div>
              <Card className="bg-slate-900/50 border-slate-800 sticky top-4">
                <CardHeader>
                  <CardTitle className="text-white">{t("checkout.order_summary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 商品列表 */}
                  <div className="space-y-3">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex gap-3">
                        {item.product.images?.[0] && (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.name}
                            className="w-16 h-16 rounded object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{item.product.name}</p>
                          <p className="text-slate-400 text-sm">数量: {item.quantity}</p>
                          <p className="text-[oklch(82%_0.18_85)] text-sm font-semibold">
                            ${(parseFloat(item.product.salePrice || item.product.regularPrice) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-slate-800" />

                  {/* 金额明细 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>小计</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>运费</span>
                      <span>{shipping === 0 ? "免费" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>税费</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="flex justify-between text-white text-lg font-bold">
                      <span>总计</span>
                      <span className="text-[oklch(82%_0.18_85)]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <p className="text-sm text-slate-400">
                      再购买 ${(100 - subtotal).toFixed(2)} 即可享受免运费
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={createOrderMutation.isPending}
                    className="w-full bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900"
                  >
                    {createOrderMutation.isPending && (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    {t("checkout.place_order")}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
