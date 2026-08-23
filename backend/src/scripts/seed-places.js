// One-off seed: ensures the curated set of tourist destinations used by the
// frontend (src/lib/cities.js) exists in MongoDB. Safe to re-run — every entry
// is upserted by `slug`, so existing rows (and their reviews / ratings) are
// left untouched.
//
// Coordinates are resolved live via the Google Maps Geocoding API. Set
// GOOGLE_MAPS_API_KEY in your backend environment before running. The key is
// read from process.env, never logged, never written to disk.
//
// Usage:
//   GOOGLE_MAPS_API_KEY=xxx node src/scripts/seed-places.js
//
// This script does NOT modify users, guides, bookings, reviews or .env files.

const mongoose = require('mongoose');
const env = require('../config/env');
const Place = require('../models/place.model');

const IMG = {
  redFort: 'https://images.indianexpress.com/2018/06/red-fort-759-getty-images.jpg',
  indiaGate:
    'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
  qutubMinar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQxznnhKkmoCFg4h_naOFQ-DUgI9Im0_UZkR2IptK8tZgxAsUndltxJvvNP&s=10',
  connaughtPlace:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJJNXWr3H-YVegzxsDnoPXJOmU05wfbw9OLJF7c4rMjw&s',
  humayunTomb:
    'https://images.squarespace-cdn.com/content/v1/6298cb774cf3830bc9b342bf/1686821873057-GC66MGFKTZ9BC0FP0P23/humayans-tomb-1.jpg?format=750w',
  lotusTemple:
    'https://upload.wikimedia.org/wikipedia/commons/f/fc/LotusDelhi.jpg',
  tajMahal:
    'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  agraFort:
    'https://cdn.britannica.com/37/178637-050-22E50FA5/Jahangirs-Palace-Agra-Fort-India-Uttar-Pradesh.jpg',
  tombOfAkbar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8t1n0MtnaSuEbUxOs27KMqEZw_whW2b3oMwtd4KPJTZ7lwW7uSDIZDPMb&s=10',
  jamaMasjidAgra:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9UbUiGVkxEObpj3vTWQ0P5RTkAWH4rx8RFIfjA9pKciZvPfnofjW_ovU&s=10',
  itmadUdDaulah:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSf7a_mcapsWUIn47V23F2H8ZXeeFYgWhAM6bmFGi6_PWiEnaYCFDTFIUc&s=10',
  hawaMahal:
    'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
  amerFort:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXNAz3xos8La_KotaYDliJfK91k94I_vzLGg-VUIMx6A&s=10',
  nahargarh:
    'https://hblimg.mmtcdn.com/content/hubble/img/jaipur/mmt/activities/m_activities_nahargarh_fort_l_370_556.jpg',
  jantarMantar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHtOWHYWkuwJwe-LKIYa07f8CR7V6tWu_hBmmCSWIqzw&s',
  dalLake:
    'https://upload.wikimedia.org/wikipedia/commons/1/1d/Dal_LakeVR.jpg',
  gulmarg:
    'https://7seasfly.com/wp-content/uploads/2024/07/Gulmarg-Baramulla-Jammu-and-Kashmir.jpg',
  pangongLake:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbptdHYagqgX9Y8dAZMNrO2DX-_1ncsYOTwFd5_HnIQAEu3j1Q-s_yjb1e&s=10',
  nubraValley:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxJSH6N7_gqZB5Ws7by_0yFRf169sjTYhm32UA5V3zXg&s=10',
  kufri: 'https://www.tourmyindia.com/socialimg/best-time-visit-kufri.jpg',
  robbersCave: 'https://indiaeasytrip.com/blog/wp-content/uploads/2023/06/cav1.jpg',
  rohtangPass: 'https://chalotravellers.com/wp-content/uploads/2026/05/Rohtang.jpg',
  joginiWaterfalls:
    'https://www.trailhikers.in/wp-content/uploads/2022/11/Jogini-Waterfall-trek-003.jpg',
  kashiVishwanath:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRncy2pSgaJWpqus0GzIXu8mfBWrITRpB2uQ2dJRPlzXXQug7AXsmmpn2k&s=10',
  assiGhat: 'https://kashiyatra.in/wp-content/uploads/2024/03/Assi-ghat-scaled.jpg',
  marinaBeach:
    'https://s7ap1.scene7.com/is/image/incredibleindia/marina-beach-chennai-tamil-nadu-attr-about?qlt=82&ts=1742170361098',
  kapaleeshwarar:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTHq2_9qWBcFAZ8zY_m9ULoVcMXGbiQAmiK3KQ78Cd1w&s=10',
  bangalorePalace:
    'https://upload.wikimedia.org/wikipedia/commons/8/8f/Bangalore_Mysore_Maharaja_Palace.jpg',
};

// Curated destinations spanning the 11 cities the frontend lists in
// src/lib/cities.js, plus the two existing rows (Baga Beach, Leh Palace).
// `coordinates` are NOT hard-coded — they are resolved live below via the
// Google Geocoding API.
const PLACES = [
  // ---- Goa (existing) ----
  {
    name: 'Baga Beach',
    slug: 'baga-beach',
    city: 'Goa',
    state: 'Goa',
    category: 'beach',
    summary: 'Famous beach in North Goa known for nightlife and water sports.',
    description:
      'Baga Beach is one of the most popular beaches in North Goa. The Candolim-Baga strip is lined with beach shacks, restaurants and water-sport operators offering parasailing, jet-skiing and banana rides. The beach comes alive after sunset with live music and open-air clubs.',
    specialties: ['Nightlife', 'Water sports', 'Beach shacks'],
    famousFeatures: ['Tito’s Lane', 'Britto’s', 'Baga Creek'],
    images: [IMG.indiaGate /* placeholder; original Atlas row kept its own */],
    coverImage: IMG.indiaGate,
    entryFee: 0,
    bestTimeToVisit: 'November to February',
    timings: 'Open 24 hours',
  },

  // ---- Delhi ----
  {
    name: 'Red Fort',
    slug: 'red-fort',
    city: 'Delhi',
    state: 'Delhi',
    category: 'heritage',
    summary: 'Mughal-era fort in Old Delhi and a UNESCO World Heritage Site.',
    description:
      'The Red Fort (Lal Qila) was the main residence of the Mughal emperors for nearly 200 years. Built by Shah Jahan in 1639, its massive red sandstone walls enclose palaces, museums and the famous Lahori Gate. Independence Day is celebrated here every 15 August.',
    specialties: ['Mughal architecture', 'Museums', 'Sound & light show'],
    famousFeatures: ['Lahori Gate', 'Diwan-i-Aam', 'Diwan-i-Khas', 'Mumtaz Mahal'],
    images: [IMG.redFort],
    coverImage: IMG.redFort,
    entryFee: 600,
    bestTimeToVisit: 'October to March',
    timings: 'Tue–Sun, 9:30 AM – 4:30 PM',
  },
  {
    name: 'India Gate',
    slug: 'india-gate',
    city: 'Delhi',
    state: 'Delhi',
    category: 'heritage',
    summary: '42-metre war memorial on Rajpath, surrounded by lawns.',
    description:
      'Designed by Edwin Lutyens and completed in 1931, India Gate is a 42-metre sandstone arch commemorating Indian soldiers who died in the First World War. The Amar Jawan Jyoti burns beneath it. The surrounding lawns are a popular evening gathering spot.',
    specialties: ['War memorial', 'Evening walks', 'Picnic'],
    famousFeatures: ['Amar Jawan Jyoti', 'Rajpath lawns'],
    images: [IMG.indiaGate],
    coverImage: IMG.indiaGate,
    entryFee: 0,
    bestTimeToVisit: 'October to March',
    timings: 'Open 24 hours',
  },
  {
    name: 'Qutub Minar',
    slug: 'qutub-minar',
    city: 'Delhi',
    state: 'Delhi',
    category: 'heritage',
    summary: '73-metre UNESCO-listed brick minaret in Mehrauli.',
    description:
      'Built in 1193 by Qutb-ud-din Aibak, the Qutub Minar is the tallest brick minaret in the world. The complex also contains the Quwwat-ul-Islam mosque and the rust-free Iron Pillar of Delhi.',
    specialties: ['Indo-Islamic architecture', 'UNESCO site', 'Photography'],
    famousFeatures: ['Iron Pillar', 'Alai Darwaza', 'Quwwat-ul-Islam mosque'],
    images: [IMG.qutubMinar],
    coverImage: IMG.qutubMinar,
    entryFee: 500,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, 7:00 AM – 5:00 PM',
  },
  {
    name: "Humayun's Tomb",
    slug: 'humayuns-tomb',
    city: 'Delhi',
    state: 'Delhi',
    category: 'heritage',
    summary: 'Mughal garden tomb and UNESCO World Heritage Site.',
    description:
      'Built in 1565, Humayun’s Tomb was the first garden-tomb on the Indian subcontinent and a precursor to the Taj Mahal. Persian and Mughal architects designed the char-bagh layout that surrounds the central mausoleum.',
    specialties: ['Persian-Mughal architecture', 'Charbagh gardens'],
    famousFeatures: ['Charbagh layout', 'Barber’s Tomb', 'Isa Khan complex'],
    images: [IMG.humayunTomb],
    coverImage: IMG.humayunTomb,
    entryFee: 600,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, sunrise to sunset',
  },
  {
    name: 'Lotus Temple',
    slug: 'lotus-temple',
    city: 'Delhi',
    state: 'Delhi',
    category: 'heritage',
    summary: 'Bahá’í House of Worship shaped like a lotus flower.',
    description:
      'Completed in 1986, the Lotus Temple is a Bahá’í House of Worship notable for its 27 free-standing marble-clad "petals" arranged in the form of a lotus. It is open to people of all faiths for silent meditation.',
    specialties: ['Modern architecture', 'Meditation'],
    famousFeatures: ['27 marble petals', 'Nine surrounding pools'],
    images: [IMG.lotusTemple],
    coverImage: IMG.lotusTemple,
    entryFee: 0,
    bestTimeToVisit: 'October to March',
    timings: 'Tue–Sun, 9:00 AM – 5:30 PM',
  },

  // ---- Agra (Uttar Pradesh) ----
  {
    name: 'Taj Mahal',
    slug: 'taj-mahal',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'heritage',
    summary: 'Ivory-white marble mausoleum and one of the Seven Wonders.',
    description:
      'Commissioned in 1632 by Shah Jahan in memory of his wife Mumtaz Mahal, the Taj Mahal is the jewel of Mughal architecture. The white marble is inlaid with 28 types of precious and semi-precious stones in the pietra dura technique.',
    specialties: ['Mughal architecture', 'UNESCO site', 'Sunrise views'],
    famousFeatures: ['Main mausoleum', 'Charbagh gardens', 'Meena Bazaar'],
    images: [IMG.tajMahal],
    coverImage: IMG.tajMahal,
    entryFee: 1100,
    bestTimeToVisit: 'October to March',
    timings: 'Daily except Friday, sunrise to sunset',
  },
  {
    name: 'Agra Fort',
    slug: 'agra-fort',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'heritage',
    summary: 'UNESCO-listed red sandstone fort, 2.5 km from the Taj Mahal.',
    description:
      'Agra Fort was the main residence of the Mughal emperors until 1638. Its walls enclose the Jahangir Palace, Khas Mahal and the Musamman Burj where Shah Jahan spent his final years gazing at the Taj.',
    specialties: ['Mughal architecture', 'UNESCO site'],
    famousFeatures: ['Diwan-i-Aam', 'Diwan-i-Khas', 'Musamman Burj'],
    images: [IMG.agraFort],
    coverImage: IMG.agraFort,
    entryFee: 650,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, sunrise to sunset',
  },
  {
    name: 'Itmad-ud-Daulah',
    slug: 'itmad-ud-daulah',
    city: 'Agra',
    state: 'Uttar Pradesh',
    category: 'heritage',
    summary: 'First full marble tomb in India, often called the "Baby Taj".',
    description:
      'Built between 1622 and 1628, Itmad-ud-Daulah’s tomb is the first major Mughal building faced entirely in white marble and the first to use pietra dura inlay extensively, paving the way for the Taj Mahal.',
    specialties: ['Marble inlay', 'Pietra dura'],
    famousFeatures: ['Marble lattice screens', 'Garden charbagh'],
    images: [IMG.itmadUdDaulah],
    coverImage: IMG.itmadUdDaulah,
    entryFee: 310,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, sunrise to sunset',
  },

  // ---- Jaipur (Rajasthan) ----
  {
    name: 'Hawa Mahal',
    slug: 'hawa-mahal',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'heritage',
    summary: 'Five-storey "Palace of Winds" with 953 latticed windows.',
    description:
      'Built in 1799 by Maharaja Sawai Pratap Singh, the Hawa Mahal’s pink sandstone façade is studded with 953 small windows (jharokhas) that allowed royal ladies to observe street life unseen.',
    specialties: ['Rajput architecture', 'Photography'],
    famousFeatures: ['953 jharokhas', 'Top floor crown'],
    images: [IMG.hawaMahal],
    coverImage: IMG.hawaMahal,
    entryFee: 200,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, 9:00 AM – 4:30 PM',
  },
  {
    name: 'Amer Fort',
    slug: 'amer-fort',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'heritage',
    summary: 'Hilltop fort-palace with mirrored Sheesh Mahal.',
    description:
      'Amer Fort, built in the late 16th century by Raja Man Singh I, sits above Maota Lake. Highlights include the Ganesh Pol gateway, the mirror-work Sheesh Mahal and elephant rides up the cobbled rampart.',
    specialties: ['Rajput architecture', 'Sheesh Mahal', 'Elephant rides'],
    famousFeatures: ['Sheesh Mahal', 'Ganesh Pol', 'Diwan-i-Aam'],
    images: [IMG.amerFort],
    coverImage: IMG.amerFort,
    entryFee: 550,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, 8:00 AM – 5:30 PM',
  },
  {
    name: 'Nahargarh Fort',
    slug: 'nahargarh-fort',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'heritage',
    summary: 'Skyline fort overlooking Jaipur, especially atmospheric at sunset.',
    description:
      'Built in 1734 by Sawai Jai Singh II as a retreat, Nahargarh Fort crowns the Aravalli ridge. Its terraced walls and Madhavendra Bhawan suites offer panoramic views of the Pink City.',
    specialties: ['Sunset views', 'Photography'],
    famousFeatures: ['Madhavendra Bhawan', 'Rooftop café'],
    images: [IMG.nahargarh],
    coverImage: IMG.nahargarh,
    entryFee: 200,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, 10:00 AM – 5:30 PM',
  },
  {
    name: 'Jantar Mantar',
    slug: 'jantar-mantar-jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    category: 'heritage',
    summary: 'UNESCO-listed 18th-century open-air observatory.',
    description:
      'Jantar Mantar is a collection of 19 architectural astronomical instruments built by Sawai Jai Singh II in 1734. The 27-metre Samrat Yantra sundial is accurate to two seconds.',
    specialties: ['Astronomy', 'UNESCO site'],
    famousFeatures: ['Samrat Yantra', 'Jai Prakash Yantra'],
    images: [IMG.jantarMantar],
    coverImage: IMG.jantarMantar,
    entryFee: 200,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, 9:00 AM – 4:30 PM',
  },

  // ---- Kashmir (Jammu & Kashmir) ----
  {
    name: 'Dal Lake',
    slug: 'dal-lake',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    category: 'other',
    summary: 'Iconic Srinagar lake with houseboats and shikaras.',
    description:
      'Dal Lake covers 18 km² and includes floating gardens, lotus beds and ornate houseboats. Visitors hire colourful shikaras to glide past markets on the water and out to the Mughal gardens on the eastern shore.',
    specialties: ['Houseboats', 'Shikaras', 'Mughal gardens'],
    famousFeatures: ['Nishat Bagh', 'Shalimar Bagh', 'Floating vegetable market'],
    images: [IMG.dalLake],
    coverImage: IMG.dalLake,
    entryFee: 0,
    bestTimeToVisit: 'April to October',
    timings: 'Daily, 6:00 AM – 6:00 PM',
  },
  {
    name: 'Gulmarg',
    slug: 'gulmarg',
    city: 'Gulmarg',
    state: 'Jammu & Kashmir',
    category: 'mountain',
    summary: 'Meadow of flowers and one of Asia’s highest cable cars.',
    description:
      'Gulmarg’s wide alpine meadows turn into a ski resort in winter. The Gulmarg Gondola, one of the world’s highest cable cars, climbs to 3,979 m at Kongdoori, with views of Nanga Parbat on clear days.',
    specialties: ['Skiing', 'Gondola ride', 'Alpine meadows'],
    famousFeatures: ['Phase 1 Gondola', 'Strawberry Valley', 'Khilanmarg'],
    images: [IMG.gulmarg],
    coverImage: IMG.gulmarg,
    entryFee: 0,
    bestTimeToVisit: 'December to March (skiing); April to June (meadows)',
    timings: 'Daily, 9:00 AM – 5:00 PM',
  },

  // ---- Ladakh (existing Leh Palace plus two more) ----
  {
    name: 'Leh Palace',
    slug: 'leh-palace',
    city: 'Leh',
    state: 'Ladakh',
    category: 'heritage',
    summary: 'Nine-storey royal palace overlooking Leh town.',
    description:
      'Built in the 17th century by Sengge Namgyal, Leh Palace rises nine storeys and houses the Ladakh Museum. Its tower offers panoramic views of the Indus valley and the snow-capped Stok Kangri.',
    specialties: ['Ladakhi architecture', 'Museum', 'Panoramic views'],
    famousFeatures: ['Dukkar Hall', 'Victory Tower'],
    images: [IMG.nubraValley /* placeholder; existing row keeps its own image */],
    coverImage: IMG.nubraValley,
    entryFee: 100,
    bestTimeToVisit: 'May to September',
    timings: 'Daily, 9:00 AM – 5:00 PM',
  },
  {
    name: 'Pangong Lake',
    slug: 'pangong-lake',
    city: 'Leh',
    state: 'Ladakh',
    category: 'mountain',
    summary: '134-km endorheic lake straddling Ladakh and Tibet at 4,350 m.',
    description:
      'Pangong Tso sits at 4,350 m and stretches 134 km, about 60% of it on the Tibetan side. Its colour shifts between shades of blue and turquoise through the day.',
    specialties: ['High-altitude lake', 'Photography', 'Camping'],
    famousFeatures: ['Spangmik viewpoint', 'Migratory Brahminy ducks'],
    images: [IMG.pangongLake],
    coverImage: IMG.pangongLake,
    entryFee: 400,
    bestTimeToVisit: 'May to September',
    timings: 'Open 24 hours',
  },
  {
    name: 'Nubra Valley',
    slug: 'nubra-valley',
    city: 'Leh',
    state: 'Ladakh',
    category: 'mountain',
    summary: 'High-altitude cold desert with Bactrian camels and sand dunes.',
    description:
      'Nubra lies north of Leh over the 5,359-metre Khardung La pass. The valley combines dramatic sand dunes at Hunder with the green oasis of Diskit and a 32-metre Maitreya Buddha statue looking over the confluence.',
    specialties: ['Cold desert', 'Bactrian camels', 'Buddhist monasteries'],
    famousFeatures: ['Hunder dunes', 'Diskit Monastery', 'Maitreya Buddha statue'],
    images: [IMG.nubraValley],
    coverImage: IMG.nubraValley,
    entryFee: 0,
    bestTimeToVisit: 'May to September',
    timings: 'Daily, sunrise to sunset',
  },

  // ---- Shimla (Himachal Pradesh) ----
  {
    name: 'Kufri',
    slug: 'kufri',
    city: 'Shimla',
    state: 'Himachal Pradesh',
    category: 'mountain',
    summary: 'Hill station 16 km from Shimla popular for winter snow.',
    description:
      'At 2,510 m, Kufri is a small hill town known for its Himalayan Nature Park, Mahasu Peak and pony rides. Snowfall in January and February draws day-trippers from Shimla.',
    specialties: ['Snow point', 'Himalayan Nature Park', 'Pony rides'],
    famousFeatures: ['Mahasu Peak', 'Indira Tourist Park'],
    images: [IMG.kufri],
    coverImage: IMG.kufri,
    entryFee: 0,
    bestTimeToVisit: 'December to March (snow); April to June (trekking)',
    timings: 'Daily, 9:00 AM – 6:00 PM',
  },

  // ---- Dehradun (Uttarakhand) ----
  {
    name: "Robber's Cave",
    slug: 'robbers-cave',
    city: 'Dehradun',
    state: 'Uttarakhand',
    category: 'mountain',
    summary: '3.5 km limestone cave stream in Sahastradhara.',
    description:
      'Known locally as Guchhupani, Robber’s Cave is a narrow river cave near Sahastradhara. Visitors wade through ankle-deep cool water between limestone cliffs that shelter the stream.',
    specialties: ['River cave', 'Picnic spot'],
    famousFeatures: ['Limestone cliffs', 'Cool water stream'],
    images: [IMG.robbersCave],
    coverImage: IMG.robbersCave,
    entryFee: 0,
    bestTimeToVisit: 'March to June',
    timings: 'Daily, 7:00 AM – 6:00 PM',
  },

  // ---- Manali (Himachal Pradesh) ----
  {
    name: 'Rohtang Pass',
    slug: 'rohtang-pass',
    city: 'Manali',
    state: 'Himachal Pradesh',
    category: 'mountain',
    summary: '3,978 m mountain pass linking Kullu to Lahaul-Spiti.',
    description:
      'Rohtang La lies 51 km from Manali at 3,978 m. It is the gateway to Lahaul and Spiti and a day-trip destination for snow play, sledding and panoramic Himalayan views.',
    specialties: ['Snow play', 'Mountain photography'],
    famousFeatures: ['Beas river source', 'Snow slopes'],
    images: [IMG.rohtangPass],
    coverImage: IMG.rohtangPass,
    entryFee: 0,
    bestTimeToVisit: 'December to February',
    timings: 'Daily, 6:00 AM – 5:00 PM (weather permitting)',
  },
  {
    name: 'Jogini Waterfalls',
    slug: 'jogini-waterfalls',
    city: 'Manali',
    state: 'Himachal Pradesh',
    category: 'mountain',
    summary: '150-ft cascade reached by a 2 km trek from Vashisht.',
    description:
      'Jogini Falls is a 150-foot waterfall on the Beas river, reached by a short trek through apple orchards from the village of Vashisht. The base has a small Shiva shrine and a natural pool.',
    specialties: ['Trekking', 'Natural pool'],
    famousFeatures: ['Shiva shrine', 'Apple orchards'],
    images: [IMG.joginiWaterfalls],
    coverImage: IMG.joginiWaterfalls,
    entryFee: 0,
    bestTimeToVisit: 'March to June',
    timings: 'Daily, sunrise to sunset',
  },

  // ---- Varanasi (Uttar Pradesh) ----
  {
    name: 'Kashi Vishwanath Temple',
    slug: 'kashi-vishwanath-temple',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'pilgrimage',
    summary: 'One of the twelve Jyotirlingas, on the western bank of the Ganga.',
    description:
      'Kashi Vishwanath is one of the holiest Shiva temples in India and one of the twelve Jyotirlingas. The current structure was rebuilt by Ahilyabai Holkar in 1780 and connects through a corridor to the Ganga.',
    specialties: ['Jyotirlinga', 'Spiritual walks'],
    famousFeatures: ['Main sanctum', 'Ganga corridor'],
    images: [IMG.kashiVishwanath],
    coverImage: IMG.kashiVishwanath,
    entryFee: 0,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, 3:00 AM – 11:00 PM (with breaks)',
  },
  {
    name: 'Assi Ghat',
    slug: 'assi-ghat',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    category: 'pilgrimage',
    summary: 'Southernmost ghat, popular for sunrise yoga and the Subah-e-Banaras show.',
    description:
      'Assi Ghat marks the confluence of the Assi and the Ganga. It hosts the morning Subah-e-Banaras ceremony and the evening Ganga Aarti.',
    specialties: ['Subah-e-Banaras', 'Ganga Aarti'],
    famousFeatures: ['Shiva lingam under the peepal', 'Evening aarti'],
    images: [IMG.assiGhat],
    coverImage: IMG.assiGhat,
    entryFee: 0,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, 24 hours',
  },

  // ---- Chennai (Tamil Nadu) ----
  {
    name: 'Marina Beach',
    slug: 'marina-beach',
    city: 'Chennai',
    state: 'Tamil Nadu',
    category: 'beach',
    summary: '13-km urban beach along the Bay of Bengal.',
    description:
      'Marina Beach runs 13 km along Chennai’s eastern coast and is the longest urban beach in India. It is lined with statues, the aquarium and the lighthouse.',
    specialties: ['Long urban beach', 'Lighthouse'],
    famousFeatures: ['MGR memorial', 'Anna memorial', 'Lighthouse'],
    images: [IMG.marinaBeach],
    coverImage: IMG.marinaBeach,
    entryFee: 0,
    bestTimeToVisit: 'November to February',
    timings: 'Daily, 6:00 AM – 9:00 PM',
  },
  {
    name: 'Kapaleeshwarar Temple',
    slug: 'kapaleeshwarar-temple',
    city: 'Chennai',
    state: 'Tamil Nadu',
    category: 'pilgrimage',
    summary: '7th-century Dravidian Shiva temple in Mylapore.',
    description:
      'Kapaleeshwarar is a 7th-century Shiva temple in the heart of Mylapore. Its 37-metre gopuram is decorated with figures from the Puranas, and the tank outside fills during the Arupathumoovar festival.',
    specialties: ['Dravidian architecture', 'Car festival'],
    famousFeatures: ['37-m gopuram', 'Pigeon-feeding square'],
    images: [IMG.kapaleeshwarar],
    coverImage: IMG.kapaleeshwarar,
    entryFee: 0,
    bestTimeToVisit: 'October to March',
    timings: 'Daily, 5:30 AM – 10:00 PM',
  },

  // ---- Bangalore (Karnataka) ----
  {
    name: 'Bangalore Palace',
    slug: 'bangalore-palace',
    city: 'Bangalore',
    state: 'Karnataka',
    category: 'heritage',
    summary: 'Tudor-style royal palace in the heart of Bangalore.',
    description:
      'Built in 1878 by Chamarajendra Wodeyar, Bangalore Palace mirrors England’s Windsor Castle with Tudor and Scottish Gothic architecture. The interiors hold oil paintings, hunting trophies and a ballroom.',
    specialties: ['Tudor architecture', 'Royal interiors'],
    famousFeatures: ['Ballroom', 'Royal paintings'],
    images: [IMG.bangalorePalace],
    coverImage: IMG.bangalorePalace,
    entryFee: 460,
    bestTimeToVisit: 'October to February',
    timings: 'Daily, 10:00 AM – 5:30 PM',
  },
];

// ---------------------------------------------------------------------------
// Google Geocoding
// ---------------------------------------------------------------------------
//
// The Geocoding API returns up to 20 results per query. We bias the result to
// India (`components=country:IN`) and ask for `geometry.location` only. The
// first result is normally the right one for well-known landmarks; if Google
// can't find a match we surface a clear message and skip that place rather
// than fabricate coordinates.

const GEOCODE_ENDPOINT = 'https://maps.googleapis.com/maps/api/geocode/json';

async function geocodeOne(query, apiKey) {
  const url = `${GEOCODE_ENDPOINT}?${new URLSearchParams({
    address: query,
    components: 'country:IN',
    key: apiKey,
  }).toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} from Geocoding API`);
  }
  const body = await res.json();
  if (body.status !== 'OK' && body.status !== 'ZERO_RESULTS') {
    // REQUEST_DENIED, INVALID_REQUEST, OVER_QUERY_LIMIT, UNKNOWN_ERROR...
    const msg = body.error_message || body.status;
    // We deliberately do NOT include the key or the raw query in the error.
    throw new Error(`Geocoding failed (${body.status}): ${msg}`);
  }
  const hit = (body.results || [])[0];
  if (!hit) return null;
  const { lat, lng } = hit.geometry.location;
  return {
    coordinates: [lng, lat], // GeoJSON Point expects [lng, lat]
    formattedAddress: hit.formatted_address,
  };
}

async function resolveCoordinates(place, apiKey) {
  const query = `${place.name}, ${place.city}, India`;
  return geocodeOne(query, apiKey);
}

// ---------------------------------------------------------------------------
// Upsert
// ---------------------------------------------------------------------------

async function upsertPlace(data, resolved) {
  const update = { ...data, isActive: true, country: data.country || 'India' };
  if (resolved && Array.isArray(resolved.coordinates)) {
    update.location = {
      type: 'Point',
      coordinates: resolved.coordinates,
    };
  }
  const result = await Place.findOneAndUpdate(
    { slug: data.slug },
    { $setOnInsert: update },
    { upsert: true, new: true, setDefaultsOnInsert: true, includeResultMetadata: true }
  );
  return {
    slug: data.slug,
    created: Boolean(result && result.lastErrorObject && result.lastErrorObject.upserted),
    resolved,
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

(async () => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.error(
      'GOOGLE_MAPS_API_KEY is not set. Set it in your backend env, e.g.\n' +
        '  GOOGLE_MAPS_API_KEY=xxx node src/scripts/seed-places.js\n' +
        'Or export it from the same shell. Never commit the key.'
    );
    process.exit(1);
  }

  await mongoose.connect(env.MONGO_URI);
  console.log(`connected to DB — geocoding and seeding ${PLACES.length} places`);

  let created = 0;
  let skipped = 0;
  let geocoded = 0;
  let ungeocodable = 0;

  for (const data of PLACES) {
    let resolved = null;
    try {
      resolved = await resolveCoordinates(data, apiKey);
    } catch (err) {
      // Network or quota error — log without revealing the key.
      console.error(`  ! geocoding error for ${data.slug}: ${err.message}`);
    }

    if (!resolved) {
      console.warn(`  ? skipped geocoding for ${data.slug} (no result); writing without coordinates`);
      ungeocodable++;
    } else {
      geocoded++;
    }

    try {
      const { created: wasCreated } = await upsertPlace(data, resolved);
      if (wasCreated) {
        created++;
        const coord = resolved ? ` [lng=${resolved.coordinates[0]}, lat=${resolved.coordinates[1]}]` : ' [no coords]';
        console.log(`  + created ${data.slug}${coord}`);
      } else {
        skipped++;
        console.log(`  = skipped (exists) ${data.slug}`);
      }
    } catch (err) {
      console.error(`  ! failed ${data.slug}: ${err.message}`);
    }

    // Light throttle — Geocoding has a per-second QPS limit on free keys.
    await new Promise((r) => setTimeout(r, 60));
  }

  const total = await Place.countDocuments({ isActive: true });
  console.log(
    `\nDone. created=${created}, skipped=${skipped}, geocoded=${geocoded}, ungeocodable=${ungeocodable}, total active places=${total}`
  );
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
