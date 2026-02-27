import fs from "fs";

export default function(eleventyConfig) {
  eleventyConfig.addShortcode("embedJS", function(path) {
    return `<pre><code class="language-js">${fs.readFileSync(path, "utf8")}</code></pre>`;
  });
  eleventyConfig.addShortcode("figmaEmbed", function(url, id = "") {
    const idAttr = id ? `id="${id}"` : "";
    return `<iframe ${idAttr} class="figma-embed" src="https://www.figma.com/embed?embed_host=share&url=${url}" allowfullscreen></iframe>`;
  });
  eleventyConfig.addPassthroughCopy("./src/assets");
  eleventyConfig.addPassthroughCopy("CNAME");

  return {
    dir: {
      input: "src",
      output: "public",
    },
    pathPrefix: "/"
  };
}