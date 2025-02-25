import { cn } from '@/lib/utils'
import {
  DefaultNodeTypes,
  SerializedLinkNode,
  SerializedHeadingNode,
  SerializedParagraphNode,
  SerializedQuoteNode,
  SerializedListNode,
  SerializedListItemNode,
  SerializedTextNode
} from '@payloadcms/richtext-lexical'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as RichTextWithoutBlocks,
} from '@payloadcms/richtext-lexical/react'
import {
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  H7,
  P,
  Blockquote,
  List,
  OrderedList,
  InlineCode,
  Lead,
  Large,
  Small,
  Caption
} from '@/components/ui/typography'
import React, { ReactNode } from 'react'

type NodeTypes =
  | DefaultNodeTypes

// Define our own converter props type since the library doesn't export it
type ConverterProps<T> = {
  node: T
  nodesToJSX?: (props: any) => ReactNode[]
  childIndex: number
  parent?: {
    children?: { type: string }[]
  }
}

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

// Helper function to safely extract text from a node
const extractTextFromNode = (node: any): string => {
  if (!node) return '';

  // For text nodes, return the text content
  if (node.type === 'text') {
    return node.text || '';
  }

  // For container nodes, recursively extract text from children
  if (node.children && Array.isArray(node.children)) {
    return node.children
      .map((child: any) => extractTextFromNode(child))
      .join('');
  }

  return '';
}

// Helper function to extract formatting information from a node
const getNodeFormatting = (node: any): { isBold: boolean; isItalic: boolean; isCode: boolean; isUnderline: boolean; isStrikethrough: boolean } => {
  const defaultFormatting = {
    isBold: false,
    isItalic: false,
    isCode: false,
    isUnderline: false,
    isStrikethrough: false
  };

  if (!node) return defaultFormatting;

  // Check for direct format property
  if (node.format) {
    return {
      ...defaultFormatting,
      isBold: node.format === 'bold',
      isItalic: node.format === 'italic',
      isCode: node.format === 'code',
      isUnderline: node.format === 'underline',
      isStrikethrough: node.format === 'strikethrough',
    };
  }

  // Check for format flags
  return {
    isBold: node.bold === true,
    isItalic: node.italic === true,
    isCode: node.code === true,
    isUnderline: node.underline === true,
    isStrikethrough: node.strikethrough === true,
  };
}

// Helper function to safely get children from nodesToJSX or extract text from node
const safeGetChildren = (props: any): ReactNode[] => {
  try {
    // If nodesToJSX is available, try to use it safely
    if (typeof props.nodesToJSX === 'function') {
      try {
        // Create a safe wrapper around nodesToJSX
        const result = props.nodesToJSX(props);
        return Array.isArray(result) ? result : [result].filter(Boolean);
      } catch (innerError) {
        console.error('Error calling nodesToJSX:', innerError);
        // Fall through to the fallback method
      }
    }

    // Fallback: Extract text directly from the node
    if (props.node) {
      const textContent = extractTextFromNode(props.node);
      return textContent ? [textContent] : [];
    }
  } catch (error) {
    console.error('Error in safeGetChildren:', error);
  }

  return [];
}

// Custom JSX converters to map Payload CMS rich text elements to ShadCN typography components
const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => {
  // Create safe versions of default converters that don't rely on nodesToJSX
  const safeDefaultConverters = {
    heading: (props: any) => {
      const text = extractTextFromNode(props.node);
      return <>{text}</>;
    },
    paragraph: (props: any) => {
      const text = extractTextFromNode(props.node);
      return <>{text}</>;
    },
    text: (props: any) => {
      return <>{props.node?.text || ''}</>;
    },
    list: (props: any) => {
      const text = extractTextFromNode(props.node);
      return <>{text}</>;
    },
    listitem: (props: any) => {
      const text = extractTextFromNode(props.node);
      return <li>{text}</li>;
    },
    quote: (props: any) => {
      const text = extractTextFromNode(props.node);
      return <>{text}</>;
    },
    code: (props: any) => {
      const text = extractTextFromNode(props.node);
      return <>{text}</>;
    },
  };

  return {
    ...defaultConverters,
    ...safeDefaultConverters,
    ...LinkJSXConverter({ internalDocToHref }),
    heading: (props: any) => {
      const { node } = props;
      const tag = node.tag;
      const text = extractTextFromNode(node);
      const isFirstHeading = props.childIndex === 0;

      // Use direct text extraction instead of nodesToJSX
      // Note: We're reserving H1 for page titles only, so we start with H2 for content
      switch (tag) {
        case 'h1':
          // Use H2 with accent variant for h1 tags in content
          return <H2 variant="accent">{text}</H2>;
        case 'h2':
          return <H3>{text}</H3>;
        case 'h3':
          return <H4>{text}</H4>;
        case 'h4':
          return <H5>{text}</H5>;
        case 'h5':
          return <H6>{text}</H6>;
        case 'h6':
          return <H7>{text}</H7>;
        default:
          return <>{text}</>;
      }
    },
    paragraph: (props: any) => {
      const { node } = props;
      const text = extractTextFromNode(node);
      const isShort = text.length < 150;

      // Simple heuristic for lead paragraphs - first paragraph or paragraph after heading
      // and relatively short
      if (isShort && (
        props.childIndex === 0 ||
        (props.childIndex === 1 && props.parent?.children?.[0]?.type === 'heading')
      )) {
        return <Lead>{text}</Lead>;
      }

      // Use our slightly larger than base paragraph size
      return <P>{text}</P>;
    },
    quote: (props: any) => {
      const text = extractTextFromNode(props.node);
      return <Blockquote>{text}</Blockquote>;
    },
    list: (props: any) => {
      // For lists, we need to preserve the structure
      // Extract the list items and render them directly
      if (props.node?.children && Array.isArray(props.node.children)) {
        const listItems = props.node.children.map((item: any, index: number) => {
          const itemText = extractTextFromNode(item);
          return <li key={index}>{itemText}</li>;
        });

        // Check if this is an ordered list
        const isOrdered = props.node.listType === 'number';

        return isOrdered
          ? <OrderedList>{listItems}</OrderedList>
          : <List>{listItems}</List>;
      }

      // Fallback
      const text = extractTextFromNode(props.node);
      return <List>{text}</List>;
    },
    listitem: (props: any) => {
      const text = extractTextFromNode(props.node);
      return <li>{text}</li>;
    },
    code: (props: any) => {
      const text = extractTextFromNode(props.node);
      return <InlineCode>{text}</InlineCode>;
    },
    text: (props: any) => {
      const { node } = props;
      const text = node.text || '';
      const formatting = getNodeFormatting(node);

      // Apply appropriate formatting based on node properties
      if (formatting.isBold) {
        return <Large>{text}</Large>;
      }

      if (formatting.isItalic) {
        return <em className="italic">{text}</em>;
      }

      if (formatting.isCode) {
        return <InlineCode>{text}</InlineCode>;
      }

      if (formatting.isUnderline) {
        return <span className="underline">{text}</span>;
      }

      if (formatting.isStrikethrough) {
        return <span className="line-through">{text}</span>;
      }

      if (node.format === 'subscript' || node.format === 'superscript') {
        return <Small>{text}</Small>;
      }

      return <>{text}</>;
    },
    image: (props: any) => {
      // If there's a caption, use our Caption component
      const caption = props.node?.fields?.caption;
      const alt = props.node?.fields?.alt || '';
      const url = props.node?.fields?.url || '';

      return (
        <figure className="my-8">
          {url && <img src={url} alt={alt} className="w-full rounded-md" />}
          {caption && <Caption>{caption}</Caption>}
        </figure>
      );
    },
    blocks: {
      // Add any block converters here if needed
    },
  };
};

type Props = {
  data: SerializedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export function RichText(props: Props) {
  const { className, enableProse = true, enableGutter = true, ...rest } = props

  return (
    <RichTextWithoutBlocks
      converters={jsxConverters}
      className={cn(
        {
          'container': enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto': enableProse,
          'space-y-4': enableProse, // Add consistent spacing between elements
        },
        className
      )}
      {...rest}
    />
  )
}
