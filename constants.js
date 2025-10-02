// Plain JS module - no JSX, no imports
// This file exports constants and configuration data

window.AppConstants = {
  initialChallengesData: [
    {
      id: "1",
      title: "Reverse a String",
      description: "Write a function that reverses a given string.",
      starterCode: `function reverseString(str) {
  // TODO: Implement this
  return '';
}`,
      tests: [
        { input: "'hello'", expected: "'olleh'" },
        { input: "'abc'", expected: "'cba'" },
      ],
      completed: false,
    },
    {
      id: "2",
      title: "Sum an Array",
      description:
        "Write a function that returns the sum of all numbers in an array.",
      starterCode: `function sumArray(arr) {
  // TODO: Implement this
  return 0;
}
`,
      tests: [
        { input: `[1,2,3]`, expected: `6` },
        { input: `[10,-5,5]`, expected: `10` },
      ],
      completed: false,
    },
    {
      id: "3",
      title: "Create a Counter Component",
      description:
        "Create a counter component with increment and decrement buttons. The counter should display the current value and not go below 0.",
      starterCode: `function Counter() {
  // TODO: Implement state for the counter
  // TODO: Implement increment and decrement functions

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Counter: ?</h2>
      <button>-</button>
      <button>+</button>
    </div>
  );
}`,
      tests: [
        {
          type: "component",
          matcher: "contains",
          element: "button",
          count: 2,
        },
        {
          type: "component",
          matcher: "text",
          element: "h2",
          contains: "Counter:",
        },
      ],
      completed: false,
    },
  ],

  AI_PROVIDERS: {
    OPENAI: {
      name: 'OpenAI',
      endpoint: 'https://api.openai.com/v1/chat/completions',
      apiKeyName: 'OPENAI_API_KEY',
      defaultModel: 'gpt-3.5-turbo',
      models: [
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'gpt-4', name: 'GPT-4' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' }
      ],
      formatRequest: (prompt, code, model) => ({
        model: model || 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant that helps write and improve code for a browser-based React application.

IMPORTANT ENVIRONMENT CONSTRAINTS:
- This is a pure browser environment using ES modules (no Node.js, no build steps)
- Code uses React 18 with Babel standalone for JSX transpilation
- All imports must use ES module syntax (import React from 'react')
- No npm packages are available except those explicitly imported via CDN/import maps
- Available libraries: React, ReactDOM, CodeMirror
- No server-side code, database access, or file system operations
- All code must run entirely in the browser

AVAILABLE COMPONENTS:
- Header: Main application header with logo and action buttons
- Sidebar: Shows list of coding challenges
- ChallengeItem: Individual challenge in the sidebar with accordion expansion
- CodeEditor: CodeMirror-based editor component
- Preview: Live preview of code execution
- AIAssistant: AI code generation assistant (this component)
- APIKeyDialog: Dialog for API configuration

Respond with only the code changes requested. No explanations, just the code.`
          },
          {
            role: 'user',
            content: `I have the following code:\n\n\`\`\`\n${code}\n\`\`\`\n\nRequest: ${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      }),
      customHeaders: (apiKey) => ({
        'Authorization': `Bearer ${apiKey}`
      }),
      extractResponse: (data) => data.choices[0].message.content
    },
    ANTHROPIC: {
      name: 'Anthropic',
      endpoint: 'https://api.anthropic.com/v1/messages',
      apiKeyName: 'ANTHROPIC_API_KEY',
      defaultModel: 'claude-3-haiku-20240307',
      models: [
        { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
        { id: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
        { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' }
      ],
      formatRequest: (prompt, code, model) => ({
        model: model || 'claude-3-haiku-20240307',
        max_tokens: 2048,
        messages: [
          {
            role: 'system',
            content: `You are a helpful AI assistant that helps write and improve code for a browser-based React application.

IMPORTANT ENVIRONMENT CONSTRAINTS:
- This is a pure browser environment using ES modules (no Node.js, no build steps)
- Code uses React 18 with Babel standalone for JSX transpilation
- All imports must use ES module syntax (import React from 'react')
- No npm packages are available except those explicitly imported via CDN/import maps
- Available libraries: React, ReactDOM, CodeMirror
- No server-side code, database access, or file system operations
- All code must run entirely in the browser

AVAILABLE COMPONENTS:
- Header: Main application header with logo and action buttons
- Sidebar: Shows list of coding challenges
- ChallengeItem: Individual challenge in the sidebar with accordion expansion
- CodeEditor: CodeMirror-based editor component
- Preview: Live preview of code execution
- AIAssistant: AI code generation assistant (this component)
- APIKeyDialog: Dialog for API configuration`
          },
          {
            role: 'user',
            content: `I have the following code:\n\n\`\`\`\n${code}\n\`\`\`\n\nRequest: ${prompt}\n\nRespond with only the code changes requested. No explanations, just the code.`
          }
        ]
      }),
      customHeaders: (apiKey) => ({
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }),
      extractResponse: (data) => data.content[0].text
    }
  }
};

// Test runner utility
window.runTests = async function(challengeId, userCode, challenges) {
  challenges = challenges || window.AppConstants.initialChallengesData;
  const challenge = challenges.find(c => c.id === challengeId);

  if (!challenge) return { success: false, error: 'Challenge not found' };

  try {
    const match = challenge.starterCode.match(/function\s+(\w+)/);
    if (!match) return { success: false, error: 'Cannot identify function name' };

    const funcName = match[1];
    const func = new Function(`${userCode}\nreturn ${funcName};`)();

    for (let t of challenge.tests) {
      const input = eval(t.input);
      const output = func(input);
      if (output !== eval(t.expected)) {
        return {
          success: false,
          failedTest: t,
          output: output,
          expected: t.expected,
        };
      }
    }
    return { success: true };
  } catch (e) {
    return { success: false, error: e };
  }
};
