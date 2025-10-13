import React, { useRef, useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext.jsx";

// CodeEditor Component
export function CodeEditor({ code, onChange }) {
  const editorRef = useRef(null);
  const cmRef = useRef(null);
  const isInternalChange = useRef(false);
  const callbackRef = useRef({ onChange });
  const { isDarkMode } = useTheme();

  // Keep the callback ref updated
  useEffect(() => {
    callbackRef.current = { onChange };
  }, [onChange]);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorRef.current || typeof window.CodeMirror === 'undefined') return;

    // Clear any existing content
    editorRef.current.innerHTML = '';

    try {
      cmRef.current = window.CodeMirror(editorRef.current, {
        value: code || '',
        mode: "jsx",
        lineNumbers: true,
        theme: isDarkMode ? "dracula" : "default",
        autoCloseBrackets: true,
        matchBrackets: true,
        tabSize: 2,
        indentWithTabs: false,
        lineWrapping: true
      });

      cmRef.current.on("change", (instance) => {
        if (!isInternalChange.current) {
          callbackRef.current.onChange(instance.getValue());
        }
      });
    } catch (e) {
      console.error('Error initializing CodeMirror:', e);
    }

    return () => {
      if (cmRef.current && typeof cmRef.current.toTextArea === 'function') {
        try {
          cmRef.current.toTextArea();
        } catch (e) {
          console.warn('Error cleaning up CodeMirror:', e);
        }
      }
      cmRef.current = null;
    };
  }, []);

  // Update code when prop changes
  useEffect(() => {
    if (cmRef.current && typeof cmRef.current.getValue === 'function') {
      const currentValue = cmRef.current.getValue();
      if (currentValue !== code) {
        isInternalChange.current = true;
        cmRef.current.setValue(code || '');
        isInternalChange.current = false;
      }
    }
  }, [code]);

  // Update theme when darkMode changes
  useEffect(() => {
    if (cmRef.current) {
      cmRef.current.setOption('theme', isDarkMode ? 'dracula' : 'default');
    }
  }, [isDarkMode]);

  return <div className="flex-1 overflow-auto" ref={editorRef}></div>;
}
