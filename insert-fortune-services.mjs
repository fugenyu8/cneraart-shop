import { getDb } from './server/db.js';
import { products, productImages } from './drizzle/schema.js';

const db = await getDb();
if (!db) throw new Error('Database not available');

// 三个服务商品的数据
const services = [
  {
    slug: 'face-reading-analysis-service',
    name: 'Face Reading Analysis Service',
    shortDescription: 'Traditional Chinese face reading reveals your destiny, career, wealth, health, and relationships through the twelve palaces.',
    description: `Unlock the ancient wisdom of Chinese physiognomy with our professional face reading analysis service. Our master analysts combine thousand-year-old traditions with modern insights to provide you with a comprehensive understanding of your life path.

**What is Face Reading?**

Face reading (Mian Xiang) is an ancient Chinese art that interprets facial features to reveal personality traits, life destiny, and future trends. Each area of the face corresponds to specific life aspects and time periods, forming the "Twelve Palaces" system.

**Service Includes:**

**1. Twelve Palaces Analysis**
- Life Palace (forehead center): Overall destiny and life direction
- Wealth Palace (nose): Financial fortune and wealth accumulation ability
- Career Palace (forehead): Professional development and authority
- Marriage Palace (eye corners): Romantic relationships and marriage quality
- Health Palace (nose bridge): Physical constitution and health trends
- And 7 other palace analyses...

**2. Facial Features Interpretation**
- Five sense organs (eyebrows, eyes, nose, mouth, ears) detailed analysis
- Face shape and bone structure significance
- Complexion and energy field assessment
- Mole and mark interpretations

**3. Life Destiny Guidance**
- Career development direction and timing
- Wealth accumulation opportunities and risks
- Relationship compatibility and marriage timing
- Health attention areas and prevention
- Personal growth and spiritual cultivation advice

**4. Annual Fortune Forecast**
- Current year (2026) fortune trends
- Key time periods and opportunities
- Potential challenges and solutions
- Auspicious directions and colors

**How It Works:**

1. Upload 3-5 clear photos (front view, side views, natural lighting)
2. Provide your birth date and time (optional, for enhanced accuracy)
3. Our master analysts conduct comprehensive face reading
4. Receive detailed report within 3-5 business days

**Who Should Get This Service:**

- Those seeking career guidance and breakthrough
- Individuals facing important life decisions
- Anyone curious about their life destiny and potential
- People wanting to understand their strengths and weaknesses
- Those interested in traditional Chinese wisdom

**Privacy Guarantee:**

All photos and personal information are strictly confidential and will be permanently deleted after analysis completion.

May this ancient wisdom illuminate your life path and empower your journey forward.`,
    regularPrice: '9.90',
    salePrice: null,
    stock: 999,
    categoryId: null,
    status: 'published',
    featured: false,
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/OZKxoMRTnAnFOOYV.jpg',
    imageKey: 'face-reading-service.jpg'
  },
  {
    slug: 'palm-reading-analysis-service',
    name: 'Palm Reading Analysis Service',
    shortDescription: 'Decode the mysteries hidden in your palm lines. Reveal your life trajectory, wealth potential, career path, and relationship destiny.',
    description: `Discover the secrets written in your hands with our professional palmistry analysis service. Our expert palm readers interpret the intricate patterns and lines to provide profound insights into your life journey.

**What is Palm Reading?**

Palmistry (Shou Xiang) is an ancient Chinese divination art that reads the lines, mounts, and shapes of the hand to reveal personality, destiny, and life events. The palm is considered a map of your life, with each line representing different aspects of your journey.

**Service Includes:**

**1. Three Major Lines Analysis**
- Life Line: Vitality, health, and major life changes
- Head Line: Intelligence, thinking patterns, and decision-making style
- Heart Line: Emotional nature, relationships, and love destiny

**2. Wealth and Career Lines**
- Fate Line (Career Line): Professional development and life direction
- Sun Line (Success Line): Fame, achievement, and recognition
- Mercury Line (Health/Business Line): Business acumen and health
- Wealth indicators and financial fortune assessment

**3. Relationship and Marriage Analysis**
- Marriage Lines: Number of significant relationships and marriage timing
- Relationship quality and compatibility indicators
- Children lines and family fortune
- Emotional patterns and love life guidance

**4. Hand Shape and Finger Analysis**
- Hand shape classification (Earth, Air, Fire, Water)
- Finger length and personality traits
- Thumb analysis: Willpower and determination
- Nail shape and health indicators

**5. Special Markings Interpretation**
- Stars, crosses, triangles, and squares
- Islands, chains, and breaks in lines
- Mounts of planets and their significance
- Rare auspicious signs and warnings

**6. Life Guidance and Predictions**
- Current life phase and upcoming opportunities
- Career change timing and direction
- Wealth accumulation periods
- Relationship development and marriage timing
- Health attention areas

**How It Works:**

1. Upload 4-6 clear photos (both palms, front and back, well-lit)
2. Provide your dominant hand and birth date (optional)
3. Our master palm readers conduct detailed analysis
4. Receive comprehensive report within 3-5 business days

**Who Should Get This Service:**

- Those seeking clarity about life direction
- Individuals planning career changes or business ventures
- People curious about relationship and marriage prospects
- Anyone wanting to understand their innate talents and potential
- Those interested in traditional Chinese metaphysics

**Privacy Guarantee:**

All photos and personal information are strictly confidential and will be permanently deleted after analysis completion.

May the wisdom in your palms guide you to a prosperous and fulfilling life.`,
    regularPrice: '9.90',
    salePrice: null,
    stock: 999,
    categoryId: null,
    status: 'published',
    featured: false,
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/XCmBTlzoIWGwaoeK.jpg',
    imageKey: 'palm-reading-service.jpg'
  },
  {
    slug: 'feng-shui-home-analysis-service',
    name: 'Feng Shui Home Analysis Service',
    shortDescription: 'Master-level Feng Shui consultation from Wutai Mountain experts. Harmonize energy flow, dissolve negative influences, and attract wealth and prosperity.',
    description: `Transform your living space into a sanctuary of positive energy with our professional Feng Shui analysis service. Our master consultants from Wutai Mountain apply authentic Chinese Feng Shui principles to optimize your home's energy flow.

**What is Feng Shui?**

Feng Shui (Wind and Water) is the ancient Chinese art of harmonizing individuals with their surrounding environment. By analyzing and adjusting the energy (Qi) flow in your space, Feng Shui creates balance, prosperity, and well-being.

**Service Includes:**

**1. Comprehensive Space Analysis**
- Floor plan evaluation and energy flow assessment
- Bagua map overlay and sector identification
- Main door direction and entrance energy analysis
- Room function alignment with Bagua sectors
- Identification of missing sectors and extensions

**2. Five Elements Balance**
- Current elemental composition assessment
- Personal element compatibility (based on birth date)
- Element enhancement and balancing recommendations
- Color scheme optimization for each room
- Material and texture suggestions

**3. Negative Energy Identification**
- Sha Qi (harmful energy) detection and sources
- Poison arrows and cutting energy identification
- Bathroom and kitchen placement issues
- Beam and column problems
- Mirror and water feature placement evaluation

**4. Wealth and Prosperity Enhancement**
- Wealth corner activation (Southeast sector)
- Career advancement area optimization (North sector)
- Abundance and prosperity symbol placement
- Water feature positioning for wealth attraction
- Lucky directions and auspicious arrangements

**5. Health and Relationship Harmony**
- Health sector (East) optimization
- Relationship corner (Southwest) enhancement
- Bedroom Feng Shui for better sleep and relationships
- Family harmony area (East) improvement
- Children and creativity sector (West) activation

**6. Personalized Remedies and Solutions**
- Specific cures for identified problems
- Furniture rearrangement suggestions
- Decorative element recommendations
- Plant and crystal placement guidance
- Timing for implementing changes (auspicious dates)

**7. Annual Flying Stars Analysis**
- 2026 Flying Stars chart for your home
- Afflicted sectors and remedies
- Auspicious sectors to activate
- Monthly energy shifts and adjustments

**How It Works:**

1. Upload floor plan or hand-drawn layout with compass directions
2. Provide 10-15 photos of main areas (entrance, living room, bedrooms, kitchen, etc.)
3. Share your birth date and family members' birth dates (optional, for personalized analysis)
4. Provide address for precise compass direction analysis
5. Our Feng Shui masters conduct comprehensive analysis
6. Receive detailed report with diagrams and photos within 5-7 business days

**Who Should Get This Service:**

- New homeowners or renters wanting to optimize their space
- Those experiencing persistent health, wealth, or relationship issues
- Individuals planning renovation or remodeling
- Business owners wanting to enhance prosperity
- Anyone seeking to improve overall life quality through environmental harmony

**What You'll Receive:**

- Detailed written report (15-20 pages)
- Annotated floor plan with Feng Shui overlay
- Before/after visualization (if applicable)
- Specific remedy recommendations with photos
- Auspicious dates for implementing changes
- One follow-up consultation (via email)

**Privacy Guarantee:**

All photos, floor plans, and personal information are strictly confidential and will be permanently deleted after service completion.

May the harmonious energy of your space bring you health, wealth, and happiness.`,
    regularPrice: '11.90',
    salePrice: null,
    stock: 999,
    categoryId: null,
    status: 'published',
    featured: false,
    imageUrl: 'https://files.manuscdn.com/user_upload_by_module/session_file/310519663348895853/ntKUUOtSFiftFQiE.png',
    imageKey: 'feng-shui-service.png'
  }
];

async function insertServices() {
  console.log('开始插入服务商品...\n');
  
  for (const service of services) {
    try {
      // 插入产品
      const [product] = await db.insert(products).values({
        name: service.name,
        slug: service.slug,
        description: service.description,
        shortDescription: service.shortDescription,
        regularPrice: service.regularPrice,
        salePrice: service.salePrice,
        stock: service.stock,
        categoryId: service.categoryId,
        status: service.status,
        featured: service.featured,
      });
      
      const productId = product.insertId;
      console.log(`✅ 已插入: ${service.name} (ID: ${productId})`);
      
      // 插入产品图片
      await db.insert(productImages).values({
        productId: productId,
        url: service.imageUrl,
        fileKey: service.imageKey,
        displayOrder: 0,
        isPrimary: true,
      });
      
      console.log(`   图片已关联: ${service.imageUrl}\n`);
      
    } catch (error) {
      console.error(`❌ 插入失败 ${service.name}:`, error.message);
    }
  }
  
  console.log('\n🎉 所有服务商品插入完成!');
}

insertServices().catch(console.error);
