/**
 * Stripe 支付集成模块
 * 支持银行卡（Card）和支付宝（Alipay）支付
 */
import Stripe from "stripe";

// 初始化 Stripe（使用环境变量中的密钥）
function getStripe(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  return new Stripe(secretKey, {
    apiVersion: "2026-01-28.clover" as const,
  });
}

export interface CreatePaymentIntentParams {
  amount: number; // 金额（美分）
  currency?: string;
  paymentMethod: "card" | "alipay";
  metadata?: Record<string, string>;
  customerEmail?: string;
  description?: string;
  returnUrl?: string; // Alipay 支付完成后的回调 URL
}

export interface PaymentIntentResult {
  clientSecret: string;
  paymentIntentId: string;
  status: string;
  redirectUrl?: string; // Alipay 重定向 URL
}

/**
 * 创建 Stripe PaymentIntent
 * - 银行卡支付：返回 clientSecret 供前端 Elements 确认
 * - 支付宝支付：返回 clientSecret，前端通过 confirmAlipayPayment 重定向
 */
export async function createPaymentIntent(
  params: CreatePaymentIntentParams
): Promise<PaymentIntentResult> {
  const stripe = getStripe();

  const paymentMethodTypes: string[] =
    params.paymentMethod === "alipay" ? ["alipay"] : ["card"];

  const intentParams: Stripe.PaymentIntentCreateParams = {
    amount: params.amount,
    currency: params.currency || "usd",
    payment_method_types: paymentMethodTypes,
    metadata: params.metadata || {},
    description: params.description,
  };

  // 支付宝需要 receipt_email 用于收据
  if (params.customerEmail) {
    intentParams.receipt_email = params.customerEmail;
  }

  const paymentIntent = await stripe.paymentIntents.create(intentParams);

  return {
    clientSecret: paymentIntent.client_secret!,
    paymentIntentId: paymentIntent.id,
    status: paymentIntent.status,
  };
}

/**
 * 确认 PaymentIntent 状态
 */
export async function getPaymentIntentStatus(
  paymentIntentId: string
): Promise<{ status: string; amount: number; metadata: Record<string, string> }> {
  const stripe = getStripe();
  const intent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return {
    status: intent.status,
    amount: intent.amount,
    metadata: (intent.metadata || {}) as Record<string, string>,
  };
}

/**
 * 处理 Stripe Webhook 事件
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

/**
 * 获取 Stripe 公钥（供前端使用）
 */
export function getStripePublishableKey(): string {
  return process.env.STRIPE_PUBLISHABLE_KEY || "";
}
