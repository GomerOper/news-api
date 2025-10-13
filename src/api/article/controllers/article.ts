import { factories } from "@strapi/strapi";

const DEFAULT_RELATIONS = ["coverImage", "category", "author"] as const;

function toPopulateObject(list: readonly string[]) {
  return list.reduce(
    (acc, key) => {
      acc[key] = true;
      return acc;
    },
    {} as Record<string, any>
  );
}

export default factories.createCoreController("api::article.article", () => ({
  async find(ctx) {
    const query = (ctx.query ?? {}) as Record<string, any>;
    ctx.query = query;

    if (!query.populate) {
      query.populate = toPopulateObject(DEFAULT_RELATIONS);
    } else if (typeof query.populate === "string") {
      const list = query.populate
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
      query.populate = toPopulateObject(list);
    }

    if (!query.sort) {
      query.sort = "publishedAt:desc";
    }
    const filters = (query.filters ?? {}) as Record<string, unknown>;
    const publishedFilter = (filters["publishedAt"] ?? {}) as Record<
      string,
      unknown
    >;
    query.filters = {
      ...filters,
      publishedAt: { ...publishedFilter, $notNull: true },
    };

    return super.find(ctx);
  },

  async featured(ctx) {
    const query = (ctx.query ?? {}) as Record<string, any>;

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
