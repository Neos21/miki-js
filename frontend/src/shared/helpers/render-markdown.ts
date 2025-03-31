import markdownit from 'markdown-it';

export const renderMarkdown = (rawMarkdownContent: string): string => {
  const markdownIt = markdownit({
    html       : true,  // Enable HTML tags in source
    xhtmlOut   : true,  // Use '/' to close single tags (<br />).
    breaks     : true,  // Convert '\n' in paragraphs into <br>
    langPrefix : 'language-',
    linkify    : true,  // Autoconvert URL-like text to links
    typographer: true
  });
  
  const result = markdownIt.render(rawMarkdownContent);
  return result;
};
