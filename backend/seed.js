import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const foodSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true },
  image:       { type: String, required: true },
  category:    { type: String, required: true },
});
const Food = mongoose.models.food || mongoose.model("food", foodSchema);

const items = [
  { name: "Chicken Biryani",       category: "Biryani",   price: 350, image: "biryani.jpg",       description: "Fragrant basmati rice cooked with tender chicken, whole spices, and saffron. A Bahawalpur classic." },
  { name: "Beef Karahi",           category: "Karahi",    price: 950, image: "karahi.jpg",         description: "Slow-cooked beef in a rich tomato and spice gravy, finished with fresh ginger and coriander." },
  { name: "Chicken Tikka Boti",    category: "BBQ",       price: 550, image: "tikka.jpg",          description: "Juicy chicken pieces marinated in spiced yoghurt and char-grilled in a traditional tandoor." },
  { name: "Seekh Kabab",           category: "BBQ",       price: 420, image: "kabab.jpg",          description: "Hand-minced beef kababs blended with herbs and grilled on skewers. Served with chutney." },
  { name: "Mutton Karahi",         category: "Karahi",    price: 1200, image: "mutton_karahi.jpg", description: "Premium mutton slow-cooked in a karahi with tomatoes, green chillies, and house spices." },
  { name: "Zarda",                 category: "Desserts",  price: 180, image: "zarda.jpg",          description: "Sweet saffron rice garnished with dry fruits, silver leaf, and rose water. A festive favourite." },
  { name: "Rogni Naan",            category: "Bread",     price: 60,  image: "naan.jpg",           description: "Soft, sesame-topped naan baked in a clay oven. Perfect with any karahi or gravy." },
  { name: "Lassi",                 category: "Drinks",    price: 120, image: "lassi.jpg",          description: "Thick and creamy hand-churned yoghurt drink, plain or sweetened with sugar." },
  { name: "4 Person Deal",         category: "Deals",     price: 3100, image: "deal_4person.jpg",  description: "Half Chicken Tikka, Half Tikka Boti, 1 Full Biryani, 1.5L Soft Drink, 1 Margh, Half Zarda." },
  { name: "BBQ Platter",           category: "Deals",     price: 3600, image: "deal_bbq.jpg",      description: "Half Chicken Biryani, Half Tikka Boti, 2 Sadaa Naan, 3 Roti, Half Beef Kabab, 1.5L Drink." },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB");
  await Food.deleteMany({});
  await Food.insertMany(items);
  console.log(`Seeded ${items.length} food items`);
  await mongoose.disconnect();
}

seed().catch(console.error);
