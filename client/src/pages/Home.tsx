import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Sparkles, Heart, Eye, Hand, MapPin, Flame } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const { data: featuredProducts } = trpc.products.list.useQuery({ featured: true, limit: 4 });

  return (
    <div className="min-h-screen">
      {/* 导航栏 - 明亮金黄色 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-white">源 · 华渡</span>
                  <span className="text-xs text-amber-100 tracking-widest">YUAN · HUADU</span>
                </div>
              </a>
            </Link>

            {/* 导航链接 */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/products">
                <a className="text-white hover:text-amber-100 font-medium transition-colors">
                  {t('nav.products')}
                </a>
              </Link>
              <Link href="/about">
                <a className="text-white hover:text-amber-100 font-medium transition-colors">
                  {t('nav.about')}
                </a>
              </Link>
              <Link href="/cart">
                <a className="text-white hover:text-amber-100 font-medium transition-colors">
                  {t('nav.cart')}
                </a>
              </Link>
              <Link href="/account">
                <a className="text-white hover:text-amber-100 font-medium transition-colors">
                  {t('nav.account')}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero区域 - 五台山寺庙背景 */}
      <section 
        className="relative h-screen flex items-center justify-center text-center pt-20"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.4)), url('https://d3hxnbuh28d4ew.cloudfront.net/3c1d0f8a-d0b7-4e9a-8e42-c6e0f8b9a7d2/fojiaowutaishan1(16).jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* 金色装饰线 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-24 bg-gradient-to-r from-transparent to-amber-400"></div>
            <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            <div className="h-px w-24 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl" style={{ fontFamily: "'Brush Script MT', cursive" }}>
            Ancient Eastern Blessings
          </h1>
          <p className="text-xl md:text-2xl text-amber-100 font-light tracking-wide drop-shadow-lg">
            Protecting Your Life Journey · Passing Down Thousand-Year Wisdom
          </p>
        </div>

        {/* 底部渐变遮罩 */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900 to-transparent"></div>
      </section>

      {/* 服务卡片区域 - 明亮金黄色系 */}
      <section className="py-24 bg-gradient-to-b from-zinc-900 to-zinc-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400"></div>
              <Sparkles className="w-6 h-6 text-amber-400" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400"></div>
            </div>
            <h2 className="text-4xl font-bold text-amber-400 mb-4">Our Sacred Services</h2>
            <p className="text-amber-200 text-lg font-light">Ancient Eastern Wisdom · Modern Spiritual Guidance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 开光法物卡片 - 明亮金黄色 */}
            <Link href="/products?category=blessed">
              <a className="group relative bg-gradient-to-br from-amber-400/20 to-yellow-500/20 backdrop-blur-sm rounded-2xl p-8 border border-amber-400/30 hover:border-amber-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 to-yellow-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-amber-500/50 group-hover:shadow-amber-500/70 transition-shadow">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-amber-300 mb-3 text-center">Blessed Artifacts</h3>
                  <p className="text-amber-200/80 text-center mb-6 font-light">Sacred items consecrated by Mount Wutai monks</p>
                  
                  <div className="text-center">
                    <span className="text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
                      Explore Blessed Items →
                    </span>
                  </div>
                </div>
              </a>
            </Link>

            {/* 命理服务卡片 - 明亮琥珀色 */}
            <div className="group relative bg-gradient-to-br from-yellow-400/20 to-amber-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-amber-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-yellow-500/50 group-hover:shadow-yellow-500/70 transition-shadow">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-yellow-300 mb-6 text-center">Fortune Services</h3>
                
                <div className="space-y-4">
                  <Link href="/fortune/destiny">
                    <a className="block bg-amber-900/30 hover:bg-amber-900/50 rounded-xl p-4 border border-amber-600/20 hover:border-amber-500/40 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Hand className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-amber-200 font-semibold mb-1">Destiny Analysis</h4>
                          <p className="text-amber-300/70 text-sm font-light">Ancient Chinese wisdom for life path and fortune guidance</p>
                        </div>
                      </div>
                    </a>
                  </Link>

                  <Link href="/fortune/palm">
                    <a className="block bg-amber-900/30 hover:bg-amber-900/50 rounded-xl p-4 border border-amber-600/20 hover:border-amber-500/40 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Eye className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-amber-200 font-semibold mb-1">Palm & Face Reading</h4>
                          <p className="text-amber-300/70 text-sm font-light">Ancient wisdom through hand and facial analysis</p>
                        </div>
                      </div>
                    </a>
                  </Link>

                  <Link href="/fortune/fengshui">
                    <a className="block bg-amber-900/30 hover:bg-amber-900/50 rounded-xl p-4 border border-amber-600/20 hover:border-amber-500/40 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-amber-200 font-semibold mb-1">Feng Shui Analysis</h4>
                          <p className="text-amber-300/70 text-sm font-light">Harmonize your living space with cosmic energy</p>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>

            {/* 代祈福卡片 - 明亮金色 */}
            <Link href="/products?category=prayer">
              <a className="group relative bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-amber-500/30 hover:border-amber-500/60 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-amber-600/20">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-amber-600/50 group-hover:shadow-amber-600/70 transition-shadow">
                    <Flame className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-amber-300 mb-3 text-center">Prayer Services</h3>
                  <p className="text-amber-200/80 text-center mb-6 font-light">Lamp offerings, incense, and blessing rituals</p>
                  
                  <div className="text-center">
                    <span className="text-amber-400 font-medium group-hover:text-amber-300 transition-colors">
                      Explore Blessed Items →
                    </span>
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* 产品区域 - 提前到这里 */}
      <section className="py-24 bg-gradient-to-b from-zinc-800 to-zinc-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400"></div>
              <Sparkles className="w-6 h-6 text-amber-400" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400"></div>
            </div>
            <h2 className="text-4xl font-bold text-amber-400 mb-4">Featured Blessed Items</h2>
            <p className="text-amber-200 text-lg font-light">Each piece is blessed at Wutai Mountain, carrying the power of protection</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {featuredProducts?.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <a className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/20 transition-all duration-300 hover:-translate-y-2 border-2 border-amber-400/30 hover:border-amber-400/60">
                  {/* 折扣标签 - 明亮红色 */}
                  {product.salePrice && Number(product.salePrice) < Number(product.regularPrice) && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      -{Math.round((1 - Number(product.salePrice) / Number(product.regularPrice)) * 100)}%
                    </div>
                  )}

                  {/* 产品图片 */}
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
                    <img
                      src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* 产品信息 */}
                  <div className="p-6 bg-gradient-to-br from-amber-50 to-yellow-50">
                    <h3 className="text-lg font-bold text-zinc-800 mb-3 group-hover:text-amber-700 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-amber-600">
                          ${product.salePrice ? Number(product.salePrice).toFixed(2) : Number(product.regularPrice).toFixed(2)}
                        </span>
                        {product.salePrice && Number(product.salePrice) < Number(product.regularPrice) && (
                          <span className="text-sm text-zinc-400 line-through">
                            ${Number(product.regularPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 金色光晕效果 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-400/0 via-transparent to-transparent opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                </a>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <a className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white px-8 py-4 rounded-full font-semibold hover:from-amber-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl hover:shadow-amber-500/50">
                Explore Blessed Items
                <Sparkles className="w-5 h-5" />
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* 开光流程 - 横向滚动小卡片 */}
      <section className="py-24 bg-gradient-to-b from-zinc-900 to-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-amber-400 mb-3">五台山开光仪轨</h2>
            <p className="text-amber-200 font-light">文殊菩萨道场 · 千年传承</p>
          </div>

          {/* 横向滚动容器 */}
          <div className="overflow-x-auto pb-6 scrollbar-hide">
            <div className="flex gap-6 min-w-max px-6">
              {/* 步骤1 */}
              <div className="w-72 flex-shrink-0 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-amber-500/30 hover:border-amber-500/60 transition-all hover:scale-105">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="https://d3hxnbuh28d4ew.cloudfront.net/3c1d0f8a-d0b7-4e9a-8e42-c6e0f8b9a7d2/hh1(5).jpg"
                    alt="圣水净化"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                    1
                  </div>
                  <h3 className="text-lg font-bold text-amber-300 mb-2">圣水净化</h3>
                  <p className="text-amber-200/70 text-sm font-light">香水沐浴,涤除尘垢</p>
                </div>
              </div>

              {/* 步骤2 */}
              <div className="w-72 flex-shrink-0 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-amber-500/30 hover:border-amber-500/60 transition-all hover:scale-105">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="https://d3hxnbuh28d4ew.cloudfront.net/3c1d0f8a-d0b7-4e9a-8e42-c6e0f8b9a7d2/0%E4%BD%9B%E6%B4%BB%E5%8A%A8%E5%9C%BA%E6%99%AF2(11).jpg"
                    alt="诵经加持"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                    2
                  </div>
                  <h3 className="text-lg font-bold text-amber-300 mb-2">诵经加持</h3>
                  <p className="text-amber-200/70 text-sm font-light">高僧诵经,注入灵性</p>
                </div>
              </div>

              {/* 步骤3 */}
              <div className="w-72 flex-shrink-0 bg-gradient-to-br from-amber-900/30 to-yellow-900/30 backdrop-blur-sm rounded-xl overflow-hidden border border-amber-500/30 hover:border-amber-500/60 transition-all hover:scale-105">
                <div className="aspect-video overflow-hidden">
                  <img
                    src="https://d3hxnbuh28d4ew.cloudfront.net/3c1d0f8a-d0b7-4e9a-8e42-c6e0f8b9a7d2/fojiaowutaishan1(16).jpg"
                    alt="圣地灌顶"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold mb-3">
                    3
                  </div>
                  <h3 className="text-lg font-bold text-amber-300 mb-2">圣地灌顶</h3>
                  <p className="text-amber-200/70 text-sm font-light">五台山能量加持</p>
                </div>
              </div>
            </div>
          </div>

          {/* 滚动提示 */}
          <div className="text-center mt-6">
            <p className="text-amber-300/50 text-sm font-light">← 左右滑动查看完整流程 →</p>
          </div>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="bg-black py-12 border-t border-amber-900/30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span className="text-xl font-bold text-amber-400">源 · 华渡</span>
          </div>
          <p className="text-amber-200/60 text-sm font-light">
            Ancient Eastern Blessings · Protecting Your Life Journey
          </p>
          <p className="text-amber-200/40 text-xs mt-4">
            © 2024 Yuan Huadu. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
