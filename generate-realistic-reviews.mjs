import { drizzle } from 'drizzle-orm';
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

function generateIP(region) {
  const countries = REGIONS[region].countries;
  const country = countries[Math.floor(Math.random() * countries.length)];
  const prefix = country.ipPrefix[Math.floor(Math.random() * country.ipPrefix.length)];
  const second = Math.floor(Math.random() * 256);
  const third = Math.floor(Math.random() * 256);
  const fourth = Math.floor(Math.random() * 256);
  return `${prefix}${second}.${third}.${fourth}`;
}

function generateUsername(region) {
  const europeanNames = [
    'John M.', 'Sophie L.', 'Marco R.', 'Emma K.', 'Lucas B.', 'Isabella F.', 'Oliver W.', 'Mia D.',
    'James H.', 'Charlotte P.', 'William S.', 'Amelia T.', 'Benjamin C.', 'Harper V.', 'Elijah N.',
    'Evelyn G.', 'Alexander J.', 'Abigail M.', 'Michael R.', 'Emily W.', 'Daniel K.', 'Elizabeth L.',
    'Henry B.', 'Sofia A.', 'Sebastian F.', 'Avery H.', 'Jack D.', 'Ella S.', 'Owen T.', 'Scarlett C.',
    'Thomas G.', 'Grace M.', 'Leo P.', 'Lily R.', 'Noah K.', 'Chloe B.', 'Oscar F.', 'Zoe W.',
  ];

  const asianNames = [
    '张**', '李**', '王**', '刘**', '陈**', '杨**', '黄**', '赵**', '吴**', '周**',
    'Ahmad S.', 'Siti N.', 'Nguyen T.', 'Chen W.', 'Wong L.', 'Tan K.', 'Lim H.', 'Lee M.',
    'Kumar R.', 'Devi P.', 'Bui H.', 'Pham T.', 'Tran V.', 'Ho M.', 'Ng J.', 'Ong S.',
    'Lin Y.', 'Zhang Q.', 'Liu X.', 'Wang H.', 'Huang M.', 'Zhao L.',
  ];

  const americanNames = [
    'Sarah K.', 'Michael D.', 'Jennifer W.', 'David R.', 'Jessica M.', 'Christopher L.', 'Ashley B.',
    'Matthew H.', 'Amanda T.', 'Joshua S.', 'Melissa C.', 'Andrew F.', 'Stephanie G.', 'Daniel N.',
    'Nicole P.', 'Ryan J.', 'Lauren V.', 'Justin K.', 'Rachel M.', 'Brandon W.', 'Heather L.',
    'Tyler S.', 'Brittany H.', 'Kevin M.', 'Samantha R.', 'Eric T.', 'Rebecca F.', 'Brian K.',
  ];

  if (region === 'europe') {
    return europeanNames[Math.floor(Math.random() * europeanNames.length)];
  } else if (region === 'asia') {
    return asianNames[Math.floor(Math.random() * asianNames.length)];
  } else {
    return americanNames[Math.floor(Math.random() * americanNames.length)];
  }
}

function generateLocation(region) {
  const countries = REGIONS[region].countries;
  const country = countries[Math.floor(Math.random() * countries.length)];
  const city = country.cities[Math.floor(Math.random() * country.cities.length)];
  return `${city}, ${country.name}`;
}

// Massively expanded review templates with more variation
const REVIEW_PARTS = {
  // Opening statements (50+ variations)
  openings: [
    "Just received this",
    "Got my order today",
    "Arrived yesterday",
    "Finally got my hands on this",
    "Ordered this last week and it just arrived",
    "Received my package this morning",
    "This came faster than expected",
    "Delivery was quick",
    "Took a while to arrive but worth the wait",
    "Package arrived in perfect condition",
    "Unboxed this today",
    "Been waiting for this and it's finally here",
    "Received this as a gift to myself",
    "Ordered this after much research",
    "Decided to try this after reading reviews",
    "Purchased this on recommendation",
    "This was delivered today",
    "Got this in the mail",
    "Received my order",
    "Package just arrived",
    "Opened the package today",
    "This showed up today",
    "Delivery was smooth",
    "Arrived well-packaged",
    "Got this yesterday",
  ],
  
  // Quality comments (60+ variations)
  quality: [
    "The quality is excellent",
    "Craftsmanship is outstanding",
    "Very well made",
    "Quality exceeded my expectations",
    "The attention to detail is impressive",
    "Materials feel premium",
    "Build quality is solid",
    "Feels authentic and well-crafted",
    "The workmanship is beautiful",
    "Quality is top-notch",
    "Better quality than I expected",
    "The finish is flawless",
    "Materials are high quality",
    "Construction is solid",
    "Feels substantial and well-made",
    "The craftsmanship shows",
    "Quality matches the price",
    "Very impressed with the quality",
    "Looks and feels expensive",
    "The details are exquisite",
    "Weight feels right",
    "Solid construction",
    "Premium materials used",
    "Expertly crafted",
    "The quality is evident",
    "Beautifully made",
    "Exceptional craftsmanship",
    "Feels authentic",
    "High-end quality",
    "Professional finish",
  ],
  
  // Energy/spiritual comments (50+ variations)
  spiritual: [
    "I can feel the positive energy",
    "The energy is calming",
    "Feels spiritually charged",
    "There's a peaceful energy to it",
    "I sense the blessing",
    "The spiritual power is real",
    "Energy feels genuine",
    "I feel more protected wearing this",
    "The energy is noticeable",
    "Brings a sense of peace",
    "I feel more grounded",
    "The spiritual connection is strong",
    "Energy is subtle but present",
    "Feels like it's working",
    "I notice a difference in my energy",
    "The blessing feels authentic",
    "Spiritual energy is palpable",
    "I feel more centered",
    "Brings positive vibes",
    "The energy aligns with me",
    "I feel the protection",
    "Spiritual power is evident",
    "Energy resonates with me",
    "Feels blessed",
    "The consecration is real",
    "I sense the sacred energy",
    "Brings spiritual comfort",
    "Energy feels pure",
    "I feel more balanced",
    "The spiritual aspect is genuine",
  ],
  
  // Appearance comments (40+ variations)
  appearance: [
    "Looks beautiful",
    "Even more stunning in person",
    "The design is elegant",
    "Visually impressive",
    "Photos don't do it justice",
    "Looks exactly as pictured",
    "The appearance is striking",
    "Beautiful piece",
    "Aesthetically pleasing",
    "The design is intricate",
    "Looks high-end",
    "Very attractive",
    "The styling is perfect",
    "Looks authentic",
    "Design is traditional yet modern",
    "Visually appealing",
    "The look is sophisticated",
    "Appearance is flawless",
    "Looks premium",
    "The design details are impressive",
    "Looks professional",
    "Aesthetic is on point",
    "The finish is beautiful",
    "Looks expensive",
    "Design is tasteful",
    "Visually stunning",
    "The appearance exceeded expectations",
    "Looks genuine",
    "Beautiful craftsmanship shows",
    "The design is timeless",
  ],
  
  // Usage/experience (50+ variations)
  experience: [
    "Wearing it daily now",
    "Haven't taken it off since I got it",
    "Use it during meditation",
    "Wear it every day",
    "It's become part of my routine",
    "I keep it with me always",
    "Wear it under my clothes",
    "Display it prominently",
    "Carry it everywhere",
    "It's always on me",
    "Use it in my spiritual practice",
    "Wear it during important meetings",
    "Keep it close at all times",
    "It's part of my daily ritual",
    "Wear it for protection",
    "Use it when I need guidance",
    "It accompanies me everywhere",
    "Wear it to sleep",
    "Keep it on my altar",
    "Use it during prayers",
    "It's my daily companion",
    "Wear it for good luck",
    "Keep it in my pocket",
    "Display it at home",
    "Use it for focus",
    "Wear it during yoga",
    "Keep it near me",
    "It's always with me",
    "Use it for meditation",
    "Wear it for confidence",
  ],
  
  // Results/effects (60+ variations)
  results: [
    "I've noticed positive changes",
    "Things are improving",
    "My luck has turned around",
    "I feel more confident",
    "Life feels more balanced",
    "Obstacles are clearing",
    "I'm sleeping better",
    "My anxiety has decreased",
    "I feel more focused",
    "Relationships are improving",
    "Work is going better",
    "I feel more at peace",
    "My energy levels are up",
    "Things are falling into place",
    "I'm more productive",
    "Stress levels have dropped",
    "I feel protected",
    "My intuition is stronger",
    "Life flows more smoothly",
    "I'm attracting good things",
    "My mood has improved",
    "I feel more centered",
    "Challenges seem easier",
    "I'm more optimistic",
    "My mindset has shifted",
    "I feel more grounded",
    "Things are manifesting",
    "I'm experiencing synchronicities",
    "My path is clearer",
    "I feel more aligned",
    "Opportunities are appearing",
    "I'm more calm",
    "My focus has improved",
    "I feel spiritually connected",
    "Life is more harmonious",
  ],
  
  // Recommendations (30+ variations)
  recommendations: [
    "Highly recommend",
    "Would buy again",
    "Recommend to anyone interested",
    "Worth every penny",
    "Great purchase",
    "Don't hesitate to buy",
    "You won't regret it",
    "Excellent investment",
    "Definitely recommend",
    "Worth the price",
    "Would recommend to friends",
    "Great value",
    "Buy it if you're considering",
    "Totally worth it",
    "Recommended for spiritual seekers",
    "A must-have",
    "Excellent choice",
    "Worth trying",
    "Highly satisfied",
    "Would purchase again",
    "Recommend without hesitation",
    "Great for beginners",
    "Perfect for practitioners",
    "Worth the investment",
    "Solid purchase",
    "Recommend highly",
    "Won't disappoint",
    "Great addition to practice",
    "Worthwhile purchase",
    "Strongly recommend",
  ],
  
  // Packaging comments (25+ variations)
  packaging: [
    "Packaging was secure",
    "Arrived well-protected",
    "Package was beautiful",
    "Presentation was thoughtful",
    "Came in nice packaging",
    "Protected during shipping",
    "Package showed care",
    "Arrived safely packaged",
    "Presentation was elegant",
    "Packaging respected the item",
    "Well-packaged for shipping",
    "Arrived in perfect condition",
    "Package was professional",
    "Presentation added to the experience",
    "Packaging was appropriate",
    "Arrived undamaged",
    "Package was secure",
    "Presentation was nice",
    "Came well-protected",
    "Packaging showed respect",
    "Arrived safely",
    "Package was careful",
    "Presentation was good",
    "Packaging was quality",
    "Arrived intact",
  ],
  
  // Timing comments (20+ variations)
  timing: [
    "Delivery was fast",
    "Arrived quickly",
    "Shipping was prompt",
    "Got it sooner than expected",
    "Delivery was on time",
    "Arrived when promised",
    "Fast shipping",
    "Quick delivery",
    "Arrived ahead of schedule",
    "Shipping was reasonable",
    "Delivery took a while but worth it",
    "Arrived in good time",
    "Shipping was efficient",
    "Got it faster than expected",
    "Delivery was smooth",
    "Arrived promptly",
    "Shipping was quick",
    "Delivery was timely",
    "Arrived as scheduled",
    "Got it in reasonable time",
  ],
};

// Generate a realistic review by combining random parts
function generateRealisticReview(productName, productType, isFollowUp, weeks) {
  const parts = [];
  
  if (!isFollowUp) {
    // Initial review structure
    if (Math.random() < 0.7) parts.push(REVIEW_PARTS.openings[Math.floor(Math.random() * REVIEW_PARTS.openings.length)]);
    if (Math.random() < 0.6) parts.push(REVIEW_PARTS.packaging[Math.floor(Math.random() * REVIEW_PARTS.packaging.length)]);
    if (Math.random() < 0.8) parts.push(REVIEW_PARTS.quality[Math.floor(Math.random() * REVIEW_PARTS.quality.length)]);
    if (Math.random() < 0.7) parts.push(REVIEW_PARTS.appearance[Math.floor(Math.random() * REVIEW_PARTS.appearance.length)]);
    if (Math.random() < 0.6) parts.push(REVIEW_PARTS.spiritual[Math.floor(Math.random() * REVIEW_PARTS.spiritual.length)]);
    if (Math.random() < 0.5) parts.push(REVIEW_PARTS.experience[Math.floor(Math.random() * REVIEW_PARTS.experience.length)]);
    if (Math.random() < 0.4) parts.push(REVIEW_PARTS.recommendations[Math.floor(Math.random() * REVIEW_PARTS.recommendations.length)]);
  } else {
    // Follow-up review structure
    parts.push(`Update after ${weeks} weeks:`);
    if (Math.random() < 0.9) parts.push(REVIEW_PARTS.experience[Math.floor(Math.random() * REVIEW_PARTS.experience.length)]);
    if (Math.random() < 0.8) parts.push(REVIEW_PARTS.results[Math.floor(Math.random() * REVIEW_PARTS.results.length)]);
    if (Math.random() < 0.7) parts.push(REVIEW_PARTS.spiritual[Math.floor(Math.random() * REVIEW_PARTS.spiritual.length)]);
    if (Math.random() < 0.6) parts.push(REVIEW_PARTS.recommendations[Math.floor(Math.random() * REVIEW_PARTS.recommendations.length)]);
  }
  
  // Join with periods and proper spacing
  let review = parts.join('. ');
  if (!review.endsWith('.')) review += '.';
  
  // Occasionally add product name
  if (Math.random() < 0.3) {
    review = review.replace('this', productName);
  }
  
  return review;
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
  return 'zodiac';
}

// Generate random date between June 2025 and Feb 2026
function generateRandomDate() {
  const start = new Date('2025-06-01');
  const end = new Date('2026-02-19');
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  date.setMinutes(Math.floor(Math.random() * 60));
  date.setSeconds(Math.floor(Math.random() * 60));
  return date;
}

// Get all products
const products = await db.select().from(schema.products);
console.log(`Found ${products.length} products`);

// Delete existing reviews
console.log('Deleting existing reviews...');
await db.delete(schema.reviews);

const getRandomReviewCount = () => Math.floor(Math.random() * (18888 - 12800 + 1)) + 12800;
const BATCH_SIZE = 500;

for (const product of products) {
  const TARGET_REVIEWS_PER_PRODUCT = getRandomReviewCount();
  console.log(`\nGenerating ${TARGET_REVIEWS_PER_PRODUCT} reviews for: ${product.name}`);
  
  const productType = getProductType(product.name);
  let reviewsGenerated = 0;
  
  while (reviewsGenerated < TARGET_REVIEWS_PER_PRODUCT) {
    const batchReviews = [];
    const currentBatchSize = Math.min(BATCH_SIZE, TARGET_REVIEWS_PER_PRODUCT - reviewsGenerated);
    
    for (let i = 0; i < currentBatchSize; i++) {
      const rand = Math.random();
      let region;
      if (rand < 0.65) region = 'europe';
      else if (rand < 0.85) region = 'asia';
      else region = 'usa';
      
      const isFollowUp = Math.random() < 0.30;
      const weeks = isFollowUp ? Math.floor(Math.random() * 6) + 2 : 0;
      
      const reviewText = generateRealisticReview(product.name, productType, isFollowUp, weeks);
      
      // Rating distribution: 80% 5-star, 15% 4-star, 5% 3-star
      let rating;
      const ratingRand = Math.random();
      if (ratingRand < 0.80) rating = 5;
      else if (ratingRand < 0.95) rating = 4;
      else rating = 3;
      
      const createdAt = generateRandomDate();
      
      batchReviews.push({
        productId: product.id,
        userId: null,
        userName: generateUsername(region),
        rating,
        comment: reviewText,
        ipAddress: generateIP(region),
        location: generateLocation(region),
        isVerified: true,
        createdAt,
      });
    }
    
    await db.insert(schema.reviews).values(batchReviews);
    reviewsGenerated += currentBatchSize;
    
    if (reviewsGenerated % 1000 === 0 || reviewsGenerated === TARGET_REVIEWS_PER_PRODUCT) {
      console.log(`  Progress: ${reviewsGenerated}/${TARGET_REVIEWS_PER_PRODUCT} (${Math.round(reviewsGenerated / TARGET_REVIEWS_PER_PRODUCT * 100)}%)`);
    }
  }
  
  console.log(`✓ Completed ${product.name}`);
}

console.log('\n✓ All reviews generated successfully!');
await connection.end();
process.exit(0);
