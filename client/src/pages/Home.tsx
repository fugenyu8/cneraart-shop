import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { ShoppingCart, Sparkles, Shield, Award, Star, CheckCircle2, ChevronDown, User, Home as HomeIcon, Heart } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: featuredProducts, isLoading } = trpc.products.featured.useQuery();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen relative">
      {/* 粒子光效背景 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-card/60 backdrop-blur-xl border-b border-accent/20">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center shadow-lg group-hover:shadow-accent/50 transition-all">
                  <Sparkles className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <h1 className="text-lg font-serif font-bold text-accent" style={{ fontFamily: "'Ma Shan Zheng', 'Noto Serif SC', serif", letterSpacing: '0.05em' }}>源・华渡</h1>
                  <p className="text-[10px] text-muted-foreground tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>YUAN · HUADU</p>
                </div>
              </a>
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
              <Link href="/products">
                <a className="text-[oklch(82%_0.18_85)] hover:text-[oklch(90%_0.18_85)] transition-colors font-medium">
                  {t('nav.products')}
                </a>
              </Link>
              <Link href="/about">
                <a className="text-[oklch(82%_0.18_85)] hover:text-[oklch(90%_0.18_85)] transition-colors font-medium">
                  {t('nav.about')}
                </a>
              </Link>
              <LanguageSwitcher />
              {isAuthenticated ? (
                <>
                  <Link href="/cart">
                    <a className="relative group">
                      <ShoppingCart className="w-6 h-6 text-[oklch(82%_0.18_85)] group-hover:text-[oklch(90%_0.18_85)] transition-colors" />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                        0
                      </span>
                    </a>
                  </Link>
                  <Link href="/account">
                    <a className="text-[oklch(82%_0.18_85)] hover:text-[oklch(90%_0.18_85)] transition-colors font-medium">
                      {t('nav.account')}
                    </a>
                  </Link>
                </>
              ) : (
                <Button className="btn-primary">{t('nav.login')}</Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero区域 - 五台山寺庙背景 */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 背景图片层 */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
          <img
            src="/images/buddhist/wutai-temple-1.jpg"
            alt="Sacred Mount Wutai Temple"
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        <div className="container relative z-20 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* 开光认证标识 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-md rounded-full border border-accent/30 shadow-lg">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-accent text-sm font-medium">Blessed by Venerable Monks at Sacred Mount Wutai</span>
            </div>

            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
              <span className="text-accent" style={{ fontFamily: "'Noto Serif SC', serif" }}>{t('home.hero_title')}</span>
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
              {t('home.hero_subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/products">
                <Button className="btn-primary text-lg px-8 py-6">
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t('home.cta_products')}
                </Button>
              </Link>
              <Button variant="outline" className="text-lg px-8 py-6 border-accent/50 hover:bg-accent/10">
                {t('home.cta_fortune')}
              </Button>
            </div>

            {/* 三大保证 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
              {[
                { icon: Shield, title: "Sacred Blessing", desc: "Consecrated by Venerable Monks at Mount Wutai" },
                { icon: Sparkles, title: "Divine Protection", desc: "Manjusri's Wisdom & Lord Wuye's Prosperity" },
                { icon: Award, title: "Authentic Tradition", desc: "Thousand-Year Ancient Rituals" },
              ].map((item, i) => (
                <Card key={i} className="bg-card/60 backdrop-blur-md border-accent/20 hover:border-accent/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <item.icon className="w-10 h-10 text-accent mx-auto mb-3" />
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* 滚动提示 */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-accent" />
          </div>
        </div>
      </section>

      {/* 五大业务服务 */}
      <section className="py-20 relative z-10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-bold gradient-text glow-text mb-4">
              {t('home.services_title')}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.services_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 开光法物 */}
            <Card className="bg-card/80 backdrop-blur-md border-accent/30 hover:border-accent/60 transition-all hover:shadow-xl hover:shadow-accent/20 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-accent">{t('home.service_blessed_items')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('home.service_blessed_items_desc')}</p>
                <Link href="/products">
                  <Button variant="outline" size="sm" className="border-accent/50 hover:bg-accent/10">
                    {t('common.learn_more')}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* 命理服务 */}
            <Card className="bg-card/80 backdrop-blur-md border-accent/30 hover:border-accent/60 transition-all hover:shadow-xl hover:shadow-accent/20 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-accent">{t('home.service_fortune')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('home.service_fortune_desc')}</p>
                <Button variant="outline" size="sm" className="border-accent/50 hover:bg-accent/10">
                  {t('common.learn_more')}
                </Button>
              </CardContent>
            </Card>

            {/* 手相面相 */}
            <Card className="bg-card/80 backdrop-blur-md border-accent/30 hover:border-accent/60 transition-all hover:shadow-xl hover:shadow-accent/20 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-accent">{t('home.service_palmistry')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('home.service_palmistry_desc')}</p>
                <Button variant="outline" size="sm" className="border-accent/50 hover:bg-accent/10">
                  {t('common.learn_more')}
                </Button>
              </CardContent>
            </Card>

            {/* 家居风水 */}
            <Card className="bg-card/80 backdrop-blur-md border-accent/30 hover:border-accent/60 transition-all hover:shadow-xl hover:shadow-accent/20 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <HomeIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-accent">{t('home.service_fengshui')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('home.service_fengshui_desc')}</p>
                <Button variant="outline" size="sm" className="border-accent/50 hover:bg-accent/10">
                  {t('common.learn_more')}
                </Button>
              </CardContent>
            </Card>

            {/* 代祈福 */}
            <Card className="bg-card/80 backdrop-blur-md border-accent/30 hover:border-accent/60 transition-all hover:shadow-xl hover:shadow-accent/20 group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-accent">{t('home.service_blessing')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('home.service_blessing_desc')}</p>
                <Button variant="outline" size="sm" className="border-accent/50 hover:bg-accent/10">
                  {t('common.learn_more')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 精选开光饰品 */}
      <section className="py-24 relative z-10">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold gradient-text glow-text mb-4">
              {t('home.featured_title')}
            </h2>
            <p className="text-base text-muted-foreground text-center max-w-2xl mx-auto">
              {t('home.featured_subtitle')}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="lotus-loader">
                <Sparkles className="w-16 h-16 text-accent" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts?.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <Card className="product-card group cursor-pointer h-full">
                    <div className="relative overflow-hidden aspect-square">
                      <img
                        src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&q=80"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      {product.featured && (
                        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-bold">
                          FEATURED
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.salePrice && product.salePrice < product.regularPrice ? (
                            <>
                              <span className="text-2xl font-bold text-accent">
                                ${product.salePrice}
                              </span>
                              <span className="text-sm text-muted-foreground line-through ml-2">
                                ${product.regularPrice}
                              </span>
                            </>
                          ) : (
                            <span className="text-2xl font-bold text-accent">
                              ${product.regularPrice}
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button className="btn-primary text-lg px-8 py-6">
                {t('common.view_more')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 正统开光仪式 */}
      <section className="py-24 relative z-10 overflow-hidden">
        {/* 五台山全景背景 */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/buddhist/wutai-panorama.webp"
            alt="Mount Wutai Panorama"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background/90" />
        </div>
        <div className="container relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl md:text-4xl font-bold gradient-text glow-text mb-4">
              {t('home.blessing_title')}
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.blessing_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: t('home.blessing_step1'), desc: t('home.blessing_step1_desc'), icon: "🕉️" },
              { step: "02", title: t('home.blessing_step2'), desc: t('home.blessing_step2_desc'), icon: "📿" },
              { step: "03", title: t('home.blessing_step3'), desc: t('home.blessing_step3_desc'), icon: "✨" },
            ].map((item, i) => (
              <Card key={i} className="bg-card/80 backdrop-blur-md border-accent/20 hover:border-accent/50 transition-all group relative overflow-hidden">
                <CardContent className="p-8 text-center relative z-10">
                  {/* 佛教装饰背景 */}
                  {i === 1 && (
                    <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                      <img src="/images/buddhist/manjusri.jpg" alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="text-6xl mb-4">{item.icon}</div>
                  <div className="text-4xl font-bold text-accent/30 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                  <CheckCircle2 className="w-8 h-8 text-accent mx-auto mt-6" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* 页脚 */}
      <footer className="bg-card/50 backdrop-blur-md border-t border-accent/20 py-12 relative z-10">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl gradient-text mb-4">{t('home.footer_about')}</h3>
              <p className="text-sm text-muted-foreground">
                {t('home.footer_about_desc')}
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t('home.footer_links')}</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products"><a className="text-muted-foreground hover:text-accent transition-colors">{t('nav.products')}</a></Link></li>
                <li><Link href="/about"><a className="text-muted-foreground hover:text-accent transition-colors">{t('nav.about')}</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">{t('home.footer_contact')}</h3>
              <p className="text-sm text-muted-foreground">Email: info@cneraart.com</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {/* Social media icons */}
              </div>
            </div>
          </div>
          <div className="border-t border-accent/20 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2026 源・华渡 Yuan·Huadu. {t('home.footer_copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
