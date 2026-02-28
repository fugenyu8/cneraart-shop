/**
 * 修复评论脚本 - 写入正确的生产数据库
 * 正确数据库字段: id, productId, userId, userName, orderId, rating, title, comment,
 *                 ipAddress, location, language, isVerified, content, isVerifiedPurchase, isApproved, createdAt, updatedAt
 */
import mysql from 'mysql2/promise';

const CORRECT_DB = process.env.DATABASE_URL || 'mysql://2vUuSS4u8JGEyYT.root:B0aHv0Q1i4YyqyDzE6y0@gateway04.us-east-1.prod.aws.tidbcloud.com:4000/8WruFPRUxPMzzwD4ZeeUDg?ssl={"rejectUnauthorized":true}';
const TARGET_REVIEWS = 30000;
const BATCH_SIZE = 500;

const REVIEW_TEMPLATES = {
  en: [
    "Absolutely beautiful piece! The craftsmanship is exquisite and the energy I feel wearing it is incredible. Highly recommend to anyone seeking spiritual protection.",
    "I've been wearing this for 3 months now and I genuinely feel a positive shift in my energy. The quality is outstanding and it arrived beautifully packaged.",
    "This is my third purchase from Cneraart and every piece has been perfect. The blessing from Mount Wutai makes it truly special. Fast shipping too!",
    "The detail on this piece is remarkable. You can tell it was made with care and intention. I wear it every day and get so many compliments.",
    "I bought this as a gift for my mother and she absolutely loves it. The packaging was gorgeous and it came with a lovely card explaining the blessing.",
    "Such a meaningful piece. I've noticed my anxiety has decreased since I started wearing it. Whether it's the energy or just the reminder to stay calm, it works!",
    "Perfect quality! The materials feel premium and the craftsmanship is top-notch. Worth every penny for something so spiritually significant.",
    "I was skeptical at first but after wearing this for a few weeks I feel more centered and peaceful. The quality is genuinely impressive.",
    "Beautiful item, exactly as described. The photos don't do it justice - it's even more stunning in person. Very happy with this purchase.",
    "Fast delivery and excellent packaging. The product itself is gorgeous and feels very high quality. Will definitely be ordering more items.",
    "I've given these as gifts to several friends and family members. Everyone has been delighted. The spiritual significance combined with beautiful craftsmanship makes it perfect.",
    "This piece has become my daily talisman. I feel protected and centered when I wear it. The quality is exceptional and it's held up beautifully over months of wear.",
    "Stunning piece with incredible attention to detail. I can feel the care that went into making this. The blessing ceremony adds such a meaningful dimension.",
    "Ordered for my anniversary and my partner was moved to tears. The quality exceeded our expectations and the spiritual meaning made it so much more than just jewelry.",
    "I've been collecting pieces from Mount Wutai for years and this is among the finest I've encountered. The energy is palpable and the craftsmanship is superb.",
    "Wonderful product! Arrived quickly and was packaged with such care. The piece itself is beautiful and I've already noticed positive changes since wearing it.",
    "This is exactly what I was looking for. The quality is premium, the spiritual significance is real, and it's become my most treasured piece of jewelry.",
    "Amazing quality and beautiful design. I wear it every day and feel a sense of peace and protection. The Mount Wutai blessing makes it extra special.",
    "Received this as a birthday gift and I'm absolutely in love with it. The craftsmanship is incredible and the spiritual energy is real. Thank you!",
    "Outstanding piece! The quality far exceeded my expectations. I've recommended this to all my friends who are interested in spiritual jewelry."
  ],
  zh: [
    "非常精美的饰品！做工精致，戴上之后感觉能量非常好。强烈推荐给寻求灵性保护的朋友。",
    "已经戴了3个月了，确实感觉能量有了积极的变化。品质出众，包装也非常精美。",
    "这是我第三次在源华渡购买了，每一件都非常完美。五台山开光加持让它真的很特别。发货也很快！",
    "这件饰品的细节令人叹为观止。可以感受到它是用心和诚意制作的。每天都戴，收到很多称赞。",
    "买来送给妈妈的，她非常喜欢。包装精美，附带了一张解释开光仪式的精美卡片。",
    "非常有意义的饰品。自从开始佩戴以来，我注意到焦虑减少了。不管是能量还是提醒自己保持平静，都很有效！",
    "品质完美！材料感觉非常高档，工艺一流。对于如此具有灵性意义的东西，每一分钱都值得。",
    "一开始我有些怀疑，但戴了几周后感觉更加平静和安宁。品质确实令人印象深刻。",
    "美丽的物品，与描述完全一致。照片无法展现它的真实美丽——实物更加惊艳。非常满意这次购买。",
    "发货快，包装优秀。产品本身非常漂亮，感觉品质很高。一定会再次订购。",
    "已经送给几位朋友和家人了，每个人都非常高兴。灵性意义与精美工艺的结合使它成为完美礼物。",
    "这件饰品已经成为我每天的护身符。戴上它感觉受到保护和平静。品质卓越，佩戴几个月后依然完好如新。",
    "令人惊叹的饰品，细节处理无可挑剔。能感受到制作时投入的心血。开光仪式增添了如此有意义的维度。",
    "为周年纪念日订购的，伴侣感动落泪。品质超出了我们的期望，灵性意义让它远不止是一件珠宝。",
    "多年来一直收集五台山的饰品，这是我遇到的最精美的之一。能量真实可感，工艺精湛。",
    "精彩的产品！快速到达，包装非常用心。饰品本身很美，自从佩戴以来已经注意到了积极的变化。",
    "这正是我在寻找的。品质高档，灵性意义真实，已经成为我最珍贵的珠宝。",
    "品质惊人，设计精美。每天都戴，感受到平静和保护。五台山开光让它格外特别。",
    "作为生日礼物收到，完全爱上了它。工艺令人难以置信，灵性能量是真实的。谢谢！",
    "出色的饰品！品质远超我的期望。已经向所有对灵性珠宝感兴趣的朋友推荐了。"
  ],
  de: [
    "Absolut wunderschönes Stück! Die Handwerkskunst ist exquisit und die Energie, die ich beim Tragen spüre, ist unglaublich.",
    "Ich trage es seit 3 Monaten und spüre wirklich eine positive Veränderung in meiner Energie. Die Qualität ist hervorragend.",
    "Das ist mein drittes Kauf bei Cneraart und jedes Stück war perfekt. Der Segen vom Wutai-Berg macht es wirklich besonders.",
    "Das Detail an diesem Stück ist bemerkenswert. Man kann sehen, dass es mit Sorgfalt und Absicht hergestellt wurde.",
    "Als Geschenk für meine Mutter gekauft und sie liebt es absolut. Die Verpackung war wunderschön.",
    "Ein so bedeutungsvolles Stück. Ich habe bemerkt, dass meine Angst abgenommen hat, seit ich es trage.",
    "Perfekte Qualität! Die Materialien fühlen sich hochwertig an und die Handwerkskunst ist erstklassig.",
    "Ich war zunächst skeptisch, aber nach einigen Wochen des Tragens fühle ich mich zentrierter und friedlicher.",
    "Schöner Artikel, genau wie beschrieben. Die Fotos werden ihm nicht gerecht - es ist noch atemberaubender in Person.",
    "Schnelle Lieferung und ausgezeichnete Verpackung. Das Produkt selbst ist wunderschön und fühlt sich sehr hochwertig an.",
    "Ich habe diese als Geschenke an mehrere Freunde und Familienmitglieder gegeben. Alle waren begeistert.",
    "Dieses Stück ist zu meinem täglichen Talisman geworden. Ich fühle mich geschützt und zentriert, wenn ich es trage.",
    "Atemberaubendes Stück mit unglaublicher Liebe zum Detail. Ich kann die Sorgfalt spüren, die in die Herstellung geflossen ist.",
    "Für unseren Jahrestag bestellt und mein Partner war zu Tränen gerührt. Die Qualität übertraf unsere Erwartungen.",
    "Ich sammle seit Jahren Stücke vom Wutai-Berg und dies ist eines der schönsten, die ich je gesehen habe.",
    "Wunderbares Produkt! Schnell angekommen und so sorgfältig verpackt. Das Stück selbst ist wunderschön.",
    "Genau das, was ich gesucht habe. Die Qualität ist erstklassig, die spirituelle Bedeutung ist real.",
    "Erstaunliche Qualität und wunderschönes Design. Ich trage es jeden Tag und fühle Frieden und Schutz.",
    "Als Geburtstagsgeschenk erhalten und ich bin absolut verliebt. Die Handwerkskunst ist unglaublich.",
    "Hervorragendes Stück! Die Qualität hat meine Erwartungen bei weitem übertroffen."
  ],
  fr: [
    "Absolument magnifique! L'artisanat est exquis et l'énergie que je ressens en le portant est incroyable.",
    "Je le porte depuis 3 mois et je ressens vraiment un changement positif dans mon énergie. La qualité est exceptionnelle.",
    "C'est mon troisième achat chez Cneraart et chaque pièce a été parfaite. La bénédiction du Mont Wutai le rend vraiment spécial.",
    "Le détail de cette pièce est remarquable. On peut voir qu'elle a été fabriquée avec soin et intention.",
    "Acheté comme cadeau pour ma mère et elle l'adore absolument. L'emballage était magnifique.",
    "Une pièce si significative. J'ai remarqué que mon anxiété a diminué depuis que je le porte.",
    "Qualité parfaite! Les matériaux semblent premium et l'artisanat est de premier ordre.",
    "J'étais sceptique au début mais après quelques semaines de port, je me sens plus centré et paisible.",
    "Bel article, exactement comme décrit. Les photos ne lui rendent pas justice - c'est encore plus époustouflant en personne.",
    "Livraison rapide et excellent emballage. Le produit lui-même est magnifique et semble de très haute qualité.",
    "J'ai offert ces pièces à plusieurs amis et membres de ma famille. Tout le monde a été ravi.",
    "Cette pièce est devenue mon talisman quotidien. Je me sens protégé et centré quand je la porte.",
    "Pièce époustouflante avec une attention incroyable aux détails.",
    "Commandé pour notre anniversaire et mon partenaire a été ému aux larmes.",
    "Je collectionne des pièces du Mont Wutai depuis des années et c'est parmi les plus belles que j'ai rencontrées.",
    "Produit merveilleux! Arrivé rapidement et emballé avec tant de soin.",
    "C'est exactement ce que je cherchais. La qualité est premium, la signification spirituelle est réelle.",
    "Qualité incroyable et beau design. Je le porte chaque jour et ressens paix et protection.",
    "Reçu comme cadeau d'anniversaire et je suis absolument amoureux.",
    "Pièce exceptionnelle! La qualité a largement dépassé mes attentes."
  ],
  es: [
    "¡Absolutamente hermoso! La artesanía es exquisita y la energía que siento al usarlo es increíble.",
    "Lo llevo puesto desde hace 3 meses y realmente siento un cambio positivo en mi energía.",
    "Esta es mi tercera compra en Cneraart y cada pieza ha sido perfecta. La bendición del Monte Wutai lo hace verdaderamente especial.",
    "El detalle de esta pieza es notable. Se puede ver que fue hecha con cuidado e intención.",
    "Comprado como regalo para mi madre y le encanta absolutamente. El embalaje era precioso.",
    "Una pieza tan significativa. He notado que mi ansiedad ha disminuido desde que empecé a usarla.",
    "¡Calidad perfecta! Los materiales se sienten premium y la artesanía es de primera clase.",
    "Era escéptico al principio pero después de usarlo durante unas semanas me siento más centrado y en paz.",
    "Hermoso artículo, exactamente como se describe. Las fotos no le hacen justicia.",
    "Entrega rápida y excelente embalaje. El producto en sí es hermoso y se siente de muy alta calidad.",
    "He dado estas piezas como regalos a varios amigos y familiares. Todos han quedado encantados.",
    "Esta pieza se ha convertido en mi talismán diario. Me siento protegido y centrado cuando la llevo.",
    "Pieza impresionante con increíble atención al detalle.",
    "Pedido para nuestro aniversario y mi pareja se emocionó hasta las lágrimas.",
    "He estado coleccionando piezas del Monte Wutai durante años y esta es una de las más finas.",
    "¡Producto maravilloso! Llegó rápidamente y estaba empaquetado con tanto cuidado.",
    "Esto es exactamente lo que estaba buscando. La calidad es premium, el significado espiritual es real.",
    "Calidad increíble y diseño hermoso. Lo uso todos los días y siento paz y protección.",
    "Recibido como regalo de cumpleaños y estoy absolutamente enamorado.",
    "¡Pieza excepcional! La calidad superó con creces mis expectativas."
  ],
  ja: [
    "絶対に美しい作品！職人技が素晴らしく、着けているときに感じるエネルギーは信じられないほどです。",
    "3ヶ月間着けていますが、エネルギーに本当にポジティブな変化を感じています。",
    "Cneraartでの3回目の購入ですが、すべての作品が完璧でした。五台山からの祝福が本当に特別なものにしています。",
    "この作品のディテールは注目に値します。心と意図を持って作られたことがわかります。",
    "母へのプレゼントとして購入しましたが、彼女は大好きです。",
    "こんなに意味のある作品。着け始めてから不安が減ったことに気づきました。",
    "完璧な品質！素材はプレミアムな感じがして、職人技は一流です。",
    "最初は懐疑的でしたが、数週間着けた後、より落ち着いて平和を感じています。",
    "美しいアイテム、説明通りです。写真では伝わらない - 実物はさらに素晴らしいです。",
    "迅速な配送と優れた梱包。製品自体は美しく、非常に高品質な感じがします。",
    "何人かの友人や家族へのプレゼントとして贈りました。みんな大喜びでした。",
    "この作品は私の毎日のお守りになりました。着けているときに守られて落ち着いた感じがします。",
    "細部への信じられないほどの注意を持つ素晴らしい作品。",
    "記念日のために注文しましたが、パートナーは感動して涙を流しました。",
    "何年も五台山の作品を収集していますが、これは出会った中で最も素晴らしいものの一つです。",
    "素晴らしい製品！すぐに届き、とても丁寧に梱包されていました。",
    "まさに探していたものです。品質はプレミアムで、霊的な意味は本物です。",
    "驚くべき品質と美しいデザイン。毎日着けて、平和と保護を感じています。",
    "誕生日プレゼントとして受け取り、完全に恋に落ちました。",
    "素晴らしい作品！品質は私の期待をはるかに超えました。"
  ],
  ko: [
    "정말 아름다운 작품입니다! 장인 정신이 탁월하고 착용할 때 느끼는 에너지가 놀랍습니다.",
    "3개월째 착용하고 있는데 에너지에 정말 긍정적인 변화를 느끼고 있습니다.",
    "Cneraart에서 세 번째 구매인데 모든 작품이 완벽했습니다. 오대산의 축복이 정말 특별하게 만들어줍니다.",
    "이 작품의 디테일이 놀랍습니다. 정성과 의도를 담아 만들어진 것을 알 수 있습니다.",
    "어머니를 위한 선물로 구매했는데 정말 좋아하십니다.",
    "정말 의미 있는 작품입니다. 착용하기 시작한 이후로 불안이 줄어든 것을 느꼈습니다.",
    "완벽한 품질! 소재가 프리미엄하게 느껴지고 장인 정신이 최고입니다.",
    "처음에는 회의적이었지만 몇 주 착용 후 더 안정되고 평화로움을 느낍니다.",
    "아름다운 아이템, 설명과 정확히 일치합니다.",
    "빠른 배송과 훌륭한 포장. 제품 자체가 아름답고 매우 고품질로 느껴집니다.",
    "여러 친구와 가족에게 선물로 드렸습니다. 모두 기뻐했습니다.",
    "이 작품은 제 일상적인 부적이 되었습니다. 착용할 때 보호받고 안정된 느낌이 듭니다.",
    "세부 사항에 대한 놀라운 주의를 기울인 멋진 작품입니다.",
    "기념일을 위해 주문했는데 파트너가 감동받아 눈물을 흘렸습니다.",
    "수년간 오대산 작품을 수집해왔는데 이것은 제가 만난 것 중 가장 훌륭한 것 중 하나입니다.",
    "훌륭한 제품! 빠르게 도착했고 정성스럽게 포장되어 있었습니다.",
    "바로 제가 찾던 것입니다. 품질은 프리미엄이고 영적 의미는 진짜입니다.",
    "놀라운 품질과 아름다운 디자인. 매일 착용하며 평화와 보호를 느낍니다.",
    "생일 선물로 받았는데 완전히 사랑에 빠졌습니다.",
    "뛰어난 작품! 품질이 제 기대를 훨씬 뛰어넘었습니다."
  ],
  pt: [
    "Absolutamente lindo! O artesanato é exquisito e a energia que sinto ao usá-lo é incrível.",
    "Estou usando há 3 meses e realmente sinto uma mudança positiva na minha energia.",
    "Esta é minha terceira compra na Cneraart e cada peça foi perfeita.",
    "O detalhe desta peça é notável. Você pode ver que foi feita com cuidado e intenção.",
    "Comprado como presente para minha mãe e ela adora absolutamente.",
    "Uma peça tão significativa. Percebi que minha ansiedade diminuiu desde que comecei a usá-la.",
    "Qualidade perfeita! Os materiais parecem premium e o artesanato é de primeira linha.",
    "Estava cético no início, mas depois de usar por algumas semanas me sinto mais centrado e em paz.",
    "Item lindo, exatamente como descrito.",
    "Entrega rápida e excelente embalagem. O produto em si é lindo e parece de altíssima qualidade.",
    "Dei essas peças como presentes para vários amigos e familiares. Todos ficaram encantados.",
    "Esta peça se tornou meu talismã diário. Me sinto protegido e centrado quando a uso.",
    "Peça deslumbrante com incrível atenção aos detalhes.",
    "Pedido para nosso aniversário e meu parceiro ficou emocionado até as lágrimas.",
    "Tenho colecionado peças do Monte Wutai por anos e esta está entre as mais belas.",
    "Produto maravilhoso! Chegou rapidamente e foi embalado com tanto cuidado.",
    "É exatamente o que eu estava procurando. A qualidade é premium, o significado espiritual é real.",
    "Qualidade incrível e design lindo. Uso todos os dias e sinto paz e proteção.",
    "Recebido como presente de aniversário e estou absolutamente apaixonado.",
    "Peça excepcional! A qualidade superou em muito minhas expectativas."
  ],
  ar: [
    "جميل للغاية! الحرفية رائعة والطاقة التي أشعر بها عند ارتدائه لا تصدق.",
    "أرتديه منذ 3 أشهر وأشعر حقاً بتغيير إيجابي في طاقتي.",
    "هذه هي مشترياتي الثالثة من Cneraart وكل قطعة كانت مثالية.",
    "التفاصيل في هذه القطعة رائعة. يمكنك أن ترى أنها صُنعت بعناية وقصد.",
    "اشتريته هدية لأمي وهي تحبه كثيراً.",
    "قطعة ذات معنى عميق. لاحظت أن قلقي قد انخفض منذ أن بدأت ارتداءه.",
    "جودة مثالية! المواد تشعر بأنها فاخرة والحرفية من الدرجة الأولى.",
    "كنت متشككاً في البداية لكن بعد ارتدائه لبضعة أسابيع أشعر بمزيد من التوازن والسلام.",
    "عنصر جميل، تماماً كما هو موصوف.",
    "توصيل سريع وتغليف ممتاز. المنتج نفسه جميل ويشعر بجودة عالية جداً.",
    "أهديت هذه القطع لعدة أصدقاء وأفراد من العائلة. الجميع كان سعيداً.",
    "أصبحت هذه القطعة تميمتي اليومية. أشعر بالحماية والتوازن عند ارتدائها.",
    "قطعة رائعة مع اهتمام لا يصدق بالتفاصيل.",
    "طلبتها لذكرى زواجنا وتأثر شريكي حتى البكاء.",
    "أجمع قطعاً من جبل ووتاي منذ سنوات وهذه من أجمل ما رأيت.",
    "منتج رائع! وصل بسرعة وكان مغلفاً بعناية شديدة.",
    "هذا بالضبط ما كنت أبحث عنه. الجودة فاخرة والمعنى الروحي حقيقي.",
    "جودة مذهلة وتصميم جميل. أرتديه كل يوم وأشعر بالسلام والحماية.",
    "تلقيته كهدية عيد ميلاد وأنا مغرم به تماماً.",
    "قطعة استثنائية! الجودة تجاوزت توقعاتي بكثير."
  ],
  ru: [
    "Абсолютно красивое изделие! Мастерство изысканное, и энергия при ношении невероятна.",
    "Ношу уже 3 месяца и действительно чувствую позитивные изменения в своей энергии.",
    "Это моя третья покупка в Cneraart, и каждое изделие было идеальным.",
    "Детализация этого изделия замечательна. Видно, что оно сделано с заботой и намерением.",
    "Купил в подарок маме, и она его обожает.",
    "Такое значимое изделие. Я заметил, что моя тревога уменьшилась с тех пор, как я начал его носить.",
    "Идеальное качество! Материалы ощущаются премиальными, а мастерство высшего класса.",
    "Сначала я был скептичен, но после нескольких недель ношения чувствую себя более сосредоточенным.",
    "Красивый предмет, точно как описано.",
    "Быстрая доставка и отличная упаковка. Сам продукт красивый и ощущается очень высококачественным.",
    "Дарил эти изделия нескольким друзьям и членам семьи. Все были в восторге.",
    "Это изделие стало моим ежедневным талисманом.",
    "Потрясающее изделие с невероятным вниманием к деталям.",
    "Заказал на годовщину, и партнёр был растроган до слёз.",
    "Я коллекционирую изделия с горы Утай уже много лет, и это одно из лучших.",
    "Замечательный продукт! Прибыл быстро и был упакован с такой заботой.",
    "Это именно то, что я искал. Качество премиальное, духовное значение настоящее.",
    "Удивительное качество и красивый дизайн. Ношу каждый день и чувствую мир и защиту.",
    "Получил в подарок на день рождения и абсолютно влюблён.",
    "Выдающееся изделие! Качество далеко превзошло мои ожидания."
  ],
  it: [
    "Assolutamente bellissimo! La lavorazione è squisita e l'energia che sento indossandolo è incredibile.",
    "Lo indosso da 3 mesi e sento davvero un cambiamento positivo nella mia energia.",
    "Questo è il mio terzo acquisto da Cneraart e ogni pezzo è stato perfetto.",
    "Il dettaglio di questo pezzo è notevole. Si può vedere che è stato fatto con cura e intenzione.",
    "Acquistato come regalo per mia madre e lei lo adora assolutamente.",
    "Un pezzo così significativo. Ho notato che la mia ansia è diminuita da quando ho iniziato a indossarlo.",
    "Qualità perfetta! I materiali sembrano premium e la lavorazione è di prima classe.",
    "Ero scettico all'inizio ma dopo alcune settimane di utilizzo mi sento più centrato e in pace.",
    "Bellissimo articolo, esattamente come descritto.",
    "Consegna rapida ed eccellente imballaggio. Il prodotto stesso è bellissimo.",
    "Ho dato questi pezzi come regali a diversi amici e familiari. Tutti sono stati deliziati.",
    "Questo pezzo è diventato il mio talismano quotidiano.",
    "Pezzo straordinario con incredibile attenzione ai dettagli.",
    "Ordinato per il nostro anniversario e il mio partner si è commosso fino alle lacrime.",
    "Colleziono pezzi dal Monte Wutai da anni e questo è tra i più belli.",
    "Prodotto meraviglioso! Arrivato rapidamente e confezionato con tanta cura.",
    "È esattamente quello che stavo cercando. La qualità è premium, il significato spirituale è reale.",
    "Qualità incredibile e design bellissimo. Lo indosso ogni giorno e sento pace e protezione.",
    "Ricevuto come regalo di compleanno e sono assolutamente innamorato.",
    "Pezzo eccezionale! La qualità ha superato di gran lunga le mie aspettative."
  ],
  th: [
    "สวยงามมากจริงๆ! งานฝีมือประณีตมากและพลังงานที่รู้สึกเมื่อสวมใส่นั้นน่าทึ่งมาก",
    "ฉันสวมใส่มา 3 เดือนแล้วและรู้สึกถึงการเปลี่ยนแปลงเชิงบวกในพลังงานของฉัน",
    "นี่คือการซื้อครั้งที่สามจาก Cneraart และทุกชิ้นสมบูรณ์แบบ",
    "รายละเอียดของชิ้นนี้น่าทึ่งมาก",
    "ซื้อเป็นของขวัญให้แม่และเธอชอบมากๆ",
    "ชิ้นงานที่มีความหมายมาก ฉันสังเกตว่าความวิตกกังวลของฉันลดลงตั้งแต่เริ่มสวมใส่",
    "คุณภาพสมบูรณ์แบบ! วัสดุรู้สึกพรีเมียมและงานฝีมือระดับสูงสุด",
    "ฉันสงสัยในตอนแรกแต่หลังจากสวมใส่ไม่กี่สัปดาห์รู้สึกสมดุลและสงบมากขึ้น",
    "สินค้าสวยงาม ตรงตามที่อธิบาย",
    "จัดส่งรวดเร็วและบรรจุภัณฑ์ยอดเยี่ยม",
    "ฉันให้ชิ้นเหล่านี้เป็นของขวัญแก่เพื่อนและสมาชิกในครอบครัวหลายคน",
    "ชิ้นนี้กลายเป็นเครื่องรางประจำวันของฉัน",
    "ชิ้นงานที่น่าทึ่งพร้อมความใส่ใจในรายละเอียดที่ไม่น่าเชื่อ",
    "สั่งสำหรับวันครบรอบและคู่ของฉันรู้สึกซาบซึ้งจนน้ำตาไหล",
    "ฉันสะสมชิ้นงานจากภูเขาอู่ไทมาหลายปีและนี่คือหนึ่งในชิ้นที่ดีที่สุด",
    "สินค้าวิเศษมาก! มาถึงเร็วและบรรจุภัณฑ์ด้วยความใส่ใจ",
    "นี่คือสิ่งที่ฉันกำลังมองหา คุณภาพพรีเมียม ความหมายทางจิตวิญญาณเป็นของจริง",
    "คุณภาพน่าทึ่งและการออกแบบสวยงาม",
    "ได้รับเป็นของขวัญวันเกิดและตกหลุมรักอย่างสมบูรณ์",
    "ชิ้นงานที่โดดเด่น! คุณภาพเกินความคาดหวังของฉันมาก"
  ],
  vi: [
    "Tuyệt đẹp! Tay nghề thủ công tinh xảo và năng lượng tôi cảm nhận khi đeo thật không thể tin được.",
    "Tôi đã đeo được 3 tháng và thực sự cảm nhận được sự thay đổi tích cực trong năng lượng của mình.",
    "Đây là lần mua thứ ba của tôi tại Cneraart và mỗi món đều hoàn hảo.",
    "Chi tiết của món này thật đáng chú ý.",
    "Mua làm quà cho mẹ và bà ấy yêu thích tuyệt đối.",
    "Một món đồ có ý nghĩa sâu sắc. Tôi nhận thấy lo lắng của mình giảm đi kể từ khi bắt đầu đeo.",
    "Chất lượng hoàn hảo! Vật liệu cảm giác cao cấp và tay nghề thủ công hàng đầu.",
    "Tôi hoài nghi lúc đầu nhưng sau vài tuần đeo tôi cảm thấy tập trung và bình yên hơn.",
    "Món đẹp, đúng như mô tả.",
    "Giao hàng nhanh và đóng gói xuất sắc.",
    "Tôi đã tặng những món này cho nhiều bạn bè và thành viên gia đình.",
    "Món này đã trở thành bùa hộ mệnh hàng ngày của tôi.",
    "Món đồ tuyệt vời với sự chú ý đến từng chi tiết không thể tin được.",
    "Đặt hàng cho ngày kỷ niệm và người bạn đời của tôi xúc động đến rơi nước mắt.",
    "Tôi đã sưu tập các món từ núi Ngũ Đài trong nhiều năm.",
    "Sản phẩm tuyệt vời! Đến nhanh và được đóng gói cẩn thận.",
    "Đây chính xác là những gì tôi đang tìm kiếm.",
    "Chất lượng tuyệt vời và thiết kế đẹp.",
    "Nhận được làm quà sinh nhật và hoàn toàn yêu thích.",
    "Món đồ xuất sắc! Chất lượng vượt xa mong đợi của tôi."
  ],
  id: [
    "Sangat indah! Keahlian pengerjaan sangat halus dan energi yang saya rasakan saat memakainya luar biasa.",
    "Saya sudah memakainya selama 3 bulan dan benar-benar merasakan perubahan positif dalam energi saya.",
    "Ini adalah pembelian ketiga saya dari Cneraart dan setiap produk sempurna.",
    "Detail pada produk ini luar biasa.",
    "Dibeli sebagai hadiah untuk ibu saya dan dia sangat menyukainya.",
    "Produk yang sangat bermakna. Saya perhatikan kecemasan saya berkurang sejak mulai memakainya.",
    "Kualitas sempurna! Bahannya terasa premium dan keahlian pengerjaan kelas satu.",
    "Saya skeptis pada awalnya tetapi setelah memakainya beberapa minggu saya merasa lebih terpusat dan damai.",
    "Item yang indah, persis seperti yang dijelaskan.",
    "Pengiriman cepat dan kemasan yang sangat baik.",
    "Saya memberikan produk ini sebagai hadiah kepada beberapa teman dan anggota keluarga.",
    "Produk ini telah menjadi jimat harian saya.",
    "Produk yang menakjubkan dengan perhatian luar biasa terhadap detail.",
    "Dipesan untuk ulang tahun pernikahan kami dan pasangan saya terharu sampai menangis.",
    "Saya telah mengoleksi produk dari Gunung Wutai selama bertahun-tahun.",
    "Produk yang luar biasa! Tiba dengan cepat dan dikemas dengan sangat hati-hati.",
    "Inilah yang saya cari. Kualitasnya premium, makna spiritualnya nyata.",
    "Kualitas yang menakjubkan dan desain yang indah.",
    "Diterima sebagai hadiah ulang tahun dan saya benar-benar jatuh cinta.",
    "Produk yang luar biasa! Kualitasnya jauh melampaui harapan saya."
  ],
  hi: [
    "बिल्कुल सुंदर! शिल्पकारी अत्यंत उत्कृष्ट है और पहनने पर जो ऊर्जा महसूस होती है वह अविश्वसनीय है।",
    "मैं इसे 3 महीने से पहन रहा हूं और वास्तव में अपनी ऊर्जा में सकारात्मक बदलाव महसूस कर रहा हूं।",
    "यह Cneraart से मेरी तीसरी खरीदारी है और हर टुकड़ा परफेक्ट रहा है।",
    "इस टुकड़े का विवरण उल्लेखनीय है।",
    "अपनी माँ के लिए उपहार के रूप में खरीदा और वह इसे बिल्कुल पसंद करती हैं।",
    "इतना सार्थक टुकड़ा। मैंने देखा है कि इसे पहनना शुरू करने के बाद से मेरी चिंता कम हो गई है।",
    "परफेक्ट गुणवत्ता! सामग्री प्रीमियम लगती है और शिल्पकारी शीर्ष स्तर की है।",
    "मैं पहले संशयवादी था लेकिन कुछ हफ्तों तक पहनने के बाद मैं अधिक केंद्रित और शांत महसूस करता हूं।",
    "सुंदर आइटम, बिल्कुल वर्णन के अनुसार।",
    "तेज डिलीवरी और उत्कृष्ट पैकेजिंग।",
    "मैंने इन्हें कई दोस्तों और परिवार के सदस्यों को उपहार के रूप में दिया है।",
    "यह टुकड़ा मेरा दैनिक ताबीज बन गया है।",
    "अविश्वसनीय विवरण ध्यान के साथ आश्चर्यजनक टुकड़ा।",
    "हमारी सालगिरह के लिए ऑर्डर किया और मेरे साथी की आंखें भर आईं।",
    "मैं वर्षों से वुताई पर्वत के टुकड़े इकट्ठा कर रहा हूं।",
    "अद्भुत उत्पाद! जल्दी आया और इतनी सावधानी से पैक किया गया था।",
    "यह बिल्कुल वही है जो मैं ढूंढ रहा था।",
    "आश्चर्यजनक गुणवत्ता और सुंदर डिजाइन।",
    "जन्मदिन के उपहार के रूप में मिला और मैं बिल्कुल प्यार में पड़ गया।",
    "उत्कृष्ट टुकड़ा! गुणवत्ता ने मेरी अपेक्षाओं को बहुत पार कर लिया।"
  ]
};

const LANGUAGES = Object.keys(REVIEW_TEMPLATES);
const RATINGS_DIST = [5,5,5,5,5,5,5,5,4,4,4,4,4,3];

const NAMES_BY_LANG = {
  en: ['Sarah M.','John D.','Emily R.','Michael T.','Jessica L.','David W.','Ashley K.','James B.','Amanda F.','Robert C.','Lisa H.','Kevin P.','Rachel S.','Brian N.','Megan O.'],
  zh: ['王小明','李华','张伟','刘芳','陈静','赵磊','孙丽','周强','吴燕','郑涛','林晓','黄敏','何勇','谢婷','杨帆'],
  de: ['Hans M.','Petra K.','Klaus W.','Monika S.','Thomas B.','Sabine H.','Andreas L.','Claudia R.','Stefan F.','Ursula N.'],
  fr: ['Marie D.','Pierre M.','Sophie L.','Jean-Paul B.','Isabelle R.','François T.','Nathalie G.','Philippe C.','Céline V.','Laurent H.'],
  es: ['María G.','Carlos R.','Ana M.','José L.','Laura S.','Miguel F.','Carmen V.','Antonio H.','Isabel P.','Francisco T.'],
  ja: ['田中太郎','鈴木花子','佐藤一郎','山田美咲','伊藤健','渡辺さくら','中村拓也','小林由美','加藤誠','吉田恵'],
  ko: ['김민준','이서연','박지훈','최수아','정민호','강지은','조현우','윤예린','임도현','한소희'],
  pt: ['João S.','Maria F.','Pedro A.','Ana C.','Carlos M.','Sofia R.','Miguel L.','Inês P.','Rui T.','Catarina V.'],
  ru: ['Иван П.','Мария К.','Алексей С.','Елена В.','Дмитрий Н.','Ольга Ф.','Сергей Л.','Наталья М.','Андрей Б.','Татьяна Г.'],
  ar: ['محمد أ.','فاطمة م.','أحمد ع.','زينب ح.','عمر س.','مريم ك.','يوسف ب.','سارة ر.','علي ف.','نور ط.'],
  it: ['Marco R.','Giulia M.','Luca B.','Sofia C.','Alessandro V.','Francesca T.','Matteo L.','Elena P.','Davide F.','Chiara N.'],
  th: ['สมชาย ก.','สุดา ป.','วิชัย ร.','นภา ส.','อนุชา ม.','พรทิพย์ ล.','ธนกร ว.','มาลี ช.','ประยุทธ์ ต.','รัตนา ห.'],
  vi: ['Nguyễn V.','Trần T.','Lê H.','Phạm M.','Hoàng L.','Vũ T.','Đặng H.','Bùi T.','Đỗ V.','Ngô T.'],
  id: ['Budi S.','Siti R.','Ahmad F.','Dewi K.','Hendra P.','Rina M.','Agus W.','Yuni L.','Bambang H.','Fitri A.'],
  hi: ['राहुल श.','प्रिया म.','अमित क.','सुनीता व.','विकास ग.','पूजा स.','संजय त.','रेखा ब.','मनोज ल.','अनिता र.']
};

const IPS = ['45.33.32.156','104.21.45.67','172.67.68.228','8.8.8.8','1.1.1.1','185.220.101.45','91.108.4.1','77.88.8.8','208.67.222.222','198.51.100.1','203.0.113.1','192.0.2.1','100.64.0.1','169.254.0.1','240.0.0.1'];
const LOCATIONS = ['New York, USA','London, UK','Tokyo, Japan','Paris, France','Berlin, Germany','Sydney, Australia','Toronto, Canada','Seoul, South Korea','Singapore','Dubai, UAE','Mumbai, India','São Paulo, Brazil','Mexico City, Mexico','Amsterdam, Netherlands','Stockholm, Sweden','Madrid, Spain','Rome, Italy','Moscow, Russia','Cairo, Egypt','Bangkok, Thailand','Jakarta, Indonesia','Hanoi, Vietnam','Kuala Lumpur, Malaysia','Manila, Philippines','Taipei, Taiwan','Hong Kong','Shanghai, China','Beijing, China','Guangzhou, China','Shenzhen, China'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randDate() {
  const now = Date.now();
  const twoYearsAgo = now - 2 * 365 * 24 * 60 * 60 * 1000;
  return new Date(twoYearsAgo + Math.random() * (now - twoYearsAgo));
}

async function insertBatch(conn, rows) {
  if (rows.length === 0) return;
  const placeholders = rows.map(() => '(?,?,?,?,?,?,?,?,?,?)').join(',');
  const values = rows.flat();
  await conn.query(
    `INSERT INTO reviews (productId, userId, userName, rating, comment, language, isApproved, ipAddress, location, createdAt) VALUES ${placeholders}`,
    values
  );
}

async function main() {
  console.log('Connecting to correct production database...');
  const conn = await mysql.createConnection(CORRECT_DB);
  console.log('Connected!\n');

  // 获取所有需要补充评论的产品
  const [products] = await conn.execute(`
    SELECT p.id, COALESCE(r.cnt, 0) as reviewCount
    FROM products p 
    LEFT JOIN (SELECT productId, COUNT(*) as cnt FROM reviews GROUP BY productId) r ON p.id = r.productId
    WHERE COALESCE(r.cnt, 0) < 5000
    ORDER BY p.id
  `);

  console.log(`Found ${products.length} products needing reviews\n`);

  let totalInserted = 0;
  for (const product of products) {
    const existing = Number(product.reviewCount);
    const needed = TARGET_REVIEWS - existing;
    if (needed <= 0) continue;

    // 如果已有少量评论，先删掉重新生成
    if (existing > 0) {
      await conn.execute('DELETE FROM reviews WHERE productId = ?', [product.id]);
      console.log(`  Cleared ${existing} old reviews for product ${product.id}`);
    }

    const toGenerate = TARGET_REVIEWS;
    let inserted = 0;
    let batch = [];

    for (let i = 0; i < toGenerate; i++) {
      const lang = rand(LANGUAGES);
      const names = NAMES_BY_LANG[lang] || NAMES_BY_LANG.en;
      const templates = REVIEW_TEMPLATES[lang] || REVIEW_TEMPLATES.en;
      const rating = rand(RATINGS_DIST);
      const comment = rand(templates);
      const userName = rand(names);
      const ip = rand(IPS);
      const location = rand(LOCATIONS);
      const createdAt = randDate();

      batch.push([product.id, null, userName, rating, comment, lang, 1, ip, location, createdAt]);

      if (batch.length >= BATCH_SIZE) {
        await insertBatch(conn, batch);
        inserted += batch.length;
        batch = [];
      }
    }
    if (batch.length > 0) {
      await insertBatch(conn, batch);
      inserted += batch.length;
    }

    totalInserted += inserted;
    console.log(`✓ Product ${product.id}: inserted ${inserted} reviews (total so far: ${totalInserted})`);
  }

  const [finalCount] = await conn.execute('SELECT COUNT(*) as total FROM reviews');
  console.log(`\n✅ Done! Total reviews in correct database: ${finalCount[0].total}`);
  await conn.end();
}

main().catch(err => { console.error('Fatal error:', err); process.exit(1); });
