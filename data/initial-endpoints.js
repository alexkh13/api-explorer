// Initial Endpoints Data
// Default endpoints for the API Explorer (JSONPlaceholder demo)

import { generateStarterCode } from '../services/code-generator/index.js';

/**
 * @typedef {Object} EndpointParameter
 * @property {string} name - Parameter name
 * @property {string} in - Parameter location ('path', 'query', 'header', 'body')
 * @property {string} type - Parameter type ('string', 'integer', 'boolean')
 * @property {*} default - Default value for the parameter
 */

/**
 * @typedef {Object} RequestBodyProperty
 * @property {string} type - Property type ('string', 'integer', 'boolean', 'object', 'array')
 * @property {*} default - Default value for the property
 */

/**
 * @typedef {Object} RequestBody
 * @property {string} type - Request body type (usually 'object')
 * @property {Object.<string, RequestBodyProperty>} properties - Request body properties
 */

/**
 * @typedef {Object} Endpoint
 * @property {string} id - Unique endpoint identifier
 * @property {string} title - Human-readable endpoint title
 * @property {string} description - Endpoint description
 * @property {string} method - HTTP method ('GET', 'POST', 'PUT', 'PATCH', 'DELETE')
 * @property {string} path - API path (may include :params)
 * @property {boolean} completed - Whether user has completed this endpoint
 * @property {EndpointParameter[]} [parameters] - Endpoint parameters (path, query, etc.)
 * @property {RequestBody} [requestBody] - Request body schema for POST/PUT/PATCH
 * @property {string} [starterCode] - Generated JSX starter code
 * @property {boolean} [isFromSpec] - Whether loaded from OpenAPI spec
 */

/**
 * Base URL for sample JSONPlaceholder API endpoints
 * @type {string}
 * @constant
 */
const JSONPLACEHOLDER_BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Metadata-only endpoint definitions (no hardcoded starterCode)
 * Starter code is generated dynamically using code-generator service
 * @type {Endpoint[]}
 */
const initialEndpointsMetadata = [
    {
      id: "1",
      title: "Welcome to API Explorer",
      description: "Interactive showcase demonstrating the preview capabilities",
      method: "GET",
      path: "/",
      completed: false,
      isCustomCode: true, // Prevent regeneration - use starterCode as-is
      // Special flag to indicate this endpoint has custom starter code
      customStarterCode: `import React, { useState } from 'react';
import { motion } from 'https://esm.sh/framer-motion@11?external=react';
import { Sparkles, Zap, Code2, Palette, Rocket, Globe } from 'https://esm.sh/lucide-react@0.454.0?external=react';

function WelcomeShowcase() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const features = [
    {
      icon: Code2,
      title: 'React Components',
      description: 'Build interactive UIs with modern React hooks and state management',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Zap,
      title: 'Real-time Preview',
      description: 'See your changes instantly with hot reload and live code execution',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Any API',
      description: 'Connect to any REST API, test endpoints, and visualize responses',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Palette,
      title: 'ESM Imports',
      description: 'Import any library from ESM CDN - no build step required',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      padding: '3rem 1.5rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{ display: 'inline-block', marginBottom: '1.5rem' }}
        >
          <Sparkles size={64} color="#60a5fa" strokeWidth={1.5} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{
            fontSize: '3.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}
        >
          Build Anything, Preview Instantly
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          style={{
            fontSize: '1.25rem',
            color: '#94a3b8',
            maxWidth: '42rem',
            margin: '0 auto'
          }}
        >
          A modern API explorer that lets you create interactive React components
          for any endpoint - no build step, no setup, just pure creativity
        </motion.p>
      </motion.div>

      {/* Feature Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                background: hoveredCard === index
                  ? 'rgba(51, 65, 85, 0.8)'
                  : 'rgba(30, 41, 59, 0.6)',
                borderRadius: '1rem',
                padding: '2rem',
                border: '1px solid rgba(148, 163, 184, 0.1)',
                backdropFilter: 'blur(10px)',
                cursor: 'pointer',
                transition: 'background 0.3s ease'
              }}
            >
              <motion.div
                animate={{
                  rotate: hoveredCard === index ? 360 : 0
                }}
                transition={{ duration: 0.6 }}
                style={{
                  display: 'inline-flex',
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  background: \`linear-gradient(135deg, var(--tw-gradient-stops))\`,
                  backgroundImage: \`linear-gradient(135deg, \${feature.gradient.includes('blue') ? '#3b82f6, #06b6d4' : feature.gradient.includes('purple') ? '#a855f7, #ec4899' : feature.gradient.includes('green') ? '#10b981, #059669' : '#f97316, #ef4444'})\`,
                  marginBottom: '1rem'
                }}
              >
                <Icon size={32} color="white" strokeWidth={2} />
              </motion.div>

              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                color: '#f1f5f9',
                marginBottom: '0.5rem'
              }}>
                {feature.title}
              </h3>

              <p style={{
                color: '#94a3b8',
                lineHeight: '1.6'
              }}>
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        style={{
          textAlign: 'center',
          marginTop: '4rem'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            color: 'white',
            fontSize: '1.125rem',
            fontWeight: '600',
            padding: '1rem 2.5rem',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 30px rgba(59, 130, 246, 0.3)'
          }}
          onClick={() => alert('Click the + button or "Load Spec" to add your own API endpoints!')}
        >
          <Rocket size={20} />
          Get Started
        </motion.button>

        <p style={{
          color: '#64748b',
          marginTop: '1rem',
          fontSize: '0.875rem'
        }}>
          Click "Load Spec" or the + button to explore your own APIs
        </p>
      </motion.div>
    </div>
  );
}`
    },
];

/**
 * Initial endpoints data with dynamically generated starter code
 * Creates fully-formed endpoint objects by generating JSX code for each endpoint
 * This ensures consistency between initial demo endpoints and spec-loaded endpoints
 *
 * @type {Endpoint[]}
 * @constant
 *
 * @example
 * import { initialEndpointsData } from './data/initial-endpoints.js';
 * const firstEndpoint = initialEndpointsData[0]; // { id, title, description, method, path, starterCode, ... }
 */
export const initialEndpointsData = initialEndpointsMetadata.map(endpoint => {
  // Use custom starter code if available, otherwise generate it
  const starterCode = endpoint.customStarterCode
    ? endpoint.customStarterCode
    : generateStarterCode(endpoint, JSONPLACEHOLDER_BASE_URL);

  // Remove customStarterCode from the final object
  const { customStarterCode, ...endpointWithoutCustom } = endpoint;

  return {
    ...endpointWithoutCustom,
    starterCode
  };
});
