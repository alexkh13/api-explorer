// Icons component - requires Babel transpilation
import React from "react";

window.Icons = {
  Code: () => (
    <svg className="icon-code" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  Run: () => (
    <svg className="icon-submit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Preview: () => (
    <svg className="icon-preview" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  HidePreview: () => (
    <svg className="icon-preview" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ),
  Check: () => (
    <svg className="icon-submit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  ChevronRight: () => (
    <svg className="icon-chevron" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  AI: () => (
    <svg className="icon-ai" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
  Reset: () => (
    <svg className="icon-reset" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  Settings: () => (
    <svg className="icon-settings" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Spinner: () => (
    <svg className="icon-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  ),
  List: () => (
    <svg className="icon-list" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  File: () => (
    <svg className="icon-file" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  Edit: () => (
    <svg className="icon-edit" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  // 100+ Abstract Shape Icons for endpoint variety
  shapes: [
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,22 2,22"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v10l10 5 10-5V7z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,9 22,15 12,22 2,15 2,9"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l9 4.5v11L12 22l-9-4.5v-11z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4" fill="none" stroke="white" strokeWidth="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="8"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,3 19,8 19,16 12,21 5,16 5,8"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L22 8.5l-10 6.5L2 8.5z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l10 6v8l-10 6-10-6v-8z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="12" r="6"/><circle cx="16" cy="12" r="6"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/><path d="M3 3h18v18H3z" fill="none" stroke="white" strokeWidth="1.5"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,4 20,12 12,20 4,12"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L22 12L12 22L2 12z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="6"/><circle cx="12" cy="16" r="6"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" transform="rotate(45 12 12)"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 19,7 19,17 12,22 5,17 5,7"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4l16 16M20 4L4 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="4"/><circle cx="6" cy="18" r="4"/><circle cx="18" cy="18" r="4"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,8 22,16 12,22 2,16 2,8"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="6" width="9" height="12"/><rect x="13" y="6" width="9" height="12"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 16,10 24,10 18,16 20,24 12,18 4,24 6,16 0,10 8,10"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 12h8v10h4V12h8z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 12h8V4h2v8h8v2h-8v8h-2v-8H3z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,3 21,9 18,20 6,20 3,9"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="6" r="4"/><circle cx="18" cy="6" r="4"/><circle cx="6" cy="18" r="4"/><circle cx="18" cy="18" r="4"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="8" width="7" height="12"/><rect x="13" y="4" width="7" height="16"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L22 7v10l-10 5L2 17V7z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 23,12 12,22 1,12"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18" stroke="white" strokeWidth="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 20,8 20,16 12,22 4,16 4,8"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="4"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="4"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,4 18,8 18,16 12,20 6,16 6,8"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7" r="5"/><circle cx="7" cy="17" r="5"/><circle cx="17" cy="17" r="5"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 12C2 6.5 6.5 2 12 2s10 4.5 10 10-4.5 10-10 10S2 17.5 2 12z" fill="none" stroke="currentColor" strokeWidth="3"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="8" y="3" width="8" height="18" rx="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 7v10l9 5 9-5V7z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/><path d="M12 2v4m0 12v4M2 12h4m12 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,1 23,6 23,18 12,23 1,18 1,6"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h12L22 12l-4 8H6L2 12z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeWidth="3"/><circle cx="12" cy="12" r="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="8" width="18" height="8" rx="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,5 17,9 17,15 12,19 7,15 7,9"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 12l8-8 8 8-8 8z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="8" r="5"/><circle cx="16" cy="16" r="5"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="6"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L22 22H2z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,3 17,7 17,17 12,21 7,17 7,7"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 5h6v6H5zM13 5h6v6h-6zM5 13h6v6H5zM13 13h6v6h-6z" fill="none" stroke="currentColor" strokeWidth="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 19,6 19,18 12,22 5,18 5,6"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="7" width="10" height="10" transform="rotate(45 12 12)"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l7 4v8l-7 4-7-4V8z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="5"/><path d="M2 12h5m10 0h5M12 2v5m0 10v5" stroke="currentColor" strokeWidth="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,3 20,7 20,17 12,21 4,17 4,7"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="8" y="8" width="8" height="8" rx="1"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 8v8l10 6 10-6V8z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,1 22,7 22,17 12,23 2,17 2,7"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="10 5"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 3h12v8l-6 4-6-4z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="10" width="16" height="8" rx="4"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,4 16,8 16,16 12,20 8,16 8,8"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="9" r="6"/><circle cx="15" cy="15" r="6"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 7h18L18 17H6z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 21,8 18,16 6,16 3,8"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="5" width="6" height="14" rx="1"/><rect x="13" y="5" width="6" height="14" rx="1"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="3"/><circle cx="5" cy="19" r="3"/><circle cx="19" cy="19" r="3"/><circle cx="12" cy="12" r="3"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4l10 8-10 8z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3L21 9v6l-9 6-9-6V9z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="12" height="16" rx="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 18,6 18,18 12,22 6,18 6,6"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="9" r="5"/><rect x="7" y="13" width="10" height="8" rx="1"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 8h16l-4 8H8z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,4 19,8 19,16 12,20 5,16 5,8"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="9" y="4" width="6" height="16" rx="3"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 4h8l4 8-4 8H8l-4-8z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="7" cy="7" r="4"/><circle cx="17" cy="7" r="4"/><circle cx="12" cy="17" r="4"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="6" width="16" height="12" rx="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 22,9 19,19 5,19 2,9"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8"/><rect x="9" y="9" width="6" height="6" fill="white"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6l6 6-6 6M12 6l6 6-6 6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,3 21,8 21,16 12,21 3,16 3,8"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="7" y="3" width="10" height="18" rx="5"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L22 7l-3 10-7 5-7-5-3-10z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="3" fill="white"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 17,6 17,18 12,22 7,18 7,6"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l8 5v8l-8 5-8-5V8z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><rect x="6" y="11" width="12" height="10" rx="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,4 20,9 17,18 7,18 4,9"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 12L12 5l7 7-7 7z"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><rect x="10" y="3" width="4" height="18" rx="2"/><rect x="3" y="10" width="18" height="4" rx="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><circle cx="6" cy="12" r="4"/><circle cx="18" cy="12" r="4"/><circle cx="12" cy="12" r="2"/></svg>,
    () => <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,1 23,7 20,17 4,17 1,7"/></svg>
  ],
  // Helper to get consistent icon for endpoint
  getEndpointIcon: (endpointId) => {
    const hash = endpointId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return hash % window.Icons.shapes.length;
  }
};
