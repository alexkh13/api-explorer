import React, { useState } from "react";
import * as Icons from "../icons/index.jsx";
import { LoadSpecDialog } from "./LoadSpecDialog.jsx";

// Load Spec Button
export function LoadSpecButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button
        className="w-10 h-10 rounded-full flex items-center justify-center text-teal-400 dark:text-teal-300 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
        style={{ background: 'rgba(20, 184, 166, 0.15)' }}
        onClick={() => setShowDialog(true)}
        title="Load OpenAPI Spec"
      >
        <Icons.File />
      </button>

      <LoadSpecDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  );
}
