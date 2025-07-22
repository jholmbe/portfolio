import fs from "fs";

export default function(eleventyConfig) {
  eleventyConfig.addShortcode("embedJS", function(path) {
    return `<pre><code class="language-js">${fs.readFileSync(path, "utf8")}</code></pre>`;
  });

  eleventyConfig.addPassthroughCopy("./src/styles.css");
  eleventyConfig.addPassthroughCopy("./src/assets");
  
  return {
    dir: {
      input: "src",
      output: "public"
    }
  };
}