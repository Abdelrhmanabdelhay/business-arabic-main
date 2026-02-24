"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Block } from "@blocknote/core";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import "./TextEditor.css";
import { AddFileMutation } from "@/lib/actions/media.actions";
import { useTheme } from "next-themes";

interface TextEditorProps {
  setBlocks?: Dispatch<SetStateAction<Block[]>> | ((newBlocks: Block[]) => void);
  blocks?: Block[];
  initContent?: Block[];
  editable?: boolean;
}

export default function TextEditor({ blocks, setBlocks, editable,initContent }: TextEditorProps) {
  const { addFile, isPending } = AddFileMutation();
  const { theme, setTheme } = useTheme();
  const [internalBlocks, setInternalBlocks] = useState<Block[]>(blocks || []);

  const editor = useCreateBlockNote({
    initialContent:
      internalBlocks?.length > 0
        ? internalBlocks
        : [
            {
              type: "paragraph",
              content: "Welcome to this demo!",
            },
            {
              type: "heading",
              content: "This is a heading block",
            },
            {
              type: "paragraph",
              content: "This is a paragraph block",
            },
            {
              type: "paragraph",
            },
          ],
    uploadFile: async (file) => {
      const formData = new FormData();

      formData.append("file", file);

      const response = await addFile(formData);

      console.log({ response });

      return response || "";
    },
  });

  useEffect(() => {
    if (blocks && JSON.stringify(blocks) !== JSON.stringify(internalBlocks)) {
      setInternalBlocks(blocks);
      editor.replaceBlocks(editor.document, blocks);
    }
  }, [blocks, editor]);

  const handleEditorChange = () => {
    if (editable && setBlocks) {
      const newBlocks = editor.topLevelBlocks;

      setInternalBlocks(newBlocks);
      setBlocks(newBlocks);
    }
  };

  return (
    <BlockNoteView
      editor={editor}
      editable={editable}
      theme={theme === "dark" ? "dark" : "light"}
      data-theming-css-demo
      onChange={handleEditorChange}
    />
  );
}
