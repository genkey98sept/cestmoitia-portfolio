/**
 * Helper pour construire des objets Lexical RichText compatibles Payload CMS.
 */

type LexicalNode = {
  type: string;
  version: number;
  [key: string]: unknown;
};

type LexicalRoot = {
  root: {
    type: "root";
    children: LexicalNode[];
    direction: "ltr";
    format: "";
    indent: 0;
    version: 1;
  };
};

function textNode(text: string): LexicalNode {
  return {
    type: "text",
    detail: 0,
    format: 0,
    mode: "normal",
    style: "",
    text,
    version: 1,
  };
}

function paragraphNode(text: string): LexicalNode {
  return {
    type: "paragraph",
    children: [textNode(text)],
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    textStyle: "",
    version: 1,
  };
}

/**
 * Construit un objet Lexical RichText à partir d'un ou plusieurs paragraphes.
 * Séparer les paragraphes avec \n\n.
 */
export function richText(text: string): LexicalRoot {
  const paragraphs = text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    root: {
      type: "root",
      children: paragraphs.map(paragraphNode),
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}

/**
 * RichText vide (pour les champs optionnels sans contenu).
 */
export function emptyRichText(): LexicalRoot {
  return {
    root: {
      type: "root",
      children: [],
      direction: "ltr",
      format: "",
      indent: 0,
      version: 1,
    },
  };
}
