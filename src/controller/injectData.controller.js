import { faker } from "@faker-js/faker";
import { User, Product } from "../models/Dynamic.model.js";
import { redis } from "../app.js";

export const injectMockDataController = async (req, res) => {
  try {
    console.log("Admin triggered data reset. Wiping database... 🧼");

    // Clear existing data to maintain testing baselines
    await User.deleteMany({});
    await Product.deleteMany({});

    // CRUCIAL: Clear your Redis analytics cache so old data doesn't stick around
    await redis.del("admin_analytics_cache");

    // 1. Generate 100 Shoppers
    const mockUsers = [];
    for (let i = 0; i < 100; i++) {
      mockUsers.push({
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        role: "customer",
      });
    }
    const createdUsers = await User.insertMany(mockUsers);

    // 2. Setup categories
    const categories = [
      "electronics",
      "apparel",
      "home-living",
      "fitness",
      "books",
    ];

    // 3. Generate 500 Dense Products
    const mockProducts = [];
    for (let i = 0; i < 500; i++) {
      const reviewCount = faker.number.int({ min: 2, max: 15 });
      const productReviews = [];

      for (let r = 0; r < reviewCount; r++) {
        const randomUser =
          createdUsers[
            faker.number.int({ min: 0, max: createdUsers.length - 1 })
          ];
        productReviews.push({
          userId: randomUser._id,
          rating: faker.number.int({ min: 1, max: 5 }),
          comment: faker.lorem.sentence(),
        });
      }

      mockProducts.push({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 1200 })),
        category: faker.helpers.arrayElement(categories),
        stock: faker.number.int({ min: 5, max: 250 }),
        salesCount: faker.number.int({ min: 50, max: 5000 }),
        reviews: productReviews,
      });
    }

    await Product.insertMany(mockProducts);
    console.log("Database successfully re-seeded via API! 🚀");

    return res.status(201).json({
      success: true,
      message:
        "Database wiped, fresh mock traffic data injected, and Redis cache cleared successfully!",
      stats: {
        usersInjected: createdUsers.length,
        productsInjected: mockProducts.length,
      },
    });
  } catch (error) {
    console.error("Data injection route failure:", error);
    return res.status(500).json({
      success: false,
      message: "Critical failure during automated data injection.",
      error: error.message,
    });
  }
};
