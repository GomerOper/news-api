export default {
  routes: [
    {
      method: "GET",
      path: "/articles/featured",
      handler: "article.findFeatured",
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
