import { redis } from "../app.js";
import { categoryPerformanceCacheKey } from "../constants/redis.contants.js";
import { Product } from "../models/Dynamic.model.js";

const getAnalyticsController = async (req, res) => {
  try {
    const categoryPerformance = await Product.aggregate([
      {
        $unwind: {
          path: "$reviews",
          includeArrayIndex: "reviewIndex",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $group: {
          _id: "$category",
          avarageRating: { $avg: "$reviews.rating" },
          totalRevenue: { $sum: { $multiply: ["$price", "$salesCount"] } },
          totalItemsStock: { $sum: "$stock" },
        },
      },

      { $sort: { totalRevenue: -1 } },
    ]);

    const categoryPerformanceResult = categoryPerformance.map((category) => {
      const totalRevenue = category.totalRevenue;
      const avarageRating = category.avarageRating;
      const totalItemsStock = category.totalItemsStock;

      const result = {
        category: category._id,
        revenue: totalRevenue,
        rating: avarageRating,
        stock: totalItemsStock,
      };

      return result;
    });

    const categoryPerformanceCacheKeyExists = await redis.exists(
      categoryPerformanceCacheKey,
    );

    if (categoryPerformanceCacheKeyExists) {
      await redis.del(categoryPerformanceCacheKey);
    } else {
      await redis.set(
        categoryPerformanceCacheKey,
        JSON.stringify(categoryPerformanceResult),
        "EX",
        3600,
      );
    }

    const categoryPerformanceCache = await redis.get(
      categoryPerformanceCacheKey,
    );

    return res
      .status(200)
      .json({ categoryPerformance: JSON.parse(categoryPerformanceCache) });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching analytics", error: error.message });
  }
};

export { getAnalyticsController };
