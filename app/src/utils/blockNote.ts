"use client";

import { Block, Props } from "@blocknote/core";

export function htmlToBlocks(encodedHtml: string): Block[] {
  // Decode the HTML-encoded string
  const decodedHtml = decodeHTMLEntities(encodedHtml);

  const parser = new DOMParser();
  const doc = parser.parseFromString(decodedHtml, "text/html");

  return parseNode(doc.body);
}

function decodeHTMLEntities(html: string): string {
  const textarea = document.createElement("textarea");

  textarea.innerHTML = html;

  return textarea.value;
}

function parseNode(node: Node): Block[] {
  const blocks: Block[] = [];

  for (const child of Array.from(node.childNodes)) {
    if (child.nodeType === Node.ELEMENT_NODE) {
      const element = child as Element;

      switch (element.tagName.toLowerCase()) {
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          blocks.push({
            id: generateBlockId(),
            type: "heading",
            // @ts-ignore
            props: { level: parseInt(element.tagName[1]) },
            content: [
              {
                text: element.textContent || "",
                type: "text",
                styles: {},
              },
            ],
            children: [],
          });
          break;
        case "p":
          blocks.push({
            id: generateBlockId(),
            type: "paragraph",
            props: {
              backgroundColor: "default",
              textAlignment: "left",
              textColor: "default",
            },
            content: [
              {
                text: element.innerHTML || "",
                type: "text",
                styles: {},
              },
            ],
            children: [],
          });
          break;
        case "ul":
          blocks.push(...parseListItems(element, "bulleted"));
          break;
        case "ol":
          blocks.push(...parseListItems(element, "numbered"));
          break;
        case "img":
          blocks.push({
            id: generateBlockId(),
            type: "image",
            // @ts-ignore
            props: {
              url: element.getAttribute("src") || "",
              altText: element.getAttribute("alt") || "",
            } as Props<{ url: { value: string; default: string }; altText: { value: string; default: string } }>,
            content: undefined,
            children: [],
          });
          break;
        case "article":
        case "section":
          // For structural elements, we just parse their children
          blocks.push(...parseNode(element));
          break;
        default:
          // For other elements, we treat them as paragraphs
          blocks.push({
            id: generateBlockId(),
            type: "paragraph",
            props: {
              backgroundColor: "default",
              textAlignment: "left",
              textColor: "default",
            },
            content: [
              {
                text: element.outerHTML || "",
                type: "text",
                styles: {},
              },
            ],
            children: [],
          });
      }
    } else if (child.nodeType === Node.TEXT_NODE && child.textContent?.trim()) {
      // Handle text nodes that aren't empty
      blocks.push({
        id: generateBlockId(),
        type: "paragraph",
        props: {
          backgroundColor: "default",
          textAlignment: "left",
          textColor: "default",
        },

        content: [
          {
            text: child.textContent.trim() || "",
            type: "text",
            styles: {},
          },
        ],

        children: [],
      });
    }
  }

  return blocks;
}

function parseListItems(
  listElement: Element,
  listType: "bulleted" | "numbered",
): Block[] {
  const blocks: Block[] = [];

  for (const li of Array.from(listElement.querySelectorAll("li"))) {
    blocks.push({
      id: generateBlockId(),
      type: listType === "bulleted" ? "bulletListItem" : "numberedListItem",
      props: {
        backgroundColor: "default",
        textAlignment: "left",
        textColor: "default",
      },
      content: [
        {
          text: li.innerHTML || "",
          type: "text",
          styles: {},
        },
      ],
      children: [],
    });
  }

  return blocks;
}

function generateBlockId(): string {
  return Math.random().toString(36).substr(2, 9);
}
