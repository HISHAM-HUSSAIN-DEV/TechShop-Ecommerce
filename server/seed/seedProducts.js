console.log("Seed started");
import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/Product.js";

dotenv.config();

const products = [
    {
        _id: 1,
        name: "iPhone 16 Pro",
        description: "Premium Apple smartphone with advanced camera system.",
        price: 4999,
        image: "/ProductImages/iphone16pro.png",
        category: "Phones",
        stock: 8,

    },
    {
        _id: 2,
        name: "Samsung Galaxy S25 Ultra",
        description: "Flagship Android smartphone with AI features.",
        price: 4699,
        image: "/ProductImages/galaxys25ultra.png",
        category: "Phones",
        stock: 5,

    },
    {
        _id: 3,
        name: "Google Pixel 10 Pro",
        description: "Google flagship phone with exceptional camera quality.",
        price: 4299,
        image: "/ProductImages/pixel10pro.png",
        category: "Phones",
        stock: 6,

    },
    {
        _id: 4,
        name: "MacBook Air M4",
        description: "Lightweight laptop powered by Apple's M4 chip.",
        price: 5499,
        image: "/ProductImages/macbookairm4.png",
        category: "Laptops",
        stock: 7,

    },
    {
        _id: 5,
        name: "Dell XPS 15",
        description: "Premium Windows laptop with InfinityEdge display.",
        price: 6999,
        image: "/ProductImages/dellxps15.png",
        category: "Laptops",
        stock: 4,

    },
    {
        _id: 6,
        name: "ASUS ROG Strix G16",
        description: "Gaming laptop with RGB keyboard and RTX graphics.",
        price: 7499,
        image: "/ProductImages/rogstrixg16.png",
        category: "Laptops",
        stock: 9,

    },
    {
        _id: 7,
        name: "MSI Katana 17",
        description: "High-performance gaming laptop for gamers.",
        price: 5899,
        image: "/ProductImages/msikatana17.png",
        category: "Laptops",
        stock: 5,

    },
    {
        _id: 8,
        name: "Acer Nitro V 15",
        description: "Affordable gaming laptop with RTX graphics.",
        price: 4299,
        image: "/ProductImages/acernitrov15.png",
        category: "Laptops",
        stock: 8,

    },
    {
        _id: 9,
        name: "iPad Air M3",
        description: "Powerful tablet with Apple M3 processor.",
        price: 2999,
        image: "/ProductImages/ipadairm3.png",
        category: "Tablets",
        stock: 7,

    },
    {
        _id: 10,
        name: "Samsung Galaxy Tab S10",
        description: "Premium Android tablet with AMOLED display.",
        price: 2699,
        image: "/ProductImages/galaxytabs10.png",
        category: "Tablets",
        stock: 4,

    },
    {
        _id: 11,
        name: "Apple Watch Series 10",
        description: "Smartwatch with health and fitness tracking.",
        price: 1899,
        image: "/ProductImages/applewatch10.png",
        category: "Smart Watches",
        stock: 6,

    },
    {
        _id: 12,
        name: "Samsung Galaxy Watch Ultra",
        description: "Premium smartwatch built for outdoor adventures.",
        price: 2199,
        image: "/ProductImages/watchultra.png",
        category: "Smart Watches",
        stock: 3,

    },
    {
        _id: 13,
        name: "Sony WH-1000XM5",
        description: "Noise-cancelling wireless headphones.",
        price: 1499,
        image: "/ProductImages/sonyxm5.png",
        category: "Headphones",
        stock: 8,

    },
    {
        _id: 14,
        name: "Apple AirPods Pro 2",
        description: "Wireless earbuds with active noise cancellation.",
        price: 999,
        image: "/ProductImages/airpodspro2.png",
        category: "Headphones",
        stock: 9,

    },
    {
        _id: 15,
        name: "Sony INZONE H9",
        description: "Wireless gaming headset with immersive audio.",
        price: 1199,
        image: "/ProductImages/inzoneh9.png",
        category: "Headphones",
        stock: 5,

    },
    {
        _id: 16,
        name: "PlayStation 5 Slim",
        description: "Next-generation gaming console.",
        price: 2199,
        image: "/ProductImages/ps5slim.png",
        category: "Gaming",
        stock: 6,

    },
    {
        _id: 17,
        name: "Xbox Series X",
        description: "Powerful gaming console with 4K support.",
        price: 2099,
        image: "/ProductImages/xboxseriesx.png",
        category: "Gaming",
        stock: 7,

    },
    {
        _id: 18,
        name: "Nintendo Switch OLED",
        description: "Portable gaming console with OLED screen.",
        price: 1499,
        image: "/ProductImages/switcholed.png",
        category: "Gaming",
        stock: 5,

    },
    {
        _id: 19,
        name: "Meta Quest 3",
        description: "Standalone VR headset for immersive gaming.",
        price: 2399,
        image: "/ProductImages/metaquest3.png",
        category: "VR",
        stock: 8,

    },
    {
        _id: 20,
        name: "Canon EOS R50",
        description: "Mirrorless camera for creators.",
        price: 3499,
        image: "/ProductImages/canoneosr50.png",
        category: "Cameras",
        stock: 4,

    },
    {
        _id: 21,
        name: "GoPro HERO13 Black",
        description: "Action camera for adventures.",
        price: 1799,
        image: "/ProductImages/gopro13.png",
        category: "Cameras",
        stock: 6,

    },
    {
        _id: 22,
        name: "DJI Mini 4 Pro",
        description: "Compact drone capable of shooting 4K video.",
        price: 3399,
        image: "/ProductImages/djimini4pro.png",
        category: "Cameras",
        stock: 3,

    },
    {
        _id: 23,
        name: "Logitech MX Master 3S",
        description: "Professional wireless productivity mouse.",
        price: 449,
        image: "/ProductImages/mxmaster3s.png",
        category: "Accessories",
        stock: 9,

    },
    {
        _id: 24,
        name: "Razer BlackWidow V4",
        description: "Mechanical RGB gaming keyboard.",
        price: 699,
        image: "/ProductImages/blackwidowv4.png",
        category: "Accessories",
        stock: 5,

    },
    {
        _id: 25,
        name: "Anker Power Bank 20000mAh",
        description: "Fast-charging portable power bank.",
        price: 249,
        image: "/ProductImages/anker20000.png",
        category: "Accessories",
        stock: 8,

    },
    {
        _id: 26,
        name: "UGREEN USB-C Hub",
        description: "Multi-port USB-C adapter for laptops.",
        price: 179,
        image: "/ProductImages/ugreenhub.png",
        category: "Accessories",
        stock: 6,

    },
    {
        _id: 27,
        name: "TP-Link Archer AX55",
        description: "Wi-Fi 6 router for fast and reliable networking.",
        price: 499,
        image: "/ProductImages/archerax55.png",
        category: "Networking",
        stock: 4,

    },
    {
        _id: 28,
        name: "JBL Charge 5",
        description: "Portable Bluetooth speaker with rich bass.",
        price: 649,
        image: "/ProductImages/jblcharge5.png",
        category: "Speakers",
        stock: 7,

    },
    {
        _id: 29,
        name: "Marshall Emberton II",
        description: "Compact speaker with signature Marshall sound.",
        price: 799,
        image: "/ProductImages/emberton2.png",
        category: "Speakers",
        stock: 5,

    },
    {
        _id: 30,
        name: "LG UltraGear 27",
        description: "27-inch QHD gaming monitor with 165Hz refresh rate.",
        price: 1699,
        image: "/ProductImages/lgultragear27.png",
        category: "Monitors",
        stock: 8,

    }
];

const seedProducts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        // Remove existing products
        await Product.deleteMany();

        // Add products
        await Product.insertMany(products);

        console.log("Products seeded successfully!");
        console.log(`${products.length} products added.`);

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
};

seedProducts();