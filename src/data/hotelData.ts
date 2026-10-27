export interface RoomType {
  id: string;
  name: string;
  englishName: string;
  category: '雙人浪漫' | '家庭閣樓' | '尊榮套房' | '毛孩別墅';
  sizePing: number;
  sizeSqm: number;
  beds: string;
  bedOptions: string[];
  maxGuests: number;
  view: string;
  dockZone: string;
  basePrice: number;
  weekendPrice: number;
  remainingRooms: number;
  image: string;
  secondaryImage: string;
  shortDesc: string;
  longDesc: string;
  highlights: string[];
  amenities: string[];
  floorPlanSpecs: {
    indoorPing: string;
    balconyPing: string;
    ceilingHeight: string;
    bathType: string;
  };
}

export interface RatePackage {
  id: string;
  name: string;
  subtitle: string;
  priceMultiplier: number;
  perks: string[];
  cancellationPolicy: string;
}

export interface AddonExperience {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  duration: string;
  description: string;
}

export interface FacilityItem {
  id: string;
  indexNumber: string;
  name: string;
  englishName: string;
  category: '運河水岸' | '自然生態' | '身心療癒' | '美饌饗宴' | '寵物友善';
  openHours: string;
  locationZone: string;
  priceNote: string;
  image: string;
  summary: string;
  details: string[];
  highlightsMetric: string;
}

export interface AttractionItem {
  id: string;
  name: string;
  englishName: string;
  category: '自然生態' | '人文歷史' | '山海冒險';
  driveMinutes: number;
  distanceKm: number;
  bestTime: string;
  shuttleInfo: string;
  coordinates: { x: number; y: number }; // Percentage coordinates for interactive valley map
  image: string;
  description: string;
  recommendedDuration: string;
  highlights: string[];
}

export interface BookingRecord {
  bookingId: string;
  createdAt: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  pets: number;
  roomId: string;
  roomName: string;
  roomCount: number;
  bedChoice: string;
  packageId: string;
  packageName: string;
  addons: { id: string; name: string; quantity: number; price: number }[];
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  arrivalTime: string;
  shuttleSlot: string;
  specialRequests: string[];
  customNote: string;
  paymentMethod: 'credit_card' | 'line_pay' | 'apple_pay' | 'travel_card' | 'atm_transfer' | 'hotel_pay';
  paymentMethodLabel: string;
  paymentStatus: '已付款確認' | '待匯款保留' | '信用卡擔保確認';
  roomSubtotal: number;
  addonsTotal: number;
  taxAndService: number;
  discountAmount: number;
  totalAmount: number;
  promoCodeUsed?: string;
}

export const IMAGES = {
  heroLagoon: '/src/assets/images/hero_lagoon_resort_1790663406243.jpg',
  roomHoneymoon: '/src/assets/images/room_honeymoon_suite_1790663425123.jpg',
  roomAttic: '/src/assets/images/room_attic_family_suite_1790663443054.jpg',
  facilityParkSpa: '/src/assets/images/facility_ecological_park_spa_1790663454819.jpg',
  attractionCoast: '/src/assets/images/attraction_hualien_coast_lake_1790663466979.jpg',
};

export const ROOMS: RoomType[] = [
  {
    id: 'flamenco-deluxe',
    name: '佛朗明哥豪華客房',
    englishName: 'Flamenco Lagoon Deluxe Room',
    category: '雙人浪漫',
    sizePing: 15,
    sizeSqm: 50,
    beds: '一大床 (200×200cm) 或 二中床 (150×200cm)',
    bedOptions: ['一大床 (King Size 200×200cm)', '二中床 (Double Queen 150×200cm × 2)'],
    maxGuests: 4,
    view: '應許運河河道與中央山脈嵐景',
    dockZone: '3號碼頭 · 佛朗明哥島區',
    basePrice: 7600,
    weekendPrice: 9200,
    remainingRooms: 5,
    image: IMAGES.roomHoneymoon,
    secondaryImage: IMAGES.heroLagoon,
    shortDesc: '15坪寬敞西班牙安達魯西亞風格空間，推開鍛鐵拱門即擁抱翠綠運河水色與縱谷晨曦。',
    longDesc:
      '靈感源自西班牙南部的熱情與質樸，客房內鋪設手工復古紅磚地坪，搭配百年榆木手工雕花書桌與藤編單椅。每間皆配置獨立親水觀景陽台，清晨可聆聽應許運河緩緩流動的水聲與鳥鳴。',
    highlights: [
      '獨立河景鍛鐵陽台，正對應許運河主航道',
      '乾濕分離手工磁磚衛浴與深浸式景觀浴缸',
      '英國百年皇室認證斯林百蘭 (Slumberland) 訂製名床',
      '免費享用房內迎賓花蓮蜜香紅茶與手工窯烤餅乾',
    ],
    amenities: [
      '55吋 4K 智慧聯網電視',
      'Nespresso 膠囊咖啡機',
      '豐之谷有機澳洲茶樹沐浴組',
      '高速 Wi-Fi 6 無線網路',
      'Dyson 吹風機',
      '獨立恆溫空調與除濕系統',
      '專屬保險箱與靜音冰箱',
      '純棉浴袍與編織海灘拖鞋',
    ],
    floorPlanSpecs: {
      indoorPing: '12.5 坪室內起居',
      balconyPing: '2.5 坪親水觀景陽台',
      ceilingHeight: '3.4 米挑高木樑',
      bathType: '獨立泡澡浴缸 + 雨林花灑淋浴間',
    },
  },
  {
    id: 'isabella-honeymoon',
    name: '伊莎貝拉蜜月套房',
    englishName: 'Isabella Romantic Canopy Suite',
    category: '雙人浪漫',
    sizePing: 20,
    sizeSqm: 66,
    beds: '四柱麻繩帳幔皇家大床 (210×210cm)',
    bedOptions: ['四柱麻繩帳幔皇家大床 (210×210cm)'],
    maxGuests: 2,
    view: '靜謐曲水灣道與拱橋夕照',
    dockZone: '5號碼頭 · 伊莎貝拉島區',
    basePrice: 9800,
    weekendPrice: 11600,
    remainingRooms: 3,
    image: IMAGES.roomHoneymoon,
    secondaryImage: IMAGES.facilityParkSpa,
    shortDesc: '20坪浪漫私密殿堂，手工四柱實木帳幔大床與雙人玫瑰鹽泉浴池，專為情侶與紀念日打造。',
    longDesc:
      '以西班牙伊莎貝拉女王時期的古典美學打造，純白亞麻紗幔隨微風輕拂，營造靜謐奢華的渡假氛圍。配備超大面寬河畔露台與半露天觀景泡澡池，夜晚可伴隨星光與河面倒影小酌。',
    highlights: [
      '手工四柱實木麻繩帳幔大床，極致浪漫儀式感',
      '270度轉角親水露台，獨享運河彎道隱密視野',
      '入住贈送西班牙進口氣泡紅酒乙瓶與季節鮮果盤',
      '雙洗手台設計與景觀深浸式大理石浴缸',
    ],
    amenities: [
      'Bose 藍牙環繞音響系統',
      'Nespresso 膠囊咖啡機與手沖茶具',
      'Zen SPA 專屬茶樹精油沐浴禮盒',
      'Dyson Supersonic 吹風機',
      '55吋 4K 智慧電視',
      '免費 Mini Bar 精選飲品',
      '絲質親膚睡袍',
      '專屬碼頭優先登船禮遇',
    ],
    floorPlanSpecs: {
      indoorPing: '16.0 坪主臥與沙龍起居',
      balconyPing: '4.0 坪環景親水露台',
      ceilingHeight: '3.6 米拱型挑高',
      bathType: '雙面採光大理石浴缸 + 蒸氣淋浴間',
    },
  },
  {
    id: 'santiago-loft',
    name: '聖地牙哥經典閣樓套房',
    englishName: 'Santiago Duplex Loft Suite',
    category: '家庭閣樓',
    sizePing: 25,
    sizeSqm: 83,
    beds: '挑高樓中樓 · 二大床 (一樓180×200cm + 閣樓180×200cm)',
    bedOptions: [
      '二大床 (1F 特大床 + 2F 閣樓特大床)',
      '一大床 + 二單床 (1F 特大床 + 2F 閣樓雙單床)',
    ],
    maxGuests: 4,
    view: '雙層高空俯瞰運河全景與海岸山脈',
    dockZone: '6號碼頭 · 聖地牙哥島區',
    basePrice: 11800,
    weekendPrice: 13800,
    remainingRooms: 4,
    image: IMAGES.roomAttic,
    secondaryImage: IMAGES.heroLagoon,
    shortDesc: '25坪挑高雙層樓中樓格局，上下樓層各自擁有獨立空間與視野，是家庭與好友同遊首選。',
    longDesc:
      '採用傳統西班牙山城木造斜頂與鍛鐵旋轉階梯設計，一樓為寬敞的主臥室與客廳沙龍區，二樓閣樓則為充滿童趣與溫潤松木香氣的獨立寢區。雙層皆設有三面採光拱窗，將萬坪綠意盡收眼底。',
    highlights: [
      '5.8米挑高雙層樓中樓，上下層獨立睡眠互不干擾',
      '一樓與閣樓皆配備液晶電視與獨立空調溫控',
      '手工鍛鐵欄杆與溫潤香杉木斜頂建築工藝',
      '附贈 4 人份豐之谷生態竹筏體驗券與窯烤麵包 DIY',
    ],
    amenities: [
      '雙層獨立 55吋 4K 電視',
      '家庭號靜音雙門小冰箱',
      'Nespresso 咖啡機與溫奶消毒鍋(可預約)',
      '兒童專屬有機沐浴備品與小帳篷(可預約)',
      '乾濕分離大型家庭衛浴',
      'Dyson 吹風機',
      '高速 Wi-Fi 6 網路',
      '免費桌遊租借服務',
    ],
    floorPlanSpecs: {
      indoorPing: '15 坪一樓主空間 + 7 坪二樓閣樓',
      balconyPing: '3.0 坪河岸觀景陽台',
      ceilingHeight: '5.8 米斜頂挑高',
      bathType: '家庭式寬敞雙盥洗台 + 景觀浴缸',
    },
  },
  {
    id: 'antonio-family',
    name: '安東尼奧歡樂家庭套房',
    englishName: 'Antonio Lagoon Family Suite',
    category: '家庭閣樓',
    sizePing: 22,
    sizeSqm: 73,
    beds: '二大床 (180×200cm × 2)',
    bedOptions: ['二大床 (King Size 180×200cm × 2)'],
    maxGuests: 4,
    view: '中島泳池與親水碼頭第一排景觀',
    dockZone: '2號碼頭 · 安東尼奧島區',
    basePrice: 10400,
    weekendPrice: 12200,
    remainingRooms: 6,
    image: IMAGES.roomAttic,
    secondaryImage: IMAGES.facilityParkSpa,
    shortDesc: '22坪單層無障礙全平面寬敞空間，緊鄰中島岩洞泳池與主力碼頭，長輩與孩童出入最便利。',
    longDesc:
      '專為三代同堂與親子家庭規劃的全平面寬敞套房，免除上下樓梯負擔。走出房門步行 1 分鐘即可抵達中島親子戲水池與里拉西餐廳，房內配置大型L型沙發交誼區與雙大床。',
    highlights: [
      '全平面無高低差設計，推嬰兒車與長輩同行最安心',
      '鄰近中島親水泳池與里拉餐廳，園區動線核心位置',
      '獨立起居沙發區，適合夜晚全家歡聚品茗',
      '免費提供嬰兒床、床圍、澡盆與消毒鍋全套設備',
    ],
    amenities: [
      '65吋 4K 智慧電視',
      'Combi 蒸氣消毒鍋與溫奶器(免費預約)',
      'Nespresso 膠囊咖啡機',
      '豐之谷茶樹全家共享沐浴組',
      '乾濕分離防滑石材衛浴',
      'Dyson 吹風機',
      '迎賓花蓮在地果乾禮盒',
      '免費單車租借券 4 張',
    ],
    floorPlanSpecs: {
      indoorPing: '19.0 坪單層全平面空間',
      balconyPing: '3.0 坪花園河景陽台',
      ceilingHeight: '3.5 米挑高',
      bathType: '無障礙友善淋浴間 + 大型泡澡浴缸',
    },
  },
  {
    id: 'madrid-premier',
    name: '馬德里總理套房',
    englishName: 'Madrid Royal Premier Suite',
    category: '尊榮套房',
    sizePing: 36,
    sizeSqm: 119,
    beds: '皇家特大床 (210×210cm) + 獨立貴賓起居廳',
    bedOptions: ['皇家特大床 (210×210cm)', '皇家特大床 + 沙龍加床服務 (最多4位)'],
    maxGuests: 4,
    view: '180度大曲水湖畔與中央山脈全景',
    dockZone: '1號VIP專屬碼頭 · 馬德里尊榮島區',
    basePrice: 18800,
    weekendPrice: 21800,
    remainingRooms: 2,
    image: IMAGES.heroLagoon,
    secondaryImage: IMAGES.roomHoneymoon,
    shortDesc: '36坪歐式貴族皇家格局，設獨立客廳、餐廳、主臥及一套半衛浴，享私人碼頭專船接駁與禮賓管家。',
    longDesc:
      '匯聚高第曲線建築美學與歐洲古典貴族氣度，馬德里總理套房擁有獨立會客大廳、6人長桌餐敘空間與超大河畔觀景露台。住客享有 VIP 專屬碼頭包船遊河禮遇及全天候私人管家服務。',
    highlights: [
      '36坪旗艦格局：獨立會客廳、餐敘廳、主臥室與1.5套衛浴',
      '專屬 VIP 碼頭私人電動遊艇包船巡航乙次（含船長導覽）',
      '免費享用行政禮賓下午茶與晚間微醺 Happy Hour',
      '花蓮火車站 / 花蓮機場 免費賓士專車來回接駁',
    ],
    amenities: [
      'Bang & Olufsen 旗艦音響系統',
      '雙 65吋 OLED 4K 智慧電視',
      '雙人按摩氣泡大理石景觀浴池',
      '全套歐舒丹與茶樹雙品牌備品',
      '紅酒櫃與免費精選 Mini Bar',
      'Dyson 全系列美髮造型器',
      '專屬禮賓管家直通專線',
      '延遲退房禮遇至 13:00 (視房況)',
    ],
    floorPlanSpecs: {
      indoorPing: '30.0 坪皇家客餐廳與主臥',
      balconyPing: '6.0 坪 180度環河大露台',
      ceilingHeight: '3.8 米古典拱頂',
      bathType: '主衛雙人按摩石材浴池 + 客用獨立化妝間',
    },
  },
  {
    id: 'pet-villa-suite',
    name: '汪汪寵物別墅套房',
    englishName: 'Lagoon Pet Friendly Villa Suite',
    category: '毛孩別墅',
    sizePing: 20,
    sizeSqm: 66,
    beds: '一大床 (200×200cm) 或 二大床 + 毛孩專屬實木飛行床',
    bedOptions: [
      '一大床 + 毛孩實木床組 (適合雙人攜寵)',
      '二大床 + 毛孩實木床組 (適合家庭攜寵)',
    ],
    maxGuests: 4,
    view: '專屬寵物島區花園與獨立親水碼頭',
    dockZone: '7號寵物專屬碼頭 · 瑞穂毛孩島區',
    basePrice: 9600,
    weekendPrice: 11200,
    remainingRooms: 3,
    image: IMAGES.facilityParkSpa,
    secondaryImage: IMAGES.roomAttic,
    shortDesc: '專為毛孩家庭打造的獨立島區別墅，直通 500 坪戶外寵物草坪樂園，並享毛孩專屬電動遊船。',
    longDesc:
      '位於園區獨立靜謐島區，一樓直通專屬圍欄露台與 500 坪毛孩綠地樂園。房內全面採用防滑耐磨石材地板，貼心準備毛孩專屬實木床墊、手工鮮食迎賓禮、寵物浴袍與除臭空氣清淨機。',
    highlights: [
      '直通 500 坪戶外毛孩樂園（含寵物戲水池、涵洞與跳台）',
      '享有「毛孩專屬電動遊艇」航班，與愛犬愛貓同船遊河',
      '免費提供毛孩迎賓鮮食餐包、專屬碗架、尿布墊與寵物毛巾',
      '每房最多可攜帶 2 隻毛孩同住（已含首隻毛孩清潔費）',
    ],
    amenities: [
      'LG PuriCare 寵物版空氣清淨機',
      '毛孩專屬實木飛行床與記憶睡墊',
      '戶外專屬毛孩沖洗與吹水美容區',
      '55吋 4K 智慧電視',
      'Nespresso 膠囊咖啡機',
      'Dyson 吹風機',
      '獨立圍欄花園露台',
      '防抓耐磨西班牙進口皮革沙發',
    ],
    floorPlanSpecs: {
      indoorPing: '16.0 坪無毒防滑起居空間',
      balconyPing: '4.0 坪獨立安全圍欄私家露台',
      ceilingHeight: '3.5 米挑高',
      bathType: '乾濕分離衛浴 + 毛孩友善防滑沖洗區',
    },
  },
];

export const RATE_PACKAGES: RatePackage[] = [
  {
    id: 'pkg-bb',
    name: '一泊一食 · 晨光運河慢活專案',
    subtitle: '含里拉餐廳自助晨光早餐、應許運河遊艇巡航乙次、花蓮車站定時接駁',
    priceMultiplier: 1.0,
    perks: [
      '里拉西餐廳陽光自助早餐 (依入住人數提供)',
      '應許運河無聲電動遊艇巡航券乙次 (價值 NT$350/位)',
      '中島岩洞溫水池、親水泳池與健身房免費使用',
      '花蓮火車站定時定點免費來回接駁巴士 (需預約)',
    ],
    cancellationPolicy: '入住前 7 日可免費取消或更改日期；入住前 3 日內取消收取首晚 30% 手續費。',
  },
  {
    id: 'pkg-hb',
    name: '一泊二食 · 里拉摩爾湖畔饗宴專案',
    subtitle: '含早晚餐百匯或風味中式合菜、運河日夜雙巡航、豐之谷竹筏生態體驗',
    priceMultiplier: 1.24,
    perks: [
      '里拉西餐廳自助早餐 + 摩爾風情自助晚餐 (或風味餐廳縱谷合菜)',
      '應許運河「日景 + 星光夜景」雙次遊艇巡航禮遇',
      '豐之谷自然生態公園「湧泉竹筏生態導覽」免費體驗',
      '每房贈送花蓮在地手工窯烤麵包伴手禮乙份',
    ],
    cancellationPolicy: '入住前 7 日可免費取消；專案含餐飲席次保留，更改日期不收手續費。',
  },
  {
    id: 'pkg-all-inclusive',
    name: '全包式渡假 · 豐之谷自然生態慢旅專案',
    subtitle: '含早晚餐、迎賓午茶、窯烤麵包 DIY、Zen SPA 抵用金與館外縱谷導覽',
    priceMultiplier: 1.42,
    perks: [
      '早、晚雙饗宴 + 湖畔西班牙桑格利亞 (Sangria) 迎賓下午茶',
      '應許運河無限次搭乘電動遊艇手環',
      '豐之谷五選三體驗（竹筏、窯烤麵包、植物染、釣魚、射箭）',
      '每房贈 Zen SPA 芳療抵用金 NT$1,200 及雲山水專車半日導覽',
    ],
    cancellationPolicy: '尊榮全包式保證訂房，入住前 3 日可免費改期或全額退費。',
  },
];

export const ADDON_EXPERIENCES: AddonExperience[] = [
  {
    id: 'addon-bread-diy',
    name: '豐之谷柴燒窯烤麵包 & 茶樹精油 DIY',
    category: '自然生態體驗',
    price: 580,
    unit: '位',
    duration: '約 90 分鐘',
    description: '親手揉製花蓮有機小麥麵團，送入紅磚柴燒窯爐烘烤，並體驗現採澳洲茶樹純露萃取。',
  },
  {
    id: 'addon-lira-dinner',
    name: '里拉西餐廳 西班牙安達魯西亞百匯晚餐',
    category: '美饌加購',
    price: 1280,
    unit: '位',
    duration: '17:30 – 21:00',
    description: '品嚐正宗西班牙海鮮燉飯、現切爐烤肋眼牛排與花蓮壽豐有機小農鮮蔬百匯。',
  },
  {
    id: 'addon-zen-spa',
    name: 'Zen SPA 縱谷茶樹深層經絡芳療',
    category: '身心療癒',
    price: 2600,
    unit: '位',
    duration: '60 分鐘',
    description: '於湖畔獨立芳療別墅內，使用園區自產有機澳洲茶樹精油進行全身深層舒壓按摩。',
  },
  {
    id: 'addon-vip-shuttle',
    name: '花蓮火車站 / 機場 賓士 V-Class 專屬禮賓接駁',
    category: '尊榮交通',
    price: 1200,
    unit: '趟 (最多6人)',
    duration: '單程約 25 分鐘',
    description: '免配合定時巴士時刻，依您的列車或航班時間提供一對一專車直達飯店大廳。',
  },
  {
    id: 'addon-anniversary',
    name: '紀念日微醺佈置 (西班牙紅酒 + 鮮花花藝 + 氣球)',
    category: '專屬儀式',
    price: 1680,
    unit: '間',
    duration: '入住前佈置完成',
    description: '由禮賓團隊於您進房前完成浪漫床飾、手寫祝賀卡、精選紅酒與手工巧克力禮盒。',
  },
];

export const FACILITIES: FacilityItem[] = [
  {
    id: 'promising-lagoon',
    indexNumber: '01',
    name: '應許運河無聲電動遊艇巡航',
    englishName: '2.2km Promised Lagoon Electric Yacht Cruise',
    category: '運河水岸',
    openHours: '每日 08:30 – 21:30 (每 15–20 分鐘一班)',
    locationZone: '6號主力碼頭 · 環繞全區 7 座碼頭與 16 座橋樑',
    priceNote: '住客憑房卡免費搭乘乙次 (全包專案無限次)',
    image: IMAGES.heroLagoon,
    summary:
      '全台唯一座落於渡假飯店內的 2.2 公里人工運河，搭乘靜音環保電動遊艇，穿梭於 16 座西班牙風格鍛鐵與紅磚拱橋之間。',
    details: [
      '由國際知名水景建築團隊設計，引進中央山脈純淨地下湧泉，水質清澈見底',
      '沿途經過麥迪遜橋、習藝橋、良緣橋等 16 座各具典故的歐式橋樑與 7 座島區碼頭',
      '傍晚時分更有浪漫的「星光音樂船班」，由船長導覽建築故事與夜間生態',
    ],
    highlightsMetric: '2.2 公里環狀河道 · 7 座碼頭 · 16 座風格拱橋',
  },
  {
    id: 'ecological-park',
    indexNumber: '02',
    name: '豐之谷自然生態公園',
    englishName: 'Feng-Zhi-Gu Natural Ecological Park',
    category: '自然生態',
    openHours: '每日 08:00 – 17:30',
    locationZone: '園區東側 · 萬坪壽豐湧泉生態綠地',
    priceNote: '住客免費入園漫步 · DIY 與竹筏可單項加購',
    image: IMAGES.facilityParkSpa,
    summary:
      '佔地達 5.7 公頃的私人自然生態溼地公園，復育上百種台灣原生水生植物與鳥類，提供竹筏巡航、窯烤麵包、馬術與單車體驗。',
    details: [
      '湧泉竹筏生態導覽：撐篙漫遊天然湧泉水道，近距離觀察紅冠水雞、翠鳥與落羽松林',
      '澳洲茶樹森林與純露工坊：漫步於數千棵有機澳洲茶樹林，體驗精油蒸餾與手作植萃皂',
      '柴燒紅磚窯烤麵包：每日新鮮出爐花蓮柴燒吐司與歐式核桃麵包，香氣四溢',
    ],
    highlightsMetric: '5.7 公頃自然溼地 · 120+ 種原生動植物復育',
  },
  {
    id: 'grotto-pools',
    indexNumber: '03',
    name: '中島岩洞溫水池與親水泳池',
    englishName: 'Island Grotto Hot Spring & Lagoon Pools',
    category: '身心療癒',
    openHours: '每日 07:30 – 22:00 (全年開放溫水岩洞池)',
    locationZone: '中島休閒區 · 大島、中島、小島三區泳池',
    priceNote: '住客免費無限次使用 (附免費毛巾與更衣室)',
    image: IMAGES.facilityParkSpa,
    summary:
      '仿造大自然鐘乳石岩洞打造的半露天深海鹽泉溫水池，結合三座島區戶外景觀泳池與兒童安全戲水池。',
    details: [
      '中島岩洞溫水池全年維持 36°C–38°C 舒適水溫，晴雨皆宜，夜晚可仰望縱谷星空',
      '大島標準景觀泳池與親子滑水道戲水池，環繞棕櫚樹與陽光躺椅',
      '岸邊設有池畔吧台，提供現調鮮果汁、花蓮洛神花茶與輕食點心',
    ],
    highlightsMetric: '3 座主題島區泳池 · 38°C 岩洞溫水療癒池',
  },
  {
    id: 'zen-spa',
    indexNumber: '04',
    name: 'Zen SPA 湖畔芳療會館',
    englishName: 'Lagoon Zen Botanical SPA Sanctuary',
    category: '身心療癒',
    openHours: '每日 10:00 – 22:00 (採預約制)',
    locationZone: '5號碼頭旁 · 獨立親水芳療島屋',
    priceNote: '療程 NT$2,600 起 · 住客享 9 折禮遇',
    image: IMAGES.roomHoneymoon,
    summary:
      '隱身於運河曲水深處的獨立芳療別墅，結合東西方經絡手法與園區自產有機澳洲茶樹、玫瑰天竺葵精油。',
    details: [
      '每間芳療室皆擁有獨立河景泡澡池、蒸氣室與私人休憩露台',
      '招牌「縱谷森呼吸深層舒壓 90 分鐘」結合熱石溫敷與茶樹純露足浴',
      '療程結束後於河畔茶席享用有機花草茶與銀耳蓮子甜湯',
    ],
    highlightsMetric: '獨立河景芳療套房 · 100% 園區有機植萃精油',
  },
  {
    id: 'lira-fengwei-dining',
    indexNumber: '05',
    name: '里拉餐廳 & 風味中餐廳',
    englishName: 'Lira Mediterranean Buffet & Feng-Wei Cuisine',
    category: '美饌饗宴',
    openHours: '早餐 06:30–10:30 · 午餐 11:30–14:00 · 晚餐 17:30–21:00',
    locationZone: '3號碼頭旁 (里拉餐廳) · 接待大廳二樓 (風味餐廳)',
    priceNote: '自助早餐 NT$650+10% · 自助晚餐 NT$1,280+10%',
    image: IMAGES.roomAttic,
    summary:
      '里拉西餐廳以安達魯西亞陽光拱窗設計，提供道地西班牙料理與縱谷百匯；風味中餐廳則演繹花蓮原民山海特色私房菜。',
    details: [
      '里拉餐廳必嚐：瓦倫西亞番紅花海鮮燉飯、現切爐烤牛肉、壽豐有機無毒蔬菜吧',
      '風味中餐廳招牌：花蓮放山玉米雞、立川黃金蜆精湯、刺蔥鹽烤太平洋鮮魚',
      '全面採用花蓮壽豐、吉安在地契約小農每日直送食材，實踐低碳從產地到餐桌',
    ],
    highlightsMetric: '2 大主題景觀餐廳 · 80% 花蓮在地小農直送食材',
  },
  {
    id: 'pet-island-park',
    indexNumber: '06',
    name: '500坪毛孩專屬島嶼樂園',
    englishName: '500-Ping Pet Island Agility & Splash Park',
    category: '寵物友善',
    openHours: '每日 07:00 – 21:00',
    locationZone: '7號碼頭 · 寵物別墅專屬島區',
    priceNote: '寵物別墅住客免費使用',
    image: IMAGES.heroLagoon,
    summary:
      '全台罕見的獨立島嶼型寵物運動公園，鋪設安全百慕達草皮，配備毛孩淺水戲水池、涵洞迷宮、敏捷跳台與專屬美容吹水室。',
    details: [
      '全區雙道安全門禁圍欄，讓中大型犬與小型犬皆能安心解繩奔跑',
      '設有「毛孩專屬電動遊艇碼頭」，固定時段開航寵物友善專船',
      '貼心提供溫水自助洗毛台、高功率寵物吹水機與免費拾便袋',
    ],
    highlightsMetric: '500 坪安全圍欄草坪 · 專屬寵物遊艇碼頭',
  },
];

export const ATTRACTIONS: AttractionItem[] = [
  {
    id: 'dream-lake',
    name: '雲山水夢幻湖',
    englishName: 'Yunshanshui Dream Lake Ecological Farm',
    category: '自然生態',
    driveMinutes: 5,
    distanceKm: 2.3,
    bestTime: '清晨 07:30–10:00 或 午後 15:30–17:30',
    shuttleInfo: '可租借飯店電輔單車直達 (約 10 分鐘)',
    coordinates: { x: 56, y: 68 },
    image: IMAGES.attractionCoast,
    description:
      '距離 ok HOTEL 僅 5 分鐘車程的絕美秘境，4 公頃澄澈牛奶藍夢幻湖倒映著整排落羽松森林與白雲山嵐，跳石步道是花蓮最經典的攝影地標。',
    recommendedDuration: '1.5 小時',
    highlights: ['牛奶藍湧泉湖畔落羽松倒影', '經典跳石水岸步道漫遊', '季節性鳶尾花與黃金落羽松林'],
  },
  {
    id: 'lichuan-aquafarm',
    name: '立川漁場 黃金蜆生態體驗',
    englishName: 'Lichuan Aquafarm Clam Experience',
    category: '自然生態',
    driveMinutes: 6,
    distanceKm: 2.8,
    bestTime: '全天適宜 (09:00–17:00)',
    shuttleInfo: '飯店櫃檯可代訂計程車或騎乘單車前往',
    coordinates: { x: 42, y: 62 },
    image: IMAGES.facilityParkSpa,
    description:
      '位於飯店緊鄰的壽豐湧泉帶，以天然活水養殖聞名全球的「黃金蜆」。遊客可親自挽起褲管下水體驗「摸蜆兼洗褲」的樂趣，並品嚐現炒黃金蜆與鹽烤活力鯛。',
    recommendedDuration: '2 小時',
    highlights: ['天然清澈湧泉池親水摸蜆體驗', '五餅二魚餐廳品嚐現炒黃金蜆', '黃金蜆文化生態館導覽'],
  },
  {
    id: 'liyu-lake',
    name: '鯉魚潭風景區',
    englishName: 'Liyu Lake Scenic Area',
    category: '山海冒險',
    driveMinutes: 18,
    distanceKm: 13.5,
    bestTime: '上午 08:30–11:30',
    shuttleInfo: '飯店每日 09:30 提供半日遊專車接駁 (需預約)',
    coordinates: { x: 26, y: 48 },
    image: IMAGES.attractionCoast,
    description:
      '花蓮境內最大的內陸堰塞湖，群山環抱、波光粼粼。設全長 5 公里的平坦環潭自行車道，亦可體驗SUP立槳、透明獨木舟與天鵝船遊湖。',
    recommendedDuration: '2.5 小時',
    highlights: ['5 公里平坦林蔭環潭自行車道', '清晨無風鏡面湖景 SUP 立槳與獨木舟', '每年 4–5 月季節限定賞螢步道'],
  },
  {
    id: 'ocean-park',
    name: '遠雄海洋公園 & 東海岸台11線',
    englishName: 'Hualien Pacific Coast & Ocean Park',
    category: '山海冒險',
    driveMinutes: 25,
    distanceKm: 18.0,
    bestTime: '全天 (09:00–17:00)',
    shuttleInfo: '可搭配飯店東海岸一日包車行程',
    coordinates: { x: 78, y: 44 },
    image: IMAGES.attractionCoast,
    description:
      '沿著蔚藍太平洋台 11 線海岸公路前行，登高飽覽無邊際湛藍海景，探訪海底王國水族館、高空晴空纜車與海豚海獅生態劇場。',
    recommendedDuration: '4–6 小時',
    highlights: ['太平洋第一排懸崖海景視野', '高空景觀纜車俯瞰花東海岸線', '探訪周邊山度空間與海崖谷景觀咖啡'],
  },
  {
    id: 'jian-keishuin',
    name: '吉安慶修院 & 松園別館',
    englishName: 'Ji-an Keishuin Historical Temple',
    category: '人文歷史',
    driveMinutes: 25,
    distanceKm: 16.2,
    bestTime: '上午 09:00–12:00 或 下午 14:00–17:00',
    shuttleInfo: '可搭乘飯店花蓮市區接駁線順遊',
    coordinates: { x: 52, y: 34 },
    image: IMAGES.roomHoneymoon,
    description:
      '創建於西元 1917 年的台灣三級古蹟，為花東地區保存最完整的日式真言宗寺院。院內完整保留八十八尊石佛、手水舍與百年檜木寶形造佛堂。',
    recommendedDuration: '1.5 小時',
    highlights: ['百年檜木寶形造日式寺院建築', '四國遍路八十八尊石佛靜心巡禮', '日式浴衣體驗與手水舍祈福'],
  },
  {
    id: 'taroko-qingshui',
    name: '太魯閣國家公園 & 清水斷崖',
    englishName: 'Taroko Gorge & Qingshui Cliff',
    category: '山海冒險',
    driveMinutes: 50,
    distanceKm: 38.5,
    bestTime: '上午 08:00–14:00',
    shuttleInfo: '飯店禮賓部提供「太魯閣峽谷半日/一日遊」專車導覽',
    coordinates: { x: 64, y: 16 },
    image: IMAGES.attractionCoast,
    description:
      '世界級大理石峽谷奇觀與台灣八景之一的清水斷崖。高達千米的垂直大理石絕壁直插湛藍太平洋，見證立霧溪百萬年鬼斧神工的地質史詩。',
    recommendedDuration: '半日至一日',
    highlights: ['崇德步道眺望清水斷崖漸層太平洋', '太魯閣峽谷大理石岩壁與吊橋景觀', '新城老街品嚐佳興檸檬汁與在地人文'],
  },
];

export const RESORT_PROOF = {
  metrics: [
    {
      value: '2.2 km',
      label: '環狀應許運河',
      context: '串聯 7 座島區碼頭與 16 座安達魯西亞風格拱橋',
    },
    {
      value: '5.7 ha',
      label: '豐之谷自然生態公園',
      context: '萬坪中央山脈湧泉濕地，復育 120+ 種原生動植物',
    },
    {
      value: '4.9 / 5.0',
      label: '實名住客滿意度',
      context: '累積超過 3,840 則家庭、蜜月與毛孩旅客真實好評',
    },
    {
      value: 'Top 100',
      label: '世界百大渡假飯店體驗',
      context: '榮獲國際建築與綠色永續渡假飯店肯定',
    },
  ],
  testimonials: [
    {
      quote:
        '原本擔心帶兩歲幼兒與長輩出門會很奔波，入住安東尼奧家庭套房後完全改觀。從碼頭搭無聲電動船遊河、去豐之谷搭竹筏看水鳥，到自己動手烤柴燒麵包，爸媽和孩子整整兩天在園區裡都捨不得離開！',
      author: '林雅筑 女士',
      role: '台北 · 三代同堂家族旅遊 (入住安東尼奧歡樂家庭套房 2 晚)',
      stayDate: '2026年 8月',
    },
    {
      quote:
        '結婚五週年選擇伊莎貝拉蜜月套房，推開陽台就是翠綠色的運河與拱橋，彷彿一秒飛到西班牙塞維亞。傍晚的星光遊艇與里拉餐廳的西班牙海鮮燉飯水準極高，禮賓團隊還貼心準備了紅酒佈置。',
      author: '陳冠廷 先生',
      role: '台中 · 結婚週年紀念旅客 (入住伊莎貝拉蜜月套房)',
      stayDate: '2026年 9月',
    },
    {
      quote:
        '帶家裡的黃金獵犬住過全台許多寵物飯店，ok HOTEL 的汪汪寵物別墅真的做到極致友善！獨立島區直通 500 坪大草坪與戲水池，還能帶狗狗一起搭專屬電動船遊河，房內完全沒有異味且備品超齊全。',
      author: '張庭瑋 小姐',
      role: '高雄 · 毛孩家庭旅客 (入住汪汪寵物別墅套房)',
      stayDate: '2026年 9月',
    },
  ],
};

export const PROMO_CODES: Record<string, { label: string; discountRate?: number; flatOff?: number }> = {
  OK2026: { label: '官網直訂早鳥禮遇 92 折', discountRate: 0.08 },
  LAGOON1000: { label: '應許運河慢旅現折 NT$1,000', flatOff: 1000 },
  FAMILY88: { label: '家庭閣樓專案享 88 折優惠', discountRate: 0.12 },
};
