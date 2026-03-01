import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Search, Sparkles, SlidersHorizontal, ShoppingCart } from "lucide-react";
import OptimizedImage from "@/components/OptimizedImage";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { getLocalized } from "@/lib/localized";

export default function Products() {
  const { t } = useTranslation();
  
  // 解析URL参数
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');
  const initialCategoryId = categoryParam ? parseInt(categoryParam) : undefined;
  
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(initialCategoryId);
  const [sortBy, setSortBy] = useState("newest");
  const [hasAutoSelected, setHasAutoSelected] = useState(false);

  // 获取启蕴信物的子分类ID列表
  const { data: categories } = trpc.categories.list.useQuery();
  const blessedCategoryIds = categories?.filter(cat => cat.parentId === 1).map(cat => cat.id) || [];

  // 当从首页进入（category=1 是父分类）或无分类参数时，自动选中第一个子分类
  useEffect(() => {
    if (!hasAutoSelected && categories && blessedCategoryIds.length > 0) {
      const subcats = categories.filter(cat => cat.parentId === 1).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      if (subcats.length > 0) {
        if (categoryId === undefined || categoryId === 1) {
          setCategoryId(subcats[0].id);
        }
        setHasAutoSelected(true);
      }
    }
  }, [categories, blessedCategoryIds, categoryId, hasAutoSelected]);
  
  const { data: products, isLoading } = trpc.products.list.useQuery({
    search: search || undefined,
    categoryId,
    // blessedOnly: true, // 移除此限制,允许显示所有产品包括命理服务
    limit: 50,
  });

  // 获取启蕴信物的子分类(parentId = 1)
  const subcategories = categories?.filter(cat => cat.parentId === 1).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)) || [];
  
  // 快速筛选按钮 - 使用动态子分类
  const quickFilters = subcategories.map(cat => ({
    id: cat.id,
    label: t(`categories.${cat.slug.replace(/-/g, '_')}`),
    slug: cat.slug
  }));

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
                <h1 className="text-lg md:text-2xl font-bold gradient-text">{t("common.site_name")}</h1>
              </a>
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/cart">
                <Button variant="outline" className="hidden sm:flex">{t("common.cart")}</Button>
                <Button variant="outline" size="icon" className="flex sm:hidden h-10 w-10">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container py-4 md:py-8">
        {/* 页面标题 */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 gradient-text">
            {categoryId === 2 ? t("destiny.title") : t("products.title")}
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto px-4">
            {categoryId === 2 ? t("destiny.subtitle") : t("products.subtitle")}
          </p>
        </div>

        {/* 快速筛选按钮 */}
        <div className="mb-4 md:mb-6 flex flex-wrap gap-2 md:gap-3 justify-center px-4">
          {quickFilters.map((filter) => (
            <Button
              key={filter.id}
              variant={categoryId === filter.id ? "default" : "outline"}
              onClick={() => setCategoryId(filter.id)}
              className="rounded-full text-sm md:text-base h-9 md:h-10 px-3 md:px-4"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* 筛选和搜索 */}
        <div className="mb-6 md:mb-8 space-y-3 md:space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={t("products.search_placeholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border h-11 md:h-10"
              />
            </div>

            {/* 分类筛选 */}
            <Select
              value={categoryId?.toString() || "all"}
              onValueChange={(value) => setCategoryId(value === "all" ? undefined : Number(value))}
            >
              <SelectTrigger className="w-full md:w-48 bg-card border-border h-11 md:h-10">
                <SelectValue placeholder={t("products.select_category")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("products.all_categories")}</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.slug === "zodiac-guardian" ? t("categories.zodiac_guardian") : 
                     cat.slug === "constellation-guardian" ? t("categories.constellation_guardian") : 
                     cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* 排序 */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-card border-border h-11 md:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">{t("products.sort_newest")}</SelectItem>
                <SelectItem value="price-low">{t("products.sort_price_low")}</SelectItem>
                <SelectItem value="price-high">{t("products.sort_price_high")}</SelectItem>
                <SelectItem value="popular">{t("products.sort_popular")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 筛选标签 */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground px-1">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{t("products.total_count", { count: products?.length || 0 })}</span>
            {search && (
              <Badge variant="secondary">
                {t("products.search_label")}: {search}
              </Badge>
            )}
            {categoryId && (
              <Badge variant="secondary">
                {quickFilters.find(f => f.id === categoryId)?.label || 
                 categories?.find(c => c.id === categoryId)?.name}
              </Badge>
            )}
          </div>
        </div>

        {/* 产品网格 */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="product-card h-64 md:h-96 image-placeholder"></div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`}>
                <Card className="product-card cursor-pointer group h-full">
                  <div className="relative h-44 sm:h-48 md:h-56 overflow-hidden">
                    {product.images[0] ? (
                      <div className="w-full h-full [@media(hover:hover)]:group-hover:scale-110 transition-transform duration-500">
                        <OptimizedImage
                          src={product.images[0].url}
                          alt={getLocalized(product.name)}
                          className="w-full h-full"
                          objectFit="cover"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    {product.salePrice && (
                      <div className="absolute top-3 right-3 bg-primary px-2 py-1 rounded-full text-xs font-bold">
                        {t("products.sale_badge")}
                      </div>
                    )}

                  </div>
                  <CardContent className="p-3 md:p-4">
                    <h3 className="text-sm md:text-base font-medium mb-1 md:mb-2 group-hover:text-accent transition-colors line-clamp-1">
                      {getLocalized(product.name)}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-3 line-clamp-2">
                      {getLocalized(product.shortDescription)}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        {product.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg md:text-xl font-bold text-accent">
                              ${product.salePrice}
                            </span>
                            <span className="text-[10px] md:text-xs text-muted-foreground line-through">
                              ${product.regularPrice}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg md:text-xl font-bold text-accent">
                            ${product.regularPrice}
                          </span>
                        )}
                      </div>

                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("products.no_products")}</h3>
            <p className="text-muted-foreground">{t("products.try_other_filters")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
