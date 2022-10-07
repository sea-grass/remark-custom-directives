# remark-custom-directives

remark plugin to be used in conjunction with [remark-directive](https://github.com/remarkjs/remark-directive) to define custom directives.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c). Install with [npm](https://docs.npmjs.com/cli/install):

```sh
npm install remark-custom-directives
```

## Use

Add remark-custom-directives to your unified processor __after__ remark-directive.

```js
// other imports...
import remarkCustomDirectives from 'remark-custom-directives';

const directives = {
    textDirective: {
        /**
         * Wraps inline text with a <span class="highlight">
         */
        highlight(node) {
            const data = node.data || (node.data = {});
            data.hName = 'span';
            data.hProperties = { class: 'highlight' };
        }
    },
    leafDirective: {},
    containerDirective: {}
}

const processor = unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkCustomDirectives, directives)
    .use(remarkRehype)
    .use(rehypeStringify);
```

## TODO:

- Refine docs
- Add tests
- Add linter/formatter
- Add license