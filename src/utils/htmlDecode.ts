export const decodeHtml = (html: string) => {
  try {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  } catch {
    return html;
  }
};
