/**
 * article controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::article.article", {
  async findFeatured(ctx) {
    try {
      const featuredArticles = await strapi.entityService.findMany(
        "api::article.article",
        {
          filters: {
            isFeatured: true,
          },
          populate: "*",
        }
      );

      const sanitizedArticles = await this.sanitizeOutput(
        featuredArticles,
        ctx
      );

      return sanitizedArticles;
    } catch (error) {
      ctx.throw(500, error);
    }
  },
});
