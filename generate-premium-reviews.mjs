import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Geographic distribution
const REGIONS = {
  europe: {
    weight: 0.65,
    countries: [
      { name: 'United Kingdom', cities: ['London', 'Manchester', 'Birmingham', 'Edinburgh'], ipPrefix: ['81.', '82.', '83.', '86.', '90.'] },
      { name: 'France', cities: ['Paris', 'Lyon', 'Marseille', 'Toulouse'], ipPrefix: ['80.', '81.', '82.', '90.', '91.'] },
      { name: 'Germany', cities: ['Berlin', 'Munich', 'Hamburg', 'Frankfurt'], ipPrefix: ['80.', '81.', '82.', '84.', '85.'] },
      { name: 'Italy', cities: ['Rome', 'Milan', 'Florence', 'Venice'], ipPrefix: ['79.', '80.', '81.', '82.', '87.'] },
      { name: 'Spain', cities: ['Madrid', 'Barcelona', 'Valencia', 'Seville'], ipPrefix: ['80.', '81.', '83.', '84.', '88.'] },
      { name: 'Netherlands', cities: ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht'], ipPrefix: ['77.', '80.', '81.', '82.', '84.'] },
      { name: 'Belgium', cities: ['Brussels', 'Antwerp', 'Ghent', 'Bruges'], ipPrefix: ['78.', '79.', '80.', '81.', '82.'] },
      { name: 'Switzerland', cities: ['Zurich', 'Geneva', 'Basel', 'Bern'], ipPrefix: ['77.', '78.', '80.', '82.', '85.'] },
    ],
  },
  asia: {
    weight: 0.20,
    countries: [
      { name: 'China', cities: ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hong Kong'], ipPrefix: ['1.', '14.', '27.', '36.', '42.', '58.', '59.', '60.', '61.'] },
      { name: 'Singapore', cities: ['Singapore'], ipPrefix: ['1.', '8.', '27.', '42.', '43.', '49.'] },
      { name: 'Malaysia', cities: ['Kuala Lumpur', 'Penang', 'Johor Bahru'], ipPrefix: ['1.', '14.', '27.', '42.', '43.', '49.', '58.', '60.'] },
      { name: 'Thailand', cities: ['Bangkok', 'Chiang Mai', 'Phuket'], ipPrefix: ['1.', '14.', '27.', '42.', '49.', '58.', '61.'] },
      { name: 'Vietnam', cities: ['Ho Chi Minh City', 'Hanoi', 'Da Nang'], ipPrefix: ['1.', '14.', '27.', '42.', '49.', '58.', '113.', '115.', '116.', '117.', '118.', '119.', '120.', '121.', '122.', '123.', '124.', '125.'] },
    ],
  },
  usa: {
    weight: 0.15,
    countries: [
      { name: 'United States', cities: ['New York', 'Los Angeles', 'San Francisco', 'Chicago', 'Seattle', 'Boston', 'Miami', 'Austin'], ipPrefix: ['3.', '4.', '12.', '13.', '15.', '16.', '17.', '18.', '20.', '23.', '24.', '32.', '34.', '35.', '38.', '40.', '44.', '45.', '47.', '50.', '52.', '54.', '63.', '64.', '65.', '66.', '67.', '68.', '69.', '70.', '71.', '72.', '73.', '74.', '75.', '76.', '96.', '97.', '98.', '99.', '100.', '104.', '107.', '108.'] },
    ],
  },
};

// Generate realistic IP address
function generateIP(region) {
  const countries = REGIONS[region].countries;
  const country = countries[Math.floor(Math.random() * countries.length)];
  const prefix = country.ipPrefix[Math.floor(Math.random() * country.ipPrefix.length)];
  const second = Math.floor(Math.random() * 256);
  const third = Math.floor(Math.random() * 256);
  const fourth = Math.floor(Math.random() * 256);
  return `${prefix}${second}.${third}.${fourth}`;
}

// Generate realistic username
function generateUsername(region) {
  const europeanNames = [
    'John M.', 'Sophie L.', 'Marco R.', 'Emma K.', 'Lucas B.', 'Isabella F.', 'Oliver W.', 'Mia D.',
    'James H.', 'Charlotte P.', 'William S.', 'Amelia T.', 'Benjamin C.', 'Harper V.', 'Elijah N.',
    'Evelyn G.', 'Alexander J.', 'Abigail M.', 'Michael R.', 'Emily W.', 'Daniel K.', 'Elizabeth L.',
    'Henry B.', 'Sofia A.', 'Sebastian F.', 'Avery H.', 'Jack D.', 'Ella S.', 'Owen T.', 'Scarlett C.',
  ];

  const asianNames = [
    '张**', '李**', '王**', '刘**', '陈**', '杨**', '黄**', '赵**', '吴**', '周**',
    'Ahmad S.', 'Siti N.', 'Nguyen T.', 'Chen W.', 'Wong L.', 'Tan K.', 'Lim H.', 'Lee M.',
    'Kumar R.', 'Devi P.', 'Bui H.', 'Pham T.', 'Tran V.', 'Ho M.', 'Ng J.', 'Ong S.',
  ];

  const americanNames = [
    'Sarah K.', 'Michael D.', 'Jennifer W.', 'David R.', 'Jessica M.', 'Christopher L.', 'Ashley B.',
    'Matthew H.', 'Amanda T.', 'Joshua S.', 'Melissa C.', 'Andrew F.', 'Stephanie G.', 'Daniel N.',
    'Nicole P.', 'Ryan J.', 'Lauren V.', 'Justin K.', 'Rachel M.', 'Brandon W.', 'Heather L.',
  ];

  if (region === 'europe') {
    return europeanNames[Math.floor(Math.random() * europeanNames.length)];
  } else if (region === 'asia') {
    return asianNames[Math.floor(Math.random() * asianNames.length)];
  } else {
    return americanNames[Math.floor(Math.random() * americanNames.length)];
  }
}

// Generate realistic location
function generateLocation(region) {
  const countries = REGIONS[region].countries;
  const country = countries[Math.floor(Math.random() * countries.length)];
  const city = country.cities[Math.floor(Math.random() * country.cities.length)];
  return `${city}, ${country.name}`;
}

// Review templates for different product types
const REVIEW_TEMPLATES = {
  zodiac: {
    initial: [
      "I ordered the {product} pendant and it arrived beautifully packaged. The craftsmanship is exquisite, and I can already feel a positive energy from it. Looking forward to wearing it daily.",
      "Received my {product} guardian pendant today. The quality exceeded my expectations - the details are stunning. I've been drawn to traditional spiritual items, and this feels authentic.",
      "Just got my {product} pendant. The energy feels calming and protective. The packaging was secure, and the pendant itself is more beautiful in person than in photos.",
      "My {product} guardian arrived faster than expected. The weight and feel of it suggest quality materials. I'm excited to see how it influences my daily life.",
      "Ordered this {product} pendant after researching traditional zodiac guardians. The craftsmanship honors the tradition beautifully. It feels special to wear.",
    ],
    followUp: [
      "Update: I've been wearing my {product} pendant for {weeks} weeks now. I've noticed a shift in my energy levels and overall sense of calm. Highly recommend for anyone seeking spiritual support.",
      "Follow-up review: After {weeks} weeks of daily wear, I can confidently say this {product} guardian has made a difference. I feel more grounded and protected. Worth every penny.",
      "Been wearing this for {weeks} weeks. The pendant has become part of my daily ritual. I've experienced better sleep and a clearer mind. Grateful for this connection to tradition.",
      "Update after {weeks} weeks: The {product} pendant continues to bring positive energy. I've noticed improvements in my relationships and work life. This is more than jewelry - it's a spiritual companion.",
      "{weeks} weeks later: Still wearing my {product} guardian every day. The sense of protection and guidance it provides is remarkable. Several friends have asked about it.",
    ],
  },
  bracelet: {
    initial: [
      "The {product} bracelet arrived today. The beads are smooth and well-crafted. You can tell this was made with intention and care. The energy feels pure.",
      "Just received my {product} bracelet. The quality is outstanding - each bead is perfectly formed. I appreciate the traditional approach to creating these spiritual items.",
      "My {product} bracelet is beautiful. The weight feels substantial, and the craftsmanship is evident. I'm looking forward to incorporating it into my meditation practice.",
      "Ordered the {product} bracelet and I'm impressed. The packaging showed respect for the sacred nature of the item. The bracelet itself radiates positive energy.",
      "The {product} bracelet exceeded my expectations. The beads are uniform and the string is strong. This feels like an authentic spiritual tool, not just an accessory.",
    ],
    followUp: [
      "Update: {weeks} weeks of wearing my {product} bracelet daily. My meditation practice has deepened, and I feel more centered throughout the day. Truly transformative.",
      "Follow-up after {weeks} weeks: This bracelet has become essential to my spiritual practice. I notice a difference in my energy when I'm not wearing it. Highly effective.",
      "{weeks} weeks in: The {product} bracelet continues to support my spiritual journey. I've experienced greater clarity and peace. This is a powerful tool for anyone on a spiritual path.",
      "After {weeks} weeks, I can say this bracelet works. My anxiety has decreased, and I feel more connected to my inner wisdom. The traditional methods truly have power.",
      "Update: Been wearing this for {weeks} weeks straight. The energy it provides is consistent and supportive. I've recommended it to several friends already.",
    ],
  },
  service: {
    initial: [
      "Just received my {product} report. The depth of analysis is impressive - it covers aspects I hadn't even considered. The insights are practical and resonant.",
      "The {product} service exceeded my expectations. The report is detailed and personalized. I can tell real expertise went into this analysis.",
      "Received my {product} analysis today. The accuracy is remarkable - it addresses my current life situations with precision. This is genuine wisdom, not generic advice.",
      "My {product} report arrived. The level of detail is extraordinary. Every section provides actionable guidance. This is worth far more than the price.",
      "Just got my {product} consultation results. The insights are profound and specific to my situation. I feel like I have a clearer path forward now.",
    ],
    followUp: [
      "Update after {weeks} weeks: I've been implementing the guidance from my {product} report. The results have been transformative. My life has shifted in positive ways I didn't expect.",
      "Follow-up: {weeks} weeks later, the insights from my {product} analysis continue to prove accurate. I refer back to the report regularly. Best investment in myself I've made.",
      "{weeks} weeks after receiving my {product} report: The predictions and guidance have been spot-on. I'm amazed at how accurate the analysis was. Truly grateful for this service.",
      "Update: Following the recommendations from my {product} consultation for {weeks} weeks now. The improvements in my life are undeniable. This wisdom is real and effective.",
      "After {weeks} weeks of applying the insights from my {product} report, I can confirm its value. The guidance has helped me navigate challenges with confidence.",
    ],
  },
  prayer: {
    initial: [
      "I arranged for the {product} service and received confirmation with photos. Knowing that prayers are being offered on my behalf brings me peace and comfort.",
      "Just completed my {product} order. The process was respectful and the communication was clear. I feel a sense of connection to the sacred traditions.",
      "Ordered the {product} service for a family member. The team was responsive and understanding. The photos they sent show the care and devotion put into the ceremony.",
      "The {product} service was exactly what I needed. The spiritual support during this difficult time has been invaluable. Grateful for this connection to tradition.",
      "I requested the {product} service and the experience has been meaningful. The updates and photos help me feel connected to the prayers being offered.",
    ],
    followUp: [
      "Update after {weeks} weeks: Since the {product} ceremony, I've felt a shift in my circumstances. Things that were stuck are now moving forward. The prayers are working.",
      "Follow-up: {weeks} weeks after the {product} service, I can see positive changes in my life. The spiritual support has been powerful. I'm planning to continue this practice.",
      "{weeks} weeks later: The {product} prayers have brought noticeable improvements. I feel more hopeful and situations are resolving. This traditional practice holds real power.",
      "Update: {weeks} weeks since the {product} ceremony. My intentions are manifesting in unexpected ways. I'm grateful for the spiritual support and will order again.",
      "After {weeks} weeks, I can confirm the {product} service made a difference. My situation has improved significantly. The traditional prayers carry genuine spiritual power.",
    ],
  },
};

// Generate random date between June 2025 and Feb 2026
function generateRandomDate() {
  const start = new Date('2025-06-01');
  const end = new Date('2026-02-19');
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  
  // Avoid exact hour times (more realistic)
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));
  
  return date;
}

// Determine product type from name
function getProductType(productName) {
  const name = productName.toLowerCase();
  if (name.includes('zodiac') || name.includes('guardian') || name.includes('生肖') || name.includes('星座')) {
    return 'zodiac';
  } else if (name.includes('bracelet') || name.includes('手链')) {
    return 'bracelet';
  } else if (name.includes('reading') || name.includes('analysis') || name.includes('fengshui') || name.includes('面相') || name.includes('手相') || name.includes('风水') || name.includes('命理')) {
    return 'service';
  } else if (name.includes('prayer') || name.includes('blessing') || name.includes('供香') || name.includes('供灯')) {
    return 'prayer';
  }
  return 'zodiac'; // default
}

// Get all products
const products = await db.select().from(schema.products);
console.log(`Found ${products.length} products`);

// Delete existing reviews
console.log('Deleting existing reviews...');
await db.delete(schema.reviews);

// Generate random number of reviews between 12800 and 18888 for each product
const getRandomReviewCount = () => Math.floor(Math.random() * (39287 - 32143 + 1)) + 32143;
const BATCH_SIZE = 2000; // Insert in batches to avoid memory issues

for (const product of products) {
  const TARGET_REVIEWS_PER_PRODUCT = getRandomReviewCount();
  console.log(`\nGenerating ${TARGET_REVIEWS_PER_PRODUCT} reviews for: ${product.name}`);
  
  const productType = getProductType(product.name);
  const templates = REVIEW_TEMPLATES[productType];
  
  let reviewsGenerated = 0;
  
  while (reviewsGenerated < TARGET_REVIEWS_PER_PRODUCT) {
    const batchReviews = [];
    const currentBatchSize = Math.min(BATCH_SIZE, TARGET_REVIEWS_PER_PRODUCT - reviewsGenerated);
    
    for (let i = 0; i < currentBatchSize; i++) {
      // Determine region based on weights
      const rand = Math.random();
      let region;
      if (rand < 0.65) {
        region = 'europe';
      } else if (rand < 0.85) {
        region = 'asia';
      } else {
        region = 'usa';
      }
      
      // Determine if this is a follow-up review (30%)
      const isFollowUp = Math.random() < 0.30;
      
      // Select template
      const templateArray = isFollowUp ? templates.followUp : templates.initial;
      let reviewText = templateArray[Math.floor(Math.random() * templateArray.length)];
      
      // Replace placeholders
      reviewText = reviewText.replace(/{product}/g, product.name);
      if (isFollowUp) {
        const weeks = Math.floor(Math.random() * 6) + 2; // 2-8 weeks
        reviewText = reviewText.replace(/{weeks}/g, weeks);
      }
      
      // Generate rating (85% 5-star, 15% 4-star)
      const rating = Math.random() < 0.85 ? 5 : 4;
      
      // Generate date
      const createdAt = generateRandomDate();
      
      batchReviews.push({
        productId: product.id,
        userId: null, // Anonymous reviews
        userName: generateUsername(region),
        rating,
        comment: reviewText,
        ipAddress: generateIP(region),
        location: generateLocation(region),
        isVerified: true,
        isApproved: true,
        createdAt,
        updatedAt: createdAt,
      });
    }
    
    // Insert batch
    await db.insert(schema.reviews).values(batchReviews);
    reviewsGenerated += currentBatchSize;
    
    console.log(`  Progress: ${reviewsGenerated}/${TARGET_REVIEWS_PER_PRODUCT} (${Math.round(reviewsGenerated/TARGET_REVIEWS_PER_PRODUCT*100)}%)`);
  }
  
  console.log(`✓ Completed ${product.name}`);
}

console.log('\n✓ All reviews generated successfully!');
await connection.end();
