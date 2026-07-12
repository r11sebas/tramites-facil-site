const sitemap = require("@quasibit/eleventy-plugin-sitemap");
const site = require("./src/_data/site.json");
const categories = require("./src/_data/categories.json");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/ads.txt");
  eleventyConfig.addPassthroughCopy("src/site.js");
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon-32.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/og-image.png");

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

  eleventyConfig.addGlobalData("currentYear", () => new Date().getFullYear());

  eleventyConfig.addFilter("categorySlug", (name) => {
    const cat = categories.find((c) => c.name === name);
    return cat ? cat.slug : "";
  });

  eleventyConfig.addFilter("categoryColor", (name) => {
    const cat = categories.find((c) => c.name === name);
    return cat ? cat.color : "#1f5fbf";
  });

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

  eleventyConfig.addFilter("rssDate", (dateObj) => {
    return new Date(dateObj).toUTCString();
  });

  eleventyConfig.addFilter("relatedArticles", (articles, category, currentUrl, limit) => {
    return articles
      .filter((a) => a.data.category === category && a.url !== currentUrl)
      .slice(0, limit || 3);
  });

  eleventyConfig.addFilter("featuredArticles", (articles, limit) => {
    return articles.filter((a) => a.data.featured === true).slice(0, limit || 4);
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
