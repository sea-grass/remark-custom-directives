import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text } from 'mdast';
import type {
	TextDirective,
	ContainerDirective,
	LeafDirective
} from 'mdast-util-directive';

type DirectiveNode = TextDirective|ContainerDirective|LeafDirective;
type FnWithRoot<D extends DirectiveNode> = (node: D, tree: Root) => Promise<void>;
type FnWithoutRoot<D extends DirectiveNode> = (node: D) => Promise<void>;
type DirectiveFn<D extends DirectiveNode> = FnWithRoot<D> | FnWithoutRoot<D>;

export interface Directives {
	textDirective?: {
		[name: string]: DirectiveFn<TextDirective>;
	};
	containerDirective?: {
		[name: string]: DirectiveFn<ContainerDirective>;
	};
	leafDirective?: {
		[name: string]: DirectiveFn<LeafDirective>;
	};
}

const remarkCustomDirectives: Plugin<[Directives], Root> = (
	directives: Directives
) => {
	return async (tree) => {
		// we want to be able to execute our directives async
		// and wait for them to finish.so we capture the promises
		// from all executed directives and later await them.
		const promises: (Promise<void>|undefined)[] = [];
		visit(tree, (node) => {
			/**
			 * We'll process nodes that match one of these directive types.
			 * textDirective represents inline content.
			 * leafDirective represents block content.
			 * containerDirective represents a container element and wraps more content.
			 */
			if (node.type === 'textDirective') {
				const directive = directives.textDirective?.[node.name];
				if (directive) {
					promises.push(directive(node, tree));
				} else {
					// unknown text directive, so let's change it to a text node
					const text = ':' + node.name;
					const textNode = (node as unknown) as Text;
					textNode.type = 'text';
					textNode.value = text;
				}
			} else if (node.type === 'leafDirective') {
				promises.push(directives.leafDirective?.[node.name]?.(node, tree));
			} else if (node.type === 'containerDirective') {
				promises.push(directives.containerDirective?.[node.name]?.(node, tree));
			}
		});

		await Promise.all(promises);

		return tree;
	};
};

export default remarkCustomDirectives;
