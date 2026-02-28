import mysql from 'mysql2/promise';

const PROD_DB = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

async function main() {
  const conn = await mysql.createConnection(PROD_DB);
  
  // 桃木葫芦挂件钥匙扣 -> Peach Wood Gourd Keychain
  const name = JSON.stringify({
    en: "Peach Wood Gourd Keychain Pendant",
    zh: "桃木葫芦挂件钥匙扣",
    "zh-Hant": "桃木葫蘆掛件鑰匙扣",
    de: "Pfirsichholz-Kürbis-Schlüsselanhänger",
    fr: "Porte-clés Gourde en Bois de Pêcher",
    es: "Llavero Calabaza de Madera de Melocotonero",
    it: "Portachiavi Zucca in Legno di Pesco",
    pt: "Chaveiro Cabaça de Madeira de Pessegueiro",
    ru: "Брелок «Тыква» из персикового дерева",
    ja: "桃の木ひょうたんキーホルダー",
    ko: "복숭아나무 호리병 열쇠고리",
    ar: "سلسلة مفاتيح القرع من خشب الخوخ",
    hi: "आड़ू की लकड़ी का लौकी चाबी का गुच्छा",
    th: "พวงกุญแจน้ำเต้าไม้พีช",
    vi: "Móc chìa khóa bầu gỗ đào",
    id: "Gantungan Kunci Labu Kayu Persik",
    tr: "Şeftali Ağacı Kabak Anahtarlık"
  });

  const description = JSON.stringify({
    en: "Handcrafted from natural peach wood, this gourd-shaped keychain pendant carries the blessing energy of Wutai Mountain. The gourd (hulu) symbolizes good fortune, health, and the ability to ward off negative energy. Imbued at Mount Wutai's sacred temples, it serves as a protective talisman for daily life. Gourd size: 6.5×3.2cm, total length approx. 15cm.",
    zh: "天然老桃木精雕葫芦，五台山启蕴启蕴，辟邪保平安，葫芦6.5×3.2cm，总长约15cm",
    "zh-Hant": "天然老桃木精雕葫蘆，五台山啟蘊啟蘊，辟邪保平安，葫蘆6.5×3.2cm，總長約15cm",
    de: "Handgefertigter Kürbis-Schlüsselanhänger aus natürlichem Pfirsichholz, gesegnet am Wutai-Berg. Kürbis 6,5×3,2cm, Gesamtlänge ca. 15cm.",
    fr: "Porte-clés gourde sculpté à la main en bois de pêcher naturel, béni au Mont Wutai. Gourde 6,5×3,2cm, longueur totale env. 15cm.",
    es: "Llavero calabaza tallado a mano en madera de melocotonero natural, bendecido en el Monte Wutai. Calabaza 6,5×3,2cm, longitud total aprox. 15cm.",
    it: "Portachiavi zucca intagliato a mano in legno di pesco naturale, benedetto sul Monte Wutai. Zucca 6,5×3,2cm, lunghezza totale circa 15cm.",
    pt: "Chaveiro cabaça esculpido à mão em madeira de pessegueiro natural, abençoado no Monte Wutai. Cabaça 6,5×3,2cm, comprimento total aprox. 15cm.",
    ru: "Брелок-тыква ручной работы из натурального персикового дерева, освящённый на горе Утайшань. Тыква 6,5×3,2см, общая длина ок. 15см.",
    ja: "天然桃の木から手彫りされたひょうたんキーホルダー、五台山で祈祷済み。ひょうたん6.5×3.2cm、全長約15cm。",
    ko: "천연 복숭아나무로 수공예 제작된 호리병 열쇠고리, 오대산에서 축복받음. 호리병 6.5×3.2cm, 전체 길이 약 15cm.",
    ar: "سلسلة مفاتيح القرع المنحوتة يدويًا من خشب الخوخ الطبيعي، مباركة في جبل وتاي. القرع 6.5×3.2سم، الطول الإجمالي حوالي 15سم.",
    hi: "प्राकृतिक आड़ू की लकड़ी से हस्तनिर्मित लौकी चाबी का गुच्छा, वुताई पर्वत पर आशीर्वादित। लौकी 6.5×3.2cm, कुल लंबाई लगभग 15cm।",
    th: "พวงกุญแจน้ำเต้าแกะสลักด้วยมือจากไม้พีชธรรมชาติ ผ่านพิธีอธิษฐานที่ภูเขาอู่ไถ น้ำเต้า 6.5×3.2ซม. ความยาวรวมประมาณ 15ซม.",
    vi: "Móc chìa khóa bầu thủ công từ gỗ đào tự nhiên, được gia trì tại Núi Ngũ Đài. Bầu 6.5×3.2cm, tổng chiều dài khoảng 15cm.",
    id: "Gantungan kunci labu buatan tangan dari kayu persik alami, diberkati di Gunung Wutai. Labu 6.5×3.2cm, panjang total sekitar 15cm.",
    tr: "Doğal şeftali ağacından el yapımı kabak anahtarlık, Wutai Dağı'nda kutsanmış. Kabak 6.5×3.2cm, toplam uzunluk yaklaşık 15cm."
  });

  await conn.execute(
    'UPDATE products SET name = ?, description = ?, slug = ? WHERE id = 630001',
    [name, description, 'peach-wood-gourd-keychain']
  );
  
  console.log('✅ 产品 630001 已更新为英文名称');
  await conn.end();
}

main().catch(console.error);
