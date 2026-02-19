// 复制reviewFragments_EN的一部分来测试
const reviewFragments_EN = {
  decision: ["I was skeptical at first, but after reading so many positive reviews, I decided to give it a try."],
  quality: ["The craftsmanship is absolutely exquisite - you can feel the quality immediately."],
  career: ["Within 3 weeks of wearing this, I got promoted at work!"],
  academic: ["My exam scores improved by 15% since wearing this!"],
  wealth: ["Received an unexpected bonus at work within a month!"],
  relationship: ["My relationship with my partner has never been better."],
  health: ["My chronic headaches have significantly reduced."],
  gratitude: ["Deeply grateful for the ancient Eastern wisdom preserved in this tradition."],
  energyReport: ["The personalized energy analysis report was incredibly accurate!"],
  followUp: ["UPDATE after 4 weeks: The effects keep getting stronger!"],
  recommendation: ["Highly recommend to anyone seeking authentic spiritual support."]
};

function generateReviewContent(language, isFollowUp = false) {
  const fragments = reviewFragments_EN;
  const parts = [];
  
  if (isFollowUp) {
    if (fragments.followUp && Math.random() > 0.3) {
      parts.push(fragments.followUp[0]);
    }
  } else {
    if (fragments.decision && Math.random() > 0.6) {
      parts.push(fragments.decision[0]);
    }
  }
  
  if (fragments.quality && Math.random() > 0.4) {
    parts.push(fragments.quality[0]);
  }
  
  const effectCategories = ['career', 'academic', 'wealth', 'relationship', 'health'];
  if (Math.random() > 0.2) {
    const category = effectCategories[0];
    if (fragments[category]) {
      parts.push(fragments[category][0]);
    }
  }
  
  if (fragments.gratitude && Math.random() > 0.6) {
    parts.push(fragments.gratitude[0]);
  }
  
  if (fragments.energyReport && Math.random() > 0.8) {
    parts.push(fragments.energyReport[0]);
  }
  
  if (fragments.recommendation && Math.random() > 0.5) {
    parts.push(fragments.recommendation[0]);
  }
  
  // 保底
  if (parts.length === 0) {
    if (fragments.quality) {
      parts.push(fragments.quality[0]);
    }
    if (fragments.recommendation) {
      parts.push(fragments.recommendation[0]);
    }
  }
  
  return parts.join(' ');
}

// 测试10次
console.log('测试generateReviewContent函数:');
for (let i = 0; i < 10; i++) {
  const content = generateReviewContent('en', i % 2 === 0);
  console.log(`\n${i + 1}. Length: ${content.length}, Content: ${content.substring(0, 100)}...`);
}
