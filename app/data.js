// Mock meal database — vegetarian, Indian-leaning + globals you mentioned.
// `tint` drives the abstract bowl gradient (warm hue per dish family).
// `tags` show on cards. `pantry` lists ingredient keys for shopping-list math.

const BUILTIN_MEALS = [
  // ─────────── Indian classics ───────────
  { id: 'chana',    name: 'Chana Masala',          sub: 'with steamed basmati',     type: ['lunch','dinner'], time: 30, kcal: 520, tags: ['Indian', 'Protein'],  tint: ['#e8a05a', '#c66a2a'], pantry: ['chickpeas','onion','tomato','garam_masala','rice','ginger'] },
  { id: 'rajma',    name: 'Rajma Chawal',          sub: 'kidney bean curry + rice', type: ['lunch','dinner'], time: 40, kcal: 580, tags: ['Indian', 'Comfort'],  tint: ['#c2613e', '#8c3c20'], pantry: ['kidney_beans','onion','tomato','rice','garam_masala'] },
  { id: 'dal',      name: 'Dal Tadka',             sub: 'with jeera rice',          type: ['lunch','dinner'], time: 25, kcal: 470, tags: ['Indian', 'Light'],    tint: ['#e6b048', '#b88820'], pantry: ['toor_dal','rice','cumin','ghee','onion'], img: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80' },
  { id: 'palak',    name: 'Palak Paneer',          sub: 'with two rotis',           type: ['dinner'],          time: 35, kcal: 600, tags: ['Indian', 'Protein'],  tint: ['#5a8a4a', '#2f5e2a'], pantry: ['paneer','spinach','onion','cream','wheat_flour'] },
  { id: 'aloogobi', name: 'Aloo Gobi',             sub: 'with phulka',              type: ['lunch'],           time: 30, kcal: 440, tags: ['Indian', 'Light'],    tint: ['#d8a64a', '#9a6a1c'], pantry: ['potato','cauliflower','turmeric','wheat_flour'] },
  { id: 'biryani',  name: 'Veg Biryani',           sub: 'with raita',               type: ['lunch','dinner'], time: 45, kcal: 640, tags: ['Indian', 'Treat'],    tint: ['#c98c4a', '#8a4d18'], pantry: ['rice','mixed_veg','yogurt','biryani_masala','onion'] },
  { id: 'chole',    name: 'Chole Bhature',         sub: 'weekend treat',            type: ['lunch'],           time: 50, kcal: 720, tags: ['Indian', 'Treat'],    tint: ['#b46438', '#6e351a'], pantry: ['chickpeas','flour','yogurt','onion','tomato'] },
  { id: 'khichdi',  name: 'Moong Dal Khichdi',     sub: 'one-pot, easy',            type: ['dinner'],          time: 25, kcal: 420, tags: ['Indian', 'Light'],    tint: ['#dcb45a', '#a0782c'], pantry: ['moong_dal','rice','ghee','cumin','turmeric'] },
  { id: 'sambar',   name: 'Sambar Rice',           sub: 'with papad',               type: ['lunch'],           time: 35, kcal: 510, tags: ['South Indian'],       tint: ['#cc6e3a', '#823a16'], pantry: ['toor_dal','rice','sambar_powder','tamarind','vegetables'] },

  // ─────────── Sandwiches & quesadillas ───────────
  { id: 'chsand',   name: 'Chickpea Smash Sandwich', sub: 'lemon, dill, sourdough', type: ['lunch'],           time: 12, kcal: 480, tags: ['Sandwich', 'Quick'], tint: ['#d4b46c', '#8a6a2c'], pantry: ['chickpeas','bread','mayo','lemon','dill'] },
  { id: 'caprese',  name: 'Caprese Sandwich',      sub: 'tomato, mozz, basil',      type: ['lunch'],           time: 8,  kcal: 460, tags: ['Sandwich', 'Quick'], tint: ['#cb6e58', '#7a3528'], pantry: ['bread','mozzarella','tomato','basil','olive_oil'], img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400&q=80' },
  { id: 'grilled',  name: 'Grilled Veggie Wrap',   sub: 'hummus, peppers, onion',   type: ['lunch'],           time: 15, kcal: 510, tags: ['Wrap', 'Quick'],     tint: ['#a87a4a', '#5a3a1c'], pantry: ['tortilla','hummus','peppers','onion','spinach'] },
  { id: 'paneerq',  name: 'Paneer Quesadilla',     sub: 'with pickled onion',       type: ['dinner'],          time: 18, kcal: 620, tags: ['Quesadilla'],         tint: ['#d68a52', '#8a4a1a'], pantry: ['tortilla','paneer','cheese','onion','peppers'] },
  { id: 'beanq',    name: 'Black Bean Quesadilla', sub: 'avocado crema',            type: ['dinner'],          time: 15, kcal: 590, tags: ['Quesadilla'],         tint: ['#8a5234', '#4a2818'], pantry: ['tortilla','black_beans','cheese','avocado','lime'] },
  { id: 'mushq',    name: 'Mushroom Quesadilla',   sub: 'thyme, gruyère',           type: ['dinner'],          time: 20, kcal: 560, tags: ['Quesadilla'],         tint: ['#7a5238', '#3e2818'], pantry: ['tortilla','mushroom','cheese','thyme','garlic'] },
  { id: 'burrito',  name: 'Bean & Rice Burrito',   sub: 'cilantro lime, salsa',     type: ['dinner'],          time: 20, kcal: 640, tags: ['Wrap'],               tint: ['#a85a3a', '#5a2a18'], pantry: ['tortilla','black_beans','rice','salsa','cheese'] },

  // ─────────── Salads & bowls ───────────
  { id: 'medsalad', name: 'Mediterranean Bowl',    sub: 'chickpea, feta, cucumber', type: ['lunch'],           time: 12, kcal: 440, tags: ['Salad', 'Light'],    tint: ['#7aa05a', '#3a5e2a'], pantry: ['chickpeas','feta','cucumber','tomato','olive_oil'] },
  { id: 'quinoa',   name: 'Lentil Quinoa Bowl',    sub: 'roasted veg, tahini',      type: ['lunch','dinner'], time: 25, kcal: 520, tags: ['Bowl', 'Protein'],   tint: ['#b89a5a', '#7a5e28'], pantry: ['quinoa','lentils','sweet_potato','tahini','lemon'] },
  { id: 'greek',    name: 'Greek Salad + Hummus',  sub: 'with pita',                type: ['lunch'],           time: 10, kcal: 420, tags: ['Salad', 'Light'],    tint: ['#5e8c5e', '#2a4e2a'], pantry: ['cucumber','tomato','olives','feta','hummus','pita'], img: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&w=400&q=80' },
  { id: 'avo',      name: 'Avocado Chickpea Salad', sub: 'lemon, chili',            type: ['lunch'],           time: 8,  kcal: 410, tags: ['Salad', 'Quick'],    tint: ['#7c9c4a', '#3e5a1e'], pantry: ['chickpeas','avocado','lemon','chili','red_onion'] },
  { id: 'sl_kale',  name: 'Kale Caesar Salad',     sub: 'parmesan, lemon, croutons', type: ['lunch'],          time: 12, kcal: 420, tags: ['Salad', 'Light'],    tint: ['#5a8a4a', '#244e2a'], pantry: ['kale','parmesan','lemon','bread','olive_oil'] },
  { id: 'sl_thai',  name: 'Thai Crunch Salad',     sub: 'peanut, lime, cabbage',    type: ['lunch'],           time: 15, kcal: 460, tags: ['Salad', 'Asian'],    tint: ['#b8a04a', '#7a6824'], pantry: ['cabbage','peanut','lime','carrot','tofu'] },
  { id: 'sl_corn',  name: 'Corn & Black Bean Salad', sub: 'cilantro, lime, cotija', type: ['lunch'],           time: 10, kcal: 440, tags: ['Salad', 'Light'],    tint: ['#d4a44a', '#8a6020'], pantry: ['corn','black_beans','cilantro','lime','feta'] },
  { id: 'sl_beet',  name: 'Beet & Lentil Salad',   sub: 'goat cheese, walnut',      type: ['lunch'],           time: 18, kcal: 480, tags: ['Salad', 'Protein'],  tint: ['#9a3a4e', '#581a28'], pantry: ['beets','lentils','feta','walnut','arugula'] },
  { id: 'sl_tabou', name: 'Tabbouleh Bowl',        sub: 'parsley, bulgur, lemon',   type: ['lunch'],           time: 12, kcal: 380, tags: ['Salad', 'Light'],    tint: ['#7a9a4a', '#3e5e1c'], pantry: ['bulgur','parsley','tomato','cucumber','lemon'] },

  // ─────────── Smoothies (light lunch alternatives) ───────────
  { id: 'sm_berry', name: 'Berry Protein Smoothie', sub: 'banana, oats, almond butter', type: ['lunch'],       time: 5,  kcal: 380, tags: ['Smoothie', 'Quick'],  tint: ['#9c4a6a', '#5a2034'], pantry: ['berries','banana','oats','almond_butter','milk'] },
  { id: 'sm_green', name: 'Green Glow Smoothie',   sub: 'spinach, mango, ginger',   type: ['lunch'],           time: 5,  kcal: 320, tags: ['Smoothie', 'Light'],  tint: ['#6a9a52', '#2c5e2a'], pantry: ['spinach','mango','ginger','banana','milk'] },
  { id: 'sm_choco', name: 'Cocoa Banana Smoothie', sub: 'oats, cocoa, peanut butter', type: ['lunch'],         time: 5,  kcal: 420, tags: ['Smoothie', 'Treat'],  tint: ['#7a4a2a', '#3e2410'], pantry: ['banana','oats','cocoa','peanut_butter','milk'] },
  { id: 'sm_mango', name: 'Mango Lassi Smoothie',  sub: 'cardamom, honey',          type: ['lunch'],           time: 5,  kcal: 360, tags: ['Smoothie', 'Quick'],  tint: ['#e6a84a', '#a0681c'], pantry: ['mango','yogurt','cardamom','honey','milk'] },

  // ─────────── Other ───────────
  { id: 'pasta',    name: 'Pasta Arrabiata',       sub: 'garlic, chili, parsley',   type: ['dinner'],          time: 20, kcal: 620, tags: ['Pasta', 'Comfort'],  tint: ['#c45838', '#702818'], pantry: ['pasta','tomato','garlic','chili','parsley'], img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=400&q=80' },
  { id: 'fried',    name: 'Tofu Fried Rice',       sub: 'sesame, scallion',         type: ['dinner'],          time: 18, kcal: 540, tags: ['Asian', 'Quick'],    tint: ['#b88a4a', '#6a4a1a'], pantry: ['rice','tofu','scallion','soy_sauce','egg'] },
  { id: 'soup',     name: 'Lentil Soup + Bread',   sub: 'tomato, smoked paprika',   type: ['dinner'],          time: 25, kcal: 460, tags: ['Soup', 'Light'],     tint: ['#b8593a', '#6a2818'], pantry: ['lentils','tomato','onion','paprika','bread'], img: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=400&q=80' },
];

// Tint palette for new custom meals — cycled through.
const CUSTOM_TINTS = [
  ['#a87a4a', '#5a3a1c'], ['#7aa05a', '#3a5e2a'], ['#9c4a6a', '#5a2034'],
  ['#cc6e3a', '#823a16'], ['#5e8c5e', '#2a4e2a'], ['#b89a5a', '#7a5e28'],
  ['#c2613e', '#8c3c20'], ['#7a4a2a', '#3e2410'],
];

// Master pantry list — what the user can tick off. Grouped by aisle.
const PANTRY_MASTER = {
  'Grains & Starches': ['rice','basmati_rice','quinoa','pasta','bread','tortilla','pita','flour','wheat_flour','oats','bulgur'],
  'Legumes & Protein': ['chickpeas','kidney_beans','black_beans','lentils','toor_dal','moong_dal','tofu','paneer','egg','peanut','walnut'],
  'Vegetables':        ['onion','tomato','potato','spinach','cauliflower','peppers','cucumber','mushroom','sweet_potato','garlic','ginger','red_onion','scallion','mixed_veg','vegetables','cabbage','carrot','corn','beets','arugula','kale'],
  'Fruits':            ['banana','berries','mango','lemon','lime'],
  'Dairy & Cold':      ['cheese','mozzarella','feta','parmesan','yogurt','cream','ghee','milk','mayo','hummus','salsa','almond_butter','peanut_butter'],
  'Spices & Pantry':   ['turmeric','cumin','garam_masala','sambar_powder','biryani_masala','chili','paprika','tahini','soy_sauce','olive_oil','olives','tamarind','dill','basil','parsley','thyme','cilantro','avocado','cocoa','honey','cardamom'],
};

// Pretty labels for ingredient keys.
const PRETTY = {
  chickpeas: 'Chickpeas', kidney_beans: 'Kidney beans', black_beans: 'Black beans',
  toor_dal: 'Toor dal', moong_dal: 'Moong dal', basmati_rice: 'Basmati rice',
  wheat_flour: 'Wheat flour', red_onion: 'Red onion', sweet_potato: 'Sweet potato',
  garam_masala: 'Garam masala', sambar_powder: 'Sambar powder',
  biryani_masala: 'Biryani masala', soy_sauce: 'Soy sauce', olive_oil: 'Olive oil',
  mixed_veg: 'Mixed veg', almond_butter: 'Almond butter', peanut_butter: 'Peanut butter',
};
const pretty = (k) => PRETTY[k] || k.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

// Recipe steps — short, no fluff.
const RECIPES = {
  chana: ['Sauté onion + ginger 4 min.','Add tomato, cook to paste 6 min.','Stir in spices + chickpeas, simmer 12 min.','Finish with lemon + cilantro. Serve over rice.'],
  rajma: ['Soak beans overnight; pressure-cook 25 min.','Build masala: onion, tomato, garlic.','Combine, simmer 15 min.','Serve with steamed rice.'],
  dal: ['Pressure-cook dal with turmeric.','Make tadka: ghee, cumin, garlic, chili.','Pour over dal. Salt to taste.','Serve with jeera rice.'],
  palak: ['Blanch + blend spinach.','Sear paneer cubes; set aside.','Cook spinach with cream + spices.','Add paneer; simmer 5 min.'],
  aloogobi: ['Cube potato + cauliflower.','Cook with onion, turmeric, cumin.','Cover + steam 15 min.','Garnish with cilantro.'],
  biryani: ['Layer parboiled rice + masala veg.','Steam-cook 20 min on low.','Rest 5 min before opening.','Fluff and serve with raita.'],
  chole: ['Cook chickpeas with tea bag (color).','Make masala: onion, tomato, chole spice.','Combine, simmer.','Fry bhature; serve hot.'],
  khichdi: ['Rinse rice + dal together.','Pressure-cook with ghee + cumin.','Adjust consistency with hot water.','Top with more ghee.'],
  sambar: ['Cook dal soft.','Boil veg with tamarind + sambar powder.','Combine; finish with tadka.','Serve over hot rice.'],
  chsand: ['Smash chickpeas roughly.','Mix with mayo, lemon, dill, salt.','Pile on toasted sourdough.','Top with red onion + lettuce.'],
  caprese: ['Slice tomato + mozz thick.','Layer with basil on toasted bread.','Drizzle olive oil + balsamic.','Salt, pepper, eat fast.'],
  grilled: ['Char peppers + onion in pan.','Warm tortilla 30s/side.','Spread hummus, fill, roll tight.','Cut diagonal.'],
  paneerq: ['Crumble paneer; toss with masala.','Layer in tortilla with cheese.','Pan-fry both sides crispy.','Serve with pickled onion.'],
  beanq: ['Mash beans with cumin + lime.','Spread on tortilla, cheese, fold.','Crisp in dry pan, both sides.','Top with avocado crema.'],
  mushq: ['Sauté mushroom + thyme until dry.','Layer with gruyère.','Crisp in butter, both sides.','Cut in quarters.'],
  burrito: ['Warm rice + beans.','Layer in tortilla with salsa + cheese.','Tuck sides, roll tight.','Sear seam down 1 min.'],
  medsalad: ['Combine chickpea, cucumber, tomato.','Toss with olive oil + lemon.','Top with feta + olives.','Salt to taste.'],
  quinoa: ['Cook quinoa + lentils together.','Roast sweet potato cubes.','Whisk tahini + lemon dressing.','Assemble bowl, drizzle.'],
  greek: ['Chunky-cut cucumber + tomato.','Add olives + feta.','Toss with olive oil + oregano.','Serve with hummus + pita.'],
  avo: ['Mash chickpeas + avocado.','Add lemon, chili, red onion.','Salt + pepper.','Eat with crackers or as is.'],
  pasta: ['Boil pasta al dente.','Sauté garlic + chili in oil.','Add tomato, simmer 8 min.','Toss with pasta + parsley.'],
  fried: ['Cube + sear tofu.','Push aside; scramble egg.','Add cold rice + soy.','Top with scallion + sesame.'],
  soup: ['Sauté onion + paprika.','Add lentils + tomato + stock.','Simmer 20 min until soft.','Serve with crusty bread.'],
  sm_berry: ['Add berries, banana, oats to blender.','Spoon in almond butter, milk.','Blend 60s until smooth.','Pour, top with extra oats.'],
  sm_green: ['Combine spinach, mango, banana.','Add ginger + milk.','Blend 90s until silky.','Drink immediately.'],
  sm_choco: ['Banana, oats, cocoa, peanut butter.','Splash of milk, blend.','Taste — sweeten if needed.','Pour over a few ice cubes.'],
  sm_mango: ['Mango, yogurt, milk, cardamom.','Drizzle of honey.','Blend 60s.','Pinch of cardamom on top.'],
  sl_kale:  ['Massage kale with lemon + salt 1 min.','Toast bread cubes for croutons.','Toss kale with parmesan + dressing.','Top with croutons.'],
  sl_thai:  ['Shred cabbage + carrot.','Whisk peanut + lime dressing.','Toss with crispy tofu.','Top with peanuts.'],
  sl_corn:  ['Char corn (or use canned).','Combine with black beans + cotija.','Toss with cilantro lime.','Eat with chips.'],
  sl_beet:  ['Roast beets 35 min, peel, cube.','Cook lentils, drain.','Toss with arugula + walnut.','Crumble goat cheese on top.'],
  sl_tabou: ['Soak bulgur 15 min, drain.','Chop parsley fine.','Toss with tomato, cucumber, lemon.','Rest 10 min before eating.'],
};

// Day labels (Mon–Fri default, but tweakable up to 7).
const DAYS_FULL = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const DAYS_LONG = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

// ─── Custom meal helpers ──────────────────────────────────────────────────
// User-added meals live alongside built-ins. They have a `custom: true` flag
// so the UI can show an edit/delete affordance. `pantry` is parsed from a
// comma-separated free-text list — keys are slugged so they participate in
// the shopping-list math.
let _customCounter = 1;
function makeCustomMeal({ name, sub, type, ingredients }) {
  const slug = (s) => s.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const tint = CUSTOM_TINTS[(_customCounter - 1) % CUSTOM_TINTS.length];
  const pantry = (ingredients || '')
    .split(',').map(s => slug(s)).filter(Boolean);
  const id = 'custom_' + Date.now().toString(36) + '_' + (_customCounter++);
  return {
    id, name: name.trim(), sub: (sub || '').trim() || ingredients.split(',').slice(0, 3).join(', '),
    type: Array.isArray(type) ? type : [type],
    time: 15, kcal: 450,
    tags: ['Custom'],
    tint, pantry,
    custom: true,
    recipe: ['Your recipe — add steps later.'],
  };
}

// Seedable shuffle so styles can repro the same week. NO repeats within a
// week (Fisher–Yates pick). If the pool is smaller than `daysCount` we cycle
// — only happens if the user prunes hard.
function makePlan(daysCount, seed, mealsArg) {
  const meals = mealsArg || BUILTIN_MEALS;
  const lunchPool = meals.filter(m => m.type.includes('lunch'));
  const dinnerPool = meals.filter(m => m.type.includes('dinner'));
  const rand = mulberry32(seed);

  const pickUnique = (pool, n) => {
    const arr = pool.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    if (arr.length >= n) return arr.slice(0, n);
    const out = [];
    while (out.length < n) out.push(arr[out.length % Math.max(1, arr.length)]);
    return out;
  };

  const lunches = pickUnique(lunchPool, daysCount);
  const dinners = pickUnique(dinnerPool, daysCount);

  return Array.from({ length: daysCount }, (_, i) => ({
    day: DAYS_FULL[i],
    dayLong: DAYS_LONG[i],
    lunch: lunches[i],
    dinner: dinners[i],
    eatingOut: false,
  }));
}

function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Pantry-aware shopping list: any pantry item across the week's meals that
// the user hasn't ticked.
function buildShoppingList(plan, ownedSet) {
  const need = new Map();
  for (const day of plan) {
    if (day.eatingOut) continue;
    for (const meal of [day.lunch, day.dinner]) {
      if (!meal) continue;
      for (const ing of meal.pantry) {
        if (ownedSet.has(ing)) continue;
        need.set(ing, (need.get(ing) || 0) + 1);
      }
    }
  }
  const byAisle = {};
  for (const [k, count] of need) {
    const aisle = Object.entries(PANTRY_MASTER).find(([, items]) => items.includes(k))?.[0] || 'Other';
    (byAisle[aisle] ||= []).push({ key: k, label: pretty(k), count });
  }
  for (const a in byAisle) byAisle[a].sort((x, y) => y.count - x.count);
  return byAisle;
}

// `MEALS` is the default exported set; the app keeps its own state including
// custom meals appended at runtime. Both apps read this for their initial
// list and then maintain user-added entries via setState.
const MEALS = BUILTIN_MEALS;

Object.assign(window, {
  MEALS, BUILTIN_MEALS, PANTRY_MASTER, PRETTY, RECIPES, DAYS_FULL, DAYS_LONG,
  pretty, makePlan, buildShoppingList, makeCustomMeal,
});
