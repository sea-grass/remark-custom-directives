import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkDirective from "remark-directive";
import remarkCustomDirectives from "remark-custom-directives";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

/** @type {import('remark-custom-directives').Directives} */
const directives = {
  containerDirective: {
    /**
     * This directive wraps its content in an element with the supplied classes.
     *
     * Input:
     * ```md
     * :::block{class="wrapper"}
     * ## Greetings
     * Hello, world
     * :::
     * ```
     *
     * Output:
     * ```html
     * <div class="wrapper"><h2>Greetings</h2><p>Hello, world</p></div>
     * ```
     */
    async block(node) {
      const { class: classes } = node.attributes;
      const data = node.data || (node.data = {});
      data.hProperties = { class: classes };
    },
  },
};;

const markdown = `:::block{class="wrapper"}
## Greetings
Hello, world
:::
`;

const result = unified()
  .use(remarkParse)
  .use(remarkDirective)
  .use(remarkCustomDirectives, directives)
  .use(remarkRehype)
  .use(rehypeStringify)
  .process(markdown);

result.then((html) => {
  console.log('Input:\n'+markdown+'Output:\n'+html);
});
