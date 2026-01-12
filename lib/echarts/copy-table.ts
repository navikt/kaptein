'use client';

export const copyTable = async (
  tableElement: HTMLTableElement | null,
  titleElement: HTMLHeadingElement | null,
  descriptionElement: HTMLParagraphElement | null,
) => {
  if (tableElement === null) {
    return;
  }

  // Extract plaintext from table - tab-separated values
  const rows = tableElement.querySelectorAll('tr');
  const plaintext = Array.from(rows)
    .map((row) => {
      const cells = row.querySelectorAll('th, td');
      return Array.from(cells)
        .map((cell) => cell.textContent?.trim() ?? '')
        .join('\t');
    })
    .join('\n');

  const clipboardItemData = {
    'text/html': getHtml(tableElement, titleElement, descriptionElement),
    'text/plain': plaintext,
  };

  try {
    const clipboardItem = new ClipboardItem(clipboardItemData);
    await navigator.clipboard.write([clipboardItem]);
  } catch (error) {
    console.error('Failed to copy table to clipboard:', error);
  }
};

/**
 * Generates clean HTML from table, title, and description elements.
 */
const getHtml = (
  tableElement: HTMLTableElement,
  titleElement: HTMLHeadingElement | null,
  descriptionElement: HTMLParagraphElement | null,
): string => {
  let html = getTableHtml(tableElement);

  const description = descriptionElement?.innerHTML;

  if (description !== undefined && description.length !== 0) {
    html = `<p>${description}</p>\n${html}`;
  }

  const title = titleElement?.textContent?.trim();

  if (title !== undefined && title.length !== 0) {
    html = `<h1>${title}</h1>\n${html}`;
  }

  return html;
};

/**
 * Recursively strips all attributes from HTML elements,
 * returning clean HTML with only tag names and text content.
 * Adds basic table styling for better readability when pasted.
 */
const getTableHtml = (table: HTMLTableElement): string => {
  const headerCells = table
    .querySelectorAll<HTMLTableCellElement>('thead>tr>th')
    .values()
    .map(toCell)
    .toArray()
    .join('\n');

  const rows = table
    .querySelectorAll<HTMLTableRowElement>('tbody>tr')
    .values()
    .map((row) => row.childNodes.values().filter(isCellElement).map(toCell))
    .map((cells) => `<tr>\n${cells.toArray().join('\n')}\n</tr>`)
    .toArray()
    .join('\n');

  return `<table style="border-collapse: collapse;" cellspacing="0" cellpadding="4">
  <thead>
    <tr>
      ${headerCells}
    </tr>
  </thead>
  <tbody>
    ${rows}
  </tbody>
</table>`;
};

const cleanElement = (element: Element): string => {
  const tagName = element.tagName.toLowerCase();

  let innerHTML = '';

  for (const child of element.childNodes) {
    const cleanedChild = cleanNode(child);

    if (cleanedChild !== null) {
      innerHTML += cleanedChild;
    }
  }

  return `<${tagName}>${innerHTML}</${tagName}>`;
};

const cleanNode = (node: Node): string | null => {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent ?? '';
  }

  if (node instanceof Element) {
    return cleanElement(node);
  }

  return null;
};

const toCell = (element: HTMLTableCellElement): string => {
  const tagName = element.tagName.toLowerCase();

  return `<${tagName} style="border: 1px solid gray; padding: 4px;">${element.childNodes
    .values()
    .map(cleanNode)
    .filter((n) => n !== null)
    .toArray()
    .join('')}</${tagName}>`;
};

const isCellElement = (node: Node): node is HTMLTableCellElement =>
  isElement(node) && (node.tagName.toLowerCase() === 'td' || node.tagName.toLowerCase() === 'th');

const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE;
