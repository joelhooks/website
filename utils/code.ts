import remarkShikiTwoslash from 'remark-shiki-twoslash';

// Usage:
//
// serialize(content, {
//   mdxOptions: {
//     remarkPlugins: [highlight],
//   },
// });

export const highlight: any = [remarkShikiTwoslash, {
  // See: https://github.com/shikijs/twoslash/blob/main/packages/shiki-twoslash/README.md#user-settings
  defaultOptions: {
    showEmit: false
  }
}]
