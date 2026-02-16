import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Sparkles, ShoppingCart, Heart, Shield, Star, ChevronLeft, Plus, Minus, Info } from "lucide-react";
import { toast } from "sonner";

export default function ProductDetail() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({ slug: slug! });
  const addToCartMutation = trpc.cart.add.useMutation();
  const utils = trpc.useUtils();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!product) return;

    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        quantity,
      });
      toast.success(t('product_detail.success_added'));
      utils.cart.get.invalidate();
    } catch (error) {
      toast.error(t('product_detail.error_add'));
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

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('product_detail.not_found')}</h2>
          <Link href="/products">
            <Button>{t('product_detail.back')}</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentPrice = product.salePrice || product.regularPrice;
  const discount = product.salePrice
    ? Math.round(((parseFloat(product.regularPrice) - parseFloat(product.salePrice)) / parseFloat(product.regularPrice)) * 100)
    : 0;

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
            <Link href="/cart">
              <Button variant="outline">{t('product_detail.cart')}</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container py-8">
        {/* 返回按钮 */}
        <Link href="/products">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('product_detail.back')}
          </Button>
        </Link>

        {/* 产品主要信息 */}
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          {/* 左侧 - 产品图片 */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden border border-border mb-4 bg-card">
              {product.images[selectedImage] ? (
                <img
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </div>
            {/* 缩略图 */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-accent" : "border-border hover:border-accent/50"
                    }`}
                  >
                    <img src={image.url} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 右侧 - 产品信息 */}
          <div>
            <h1 className="text-4xl font-light mb-4 tracking-wide">{product.name}</h1>

            {/* 评分 */}
            {product.averageRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.averageRating) ? "text-accent fill-accent" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.averageRating.toFixed(1)} ({t('product_detail.reviews_count', { count: product.reviews.length })})
                </span>
              </div>
            )}

            {/* 价格 */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-normal text-accent">${currentPrice}</span>
                {product.salePrice && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">${product.regularPrice}</span>
                    <span className="px-2 py-1 bg-primary rounded text-sm font-medium">{t('product_detail.save_percent', { percent: discount })}</span>
                  </>
                )}
              </div>
            </div>

            {/* 简短描述 */}
            <p className="text-muted-foreground mb-6 leading-relaxed">{product.shortDescription}</p>

            {/* 开光信息 */}
            {product.blessingTemple && (
              <Card className="mb-6 bg-card/50 border-accent/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium mb-2 text-accent">{t('product_detail.blessing_info')}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {product.blessingTemple && <p>{t('product_detail.temple')}: {product.blessingTemple}</p>}
                        {product.blessingMaster && <p>{t('product_detail.master')}: {product.blessingMaster}</p>}
                        {product.blessingDate && <p>{t('product_detail.date')}: {new Date(product.blessingDate).toLocaleDateString()}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 库存状态 */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-success">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span>{t('product_detail.in_stock')} {product.stock <= 10 && `(${t('product_detail.only_left', { count: product.stock })})`}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-destructive">
                  <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  <span>{t('product_detail.out_of_stock')}</span>
                </div>
              )}
            </div>

            {/* 数量选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('product_detail.quantity')}</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-normal w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 服务类产品引导说明 */}
            {product.categoryId === 5 && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-accent mb-2">{t('product_detail.service_guide.title')}</p>
                    <ol className="list-decimal list-inside space-y-1 text-foreground/80">
                      <li>{t('product_detail.service_guide.step1')}</li>
                      <li>{t('product_detail.service_guide.step2')}</li>
                      <li>{t('product_detail.service_guide.step3')}</li>
                      <li>{t('product_detail.service_guide.step4')}</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <Button
                className="btn-primary flex-1"
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock <= 0 || addToCartMutation.isPending}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addToCartMutation.isPending ? t('product_detail.adding') : t('product_detail.add_to_cart')}
              </Button>
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 详细信息标签页 */}
        <Tabs defaultValue="description" className="mb-12">
          <TabsList className="grid w-full grid-cols-3 bg-card">
            <TabsTrigger value="description">{t('product_detail.tab_description')}</TabsTrigger>
            <TabsTrigger value="blessing">{t('product_detail.tab_blessing')}</TabsTrigger>
            <TabsTrigger value="reviews">{t('product_detail.tab_reviews')} ({product.reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-light text-base">
                    {product.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blessing" className="mt-6">
            <Card className="bg-card">
              <CardContent className="p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-light text-base">
                    {product.blessingDescription || t('product_detail.blessing_default')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {product.reviews.length > 0 ? (
              <div className="space-y-4">
                {product.reviews.map((review) => (
                  <Card key={review.id} className="bg-card">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? "text-accent fill-accent" : "text-muted-foreground"}`}
                              />
                            ))}
                          </div>
                          {review.title && <h4 className="font-medium mb-1">{review.title}</h4>}
                        </div>
                        {review.isVerifiedPurchase && (
                          <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">{t('product_detail.verified_purchase')}</span>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-2">{review.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card">
                <CardContent className="p-12 text-center">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">{t('product_detail.no_reviews')}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
