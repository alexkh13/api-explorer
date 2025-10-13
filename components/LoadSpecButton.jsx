import React, { useState } from "react";
import * as Icons from "../icons/index.jsx";
import { LoadSpecDialog } from "./LoadSpecDialog.jsx";

// Load Spec Button
export function LoadSpecButton() {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <button
        className="w-14 h-14 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-2 border-purple-300 dark:border-purple-600 shadow-md transition-all hover:scale-105 hover:shadow-lg active:scale-95 p-0"
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
