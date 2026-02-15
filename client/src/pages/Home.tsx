import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();
  const { data: featuredProducts } = trpc.products.list.useQuery({ featured: true, limit: 8 });

  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      {/* Hero Section - 五台山寺庙背景 */}
      <section 
        className="relative h-[600px] bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://d3hxwv9uga20ww.cloudfront.net/RoSpAXz7wgobQtEUGXx9ai-files/fojiaowutaishan1(16)-randomSuffix-1739540736.jpg')`
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <div className="mb-6">
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-4"></div>
            <div className="text-[#D4AF37] text-4xl mb-4">✦</div>
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-serif text-white mb-6">
            {t("hero.title")}
          </h1>
          
          <p className="text-xl text-white/90 max-w-2xl font-light">
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-4">
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-4"></div>
              <div className="text-[#D4AF37] text-3xl mb-4">✦</div>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
            </div>
            <h2 className="text-4xl font-serif text-[#5D4E37] mb-4">
              {t("services.title")}
            </h2>
            <p className="text-[#8B7355] text-lg font-light">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 开光法物 */}
            <Link href="/products?category=blessed">
              <a className="group block">
                <div className="bg-white rounded-lg p-8 border-2 border-[#D4AF37] hover:shadow-xl transition-all duration-300 text-center h-full">
                  <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#D4AF37] transition-colors">
                    <span className="text-4xl group-hover:scale-110 transition-transform">🪷</span>
                  </div>
                  <h3 className="text-2xl font-serif text-[#5D4E37] mb-4">
                    {t("services.blessed.title")}
                  </h3>
                  <p className="text-[#8B7355] mb-6 font-light leading-relaxed">
                    {t("services.blessed.description")}
                  </p>
                  <div className="inline-block border-2 border-[#D4AF37] px-6 py-2 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors font-light">
                    {t("services.blessed.cta")} →
                  </div>
                </div>
              </a>
            </Link>

            {/* 命理服务 */}
            <div className="bg-white rounded-lg p-8 border-2 border-[#D4AF37] text-center">
              <div className="mb-8">
                <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔮</span>
                </div>
                <h3 className="text-2xl font-serif text-[#5D4E37] mb-6">
                  {t("services.fortune.title")}
                </h3>
              </div>

              <div className="space-y-4">
                <Link href="/destiny-analysis">
                  <a className="block border-2 border-[#D4AF37]/50 rounded-lg p-4 hover:border-[#D4AF37] hover:bg-[#FAF8F3] transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🖐️</span>
                      <div className="text-left">
                        <div className="font-serif text-[#5D4E37]">{t("services.fortune.destiny.title")}</div>
                        <div className="text-sm text-[#8B7355] font-light">{t("services.fortune.destiny.description")}</div>
                      </div>
                    </div>
                  </a>
                </Link>

                <Link href="/palm-face-reading">
                  <a className="block border-2 border-[#D4AF37]/50 rounded-lg p-4 hover:border-[#D4AF37] hover:bg-[#FAF8F3] transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">👁️</span>
                      <div className="text-left">
                        <div className="font-serif text-[#5D4E37]">{t("services.fortune.palm.title")}</div>
                        <div className="text-sm text-[#8B7355] font-light">{t("services.fortune.palm.description")}</div>
                      </div>
                    </div>
                  </a>
                </Link>

                <Link href="/feng-shui">
                  <a className="block border-2 border-[#D4AF37]/50 rounded-lg p-4 hover:border-[#D4AF37] hover:bg-[#FAF8F3] transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📍</span>
                      <div className="text-left">
                        <div className="font-serif text-[#5D4E37]">{t("services.fortune.fengshui.title")}</div>
                        <div className="text-sm text-[#8B7355] font-light">{t("services.fortune.fengshui.description")}</div>
                      </div>
                    </div>
                  </a>
                </Link>
              </div>
            </div>

            {/* 代祈福服务 */}
            <Link href="/prayer-services">
              <a className="group block">
                <div className="bg-white rounded-lg p-8 border-2 border-[#D4AF37] hover:shadow-xl transition-all duration-300 text-center h-full">
                  <div className="w-20 h-20 rounded-full border-2 border-[#D4AF37] flex items-center justify-center mx-auto mb-6 group-hover:bg-[#D4AF37] transition-colors">
                    <span className="text-4xl group-hover:scale-110 transition-transform">🕯️</span>
                  </div>
                  <h3 className="text-2xl font-serif text-[#5D4E37] mb-4">
                    {t("services.prayer.title")}
                  </h3>
                  <p className="text-[#8B7355] mb-6 font-light leading-relaxed">
                    {t("services.prayer.description")}
                  </p>
                  <div className="inline-block border-2 border-[#D4AF37] px-6 py-2 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors font-light">
                    {t("services.prayer.cta")} →
                  </div>
                </div>
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-4">
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-4"></div>
              <div className="text-[#D4AF37] text-3xl mb-4">✦</div>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
            </div>
            <h2 className="text-4xl font-serif text-[#5D4E37] mb-4">
              {t("products.title")}
            </h2>
            <p className="text-[#8B7355] text-lg font-light">
              {t("products.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts?.map((product: any) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <a className="group block">
                  <div className="bg-[#FAF8F3] rounded-lg overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] hover:shadow-lg transition-all duration-300">
                    {/* 折扣标签 */}
                    {product.salePrice && Number(product.salePrice) < Number(product.regularPrice) && (
                      <div className="absolute top-4 left-4 z-10 bg-[#8B1A1A] text-white px-3 py-1 rounded-full text-sm font-light">
                        -{Math.round((1 - Number(product.salePrice) / Number(product.regularPrice)) * 100)}%
                      </div>
                    )}

                    {/* 产品图片 */}
                    <div className="aspect-square overflow-hidden bg-white">
                      <img
                        src={product.images?.[0]?.url || "/placeholder-product.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* 产品信息 */}
                    <div className="p-6">
                      <h3 className="text-lg font-serif text-[#5D4E37] mb-3 group-hover:text-[#D4AF37] transition-colors">
                        {product.name}
                      </h3>

                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-serif text-[#D4AF37]">
                          ${product.salePrice ? Number(product.salePrice).toFixed(2) : Number(product.regularPrice).toFixed(2)}
                        </span>
                        {product.salePrice && Number(product.salePrice) < Number(product.regularPrice) && (
                          <span className="text-sm text-[#8B7355]/60 line-through font-light">
                            ${Number(product.regularPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <a className="inline-block border-2 border-[#D4AF37] px-8 py-3 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white transition-colors font-light text-lg">
                {t("products.viewAll")} ✦
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Blessing Process Section - 横向滚动小卡片 */}
      <section className="py-20 px-4 bg-[#FAF8F3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="mb-4">
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-4"></div>
              <div className="text-[#D4AF37] text-3xl mb-4">✦</div>
              <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto"></div>
            </div>
            <h2 className="text-4xl font-serif text-[#5D4E37] mb-2">
              {t("blessing.title")}
            </h2>
            <p className="text-[#8B7355] font-light">
              {t("blessing.subtitle")}
            </p>
          </div>

          {/* 横向滚动容器 */}
          <div className="overflow-x-auto pb-6 scrollbar-hide">
            <div className="flex gap-6 min-w-max px-4">
              {/* 步骤1 */}
              <div className="w-72 flex-shrink-0">
                <div className="bg-white rounded-lg overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src="https://d3hxwv9uga20ww.cloudfront.net/RoSpAXz7wgobQtEUGXx9ai-files/wf1(1)-randomSuffix-1739540736.jpg"
                      alt="圣水净化"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif mb-4">
                      1
                    </div>
                    <h3 className="text-xl font-serif text-[#5D4E37] mb-2">
                      {t("blessing.step1.title")}
                    </h3>
                    <p className="text-[#8B7355] text-sm font-light">
                      {t("blessing.step1.description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* 步骤2 */}
              <div className="w-72 flex-shrink-0">
                <div className="bg-white rounded-lg overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src="https://d3hxwv9uga20ww.cloudfront.net/RoSpAXz7wgobQtEUGXx9ai-files/0%E4%BD%9B%E6%B4%BB%E5%8A%A8%E5%9C%BA%E6%99%AF2(19)-randomSuffix-1739540736.jpg"
                      alt="诵经加持"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif mb-4">
                      2
                    </div>
                    <h3 className="text-xl font-serif text-[#5D4E37] mb-2">
                      {t("blessing.step2.title")}
                    </h3>
                    <p className="text-[#8B7355] text-sm font-light">
                      {t("blessing.step2.description")}
                    </p>
                  </div>
                </div>
              </div>

              {/* 步骤3 */}
              <div className="w-72 flex-shrink-0">
                <div className="bg-white rounded-lg overflow-hidden border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src="https://d3hxwv9uga20ww.cloudfront.net/RoSpAXz7wgobQtEUGXx9ai-files/fojiaowutaishan1(16)-randomSuffix-1739540736.jpg"
                      alt="圣地灌顶"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-serif mb-4">
                      3
                    </div>
                    <h3 className="text-xl font-serif text-[#5D4E37] mb-2">
                      {t("blessing.step3.title")}
                    </h3>
                    <p className="text-[#8B7355] text-sm font-light">
                      {t("blessing.step3.description")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8 text-[#8B7355] text-sm font-light">
            ← {t("blessing.scrollHint")} →
          </div>
        </div>
      </section>
    </div>
  );
}
