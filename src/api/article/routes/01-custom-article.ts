export default {
  routes: [
    {
      method: "GET",
      path: "/articles/featured",
      handler: "article.featured",
      config: {
        auth: false,
      },
    },
  ],
};
