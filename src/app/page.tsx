"use client";

import { useState, useEffect, useRef } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { processJSON } from "@/lib/censor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [inputJson, setInputJson] = useState("");
  const [outputJson, setOutputJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef<any>(null);

  const [censorValues, setCensorValues] = useState(true);
  const [keysToCensor, setKeysToCensor] = useState("");
  const [maxArrayLength, setMaxArrayLength] = useState<string>("0");

  useEffect(() => {
    if (!inputJson || !inputJson.trim()) {
      setOutputJson("");
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      const keysArray = keysToCensor
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);

      let lengthNum: number | null = parseInt(maxArrayLength, 10);
      if (isNaN(lengthNum) || lengthNum <= 0) {
        lengthNum = null;
      } else if (lengthNum > 100) {
        lengthNum = 100;
      }

      const processed = processJSON(parsed, {
        censorValues,
        keysToCensor: keysArray,
        maxArrayLength: lengthNum,
      });

      setOutputJson(JSON.stringify(processed, null, 2));
      setError(null);
    } catch (err) {
      setError("Invalid JSON format");
    }
  }, [inputJson, censorValues, keysToCensor, maxArrayLength]);

  const handleCopy = () => {
    navigator.clipboard.writeText(outputJson);
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background font-mono text-sm overflow-hidden">
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between border-b px-4 py-3 bg-muted/30 gap-4 shrink-0">
        <h1 className="font-bold tracking-tight text-lg shrink-0">
          JSON Anonymizer
        </h1>

        <div className="flex flex-wrap items-center gap-4 md:gap-6 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Switch
              id="censor-values"
              checked={censorValues}
              onCheckedChange={setCensorValues}
            />
            <Label htmlFor="censor-values" className="text-xs cursor-pointer whitespace-nowrap">
              Censor Values
            </Label>
          </div>

          <Separator orientation="vertical" className="hidden md:block h-6" />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="keys" className="text-xs whitespace-nowrap">
              Censor Keys:
            </Label>
            <Input
              id="keys"
              value={keysToCensor}
              onChange={(e) => setKeysToCensor(e.target.value)}
              placeholder="email, phone..."
              className="h-8 w-full sm:w-48 text-xs"
            />
          </div>

          <Separator orientation="vertical" className="hidden md:block h-6" />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Label htmlFor="max-length" className="text-xs whitespace-nowrap" title="0 bedeutet unendlich">
              Max Array Length:
            </Label>
            <Input
              id="max-length"
              type="number"
              min="0"
              max="100"
              value={maxArrayLength}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (val > 100) setMaxArrayLength("100");
                else setMaxArrayLength(e.target.value);
              }}
              placeholder="Inf"
              className="h-8 w-full sm:w-20 text-xs"
            />
          </div>
        </div>
      </header>

      <main className="flex flex-col md:flex-row flex-1 gap-2 p-2 overflow-hidden">
        <div className="flex flex-col flex-1 border rounded-md overflow-hidden bg-muted/5 min-h-[300px] md:min-h-0">
          <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/20 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-muted-foreground">
                Input JSON
              </span>
              {error && <span className="text-xs text-destructive">{error}</span>}
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleFormat}
              className="h-6 px-3 text-[10px]"
              disabled={!inputJson || !!error}
            >
              Format
            </Button>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={inputJson}
              onChange={(value) => setInputJson(value || "")}
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: "on",
                formatOnPaste: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 border rounded-md overflow-hidden bg-muted/5 min-h-[300px] md:min-h-0">
          <div className="flex items-center justify-between px-3 py-2 border-b bg-muted/20 shrink-0">
            <span className="font-semibold text-xs text-muted-foreground">
              Output JSON
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
              className="h-6 px-3 text-[10px]"
              disabled={!outputJson || !!error}
            >
              Copy
            </Button>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={outputJson}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                wordWrap: "on",
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}