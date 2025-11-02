import { factories } from "@strapi/strapi";

const DEFAULT_RELATIONS = ["coverImage", "category", "author"] as const;

function toPopulateObject(list: readonly string[]): Record<string, boolean> {
  return list.reduce(
    (acc, key) => {
      acc[key] = true;
      return acc;
    },
    {} as Record<string, boolean>
  );
}

export default factories.createCoreController("api::article.article", () => ({
  async find(ctx: any) {
    const query = ctx.query ?? {};

    if (!query.populate) {
      query.populate = toPopulateObject(DEFAULT_RELATIONS);
    } else if (typeof query.populate === "string") {
      query.populate = toPopulateObject(
        query.populate
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean)
      );
    }

    if (!query.sort) {
      query.sort = "publishedAt:desc";
    }

    const filters = query.filters ?? {};
    const publishedFilter = filters.publishedAt ?? {};
    query.filters = {
      ...filters,
      publishedAt: { ...publishedFilter, $notNull: true },
    };

    ctx.query = query;

    const { results, pagination } = await strapi
      .service("api::article.article")
      .find(query);

    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, { pagination });
  },

  async featured(ctx: any) {
    const query = ctx.query ?? {};

    query.filters = {
      ...(query.filters || {}),
      isFeatured: true,
      publishedAt: { $notNull: true },
    };

    query.sort = query.sort || "publishedAt:desc";
    query.populate = toPopulateObject(DEFAULT_RELATIONS);

    ctx.query = query;

    const { results, pagination } = await strapi
      .service("api::article.article")
      .find(query);

    const sanitizedResults = await this.sanitizeOutput(results, ctx);

    return this.transformResponse(sanitizedResults, { pagination });
  },
}));
