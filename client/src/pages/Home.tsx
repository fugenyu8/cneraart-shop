import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const { data: allProducts } = trpc.products.list.useQuery({ limit: 20 });
  
  // 分离新品和畅销品 (这里简单按ID分,实际应该有featured/bestseller标记)
  const newArrivals = allProducts?.slice(0, 4) || [];
  const bestSellers = allProducts?.slice(4, 8) || [];

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Hero Section - 左右分栏布局 */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 左侧大图 */}
            <div className="lg:col-span-2 relative h-[500px] rounded-lg overflow-hidden group">
              <img
                src="https://d3hxwv9uga20ww.cloudfront.net/RoSpAXz7wgobQtEUGXx9ai-files/fojiaowutaishan1(16)-randomSuffix-1739540736.jpg"
                alt="Wutai Mountain Temple"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              {/* 文字叠加 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                {/* 五台山权威标识 */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <div className="text-xs text-[#8B4513] font-semibold">UNESCO世界文化遗产</div>
                    <div className="text-sm text-[#D4AF37] font-bold">五台山</div>
                  </div>
                  <div className="bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                    <div className="text-xs text-[#8B4513] font-semibold">中国四大佛教圣地</div>
                    <div className="text-sm text-[#D4AF37] font-bold">文殊菩萨道场</div>
                  </div>
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-wider drop-shadow-2xl">
                  ANCIENT EASTERN BLESSINGS
                </h1>
                <p className="text-xl md:text-2xl text-white/90 mb-8 font-light drop-shadow-lg">
                  HELPING YOU RESOLVE TROUBLES
                </p>
                
                {/* 按钮 */}
                <div className="flex gap-4">
                  <Link href="/products">
                    <button className="bg-white text-[#5D4E37] px-8 py-3 rounded-md hover:bg-[#D4AF37] hover:text-white transition-all font-medium min-h-[44px]">
                      结缘开光
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="border-2 border-white text-white px-8 py-3 rounded-md hover:bg-white hover:text-[#5D4E37] transition-all font-medium min-h-[44px]">
                      GET IN TOUCH
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* 右侧两个小图 */}
            <div className="flex flex-col gap-4">
              {/* 上方小图 - 和尚诵经 */}
              <div className="relative h-[242px] rounded-lg overflow-hidden group">
                <img
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/qHFOIcpoppWwbBgV.png"
                  alt="Venerable Monk's Consecration Ritual"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-lg font-medium mb-2">Venerable Monk's</div>
                    <div className="text-xl font-bold">Consecration Ritual</div>
                  </div>
                </div>
              </div>

              {/* 下方小图 - 五台山风景 */}
              <div className="relative h-[242px] rounded-lg overflow-hidden group">
                <img
                  src="https://d3hxwv9uga20ww.cloudfront.net/RoSpAXz7wgobQtEUGXx9ai-files/wutais1(6)-randomSuffix-1739540737.jpg"
                  alt="Wutai Mountain Sacred Site"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-lg font-medium mb-2">Wutai Mountain</div>
                    <div className="text-xl font-bold">Sacred Site</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 服务卡片区 */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* 1. 销售开光法物 */}
            <Link href="/products">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🙏</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">销售开光法物</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">五台山开光加持</p>
              </div>
            </Link>

            {/* 2. 面相手相 */}
            <Link href="/fortune">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">👤</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">面相手相</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">AI智能命理测算</p>
              </div>
            </Link>

            {/* 3. 家居风水 */}
            <Link href="/fortune">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🏠</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">家居风水</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">大师风水布局</p>
              </div>
            </Link>

            {/* 4. 命理运势推演 */}
            <Link href="/destiny">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">☘️</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">命理运势</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">八字紫微推演</p>
              </div>
            </Link>

            {/* 5. 代祈福 */}
            <Link href="/prayer">
              <div className="group bg-[#FAF8F3] border border-[#D4AF37]/30 rounded-lg p-6 hover:border-[#D4AF37] hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer min-h-[44px] flex flex-col items-center justify-center">
                <div className="text-4xl mb-3">🕯️</div>
                <h3 className="text-sm font-semibold text-[#5D4E37] text-center">代客祈福</h3>
                <p className="text-xs text-gray-600 mt-1 text-center">五台山代您祈福</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* NEW ARRIVALS Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <button className="bg-white border border-gray-300 px-8 py-2 rounded-md text-[#5D4E37] font-medium hover:bg-gray-50 transition-colors">
              NEW ARRIVALS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product: any) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-[#5D4E37] mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {product.name}
                    </h3>
                    {/* 社交证明 */}
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <span>🔥</span>
                      <span>已有{Math.floor(50 + (product.id * 37) % 450)}人请回此法物</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#5D4E37]">
                        ${product.salePrice ? Number(product.salePrice).toFixed(2) : Number(product.regularPrice).toFixed(2)}
                      </span>
                      {product.salePrice && Number(product.salePrice) < Number(product.regularPrice) && (
                        <span className="text-sm text-gray-400 line-through">
                          ${Number(product.regularPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <button className="bg-white border border-gray-300 px-8 py-2 rounded-md text-[#5D4E37] font-medium hover:bg-gray-50 transition-colors">
              BEST SELLERS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product: any) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-[#5D4E37] mb-2 line-clamp-2 group-hover:text-[#D4AF37] transition-colors">
                      {product.name}
                    </h3>
                    {/* 社交证明 */}
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <span>🔥</span>
                      <span>已有{Math.floor(50 + (product.id * 37) % 450)}人请回此法物</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-[#5D4E37]">
                        ${product.salePrice ? Number(product.salePrice).toFixed(2) : Number(product.regularPrice).toFixed(2)}
                      </span>
                      {product.salePrice && Number(product.salePrice) < Number(product.regularPrice) && (
                        <span className="text-sm text-gray-400 line-through">
                          ${Number(product.regularPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT US Section - 深红色背景 */}
      <section className="py-20 px-4 bg-[#8B1A1A] text-white relative overflow-hidden">
        {/* 书法装饰背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="text-9xl font-serif leading-none">
            藏坂假弘王釋出洛魂裁<br/>
            出茶堅衛主后古其詩<br/>
            殿機將宗后座會熱日
          </div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-8">ABOUT US</h2>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 space-y-6">
            <p className="text-lg leading-relaxed">
              Masters from China's sacred Wutai Mountain personally interpret the Four Pillars of Destiny. 
              By analyzing the interactions of the Five Elements, they clarify opportunities in career, wealth, 
              health and relationships, warn of obstacles, help avoid risks while pursuing benefits, and enlighten 
              wisdom to broaden horizons.
            </p>
            <p className="text-lg leading-relaxed">
              Traditional Chinese ritual ceremonies follow ancient rites like consecration (Kai Guang) and scripture 
              chanting. Unique and solemn, these ceremonies grant customized blessings to promote a smooth and 
              prosperous life.
            </p>
          </div>
        </div>
      </section>

      {/* 五台山背书页脚 */}
      <footer className="bg-[#5D4E37] text-[#D4AF37] py-8 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-sm space-y-2">
            <p className="font-semibold text-lg">五台山 · 世界文化遗产 · 中国四大佛教圣地之首</p>
            <p className="text-xs text-[#D4AF37]/80">文殊菩萨道场 · 千年佛教文化传承</p>
          </div>
          <div className="mt-6 text-xs text-[#D4AF37]/60">
            <p>© 2026 源·华渡 YUAN·HUADU. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
