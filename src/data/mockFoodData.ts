import type { Restaurant, UserAddress, DriverInfo, Review } from '../types/food';

export const INITIAL_ADDRESSES: UserAddress[] = [
  {
    id: 'addr-1',
    label: 'Home',
    street: 'Plot 42, Jubilee Hills Road No. 36',
    area: 'Jubilee Hills',
    city: 'Hyderabad',
    zipCode: '500033',
    lat: 17.4319,
    lng: 78.4071
  },
  {
    id: 'addr-2',
    label: 'Work',
    street: 'CBIT Campus, IT Block, Gandipet',
    area: 'Gandipet / Financial Dist',
    city: 'Hyderabad',
    zipCode: '500075',
    lat: 17.3916,
    lng: 78.3184
  }
];

export const DEFAULT_DRIVER: DriverInfo = {
  id: 'drv-789',
  name: 'Vikram Singh',
  phone: '+91 98765 43210',
  vehicleNumber: 'TS 09 EZ 4521 (Electric Scooter)',
  rating: 4.9,
  currentLat: 17.4150,
  currentLng: 78.3600,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
};

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Paradise Dum Biryani & Kebabs',
    tagline: 'Authentic Hyderabadi Dum Biryani since 1953',
    cuisine: ['Hyderabadi', 'North Indian', 'Biryani', 'Mughlai'],
    rating: 4.8,
    ratingCount: 14200,
    deliveryTimeMinutes: 28,
    costForTwo: 550,
    isPureVeg: false,
    discountBadge: '50% OFF up to ₹100 | Code: SE2026',
    address: 'Near Cyber Towers, Hitec City, Hyderabad',
    heroImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 17.4483, lng: 78.3808 },
    categories: ['Biryani Special', 'Starters & Kebabs', 'Desserts & Drinks'],
    featuredItems: [
      {
        id: 'item-101',
        name: 'Royal Hyderabadi Mutton Dum Biryani',
        description: 'Slow-cooked tender mutton marinated in authentic spices, layered with fragrant long-grain Basmati rice and saffron infusion.',
        price: 380,
        category: 'Biryani Special',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=400&q=80',
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 8920,
        preparationTimeMinutes: 20,
        calories: 780,
        available: true,
        addonGroups: [
          {
            id: 'group-portion',
            title: 'Select Portion Size',
            required: true,
            maxSelect: 1,
            options: [
              { id: 'opt-reg', name: 'Regular (Serves 1)', price: 0 },
              { id: 'opt-jumbo', name: 'Jumbo Pack (Serves 2-3)', price: 220 }
            ]
          },
          {
            id: 'group-sides',
            title: 'Extra Accompaniments',
            required: false,
            maxSelect: 3,
            options: [
              { id: 'opt-mirchi', name: 'Mirchi ka Salan (Extra Bowl)', price: 35 },
              { id: 'opt-raita', name: 'Thick Cucumber Raita', price: 25 },
              { id: 'opt-egg', name: 'Boiled Egg (2 Pcs)', price: 30 }
            ]
          }
        ]
      },
      {
        id: 'item-102',
        name: 'Special Chicken Dum Biryani',
        description: 'Succulent chicken pieces layered with saffron spiced basmati rice, served with Mirchi ka Salan and Raita.',
        price: 310,
        category: 'Biryani Special',
        image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=400&q=80',
        isVeg: false,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 5410,
        preparationTimeMinutes: 18,
        calories: 690,
        available: true,
        addonGroups: [
          {
            id: 'group-extra-chicken',
            title: 'Extra Chicken Piece',
            required: false,
            options: [
              { id: 'opt-chk-1', name: 'Add Extra Leg Piece', price: 90 }
            ]
          }
        ]
      },
      {
        id: 'item-103',
        name: 'Tandoori Chicken Full',
        description: 'Whole chicken marinated in yogurt, garlic, ginger, and traditional tandoori spices, char-grilled to perfection.',
        price: 490,
        category: 'Starters & Kebabs',
        image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=400&q=80',
        isVeg: false,
        rating: 4.7,
        ratingCount: 3210,
        preparationTimeMinutes: 25,
        calories: 850,
        available: true
      },
      {
        id: 'item-104',
        name: 'Double Ka Meetha (Hyderabadi Shahi)',
        description: 'Traditional bread pudding dessert fried in pure ghee, soaked in saffron cardamon syrup & topped with dry fruits.',
        price: 130,
        category: 'Desserts & Drinks',
        image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=400&q=80',
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 1840,
        preparationTimeMinutes: 5,
        calories: 420,
        available: true
      }
    ]
  },
  {
    id: 'rest-2',
    name: 'Artisan Woodfired Pizza & Pasta',
    tagline: 'Neapolitan Sourdough Pizzas & Hand-crafted Pastas',
    cuisine: ['Italian', 'Pizzas', 'Pastas', 'Salads'],
    rating: 4.7,
    ratingCount: 8400,
    deliveryTimeMinutes: 24,
    costForTwo: 700,
    isPureVeg: false,
    discountBadge: '₹120 OFF on orders above ₹499',
    address: 'Road No 45, Jubilee Hills, Hyderabad',
    heroImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 17.4350, lng: 78.4010 },
    categories: ['Gourmet Pizzas', 'Handmade Pasta', 'Sides & Garlic Bread'],
    featuredItems: [
      {
        id: 'item-201',
        name: 'Truffle Mushroom & Mozzarella Pizza',
        description: 'Wild forest mushrooms, black truffle oil emulsion, fresh mozzarella di bufala on 48-hour fermented sourdough crust.',
        price: 495,
        category: 'Gourmet Pizzas',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 2980,
        preparationTimeMinutes: 18,
        calories: 610,
        available: true,
        addonGroups: [
          {
            id: 'pizza-crust',
            title: 'Choose Crust Style',
            required: true,
            options: [
              { id: 'c1', name: 'Classic Sourdough Neapolitan', price: 0 },
              { id: 'c2', name: 'Cheese Burst Stuffed Crust', price: 95 }
            ]
          }
        ]
      },
      {
        id: 'item-202',
        name: 'Smoked Pepperoni & Jalapeño Feast',
        description: 'Artisanal spicy pork pepperoni slices, pickled jalapeños, San Marzano tomato sauce, double mozzarella.',
        price: 560,
        category: 'Gourmet Pizzas',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80',
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 3510,
        preparationTimeMinutes: 20,
        calories: 740,
        available: true
      },
      {
        id: 'item-203',
        name: 'Creamy Pesto Fettuccine Al Dente',
        description: 'Fresh basil pine-nut pesto emulsion tossed with extra virgin olive oil, parmesan reggiano & roasted cherry tomatoes.',
        price: 410,
        category: 'Handmade Pasta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281313?auto=format&fit=crop&w=400&q=80',
        isVeg: true,
        rating: 4.6,
        ratingCount: 1420,
        preparationTimeMinutes: 15,
        calories: 520,
        available: true
      }
    ]
  },
  {
    id: 'rest-3',
    name: 'Craft Burger Co. & Shakes',
    tagline: 'Smackingly Juicy Smash Burgers & Thick Milkshakes',
    cuisine: ['American', 'Burgers', 'Fast Food', 'Shakes'],
    rating: 4.6,
    ratingCount: 6200,
    deliveryTimeMinutes: 22,
    costForTwo: 450,
    isPureVeg: false,
    discountBadge: 'Flat 20% OFF | Code: CBITFOOD',
    address: 'Inorbit Mall Food Court, Hitec City',
    heroImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 17.4378, lng: 78.3820 },
    categories: ['Smash Burgers', 'Fries & Loaded Sides', 'Thickshakes'],
    featuredItems: [
      {
        id: 'item-301',
        name: 'The Ultimate Double Bacon Cheese Smash Burger',
        description: 'Dual smashed Angus beef patties, crispy bacon strip, melted cheddar cheese, caramelized onions, signature secret sauce in a toasted brioche bun.',
        price: 360,
        category: 'Smash Burgers',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
        isVeg: false,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 4200,
        preparationTimeMinutes: 14,
        calories: 820,
        available: true
      },
      {
        id: 'item-302',
        name: 'Crispy Paneer & Jalapeño Crunch Burger',
        description: 'Herb-crusted crispy paneer patty, spicy harissa mayo, pickled jalapeños, lettuce & sliced tomatoes.',
        price: 260,
        category: 'Smash Burgers',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=400&q=80',
        isVeg: true,
        rating: 4.6,
        ratingCount: 2150,
        preparationTimeMinutes: 12,
        calories: 590,
        available: true
      },
      {
        id: 'item-303',
        name: 'Belgian Chocolate Nutella Thickshake',
        description: 'Rich dark Belgian chocolate blended with Nutella spread, whole milk & topped with whipped cream.',
        price: 190,
        category: 'Thickshakes',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80',
        isVeg: true,
        isBestseller: true,
        rating: 4.8,
        ratingCount: 1890,
        preparationTimeMinutes: 5,
        calories: 450,
        available: true
      }
    ]
  },
  {
    id: 'rest-4',
    name: 'Green Leaf Organic Bowl & Juices',
    tagline: '100% Pure Veg Nourishment & Cold Pressed Juices',
    cuisine: ['Healthy', 'Salads', 'Vegan', 'Juices'],
    rating: 4.9,
    ratingCount: 3800,
    deliveryTimeMinutes: 19,
    costForTwo: 500,
    isPureVeg: true,
    discountBadge: 'Free Cold-Pressed Detox Juice',
    address: 'Financial District, Gachibowli, Hyderabad',
    heroImage: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    coordinates: { lat: 17.4180, lng: 78.3420 },
    categories: ['Power Grain Bowls', 'Cold-Pressed Juices', 'Vegan Smoothies'],
    featuredItems: [
      {
        id: 'item-401',
        name: 'Avocado Quinoa Mediterranean Bowl',
        description: 'Fresh Haas avocado, organic quinoa, chickpeas, cherry tomatoes, kalamata olives & lemon tahini dressing.',
        price: 340,
        category: 'Power Grain Bowls',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
        isVeg: true,
        isBestseller: true,
        rating: 4.9,
        ratingCount: 1950,
        preparationTimeMinutes: 10,
        calories: 390,
        available: true
      }
    ]
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userName: 'Ananya Sharma (CBIT Student)',
    rating: 5,
    date: '2 hours ago',
    comment: 'The Mutton Dum Biryani from Paradise arrived piping hot within 22 minutes! Super juicy meat and rich saffron flavor.',
    restaurantId: 'rest-1',
    dishName: 'Royal Hyderabadi Mutton Dum Biryani',
    tags: ['Super Fast Delivery', 'Hot & Fresh', 'Great Portion']
  },
  {
    id: 'rev-2',
    userName: 'Rahul Verma',
    rating: 5,
    date: 'Yesterday',
    comment: 'Artisan Woodfired Pizza is top notch! Sourdough crust had perfect leopard char spots and truffle oil aroma was insane.',
    restaurantId: 'rest-2',
    dishName: 'Truffle Mushroom & Mozzarella Pizza',
    tags: ['Authentic Taste', 'Packaging 10/10']
  }
];
