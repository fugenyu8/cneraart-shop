import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Loader2,
  ArrowLeft,
  Wallet,
  CheckCircle2,
  Building2,
  Copy,
  AlertCircle,
  Tag,
} from "lucide-react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { getLocalized } from "@/lib/localized";
import { PaymentProofUpload } from "@/components/PaymentProofUpload";

const ALIPAY_QR_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663348895853/8WruFPRUxPMzzwD4ZeeUDg/alipay-qr_ed756fd8.jpg";
const WECHAT_QR_URL =
  "https://d2xsxph8kpxj0f.cloudfront.net/310519663348895853/8WruFPRUxPMzzwD4ZeeUDg/wechat-qr_f4763b7f.jpg";

// 社交证明计数器组件
function DeliveredCountBadge() {
  const { t } = useTranslation();
  const { data } = trpc.stats.deliveredCount.useQuery();
  const count = data?.count ?? 1247;
  const countFormatted = count.toLocaleString();
  return (
    <div className="flex items-center gap-2.5 bg-amber-950/30 border border-amber-800/40 rounded-xl p-3 mt-2">
      <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center shrink-0">
        <span className="text-base">✨</span>
      </div>
      <div>
        <p className="text-xs font-semibold text-amber-300">
          {t('checkout.delivered_count', `${countFormatted}+ dharma objects delivered worldwide`).replace('{{count}}', countFormatted)}
        </p>
        <p className="text-xs text-amber-600/80 mt-0.5">
          {t('checkout.delivered_subtitle', `${countFormatted}+ devotees have taken home sacred objects · Blessed at Wutai Mountain`).replace('{{count}}', countFormatted)}
        </p>
      </div>
    </div>
  );
}

// ========== 银行转账信息组件 ==========
function BankTransferInfo({
  orderNumber,
  total,
}: {
  orderId: number | null;
  orderNumber: string | null;
  total: number;
}) {
  const { t } = useTranslation();

  const bankAccounts = [
    {
      bank: "Bank of China (中国银行)",
      accountNumber: "4002920200111432",
      accountName: "Fu Genyu (付根玉)",
      note: "Visa Card · Accepts foreign currency (USD / EUR)",
    },
    {
      bank: "China Merchants Bank (招商银行)",
      accountNumber: "5342 9302 2001 9578",
      accountName: "Fu Genyu (付根玉)",
      note: "Mastercard · Accepts foreign currency (USD / EUR)",
    },
  ];

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} ${t("checkout.copied")}`);
    });
  };

  return (
    <div className="space-y-4">
      {/* 提示信息 */}
      <div className="flex items-start gap-3 bg-amber-900/20 border border-amber-700/50 rounded-lg p-4">
        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-200/90 space-y-1">
          <p className="font-medium">{t("checkout.bank_transfer_notice")}</p>
          <p className="text-amber-200/70">{t("checkout.bank_transfer_notice_desc")}</p>
        </div>
      </div>

      {/* 汇款金额 */}
      <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-1">{t("checkout.transfer_amount")}</p>
          <p className="text-3xl font-bold text-[oklch(82%_0.18_85)]">
            ${total.toFixed(2)} USD
          </p>
          <p className="text-xs text-green-400 mt-1">✓ 10% direct payment discount applied</p>
        </div>
      </div>

      {/* 两个银行账户 */}
      {bankAccounts.map((acct, i) => (
        <div key={i} className="bg-slate-800/80 rounded-lg border border-slate-700 divide-y divide-slate-700">
          <div className="px-4 py-3 bg-slate-700/40 rounded-t-lg">
            <p className="text-xs font-semibold text-[oklch(82%_0.18_85)]">{acct.bank}</p>
            <p className="text-xs text-slate-400 mt-0.5">{acct.note}</p>
          </div>
          {[
            { label: t("checkout.account_number"), value: acct.accountNumber },
            { label: t("checkout.account_name"), value: acct.accountName },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-3 gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                <p className="text-sm text-slate-200 break-all font-mono">{item.value}</p>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(item.value, item.label)}
                className="shrink-0 p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title={t("checkout.copy")}
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ))}

      {/* 付款备注 */}
      <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
        <p className="text-xs text-slate-500 mb-1">{t("checkout.payment_memo")}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-[oklch(82%_0.18_85)] font-mono break-all">
            {orderNumber || `ORD-${Date.now()}`}
          </p>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(orderNumber || `ORD-${Date.now()}`, t("checkout.payment_memo"))
            }
            className="shrink-0 p-1.5 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">{t("checkout.memo_format_hint")}</p>
      </div>

       {/* WhatsApp 联系方式 */}
      <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/40 rounded-lg p-3">
        <div className="text-sm text-green-200/90">
          <p className="font-medium mb-0.5">After transfer, confirm via WhatsApp</p>
          <a
            href="https://wa.me/8618310686772"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline font-mono"
          >
            +86 183 1068 6772
          </a>
          <span className="text-green-200/60 ml-2 text-xs">(Send screenshot + order number)</span>
        </div>
      </div>
      <p className="text-xs text-slate-500 text-center">{t("checkout.swift_remark")}</p>
    </div>
  );
}
// ========== 支付宝信息组件 ==========
function AlipayInfo({
  orderNumber,
  total,
}: {
  orderId: number | null;
  orderNumber: string | null;
  total: number;
}) {
  const { t } = useTranslation();
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} ${t("checkout.copied")}`);
    });
  };

  return (
    <div className="space-y-4">
      {/* 提示信息 */}
      <div className="flex items-start gap-3 bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-200/90 space-y-1">
          <p className="font-medium">{t("checkout.alipay_notice")}</p>
          <p className="text-blue-200/70">{t("checkout.alipay_notice_desc")}</p>
        </div>
      </div>

      {/* 转账金额 */}
      <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-1">{t("checkout.transfer_amount")}</p>
          <p className="text-3xl font-bold text-[#1677FF]">${total.toFixed(2)} USD</p>
          <p className="text-xs text-green-400 mt-1">✓ 10% direct payment discount applied</p>
        </div>
      </div>

      {/* 支付宝收款码 */}
      <div className="bg-slate-800/80 rounded-lg border border-slate-700 p-4">
        <p className="text-xs text-slate-500 mb-3 text-center">
          {t("checkout.alipay_scan_qr") || "Open Alipay → Scan QR Code"}
        </p>
        <div className="flex justify-center">
          <img
            src={ALIPAY_QR_URL}
            alt="Alipay QR Code"
            className="w-52 h-52 object-contain rounded-lg border border-slate-600"
          />
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">根玉(**玉) · Fu Genyu</p>
      </div>

      {/* 付款备注 */}
      <div className="bg-slate-800/80 rounded-lg border border-slate-700 divide-y divide-slate-700">
        <div className="flex items-center justify-between px-4 py-4 gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 mb-1">{t("checkout.payment_memo")}</p>
            <p className="text-sm text-[oklch(82%_0.18_85)] font-mono break-all">
              {orderNumber || `ORD-${Date.now()}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(orderNumber || `ORD-${Date.now()}`, t("checkout.payment_memo"))
            }
            className="shrink-0 p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 操作步骤 */}
      <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
        <p className="text-sm text-slate-300 font-medium mb-3">
          {t("checkout.alipay_steps_title")}
        </p>
        <ol className="space-y-2 text-sm text-slate-400">
          {[
            t("checkout.alipay_step1"),
            t("checkout.alipay_step2"),
            t("checkout.alipay_step3"),
          ].map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#1677FF]/20 text-[#1677FF] text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
         </ol>
      </div>
      {/* WhatsApp 联系方式 */}
      <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/40 rounded-lg p-3">
        <div className="text-sm text-green-200/90">
          <p className="font-medium mb-0.5">After transfer, confirm via WhatsApp</p>
          <a
            href="https://wa.me/8618310686772"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 underline font-mono"
          >
            +86 183 1068 6772
          </a>
          <span className="text-green-200/60 ml-2 text-xs">(Send screenshot + order number)</span>
        </div>
      </div>
    </div>
  );
}
// ========== 微信支付信息组件 ==========
function WechatPayInfo({
  orderNumber,
  total,
}: {
  orderId: number | null;
  orderNumber: string | null;
  total: number;
}) {
  const { t } = useTranslation();
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} ${t("checkout.copied")}`);
    });
  };

  return (
    <div className="space-y-4">
      {/* 提示信息 */}
      <div className="flex items-start gap-3 bg-green-900/20 border border-green-700/50 rounded-lg p-4">
        <AlertCircle className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
        <div className="text-sm text-green-200/90 space-y-1">
          <p className="font-medium">WeChat Pay · 微信支付</p>
          <p className="text-green-200/70">
            Scan the QR code with WeChat to pay. After payment, please send a screenshot to our WhatsApp to confirm your order.
          </p>
        </div>
      </div>

      {/* 转账金额 */}
      <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
        <div className="text-center">
          <p className="text-slate-400 text-sm mb-1">{t("checkout.transfer_amount")}</p>
          <p className="text-3xl font-bold text-[#07C160]">${total.toFixed(2)} USD</p>
          <p className="text-xs text-green-400 mt-1">✓ 10% direct payment discount applied</p>
        </div>
      </div>

      {/* 微信收款码 */}
      <div className="bg-slate-800/80 rounded-lg border border-slate-700 p-4">
        <p className="text-xs text-slate-500 mb-3 text-center">
          Open WeChat → Scan QR Code (扫一扫)
        </p>
        <div className="flex justify-center">
          <img
            src={WECHAT_QR_URL}
            alt="WeChat Pay QR Code"
            className="w-52 h-52 object-contain rounded-lg border border-slate-600"
          />
        </div>
        <p className="text-xs text-slate-400 text-center mt-2">**玉 (付根玉) · Fu Genyu</p>
      </div>

      {/* 付款备注 */}
      <div className="bg-slate-800/80 rounded-lg border border-slate-700 divide-y divide-slate-700">
        <div className="flex items-center justify-between px-4 py-4 gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-slate-500 mb-1">{t("checkout.payment_memo")}</p>
            <p className="text-sm text-[oklch(82%_0.18_85)] font-mono break-all">
              {orderNumber || `ORD-${Date.now()}`}
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              copyToClipboard(orderNumber || `ORD-${Date.now()}`, t("checkout.payment_memo"))
            }
            className="shrink-0 p-2 rounded-md hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* 操作步骤 */}
      <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700">
        <p className="text-sm text-slate-300 font-medium mb-3">How to pay:</p>
        <ol className="space-y-2 text-sm text-slate-400">
          {[
            "Open WeChat and tap the Scan icon (扫一扫)",
            `Scan the QR code above and pay $${total.toFixed(2)} USD`,
            `Add order number "${orderNumber || "ORD-XXXX"}" in the payment note`,
            <span>Send payment screenshot to our WhatsApp: <a href="https://wa.me/8618310686772" target="_blank" rel="noopener noreferrer" className="text-green-400 underline">+86 183 1068 6772</a></span>,
          ].map((step, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-[#07C160]/20 text-[#07C160] text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ========== 主 Checkout 组件 ==========
export default function Checkout() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading } = useAuth();

  // 支付方式选择
  type PaymentMethodType = "paypal" | "wechat" | "alipay" | "bank_transfer";
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentMethodType>("wechat");
  const [createdOrderId, setCreatedOrderId] = useState<number | null>(null);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);

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
  const [customerNote, setCustomerNote] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [couponError, setCouponError] = useState("");

  // 验证优惠券
  const validateCouponMutation = trpc.coupons.validate.useMutation({
    onSuccess: (data) => {
      if (data.valid) {
        setAppliedCoupon({ code: couponCode, discount: data.discount || 0 });
        setCouponError("");
        toast.success(t("checkout.coupon_success"));
      } else {
        setAppliedCoupon(null);
        setCouponError(data.error || "Invalid coupon");
        toast.error(data.error || t("checkout.coupon_invalid"));
      }
    },
    onError: (error: any) => {
      setAppliedCoupon(null);
      setCouponError(error.message || "Validation failed");
      toast.error(error.message || t("checkout.coupon_error"));
    },
  });

  // 获取购物车
  const { data: cartItems, isLoading: cartLoading } = trpc.cart.get.useQuery(
    undefined,
    { enabled: !!user }
  );

  // 获取用户地址
  const { data: addresses } = trpc.addresses.list.useQuery(undefined, {
    enabled: !!user,
  });

  // 创建订单 mutation（直接付款：先创建订单，再展示收款信息）
  const createOrderMutation = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      setCreatedOrderId(Number(data.orderId));
      setCreatedOrderNumber(data.orderNumber);
      toast.success(t("checkout.order_created_pending"));
    },
    onError: (error: any) => {
      toast.error(error.message || t("checkout.order_error"));
    },
  });

  // PayPal 专用的创建订单 mutation
  const createOrderForPayPal = trpc.orders.create.useMutation({
    onSuccess: (data) => {
      toast.success(t("checkout.order_success"));
      navigate(`/orders/${data.orderId}`);
    },
    onError: (error: any) => {
      toast.error(error.message || t("checkout.order_error"));
    },
  });

  // 未登录跳转到登录页
  useEffect(() => {
    if (!authLoading && !user) {
      // 未登录时跳转到登录页，并保存返回路径
      navigate("/login?returnTo=/checkout");
    }
  }, [user, authLoading]);

  // 使用默认地址
  useEffect(() => {
    if (addresses && addresses.length > 0) {
      const defaultAddress =
        addresses.find((addr: any) => addr.isDefault) || addresses[0];
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

  // 是否为直接付款方式（享10%折扣）
  const isDirectPayment =
    selectedPayment === "wechat" ||
    selectedPayment === "alipay" ||
    selectedPayment === "bank_transfer";

  // 计算订单金额
  const calculateTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return { subtotal: 0, shipping: 0, tax: 0, discount: 0, directDiscount: 0, total: 0 };
    }
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      const price = item.product.salePrice || item.product.regularPrice;
      return sum + parseFloat(price) * item.quantity;
    }, 0);
    const shipping = 0;

    // 优惠券折扣
    let couponDiscount = 0;
    if (appliedCoupon && appliedCoupon.discount) {
      couponDiscount = Math.min(appliedCoupon.discount, subtotal);
    }

    // 直接付款10%折扣（在优惠券折扣后的余额上再打9折）
    let directDiscount = 0;
    if (isDirectPayment) {
      directDiscount = parseFloat(((subtotal - couponDiscount) * 0.10).toFixed(2));
    }

    const discount = couponDiscount + directDiscount;
    const tax = 0; // 税费免除
    const total = subtotal - discount + shipping + tax;
    return { subtotal, shipping, tax, discount, directDiscount, total };
  };

  const { subtotal, shipping, tax, discount, directDiscount, total } = calculateTotals();

  // 应用优惠券
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error(t("checkout.coupon_required"));
      return;
    }
    validateCouponMutation.mutate({ code: couponCode, cartTotal: subtotal });
  };

  // 移除优惠券
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success(t("checkout.coupon_removed"));
  };

  // 验证收货信息
  const validateShipping = () => {
    if (
      !shippingInfo.name ||
      !shippingInfo.addressLine1 ||
      !shippingInfo.city ||
      !shippingInfo.postalCode
    ) {
      toast.error(t("checkout.shipping_required"));
      return false;
    }
    return true;
  };

  // 构建订单数据
  const buildOrderData = (paymentMethod: string) => ({
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
    paymentMethod,
    customerNote: customerNote.trim() || undefined,
  });

  // 直接付款：先创建订单
  const handleOfflineCheckout = () => {
    if (!validateShipping() || !cartItems || cartItems.length === 0) return;
    if (createdOrderId) return;
    createOrderMutation.mutate(buildOrderData(selectedPayment));
  };

  // PayPal 创建订单
  const createPayPalOrder = async (_data: any, actions: any) => {
    if (!validateShipping()) throw new Error("Shipping information required");
    if (!cartItems || cartItems.length === 0) {
      toast.error(t("checkout.cart_empty"));
      throw new Error("Cart is empty");
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
            name: getLocalized(item.product.name),
            quantity: item.quantity.toString(),
            unit_amount: {
              currency_code: "USD",
              value: parseFloat(
                item.product.salePrice || item.product.regularPrice
              ).toFixed(2),
            },
          })),
        },
      ],
    });
  };

  // PayPal 支付成功
  const onPayPalApprove = async (_data: any, actions: any) => {
    const details = await actions.order.capture();
    console.log("PayPal payment completed:", details);
    createOrderForPayPal.mutate(buildOrderData("paypal"));
  };

  // PayPal 支付错误
  const onPayPalError = (err: any) => {
    console.error("PayPal payment error:", err);
    toast.error(t("checkout.payment_error"));
  };

  if (authLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
        </div>
      </div>
    );
  }

  // 未登录时显示加载状态（useEffect会跳转）
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">
              {t("checkout.cart_empty")}
            </h1>
            <p className="text-slate-400 mb-8">{t("checkout.cart_empty_desc")}</p>
            <Button
              onClick={() => navigate("/products")}
              className="bg-[oklch(82%_0.18_85)] hover:bg-[oklch(82%_0.18_85)]/90 text-slate-900"
            >
              {t("checkout.continue_shopping")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 支付方式选项
  const paymentMethods: {
    id: PaymentMethodType;
    label: string;
    icon: React.ReactNode;
    description: string;
    badge?: string;
    hidden?: boolean;
  }[] = [
    {
      id: "paypal",
      hidden: true,
      label: "PayPal",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z" />
        </svg>
      ),
      description: t("checkout.paypal_desc"),
    },
    {
      id: "wechat",
      label: "WeChat Pay",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.295.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.601-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-3.74 3.43c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm3.99 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" />
        </svg>
      ),
      description: "人民币 CNY · 10% off · Instant",
      badge: "10% OFF",
    },
    {
      id: "alipay",
      label: t("checkout.alipay"),
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 1024 1024" fill="currentColor">
          <path d="M1024 629.76c0-2.56-0.64-4.48-0.64-7.04V192c0-105.6-86.4-192-192-192H192C86.4 0 0 86.4 0 192v640c0 105.6 86.4 192 192 192h640c105.6 0 192-86.4 192-192V629.76zM640 224c35.2 0 64 28.8 64 64s-28.8 64-64 64-64-28.8-64-64 28.8-64 64-64zM512 160h192v32H512v-32zm-96 576c-88.32 0-160-71.68-160-160s71.68-160 160-160c30.72 0 59.52 8.96 84.48 24.32L416 576l84.48 135.68C475.52 727.04 446.72 736 416 736zm480 96c0 35.2-28.8 64-64 64H192c-35.2 0-64-28.8-64-64V192c0-35.2 28.8-64 64-64h640c35.2 0 64 28.8 64 64v640z" />
        </svg>
      ),
      description: "人民币 CNY · 10% off · Instant",
      badge: "10% OFF",
    },
    {
      id: "bank_transfer",
      label: t("checkout.bank_transfer"),
      icon: <Building2 className="w-6 h-6" />,
      description: "外币 USD/EUR · Visa / Mastercard · 10% off",
      badge: "10% OFF",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="container mx-auto px-4 py-8 md:py-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/cart")}
          className="mb-6 text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("checkout.back_to_cart")}
        </Button>

        <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 md:mb-8">
          {t("checkout.title")}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 左侧：收货信息 + 支付方式 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 收货信息 */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">
                  {t("checkout.shipping_info")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
                {addresses && addresses.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-slate-300 text-sm md:text-base">
                      {t("checkout.select_address")}
                    </Label>
                    <select
                      className="w-full bg-slate-800 border-slate-700 text-white rounded-md px-3 py-2.5 md:py-2 text-base md:text-sm"
                      onChange={(e) => {
                        const sel = addresses.find(
                          (a: any) => a.id === parseInt(e.target.value)
                        );
                        if (sel) {
                          setShippingInfo({
                            name: sel.fullName,
                            phone: sel.phone || "",
                            addressLine1: sel.addressLine1,
                            city: sel.city,
                            state: sel.state || "",
                            postalCode: sel.postalCode,
                            country: sel.country,
                          });
                        }
                      }}
                    >
                      <option value="">{t("checkout.select_saved_address")}</option>
                      {addresses.map((addr: any) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.fullName} - {addr.addressLine1}, {addr.city}
                          {addr.isDefault && ` (${t("checkout.default_address")})`}
                        </option>
                      ))}
                    </select>
                    <Separator className="bg-slate-700 my-4" />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="name" className="text-slate-300">
                      {t("checkout.recipient_name")} *
                    </Label>
                    <Input
                      id="name"
                      value={shippingInfo.name}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, name: e.target.value })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="phone" className="text-slate-300">
                      {t("checkout.phone")}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, phone: e.target.value })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="addressLine1" className="text-slate-300">
                      {t("checkout.address_line1")} *
                    </Label>
                    <Input
                      id="addressLine1"
                      value={shippingInfo.addressLine1}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          addressLine1: e.target.value,
                        })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-slate-300">
                      {t("checkout.city")} *
                    </Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, city: e.target.value })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-slate-300">
                      {t("checkout.state")}
                    </Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, state: e.target.value })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="text-slate-300">
                      {t("checkout.postal_code")} *
                    </Label>
                    <Input
                      id="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={(e) =>
                        setShippingInfo({
                          ...shippingInfo,
                          postalCode: e.target.value,
                        })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-slate-300">
                      {t("checkout.country")} *
                    </Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) =>
                        setShippingInfo({ ...shippingInfo, country: e.target.value })
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 给我们留言 */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <span className="text-amber-400">✉️</span>
                  {t("checkout.customer_note")}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 md:p-6">
                <Textarea
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder={t("checkout.customer_note_placeholder")}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 resize-none min-h-[90px]"
                  maxLength={500}
                />
                <p className="text-xs text-slate-500 mt-1.5 text-right">
                  {customerNote.length}/500
                </p>
              </CardContent>
            </Card>

            {/* 支付方式选择 */}
            <Card className="bg-slate-900/50 border-slate-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2">
                  {t("checkout.payment_method")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 md:p-6">

                {/* ── 仪式感说明 + 法物必达承诺 ── */}
                <div className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/60 to-slate-900/80 p-4 space-y-3">

                  {/* 仪式感引导 */}
                  <div className="flex gap-3 items-start">
                    <span className="text-2xl leading-none mt-0.5 shrink-0">☸️</span>
                    <div>
                      <p className="text-amber-300 font-semibold text-sm leading-snug">
                        {t("checkout.direct_payment_title")}
                      </p>
                      <p className="text-amber-200/70 text-xs mt-1 leading-relaxed">
                        {t("checkout.direct_payment_desc")}
                      </p>
                    </div>
                  </div>

                  {/* 10% 折扣横幅 */}
                  <div className="flex items-center gap-2 bg-green-900/40 border border-green-600/40 rounded-lg px-3 py-2">
                    <Tag className="w-4 h-4 text-green-400 shrink-0" />
                    <p className="text-green-300 text-sm">
                      {t("checkout.direct_discount_text")}
                    </p>
                  </div>

                  {/* 法物必达承诺 */}
                  <div className="flex gap-3 items-start border-t border-amber-800/30 pt-3">
                    <span className="text-xl leading-none mt-0.5 shrink-0">🪷</span>
                    <div>
                      <p className="text-amber-300 font-semibold text-sm">
                        {t("checkout.sacred_vow_title")}
                      </p>
                      <p className="text-amber-200/60 text-xs mt-1 leading-relaxed">
                        {t("checkout.sacred_vow_desc")}
                      </p>
                    </div>
                  </div>

                </div>
                {/* ── end 说明区 ── */}

                {/* 支付方式选项卡 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {paymentMethods.filter(m => !m.hidden).map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setSelectedPayment(method.id);
                        setCreatedOrderId(null);
                        setCreatedOrderNumber(null);
                      }}
                      className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 ${
                        selectedPayment === method.id
                          ? "border-[oklch(82%_0.18_85)] bg-[oklch(82%_0.18_85)]/10 shadow-lg shadow-[oklch(82%_0.18_85)]/10"
                          : "border-slate-700 bg-slate-800/50 hover:border-slate-600 hover:bg-slate-800"
                      }`}
                    >
                      {method.badge && (
                        <span className="absolute -top-2 -right-2 text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                          {method.badge}
                        </span>
                      )}
                      {selectedPayment === method.id && (
                        <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-[oklch(82%_0.18_85)]" />
                      )}
                      <div
                        className={
                          selectedPayment === method.id
                            ? "text-[oklch(82%_0.18_85)]"
                            : "text-slate-400"
                        }
                      >
                        {method.icon}
                      </div>
                      <span
                        className={`text-xs font-medium text-center ${
                          selectedPayment === method.id
                            ? "text-white"
                            : "text-slate-300"
                        }`}
                      >
                        {method.label}
                      </span>
                      <span className="text-[10px] text-slate-500 text-center leading-tight">
                        {method.description}
                      </span>
                    </button>
                  ))}
                </div>

                <Separator className="bg-slate-800" />

                {/* 支付区域 */}
                <div className="min-h-[120px]">
                  {/* PayPal */}
                  {selectedPayment === "paypal" && (
                    <div className="w-full">
                      <PayPalScriptProvider
                        options={{
                          clientId:
                            import.meta.env.VITE_PAYPAL_CLIENT_ID || "test",
                          currency: "USD",
                          intent: "capture",
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
                          disabled={
                            createOrderForPayPal.isPending ||
                            !cartItems ||
                            cartItems.length === 0
                          }
                          fundingSource={undefined}
                        />
                      </PayPalScriptProvider>
                    </div>
                  )}

                  {/* 微信支付 */}
                  {selectedPayment === "wechat" && (
                    <div className="space-y-4">
                      {!createdOrderId ? (
                        <Button
                          type="button"
                          onClick={handleOfflineCheckout}
                          disabled={createOrderMutation.isPending}
                          className="w-full h-12 bg-gradient-to-r from-[#07C160] to-[#06AD56] hover:from-[#06AD56] hover:to-[#059A4C] text-white font-semibold text-base"
                        >
                          {createOrderMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          ) : (
                            <Wallet className="w-5 h-5 mr-2" />
                          )}
                          {createOrderMutation.isPending
                            ? t("checkout.creating_order")
                            : "Confirm & View WeChat QR Code"}
                        </Button>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg p-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            <p className="text-sm text-green-300">
                              Order created! Please scan the QR code and complete payment.
                            </p>
                          </div>
                          <WechatPayInfo
                            orderId={createdOrderId}
                            orderNumber={createdOrderNumber}
                            total={total}
                          />
                          {createdOrderId && createdOrderNumber && (
                            <PaymentProofUpload
                              orderId={createdOrderId}
                              orderNumber={createdOrderNumber}
                              paymentMethod="wechat_pay"
                              customerNote={customerNote}
                            />
                          )}
                          <Button
                            type="button"
                            onClick={() => navigate(`/orders/${createdOrderId}`)}
                            className="w-full h-11 bg-slate-700 hover:bg-slate-600 text-white"
                          >
                            {t("checkout.view_order_detail")}
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* 支付宝 */}
                  {selectedPayment === "alipay" && (
                    <div className="space-y-4">
                      {!createdOrderId ? (
                        <Button
                          type="button"
                          onClick={handleOfflineCheckout}
                          disabled={createOrderMutation.isPending}
                          className="w-full h-12 bg-gradient-to-r from-[#1677FF] to-[#0958d9] hover:from-[#0958d9] hover:to-[#003eb3] text-white font-semibold text-base"
                        >
                          {createOrderMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          ) : (
                            <Wallet className="w-5 h-5 mr-2" />
                          )}
                          {createOrderMutation.isPending
                            ? t("checkout.creating_order")
                            : t("checkout.confirm_and_view_alipay_info")}
                        </Button>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg p-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            <p className="text-sm text-green-300">
                              {t("checkout.order_created_alipay_info")}
                            </p>
                          </div>
                          <AlipayInfo
                            orderId={createdOrderId}
                            orderNumber={createdOrderNumber}
                            total={total}
                          />
                          {createdOrderId && createdOrderNumber && (
                            <PaymentProofUpload
                              orderId={createdOrderId}
                              orderNumber={createdOrderNumber}
                              paymentMethod="alipay"
                              customerNote={customerNote}
                            />
                          )}
                          <Button
                            type="button"
                            onClick={() => navigate(`/orders/${createdOrderId}`)}
                            className="w-full h-11 bg-slate-700 hover:bg-slate-600 text-white"
                          >
                            {t("checkout.view_order_detail")}
                          </Button>
                        </>
                      )}
                    </div>
                  )}

                  {/* 銀行转账 */}
                  {selectedPayment === "bank_transfer" && (
                    <div className="space-y-4">
                      {!createdOrderId ? (
                        <Button
                          type="button"
                          onClick={handleOfflineCheckout}
                          disabled={createOrderMutation.isPending}
                          className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold text-base"
                        >
                          {createOrderMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          ) : (
                            <Building2 className="w-5 h-5 mr-2" />
                          )}
                          {createOrderMutation.isPending
                            ? t("checkout.creating_order")
                            : t("checkout.confirm_and_view_bank_info")}
                        </Button>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 bg-green-900/30 border border-green-700/50 rounded-lg p-3">
                            <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                            <p className="text-sm text-green-300">
                              {t("checkout.order_created_transfer_info")}
                            </p>
                          </div>
                          <BankTransferInfo
                            orderId={createdOrderId}
                            orderNumber={createdOrderNumber}
                            total={total}
                          />
                          {createdOrderId && createdOrderNumber && (
                            <PaymentProofUpload
                              orderId={createdOrderId}
                              orderNumber={createdOrderNumber}
                              paymentMethod="bank_transfer"
                              customerNote={customerNote}
                            />
                          )}
                          <Button
                            type="button"
                            onClick={() => navigate(`/orders/${createdOrderId}`)}
                            className="w-full h-11 bg-slate-700 hover:bg-slate-600 text-white"
                          >
                            {t("checkout.view_order_detail")}
                          </Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：订单摘要 */}
          <div>
            <Card className="bg-slate-900/50 border-slate-800 lg:sticky lg:top-4">
              <CardHeader>
                <CardTitle className="text-white">
                  {t("checkout.order_summary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
                {/* 商品列表 */}
                <div className="space-y-3">
                  {cartItems.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      {item.product.images?.[0] && (
                        <img
                          src={item.product.images[0].url}
                          alt={getLocalized(item.product.name)}
                          className="w-16 h-16 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          {getLocalized(item.product.name)}
                        </p>
                        <p className="text-slate-400 text-sm">
                          {t("checkout.quantity_label")}: {item.quantity}
                        </p>
                        <p className="text-[oklch(82%_0.18_85)] text-sm font-semibold">
                          $
                          {(
                            parseFloat(
                              item.product.salePrice || item.product.regularPrice
                            ) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-slate-800" />

                {/* 优惠券 */}
                <div className="space-y-2">
                  <Label className="text-slate-300 text-sm md:text-base">
                    {t("checkout.coupon")}
                  </Label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <Input
                        value={couponCode}
                        onChange={(e) =>
                          setCouponCode(e.target.value.toUpperCase())
                        }
                        placeholder={t("checkout.coupon_placeholder")}
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
                          t("checkout.apply_coupon")
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-green-900/20 border border-green-700/50 rounded-md px-3 py-2">
                      <span className="text-green-400 text-sm font-medium">
                        {appliedCoupon.code}
                      </span>
                      <Button
                        type="button"
                        onClick={handleRemoveCoupon}
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white h-auto p-1"
                      >
                        {t("checkout.remove_coupon")}
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
                    <span>{t("checkout.subtotal")}</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && appliedCoupon.discount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span>Coupon ({appliedCoupon.code})</span>
                      <span>-${(Math.min(appliedCoupon.discount, subtotal)).toFixed(2)}</span>
                    </div>
                  )}
                  {isDirectPayment && directDiscount > 0 && (
                    <div className="flex justify-between text-green-400">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        Direct Payment 10% Off
                      </span>
                      <span>-${directDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-300">
                    <span>{t("checkout.shipping")}</span>
                    <span>
                      {shipping === 0
                        ? t("checkout.free_shipping")
                        : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-slate-300">
                      <span>{t("checkout.tax")}</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  )}
                  <Separator className="bg-slate-800" />
                  <div className="flex justify-between text-white text-lg font-bold">
                    <span>{t("checkout.total")}</span>
                    <span className="text-[oklch(82%_0.18_85)]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* 社交证明计数器 */}
                <DeliveredCountBadge />

                {/* 安全提示 */}
                <div className="flex items-center gap-2 text-slate-500 text-xs mt-4">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span>{t("checkout.secure_payment")}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
