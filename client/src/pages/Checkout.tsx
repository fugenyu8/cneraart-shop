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
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

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

  // 优惠券状态
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");

  // 验证优惠券
  const validateCouponMutation = trpc.coupons.validate.useMutation({
    onSuccess: (data) => {
      if (data.valid) {
        setAppliedCoupon({ code: couponCode, discount: data.discount || 0 });
        setCouponError("");
        toast.success(t('checkout.coupon_success'));
      } else {
        setAppliedCoupon(null);
        setCouponError(data.error || "优惠券无效");
        toast.error(data.error || t('checkout.coupon_invalid'));
      }
    },
    onError: (error: any) => {
      setAppliedCoupon(null);
      setCouponError(error.message || "验证失败");
      toast.error(error.message || t('checkout.coupon_error'));
    },
  });

  // 获取购物车
  const { data: cartItems, isLoading: cartLoading } = trpc.cart.get.useQuery(undefined, {
    enabled: !!user,
  });

  // 获取用户地址
  const { data: addresses } = trpc.addresses.list.useQuery(undefined, {
    enabled: !!user,
  });

  // 创建订单mutation
  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success(t('checkout.order_success'));
      // TODO: 跳转到支付页面
      console.log("Order created:", data);
      navigate("/");
    },
    onError: (error: any) => {
      toast.error(error.message || t('checkout.order_error'));
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
      return { subtotal: 0, shipping: 0, tax: 0, discount: 0, total: 0 };
    }

    const subtotal = cartItems.reduce((sum: number, item: any) => {
      const price = item.product.salePrice || item.product.regularPrice;
      return sum + parseFloat(price) * item.quantity;
    }, 0);

    const shipping = subtotal >= 100 ? 0 : 10; // 满$100免运费
    
    // 计算优惠
    let discount = 0;
    if (appliedCoupon && appliedCoupon.discount) {
      discount = appliedCoupon.discount;
      // 不能超过小计
      discount = Math.min(discount, subtotal);
    }
    
    const tax = (subtotal - discount) * 0.08; // 8%税率
    const total = subtotal - discount + shipping + tax;

    return { subtotal, shipping, tax, discount, total };
  };

  const { subtotal, shipping, tax, discount, total } = calculateTotals();

  // 应用优惠券
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error(t('checkout.coupon_required'));
      return;
    }
    validateCouponMutation.mutate({ code: couponCode, cartTotal: subtotal });
  };

  // 移除优惠券
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success(t('checkout.coupon_removed'));
  };

  // PayPal创建订单
  const createPayPalOrder = async (data: any, actions: any) => {
    // 验证
    if (!shippingInfo.name || !shippingInfo.addressLine1 || !shippingInfo.city || !shippingInfo.postalCode) {
      toast.error(t('checkout.shipping_required'));
      throw new Error('Shipping information required');
    }

    if (!cartItems || cartItems.length === 0) {
      toast.error(t('checkout.cart_empty'));
      throw new Error('Cart is empty');
    }

    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: total.toFixed(2),
            breakdown: {
              item_total: { currency_code: "USD", value: subtotal.toFixed(2) },
              shipping: { currency_code: "USD", value: shipping.toFixed(2) },
              tax_total: { currency_code: "USD", value: tax.toFixed(2) },
              discount: { currency_code: "USD", value: discount.toFixed(2) },
            },
          },
          items: cartItems.map((item: any) => ({
            name: item.product.name,
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: "USD",
              value: parseFloat(item.product.salePrice || item.product.regularPrice).toFixed(2),
            },
          })),
        },
      ],
    });
  };

  // PayPal支付成功
  const onPayPalApprove = async (data: any, actions: any) => {
    const details = await actions.order.capture();
    console.log('PayPal payment completed:', details);

    // 创建订单
    createOrderMutation.mutate({
      items: cartItems!.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: parseFloat(item.product.salePrice || item.product.regularPrice),
      })),
      subtotal,
      discount,
      shipping,
      tax,
      total,
      couponCode: appliedCoupon?.code,
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

  // PayPal支付错误
  const onPayPalError = (err: any) => {
    console.error('PayPal payment error:', err);
    toast.error(t('checkout.payment_error'));
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
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">{t('checkout.cart_empty')}</h1>
            <p className="text-slate-400 mb-8">{t('checkout.cart_empty_desc')}</p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900"
            >
              {t('checkout.continue_shopping')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      
      <div className="container mx-auto px-4 py-8 md:py-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('checkout.back_to_cart')}
        </Button>

        <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 md:mb-8">{t("checkout.title")}</h1>

        <div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* 收货信息 */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-white">{t("checkout.shipping_info")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
                  {/* 地址选择 */}
                  {addresses && addresses.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-slate-300 text-sm md:text-base">{t('checkout.select_address')}</Label>
                      <select
                        className="w-full bg-slate-800 border-slate-700 text-white rounded-md px-3 py-2.5 md:py-2 text-base md:text-sm"
                        onChange={(e) => {
                          const selectedAddress = addresses.find((addr: any) => addr.id === parseInt(e.target.value));
                          if (selectedAddress) {
                            setShippingInfo({
                              name: selectedAddress.fullName,
                              phone: selectedAddress.phone || "",
                              addressLine1: selectedAddress.addressLine1,
                              city: selectedAddress.city,
                              state: selectedAddress.state || "",
                              postalCode: selectedAddress.postalCode,
                              country: selectedAddress.country,
                            });
                          }
                        }}
                      >
                        <option value="">{t('checkout.select_saved_address')}</option>
                        {addresses.map((addr: any) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.fullName} - {addr.addressLine1}, {addr.city}
                            {addr.isDefault && ` (${t('checkout.default_address')})`}
                          </option>
                        ))}
                      </select>
                      <Separator className="bg-slate-700 my-4" />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="name" className="text-slate-300">
                        {t('checkout.recipient_name')} *
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
                        {t('checkout.phone')}
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
                        {t('checkout.address_line1')} *
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
                        {t('checkout.city')} *
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
                        {t('checkout.state')}
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
                        {t('checkout.postal_code')} *
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
                        {t('checkout.country')} *
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
              <Card className="bg-slate-900/50 border-slate-800 lg:sticky lg:top-4">
                <CardHeader>
                  <CardTitle className="text-white">{t("checkout.order_summary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
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
                          <p className="text-slate-400 text-sm">{t('checkout.quantity_label')}: {item.quantity}</p>
                          <p className="text-[oklch(82%_0.18_85)] text-sm font-semibold">
                            ${(parseFloat(item.product.salePrice || item.product.regularPrice) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-slate-800" />

                  {/* 优惠券 */}
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm md:text-base">{t('checkout.coupon')}</Label>
                    {!appliedCoupon ? (
                      <div className="flex gap-2">
                        <Input
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          placeholder={t('checkout.coupon_placeholder')}
                          className="bg-slate-800 border-slate-700 text-white text-base md:text-sm h-11 md:h-10"
                        />
                        <Button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={validateCouponMutation.isPending}
                          variant="outline"
                          className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 h-11 md:h-10 px-4 md:px-3"
                        >
                          {validateCouponMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            t('checkout.apply_coupon')
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-green-900/20 border border-green-700/50 rounded-md px-3 py-2">
                        <span className="text-green-400 text-sm font-medium">{appliedCoupon.code}</span>
                        <Button
                          type="button"
                          onClick={handleRemoveCoupon}
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white h-auto p-1"
                        >
                          {t('checkout.remove_coupon')}
                        </Button>
                      </div>
                    )}
                    {couponError && (
                      <p className="text-red-400 text-sm">{couponError}</p>
                    )}
                  </div>

                  <Separator className="bg-slate-800" />

                  {/* 金额明细 */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-300">
                      <span>{t('checkout.subtotal')}</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>{t('checkout.discount')}</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-300">
                      <span>{t('checkout.shipping')}</span>
                      <span>{shipping === 0 ? t('checkout.free_shipping') : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{t('checkout.tax')}</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <Separator className="bg-slate-800" />
                    <div className="flex justify-between text-white text-lg font-bold">
                      <span>{t('checkout.total')}</span>
                      <span className="text-[oklch(82%_0.18_85)]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {shipping > 0 && (
                    <p className="text-sm text-slate-400">
                      {t('checkout.shipping_note', { amount: (100 - subtotal).toFixed(2) })}
                    </p>
                  )}

                  {/* PayPal按钮 */}
                  <div className="w-full">
                    <PayPalScriptProvider
                      options={{
                        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
                        currency: "USD",
                        intent: "capture",
                        // 启用Apple Pay和Google Pay
                        components: "buttons,applepay,googlepay",
                        "enable-funding": "venmo,paylater",
                        "disable-funding": "",
                      }}
                    >
                      <PayPalButtons
                        style={{ 
                          layout: "vertical", 
                          label: "paypal",
                          height: 48,
                          tagline: false,
                        }}
                        createOrder={createPayPalOrder}
                        onApprove={onPayPalApprove}
                        onError={onPayPalError}
                        disabled={createOrderMutation.isPending || !cartItems || cartItems.length === 0}
                        // 启用所有支付方式
                        fundingSource={undefined}
                      />
                    </PayPalScriptProvider>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
