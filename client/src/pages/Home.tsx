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
      {/* 顶部深红色导航栏 */}
      <nav className="bg-primary text-primary-foreground py-4 shadow-lg relative z-10">
        <div className="container">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-md">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-serif font-bold tracking-wide" style={{ fontFamily: "'Ma Shan Zheng', 'Noto Serif SC', serif" }}>源・华渡</h1>
                  <p className="text-xs tracking-widest opacity-90" style={{ fontFamily: "'Cinzel', serif" }}>YUAN · HUADU</p>
                </div>
              </a>
            </Link>

            <div className="flex items-center gap-6">
              <a href="https://wa.me/your-number" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="hidden md:inline">WhatsApp</span>
              </a>
              <a href="mailto:stegon@cneraart.com" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                <span className="hidden md:inline">stegon@cneraart.com</span>
              </a>
              <LanguageSwitcher />
              {isAuthenticated ? (
                <Link href="/account">
                  <a className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
                    <User className="w-4 h-4" />
                    <span className="hidden md:inline">{user?.name}</span>
                  </a>
                </Link>
              ) : (
                <a href={getLoginUrl()} className="bg-accent text-accent-foreground px-5 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity shadow-md">
                  {t('nav.login')}
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero区域 - 五台山背景 */}
      <section 
        className="relative min-h-[600px] flex items-center justify-center"
        style={{
          backgroundImage: 'url(/wutai-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        {/* 深色遮罩层 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>
        
        {/* 内容 */}
        <div className="relative z-10 container max-w-4xl text-center py-20">
          <div className="mb-8 flex justify-center">
            <div className="w-24 h-24 bg-accent/90 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm border-4 border-accent/30">
              <Sparkles className="w-12 h-12 text-accent-foreground" />
            </div>
          </div>
          
          <h2 className="text-5xl md:text-6xl font-serif font-bold mb-6 text-white drop-shadow-2xl" style={{ fontFamily: "'Noto Serif SC', serif", textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            {t('home.hero_title')}
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto drop-shadow-lg" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
            {t('home.hero_subtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link href="/products">
              <a className="px-10 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all font-medium text-lg shadow-2xl hover:shadow-accent/50 hover:scale-105 duration-300">
                {t('home.cta_products')}
              </a>
            </Link>
            <Link href="/fortune">
              <a className="px-10 py-4 bg-white/10 backdrop-blur-md text-white border-2 border-white/30 rounded-lg hover:bg-white/20 transition-all font-medium text-lg shadow-2xl hover:scale-105 duration-300">
                {t('home.cta_fortune')}
              </a>
            </Link>
          </div>
        </div>

        {/* 底部波浪装饰 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" fill="oklch(97% 0.005 60)"/>
          </svg>
        </div>
      </section>

      {/* 服务卡片 - 高档次设计 */}
      <section className="py-20 bg-background">
        <div className="container max-w-6xl">
          <h3 className="text-4xl font-serif font-bold text-center mb-4 text-foreground" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {t('home.services_title')}
          </h3>
          <div className="w-24 h-1 bg-accent mx-auto mb-16"></div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* 开光法物 */}
            <Card className="border-2 border-accent/20 hover:border-accent hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-10 text-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-foreground">{t('home.service_blessed_items')}</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{t('home.service_blessed_items_desc')}</p>
                  <Link href="/products">
                    <a className="inline-flex items-center text-accent hover:text-accent/80 font-semibold group-hover:gap-3 gap-2 transition-all">
                      {t('common.learn_more')} 
                      <span className="text-xl">→</span>
                    </a>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* 命理服务合集 */}
            <Card className="border-2 border-accent/20 hover:border-accent hover:shadow-2xl transition-all duration-300 overflow-hidden group bg-gradient-to-br from-accent/5 to-transparent">
              <CardContent className="p-10 text-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Star className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-foreground">{t('home.service_fortune_collection')}</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{t('home.service_fortune_collection_desc')}</p>
                  
                  <div className="space-y-3 mb-6">
                    <Link href="/fortune?service=destiny">
                      <a className="block px-6 py-3 border-2 border-accent/30 rounded-lg text-sm hover:bg-accent/10 hover:border-accent transition-all font-medium">
                        {t('home.service_fortune_short')}
                      </a>
                    </Link>
                    <Link href="/fortune?service=palmistry">
                      <a className="block px-6 py-3 border-2 border-accent/30 rounded-lg text-sm hover:bg-accent/10 hover:border-accent transition-all font-medium">
                        {t('home.service_palmistry_short')}
                      </a>
                    </Link>
                    <Link href="/fortune?service=fengshui">
                      <a className="block px-6 py-3 border-2 border-accent/30 rounded-lg text-sm hover:bg-accent/10 hover:border-accent transition-all font-medium">
                        {t('home.service_fengshui_short')}
                      </a>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 代祈福 */}
            <Card className="border-2 border-accent/20 hover:border-accent hover:shadow-2xl transition-all duration-300 overflow-hidden group">
              <CardContent className="p-10 text-center relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent/70 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <HomeIcon className="w-10 h-10 text-accent-foreground" />
                  </div>
                  <h4 className="text-2xl font-bold mb-4 text-foreground">{t('home.service_blessing')}</h4>
                  <p className="text-muted-foreground mb-6 leading-relaxed">{t('home.service_blessing_desc')}</p>
                  <Link href="/blessing">
                    <a className="inline-flex items-center text-accent hover:text-accent/80 font-semibold group-hover:gap-3 gap-2 transition-all">
                      {t('common.learn_more')} 
                      <span className="text-xl">→</span>
                    </a>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 精选产品 */}
      {!isLoading && featuredProducts && featuredProducts.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container max-w-6xl">
            <h3 className="text-4xl font-serif font-bold text-center mb-4 text-foreground" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {t('home.featured_title')}
            </h3>
            <div className="w-24 h-1 bg-accent mx-auto mb-16"></div>

            <div className="grid md:grid-cols-3 gap-10">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="border-2 border-accent/20 hover:border-accent hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                  <Link href={`/products/${product.slug}`}>
                    <a>
                      {product.images && product.images.length > 0 && (
                        <div className="aspect-square overflow-hidden bg-muted">
                          <img 
                            src={product.images[0].url} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <CardContent className="p-8">
                        <h4 className="font-bold text-xl mb-3 text-foreground group-hover:text-accent transition-colors">{product.name}</h4>
                        <p className="text-muted-foreground text-sm mb-6 line-clamp-2 leading-relaxed">{product.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-bold text-accent">${product.salePrice || product.regularPrice}</span>
                          <Button variant="outline" className="border-2 border-accent text-accent hover:bg-accent hover:text-primary-foreground transition-all">
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
      <footer className="bg-secondary text-secondary-foreground py-12 mt-20">
        <div className="container text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-serif font-bold mb-2" style={{ fontFamily: "'Ma Shan Zheng', 'Noto Serif SC', serif" }}>源・华渡</h3>
          </div>
          <p className="text-secondary-foreground/80 text-sm">
            © 2024 {t('footer_copyright')} Yuan·Huadu
          </p>
        </div>
      </footer>
    </div>
  );
}
