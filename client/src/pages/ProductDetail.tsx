import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Sparkles, ShoppingCart, Heart, Shield, Star, ChevronLeft, Plus, Minus, Info } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import ImageLightbox from "@/components/ImageLightbox";
import FortuneServiceUpload from "@/components/FortuneServiceUpload";
import { toast } from "sonner";
import { getLocalized } from "@/lib/localized";

export default function ProductDetail() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [questionDescription, setQuestionDescription] = useState("");
  
  // 评价系统状态
  const [allReviews, setAllReviews] = useState<any[]>([]); // 已加载的评论
  const [reviewOffset, setReviewOffset] = useState(0); // 分页偏移
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 加载更多中
  const [selectedRating, setSelectedRating] = useState<number | null>(null); // 筛选评分
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null); // 筛选语言
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest'); // 排序方式
  const [showReviewForm, setShowReviewForm] = useState(false); // 显示评价表单
  const [newReviewRating, setNewReviewRating] = useState(5); // 新评价评分
  const [newReviewComment, setNewReviewComment] = useState(''); // 新评价内容

  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({ slug: slug! });
  const addToCartMutation = trpc.cart.add.useMutation();
  const submitReviewMutation = trpc.products.submitReview.useMutation();
  const utils = trpc.useUtils();

  // 初始化评论列表（当product加载完成时）
  useEffect(() => {
    if (product?.reviews) {
      setAllReviews(product.reviews);
      setReviewOffset(product.reviews.length);
    }
  }, [product?.id]); // 只在产品ID变化时重置

  // 加载更多评论
  const loadMoreReviews = async () => {
    if (!product || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      const moreReviews = await utils.client.products.getReviews.query({
        productId: product.id,
        limit: 50,
        offset: reviewOffset,
        language: selectedLanguage || undefined,
        rating: selectedRating || undefined,
      });
      setAllReviews(prev => [...prev, ...moreReviews]);
      setReviewOffset(prev => prev + moreReviews.length);
    } catch (err) {
      console.error('Failed to load more reviews:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 当筛选条件变化时，重新从后端加载
  const reloadFilteredReviews = async () => {
    if (!product) return;
    setIsLoadingMore(true);
    try {
      const filtered = await utils.client.products.getReviews.query({
        productId: product.id,
        limit: 50,
        offset: 0,
        language: selectedLanguage || undefined,
        rating: selectedRating || undefined,
      });
      setAllReviews(filtered);
      setReviewOffset(filtered.length);
    } catch (err) {
      console.error('Failed to reload reviews:', err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (product && (selectedRating !== null || selectedLanguage !== null)) {
      reloadFilteredReviews();
    } else if (product?.reviews && selectedRating === null && selectedLanguage === null) {
      setAllReviews(product.reviews);
      setReviewOffset(product.reviews.length);
    }
  }, [selectedRating, selectedLanguage]);
  
  // 语言检测 - 根据用户选择的i18n语言决定UI标签语言
  const isEnglishProduct = useMemo(() => {
    // 尊重用户选择的语言，不再根据产品名称自动判断
    // 支持所有中文变体：zh, zh-CN, zh-Hans, zh-TW, zh-Hant 等
    const currentLang = i18n.language || '';
    return !currentLang.startsWith('zh');
  }, [i18n.language]);
  
  // 英语翻译
  const translations = {
    zh: {
      blessingInfo: '启蕴信息',
      blessingTemple: '文化圣地',
      blessingMaster: '文化传承人',
      inStock: '有货',
      outOfStock: '无货',
      quantity: '数量',
      addToCart: '加入购物车',
      productDetails: '产品详情',
      blessingDescription: '启蕴仪式说明',
      efficacyDescription: '文化寓意',
      customerReviews: '客户评价',
      filterByRating: '按评分筛选',
      all: '全部',
      stars: '星',
      filterByLanguage: '按语言筛选',
      sortBy: '排序',
      newest: '最新',
      highestRating: '最高评分',
      lowestRating: '最低评分',
      addMyReview: '添加我的评价',
      loadMore: '加载更多评价',
      remaining: '条剩余',
      verifiedPurchase: '已验证购买',
      submitReview: '提交评价',
      cancel: '取消',
      yourRating: '您的评分',
      yourReview: '您的评价',
      minChars: '最少20字',
      suitableFor: '适用人群',
      efficacy: '文化寓意',
      wearingGuide: '佩戴指南',
    },
    en: {
      blessingInfo: 'Qi-Yun Ceremony Info',
      blessingTemple: 'Cultural Heritage Site',
      blessingMaster: 'Cultural Lineage Holder',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      quantity: 'Quantity',
      addToCart: 'Add to Cart',
      productDetails: 'Product Details',
      blessingDescription: 'Ceremony Description',
      efficacyDescription: 'Cultural Significance',
      customerReviews: 'Customer Reviews',
      filterByRating: 'Filter by Rating',
      all: 'All',
      stars: 'Stars',
      filterByLanguage: 'Filter by Language',
      sortBy: 'Sort by',
      newest: 'Newest',
      highestRating: 'Highest Rating',
      lowestRating: 'Lowest Rating',
      addMyReview: 'Add My Review',
      loadMore: 'Load More Reviews',
      remaining: 'remaining',
      verifiedPurchase: 'Verified Purchase',
      submitReview: 'Submit Review',
      cancel: 'Cancel',
      yourRating: 'Your Rating',
      yourReview: 'Your Review',
      minChars: 'Minimum 20 characters',
      suitableFor: 'Suitable For',
      efficacy: 'Efficacy',
      wearingGuide: 'Wearing Guide',
    }
  };
  
  const lang = isEnglishProduct ? translations.en : translations.zh;
  
  // 不再自动切换全局语言 - 尊重用户选择的语言设置
  
  // 评论排序（前端排序已加载的评论）
  const sortedReviews = useMemo(() => {
    const sorted = [...allReviews];
    sorted.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'highest') {
        return b.rating - a.rating;
      } else {
        return a.rating - b.rating;
      }
    });
    return sorted;
  }, [allReviews, sortBy]);

  // 使用后端返回的统计数据
  const reviewStats = product?.reviewStats || { total: 0, byRating: {} as Record<number, number>, byLanguage: {} as Record<string, number>, avgRating: 0 };
  const ratingCounts = reviewStats.byRating as Record<number, number>;
  const languageCounts = reviewStats.byLanguage as Record<string, number>;
  const totalReviewCount = reviewStats.total;
  const hasMoreReviews = reviewOffset < totalReviewCount;

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!product) return;

    // 对于命理服务,验证图片上传
    if (isFortuneService) {
      const minImages = serviceType === 'fengshui' ? 3 : 2;
      if (uploadedImages.length < minImages) {
        toast.error(t('fortuneUpload.minImagesRequired', { min: minImages }));
        return;
      }

      try {
        toast.info(t('product_detail.uploading_images'));
        
        // 上传图片到S3
        const imageUrls: string[] = [];
        for (const file of uploadedImages) {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/upload-fortune-image', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            throw new Error('Image upload failed');
          }
          
          const data = await response.json();
          imageUrls.push(data.url);
        }

        // 添加到购物车,带上服务数据
        if (!serviceType) {
          throw new Error('Service type is required');
        }
        
        await addToCartMutation.mutateAsync({
          productId: product.id,
          quantity,
          serviceData: {
            imageUrls,
            questionDescription,
            serviceType,
          },
        });
        
        toast.success(t('product_detail.success_added'));
        utils.cart.get.invalidate();
        
        // 清空上传的图片
        setUploadedImages([]);
        setQuestionDescription('');
      } catch (error) {
        console.error('Error adding fortune service to cart:', error);
        toast.error(t('product_detail.error_add'));
      }
    } else {
      // 普通商品
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

  // 判断是否为命理服务(根据slug判断)
  const isFortuneService = product.slug.includes('reading') || product.slug.includes('feng-shui') || product.slug.includes('fengshui');
  
  // 确定服务类型
  const getServiceType = (): "face" | "palm" | "fengshui" | undefined => {
    if (product.slug.includes('face-reading')) return 'face';
    if (product.slug.includes('palm-reading')) return 'palm';
    if (product.slug.includes('feng-shui') || product.slug.includes('fengshui')) return 'fengshui';
    return undefined;
  };
  
  const serviceType = getServiceType();
  const addToCartText = isFortuneService ? 'product_detail.get_report' : 'product_detail.add_to_cart';
  const blessingTabText = isFortuneService ? 'product_detail.tab_service' : 'product_detail.tab_blessing';

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
                <h1 className="text-lg md:text-2xl font-bold gradient-text">{t('common.site_name')}</h1>
              </a>
            </Link>
            <div className="flex items-center gap-3">
              <a href="https://report.cneraart.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-xs md:text-sm">📝 {t('common.report')}</Button>
              </a>
              <a href="https://service.cneraart.com" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-xs md:text-sm">💬 {t('common.service')}</Button>
              </a>
              <Link href="/cart">
                <Button variant="outline">{t('product_detail.cart')}</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4 md:py-8 px-4">
        {/* 返回按钮 */}
        <Link href="/products">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            {t('product_detail.back')}
          </Button>
        </Link>

        {/* 产品主要信息 */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-12">
          {/* 左侧 - 产品图片 */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden border border-border mb-4 bg-card cursor-pointer group relative"
              onClick={() => product.images.length > 0 && setIsLightboxOpen(true)}>
              {product.images[selectedImage] ? (
                <>
                  <OptimizedImage
                    src={product.images[selectedImage].url}
                    alt={getLocalized(product.name)}
                    className="w-full h-full"
                    priority={selectedImage === 0}
                    objectFit="cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3">
                      <Sparkles className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-muted-foreground" />
                </div>
              )}
            </div>
            {/* 缩略图 */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-accent" : "border-border hover:border-accent/50"
                    }`}
                  >
                    <OptimizedImage
                      src={image.url}
                      alt={`${getLocalized(product.name)} ${index + 1}`}
                      className="w-full h-full"
                      objectFit="cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 右侧 - 产品信息 */}
          <div>
            <h1 className="text-2xl md:text-4xl font-light mb-4 tracking-wide">{getLocalized(product.name)}</h1>

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
                  {product.averageRating.toFixed(1)} ({t('product_detail.reviews_count', { count: totalReviewCount })})
                </span>
              </div>
            )}

            {/* 价格 */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl md:text-4xl font-normal text-accent">${currentPrice}</span>
                {product.salePrice && (
                  <>
                    <span className="text-lg md:text-xl text-muted-foreground line-through">${product.regularPrice}</span>
                    <span className="px-2 py-1 bg-primary rounded text-sm font-medium">{t('product_detail.save_percent', { percent: discount })}</span>
                  </>
                )}
              </div>
            </div>

            {/* 简短描述 */}
            <p className="text-muted-foreground mb-6 leading-relaxed">{getLocalized(product.shortDescription)}</p>

            {/* 启蕴信息 */}
            {product.blessingTemple && (
              <Card className="mb-6 bg-card/50 border-accent/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-medium mb-2 text-accent">{lang.blessingInfo}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        {product.blessingTemple && <p>{lang.blessingTemple}: {product.blessingTemple}</p>}
                        {product.blessingMaster && <p>{lang.blessingMaster}: {product.blessingMaster}</p>}
                        {product.blessingDate && <p>{t('product_detail.date')}: {new Date(product.blessingDate).toLocaleDateString()}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 库存状态 - 始终有货 */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-success">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span>{lang.inStock}</span>
              </div>
            </div>

            {/* 数量选择 */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{lang.quantity}</label>
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
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={false}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* 命理服务图片上传 */}
            {isFortuneService && serviceType && (
              <div className="mb-6">
                <FortuneServiceUpload
                  serviceType={serviceType}
                  onImagesChange={setUploadedImages}
                  onQuestionChange={setQuestionDescription}
                />
              </div>
            )}

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
            <div className="flex gap-3 md:gap-4">
              <Button
                className="btn-primary flex-1 h-12 md:h-11"
                size="lg"
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {addToCartMutation.isPending ? (isEnglishProduct ? 'Adding...' : '添加中...') : lang.addToCart}
              </Button>
              <Button variant="outline" size="lg" className="border-accent text-accent hover:bg-accent/10 h-12 md:h-11 w-12 md:w-auto px-0 md:px-4">
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* 详细信息标签页 */}
        <Tabs defaultValue="description" className="mb-8 md:mb-12">
          <TabsList className={`grid w-full ${getLocalized(product.suitableFor) || getLocalized(product.efficacy) || getLocalized(product.wearingGuide) ? 'grid-cols-4' : 'grid-cols-3'} bg-card h-auto`}>
            <TabsTrigger value="description" className="text-sm md:text-base py-3">{lang.productDetails}</TabsTrigger>
            <TabsTrigger value="blessing" className="text-sm md:text-base py-3">{lang.blessingDescription}</TabsTrigger>
            {(getLocalized(product.suitableFor) || getLocalized(product.efficacy) || getLocalized(product.wearingGuide)) && (
              <TabsTrigger value="efficacy" className="text-sm md:text-base py-3">{lang.efficacyDescription}</TabsTrigger>
            )}
            <TabsTrigger value="reviews" className="text-sm md:text-base py-3">{lang.customerReviews} ({totalReviewCount.toLocaleString()})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card className="bg-card">
              <CardContent className="p-4 md:p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-light text-base">
                    {getLocalized(product.description)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blessing" className="mt-6">
            <Card className="bg-card">
              <CardContent className="p-4 md:p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-light text-base">
                    {getLocalized(product.blessingDescription) || t('product_detail.blessing_default')}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {(getLocalized(product.suitableFor) || getLocalized(product.efficacy) || getLocalized(product.wearingGuide)) && (
            <TabsContent value="efficacy" className="mt-6">
              <Card className="bg-card">
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-6">
                    {getLocalized(product.suitableFor) && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-accent" />
                          {lang.suitableFor}
                        </h3>
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-light text-base">
                          {getLocalized(product.suitableFor)}
                        </div>
                      </div>
                    )}
                    
                    {getLocalized(product.efficacy) && (
                      <div>
                        <h3 className="text-lg font-medium mb-3 text-accent flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          {lang.efficacy}
                        </h3>
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-light text-base">
                          {getLocalized(product.efficacy)}
                        </div>
                      </div>
                    )}
                    
                    {getLocalized(product.wearingGuide) && (
                      <div>
                        <h3 className="text-lg font-medium mb-3 text-accent flex items-center gap-2">
                          <Info className="w-5 h-5" />
                          {lang.wearingGuide}
                        </h3>
                        <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap font-light text-base">
                          {getLocalized(product.wearingGuide)}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="reviews" className="mt-6">
            {totalReviewCount > 0 ? (
              <div className="space-y-6">
                {/* 筛选和排序控件 */}
                <div className="flex flex-col md:flex-row gap-4 p-4 bg-muted/30 rounded-lg">
                  {/* 评分筛选 */}
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">{lang.filterByRating}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedRating === null ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedRating(null)}
                      >
                        {lang.all} ({totalReviewCount.toLocaleString()})
                      </Button>
                      {[5, 4, 3].map(rating => (
                        <Button
                          key={rating}
                          variant={selectedRating === rating ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedRating(rating)}
                        >
                          {rating}{lang.stars} ({ratingCounts[rating] || 0})
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 语言筛选 */}
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">{lang.filterByLanguage}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedLanguage === null ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedLanguage(null)}
                      >
                        {lang.all}
                      </Button>
                      {Object.entries(languageCounts).map(([lang, count]) => (
                        <Button
                          key={lang}
                          variant={selectedLanguage === lang ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedLanguage(lang)}
                        >
                          {lang === 'en' ? 'English' : lang === 'zh' ? '中文' : lang === 'de' ? 'Deutsch' : lang === 'fr' ? 'Français' : lang === 'es' ? 'Español' : lang === 'it' ? 'Italiano' : lang === 'ja' ? '日本語' : lang === 'ko' ? '한국어' : lang === 'pt' ? 'Português' : lang === 'vi' ? 'Tiếng Việt' : lang === 'th' ? 'ไทย' : lang === 'ar' ? 'العربية' : lang === 'ru' ? 'Русский' : lang === 'hi' ? 'हिन्दी' : lang} ({count})
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {/* 排序 */}
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">{lang.sortBy}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={sortBy === 'newest' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('newest')}
                      >
                        {lang.newest}
                      </Button>
                      <Button
                        variant={sortBy === 'highest' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('highest')}
                      >
                        {lang.highestRating}
                      </Button>
                      <Button
                        variant={sortBy === 'lowest' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSortBy('lowest')}
                      >
                        {lang.lowestRating}
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* 添加评价按钮 */}
                {isAuthenticated && (
                  <Button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="w-full md:w-auto"
                  >
                    {showReviewForm ? lang.cancel : lang.addMyReview}
                  </Button>
                )}
                
                {/* 评价表单 */}
                {showReviewForm && isAuthenticated && (
                  <Card className="bg-card border-2 border-primary/20">
                    <CardContent className="p-4 md:p-6">
                      <h3 className="font-medium mb-4 text-lg">分享您的使用体验</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">评分 <span className="text-destructive">*</span></label>
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(rating => (
                              <Button
                                key={rating}
                                variant={newReviewRating === rating ? "default" : "outline"}
                                size="sm"
                                onClick={() => setNewReviewRating(rating)}
                                className="flex items-center gap-1"
                              >
                                <Star className={`w-4 h-4 ${newReviewRating >= rating ? 'fill-current' : ''}`} />
                                {rating}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            {lang.yourReview} <span className="text-destructive">*</span>
                            <span className="text-xs text-muted-foreground ml-2">({lang.minChars})</span>
                          </label>
                          <textarea
                            className="w-full min-h-[120px] p-3 border rounded-md bg-background"
                            placeholder="分享您的使用感受，帮助其他用户做出更好的选择..."
                            value={newReviewComment}
                            onChange={(e) => setNewReviewComment(e.target.value)}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {newReviewComment.length} / 500 字
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            disabled={newReviewComment.length < 20}
                            onClick={async () => {
                              if (newReviewComment.length < 20) {
                                toast.error('评价内容至少20字');
                                return;
                              }
                              
                              try {
                                toast.info('正在提交评价...');
                                
                                await submitReviewMutation.mutateAsync({
                                  productId: product.id,
                                  rating: newReviewRating,
                                  comment: newReviewComment
                                });
                                
                                toast.success('评价提交成功，审核后将显示');
                                setShowReviewForm(false);
                                setNewReviewRating(5);
                                setNewReviewComment('');
                              } catch (error) {
                                toast.error('提交失败，请稍后重试');
                              }
                            }}
                          >
                            {lang.submitReview}
                          </Button>
                          <Button 
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowReviewForm(false);
                              setNewReviewComment('');
                              setNewReviewRating(5);
                            }}
                          >
                            {lang.cancel}
                          </Button>                 </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* 评价列表 */}
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {isEnglishProduct ? `Showing ${sortedReviews.length} of ${totalReviewCount.toLocaleString()} reviews` : `显示 ${sortedReviews.length} / ${totalReviewCount.toLocaleString()} 条评价`}
                  </p>
                  {sortedReviews.map((review) => (
                    <Card key={review.id} className="bg-card">
                      <CardContent className="p-4 md:p-6">
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
                            <p className="text-sm text-muted-foreground">{review.userName || '匿名用户'}</p>
                          </div>
                          {review.isVerified && (
                            <span className="text-xs bg-success/20 text-success px-2 py-1 rounded">{lang.verifiedPurchase}</span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-2">{review.comment}</p>
                        {review.location && (
                          <p className="text-xs text-muted-foreground mb-1">
                            📍 {review.location}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* 加载更多按钮 */}
                {hasMoreReviews && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={loadMoreReviews}
                    disabled={isLoadingMore}
                  >
                    {isLoadingMore ? (isEnglishProduct ? 'Loading...' : '加载中...') : `${lang.loadMore} (${(totalReviewCount - reviewOffset).toLocaleString()} ${lang.remaining})`}
                  </Button>
                )}
              </div>
            ) : (
              <Card className="bg-card">
                <CardContent className="p-12 text-center">
                  <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">暂无评价</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 图片灯箱 */}
      <ImageLightbox
        images={product.images.map(img => img.url)}
        initialIndex={selectedImage}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
      />
    </div>
  );
}
