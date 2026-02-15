import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Sparkles, Heart, Eye, Hand, MapPin, Flame } from "lucide-react";

export default function Home() {
  const { t } = useTranslation();
  const { data: featuredProducts } = trpc.products.list.useQuery({ featured: true, limit: 4 });

  return (
    <div className="min-h-screen">
      {/* 导航栏 - 枣红色 */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#8B1A1A] shadow-lg">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/">
              <a className="flex items-center gap-3 group">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-amber-400">源 · 华渡</span>
                  <span className="text-xs text-amber-300 tracking-widest">YUAN · HUADU</span>
                </div>
              </a>
            </Link>

            {/* 导航链接 */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/products">
                <a className="text-amber-300 hover:text-amber-100 font-medium transition-colors">
                  {t('nav.products')}
                </a>
              </Link>
              <Link href="/about">
                <a className="text-amber-300 hover:text-amber-100 font-medium transition-colors">
                  {t('nav.about')}
                </a>
              </Link>
              <Link href="/cart">
                <a className="text-amber-300 hover:text-amber-100 font-medium transition-colors">
                  {t('nav.cart')}
                </a>
              </Link>
              <Link href="/account">
                <a className="text-amber-300 hover:text-amber-100 font-medium transition-colors">
                  {t('nav.account')}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero区域 - 使用真实金色佛塔照片 */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden mt-20">
        {/* 背景图片 - 金色佛塔 */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/ROpxIzavxRIvCgNk.jpg)',
            backgroundPosition: 'center center'
          }}
        />
        
        {/* 深色渐变遮罩 - 只在上下,不遮挡中间 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
        
        {/* 内容 - 简洁,不遮挡背景 */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          {/* 顶部装饰 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400"></div>
            <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400"></div>
          </div>
          
          {/* 主标题 */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
            {t('home.hero_title')}
          </h1>
          
          {/* 副标题 */}
          <p className="text-xl md:text-2xl text-gray-100 mb-4 font-light tracking-wide drop-shadow-lg">
            {t('home.hero_subtitle')}
          </p>
        </div>

        {/* 底部装饰波浪 */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#1a1410" 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* 开光流程展示区域 - 新增 */}
      <section className="py-24 bg-gradient-to-b from-[#1a1410] via-[#2a1f18] to-[#1a1410]">
        <div className="container mx-auto px-6">
          {/* 标题 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
              {t('home.blessing_title')}
            </h2>
            <p className="text-lg text-amber-200/80 max-w-3xl mx-auto font-light leading-relaxed">
              {t('home.blessing_subtitle')}
            </p>
          </div>

          {/* 流程步骤 - 4步 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {/* 步骤1: 圣水清净 */}
            <div className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/IdJDJdSZChEbWoKl.jpg"
                  alt="圣水清净仪轨"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-light text-amber-300 mb-2">{t('home.blessing_step1')}</h3>
              <p className="text-sm text-amber-200/60 font-light leading-relaxed">{t('home.blessing_step1_desc')}</p>
            </div>

            {/* 步骤2: 七日诵经 */}
            <div className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/NyjdrRqleQWwamar.jpg"
                  alt="七日诵经法会"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-light text-amber-300 mb-2">{t('home.blessing_step2')}</h3>
              <p className="text-sm text-amber-200/60 font-light leading-relaxed">{t('home.blessing_step2_desc')}</p>
            </div>

            {/* 步骤3: 能量灌顶 */}
            <div className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/UjvdqOMKIQUwyPRt.jpg"
                  alt="神圣能量灌顶"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-light text-amber-300 mb-2">{t('home.blessing_step3')}</h3>
              <p className="text-sm text-amber-200/60 font-light leading-relaxed">{t('home.blessing_step3_desc')}</p>
            </div>

            {/* 步骤4: 证书认证 */}
            <div className="group">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6 shadow-2xl">
                <img 
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/CtjkaNRwTtRHApgm.jpg"
                  alt="开光证书认证"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <span className="text-white font-bold text-xl">4</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-light text-amber-300 mb-2">{t('home.blessing_step4')}</h3>
              <p className="text-sm text-amber-200/60 font-light leading-relaxed">{t('home.blessing_step4_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 服务区域 - 使用佛像背景 */}
      <section className="py-24 relative overflow-hidden">
        {/* 背景图片 - 佛像虚化 */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/MoLPIPAKnackyMOl.jpg)',
            filter: 'blur(8px)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410] via-[#2a1f18]/95 to-[#1a1410]" />

        <div className="container mx-auto px-6 relative z-10">
          {/* 标题 */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
              {t('home.services_title')}
            </h2>
            <p className="text-lg text-amber-200/80 max-w-2xl mx-auto font-light">
              {t('home.services_subtitle')}
            </p>
          </div>

          {/* 服务卡片网格 - 3列 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* 卡片1: 开光法物 - 使用莲花图标 */}
            <Link href="/products">
              <a className="block group">
                <div className="relative h-full bg-gradient-to-br from-amber-900/30 to-orange-900/30 backdrop-blur-xl border border-amber-500/40 rounded-2xl p-8 hover:scale-105 hover:border-amber-400/70 transition-all duration-500 shadow-2xl">
                  {/* 玻璃态光晕效果 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  {/* 莲花图标 */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                      <span className="text-4xl">🪷</span>
                    </div>
                  </div>
                  
                  {/* 标题 - 细字体 */}
                  <h3 className="text-2xl font-light text-amber-100 mb-3 text-center tracking-wide">
                    {t('home.service_blessed_items')}
                  </h3>
                  
                  {/* 描述 - 细字体 */}
                  <p className="text-amber-200/70 text-center leading-relaxed font-light text-sm">
                    {t('home.service_blessed_items_desc')}
                  </p>
                  
                  {/* 查看更多 */}
                  <div className="mt-6 text-center">
                    <span className="inline-flex items-center gap-2 text-amber-300 font-light group-hover:gap-4 transition-all">
                      {t('home.cta_products')}
                      <span className="text-xl">→</span>
                    </span>
                  </div>
                </div>
              </a>
            </Link>

            {/* 卡片2: 命理服务合集 - 使用念珠图标 */}
            <div className="relative group">
              <div className="relative h-full bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-xl border border-purple-500/40 rounded-2xl p-8 hover:scale-105 hover:border-purple-400/70 transition-all duration-500 shadow-2xl">
                {/* 玻璃态光晕效果 */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                
                {/* 念珠图标 */}
                <div className="relative mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                    <span className="text-4xl">📿</span>
                  </div>
                </div>
                
                {/* 标题 - 细字体 */}
                <h3 className="relative text-2xl font-light text-purple-100 mb-6 text-center tracking-wide">
                  {t('home.service_fortune_collection')}
                </h3>
                
                {/* 子服务列表 */}
                <div className="space-y-4">
                  {/* 子服务1: 命理运势 */}
                  <Link href="/fortune">
                    <a className="block p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all border border-purple-500/20 hover:border-purple-400/40">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center shadow-lg">
                            <Hand className="w-5 h-5 text-white" strokeWidth={1.5} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-light text-purple-100 mb-1 text-sm">
                            {t('home.service_fortune_short')}
                          </h4>
                          <p className="text-xs text-purple-200/60 font-light leading-relaxed">
                            {t('home.service_fortune_desc')}
                          </p>
                        </div>
                      </div>
                    </a>
                  </Link>

                  {/* 子服务2: 手相面相 */}
                  <Link href="/fortune">
                    <a className="block p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all border border-purple-500/20 hover:border-purple-400/40">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-lg flex items-center justify-center shadow-lg">
                            <Eye className="w-5 h-5 text-white" strokeWidth={1.5} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-light text-purple-100 mb-1 text-sm">
                            {t('home.service_palmistry_short')}
                          </h4>
                          <p className="text-xs text-purple-200/60 font-light leading-relaxed">
                            {t('home.service_palmistry_desc')}
                          </p>
                        </div>
                      </div>
                    </a>
                  </Link>

                  {/* 子服务3: 家居风水 */}
                  <Link href="/fortune">
                    <a className="block p-4 bg-white/5 backdrop-blur-sm rounded-xl hover:bg-white/10 transition-all border border-purple-500/20 hover:border-purple-400/40">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-violet-700 rounded-lg flex items-center justify-center shadow-lg">
                            <MapPin className="w-5 h-5 text-white" strokeWidth={1.5} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-light text-purple-100 mb-1 text-sm">
                            {t('home.service_fengshui_short')}
                          </h4>
                          <p className="text-xs text-purple-200/60 font-light leading-relaxed">
                            {t('home.service_fengshui_desc')}
                          </p>
                        </div>
                      </div>
                    </a>
                  </Link>
                </div>
              </div>
            </div>

            {/* 卡片3: 代祈福服务 - 使用香炉图标 */}
            <Link href="/products?category=blessing">
              <a className="block group">
                <div className="relative h-full bg-gradient-to-br from-rose-900/30 to-pink-900/30 backdrop-blur-xl border border-rose-500/40 rounded-2xl p-8 hover:scale-105 hover:border-rose-400/70 transition-all duration-500 shadow-2xl">
                  {/* 玻璃态光晕效果 */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-400/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  
                  {/* 香炉图标 */}
                  <div className="relative mb-6 flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-xl group-hover:rotate-12 transition-transform duration-500">
                      <Flame className="w-10 h-10 text-white" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  {/* 标题 - 细字体 */}
                  <h3 className="text-2xl font-light text-rose-100 mb-3 text-center tracking-wide">
                    {t('home.service_blessing')}
                  </h3>
                  
                  {/* 描述 - 细字体 */}
                  <p className="text-rose-200/70 text-center leading-relaxed font-light text-sm">
                    {t('home.service_blessing_desc')}
                  </p>
                  
                  {/* 查看更多 */}
                  <div className="mt-6 text-center">
                    <span className="inline-flex items-center gap-2 text-rose-300 font-light group-hover:gap-4 transition-all">
                      {t('home.cta_products')}
                      <span className="text-xl">→</span>
                    </span>
                  </div>
                </div>
              </a>
            </Link>

          </div>
        </div>
      </section>

      {/* 精选产品区域 */}
      <section className="py-24 bg-gradient-to-b from-[#1a1410] to-[#2a1f18]">
        <div className="container mx-auto px-6">
          {/* 标题 */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500"></div>
              <Sparkles className="w-6 h-6 text-amber-500" />
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500"></div>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-amber-400 mb-4">
              {t('home.featured_title')}
            </h2>
            <p className="text-lg text-amber-200/80 max-w-2xl mx-auto font-light">
              {t('home.featured_subtitle')}
            </p>
          </div>

          {/* 产品网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {featuredProducts && featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <a className="block group">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-amber-500/20 hover:border-amber-500/50 transition-all duration-500 hover:scale-105 shadow-2xl">
                      {/* 产品图片 */}
                      <div className="relative aspect-square overflow-hidden bg-gray-800">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-16 h-16 text-gray-600" />
                          </div>
                        )}
                        {/* 折扣标签 */}
                        {product.salePrice && product.regularPrice && Number(product.salePrice) < Number(product.regularPrice) && (
                          <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                            -{Math.round((1 - Number(product.salePrice) / Number(product.regularPrice)) * 100)}%
                          </div>
                        )}
                      </div>
                      
                      {/* 产品信息 */}
                      <div className="p-6">
                        <h3 className="font-light text-lg text-amber-100 mb-2 group-hover:text-amber-400 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                          {product.salePrice && product.regularPrice && Number(product.salePrice) < Number(product.regularPrice) ? (
                            <>
                              <span className="text-2xl font-bold text-amber-400">
                                ${Number(product.salePrice).toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                ${Number(product.regularPrice).toFixed(2)}
                              </span>
                            </>
                          ) : product.regularPrice ? (
                            <span className="text-2xl font-bold text-amber-400">
                              ${Number(product.regularPrice).toFixed(2)}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </a>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center text-amber-200/60 py-12">
                {t('products.no_results')}
              </div>
            )}
          </div>

          {/* 查看全部按钮 */}
          {featuredProducts && featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/products">
                <a className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-light hover:from-amber-500 hover:to-orange-500 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                  {t('home.cta_products')}
                  <span className="text-xl">→</span>
                </a>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1410] border-t border-amber-500/20 py-12">
        <div className="container mx-auto px-6">
          <div className="text-center text-amber-200/60 font-light">
            <p className="mb-2">© 2024 源·华渡 (Yuan Huadu)</p>
            <p className="text-sm">{t('home.footer_about_desc')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
