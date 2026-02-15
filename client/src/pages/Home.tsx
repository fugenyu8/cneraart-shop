import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Sparkles, User, Mail, MessageCircle, Package, Star, Home as HomeIcon } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: featuredProducts, isLoading } = trpc.products.featured.useQuery();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部红色导航栏 */}
      <nav className="bg-primary text-primary-foreground py-3 border-b-4 border-accent">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-serif font-bold" style={{ fontFamily: "'Ma Shan Zheng', 'Noto Serif SC', serif" }}>源・华渡</h1>
                  <p className="text-[10px] tracking-wide opacity-90" style={{ fontFamily: "'Cinzel', serif" }}>YUAN · HUADU</p>
                </div>
              </a>
            </Link>

            <div className="flex items-center gap-4">
              <a href="https://wa.me/your-number" className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>
              <a href="mailto:stegon@cneraart.com" className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity">
                <Mail className="w-4 h-4" />
                <span className="hidden md:inline">stegon@cneraart.com</span>
              </a>
              <LanguageSwitcher />
              {isAuthenticated ? (
                <Link href="/account">
                  <a className="flex items-center gap-1 text-sm hover:opacity-80 transition-opacity">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{user?.name}</span>
                  </a>
                </Link>
              ) : (
                <a href={getLoginUrl()} className="bg-accent text-accent-foreground px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 transition-opacity">
                  {t('nav.login')}
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 二级导航 */}
      <div className="bg-muted border-b border-border py-3">
        <div className="container">
          <div className="flex items-center justify-center gap-4">
            <Link href="/products">
              <a className="px-6 py-2 border-2 border-accent text-accent-foreground rounded hover:bg-accent/10 transition-colors font-medium">
                <Package className="w-4 h-4 inline mr-2" />
                {t('nav.products')}
              </a>
            </Link>
            <Link href="/fortune">
              <a className="px-6 py-2 border-2 border-accent text-accent-foreground rounded hover:bg-accent/10 transition-colors font-medium">
                <Star className="w-4 h-4 inline mr-2" />
                {t('home.service_fortune_collection')}
              </a>
            </Link>
            {isAuthenticated && (
              <Link href="/cart">
                <a className="px-6 py-2 border-2 border-accent text-accent-foreground rounded hover:bg-accent/10 transition-colors font-medium relative">
                  <ShoppingCart className="w-4 h-4 inline mr-2" />
                  {t('nav.cart')}
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Hero区域 - 中心对齐 */}
      <section className="py-20">
        <div className="container max-w-3xl text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-accent-foreground" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {t('home.hero_title')}
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('home.hero_subtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <a className="px-8 py-3 border-2 border-accent text-accent-foreground rounded hover:bg-accent hover:text-primary-foreground transition-all font-medium">
                {t('home.cta_products')}
              </a>
            </Link>
            <Link href="/fortune">
              <a className="px-8 py-3 border-2 border-accent text-accent-foreground rounded hover:bg-accent hover:text-primary-foreground transition-all font-medium">
                {t('home.cta_fortune')}
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* 服务卡片 - 简洁布局 */}
      <section className="py-16 bg-muted/30">
        <div className="container max-w-5xl">
          <h3 className="text-3xl font-serif font-bold text-center mb-12 text-foreground" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {t('home.services_title')}
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {/* 开光法物 */}
            <Card className="border-2 border-accent/30 hover:border-accent hover:shadow-lg transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">{t('home.service_blessed_items')}</h4>
                <p className="text-muted-foreground mb-4">{t('home.service_blessed_items_desc')}</p>
                <Link href="/products">
                  <a className="text-accent hover:text-accent/80 font-medium">
                    {t('common.learn_more')} →
                  </a>
                </Link>
              </CardContent>
            </Card>

            {/* 命理服务合集 */}
            <Card className="border-2 border-accent/30 hover:border-accent hover:shadow-lg transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">{t('home.service_fortune_collection')}</h4>
                <p className="text-muted-foreground mb-4">{t('home.service_fortune_collection_desc')}</p>
                
                <div className="space-y-2 mb-4">
                  <Link href="/fortune?service=destiny">
                    <a className="block px-4 py-2 border border-accent/50 rounded text-sm hover:bg-accent/10 transition-colors">
                      {t('home.service_fortune_short')}
                    </a>
                  </Link>
                  <Link href="/fortune?service=palmistry">
                    <a className="block px-4 py-2 border border-accent/50 rounded text-sm hover:bg-accent/10 transition-colors">
                      {t('home.service_palmistry_short')}
                    </a>
                  </Link>
                  <Link href="/fortune?service=fengshui">
                    <a className="block px-4 py-2 border border-accent/50 rounded text-sm hover:bg-accent/10 transition-colors">
                      {t('home.service_fengshui_short')}
                    </a>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 代祈福 */}
            <Card className="border-2 border-accent/30 hover:border-accent hover:shadow-lg transition-all">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <HomeIcon className="w-8 h-8 text-accent-foreground" />
                </div>
                <h4 className="text-xl font-bold mb-3 text-foreground">{t('home.service_blessing')}</h4>
                <p className="text-muted-foreground mb-4">{t('home.service_blessing_desc')}</p>
                <Link href="/blessing">
                  <a className="text-accent hover:text-accent/80 font-medium">
                    {t('common.learn_more')} →
                  </a>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 精选产品 */}
      {!isLoading && featuredProducts && featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container max-w-6xl">
            <h3 className="text-3xl font-serif font-bold text-center mb-12 text-foreground" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {t('home.featured_title')}
            </h3>

            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="border-2 border-accent/30 hover:border-accent hover:shadow-lg transition-all overflow-hidden">
                  <Link href={`/products/${product.slug}`}>
                    <a>
                      {product.images && product.images.length > 0 && (
                        <div className="aspect-square overflow-hidden">
                          <img 
                            src={product.images[0].url} 
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardContent className="p-6">
                        <h4 className="font-bold text-lg mb-2 text-foreground">{product.name}</h4>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-accent">${product.salePrice || product.regularPrice}</span>
                          <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-primary-foreground">
                            {t('products.view_details')}
                          </Button>
                        </div>
                      </CardContent>
                    </a>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 页脚 */}
      <footer className="bg-muted border-t border-border py-8 mt-16">
        <div className="container text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 {t('footer_copyright')} Yuan·Huadu
          </p>
        </div>
      </footer>
    </div>
  );
}
