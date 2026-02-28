import fs from "fs";

export default function(eleventyConfig) {
  eleventyConfig.addShortcode("embedJS", function(path) {
    return `<pre><code class="language-js">${fs.readFileSync(path, "utf8")}</code></pre>`;
  });
  eleventyConfig.addShortcode("figmaEmbed", function(url, id = "") {
    const idAttr = id ? `id="${id}"` : "";
    return `<iframe ${idAttr} class="figma-embed" src="https://www.figma.com/embed?embed_host=share&url=${url}" allowfullscreen></iframe>`;
  });
  eleventyConfig.addShortcode("externalLinkIcon", function(size = "1.2rem", fill = "currentColor") {
    return `<svg xmlns="http://www.w3.org/2000/svg" height="${size}" viewBox="0 0 24 24" width="${size}" fill="${fill}">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
    </svg>`;
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