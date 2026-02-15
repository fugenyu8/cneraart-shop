import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ShoppingCart, Sparkles, Heart, Shield } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { data: featuredProducts, isLoading } = trpc.products.featured.useQuery();

  return (
    <div className="min-h-screen">
      {/* 导航栏 */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <a className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold gradient-text">源・华渡</h1>
                  <p className="text-xs text-muted-foreground">东方灵性商城</p>
                </div>
              </a>
            </Link>

            <div className="flex items-center gap-6">
              <Link href="/products">
                <a className="text-foreground hover:text-accent transition-colors">产品</a>
              </Link>
              <Link href="/about">
                <a className="text-foreground hover:text-accent transition-colors">关于我们</a>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/cart">
                    <a className="relative">
                      <ShoppingCart className="w-6 h-6 text-foreground hover:text-accent transition-colors" />
                    </a>
                  </Link>
                  <Link href="/account">
                    <a className="text-foreground hover:text-accent transition-colors">我的账户</a>
                  </Link>
                </>
              ) : (
                <Button className="btn-primary">登录</Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero区域 - 全屏背景 */}
      <section className="relative min-h-[80vh] flex items-center justify-center pattern-bg overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="container relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
            古老东方的祝福
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            守护您的人生旅程 · 传承千年智慧
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/products">
              <Button className="btn-primary text-lg px-8 py-6">
                探索开光饰品
              </Button>
            </Link>
            <Link href="/services">
              <Button variant="outline" className="text-lg px-8 py-6 border-accent text-accent hover:bg-accent/10">
                预约命理分析
              </Button>
            </Link>
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-accent rounded-full flex justify-center">
            <div className="w-1 h-3 bg-accent rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* 精选产品区 */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 gradient-text">精选开光饰品</h3>
            <div className="divider-ornament">
              <Sparkles className="w-6 h-6 text-accent" />
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
              每一件饰品均由五台山高僧亲自开光加持，承载千年佛法智慧，为您带来平安与祝福
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="product-card h-96 image-placeholder"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts?.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  <Card className="product-card cursor-pointer group">
                    <div className="relative h-64 overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Sparkles className="w-16 h-16 text-muted-foreground" />
                        </div>
                      )}
                      {product.salePrice && (
                        <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full">
                          <span className="text-sm font-bold">特惠</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {product.shortDescription}
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          {product.salePrice ? (
                            <div className="flex items-center gap-2">
                              <span className="text-2xl font-bold text-accent">
                                ${product.salePrice}
                              </span>
                              <span className="text-sm text-muted-foreground line-through">
                                ${product.regularPrice}
                              </span>
                            </div>
                          ) : (
                            <span className="text-2xl font-bold text-accent">
                              ${product.regularPrice}
                            </span>
                          )}
                        </div>
                        <Button size="sm" className="bg-accent hover:bg-accent/90">
                          查看详情
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
              <Button variant="outline" className="border-accent text-accent hover:bg-accent/10">
                查看全部产品
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 开光仪式展示区 */}
      <section className="py-20">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-6 gradient-text">五台山开光仪式</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                每一件饰品都经过五台山文殊菩萨道场的正统开光仪式。由修行数十年的高僧大德主持，
                遵循古法仪轨，诵经加持，为饰品注入佛法能量，祈愿佩戴者平安吉祥、智慧增长。
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">正统传承</h4>
                    <p className="text-sm text-muted-foreground">
                      遵循千年佛教仪轨，由五台山高僧亲自主持
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">能量加持</h4>
                    <p className="text-sm text-muted-foreground">
                      诵经祈福，为饰品注入佛法能量与祝福
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">用心服务</h4>
                    <p className="text-sm text-muted-foreground">
                      每件饰品附带开光证书，确保真实可靠
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden border border-border shadow-glow-md">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Sparkles className="w-24 h-24 text-muted-foreground" />
                </div>
              </div>
              {/* 装饰元素 */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-primary/20 rounded-full blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 客户见证 */}
      <section className="py-20 bg-card/50">
        <div className="container">
          <div className="text-center mb-12">
            <h3 className="text-4xl font-bold mb-4 gradient-text">客户见证</h3>
            <div className="divider-ornament">
              <Heart className="w-6 h-6 text-accent" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "张女士",
                location: "美国加州",
                rating: 5,
                comment: "收到北斗七星吊坠后，感觉整个人的运势都变好了。做工精美，能量很强，非常满意！",
              },
              {
                name: "李先生",
                location: "加拿大多伦多",
                rating: 5,
                comment: "命理报告非常准确，大师的分析让我对未来有了更清晰的规划。强烈推荐！",
              },
              {
                name: "王女士",
                location: "美国纽约",
                rating: 5,
                comment: "开光仪式很正统，收到饰品时能感受到满满的祝福能量。客服态度也很好。",
              },
            ].map((testimonial, i) => (
              <Card key={i} className="bg-card border-border hover:border-accent transition-colors">
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Sparkles key={i} className="w-5 h-5 text-accent fill-accent" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.comment}"</p>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-background border-t border-border py-12">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-accent">关于我们</h4>
              <p className="text-sm text-muted-foreground">
                源・华渡致力于传承东方文化，为全球华人提供正统的开光饰品和命理服务。
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">产品分类</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/products?category=jewelry"><a className="hover:text-accent transition-colors">开光饰品</a></Link></li>
                <li><Link href="/products?category=blessing"><a className="hover:text-accent transition-colors">祈福服务</a></Link></li>
                <li><Link href="/products?category=report"><a className="hover:text-accent transition-colors">命理报告</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">客户服务</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/shipping"><a className="hover:text-accent transition-colors">配送政策</a></Link></li>
                <li><Link href="/returns"><a className="hover:text-accent transition-colors">退换货政策</a></Link></li>
                <li><Link href="/faq"><a className="hover:text-accent transition-colors">常见问题</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">联系我们</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>邮箱: info@cneraart.com</li>
                <li>微信: cneraart</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 源・华渡 (cneraart). All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
