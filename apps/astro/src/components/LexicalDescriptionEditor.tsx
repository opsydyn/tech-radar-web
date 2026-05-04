import React, { useState, useRef, useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, $createParagraphNode, $createTextNode } from "lexical";
import { UNDO_COMMAND, REDO_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import PencilIcon from "@/components/PencilIcon";
import {
  editorRoot,
  viewMode,
  editMode,
  iconButton,
  utilButton
} from "./LexicalDescriptionEditor.css";
import { detailsDescription } from "@/pages/blip/Blip.css";

type Props = {
  initialValue: string;
  onSave: (value: string) => void;
  disabled?: boolean;
};


const Placeholder = ({ fallback }: { fallback: string }) => {
  const [editor] = useLexicalComposerContext();
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const root = $getRoot();
        setIsEmpty(root.getTextContent().trim().length === 0);
      });
    });
  }, [editor]);

  if (!isEmpty) return null;

  return (
    <div style={{ position: "absolute", opacity: 0.5, pointerEvents: "none" }}>
      {fallback}
    </div>
  );
};


const UndoRedoControls = () => {
  const [editor] = useLexicalComposerContext();
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
      <button type="button" className={utilButton} onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}>
        Undo
      </button>
      <button type="button" className={utilButton} onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}>
        Redo
      </button>
    </div>
  );
};

export const LexicalDescriptionEditor: React.FC<Props> = ({
  initialValue,
  onSave,
  disabled
}) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [pending, setPending] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const editorConfig = {
    namespace: "BlipDescriptionEditor",
    theme: {},
    onError: (error: Error) => console.error(error),
    editable: !disabled,
    editorState: () => {
      const root = $getRoot();
      root.clear();
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(initialValue));
      root.append(paragraph);
    },
  };

  const handleEditClick = () => {
    if (!disabled) setEditing(true);
  };

  const handleSave = () => {
    setPending(true);
    onSave(value);
    setEditing(false);
    setPending(false);
  };

  const handleCancel = () => {
    setEditing(false);
    setValue(initialValue);
  };

  return (
    <div className={editorRoot}>
      {!editing ? (
        <div className={viewMode} tabIndex={0} onClick={handleEditClick} role="button" aria-label="Edit description">
          <span className={detailsDescription}>{value || <em>No description</em>}</span>
          <button className={iconButton} aria-label="Edit" tabIndex={-1} type="button" onClick={handleEditClick}>
            <PencilIcon />
          </button>
        </div>
      ) : (
        <div className={editMode}>
          <LexicalComposer initialConfig={editorConfig}>
            <UndoRedoControls />
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  ref={editorRef}
                  spellCheck={true}
                  data-lexical-editor="true"
                  lang="en"
                  style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    backgroundColor: "white",
                    color: "black",
                    padding: "8px",
                    border: "1px solid #ccc",
                    minHeight: "300px",
                    borderRadius: "4px"
                  }}
                />
              }
              placeholder={<Placeholder fallback={initialValue} />}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <OnChangePlugin
              onChange={(editorState) => {
                editorState.read(() => {
                  const root = $getRoot();
                  setValue(root.getTextContent());
                });
              }}
            />
          </LexicalComposer>
          <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
            <button onClick={handleSave} className={utilButton} disabled={pending} type="button">
              Save
            </button>
            <button onClick={handleCancel} className={utilButton} disabled={pending} type="button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
