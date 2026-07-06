const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const site = require("./src/_data/site.json");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/site.js");

  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: site.url,
    },
  });

  eleventyConfig.addCollection("articulos", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/articulos/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("categories", function (collectionApi) {
    const categories = new Set();
    collectionApi.getFilteredByGlob("src/articulos/*.md").forEach((item) => {
      if (item.data.category) categories.add(item.data.category);
    });
    return [...categories].sort();
  });

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return new Date(dateObj).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return new Date(dateObj).toISOString().slice(0, 10);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
  };
};
