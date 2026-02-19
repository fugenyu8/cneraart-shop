import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// ============ 人名生成系统 ============

// 英语名字库
const englishFirstNames = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher',
  'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Andrew', 'Paul', 'Joshua',
  'Kenneth', 'Kevin', 'Brian', 'George', 'Timothy', 'Ronald', 'Edward', 'Jason', 'Jeffrey', 'Ryan',
  'Jacob', 'Gary', 'Nicholas', 'Eric', 'Jonathan', 'Stephen', 'Larry', 'Justin', 'Scott', 'Brandon',
  'Benjamin', 'Samuel', 'Raymond', 'Gregory', 'Alexander', 'Patrick', 'Frank', 'Dennis', 'Jerry', 'Tyler',
  'Aaron', 'Jose', 'Adam', 'Nathan', 'Henry', 'Douglas', 'Zachary', 'Peter', 'Kyle', 'Noah',
  'Ethan', 'Jeremy', 'Walter', 'Christian', 'Keith', 'Roger', 'Terry', 'Austin', 'Sean', 'Gerald',
  'Carl', 'Dylan', 'Harold', 'Jordan', 'Jesse', 'Bryan', 'Lawrence', 'Arthur', 'Gabriel', 'Bruce',
  'Logan', 'Billy', 'Albert', 'Willie', 'Alan', 'Juan', 'Louis', 'Russell', 'Philip', 'Randy',
  'Roy', 'Eugene', 'Vincent', 'Ralph', 'Ernest', 'Martin', 'Craig', 'Stanley', 'Shawn', 'Travis',
  // 女性名字
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Barbara', 'Elizabeth', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle',
  'Carol', 'Amanda', 'Dorothy', 'Melissa', 'Deborah', 'Stephanie', 'Rebecca', 'Sharon', 'Laura', 'Cynthia',
  'Amy', 'Kathleen', 'Angela', 'Shirley', 'Brenda', 'Emma', 'Anna', 'Pamela', 'Nicole', 'Samantha',
  'Katherine', 'Christine', 'Helen', 'Debra', 'Rachel', 'Carolyn', 'Janet', 'Maria', 'Heather', 'Diane',
  'Julie', 'Joyce', 'Victoria', 'Ruth', 'Virginia', 'Lauren', 'Kelly', 'Christina', 'Joan', 'Evelyn',
  'Judith', 'Andrea', 'Hannah', 'Megan', 'Cheryl', 'Jacqueline', 'Martha', 'Madison', 'Teresa', 'Gloria',
  'Sara', 'Janice', 'Kathryn', 'Ann', 'Abigail', 'Sophia', 'Frances', 'Jean', 'Alice', 'Judy',
  'Isabella', 'Julia', 'Grace', 'Amber', 'Denise', 'Danielle', 'Marilyn', 'Beverly', 'Charlotte', 'Natalie',
  'Olivia', 'Brittany', 'Diana', 'Jane', 'Lori', 'Alexis', 'Tiffany', 'Kayla', 'Ava', 'Chloe'
];

const englishLastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts',
  'Gomez', 'Phillips', 'Evans', 'Turner', 'Diaz', 'Parker', 'Cruz', 'Edwards', 'Collins', 'Reyes',
  'Stewart', 'Morris', 'Morales', 'Murphy', 'Cook', 'Rogers', 'Gutierrez', 'Ortiz', 'Morgan', 'Cooper',
  'Peterson', 'Bailey', 'Reed', 'Kelly', 'Howard', 'Ramos', 'Kim', 'Cox', 'Ward', 'Richardson',
  'Watson', 'Brooks', 'Chavez', 'Wood', 'James', 'Bennett', 'Gray', 'Mendoza', 'Ruiz', 'Hughes',
  'Price', 'Alvarez', 'Castillo', 'Sanders', 'Patel', 'Myers', 'Long', 'Ross', 'Foster', 'Jimenez',
  'Powell', 'Jenkins', 'Perry', 'Russell', 'Sullivan', 'Bell', 'Coleman', 'Butler', 'Henderson', 'Barnes',
  'Gonzales', 'Fisher', 'Vasquez', 'Simmons', 'Romero', 'Jordan', 'Patterson', 'Alexander', 'Hamilton', 'Graham',
  'Reynolds', 'Griffin', 'Wallace', 'Moreno', 'West', 'Cole', 'Hayes', 'Bryant', 'Herrera', 'Gibson',
  'Ellis', 'Tran', 'Medina', 'Aguilar', 'Stevens', 'Murray', 'Ford', 'Castro', 'Marshall', 'Owens',
  'Harrison', 'Fernandez', 'McDonald', 'Woods', 'Washington', 'Kennedy', 'Wells', 'Vargas', 'Henry', 'Chen',
  'Freeman', 'Webb', 'Tucker', 'Guzman', 'Burns', 'Crawford', 'Olson', 'Simpson', 'Porter', 'Hunter',
  'Gordon', 'Mendez', 'Silva', 'Shaw', 'Snyder', 'Mason', 'Dixon', 'Munoz', 'Hunt', 'Hicks',
  'Holmes', 'Palmer', 'Wagner', 'Black', 'Robertson', 'Boyd', 'Rose', 'Stone', 'Salazar', 'Fox',
  'Warren', 'Mills', 'Meyer', 'Rice', 'Schmidt', 'Garza', 'Daniels', 'Ferguson', 'Nichols', 'Stephens'
];

// 中文姓名库
const chineseSurnames = [
  '王', '李', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周',
  '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗',
  '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹',
  '彭', '曾', '肖', '田', '董', '袁', '潘', '于', '蒋', '蔡',
  '余', '杜', '叶', '程', '苏', '魏', '吕', '丁', '任', '沈',
  '姚', '卢', '姜', '崔', '钟', '谭', '陆', '汪', '范', '金',
  '石', '廖', '贾', '夏', '韦', '付', '方', '白', '邹', '孟',
  '熊', '秦', '邱', '江', '尹', '薛', '闫', '段', '雷', '侯',
  '龙', '史', '陶', '黎', '贺', '顾', '毛', '郝', '龚', '邵',
  '万', '钱', '严', '覃', '武', '戴', '莫', '孔', '向', '汤'
];

const chineseGivenNames = [
  '伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军',
  '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞',
  '平', '刚', '桂英', '鹏', '辉', '玲', '建华', '文', '利', '波',
  '成', '国', '华', '玉', '萍', '红', '鑫', '建', '云', '梅',
  '燕', '丹', '亮', '帆', '颖', '婷', '宇', '琳', '佳', '慧',
  '欣', '瑶', '雪', '莉', '婧', '宁', '晨', '阳', '晓', '雨',
  '菲', '凯', '悦', '蕾', '薇', '倩', '茹', '琪', '睿', '涵',
  '浩', '轩', '博', '宸', '昊', '泽', '瑞', '翔', '俊', '豪',
  '诗', '雅', '琦', '岚', '彤', '妍', '璐', '萱', '怡', '馨',
  '曦', '蓉', '洁', '梦', '思', '语', '嘉', '熙', '然', '可',
  '心', '月', '天', '星', '晴', '露', '冰', '雁', '枫', '兰',
  '竹', '松', '梓', '楠', '柏', '桦', '栋', '林', '森', '木',
  '水', '江', '海', '河', '湖', '溪', '泉', '源', '清', '澈',
  '风', '雷', '电', '雪', '霜', '露', '雾', '虹', '霞', '云',
  '山', '岳', '峰', '岩', '石', '磐', '岭', '峡', '谷', '川',
  '金', '银', '铜', '铁', '钢', '锋', '锐', '铭', '鑫', '鹏',
  '龙', '虎', '豹', '狮', '鹰', '雁', '鹤', '凤', '麟', '麒',
  '春', '夏', '秋', '冬', '东', '南', '西', '北', '中', '和',
  '安', '康', '宁', '福', '禄', '寿', '喜', '财', '富', '贵',
  '德', '仁', '义', '礼', '智', '信', '忠', '孝', '廉', '耻'
];

// 德语姓名库
const germanFirstNames = [
  'Hans', 'Peter', 'Wolfgang', 'Klaus', 'Jürgen', 'Dieter', 'Horst', 'Uwe', 'Thomas', 'Michael',
  'Andreas', 'Stefan', 'Frank', 'Rainer', 'Manfred', 'Bernd', 'Werner', 'Helmut', 'Günter', 'Karl',
  'Christian', 'Martin', 'Matthias', 'Alexander', 'Daniel', 'Sebastian', 'Markus', 'Oliver', 'Tobias', 'Jan',
  'Anna', 'Maria', 'Ursula', 'Monika', 'Petra', 'Sabine', 'Gabriele', 'Andrea', 'Karin', 'Heike',
  'Susanne', 'Angelika', 'Birgit', 'Martina', 'Claudia', 'Stefanie', 'Nicole', 'Katharina', 'Julia', 'Sandra'
];

const germanLastNames = [
  'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann',
  'Schäfer', 'Koch', 'Bauer', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Zimmermann',
  'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier',
  'Lehmann', 'Schmid', 'Schulze', 'Maier', 'Köhler', 'Herrmann', 'König', 'Walter', 'Mayer', 'Huber',
  'Kaiser', 'Fuchs', 'Peters', 'Lang', 'Scholz', 'Möller', 'Weiß', 'Jung', 'Hahn', 'Vogel'
];

// 法语姓名库
const frenchFirstNames = [
  'Jean', 'Pierre', 'Michel', 'André', 'Philippe', 'Alain', 'Bernard', 'Jacques', 'François', 'Christian',
  'Claude', 'Patrick', 'Nicolas', 'Daniel', 'Laurent', 'Stéphane', 'Olivier', 'Julien', 'Thomas', 'Alexandre',
  'Marie', 'Nathalie', 'Isabelle', 'Sylvie', 'Catherine', 'Françoise', 'Monique', 'Sophie', 'Martine', 'Christine',
  'Valérie', 'Sandrine', 'Céline', 'Stéphanie', 'Aurélie', 'Émilie', 'Julie', 'Caroline', 'Camille', 'Chloé',
  'Léa', 'Manon', 'Emma', 'Clara', 'Laura', 'Sarah', 'Marine', 'Pauline', 'Charlotte', 'Lucie'
];

const frenchLastNames = [
  'Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau',
  'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier',
  'Morel', 'Girard', 'André', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'François', 'Martinez',
  'Legrand', 'Garnier', 'Faure', 'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas',
  'Perrin', 'Morin', 'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier', 'Robin'
];

// 意大利语姓名库
const italianFirstNames = [
  'Giuseppe', 'Giovanni', 'Antonio', 'Mario', 'Francesco', 'Luigi', 'Angelo', 'Vincenzo', 'Pietro', 'Salvatore',
  'Carlo', 'Franco', 'Domenico', 'Bruno', 'Paolo', 'Michele', 'Giorgio', 'Andrea', 'Stefano', 'Marco',
  'Maria', 'Anna', 'Giuseppina', 'Rosa', 'Angela', 'Giovanna', 'Teresa', 'Lucia', 'Carmela', 'Caterina',
  'Francesca', 'Laura', 'Paola', 'Daniela', 'Elena', 'Alessandra', 'Monica', 'Silvia', 'Claudia', 'Chiara'
];

const italianLastNames = [
  'Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco',
  'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti',
  'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferrara', 'Galli', 'Martini', 'Leone'
];

// 西班牙语姓名库
const spanishFirstNames = [
  'Antonio', 'José', 'Manuel', 'Francisco', 'Juan', 'David', 'José Antonio', 'José Luis', 'Jesús', 'Javier',
  'Francisco Javier', 'Carlos', 'Miguel', 'Rafael', 'Pedro', 'José Manuel', 'Ángel', 'Alejandro', 'Miguel Ángel', 'José María',
  'María Carmen', 'María', 'Carmen', 'Josefa', 'Isabel', 'Dolores', 'Pilar', 'Teresa', 'Ana María', 'Francisca',
  'Laura', 'María Pilar', 'María Dolores', 'María Teresa', 'Ana', 'Cristina', 'Marta', 'Ángeles', 'Lucía', 'María José'
];

const spanishLastNames = [
  'García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín',
  'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Álvarez', 'Muñoz', 'Romero', 'Alonso', 'Gutiérrez',
  'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Suárez'
];

// 生成随机人名
function generateRandomName(country, usedNames = new Set()) {
  let name;
  let attempts = 0;
  const maxAttempts = 100;
  
  do {
    switch (country) {
      case 'UK':
      case 'US':
      case 'AU':
      case 'CA':
        const firstName = englishFirstNames[Math.floor(Math.random() * englishFirstNames.length)];
        const lastInitial = englishLastNames[Math.floor(Math.random() * englishLastNames.length)][0];
        name = `${firstName} ${lastInitial}.`;
        break;
      
      case 'CN':
        const surname = chineseSurnames[Math.floor(Math.random() * chineseSurnames.length)];
        const givenName = chineseGivenNames[Math.floor(Math.random() * chineseGivenNames.length)];
        const hideType = Math.floor(Math.random() * 3);
        if (hideType === 0) {
          name = `${surname}**`;
        } else if (hideType === 1) {
          name = `${surname}*${givenName}`;
        } else {
          name = `${surname}${givenName}*`;
        }
        break;
      
      case 'DE':
        const deName = germanFirstNames[Math.floor(Math.random() * germanFirstNames.length)];
        const deLastInitial = germanLastNames[Math.floor(Math.random() * germanLastNames.length)][0];
        name = `${deName} ${deLastInitial}.`;
        break;
      
      case 'FR':
        const frName = frenchFirstNames[Math.floor(Math.random() * frenchFirstNames.length)];
        const frLastInitial = frenchLastNames[Math.floor(Math.random() * frenchLastNames.length)][0];
        name = `${frName} ${frLastInitial}.`;
        break;
      
      case 'IT':
        const itName = italianFirstNames[Math.floor(Math.random() * italianFirstNames.length)];
        const itLastInitial = italianLastNames[Math.floor(Math.random() * italianLastNames.length)][0];
        name = `${itName} ${itLastInitial}.`;
        break;
      
      case 'ES':
        const esName = spanishFirstNames[Math.floor(Math.random() * spanishFirstNames.length)];
        const esLastInitial = spanishLastNames[Math.floor(Math.random() * spanishLastNames.length)][0];
        name = `${esName} ${esLastInitial}.`;
        break;
      
      default:
        const defName = englishFirstNames[Math.floor(Math.random() * englishFirstNames.length)];
        const defLastInitial = englishLastNames[Math.floor(Math.random() * englishLastNames.length)][0];
        name = `${defName} ${defLastInitial}.`;
    }
    
    attempts++;
    if (attempts >= maxAttempts) {
      // 如果尝试太多次,添加随机数字后缀
      name = `${name}${Math.floor(Math.random() * 1000)}`;
      break;
    }
  } while (usedNames.has(name));
  
  usedNames.add(name);
  return name;
}

// ============ IP地址生成系统 ============

const ipRanges = {
  'UK': ['81', '82', '83', '86', '87', '88', '90', '92', '94'],
  'US': ['12', '13', '15', '17', '23', '24', '35', '38', '40', '44', '47', '50', '52', '54', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '96', '97', '98', '99', '100', '104', '107', '108'],
  'DE': ['80', '84', '85', '87', '88', '89', '91', '93', '95'],
  'FR': ['2', '5', '31', '37', '46', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '109'],
  'IT': ['2', '5', '31', '37', '46', '62', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '151', '176', '185'],
  'ES': ['2', '5', '31', '37', '46', '62', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95'],
  'CN': ['1', '14', '27', '36', '39', '42', '49', '58', '59', '60', '61', '101', '103', '106', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '175', '180', '182', '183', '202', '203', '210', '211', '218', '219', '220', '221', '222', '223'],
  'SG': ['1', '8', '27', '42', '43', '49', '58', '59', '60', '61', '101', '103', '106', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '175', '180', '182', '183', '202', '203'],
  'AU': ['1', '14', '27', '36', '39', '42', '43', '49', '58', '59', '60', '61', '101', '103', '106', '110', '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123', '124', '125', '175', '180', '182', '183', '202', '203'],
  'CA': ['24', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '96', '97', '98', '99', '100', '104', '107', '108', '142', '184', '192', '198', '199', '206', '207', '208', '209']
};

function generateIP(country) {
  const ranges = ipRanges[country] || ipRanges['US'];
  const firstOctet = ranges[Math.floor(Math.random() * ranges.length)];
  const secondOctet = Math.floor(Math.random() * 256);
  const thirdOctet = Math.floor(Math.random() * 256);
  const fourthOctet = Math.floor(Math.random() * 256);
  return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
}

// ============ 城市和国家数据 ============

const locations = {
  'UK': [
    'London, United Kingdom', 'Manchester, United Kingdom', 'Birmingham, United Kingdom', 'Leeds, United Kingdom',
    'Glasgow, United Kingdom', 'Liverpool, United Kingdom', 'Newcastle, United Kingdom', 'Sheffield, United Kingdom',
    'Bristol, United Kingdom', 'Edinburgh, United Kingdom', 'Leicester, United Kingdom', 'Nottingham, United Kingdom',
    'Southampton, United Kingdom', 'Brighton, United Kingdom', 'Oxford, United Kingdom', 'Cambridge, United Kingdom'
  ],
  'US': [
    'New York, United States', 'Los Angeles, United States', 'Chicago, United States', 'Houston, United States',
    'Phoenix, United States', 'Philadelphia, United States', 'San Antonio, United States', 'San Diego, United States',
    'Dallas, United States', 'San Jose, United States', 'Austin, United States', 'Jacksonville, United States',
    'San Francisco, United States', 'Seattle, United States', 'Denver, United States', 'Boston, United States',
    'Miami, United States', 'Atlanta, United States', 'Las Vegas, United States', 'Portland, United States'
  ],
  'DE': [
    'Berlin, Germany', 'Hamburg, Germany', 'Munich, Germany', 'Cologne, Germany', 'Frankfurt, Germany',
    'Stuttgart, Germany', 'Düsseldorf, Germany', 'Dortmund, Germany', 'Essen, Germany', 'Leipzig, Germany',
    'Bremen, Germany', 'Dresden, Germany', 'Hanover, Germany', 'Nuremberg, Germany', 'Duisburg, Germany'
  ],
  'FR': [
    'Paris, France', 'Marseille, France', 'Lyon, France', 'Toulouse, France', 'Nice, France',
    'Nantes, France', 'Strasbourg, France', 'Montpellier, France', 'Bordeaux, France', 'Lille, France',
    'Rennes, France', 'Reims, France', 'Le Havre, France', 'Saint-Étienne, France', 'Toulon, France'
  ],
  'IT': [
    'Rome, Italy', 'Milan, Italy', 'Naples, Italy', 'Turin, Italy', 'Palermo, Italy',
    'Genoa, Italy', 'Bologna, Italy', 'Florence, Italy', 'Bari, Italy', 'Catania, Italy',
    'Venice, Italy', 'Verona, Italy', 'Messina, Italy', 'Padua, Italy', 'Trieste, Italy'
  ],
  'ES': [
    'Madrid, Spain', 'Barcelona, Spain', 'Valencia, Spain', 'Seville, Spain', 'Zaragoza, Spain',
    'Málaga, Spain', 'Murcia, Spain', 'Palma, Spain', 'Las Palmas, Spain', 'Bilbao, Spain',
    'Alicante, Spain', 'Córdoba, Spain', 'Valladolid, Spain', 'Vigo, Spain', 'Gijón, Spain'
  ],
  'CN': [
    '北京, 中国', '上海, 中国', '广州, 中国', '深圳, 中国', '成都, 中国',
    '杭州, 中国', '重庆, 中国', '西安, 中国', '苏州, 中国', '武汉, 中国',
    '南京, 中国', '天津, 中国', '郑州, 中国', '长沙, 中国', '沈阳, 中国',
    '青岛, 中国', '香港, 中国', '台北, 中国', '厦门, 中国', '大连, 中国'
  ],
  'SG': ['Singapore, Singapore', 'Jurong, Singapore', 'Tampines, Singapore', 'Woodlands, Singapore'],
  'AU': [
    'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia', 'Perth, Australia',
    'Adelaide, Australia', 'Gold Coast, Australia', 'Canberra, Australia', 'Newcastle, Australia'
  ],
  'CA': [
    'Toronto, Canada', 'Montreal, Canada', 'Vancouver, Canada', 'Calgary, Canada',
    'Edmonton, Canada', 'Ottawa, Canada', 'Winnipeg, Canada', 'Quebec City, Canada'
  ]
};

// ============ 评价内容生成系统 ============

// 英语评价片段
const reviewFragments_EN = {
  // 购买决策(犹豫→研究→购买)
  decision: [
    "I was skeptical at first, but after reading so many positive reviews, I decided to give it a try.",
    "Hesitated for weeks before purchasing, but I'm so glad I finally did!",
    "Did a lot of research on Eastern spiritual items before choosing this one.",
    "Wasn't sure if this would work for me, but the reviews convinced me.",
    "After comparing different options, this one stood out with its authentic consecration.",
    "My friend recommended this, and after seeing her results, I had to try it myself.",
    "Spent days researching traditional Eastern practices before making this purchase.",
    "The detailed description of the Wutai Mountain consecration ceremony convinced me.",
    "Initially doubtful about spiritual items, but something told me to trust this.",
    "Read about the ancient wisdom behind this and felt drawn to it.",
    "Was looking for something authentic, not mass-produced, and found it here.",
    "The energy report recommendation led me to this perfect choice.",
    "Consulted with the energy analysis service first, which guided my decision.",
    "After receiving my personalized energy report, I knew this was meant for me.",
    "The fortune analysis suggested this would align with my energy field."
  ],
  
  // 商品质量
  quality: [
    "The craftsmanship is absolutely exquisite - you can feel the quality immediately.",
    "Beautiful attention to detail, clearly made with care and intention.",
    "The materials feel premium and authentic, not cheap at all.",
    "Packaging was elegant and protective, arrived in perfect condition.",
    "The weight and texture feel substantial and genuine.",
    "You can tell this was consecrated with proper rituals, the energy is palpable.",
    "The intricate details show true artisan craftsmanship.",
    "Feels like a genuine sacred object, not a commercial product.",
    "The quality exceeds my expectations - worth every penny.",
    "Beautifully crafted with traditional techniques.",
    "The consecration certificate adds authenticity (though the energy speaks for itself).",
    "Arrived well-packaged with care instructions in multiple languages.",
    "The gold/silver accents are genuine and beautifully applied.",
    "Can feel the positive energy radiating from it immediately upon opening.",
    "The blessing from Wutai Mountain masters is evident in its aura."
  ],
  
  // 佩戴效果 - 事业
  career: [
    "Within 3 weeks of wearing this, I got promoted at work!",
    "My boss noticed my improved performance and gave me a raise.",
    "Closed a major deal that had been stalling for months.",
    "Job interview went amazingly well - got the offer the next day!",
    "My career has taken off since I started wearing this daily.",
    "Colleagues have commented on my increased confidence and presence.",
    "Finally got the recognition I deserved at work.",
    "Business opportunities started appearing out of nowhere.",
    "My professional network expanded significantly in just 2 months.",
    "Landed my dream job after wearing this to the interview.",
    "Work relationships improved dramatically - even difficult colleagues became cooperative.",
    "My productivity and focus at work increased noticeably.",
    "Got headhunted for a better position with 30% salary increase!",
    "Project that was failing suddenly turned around and became a huge success.",
    "My leadership skills improved and team performance soared."
  ],
  
  // 佩戴效果 - 学业
  academic: [
    "My exam scores improved by 15% since wearing this!",
    "Finally passed that difficult certification exam on my third try.",
    "My concentration during study sessions has doubled.",
    "Thesis defense went perfectly - committee was very impressed.",
    "Got accepted into my top choice graduate program!",
    "My memory retention improved significantly.",
    "Won a scholarship I'd been hoping for.",
    "Grades went from B average to straight A's.",
    "My research paper got published in a prestigious journal.",
    "Studying feels easier and more natural now.",
    "Test anxiety completely disappeared.",
    "My professor commented on my remarkable improvement.",
    "Finally understanding complex concepts that used to confuse me.",
    "Got the highest score in my class on the final exam.",
    "My academic confidence has soared since wearing this."
  ],
  
  // 佩戴效果 - 财运
  wealth: [
    "Received an unexpected bonus at work within a month!",
    "My investments started performing better than ever.",
    "Won a small lottery prize - first time ever!",
    "Got a surprise inheritance from a distant relative.",
    "My side business income doubled in 6 weeks.",
    "Debt that seemed impossible to pay off is now manageable.",
    "Found money-saving opportunities everywhere.",
    "My financial stress has significantly decreased.",
    "Received unexpected refunds and rebates.",
    "Business clients started paying on time (finally!).",
    "My savings account is growing steadily for the first time.",
    "Got a lucrative freelance contract out of the blue.",
    "Property value increased more than expected.",
    "Received a generous gift from family.",
    "Financial obstacles that blocked me for years suddenly cleared."
  ],
  
  // 佩戴效果 - 感情
  relationship: [
    "My relationship with my partner has never been better.",
    "Met someone special shortly after I started wearing this.",
    "Family conflicts that lasted years finally resolved.",
    "My social life improved dramatically - making genuine connections.",
    "Toxic relationships naturally faded away.",
    "Found the courage to express my feelings and it worked out beautifully.",
    "My marriage feels like the honeymoon phase again.",
    "Attracted positive, supportive people into my life.",
    "Old friendships rekindled in meaningful ways.",
    "My children and I communicate better than ever.",
    "Met my soulmate at an unexpected place.",
    "Difficult family members became more understanding.",
    "My confidence in relationships increased significantly.",
    "People seem more drawn to my energy now.",
    "Found the love and acceptance I'd been seeking."
  ],
  
  // 佩戴效果 - 健康
  health: [
    "My chronic headaches have significantly reduced.",
    "Sleeping better than I have in years.",
    "Energy levels are through the roof!",
    "Anxiety that plagued me for months has lifted.",
    "My immune system seems stronger - haven't been sick once.",
    "Chronic pain that doctors couldn't explain has diminished.",
    "Feel more balanced and centered emotionally.",
    "My stress levels dropped dramatically.",
    "Physical vitality I haven't felt since my twenties.",
    "Mental fog cleared completely.",
    "My meditation practice deepened significantly.",
    "Feel more grounded and present in my body.",
    "Digestive issues that bothered me for years improved.",
    "My overall well-being has transformed.",
    "Feel protected from negative energies that used to drain me."
  ],
  
  // 感谢东方智慧
  gratitude: [
    "Deeply grateful for the ancient Eastern wisdom preserved in this tradition.",
    "The power of Wutai Mountain's spiritual heritage is real and profound.",
    "Thank you for bringing authentic Eastern practices to the Western world.",
    "This connects me to thousands of years of spiritual knowledge.",
    "The wisdom of the East has transformed my Western mindset.",
    "Honored to carry a piece of sacred Wutai Mountain energy with me.",
    "Eastern spiritual traditions hold truths we've forgotten in the West.",
    "The consecration by genuine masters makes all the difference.",
    "Grateful to the monks of Wutai Mountain for their blessings.",
    "This ancient wisdom is exactly what modern life is missing.",
    "The spiritual power of Eastern traditions is undeniable.",
    "Thank you for preserving and sharing these sacred practices.",
    "Eastern philosophy has brought balance to my hectic Western lifestyle.",
    "The energy of Manjushri Bodhisattva is palpable in this.",
    "Grateful for the bridge between Eastern wisdom and Western seekers."
  ],
  
  // 感谢能量报告
  energyReport: [
    "The personalized energy analysis report was incredibly accurate!",
    "Following the recommendations from my energy report led me to this perfect match.",
    "The fortune analysis helped me understand which item would suit me best.",
    "Grateful for the detailed energy assessment that guided my choice.",
    "The report's insights were spot-on and led me to exactly what I needed.",
    "Combining the energy report with this item created powerful synergy.",
    "The analysis explained why I was drawn to this particular piece.",
    "My energy report predicted this would bring positive changes - it was right!",
    "The personalized guidance made all the difference in my selection.",
    "The energy analysis service is worth it - highly recommend getting one first.",
    "Following my report's advice, this item aligned perfectly with my energy field.",
    "The detailed reading helped me understand how to maximize this item's benefits.",
    "Grateful for the professional energy assessment that led me here.",
    "The report's recommendations were transformative when paired with this.",
    "This purchase made so much more sense after reading my energy analysis."
  ],
  
  // 复评(追踪评价)
  followUp: [
    "UPDATE after 4 weeks: The effects keep getting stronger!",
    "Coming back to update - this has been life-changing.",
    "2 months later: Still amazed by the continuous positive changes.",
    "Update: Everything I hoped for has manifested and more.",
    "Following up after 6 weeks - the transformation is real.",
    "Updating my review because the long-term effects are even better.",
    "3 months in: This is now an essential part of my daily life.",
    "Returning to share that the benefits are lasting and growing.",
    "Update after 8 weeks: My life has completely turned around.",
    "Coming back to emphasize - this is not a placebo effect.",
    "Long-term update: The positive changes have become my new normal.",
    "2 months later and I'm still discovering new benefits.",
    "Update: Recommended this to 5 friends and they're all seeing results too.",
    "Following up to say the initial effects were just the beginning.",
    "Months later: This remains the best spiritual investment I've made."
  ],
  
  // 推荐
  recommendation: [
    "Highly recommend to anyone seeking authentic spiritual support.",
    "If you're on the fence, just try it - you won't regret it.",
    "This is the real deal, not like the cheap imitations out there.",
    "Perfect for anyone interested in Eastern spirituality.",
    "Already bought two more as gifts for family.",
    "Tell everyone about this - too good not to share.",
    "Worth every cent and more.",
    "Don't hesitate - this could change your life like it changed mine.",
    "The best spiritual item I've ever purchased.",
    "Will definitely be ordering more from this shop.",
    "Recommend starting with the energy analysis, then choosing your item.",
    "Perfect for both beginners and experienced practitioners.",
    "This shop is now my go-to for authentic consecrated items.",
    "Buying another one for my best friend's birthday.",
    "Five stars isn't enough - this deserves ten!"
  ]
};

// 中文评价片段
const reviewFragments_ZH = {
  decision: [
    "一开始半信半疑,但看了那么多好评后决定试试。",
    "犹豫了好几周才下单,现在真的很庆幸自己买了!",
    "做了很多功课,对比了好多家,最后选择了这里。",
    "朋友推荐的,看到她的变化后我也忍不住买了。",
    "研究了很久东方灵性文化,觉得这家最正宗。",
    "看到五台山开光的介绍就被吸引了。",
    "对比了很多商家,这家的开光仪式最正规。",
    "能量报告推荐我选这个,果然很准。",
    "根据命理分析的建议购买的,非常适合我。",
    "看了能量运势报告后,知道这个最适合自己。"
  ],
  
  quality: [
    "做工非常精致,一看就是用心制作的。",
    "材质很好,拿在手里很有分量。",
    "包装很用心,收到时完好无损。",
    "能感受到开光后的能量,不是普通商品。",
    "细节处理得很到位,值得这个价格。",
    "五台山大师开光的,能量确实不一样。",
    "做工精良,传统工艺,不是流水线产品。",
    "材质很正,不是那种廉价货。",
    "包装精美,送礼也很有面子。",
    "收到就能感觉到正能量。"
  ],
  
  career: [
    "戴了三周就升职了,太神奇了!",
    "工作上的阻碍突然都消失了。",
    "谈了好久的项目终于签下来了。",
    "面试特别顺利,第二天就收到offer。",
    "同事都说我最近气场变强了。",
    "业绩突飞猛进,领导都注意到了。",
    "工作中的贵人运明显增强。",
    "困扰很久的工作难题突然有了解决方案。",
    "职场人际关系改善了很多。",
    "事业运真的提升了,机会变多了。"
  ],
  
  academic: [
    "考试成绩提高了15分!",
    "终于通过了那个难考的证书考试。",
    "学习效率明显提高,专注力增强。",
    "论文答辩非常顺利,导师很满意。",
    "考上了理想的研究生院校。",
    "记忆力变好了,背书轻松多了。",
    "拿到了奖学金,太开心了。",
    "成绩从中等提升到班级前三。",
    "考试焦虑症消失了。",
    "学业上的压力减轻了很多。"
  ],
  
  wealth: [
    "一个月内就收到了意外奖金!",
    "投资收益比以前好很多。",
    "中了小奖,虽然不多但很开心。",
    "生意突然好起来了,订单增多。",
    "财务压力明显减轻。",
    "偏财运增强,总有意外收入。",
    "欠款终于要回来了。",
    "存款增长速度比以前快。",
    "理财收益稳步提升。",
    "财运真的改善了,不再为钱发愁。"
  ],
  
  relationship: [
    "和伴侣的关系变得更好了。",
    "戴上后不久就遇到了心仪的人。",
    "家庭矛盾神奇地化解了。",
    "人际关系明显改善,贵人增多。",
    "负能量的人自然远离了。",
    "感情运势提升,桃花运变好。",
    "和家人的沟通顺畅了很多。",
    "朋友关系更加和谐。",
    "遇到了对的人,很感恩。",
    "人缘变好了,朋友都说我气场不一样。"
  ],
  
  health: [
    "长期头痛明显减轻了。",
    "睡眠质量提高,不再失眠。",
    "精力充沛,不像以前那么累。",
    "焦虑情绪减少了很多。",
    "免疫力增强,很少生病了。",
    "慢性疼痛缓解了。",
    "情绪更加稳定平和。",
    "压力释放了,心情舒畅。",
    "身体状态明显好转。",
    "感觉被正能量包围,负能量减少。"
  ],
  
  gratitude: [
    "感恩东方古老智慧的力量。",
    "五台山的灵气真的很强大。",
    "感谢传统文化的传承和保护。",
    "东方智慧博大精深,值得敬畏。",
    "感恩大师的加持和祝福。",
    "传统文化的力量不可小觑。",
    "感谢五台山文殊菩萨的护佑。",
    "东方灵性文化确实有其独特之处。",
    "感恩能接触到正宗的开光法物。",
    "古人的智慧值得我们学习和传承。"
  ],
  
  energyReport: [
    "能量运势报告非常准确!",
    "根据报告推荐购买的,很适合我。",
    "命理分析帮我选对了商品。",
    "感谢详细的能量分析指导。",
    "报告的建议很中肯,跟着买准没错。",
    "配合能量报告使用,效果加倍。",
    "报告解释了为什么我适合这个。",
    "能量分析服务很专业,值得信赖。",
    "先看报告再买,选择更精准。",
    "报告推荐的商品确实最适合我的能量场。"
  ],
  
  followUp: [
    "回来更新:戴了4周效果越来越明显!",
    "使用两个月后回来更新,真的改变了很多。",
    "追评:效果持续稳定,没有减弱。",
    "更新一下,长期效果比预期更好。",
    "3个月后回来说,这是我买过最值的东西。",
    "追加评价:推荐给朋友,他们也都说好。",
    "回购了,送给家人。",
    "长期使用后发现,效果是累积的。",
    "更新:现在已经成为我的日常必备。",
    "追评:感谢当初的决定,改变了我的生活。"
  ],
  
  recommendation: [
    "强烈推荐给有缘人。",
    "犹豫的话就试试,不会后悔。",
    "这是真正开过光的,不是普通商品。",
    "适合对东方文化感兴趣的朋友。",
    "已经买了好几个送人了。",
    "值得推荐,物超所值。",
    "不要犹豫,可能会改变你的人生。",
    "我买过最好的灵性物品。",
    "还会继续光顾这家店。",
    "建议先做能量分析,再选购商品。"
  ]
};

// 德语、法语、意大利语、西班牙语评价片段(完整版)
const reviewFragments_DE = {
  decision: ["Ich war zunächst skeptisch, aber die vielen positiven Bewertungen haben mich überzeugt.", "Nach langer Recherche habe ich mich für dieses Produkt entschieden.", "Meine Freundin hat es empfohlen und ich bin so froh, dass ich es gekauft habe."],
  quality: ["Die Handwerkskunst ist exquisit, man spürt sofort die Qualität.", "Wunderschöne Details, eindeutig mit Sorgfalt gefertigt.", "Die Materialien fühlen sich hochwertig und authentisch an."],
  career: ["Innerhalb von 3 Wochen wurde ich befördert!", "Mein Chef hat meine verbesserte Leistung bemerkt.", "Meine Karriere hat seit dem Tragen einen Aufschwung erlebt."],
  academic: ["Meine Prüfungsergebnisse haben sich deutlich verbessert.", "Endlich die schwierige Zertifizierungsprüfung bestanden.", "Meine Konzentration beim Lernen hat sich verdoppelt."],
  wealth: ["Unerwarteten Bonus bei der Arbeit erhalten!", "Meine Investitionen entwickeln sich besser als je zuvor.", "Finanzielle Belastung hat deutlich nachgelassen."],
  relationship: ["Meine Beziehung zu meinem Partner war noch nie besser.", "Kurz nachdem ich das trug, traf ich jemand Besonderen.", "Familienkonflikte wurden endlich gelöst."],
  health: ["Meine chronischen Kopfschmerzen haben deutlich nachgelassen.", "Schlafe besser als seit Jahren.", "Energieniveau ist durch die Decke!"],
  gratitude: ["Dankbar für die alte östliche Weisheit.", "Die spirituelle Kraft der östlichen Traditionen ist unbestreitbar.", "Danke für die Bewahrung dieser heiligen Praktiken."],
  energyReport: ["Die personalisierte Energieanalyse war unglaublich genau!", "Den Empfehlungen aus meinem Energiebericht gefolgt.", "Die Analyse hat mir geholfen, das richtige Produkt zu wählen."],
  followUp: ["UPDATE nach 4 Wochen: Die Effekte werden stärker!", "Komme zurück, um zu aktualisieren - das hat mein Leben verändert.", "2 Monate später: Immer noch erstaunt über die positiven Veränderungen."],
  recommendation: ["Sehr empfehlenswert für jeden, der authentische spirituelle Unterstützung sucht.", "Das ist echt, nicht wie die billigen Nachahmungen.", "Jeden Cent wert und mehr."]
};

const reviewFragments_FR = {
  decision: ["J'étais sceptique au début, mais après avoir lu tant d'avis positifs, j'ai décidé d'essayer.", "Après des semaines d'hésitation, je suis si content de l'avoir finalement acheté!", "Mon ami me l'a recommandé et après avoir vu ses résultats, je devais l'essayer moi-même."],
  quality: ["L'artisanat est absolument exquis - on sent immédiatement la qualité.", "Belle attention aux détails, clairement fait avec soin et intention.", "Les matériaux semblent premium et authentiques."],
  career: ["En 3 semaines, j'ai été promu au travail!", "Mon patron a remarqué mon amélioration et m'a donné une augmentation.", "Ma carrière a décollé depuis que je porte ceci quotidiennement."],
  academic: ["Mes résultats d'examen se sont améliorés de 15%!", "Enfin réussi cet examen de certification difficile.", "Ma concentration pendant les sessions d'étude a doublé."],
  wealth: ["Reçu un bonus inattendu au travail en un mois!", "Mes investissements ont commencé à mieux performer que jamais.", "Mon stress financier a considérablement diminué."],
  relationship: ["Ma relation avec mon partenaire n'a jamais été meilleure.", "Rencontré quelqu'un de spécial peu après avoir commencé à porter ceci.", "Les conflits familiaux qui duraient depuis des années se sont enfin résolus."],
  health: ["Mes maux de tête chroniques ont considérablement diminué.", "Je dors mieux que depuis des années.", "Mes niveaux d'énergie sont au top!"],
  gratitude: ["Profondément reconnaissant pour l'ancienne sagesse orientale.", "Le pouvoir du patrimoine spirituel de Wutai Mountain est réel.", "Merci de préserver et partager ces pratiques sacrées."],
  energyReport: ["L'analyse énergétique personnalisée était incroyablement précise!", "Suivre les recommandations de mon rapport énergétique m'a conduit à ce choix parfait.", "L'analyse m'a aidé à comprendre quel article me conviendrait le mieux."],
  followUp: ["MISE À JOUR après 4 semaines: Les effets continuent de s'intensifier!", "Je reviens pour mettre à jour - cela a changé ma vie.", "2 mois plus tard: Toujours étonné par les changements positifs continus."],
  recommendation: ["Hautement recommandé à quiconque cherche un soutien spirituel authentique.", "C'est la vraie affaire, pas comme les imitations bon marché.", "Vaut chaque centime et plus."]
};

const reviewFragments_IT = {
  decision: ["Ero scettico all'inizio, ma dopo aver letto tante recensioni positive, ho deciso di provare.", "Ho esitato per settimane prima di acquistare, ma sono così felice di averlo fatto!", "Il mio amico me l'ha raccomandato e dopo aver visto i suoi risultati, dovevo provarlo anch'io."],
  quality: ["L'artigianato è assolutamente squisito - si sente immediatamente la qualità.", "Bellissima attenzione ai dettagli, chiaramente fatto con cura e intenzione.", "I materiali sembrano premium e autentici."],
  career: ["Entro 3 settimane sono stato promosso al lavoro!", "Il mio capo ha notato il mio miglioramento e mi ha dato un aumento.", "La mia carriera è decollata da quando indosso questo quotidianamente."],
  academic: ["I miei voti agli esami sono migliorati del 15%!", "Finalmente superato quell'esame di certificazione difficile.", "La mia concentrazione durante le sessioni di studio è raddoppiata."],
  wealth: ["Ricevuto un bonus inaspettato al lavoro entro un mese!", "I miei investimenti hanno iniziato a performare meglio che mai.", "Il mio stress finanziario è diminuito significativamente."],
  relationship: ["La mia relazione con il mio partner non è mai stata migliore.", "Ho incontrato qualcuno di speciale poco dopo aver iniziato a indossare questo.", "I conflitti familiari che duravano da anni si sono finalmente risolti."],
  health: ["I miei mal di testa cronici sono diminuiti significativamente.", "Dormo meglio di quanto abbia fatto negli anni.", "I miei livelli di energia sono alle stelle!"],
  gratitude: ["Profondamente grato per l'antica saggezza orientale.", "Il potere del patrimonio spirituale di Wutai Mountain è reale.", "Grazie per preservare e condividere queste pratiche sacre."],
  energyReport: ["L'analisi energetica personalizzata era incredibilmente accurata!", "Seguendo le raccomandazioni del mio rapporto energetico sono arrivato a questa scelta perfetta.", "L'analisi mi ha aiutato a capire quale articolo sarebbe stato più adatto a me."],
  followUp: ["AGGIORNAMENTO dopo 4 settimane: Gli effetti continuano a rafforzarsi!", "Torno per aggiornare - questo ha cambiato la mia vita.", "2 mesi dopo: Ancora stupito dai cambiamenti positivi continui."],
  recommendation: ["Altamente raccomandato a chiunque cerchi supporto spirituale autentico.", "Questo è quello vero, non come le imitazioni economiche.", "Vale ogni centesimo e oltre."]
};

const reviewFragments_ES = {
  decision: ["Era escéptico al principio, pero después de leer tantas reseñas positivas, decidí probarlo.", "Dudé durante semanas antes de comprar, ¡pero estoy tan contento de haberlo hecho finalmente!", "Mi amigo me lo recomendó y después de ver sus resultados, tuve que probarlo yo mismo."],
  quality: ["La artesanía es absolutamente exquisita - se siente la calidad inmediatamente.", "Hermosa atención al detalle, claramente hecho con cuidado e intención.", "Los materiales se sienten premium y auténticos."],
  career: ["¡En 3 semanas fui promovido en el trabajo!", "Mi jefe notó mi mejora y me dio un aumento.", "Mi carrera ha despegado desde que uso esto diariamente."],
  academic: ["¡Mis calificaciones de examen mejoraron un 15%!", "Finalmente aprobé ese difícil examen de certificación.", "Mi concentración durante las sesiones de estudio se ha duplicado."],
  wealth: ["¡Recibí un bono inesperado en el trabajo en un mes!", "Mis inversiones comenzaron a rendir mejor que nunca.", "Mi estrés financiero ha disminuido significativamente."],
  relationship: ["Mi relación con mi pareja nunca ha sido mejor.", "Conocí a alguien especial poco después de empezar a usar esto.", "Los conflictos familiares que duraron años finalmente se resolvieron."],
  health: ["Mis dolores de cabeza crónicos han disminuido significativamente.", "Duermo mejor de lo que he dormido en años.", "¡Mis niveles de energía están por las nubes!"],
  gratitude: ["Profundamente agradecido por la antigua sabiduría oriental.", "El poder del patrimonio espiritual de Wutai Mountain es real.", "Gracias por preservar y compartir estas prácticas sagradas."],
  energyReport: ["¡El análisis de energía personalizado fue increíblemente preciso!", "Siguiendo las recomendaciones de mi informe de energía llegué a esta elección perfecta.", "El análisis me ayudó a entender qué artículo sería mejor para mí."],
  followUp: ["ACTUALIZACIÓN después de 4 semanas: ¡Los efectos siguen fortaleciéndose!", "Vuelvo para actualizar - esto ha cambiado mi vida.", "2 meses después: Todavía asombrado por los cambios positivos continuos."],
  recommendation: ["Altamente recomendado para cualquiera que busque apoyo espiritual auténtico.", "Esto es lo real, no como las imitaciones baratas.", "Vale cada centavo y más."]
};

// 生成随机评价内容
function generateReviewContent(language, isFollowUp = false) {
  let fragments;
  
  switch (language) {
    case 'zh':
      fragments = reviewFragments_ZH;
      break;
    case 'de':
      fragments = reviewFragments_DE;
      break;
    case 'fr':
      fragments = reviewFragments_FR;
      break;
    case 'it':
      fragments = reviewFragments_IT;
      break;
    case 'es':
      fragments = reviewFragments_ES;
      break;
    default:
      fragments = reviewFragments_EN;
  }
  
  const parts = [];
  
  if (isFollowUp) {
    // 复评内容
    if (fragments.followUp && Math.random() > 0.3) {
      parts.push(fragments.followUp[Math.floor(Math.random() * fragments.followUp.length)]);
    }
  } else {
    // 初次评价 - 购买决策
    if (fragments.decision && Math.random() > 0.6) {
      parts.push(fragments.decision[Math.floor(Math.random() * fragments.decision.length)]);
    }
  }
  
  // 商品质量(60%概率)
  if (fragments.quality && Math.random() > 0.4) {
    parts.push(fragments.quality[Math.floor(Math.random() * fragments.quality.length)]);
  }
  
  // 佩戴效果(80%概率) - 随机选择一个类别
  const effectCategories = ['career', 'academic', 'wealth', 'relationship', 'health'];
  if (Math.random() > 0.2) {
    const category = effectCategories[Math.floor(Math.random() * effectCategories.length)];
    if (fragments[category]) {
      parts.push(fragments[category][Math.floor(Math.random() * fragments[category].length)]);
    }
  }
  
  // 感谢东方智慧(40%概率)
  if (fragments.gratitude && Math.random() > 0.6) {
    parts.push(fragments.gratitude[Math.floor(Math.random() * fragments.gratitude.length)]);
  }
  
  // 感谢能量报告(20%概率)
  if (fragments.energyReport && Math.random() > 0.8) {
    parts.push(fragments.energyReport[Math.floor(Math.random() * fragments.energyReport.length)]);
  }
  
  // 推荐(50%概率)
  if (fragments.recommendation && Math.random() > 0.5) {
    parts.push(fragments.recommendation[Math.floor(Math.random() * fragments.recommendation.length)]);
  }
  
  // 确保至少有一个片段(保底)
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

// ============ 主生成逻辑 ============

async function generateReviewsForProduct(product) {
  const productId = product.id;
  const productName = product.name;
  
  // 随机生成评价数量(12800-18888)
  const reviewCount = Math.floor(Math.random() * (18888 - 12800 + 1)) + 12800;
  
  console.log(`\n🎯 Generating ${reviewCount} reviews for product: ${productName} (ID: ${productId})`);
  
  // 地区分布
  const regions = [
    { code: 'UK', weight: 0.35, lang: 'en' },
    { code: 'DE', weight: 0.10, lang: 'de' },
    { code: 'FR', weight: 0.10, lang: 'fr' },
    { code: 'IT', weight: 0.05, lang: 'it' },
    { code: 'ES', weight: 0.05, lang: 'es' },
    { code: 'CN', weight: 0.15, lang: 'zh' },
    { code: 'US', weight: 0.15, lang: 'en' },
    { code: 'SG', weight: 0.03, lang: 'en' },
    { code: 'AU', weight: 0.02, lang: 'en' }
  ];
  
  // 评分分布
  const ratingDistribution = [
    { rating: 5, weight: 0.75 },
    { rating: 4, weight: 0.20 },
    { rating: 3, weight: 0.05 }
  ];
  
  const usedNames = new Set();
  const batchSize = 500; // 每批插入500条
  let insertedCount = 0;
  
  for (let i = 0; i < reviewCount; i += batchSize) {
    const batch = [];
    const currentBatchSize = Math.min(batchSize, reviewCount - i);
    
    for (let j = 0; j < currentBatchSize; j++) {
      // 选择地区
      const rand = Math.random();
      let cumWeight = 0;
      let selectedRegion = regions[0];
      
      for (const region of regions) {
        cumWeight += region.weight;
        if (rand <= cumWeight) {
          selectedRegion = region;
          break;
        }
      }
      
      // 选择评分
      const ratingRand = Math.random();
      let ratingCumWeight = 0;
      let selectedRating = 5;
      
      for (const ratingOption of ratingDistribution) {
        ratingCumWeight += ratingOption.weight;
        if (ratingRand <= ratingCumWeight) {
          selectedRating = ratingOption.rating;
          break;
        }
      }
      
      // 是否为复评(50%)
      const isFollowUp = Math.random() > 0.5;
      
      // 生成评价数据
      const userName = generateRandomName(selectedRegion.code, usedNames);
      const userIP = generateIP(selectedRegion.code);
      const location = locations[selectedRegion.code][Math.floor(Math.random() * locations[selectedRegion.code].length)];
      const content = generateReviewContent(selectedRegion.lang, isFollowUp);
      
      // 生成随机时间(2025-06-01 到 2026-02-19)
      const startDate = new Date('2025-06-01').getTime();
      const endDate = new Date('2026-02-19').getTime();
      const randomTime = new Date(startDate + Math.random() * (endDate - startDate));
      
      batch.push({
        productId,
        userId: null,
        userName,
        rating: selectedRating,
        comment: content,  // 字段名是comment而不是content
        ipAddress: userIP,  // 字段名是ipAddress而不是userIP
        location,
        isVerified: true,
        createdAt: randomTime
      });
    }
    
    // 批量插入
    await db.insert(schema.reviews).values(batch);
    insertedCount += batch.length;
    
    const progress = ((insertedCount / reviewCount) * 100).toFixed(1);
    console.log(`  ✓ Progress: ${insertedCount}/${reviewCount} (${progress}%)`);
  }
  
  console.log(`✅ Completed: ${productName} - ${insertedCount} reviews generated`);
}

// ============ 执行 ============

async function main() {
  try {
    console.log('🚀 Starting ultra-realistic review generation...\n');
    
    // 获取所有商品
    const products = await db.select().from(schema.products);
    console.log(`📦 Found ${products.length} products\n`);
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`\n[${i + 1}/${products.length}] Processing: ${product.name}`);
      
      await generateReviewsForProduct(product);
    }
    
    console.log('\n\n🎉 All reviews generated successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
    process.exit(0);
  }
}

main();
