/**
 * 批量生成评论脚本
 * 为56个产品各生成30000条多语言评论，写入生产数据库
 * 使用批量INSERT优化性能
 */
import mysql from 'mysql2/promise';

const PROD_DB = 'mysql://3sTgkhNymxcGJsq.dc2e5ef9e23e:3i3JNeXks4422BKffDiV@gateway03.us-east-1.prod.aws.tidbcloud.com:4000/c8K47cxkpiofT46rxSignU?ssl={"rejectUnauthorized":true}';

// 需要生成评论的产品ID列表
const PRODUCT_IDS = [
  700043, 700044, 700045, 700046, 700047, 700048, 700049, 700050, 700051, 700052, 700053, 700054, 700055,
  700056, 700057, 700058, 700059, 700060, 700061, 700062, 700063, 700064, 700065, 700066, 700067, 700068,
  700069, 700070, 700071, 700072, 700073, 700074, 700075, 700076, 700077, 700078, 700079, 700080, 700081,
  700082, 700083, 700084, 700085, 700086, 700087, 700088
];

const REVIEWS_PER_PRODUCT = 30000;
const BATCH_SIZE = 500; // 每批INSERT数量

// 多语言评论模板（15种语言，每种20条）
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
    "Exceptional quality and beautiful design. I wear this every day and it brings me comfort and peace. The blessing from Wutai Mountain makes it truly sacred.",
    "I purchased this after a difficult period in my life and it has been a source of comfort and strength. Beautiful piece with genuine spiritual energy.",
    "Perfect in every way. The craftsmanship is flawless, the materials are premium, and the spiritual blessing makes it uniquely powerful. Highly recommended!",
  ],
  zh: [
    "非常漂亮的饰品！工艺精湛，佩戴后感觉能量非常好。强烈推荐给寻求灵性保护的人。",
    "已经佩戴了3个月，真的感受到了积极的能量变化。品质出色，包装精美。",
    "这是我第三次从Cneraart购买，每件都很完美。五台山的加持让它真的很特别。发货也很快！",
    "这件饰品的细节令人印象深刻，可以看出是用心制作的。每天佩戴，收到很多赞美。",
    "买来送给妈妈，她非常喜欢。包装精美，附有解释加持的卡片。",
    "非常有意义的饰品。自从开始佩戴，我的焦虑减少了很多。无论是能量还是提醒自己保持平静，都很有效！",
    "品质完美！材料高档，工艺一流。对于如此有灵性意义的东西，物超所值。",
    "一开始我有些怀疑，但佩戴几周后感觉更加平静和专注。品质确实令人印象深刻。",
    "漂亮的物品，与描述完全一致。照片都无法展示它的美丽——实物更加惊艳。非常满意。",
    "发货快，包装好。产品本身非常漂亮，感觉很高档。肯定会再次订购。",
    "已经作为礼物送给了几位朋友和家人，每个人都非常高兴。灵性意义与精美工艺的结合使它成为完美礼物。",
    "这件饰品已成为我每天的护身符。佩戴时感到受保护和平静。品质卓越，佩戴数月依然完好。",
    "令人惊叹的饰品，细节处理极为精心。能感受到制作时的用心。加持仪式增添了深刻的意义。",
    "为周年纪念日购买，伴侣感动落泪。品质超出预期，灵性意义使它远不止是珠宝。",
    "多年来一直收藏五台山的饰品，这是我遇到的最精美的之一。能量可以感受到，工艺精湛。",
    "很棒的产品！到货快，包装细心。饰品本身很漂亮，佩戴后已经注意到积极变化。",
    "这正是我在寻找的。品质高档，灵性意义真实，已成为我最珍贵的饰品。",
    "品质卓越，设计精美。每天佩戴，带给我安慰和平静。五台山的加持使它真正神圣。",
    "在人生困难时期购买了这件饰品，它一直是我的安慰和力量来源。美丽的饰品，具有真实的灵性能量。",
    "各方面都完美。工艺无瑕，材料高档，灵性加持使它独特有力。强烈推荐！",
  ],
  de: [
    "Absolut wunderschönes Stück! Die Handwerkskunst ist exquisit und die Energie, die ich beim Tragen spüre, ist unglaublich. Sehr empfehlenswert für alle, die spirituellen Schutz suchen.",
    "Ich trage es seit 3 Monaten und spüre wirklich eine positive Veränderung meiner Energie. Die Qualität ist hervorragend und es kam wunderschön verpackt an.",
    "Dies ist mein drittes Einkauf bei Cneraart und jedes Stück war perfekt. Der Segen vom Wutai-Berg macht es wirklich besonders. Auch schneller Versand!",
    "Das Detail an diesem Stück ist bemerkenswert. Man kann sehen, dass es mit Sorgfalt und Absicht hergestellt wurde. Ich trage es jeden Tag und bekomme so viele Komplimente.",
    "Ich habe es als Geschenk für meine Mutter gekauft und sie liebt es absolut. Die Verpackung war wunderschön und es kam mit einer schönen Karte, die den Segen erklärt.",
    "Ein so bedeutungsvolles Stück. Meine Angst hat abgenommen, seit ich es trage. Ob es die Energie ist oder nur die Erinnerung, ruhig zu bleiben – es funktioniert!",
    "Perfekte Qualität! Die Materialien fühlen sich hochwertig an und die Handwerkskunst ist erstklassig. Jeden Cent wert für etwas so spirituell Bedeutsames.",
    "Ich war zunächst skeptisch, aber nach ein paar Wochen des Tragens fühle ich mich zentrierter und friedlicher. Die Qualität ist wirklich beeindruckend.",
    "Schöner Artikel, genau wie beschrieben. Die Fotos machen ihm keine Ehre – er ist noch atemberaubender in Person. Sehr zufrieden mit diesem Kauf.",
    "Schnelle Lieferung und ausgezeichnete Verpackung. Das Produkt selbst ist wunderschön und fühlt sich sehr hochwertig an. Werde definitiv mehr Artikel bestellen.",
    "Ich habe diese als Geschenke an mehrere Freunde und Familienmitglieder gegeben. Alle waren begeistert. Die spirituelle Bedeutung kombiniert mit schöner Handwerkskunst macht es perfekt.",
    "Dieses Stück ist zu meinem täglichen Talisman geworden. Ich fühle mich geschützt und zentriert, wenn ich es trage. Die Qualität ist außergewöhnlich.",
    "Atemberaubendes Stück mit unglaublicher Liebe zum Detail. Ich kann die Sorgfalt spüren, die in die Herstellung geflossen ist. Die Segnung verleiht eine so bedeutungsvolle Dimension.",
    "Für unseren Jahrestag bestellt und mein Partner war zu Tränen gerührt. Die Qualität übertraf unsere Erwartungen und die spirituelle Bedeutung machte es zu so viel mehr als nur Schmuck.",
    "Ich sammle seit Jahren Stücke vom Wutai-Berg und dies ist eines der schönsten, die ich je gesehen habe. Die Energie ist spürbar und die Handwerkskunst ist überragend.",
    "Wunderbares Produkt! Schnell angekommen und so sorgfältig verpackt. Das Stück selbst ist wunderschön und ich habe bereits positive Veränderungen bemerkt.",
    "Genau das, was ich gesucht habe. Die Qualität ist erstklassig, die spirituelle Bedeutung ist real, und es ist mein wertvollstes Schmuckstück geworden.",
    "Außergewöhnliche Qualität und wunderschönes Design. Ich trage es jeden Tag und es bringt mir Trost und Frieden. Der Segen vom Wutai-Berg macht es wirklich heilig.",
    "Ich habe es nach einer schwierigen Zeit in meinem Leben gekauft und es war eine Quelle des Trostes und der Stärke. Schönes Stück mit echter spiritueller Energie.",
    "In jeder Hinsicht perfekt. Die Handwerkskunst ist makellos, die Materialien sind hochwertig und der spirituelle Segen macht es einzigartig kraftvoll. Sehr empfehlenswert!",
  ],
  fr: [
    "Pièce absolument magnifique ! L'artisanat est exquis et l'énergie que je ressens en la portant est incroyable. Je la recommande vivement à tous ceux qui cherchent une protection spirituelle.",
    "Je le porte depuis 3 mois maintenant et je ressens vraiment un changement positif dans mon énergie. La qualité est exceptionnelle et il est arrivé magnifiquement emballé.",
    "C'est mon troisième achat chez Cneraart et chaque pièce a été parfaite. La bénédiction du Mont Wutai la rend vraiment spéciale. Livraison rapide aussi !",
    "Le détail de cette pièce est remarquable. On peut voir qu'elle a été faite avec soin et intention. Je la porte tous les jours et reçois tellement de compliments.",
    "Je l'ai acheté comme cadeau pour ma mère et elle l'adore absolument. L'emballage était magnifique et il était accompagné d'une belle carte expliquant la bénédiction.",
    "Une pièce si significative. Mon anxiété a diminué depuis que je la porte. Que ce soit l'énergie ou juste le rappel de rester calme, ça marche !",
    "Qualité parfaite ! Les matériaux semblent premium et l'artisanat est de premier ordre. Ça vaut chaque centime pour quelque chose d'aussi spirituellement significatif.",
    "J'étais sceptique au début mais après quelques semaines à la porter, je me sens plus centré et paisible. La qualité est vraiment impressionnante.",
    "Bel article, exactement comme décrit. Les photos ne lui rendent pas justice – il est encore plus magnifique en personne. Très satisfait de cet achat.",
    "Livraison rapide et excellent emballage. Le produit lui-même est magnifique et semble de très haute qualité. Je commanderai définitivement d'autres articles.",
    "J'en ai offert à plusieurs amis et membres de la famille. Tout le monde a été ravi. La signification spirituelle combinée à un bel artisanat en fait le cadeau parfait.",
    "Cette pièce est devenue mon talisman quotidien. Je me sens protégé et centré quand je la porte. La qualité est exceptionnelle et elle a bien résisté après des mois de port.",
    "Pièce magnifique avec une attention incroyable aux détails. Je peux sentir le soin qui a été mis dans sa fabrication. La cérémonie de bénédiction ajoute une dimension si significative.",
    "Commandé pour notre anniversaire et mon partenaire a été ému aux larmes. La qualité a dépassé nos attentes et la signification spirituelle en a fait bien plus que de simples bijoux.",
    "Je collectionne des pièces du Mont Wutai depuis des années et c'est l'une des plus belles que j'ai rencontrées. L'énergie est palpable et l'artisanat est superbe.",
    "Produit merveilleux ! Arrivé rapidement et emballé avec tant de soin. La pièce elle-même est belle et j'ai déjà remarqué des changements positifs depuis que je la porte.",
    "C'est exactement ce que je cherchais. La qualité est premium, la signification spirituelle est réelle, et c'est devenu mon bijou le plus précieux.",
    "Qualité exceptionnelle et beau design. Je le porte tous les jours et il m'apporte réconfort et paix. La bénédiction du Mont Wutai le rend vraiment sacré.",
    "Je l'ai acheté après une période difficile dans ma vie et il a été une source de réconfort et de force. Belle pièce avec une véritable énergie spirituelle.",
    "Parfait à tous égards. L'artisanat est impeccable, les matériaux sont premium et la bénédiction spirituelle le rend uniquement puissant. Très recommandé !",
  ],
  es: [
    "¡Pieza absolutamente hermosa! La artesanía es exquisita y la energía que siento al usarla es increíble. Muy recomendable para quienes buscan protección espiritual.",
    "Lo llevo puesto desde hace 3 meses y realmente siento un cambio positivo en mi energía. La calidad es sobresaliente y llegó bellamente empaquetado.",
    "Esta es mi tercera compra en Cneraart y cada pieza ha sido perfecta. La bendición del Monte Wutai la hace verdaderamente especial. ¡Envío rápido también!",
    "El detalle de esta pieza es notable. Se puede ver que fue hecha con cuidado e intención. La uso todos los días y recibo tantos cumplidos.",
    "La compré como regalo para mi madre y la ama absolutamente. El empaque era precioso y venía con una hermosa tarjeta explicando la bendición.",
    "Una pieza tan significativa. Mi ansiedad ha disminuido desde que empecé a usarla. ¡Ya sea la energía o solo el recordatorio de mantener la calma, funciona!",
    "¡Calidad perfecta! Los materiales se sienten premium y la artesanía es de primera clase. Vale cada centavo por algo tan espiritualmente significativo.",
    "Al principio era escéptico, pero después de usarla unas semanas me siento más centrado y en paz. La calidad es genuinamente impresionante.",
    "Hermoso artículo, exactamente como se describe. Las fotos no le hacen justicia – es aún más impresionante en persona. Muy satisfecho con esta compra.",
    "Entrega rápida y excelente empaque. El producto en sí es precioso y se siente de muy alta calidad. Definitivamente pediré más artículos.",
    "He dado estos como regalos a varios amigos y familiares. Todos han quedado encantados. El significado espiritual combinado con la hermosa artesanía lo hace perfecto.",
    "Esta pieza se ha convertido en mi talismán diario. Me siento protegido y centrado cuando la uso. La calidad es excepcional y se ha mantenido hermosa durante meses.",
    "Pieza impresionante con increíble atención al detalle. Puedo sentir el cuidado que se puso en hacerla. La ceremonia de bendición añade una dimensión tan significativa.",
    "Pedido para nuestro aniversario y mi pareja se emocionó hasta las lágrimas. La calidad superó nuestras expectativas y el significado espiritual lo convirtió en mucho más que joyería.",
    "He estado coleccionando piezas del Monte Wutai durante años y esta es una de las más finas que he encontrado. La energía es palpable y la artesanía es soberbia.",
    "¡Producto maravilloso! Llegó rápidamente y empaquetado con tanto cuidado. La pieza en sí es hermosa y ya he notado cambios positivos desde que la uso.",
    "Esto es exactamente lo que estaba buscando. La calidad es premium, el significado espiritual es real, y se ha convertido en mi pieza de joyería más preciada.",
    "Calidad excepcional y diseño hermoso. La uso todos los días y me trae consuelo y paz. La bendición del Monte Wutai la hace verdaderamente sagrada.",
    "La compré después de un período difícil en mi vida y ha sido una fuente de consuelo y fortaleza. Hermosa pieza con genuina energía espiritual.",
    "Perfecta en todos los sentidos. La artesanía es impecable, los materiales son premium y la bendición espiritual la hace únicamente poderosa. ¡Muy recomendada!",
  ],
  it: [
    "Pezzo assolutamente bellissimo! L'artigianato è squisito e l'energia che sento indossandolo è incredibile. Altamente consigliato a chiunque cerchi protezione spirituale.",
    "Lo indosso da 3 mesi e sento davvero un cambiamento positivo nella mia energia. La qualità è eccezionale ed è arrivato magnificamente confezionato.",
    "Questo è il mio terzo acquisto da Cneraart e ogni pezzo è stato perfetto. La benedizione del Monte Wutai lo rende davvero speciale. Spedizione veloce anche!",
    "Il dettaglio di questo pezzo è notevole. Si può vedere che è stato fatto con cura e intenzione. Lo indosso ogni giorno e ricevo così tanti complimenti.",
    "L'ho comprato come regalo per mia madre e lei lo adora assolutamente. La confezione era bellissima ed era accompagnato da una bella carta che spiegava la benedizione.",
    "Un pezzo così significativo. La mia ansia è diminuita da quando ho iniziato a indossarlo. Che sia l'energia o solo il promemoria di rimanere calmo, funziona!",
    "Qualità perfetta! I materiali sembrano premium e l'artigianato è di prim'ordine. Vale ogni centesimo per qualcosa di così spiritualmente significativo.",
    "Ero scettico all'inizio ma dopo averlo indossato per qualche settimana mi sento più centrato e pacifico. La qualità è genuinamente impressionante.",
    "Bellissimo articolo, esattamente come descritto. Le foto non gli rendono giustizia – è ancora più stupendo di persona. Molto soddisfatto di questo acquisto.",
    "Consegna veloce ed eccellente imballaggio. Il prodotto stesso è bellissimo e sembra di altissima qualità. Ordinerò sicuramente altri articoli.",
    "Ne ho dati come regali a diversi amici e familiari. Tutti sono stati deliziati. Il significato spirituale combinato con la bella artigianalità lo rende perfetto.",
    "Questo pezzo è diventato il mio talismano quotidiano. Mi sento protetto e centrato quando lo indosso. La qualità è eccezionale e si è mantenuto splendidamente.",
    "Pezzo straordinario con incredibile attenzione ai dettagli. Posso sentire la cura che è stata messa nella sua realizzazione. La cerimonia di benedizione aggiunge una dimensione così significativa.",
    "Ordinato per il nostro anniversario e il mio partner si è commosso fino alle lacrime. La qualità ha superato le nostre aspettative e il significato spirituale lo ha reso molto più di semplici gioielli.",
    "Colleziono pezzi dal Monte Wutai da anni e questo è tra i più belli che ho incontrato. L'energia è palpabile e l'artigianato è superbo.",
    "Prodotto meraviglioso! Arrivato rapidamente e confezionato con tanta cura. Il pezzo stesso è bellissimo e ho già notato cambiamenti positivi da quando lo indosso.",
    "Questo è esattamente quello che stavo cercando. La qualità è premium, il significato spirituale è reale, ed è diventato il mio pezzo di gioielleria più prezioso.",
    "Qualità eccezionale e design bellissimo. Lo indosso ogni giorno e mi porta conforto e pace. La benedizione del Monte Wutai lo rende davvero sacro.",
    "L'ho acquistato dopo un periodo difficile nella mia vita ed è stata una fonte di conforto e forza. Bellissimo pezzo con genuina energia spirituale.",
    "Perfetto in ogni modo. L'artigianato è impeccabile, i materiali sono premium e la benedizione spirituale lo rende unicamente potente. Altamente consigliato!",
  ],
  pt: [
    "Peça absolutamente linda! O artesanato é requintado e a energia que sinto ao usá-la é incrível. Altamente recomendado para quem busca proteção espiritual.",
    "Estou usando há 3 meses e realmente sinto uma mudança positiva na minha energia. A qualidade é excepcional e chegou lindamente embalado.",
    "Esta é minha terceira compra na Cneraart e cada peça foi perfeita. A bênção do Monte Wutai a torna verdadeiramente especial. Envio rápido também!",
    "O detalhe desta peça é notável. Dá para ver que foi feita com cuidado e intenção. Uso todos os dias e recebo tantos elogios.",
    "Comprei como presente para minha mãe e ela adora absolutamente. A embalagem era linda e veio com um belo cartão explicando a bênção.",
    "Uma peça tão significativa. Minha ansiedade diminuiu desde que comecei a usar. Seja a energia ou apenas o lembrete de ficar calmo, funciona!",
    "Qualidade perfeita! Os materiais parecem premium e o artesanato é de primeira classe. Vale cada centavo por algo tão espiritualmente significativo.",
    "Estava cético no início, mas depois de usar por algumas semanas me sinto mais centrado e em paz. A qualidade é genuinamente impressionante.",
    "Lindo artigo, exatamente como descrito. As fotos não fazem jus – é ainda mais deslumbrante pessoalmente. Muito satisfeito com esta compra.",
    "Entrega rápida e excelente embalagem. O produto em si é lindo e parece de altíssima qualidade. Definitivamente vou pedir mais itens.",
    "Dei como presentes para vários amigos e familiares. Todos ficaram encantados. O significado espiritual combinado com o belo artesanato o torna perfeito.",
    "Esta peça se tornou meu talismã diário. Me sinto protegido e centrado quando a uso. A qualidade é excepcional e se manteve lindamente por meses.",
    "Peça deslumbrante com incrível atenção aos detalhes. Posso sentir o cuidado que foi colocado em sua criação. A cerimônia de bênção adiciona uma dimensão tão significativa.",
    "Pedido para nosso aniversário e meu parceiro ficou emocionado até as lágrimas. A qualidade superou nossas expectativas e o significado espiritual o tornou muito mais do que apenas joias.",
    "Coleciono peças do Monte Wutai há anos e esta é uma das mais belas que encontrei. A energia é palpável e o artesanato é soberbo.",
    "Produto maravilhoso! Chegou rapidamente e embalado com tanto cuidado. A peça em si é linda e já notei mudanças positivas desde que a uso.",
    "Isso é exatamente o que eu estava procurando. A qualidade é premium, o significado espiritual é real, e se tornou minha peça de joalheria mais preciosa.",
    "Qualidade excepcional e design lindo. Uso todos os dias e me traz conforto e paz. A bênção do Monte Wutai a torna verdadeiramente sagrada.",
    "Comprei após um período difícil na minha vida e tem sido uma fonte de conforto e força. Linda peça com genuína energia espiritual.",
    "Perfeita em todos os aspectos. O artesanato é impecável, os materiais são premium e a bênção espiritual a torna unicamente poderosa. Muito recomendada!",
  ],
  ru: [
    "Абсолютно прекрасное изделие! Мастерство исполнения изысканно, и энергия, которую я чувствую при ношении, невероятна. Настоятельно рекомендую всем, кто ищет духовную защиту.",
    "Ношу уже 3 месяца и действительно чувствую позитивные изменения в своей энергии. Качество превосходное, и оно пришло в красивой упаковке.",
    "Это моя третья покупка в Cneraart, и каждое изделие было идеальным. Благословение горы Утайшань делает его поистине особенным. Быстрая доставка тоже!",
    "Детали этого изделия замечательны. Видно, что оно сделано с заботой и намерением. Ношу каждый день и получаю так много комплиментов.",
    "Купила в подарок маме, и она в абсолютном восторге. Упаковка была великолепной, и к нему прилагалась красивая открытка с объяснением благословения.",
    "Такое значимое изделие. Моя тревога уменьшилась с тех пор, как я начала его носить. Будь то энергия или просто напоминание оставаться спокойной — это работает!",
    "Идеальное качество! Материалы ощущаются премиальными, а мастерство — первоклассным. Стоит каждой копейки за что-то столь духовно значимое.",
    "Сначала я была скептически настроена, но после нескольких недель ношения чувствую себя более сосредоточенной и умиротворённой. Качество действительно впечатляет.",
    "Красивый предмет, точно как описано. Фотографии не передают его красоты — вживую оно ещё более потрясающее. Очень довольна этой покупкой.",
    "Быстрая доставка и отличная упаковка. Сам продукт прекрасен и ощущается очень высококачественным. Обязательно закажу ещё.",
    "Дарила эти изделия нескольким друзьям и членам семьи. Все были в восторге. Духовное значение в сочетании с красивым мастерством делает его идеальным.",
    "Это изделие стало моим ежедневным талисманом. Я чувствую защиту и сосредоточенность, когда ношу его. Качество исключительное.",
    "Потрясающее изделие с невероятным вниманием к деталям. Я чувствую заботу, вложенную в его создание. Церемония благословения добавляет такое значимое измерение.",
    "Заказала к годовщине, и мой партнёр был растроган до слёз. Качество превзошло наши ожидания, а духовный смысл сделал его гораздо большим, чем просто украшением.",
    "Я собираю изделия с горы Утайшань уже много лет, и это одно из лучших, что я встречала. Энергия ощутима, а мастерство превосходно.",
    "Замечательный продукт! Пришёл быстро и был упакован с такой заботой. Само изделие прекрасно, и я уже заметила позитивные изменения.",
    "Это именно то, что я искала. Качество премиальное, духовное значение реально, и оно стало моим самым ценным украшением.",
    "Исключительное качество и красивый дизайн. Ношу каждый день, и оно приносит мне утешение и покой. Благословение горы Утайшань делает его поистине священным.",
    "Купила после трудного периода в жизни, и оно стало источником утешения и силы. Красивое изделие с подлинной духовной энергией.",
    "Идеально во всех отношениях. Мастерство безупречно, материалы премиальные, а духовное благословение делает его уникально мощным. Настоятельно рекомендую!",
  ],
  ja: [
    "絶対に美しい作品です！職人技は精巧で、着用時に感じるエネルギーは信じられないほどです。霊的な保護を求める方に強くお勧めします。",
    "3ヶ月間着用していますが、エネルギーの変化を本当に感じています。品質は素晴らしく、美しく包装されて届きました。",
    "Cneraartからの3回目の購入ですが、すべての作品が完璧でした。五台山の祈祷が本当に特別なものにしています。配送も速かった！",
    "この作品の細部は素晴らしいです。心を込めて作られたことがわかります。毎日着用していて、たくさんの褒め言葉をいただいています。",
    "母へのプレゼントとして購入しましたが、彼女は大喜びです。包装は美しく、祈祷を説明する素敵なカードが付いていました。",
    "とても意味のある作品です。着用し始めてから不安が減りました。エネルギーのせいか、落ち着くための reminder のせいか、効果があります！",
    "完璧な品質！素材はプレミアムで、職人技は一流です。霊的に意味のあるものとして、十分な価値があります。",
    "最初は懐疑的でしたが、数週間着用した後、より集中して穏やかになりました。品質は本当に印象的です。",
    "美しいアイテム、説明通りです。写真では伝わりません – 実物はさらに素晴らしいです。この購入に非常に満足しています。",
    "迅速な配送と優れた包装。製品自体は美しく、非常に高品質に感じます。間違いなくさらに注文します。",
    "何人かの友人や家族へのプレゼントとして贈りました。皆が喜んでいます。霊的な意味と美しい職人技の組み合わせが完璧にします。",
    "この作品は私の日常のお守りになりました。着用すると保護されて集中できる感じがします。品質は卓越しています。",
    "細部への信じられないほどの注意を払った素晴らしい作品。作成に込められた心遣いを感じることができます。祈祷式は非常に意味のある次元を加えます。",
    "記念日のために注文したところ、パートナーが感動して涙を流しました。品質は期待を超え、霊的な意味がジュエリー以上のものにしました。",
    "何年も五台山の作品を収集していますが、これは出会った中で最も素晴らしいものの一つです。エネルギーは感じられ、職人技は素晴らしいです。",
    "素晴らしい製品！迅速に届き、とても丁寧に包装されていました。作品自体は美しく、着用してから既にポジティブな変化に気づいています。",
    "これはまさに私が探していたものです。品質はプレミアムで、霊的な意味は本物で、最も大切なジュエリーになりました。",
    "卓越した品質と美しいデザイン。毎日着用していて、慰めと平和をもたらしてくれます。五台山の祈祷が本当に神聖なものにしています。",
    "人生の困難な時期の後に購入し、慰めと力の源となっています。本物の霊的エネルギーを持つ美しい作品。",
    "あらゆる面で完璧。職人技は完璧で、素材はプレミアムで、霊的な祈祷が独特に強力にしています。強くお勧めします！",
  ],
  ko: [
    "절대적으로 아름다운 작품입니다! 장인 정신이 뛰어나고 착용 시 느끼는 에너지가 믿을 수 없을 정도입니다. 영적 보호를 찾는 모든 분께 강력히 추천합니다.",
    "3개월째 착용 중인데 에너지의 긍정적인 변화를 정말 느끼고 있습니다. 품질이 뛰어나고 아름답게 포장되어 도착했습니다.",
    "Cneraart에서 세 번째 구매인데 모든 작품이 완벽했습니다. 오대산의 기도가 정말 특별하게 만들어 줍니다. 배송도 빨랐어요!",
    "이 작품의 세부 사항이 놀랍습니다. 정성과 의도를 담아 만들어진 것을 알 수 있습니다. 매일 착용하고 많은 칭찬을 받습니다.",
    "어머니 선물로 구매했는데 정말 좋아하십니다. 포장이 아름다웠고 기도를 설명하는 예쁜 카드가 함께 왔습니다.",
    "정말 의미 있는 작품입니다. 착용하기 시작한 이후 불안이 줄었습니다. 에너지 때문이든 차분함을 유지하는 알림 때문이든 효과가 있습니다!",
    "완벽한 품질! 소재가 프리미엄하고 장인 정신이 최고입니다. 영적으로 의미 있는 것에 대해 충분한 가치가 있습니다.",
    "처음에는 회의적이었지만 몇 주 착용 후 더 집중되고 평화로워졌습니다. 품질이 정말 인상적입니다.",
    "아름다운 아이템, 설명과 정확히 일치합니다. 사진으로는 표현이 안 됩니다 – 실물이 더 놀랍습니다. 이 구매에 매우 만족합니다.",
    "빠른 배송과 훌륭한 포장. 제품 자체가 아름답고 매우 고품질로 느껴집니다. 분명히 더 주문할 것입니다.",
    "여러 친구와 가족에게 선물로 드렸습니다. 모두 기뻐했습니다. 영적 의미와 아름다운 장인 정신의 조합이 완벽하게 만듭니다.",
    "이 작품은 제 일상 부적이 되었습니다. 착용하면 보호받고 집중되는 느낌이 납니다. 품질이 탁월합니다.",
    "세부 사항에 대한 믿을 수 없는 주의를 기울인 멋진 작품. 제작에 담긴 정성을 느낄 수 있습니다. 기도 의식이 의미 있는 차원을 더합니다.",
    "기념일을 위해 주문했고 파트너가 감동하여 눈물을 흘렸습니다. 품질이 기대를 초과했고 영적 의미가 단순한 보석 이상으로 만들었습니다.",
    "몇 년째 오대산 작품을 수집하고 있는데 이것이 만난 것 중 가장 훌륭한 것 중 하나입니다. 에너지가 느껴지고 장인 정신이 뛰어납니다.",
    "훌륭한 제품! 빠르게 도착하고 정성스럽게 포장되었습니다. 작품 자체가 아름답고 착용 이후 이미 긍정적인 변화를 느꼈습니다.",
    "이것이 바로 제가 찾던 것입니다. 품질이 프리미엄하고 영적 의미가 진짜이며 가장 소중한 보석이 되었습니다.",
    "탁월한 품질과 아름다운 디자인. 매일 착용하고 위안과 평화를 줍니다. 오대산의 기도가 정말 신성하게 만듭니다.",
    "인생의 어려운 시기 후에 구매했고 위안과 힘의 원천이 되었습니다. 진정한 영적 에너지를 가진 아름다운 작품.",
    "모든 면에서 완벽합니다. 장인 정신이 흠잡을 데 없고 소재가 프리미엄하며 영적 기도가 독특하게 강력하게 만듭니다. 강력히 추천합니다!",
  ],
  ar: [
    "قطعة جميلة للغاية! الحرفية رائعة والطاقة التي أشعر بها عند ارتدائها لا تصدق. أوصي بها بشدة لكل من يبحث عن الحماية الروحية.",
    "أرتديها منذ 3 أشهر وأشعر فعلاً بتغيير إيجابي في طاقتي. الجودة ممتازة ووصلت في عبوة جميلة.",
    "هذه هي عملية الشراء الثالثة من Cneraart وكل قطعة كانت مثالية. البركة من جبل وتاي تجعلها مميزة حقاً. شحن سريع أيضاً!",
    "التفاصيل في هذه القطعة رائعة. يمكنك أن ترى أنها صُنعت بعناية وقصد. أرتديها كل يوم وأحصل على الكثير من الإطراء.",
    "اشتريتها هدية لأمي وهي تحبها تماماً. كانت العبوة رائعة وجاءت مع بطاقة جميلة تشرح البركة.",
    "قطعة ذات معنى عميق. انخفض قلقي منذ أن بدأت بارتدائها. سواء كانت الطاقة أو مجرد تذكير بالبقاء هادئاً، فإنها تعمل!",
    "جودة مثالية! المواد تبدو فاخرة والحرفية من الدرجة الأولى. تستحق كل قرش لشيء ذي أهمية روحية كبيرة.",
    "كنت متشككاً في البداية لكن بعد ارتدائها لبضعة أسابيع أشعر بمزيد من التركيز والسلام. الجودة مثيرة للإعجاب حقاً.",
    "عنصر جميل، تماماً كما هو موصوف. الصور لا تعطيه حقه - إنه أكثر روعة شخصياً. سعيد جداً بهذا الشراء.",
    "توصيل سريع وتغليف ممتاز. المنتج نفسه جميل ويبدو عالي الجودة جداً. سأطلب بالتأكيد المزيد من العناصر.",
    "أعطيتها هدايا لعدة أصدقاء وأفراد من العائلة. الجميع كان مسروراً. المعنى الروحي مع الحرفية الجميلة يجعلها مثالية.",
    "أصبحت هذه القطعة تميمتي اليومية. أشعر بالحماية والتركيز عند ارتدائها. الجودة استثنائية.",
    "قطعة مذهلة مع اهتمام لا يصدق بالتفاصيل. أستطيع أن أشعر بالعناية التي بُذلت في صنعها. مراسم البركة تضيف بُعداً ذا معنى عميق.",
    "طلبتها لذكرى زواجنا وتأثر شريكي حتى البكاء. الجودة تجاوزت توقعاتنا والمعنى الروحي جعلها أكثر بكثير من مجرد مجوهرات.",
    "أجمع قطعاً من جبل وتاي منذ سنوات وهذه من أجمل ما صادفته. الطاقة ملموسة والحرفية رائعة.",
    "منتج رائع! وصل بسرعة وكان مغلفاً بعناية كبيرة. القطعة نفسها جميلة ولاحظت بالفعل تغييرات إيجابية منذ ارتدائها.",
    "هذا بالضبط ما كنت أبحث عنه. الجودة فاخرة والمعنى الروحي حقيقي وأصبحت قطعة المجوهرات الأثمن لدي.",
    "جودة استثنائية وتصميم جميل. أرتديها كل يوم وتجلب لي الراحة والسلام. البركة من جبل وتاي تجعلها مقدسة حقاً.",
    "اشتريتها بعد فترة صعبة في حياتي وكانت مصدراً للراحة والقوة. قطعة جميلة بطاقة روحية حقيقية.",
    "مثالية من كل النواحي. الحرفية لا تشوبها شائبة والمواد فاخرة والبركة الروحية تجعلها قوية بشكل فريد. أوصي بها بشدة!",
  ],
  hi: [
    "बिल्कुल सुंदर टुकड़ा! शिल्प कौशल उत्कृष्ट है और पहनते समय जो ऊर्जा मुझे महसूस होती है वह अविश्वसनीय है। आध्यात्मिक सुरक्षा चाहने वाले सभी को अत्यधिक अनुशंसित।",
    "मैं इसे 3 महीनों से पहन रही हूं और वास्तव में अपनी ऊर्जा में सकारात्मक बदलाव महसूस करती हूं। गुणवत्ता उत्कृष्ट है और यह खूबसूरती से पैक होकर आया।",
    "यह Cneraart से मेरी तीसरी खरीदारी है और हर टुकड़ा परफेक्ट रहा है। वुताई पर्वत का आशीर्वाद इसे वास्तव में विशेष बनाता है। तेज़ शिपिंग भी!",
    "इस टुकड़े का विवरण उल्लेखनीय है। आप देख सकते हैं कि इसे देखभाल और इरादे के साथ बनाया गया था। मैं इसे हर दिन पहनती हूं और बहुत तारीफें मिलती हैं।",
    "मैंने इसे अपनी माँ के लिए उपहार के रूप में खरीदा और वह इसे बिल्कुल पसंद करती हैं। पैकेजिंग शानदार थी और इसके साथ आशीर्वाद समझाने वाला एक सुंदर कार्ड भी था।",
    "इतना सार्थक टुकड़ा। जब से मैंने इसे पहनना शुरू किया है मेरी चिंता कम हो गई है। चाहे ऊर्जा हो या बस शांत रहने का अनुस्मारक, यह काम करता है!",
    "परफेक्ट गुणवत्ता! सामग्री प्रीमियम लगती है और शिल्प कौशल शीर्ष स्तर का है। इतने आध्यात्मिक रूप से महत्वपूर्ण चीज़ के लिए हर पैसे के लायक।",
    "मैं पहले संशयी था लेकिन कुछ हफ्तों तक पहनने के बाद मैं अधिक केंद्रित और शांतिपूर्ण महसूस करता हूं। गुणवत्ता वास्तव में प्रभावशाली है।",
    "सुंदर वस्तु, बिल्कुल वैसी जैसी वर्णित है। तस्वीरें इसे न्याय नहीं देती हैं - यह व्यक्तिगत रूप से और भी शानदार है। इस खरीदारी से बहुत खुश हूं।",
    "तेज़ डिलीवरी और उत्कृष्ट पैकेजिंग। उत्पाद स्वयं सुंदर है और बहुत उच्च गुणवत्ता का लगता है। निश्चित रूप से और आइटम ऑर्डर करूंगा।",
    "मैंने इन्हें कई दोस्तों और परिवार के सदस्यों को उपहार में दिया है। सभी प्रसन्न हुए हैं। आध्यात्मिक महत्व और सुंदर शिल्प कौशल का संयोजन इसे परफेक्ट बनाता है।",
    "यह टुकड़ा मेरा दैनिक तावीज़ बन गया है। जब मैं इसे पहनती हूं तो सुरक्षित और केंद्रित महसूस करती हूं। गुणवत्ता असाधारण है।",
    "अविश्वसनीय विवरण पर ध्यान देने वाला शानदार टुकड़ा। मैं इसे बनाने में लगाई गई देखभाल महसूस कर सकती हूं। आशीर्वाद समारोह इतना सार्थक आयाम जोड़ता है।",
    "हमारी सालगिरह के लिए ऑर्डर किया और मेरा साथी भावुक होकर रो पड़ा। गुणवत्ता ने हमारी उम्मीदों को पार कर दिया और आध्यात्मिक अर्थ ने इसे सिर्फ गहनों से कहीं अधिक बना दिया।",
    "मैं वर्षों से वुताई पर्वत के टुकड़े इकट्ठा कर रही हूं और यह उनमें से सबसे बेहतरीन है। ऊर्जा स्पष्ट है और शिल्प कौशल शानदार है।",
    "अद्भुत उत्पाद! जल्दी आया और इतनी देखभाल के साथ पैक किया गया। टुकड़ा स्वयं सुंदर है और मैंने पहनने के बाद पहले से ही सकारात्मक बदलाव देखे हैं।",
    "यह बिल्कुल वही है जो मैं ढूंढ रही थी। गुणवत्ता प्रीमियम है, आध्यात्मिक महत्व वास्तविक है, और यह मेरा सबसे कीमती गहना बन गया है।",
    "असाधारण गुणवत्ता और सुंदर डिज़ाइन। मैं इसे हर दिन पहनती हूं और यह मुझे आराम और शांति देता है। वुताई पर्वत का आशीर्वाद इसे वास्तव में पवित्र बनाता है।",
    "मैंने इसे अपने जीवन के कठिन दौर के बाद खरीदा और यह आराम और शक्ति का स्रोत रहा है। वास्तविक आध्यात्मिक ऊर्जा के साथ सुंदर टुकड़ा।",
    "हर तरह से परफेक्ट। शिल्प कौशल दोषरहित है, सामग्री प्रीमियम है और आध्यात्मिक आशीर्वाद इसे अनूठे रूप से शक्तिशाली बनाता है। अत्यधिक अनुशंसित!",
  ],
  th: [
    "ชิ้นงานที่สวยงามอย่างยิ่ง! งานฝีมือประณีตมากและพลังงานที่รู้สึกได้เมื่อสวมใส่นั้นน่าทึ่งมาก แนะนำอย่างยิ่งสำหรับผู้ที่ต้องการการคุ้มครองทางจิตวิญญาณ",
    "ฉันสวมใส่มาได้ 3 เดือนแล้วและรู้สึกถึงการเปลี่ยนแปลงเชิงบวกในพลังงานของฉันจริงๆ คุณภาพยอดเยี่ยมและมาพร้อมบรรจุภัณฑ์ที่สวยงาม",
    "นี่คือการซื้อครั้งที่สามจาก Cneraart และทุกชิ้นสมบูรณ์แบบ การอธิษฐานจากภูเขาอู่ไถทำให้มันพิเศษจริงๆ จัดส่งเร็วด้วย!",
    "รายละเอียดของชิ้นงานนี้น่าทึ่งมาก คุณสามารถบอกได้ว่ามันถูกทำด้วยความใส่ใจและเจตนา ฉันสวมใส่ทุกวันและได้รับคำชมมากมาย",
    "ฉันซื้อเป็นของขวัญให้แม่และเธอชอบมันมาก บรรจุภัณฑ์สวยงามและมาพร้อมการ์ดสวยๆ ที่อธิบายการอธิษฐาน",
    "ชิ้นงานที่มีความหมายมาก ความวิตกกังวลของฉันลดลงตั้งแต่เริ่มสวมใส่ ไม่ว่าจะเป็นพลังงานหรือแค่การเตือนให้สงบ มันได้ผล!",
    "คุณภาพสมบูรณ์แบบ! วัสดุรู้สึกพรีเมียมและงานฝีมือชั้นเยี่ยม คุ้มค่าทุกบาทสำหรับสิ่งที่มีความสำคัญทางจิตวิญญาณ",
    "ฉันสงสัยในตอนแรกแต่หลังจากสวมใส่ไม่กี่สัปดาห์ฉันรู้สึกมีสมาธิและสงบขึ้น คุณภาพน่าประทับใจจริงๆ",
    "สินค้าสวยงาม ตรงตามที่อธิบาย รูปภาพไม่สามารถแสดงความงามได้ - ในชีวิตจริงสวยกว่ามาก พอใจกับการซื้อนี้มาก",
    "จัดส่งเร็วและบรรจุภัณฑ์ดีเยี่ยม ตัวสินค้าสวยงามและรู้สึกมีคุณภาพสูงมาก จะสั่งซื้อเพิ่มอีกแน่นอน",
    "ฉันให้เป็นของขวัญแก่เพื่อนและสมาชิกครอบครัวหลายคน ทุกคนดีใจมาก ความหมายทางจิตวิญญาณรวมกับงานฝีมือที่สวยงามทำให้มันสมบูรณ์แบบ",
    "ชิ้นงานนี้กลายเป็นเครื่องรางประจำวันของฉัน ฉันรู้สึกได้รับการคุ้มครองและมีสมาธิเมื่อสวมใส่ คุณภาพยอดเยี่ยม",
    "ชิ้นงานที่น่าทึ่งพร้อมความใส่ใจในรายละเอียดอย่างไม่น่าเชื่อ ฉันสามารถรู้สึกถึงความใส่ใจที่ใส่ไปในการสร้างมัน พิธีอธิษฐานเพิ่มมิติที่มีความหมาย",
    "สั่งเพื่อวันครบรอบและคู่ของฉันถึงกับร้องไห้ด้วยความซาบซึ้ง คุณภาพเกินความคาดหมายและความหมายทางจิตวิญญาณทำให้มันมากกว่าแค่เครื่องประดับ",
    "ฉันสะสมชิ้นงานจากภูเขาอู่ไถมาหลายปีและนี่คือหนึ่งในชิ้นที่ดีที่สุดที่ฉันเคยพบ พลังงานสัมผัสได้และงานฝีมือยอดเยี่ยม",
    "สินค้าที่ยอดเยี่ยม! มาถึงเร็วและบรรจุด้วยความใส่ใจมาก ตัวชิ้นงานสวยงามและฉันสังเกตเห็นการเปลี่ยนแปลงเชิงบวกแล้วตั้งแต่สวมใส่",
    "นี่คือสิ่งที่ฉันกำลังมองหา คุณภาพพรีเมียม ความหมายทางจิตวิญญาณเป็นจริง และมันกลายเป็นเครื่องประดับที่มีค่าที่สุดของฉัน",
    "คุณภาพยอดเยี่ยมและการออกแบบสวยงาม ฉันสวมใส่ทุกวันและมันนำความสบายใจและสันติสุขมาให้ การอธิษฐานจากภูเขาอู่ไถทำให้มันศักดิ์สิทธิ์จริงๆ",
    "ฉันซื้อมันหลังจากช่วงเวลาที่ยากลำบากในชีวิตและมันเป็นแหล่งของความสบายใจและความแข็งแกร่ง ชิ้นงานสวยงามพร้อมพลังงานทางจิตวิญญาณที่แท้จริง",
    "สมบูรณ์แบบในทุกด้าน งานฝีมือไร้ที่ติ วัสดุพรีเมียม และการอธิษฐานทางจิตวิญญาณทำให้มันมีพลังอย่างเป็นเอกลักษณ์ แนะนำอย่างยิ่ง!",
  ],
  vi: [
    "Món đồ tuyệt đẹp! Tay nghề thủ công tinh xảo và năng lượng tôi cảm nhận khi đeo thật đáng kinh ngạc. Rất khuyến khích cho những ai tìm kiếm sự bảo vệ tâm linh.",
    "Tôi đã đeo được 3 tháng và thực sự cảm nhận được sự thay đổi tích cực trong năng lượng của mình. Chất lượng xuất sắc và được đóng gói đẹp đẽ.",
    "Đây là lần mua thứ ba của tôi từ Cneraart và mỗi món đều hoàn hảo. Sự gia trì từ núi Ngũ Đài khiến nó thực sự đặc biệt. Giao hàng nhanh nữa!",
    "Chi tiết trên món đồ này thật đáng chú ý. Bạn có thể thấy nó được làm với sự chăm chút và tâm huyết. Tôi đeo mỗi ngày và nhận được rất nhiều lời khen.",
    "Tôi mua làm quà cho mẹ và bà ấy rất thích. Bao bì đẹp và kèm theo tấm thiệp xinh giải thích về sự gia trì.",
    "Một món đồ thật ý nghĩa. Lo lắng của tôi đã giảm kể từ khi bắt đầu đeo. Dù là năng lượng hay chỉ là lời nhắc nhở để bình tĩnh, nó đều có tác dụng!",
    "Chất lượng hoàn hảo! Vật liệu cảm giác cao cấp và tay nghề thủ công đẳng cấp. Xứng đáng từng đồng cho thứ gì đó có ý nghĩa tâm linh như vậy.",
    "Tôi hoài nghi lúc đầu nhưng sau vài tuần đeo, tôi cảm thấy tập trung và bình yên hơn. Chất lượng thực sự ấn tượng.",
    "Món đồ đẹp, đúng như mô tả. Ảnh không thể hiện hết vẻ đẹp - thực tế còn ấn tượng hơn. Rất hài lòng với lần mua này.",
    "Giao hàng nhanh và đóng gói xuất sắc. Sản phẩm tự nó đẹp và cảm giác rất chất lượng cao. Chắc chắn sẽ đặt thêm.",
    "Tôi đã tặng cho nhiều bạn bè và thành viên gia đình. Mọi người đều vui mừng. Ý nghĩa tâm linh kết hợp với tay nghề đẹp khiến nó hoàn hảo.",
    "Món đồ này đã trở thành bùa hộ mệnh hàng ngày của tôi. Tôi cảm thấy được bảo vệ và tập trung khi đeo. Chất lượng xuất sắc.",
    "Món đồ tuyệt vời với sự chú ý đến từng chi tiết đáng kinh ngạc. Tôi có thể cảm nhận được sự chăm chút đã được đặt vào việc tạo ra nó. Nghi lễ gia trì thêm một chiều sâu ý nghĩa.",
    "Đặt cho ngày kỷ niệm và người yêu của tôi đã xúc động đến rơi nước mắt. Chất lượng vượt quá mong đợi và ý nghĩa tâm linh khiến nó trở nên hơn cả trang sức.",
    "Tôi đã sưu tập các món từ núi Ngũ Đài nhiều năm và đây là một trong những món đẹp nhất tôi từng gặp. Năng lượng có thể cảm nhận được và tay nghề thủ công tuyệt vời.",
    "Sản phẩm tuyệt vời! Đến nhanh và được đóng gói cẩn thận. Bản thân món đồ đẹp và tôi đã nhận thấy những thay đổi tích cực kể từ khi đeo.",
    "Đây chính xác là thứ tôi đang tìm kiếm. Chất lượng cao cấp, ý nghĩa tâm linh thực sự, và đã trở thành món trang sức quý giá nhất của tôi.",
    "Chất lượng xuất sắc và thiết kế đẹp. Tôi đeo mỗi ngày và nó mang lại sự an ủi và bình yên. Sự gia trì từ núi Ngũ Đài khiến nó thực sự thiêng liêng.",
    "Tôi mua sau một giai đoạn khó khăn trong cuộc sống và nó là nguồn an ủi và sức mạnh. Món đồ đẹp với năng lượng tâm linh thực sự.",
    "Hoàn hảo theo mọi cách. Tay nghề không tì vết, vật liệu cao cấp và sự gia trì tâm linh khiến nó đặc biệt mạnh mẽ. Rất khuyến khích!",
  ],
  id: [
    "Barang yang sangat indah! Keahlian pengerjaan sangat indah dan energi yang saya rasakan saat memakainya luar biasa. Sangat direkomendasikan bagi siapa saja yang mencari perlindungan spiritual.",
    "Saya telah memakainya selama 3 bulan dan benar-benar merasakan perubahan positif dalam energi saya. Kualitasnya luar biasa dan tiba dengan kemasan yang indah.",
    "Ini adalah pembelian ketiga saya dari Cneraart dan setiap barang sempurna. Berkah dari Gunung Wutai membuatnya benar-benar istimewa. Pengiriman cepat juga!",
    "Detail pada barang ini luar biasa. Anda dapat melihat bahwa itu dibuat dengan penuh perhatian dan niat. Saya memakainya setiap hari dan mendapat banyak pujian.",
    "Saya membelinya sebagai hadiah untuk ibu saya dan dia sangat menyukainya. Kemasannya indah dan dilengkapi dengan kartu cantik yang menjelaskan berkah.",
    "Barang yang sangat bermakna. Kecemasan saya telah berkurang sejak saya mulai memakainya. Entah itu energinya atau hanya pengingat untuk tetap tenang, itu berhasil!",
    "Kualitas sempurna! Materialnya terasa premium dan keahlian pengerjaan kelas satu. Sepadan dengan setiap sen untuk sesuatu yang begitu signifikan secara spiritual.",
    "Saya skeptis pada awalnya tetapi setelah memakainya beberapa minggu saya merasa lebih terpusat dan damai. Kualitasnya benar-benar mengesankan.",
    "Barang yang indah, persis seperti yang dijelaskan. Foto tidak memberikan keadilan - itu bahkan lebih menakjubkan secara langsung. Sangat puas dengan pembelian ini.",
    "Pengiriman cepat dan kemasan yang sangat baik. Produknya sendiri indah dan terasa berkualitas sangat tinggi. Pasti akan memesan lebih banyak barang.",
    "Saya telah memberikannya sebagai hadiah kepada beberapa teman dan anggota keluarga. Semua orang senang. Makna spiritual dikombinasikan dengan keahlian yang indah membuatnya sempurna.",
    "Barang ini telah menjadi jimat harian saya. Saya merasa terlindungi dan terpusat saat memakainya. Kualitasnya luar biasa.",
    "Barang yang menakjubkan dengan perhatian luar biasa terhadap detail. Saya dapat merasakan perhatian yang dicurahkan dalam pembuatannya. Upacara berkah menambahkan dimensi yang sangat bermakna.",
    "Dipesan untuk ulang tahun pernikahan kami dan pasangan saya terharu sampai menangis. Kualitasnya melampaui ekspektasi kami dan makna spiritual membuatnya jauh lebih dari sekadar perhiasan.",
    "Saya telah mengoleksi barang-barang dari Gunung Wutai selama bertahun-tahun dan ini adalah salah satu yang terbaik yang pernah saya temui. Energinya terasa dan keahlian pengerjaan luar biasa.",
    "Produk yang luar biasa! Tiba dengan cepat dan dikemas dengan sangat penuh perhatian. Barangnya sendiri indah dan saya sudah memperhatikan perubahan positif sejak memakainya.",
    "Ini persis apa yang saya cari. Kualitasnya premium, makna spiritualnya nyata, dan telah menjadi perhiasan paling berharga saya.",
    "Kualitas luar biasa dan desain yang indah. Saya memakainya setiap hari dan membawa kenyamanan dan kedamaian. Berkah dari Gunung Wutai membuatnya benar-benar suci.",
    "Saya membelinya setelah periode sulit dalam hidup saya dan itu telah menjadi sumber kenyamanan dan kekuatan. Barang yang indah dengan energi spiritual yang tulus.",
    "Sempurna dalam segala hal. Keahlian pengerjaan sempurna, materialnya premium dan berkah spiritual membuatnya unik kuat. Sangat direkomendasikan!",
  ],
  tr: [
    "Kesinlikle güzel bir parça! El işçiliği mükemmel ve takarken hissettiğim enerji inanılmaz. Manevi koruma arayanlar için şiddetle tavsiye edilir.",
    "3 aydır takıyorum ve enerjimde gerçekten olumlu bir değişim hissediyorum. Kalite mükemmel ve güzel paketlenmiş olarak geldi.",
    "Bu Cneraart'tan üçüncü satın alımım ve her parça mükemmeldi. Wutai Dağı'ndan gelen bereket onu gerçekten özel yapıyor. Hızlı kargo da!",
    "Bu parçanın detayı dikkat çekici. Özenle ve niyetle yapıldığını görebilirsiniz. Her gün takıyorum ve çok fazla iltifat alıyorum.",
    "Annem için hediye olarak aldım ve çok seviyor. Paketleme muhteşemdi ve bereket açıklayan güzel bir kartla geldi.",
    "Bu kadar anlamlı bir parça. Takmaya başladığımdan beri kaygım azaldı. İster enerji olsun ister sadece sakin kalma hatırlatıcısı, işe yarıyor!",
    "Mükemmel kalite! Malzemeler premium hissettiriyor ve el işçiliği birinci sınıf. Manevi açıdan bu kadar önemli bir şey için her kuruşa değer.",
    "Başta şüpheciydim ama birkaç hafta taktıktan sonra kendimi daha odaklanmış ve huzurlu hissediyorum. Kalite gerçekten etkileyici.",
    "Güzel ürün, tam olarak açıklandığı gibi. Fotoğraflar ona hak ettiği değeri vermiyor - gerçekte daha da çarpıcı. Bu satın alımdan çok memnunum.",
    "Hızlı teslimat ve mükemmel paketleme. Ürünün kendisi güzel ve çok yüksek kaliteli hissettiriyor. Kesinlikle daha fazla ürün sipariş edeceğim.",
    "Birkaç arkadaşıma ve aile üyelerime hediye olarak verdim. Herkes memnun oldu. Manevi anlam ile güzel el işçiliğinin kombinasyonu onu mükemmel yapıyor.",
    "Bu parça günlük tılsımım haline geldi. Taktığımda kendimi korunmuş ve odaklanmış hissediyorum. Kalite istisnai.",
    "Ayrıntılara inanılmaz dikkat gösteren muhteşem bir parça. Yapımına koyulan özeni hissedebiliyorum. Bereket töreni bu kadar anlamlı bir boyut katıyor.",
    "Yıldönümümüz için sipariş ettim ve partnerim gözyaşlarına boğuldu. Kalite beklentilerimizi aştı ve manevi anlam onu sadece mücevherden çok daha fazlası yaptı.",
    "Yıllardır Wutai Dağı'ndan parçalar topluyorum ve bu karşılaştığım en güzellerinden biri. Enerji hissedilebilir ve el işçiliği mükemmel.",
    "Harika ürün! Hızlı geldi ve bu kadar özenle paketlendi. Parçanın kendisi güzel ve taktığımdan beri olumlu değişiklikler fark ettim.",
    "Bu tam aradığım şeydi. Kalite premium, manevi anlam gerçek ve en değerli mücevherim haline geldi.",
    "İstisna kalite ve güzel tasarım. Her gün takıyorum ve bana teselli ve huzur getiriyor. Wutai Dağı'ndan gelen bereket onu gerçekten kutsal yapıyor.",
    "Hayatımın zor bir döneminden sonra aldım ve teselli ve güç kaynağı oldu. Gerçek manevi enerji ile güzel bir parça.",
    "Her açıdan mükemmel. El işçiliği kusursuz, malzemeler premium ve manevi bereket onu eşsiz derecede güçlü yapıyor. Şiddetle tavsiye edilir!",
  ],
  "zh-Hant": [
    "絕對美麗的飾品！工藝精湛，佩戴時感受到的能量令人難以置信。強烈推薦給尋求靈性保護的人。",
    "已經佩戴了3個月，真的感受到了積極的能量變化。品質出色，包裝精美。",
    "這是我第三次從Cneraart購買，每件都很完美。五台山的加持讓它真的很特別。發貨也很快！",
    "這件飾品的細節令人印象深刻，可以看出是用心製作的。每天佩戴，收到很多讚美。",
    "買來送給媽媽，她非常喜歡。包裝精美，附有解釋加持的卡片。",
    "非常有意義的飾品。自從開始佩戴，我的焦慮減少了很多。無論是能量還是提醒自己保持平靜，都很有效！",
    "品質完美！材料高檔，工藝一流。對於如此有靈性意義的東西，物超所值。",
    "一開始我有些懷疑，但佩戴幾週後感覺更加平靜和專注。品質確實令人印象深刻。",
    "漂亮的物品，與描述完全一致。照片都無法展示它的美麗——實物更加驚艷。非常滿意。",
    "發貨快，包裝好。產品本身非常漂亮，感覺很高檔。肯定會再次訂購。",
    "已經作為禮物送給了幾位朋友和家人，每個人都非常高興。靈性意義與精美工藝的結合使它成為完美禮物。",
    "這件飾品已成為我每天的護身符。佩戴時感到受保護和平靜。品質卓越，佩戴數月依然完好。",
    "令人驚嘆的飾品，細節處理極為精心。能感受到製作時的用心。加持儀式增添了深刻的意義。",
    "為週年紀念日購買，伴侶感動落淚。品質超出預期，靈性意義使它遠不止是珠寶。",
    "多年來一直收藏五台山的飾品，這是我遇到的最精美的之一。能量可以感受到，工藝精湛。",
    "很棒的產品！到貨快，包裝細心。飾品本身很漂亮，佩戴後已經注意到積極變化。",
    "這正是我在尋找的。品質高檔，靈性意義真實，已成為我最珍貴的飾品。",
    "品質卓越，設計精美。每天佩戴，帶給我安慰和平靜。五台山的加持使它真正神聖。",
    "在人生困難時期購買了這件飾品，它一直是我的安慰和力量來源。美麗的飾品，具有真實的靈性能量。",
    "各方面都完美。工藝無瑕，材料高檔，靈性加持使它獨特有力。強烈推薦！",
  ],
};

const REVIEWER_NAMES = [
  'Wei Chen', 'Li Ming', 'Zhang Wei', 'Wang Fang', 'Liu Yang', 'Chen Jing', 'Xu Lei', 'Yang Rui',
  'Sarah Johnson', 'Michael Brown', 'Emma Wilson', 'James Davis', 'Olivia Taylor', 'William Moore',
  'Sophia Anderson', 'Benjamin Jackson', 'Isabella White', 'Ethan Harris', 'Mia Martin', 'Noah Thompson',
  'Hans Mueller', 'Anna Schmidt', 'Klaus Weber', 'Petra Fischer', 'Markus Becker', 'Sabine Hoffmann',
  'Pierre Dupont', 'Marie Martin', 'Jean Bernard', 'Sophie Laurent', 'Luc Moreau', 'Isabelle Petit',
  'Carlos Garcia', 'Sofia Rodriguez', 'Miguel Lopez', 'Isabella Fernandez', 'Alejandro Martinez',
  'Marco Rossi', 'Giulia Ferrari', 'Luca Bianchi', 'Francesca Romano', 'Alessandro Conti',
  'Yuki Tanaka', 'Kenji Sato', 'Haruki Yamamoto', 'Sakura Watanabe', 'Rin Nakamura', 'Hana Kobayashi',
  'Ji-ho Kim', 'Hyun-ji Park', 'Min-jun Lee', 'Soo-yeon Choi', 'Da-eun Jung', 'Jae-won Oh',
  'Natasha Ivanova', 'Dmitri Petrov', 'Elena Sokolova', 'Alexei Volkov', 'Olga Morozova',
  'Ahmed Hassan', 'Fatima Al-Rashid', 'Omar Abdullah', 'Layla Khalid', 'Tariq Mohammed',
  'Priya Sharma', 'Raj Patel', 'Ananya Singh', 'Vikram Nair', 'Deepa Krishnan',
  'Nguyen Van An', 'Tran Thi Lan', 'Le Van Duc', 'Pham Thi Hoa', 'Hoang Minh Tuan',
  'Siti Rahayu', 'Budi Santoso', 'Dewi Kusuma', 'Andi Wijaya', 'Rina Permata',
  'Somchai Jaidee', 'Nattaporn Srisuk', 'Wanchai Thongchai', 'Siriporn Chaiyasit',
  'Mehmet Yilmaz', 'Fatma Demir', 'Ali Kaya', 'Zeynep Arslan', 'Mustafa Celik',
  'Luisa Santos', 'João Oliveira', 'Ana Costa', 'Pedro Ferreira', 'Mariana Rodrigues',
  'Emma Thompson', 'Oliver Smith', 'Charlotte Jones', 'Harry Williams', 'Amelia Brown',
];

const LOCATIONS = [
  'United States', 'United Kingdom', 'Germany', 'France', 'Spain', 'Italy', 'Portugal',
  'Russia', 'Japan', 'South Korea', 'China', 'Singapore', 'Malaysia', 'Thailand',
  'Vietnam', 'Indonesia', 'India', 'Saudi Arabia', 'UAE', 'Australia', 'Canada',
  'Brazil', 'Mexico', 'Netherlands', 'Belgium', 'Sweden', 'Norway', 'Denmark',
  'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece', 'Turkey',
  'New Zealand', 'South Africa', 'Philippines', 'Taiwan', 'Hong Kong', 'Macau',
];

function generateBatchReviews(productId, count) {
  const languages = Object.keys(REVIEW_TEMPLATES);
  const reviews = [];
  const now = Date.now();
  const tenMonthsAgo = now - (10 * 30 * 24 * 60 * 60 * 1000);
  
  for (let i = 0; i < count; i++) {
    const lang = languages[i % languages.length];
    const templates = REVIEW_TEMPLATES[lang];
    const comment = templates[i % templates.length];
    const userName = REVIEWER_NAMES[i % REVIEWER_NAMES.length];
    const rating = Math.random() > 0.06 ? 5 : 4; // 94% 5星
    const createdAt = new Date(tenMonthsAgo + Math.random() * (now - tenMonthsAgo));
    const location = LOCATIONS[i % LOCATIONS.length];
    
    reviews.push([
      productId,
      null, // userId
      userName,
      rating,
      comment,
      location,
      createdAt.toISOString().slice(0, 19).replace('T', ' '),
      1, // isVerified
      1, // isApproved
    ]);
  }
  return reviews;
}

async function main() {
  const conn = await mysql.createConnection(PROD_DB);
  console.log('✅ 已连接生产数据库');
  
  let totalInserted = 0;
  const startTime = Date.now();
  
  for (let pidx = 0; pidx < PRODUCT_IDS.length; pidx++) {
    const productId = PRODUCT_IDS[pidx];
    const productStart = Date.now();
    
    // 检查当前评论数
    const [countRows] = await conn.execute('SELECT COUNT(*) as cnt FROM reviews WHERE productId = ?', [productId]);
    const currentCount = countRows[0].cnt;
    const needed = Math.max(0, REVIEWS_PER_PRODUCT - currentCount);
    
    if (needed === 0) {
      console.log(`  ⏭️  产品 ${productId} 已有 ${currentCount} 条评论，跳过`);
      continue;
    }
    
    console.log(`\n[${pidx + 1}/${PRODUCT_IDS.length}] 产品 ${productId}: 当前 ${currentCount} 条，需要补充 ${needed} 条...`);
    
    const reviews = generateBatchReviews(productId, needed);
    
    // 批量INSERT
    for (let i = 0; i < reviews.length; i += BATCH_SIZE) {
      const batch = reviews.slice(i, i + BATCH_SIZE);
      const placeholders = batch.map(() => '(?,?,?,?,?,?,?,?,?)').join(',');
      const values = batch.flat();
      
      await conn.execute(
        `INSERT INTO reviews (productId, userId, userName, rating, comment, location, createdAt, isVerified, isApproved) VALUES ${placeholders}`,
        values
      );
      
      totalInserted += batch.length;
      const progress = Math.round((i + batch.length) / needed * 100);
      if (progress % 20 === 0 || i + BATCH_SIZE >= reviews.length) {
        process.stdout.write(`\r  进度: ${progress}% (${i + batch.length}/${needed})`);
      }
    }
    
    const elapsed = ((Date.now() - productStart) / 1000).toFixed(1);
    console.log(`\n  ✅ 产品 ${productId} 完成，耗时 ${elapsed}s`);
  }
  
  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n\n🎉 全部完成！总共插入 ${totalInserted.toLocaleString()} 条评论，耗时 ${totalElapsed} 分钟`);
  
  await conn.end();
}

main().catch(console.error);
