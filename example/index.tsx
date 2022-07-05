import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { renderHtmlToReact, RenderOptions, Marks, Blocks } from '../.';

const options: RenderOptions = {
  renderNode: {
    [Blocks.Heading2]: (_, children) => <h2>{children} - h2</h2>,
  },
  renderMark: {
    [Marks.Bold]: text => <b>{text} - bold</b>,
  },
};

const html = '<div><h2>Title</h2><b>Text</b><div>';

const App = () => {
  return <div>{renderHtmlToReact(html, options)}</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
