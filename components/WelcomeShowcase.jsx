import React, { useState } from 'react';
import { motion } from 'https://esm.sh/framer-motion@11?external=react';
import { Sparkles, Zap, Code2, Palette, Rocket, Globe } from 'https://esm.sh/lucide-react@0.454.0?external=react';
import { useEndpoints } from '../contexts/EndpointContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { parseOpenAPISpec } from '../services/openapi-parser.js';

function WelcomeShowcase() {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const { loadEndpointsFromSpec } = useEndpoints();
  const toast = useToast();

  const features = [
    {
      icon: Code2,
      title: 'React Components',
      description: 'Build interactive UIs with modern React hooks and state management',
      gradient: 'from-blue-500 to-cyan-500',
      colors: '#3b82f6, #06b6d4'
    },
    {
      icon: Zap,
      title: 'Real-time Preview',
      description: 'See your changes instantly with hot reload and live code execution',
      gradient: 'from-purple-500 to-pink-500',
      colors: '#a855f7, #ec4899'
    },
    {
      icon: Globe,
      title: 'Any API',
      description: 'Connect to any REST API, test endpoints, and visualize responses',
      gradient: 'from-green-500 to-emerald-500',
      colors: '#10b981, #059669'
    },
    {
      icon: Palette,
      title: 'ESM Imports',
      description: 'Import any library from ESM CDN - no build step required',
      gradient: 'from-orange-500 to-red-500',
      colors: '#f97316, #ef4444'
    }
  ];

  const handleGetStartedClick = () => {
    setLoading(true);

    const defaultSpec = {
      "openapi": "3.0.0",
      "info": {
        "title": "JSONPlaceholder API",
        "version": "1.0.0",
        "description": "A free fake API for testing and prototyping"
      },
      "servers": [
        {
          "url": "https://jsonplaceholder.typicode.com"
        }
      ],
      "paths": {
        "/users": {
          "get": {
            "summary": "List all users",
            "description": "Fetch a list of all users",
            "responses": {
              "200": {
                "description": "A list of users",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "integer" },
                          "name": { "type": "string" },
                          "username": { "type": "string" },
                          "email": { "type": "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/posts": {
          "get": {
            "summary": "List all posts",
            "description": "Fetch a list of all posts",
            "responses": {
              "200": {
                "description": "A list of posts",
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "integer" },
                          "userId": { "type": "integer" },
                          "title": { "type": "string" },
                          "body": { "type": "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "post": {
            "summary": "Create a new post",
            "description": "Create a new post with title and body",
            "requestBody": {
              "content": {
                "application/json": {
                  "schema": {
                    "type": "object",
                    "properties": {
                      "title": { "type": "string", "default": "My New Post" },
                      "body": { "type": "string", "default": "This is the content of my post" },
                      "userId": { "type": "integer", "default": 1 }
                    }
                  }
                }
              }
            },
            "responses": {
              "201": {
                "description": "Post created successfully"
              }
            }
          }
        },
        "/posts/{id}": {
          "get": {
            "summary": "Get post by ID",
            "description": "Fetch a specific post by its ID",
            "parameters": [
              {
                "name": "id",
                "in": "path",
                "required": true,
                "schema": { "type": "integer", "default": 1 }
              }
            ],
            "responses": {
              "200": {
                "description": "A single post"
              }
            }
          }
        }
      }
    };

    try {
      const { endpoints, baseUrl } = parseOpenAPISpec(defaultSpec, null);
      loadEndpointsFromSpec(endpoints, baseUrl, null);
      toast.addToast(`Loaded ${endpoints.length} demo endpoints!`, 'success');
      setLoading(false);
    } catch (error) {
      console.error('Error loading default spec:', error);
      toast.addToast('Failed to load demo API', 'error');
      setLoading(false);
    }
  };

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
          margin: '0 auto 4rem'
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
                  background: `linear-gradient(135deg, ${feature.colors})`,
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
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.3 }}
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          margin: '0 auto'
        }}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGetStartedClick}
          disabled={loading}
          style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'white',
            background: loading
              ? 'rgba(148, 163, 184, 0.5)'
              : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)',
            padding: '1rem 3rem',
            borderRadius: '0.75rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.3s ease',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid white',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite'
              }} />
              Loading...
            </>
          ) : (
            <>
              <Rocket size={24} />
              Get Started with Demo API
            </>
          )}
        </motion.button>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          style={{
            marginTop: '1.5rem',
            color: '#64748b',
            fontSize: '0.95rem'
          }}
        >
          Click to load a demo API with users and posts endpoints, or use the Load Spec button to import your own OpenAPI specification
        </motion.p>
      </motion.div>
    </div>
  );
}

export default WelcomeShowcase;
