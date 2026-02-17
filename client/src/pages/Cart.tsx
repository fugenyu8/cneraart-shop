import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Sparkles, Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import { toast } from "sonner";

export default function Cart() {
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [couponCode, setCouponCode] = useState("");

  const { data: cartItems, isLoading } = trpc.cart.get.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const updateQuantityMutation = trpc.cart.updateQuantity.useMutation();
  const removeMutation = trpc.cart.remove.useMutation();
  const validateCouponMutation = trpc.coupons.validate.useMutation();
  const utils = trpc.useUtils();

  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    try {
      await updateQuantityMutation.mutateAsync({
        cartItemId,
        quantity: newQuantity,
      });
      utils.cart.get.invalidate();
    } catch (error) {
      toast.error("更新失败");
    }
  };

  const handleRemove = async (cartItemId: number) => {
    try {
      await removeMutation.mutateAsync({ cartItemId });
      toast.success("已移除");
      utils.cart.get.invalidate();
    } catch (error) {
      toast.error("移除失败");
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("请输入优惠券代码");
      return;
    }

    try {
      const result = await validateCouponMutation.mutateAsync({
        code: couponCode,
        cartTotal: subtotal,
      });

      if (result.valid && result.discount) {
        setAppliedCoupon({
          code: couponCode,
          discount: result.discount,
        });
        toast.success("优惠券已应用");
      } else {
        toast.error(result.error || "优惠券无效");
      }
    } catch (error) {
      toast.error("验证失败");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="lotus-loader">
          <Sparkles className="w-16 h-16 text-accent" />
        </div>
      </div>
    );
  }

  const subtotal =
    cartItems?.reduce((sum, item) => {
      const price = parseFloat(item.product?.salePrice || item.product?.regularPrice || "0");
      return sum + price * item.quantity;
    }, 0) || 0;

  const discount = appliedCoupon?.discount || 0;
  const shipping = subtotal > 50 ? 0 : 5; // 满$50免运费
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-foreground" />
                </div>
                <h1 className="text-2xl font-bold gradient-text">源・华渡</h1>
              </a>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-4 md:py-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 gradient-text">购物车</h2>

        {!cartItems || cartItems.length === 0 ? (
          <Card className="bg-card">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">购物车是空的</h3>
              <p className="text-muted-foreground mb-6">快去选购您喜欢的产品吧</p>
              <Link href="/products">
                <Button className="btn-primary">浏览产品</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
            {/* 左侧 - 购物车商品列表 */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                if (!item.product) return null;

                const price = parseFloat(item.product.salePrice || item.product.regularPrice);
                const itemTotal = price * item.quantity;

                return (
                  <Card key={item.id} className="bg-card">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-3 md:gap-6 flex-col sm:flex-row">
                        {/* 产品图片 */}
                        <div className="w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                          {item.images[0] ? (
                            <img
                              src={item.images[0].url}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* 产品信息 */}
                        <div className="flex-1">
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="font-bold mb-1 hover:text-accent transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-3">
                            ${price.toFixed(2)} 每件
                          </p>

                          <div className="flex items-center justify-between flex-wrap gap-3">
                            {/* 数量控制 */}
                            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 md:h-8 md:w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1 || updateQuantityMutation.isPending}
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="w-12 text-center font-bold text-lg md:text-base">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-9 w-9 md:h-8 md:w-8"
                                onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={
                                  item.quantity >= item.product.stock || updateQuantityMutation.isPending
                                }
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>

                            {/* 小计和删除 */}
                            <div className="flex items-center gap-3 md:gap-4">
                              <span className="text-base md:text-lg font-bold text-accent">
                                ${itemTotal.toFixed(2)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(item.id)}
                                disabled={removeMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* 右侧 - 订单摘要 */}
            <div>
              <Card className="bg-card sticky top-24">
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-xl font-bold mb-6">订单摘要</h3>

                  {/* 优惠券输入 */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">优惠券代码</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="输入优惠券"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="bg-background border-border"
                      />
                      <Button
                        variant="outline"
                        onClick={handleApplyCoupon}
                        disabled={validateCouponMutation.isPending}
                      >
                        <Tag className="w-4 h-4" />
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <p className="text-sm text-success mt-2">
                        已应用优惠券: {appliedCoupon.code}
                      </p>
                    )}
                  </div>

                  {/* 价格明细 */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>小计</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-success">
                        <span>优惠券折扣</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>运费</span>
                      <span>{shipping === 0 ? "免费" : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {subtotal < 50 && shipping > 0 && (
                      <p className="text-xs text-muted-foreground">
                        再购买 ${(50 - subtotal).toFixed(2)} 即可享受免运费
                      </p>
                    )}
                  </div>

                  {/* 总计 */}
                  <div className="flex justify-between text-xl font-bold mb-6">
                    <span>总计</span>
                    <span className="text-accent">${total.toFixed(2)}</span>
                  </div>

                  {/* 结算按钮 */}
                  <Button
                    className="btn-primary w-full"
                    size="lg"
                    onClick={() => setLocation("/checkout")}
                  >
                    去结算
                  </Button>

                  <Link href="/products">
                    <Button variant="ghost" className="w-full mt-3">
                      继续购物
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
