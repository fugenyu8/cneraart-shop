import mysql from 'mysql2/promise';

const DB_URL = process.env.DATABASE_URL;

const descriptions = {
  // ID 1: Chinese Zodiac Guardian Pendant (父级分类 - 12生肖)
  1: `Ancient Eastern Ritual-Enhanced Symbolic Talisman. Handcrafted by masters from Wutai Mountain, each Chinese Zodiac Guardian Pendant is individually consecrated through a sacred seven-day blessing ceremony. The pendant features your birth-year zodiac animal, intricately carved in premium sterling silver with traditional Eastern motifs. Wutai Mountain — one of the Four Sacred Buddhist Mountains of China — is renowned for its powerful spiritual energy. Our master artisans combine centuries-old metalworking techniques with sacred consecration rituals to create a talisman that serves as both a stunning piece of jewelry and a powerful spiritual guardian. Each pendant comes with a certificate of authenticity and blessing documentation.`,

  // ID 2: Eastern Ancient Wisdom Text Pendant (佛经吊坠)
  2: `Ritual-Enlivened Spiritual Symbol Amulet. Inscribed with ancient scriptures and blessed through traditional consecration ceremonies at Wutai Mountain. These exquisite pendants carry the sacred words of Eastern wisdom texts — including the Heart Sutra, Great Compassion Mantra, and other revered scriptures — meticulously engraved with microscopic precision. Each character is rendered with extraordinary detail, transforming profound spiritual teachings into wearable art. The consecration ceremony, performed by senior monks, infuses each pendant with protective and auspicious energy. Crafted from premium materials and designed for daily wear, these pendants serve as constant reminders of ancient wisdom and spiritual protection.`,

  // ID 3: Esoteric North Star Seven-Star Pendant (七星吊坠)
  3: `Ritual-Infused Cosmic Protection Amulet. Aligned with the Big Dipper constellation, this pendant channels the celestial energies of the seven stars that have guided seekers for millennia. In Eastern esoteric traditions, the Big Dipper (北斗七星) governs fate, fortune, and spiritual protection. Each of the seven stars corresponds to specific aspects of life — career, wealth, relationships, health, wisdom, longevity, and spiritual cultivation. Our master craftsmen recreate this sacred stellar pattern with precision, and each pendant undergoes a special consecration ritual at Wutai Mountain to activate its cosmic protective properties. A powerful talisman for those seeking celestial guidance and comprehensive life protection.`,

  // ID 4: Master-Infused Energy Bracelet (手链)
  4: `Embedded with Ancient Scriptural Wisdom. Each bead is individually blessed by Wutai Mountain monks through a meticulous consecration process. Our Master-Infused Energy Bracelets feature complete sacred texts — including the Heart Sutra, Great Compassion Mantra, Shurangama Mantra, and other powerful scriptures — engraved with extraordinary precision on premium materials. The bracelets combine traditional Eastern craftsmanship with spiritual significance, creating pieces that are both beautiful accessories and powerful spiritual tools. Wearing these bracelets keeps sacred wisdom close to your pulse, creating a continuous connection with protective and auspicious energies throughout your day.`,

  // ID 5: Zodiac Constellation Guardian Pendant (太阳星座)
  5: `Eastern Ritual-Enhanced Celestial Talisman. Connects you with the cosmic energies of your birth constellation. Each Sun Sign Guardian Pendant features your zodiac constellation intricately carved in stone-textured sterling silver, combining Western astrological wisdom with Eastern blessing traditions. The front displays your constellation symbol and star pattern, while the reverse carries a sacred Eastern blessing seal. Consecrated at Wutai Mountain through a ceremony that aligns celestial energies with traditional Buddhist blessings, these pendants bridge two great spiritual traditions. Available for all twelve zodiac signs — from Aries to Pisces — each pendant is a unique fusion of cosmic identity and spiritual protection.`,

  // ID 6: Zodiac Moon Crescent Pendant (月亮星座)
  6: `Ancient Eastern Ritual-Enhanced Celestial Symbol Accessory. Harmonizes lunar energies with your personal destiny. The Moon Crescent Pendant series captures the mystical beauty of the crescent moon, with each piece featuring a luminous zodiac constellation design set within an elegant crescent frame. In both Eastern and Western traditions, the moon governs emotions, intuition, and inner wisdom. These pendants combine the gentle power of lunar energy with the specific qualities of your zodiac sign, creating a deeply personal talisman. Each pendant is blessed at Wutai Mountain during auspicious lunar phases, ensuring the consecration ceremony resonates with the moon's natural rhythms. A perfect companion for those seeking emotional balance and intuitive guidance.`,

  // ID 7: Ancient Chinese Wisdom Analysis ($19命理)
  7: `Unlock Ancient Chinese Wisdom for Only $19! Comprehensive Four Pillars of Destiny (八字) analysis based on your birth date and time. This foundational reading reveals the elemental forces that shape your life path, including your innate strengths, potential challenges, and optimal timing for major decisions. Our experienced practitioners combine traditional BaZi methodology with modern interpretive techniques to deliver a clear, actionable report. You will receive insights into career direction, financial potential, relationship compatibility, and health tendencies. The detailed PDF report is delivered within 48 hours and includes personalized recommendations for enhancing your fortune and navigating life transitions.`,

  // ID 8: Dual Blessings Package ($79命理)
  8: `Only $79! Get Dual Blessings of Destiny Analysis + Wutai Mountain Blessing Ceremony! This premium package combines our comprehensive Four Pillars of Destiny analysis with an exclusive blessing ceremony performed at Wutai Mountain on your behalf. The destiny analysis provides deep insights into your life path, while the blessing ceremony — conducted by senior monks at one of China's most sacred Buddhist sites — adds powerful spiritual support. You will receive a detailed destiny report, photos and video of your personal blessing ceremony, a consecrated amulet shipped to your address, and ongoing spiritual guidance. This is our most popular package for those seeking both wisdom and divine protection.`,

  // ID 9: Wutai Mountain Incense Offering ($69供香)
  9: `A stick of incense, a wish, a blessing from Wutai Mountain. Monks will light incense for your intentions at one of Buddhism's most sacred sites. The incense offering ceremony is one of the oldest and most revered practices in Eastern spiritual tradition — the rising smoke carries your prayers and wishes to the heavens. Our monks perform this ceremony with deep reverence, reciting sutras and mantras specifically for your stated intentions. You will receive photographic documentation of the ceremony, a personalized blessing certificate, and a follow-up report on the auspicious signs observed during the ritual. Available for various intentions including health, career, relationships, and general blessings.`,

  // ID 10: Lamp Offering for Blessings ($69供灯)
  10: `Offering lamps for blessings. Traditional butter lamp ceremony performed at Wutai Mountain temples. In Buddhist tradition, lighting a lamp symbolizes dispelling the darkness of ignorance and illuminating the path to wisdom and good fortune. Our monks arrange and light traditional butter lamps in the sacred halls of Wutai Mountain, dedicating each flame to your specific wishes and intentions. The warm glow of these lamps is believed to attract positive energy, ward off negative influences, and create merit that benefits both the dedicator and all sentient beings. You will receive photos of your lamp offering and a blessing certificate documenting the ceremony.`,

  // ID 11: Incense and Amulet Package ($159供香+护身符)
  11: `Includes consecrated amulet and 7-day incense offering ceremony at Wutai Mountain. This enhanced package combines the spiritual power of a week-long incense offering ceremony with a personally consecrated protective amulet. For seven consecutive days, monks at Wutai Mountain will light incense and recite sutras on your behalf, building cumulative spiritual merit and protection. The consecrated amulet — blessed during this extended ceremony — absorbs the concentrated spiritual energy of seven days of prayers, making it an exceptionally powerful protective talisman. The package includes daily ceremony photos, a detailed blessing report, and the consecrated amulet shipped directly to your address worldwide.`,

  // ID 12: Complete Blessing Ceremony ($209全套)
  12: `Full 21-day blessing ceremony with multiple rituals at Wutai Mountain. Our most comprehensive spiritual service combines three weeks of daily ceremonies, including incense offerings, lamp lighting, sutra recitation, and special blessing rituals performed by senior monks. This extended ceremony creates the deepest possible spiritual connection with the sacred energies of Wutai Mountain. The package includes a premium consecrated amulet, a jade blessing token, daily ceremony documentation, a comprehensive spiritual assessment report, and personalized guidance for maintaining spiritual protection throughout the year. This is our ultimate offering for those seeking the most thorough and powerful spiritual support available.`,
};

async function main() {
  const conn = await mysql.createConnection(DB_URL);
  
  for (const [id, desc] of Object.entries(descriptions)) {
    await conn.execute('UPDATE products SET description = ? WHERE id = ?', [desc, parseInt(id)]);
    console.log(`Updated ID ${id}: ${desc.length} chars`);
  }
  
  console.log('\nAll descriptions updated!');
  await conn.end();
}

main().catch(console.error);
