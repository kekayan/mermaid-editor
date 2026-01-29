import { useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { mermaid } from "codemirror-lang-mermaid";
import { resolveEditorTheme } from "../lib/themes";

interface EditorProps {
  code: string;
  onChange: (value: string) => void;
  themeName: string;
}

export function Editor({ code, onChange, themeName }: EditorProps) {
  const extensions = useMemo(() => [mermaid()], []);
  const editorTheme = useMemo(() => resolveEditorTheme(themeName), [themeName]);

  return (
    <div className="editor-panel">
      <CodeMirror
        value={code}
        onChange={onChange}
        extensions={extensions}
        theme={editorTheme}
        height="100%"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          bracketMatching: true,
        }}
      />
    </div>
  );
}
