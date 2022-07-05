import React, { ReactNode } from 'react';
import HTMLReactParser, {
  domToReact,
  DOMNode,
  HTMLReactParserOptions,
  Element,
} from 'html-react-parser';

export enum Blocks {
  Paragraph = 'paragraph',
  Heading1 = 'heading-1',
  Heading2 = 'heading-2',
  Heading3 = 'heading-3',
  Heading4 = 'heading-4',
  Heading5 = 'heading-5',
  Heading6 = 'heading-6',
  OlList = 'ordered-list',
  UlList = 'unordered-list',
  ListItem = 'list-item',
  Hr = 'hr',
  Quote = 'blockquote',
  Image = 'image',
  Table = 'table',
  TableRow = 'table-row',
  TableCell = 'table-cell',
  Hyperlink = 'hyperlink',
}

export enum Marks {
  Bold = 'bold',
  Italic = 'italic',
  Underline = 'underline',
  Code = 'code',
}

export interface RenderOptions {
  renderNode?: Record<
    string,
    (
      node: Element,
      children: string | JSX.Element | JSX.Element[]
    ) => JSX.Element | undefined
  >;
  renderMark?: Record<string, (text: ReactNode) => JSX.Element | undefined>;
}

const defaultNodeRenderers: RenderOptions['renderNode'] = {
  [Blocks.Paragraph]: (_, children) => <p>{children}</p>,
  [Blocks.Heading1]: (_, children) => <h1>{children}</h1>,
  [Blocks.Heading2]: (_, children) => <h2>{children}</h2>,
  [Blocks.Heading3]: (_, children) => <h3>{children}</h3>,
  [Blocks.Heading4]: (_, children) => <h4>{children}</h4>,
  [Blocks.Heading5]: (_, children) => <h5>{children}</h5>,
  [Blocks.Heading6]: (_, children) => <h6>{children}</h6>,
  [Blocks.Image]: (_, children) => <div>{children}</div>,
  [Blocks.UlList]: (_, children) => <ul>{children}</ul>,
  [Blocks.OlList]: (_, children) => <ol>{children}</ol>,
  [Blocks.ListItem]: (_, children) => <li>{children}</li>,
  [Blocks.Quote]: (_, children) => <blockquote>{children}</blockquote>,
  [Blocks.Hr]: () => <hr />,
  [Blocks.Table]: (_, children) => (
    <table>
      <tbody>{children}</tbody>
    </table>
  ),
  [Blocks.TableRow]: (_, children) => <tr>{children}</tr>,
  [Blocks.TableCell]: (_, children) => <td>{children}</td>,
  [Blocks.Hyperlink]: ({ attribs }, children) => (
    <a href={attribs.href}>{children}</a>
  ),
  [Blocks.Image]: ({ attribs }) => <img src={attribs.src} alt="" />,
};

const defaultMarkRenderers: RenderOptions['renderMark'] = {
  [Marks.Bold]: text => <b>{text}</b>,
  [Marks.Italic]: text => <i>{text}</i>,
  [Marks.Underline]: text => <u>{text}</u>,
  [Marks.Code]: text => <code>{text}</code>,
};

const renderNodeToReact = (
  content: string,
  options: RenderOptions
): ReactNode => {
  const { renderNode, renderMark } = options;
  const renderOptions: HTMLReactParserOptions = {
    replace: (node: DOMNode) => {
      if (node instanceof Element && node.attribs) {
        const children = domToReact(node.children, renderOptions);
        switch (node.name) {
          case 'p':
            return renderNode?.[Blocks.Paragraph](node, children);
          case 'h1':
            return renderNode?.[Blocks.Heading1](node, children);
          case 'h2':
            return renderNode?.[Blocks.Heading2](node, children);
          case 'h3':
            return renderNode?.[Blocks.Heading3](node, children);
          case 'h4':
            return renderNode?.[Blocks.Heading4](node, children);
          case 'h5':
            return renderNode?.[Blocks.Heading5](node, children);
          case 'h6':
            return renderNode?.[Blocks.Heading6](node, children);
          case 'img':
            return renderNode?.[Blocks.Image](node, children);
          case 'ol':
            return renderNode?.[Blocks.OlList](node, children);
          case 'ul':
            return renderNode?.[Blocks.UlList](node, children);
          case 'li':
            return renderNode?.[Blocks.ListItem](node, children);
          case 'hr':
            return renderNode?.[Blocks.Hr](node, children);
          case 'blockquote':
            return renderNode?.[Blocks.Quote](node, children);
          case 'table':
            return renderNode?.[Blocks.Table](node, children);
          case 'tr':
            return renderNode?.[Blocks.TableRow](node, children);
          case 'td':
            return renderNode?.[Blocks.TableCell](node, children);
          case 'a':
            return renderNode?.[Blocks.Hyperlink](node, children);
          case 'b':
          case 'strong':
            return renderMark?.[Marks.Bold](children);
          case 'em':
            return renderMark?.[Marks.Italic](children);
          case 'u':
            return renderMark?.[Marks.Underline](children);
          case 'code':
          case 'pre':
            return renderMark?.[Marks.Code](children);
          default:
            return undefined;
        }
      }
      return undefined;
    },
  };
  return HTMLReactParser(content, renderOptions);
};

export const renderHtmlToReact = (
  content: string,
  options?: RenderOptions
): ReactNode => {
  if (!content) return null;

  return renderNodeToReact(content, {
    renderNode: {
      ...defaultNodeRenderers,
      ...options?.renderNode,
    },
    renderMark: {
      ...defaultMarkRenderers,
      ...options?.renderMark,
    },
  });
};
