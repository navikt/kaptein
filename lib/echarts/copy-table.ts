'use client';

export const copyTable = async (tableElement: HTMLTableElement | null) => {
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
    'text/html': cleanHtml(tableElement),
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
 * Recursively strips all attributes from HTML elements,
 * returning clean HTML with only tag names and text content.
 */
const cleanHtml = (element: Element): string => {
  const tagName = element.tagName.toLowerCase();

  let innerHTML = '';
  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      innerHTML += child.textContent ?? '';
    } else if (child instanceof Element) {
      innerHTML += cleanHtml(child);
    }
  }

  if (tagName === 'table') {
    return `<table style="border-collapse: collapse;" cellspacing="0" cellpadding="4">${innerHTML}</table>`;
  }

  if (tagName === 'td' || tagName === 'th') {
    return `<${tagName} style="border: 1px solid gray; padding: 4px;">${innerHTML}</${tagName}>`;
  }

  return `<${tagName}>${innerHTML}</${tagName}>`;
};
