import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Sparkles, Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { getLocalized } from "@/lib/localized";

export default function Cart() {
  const { t } = useTranslation();
  const { isAuthenticated, loading: authLoading } = useAuth();
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

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      setLocation("/login?returnTo=/cart");
    }
  }, [isAuthenticated, authLoading]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('common.loading', 'Loading...')}</p>
        </div>
      </div>
    );
  }

  const handleUpdateQuantity = async (cartItemId: number, newQuantity: number) => {
    try {
      await updateQuantityMutation.mutateAsync({
        cartItemId,
        quantity: newQuantity,
      });
      utils.cart.get.invalidate();
    } catch (error) {
      toast.error(t('cart.update_failed', 'Update failed'));
    }
  };

  const handleRemove = async (cartItemId: number) => {
    try {
      await removeMutation.mutateAsync({ cartItemId });
      toast.success(t('cart.remove_success', 'Item removed'));
      utils.cart.get.invalidate();
    } catch (error) {
      toast.error(t('cart.remove_failed', 'Remove failed'));
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error(t('cart.invalid_coupon', 'Please enter a coupon code'));
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
        toast.success(t('cart.coupon_applied', 'Coupon applied'));
      } else {
        toast.error(result.error || t('cart.invalid_coupon', 'Invalid coupon'));
      }
    } catch (error) {
      toast.error(t('cart.update_failed', 'Validation failed'));
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
  const shipping = 0; // 全场免运费
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-foreground" />
                </div>
                <h1 className="text-lg md:text-2xl font-bold gradient-text">{t('common.site_name')}</h1>
              </a>
            </Link>
            <div className="flex items-center gap-3">
              <a href="https://report.cneraart.com" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">📝 {t('common.report')}</a>
              <a href="https://service.cneraart.com" target="_blank" rel="noopener noreferrer" className="text-xs md:text-sm text-muted-foreground hover:text-foreground transition-colors">💬 {t('common.service')}</a>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4 md:py-8">
        <h2 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 gradient-text">{t('cart.title', 'Shopping Cart')}</h2>

        {!cartItems || cartItems.length === 0 ? (
          <Card className="bg-card">
            <CardContent className="p-12 text-center">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('cart.empty', 'Your cart is empty')}</h3>
              <p className="text-muted-foreground mb-6">{t('cart.empty_desc', 'Browse our products and add items to your cart')}</p>
              <Link href="/products">
                <Button className="btn-primary">{t('cart.browse_products', 'Browse Products')}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
            {/* Left - Cart items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                if (!item.product) return null;

                const price = parseFloat(item.product.salePrice || item.product.regularPrice);
                const itemTotal = price * item.quantity;

                return (
                  <Card key={item.id} className="bg-card">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex gap-3 md:gap-6 flex-col sm:flex-row">
                        {/* Product image */}
                        <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                          {item.images[0] ? (
                            <img
                              src={item.images[0].url}
                              alt={getLocalized(item.product.name)}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>

                        {/* Product info */}
                        <div className="flex-1">
                          <Link href={`/products/${item.product.slug}`}>
                            <h3 className="font-bold mb-1 hover:text-accent transition-colors">
                              {getLocalized(item.product.name)}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-3">
                            ${price.toFixed(2)} {t('cart.per_item', 'each')}
                          </p>

                          <div className="flex items-center justify-between flex-wrap gap-3">
                            {/* Quantity control */}
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

                            {/* Item total and remove */}
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

            {/* Right - Order summary */}
            <div>
              <Card className="bg-card sticky top-24">
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-xl font-bold mb-6">{t('checkout.order_summary', 'Order Summary')}</h3>

                  {/* Coupon input */}
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-2">{t('cart.coupon_code', 'Coupon Code')}</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('cart.coupon_placeholder', 'Enter coupon code')}
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
                        {t('cart.coupon_applied', 'Coupon applied')}: {appliedCoupon.code}
                      </p>
                    )}
                  </div>

                  {/* Price breakdown */}
                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t('cart.subtotal', 'Subtotal')}</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-success">
                        <span>{t('cart.discount', 'Discount')}</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-muted-foreground">
                      <span>{t('cart.shipping', 'Shipping')}</span>
                      <span>{t('cart.free_shipping', 'Free')}</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between text-xl font-bold mb-6">
                    <span>{t('cart.total', 'Total')}</span>
                    <span className="text-accent">${total.toFixed(2)}</span>
                  </div>

                  {/* Checkout button */}
                  <Button
                    className="btn-primary w-full"
                    size="lg"
                    onClick={() => setLocation("/checkout")}
                  >
                    {t('cart.checkout', 'Proceed to Checkout')}
                  </Button>

                  <Link href="/products">
                    <Button variant="ghost" className="w-full mt-3">
                      {t('cart.continue_shopping', 'Continue Shopping')}
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
