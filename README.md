# HTML to React Mapping

This library can be used to parse raw HTML to React components, and it's a wrapper on top of the `html-react-parser` library to make it plug-and-play. Useful when you receive raw HTMl from third party services (like Greenhouse or Zendesk), and want to map each HTML tag to a React element/component.

## Usage

Check the [/example/index.tsx](./example/index.tsx) folder located on this repository for an implementation example.

```tsx
const options: RenderOptions = {
  renderNode: {
    //...
    [Blocks.Heading2]: (_, children) => <Title>{children}</Title>,
  },
  renderMark: {
    //...
    [Marks.Bold]: text => <CustomBold>{text}</CustomBold>,
  },
};

const html = '<div><h2>Title</h2><b>Text</b><div>';

const App = () => {
  return <div>{renderHtmlToReact(html, options)}</div>;
};
```

## Dependencies

Your project need to have the `html-react-parser` library installed as a dependency.

```bash
yarn add html-react-parser
```
