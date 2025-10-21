// Client-Side Pagination Code Generator
// Generates code for client-side paginated responses (results + total_count pattern)

import { IMPORTS, generateFetchOptions } from '../../utils/code-templates.js';
import { generateStateDeclarations, generateParamInputs } from '../../utils/code-generation-helpers.js';

/**
 * Generate code for client-side pagination (single API call, paginate in browser)
 * Used when API returns { results: [], total_count: N } in a single response
 * @param {string} funcName - Function name
 * @param {string} fullUrl - Full API URL
 * @param {Array} allParams - All parameters (path + query)
 * @param {Array} pathParams - Path parameters
 * @param {Array} queryParams - Query parameters
 * @param {Object} endpoint - Endpoint metadata
 * @param {string|null} bearerToken - Optional bearer token
 * @returns {string} Generated JSX code
 */
export function generateClientPaginatedCode(funcName, fullUrl, allParams, pathParams, queryParams, endpoint, bearerToken = null) {
  const stateInit = generateStateDeclarations(allParams);
  const stateVars = allParams.map(p => p.name).join(', ');

  let urlBase = `\`${fullUrl}\``;
  pathParams.forEach(param => {
    urlBase = urlBase.replace(`:${param.name}`, `\${${param.name}}`);
  });

  // Build query params
  const queryParamsArray = queryParams.map(p => `"${p.name}=" + ${p.name}`);
  const queryParamsConstruction = queryParamsArray.length > 0
    ? '"?" + ' + queryParamsArray.join(' + "&" + ')
    : '""';

  const fetchOptions = generateFetchOptions(null, false, bearerToken);
  const paramInputs = allParams.length > 0 ? generateParamInputs(allParams) : '';
  const hasParamsSection = paramInputs.length > 0;

  const urlConstruction = queryParamsArray.length > 0
    ? `${urlBase} + ${queryParamsConstruction}`
    : urlBase;

  return `${IMPORTS}

function ${funcName}() {
${stateInit}
  const [allResults, setAllResults] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = ${urlConstruction};

    console.log('Fetching:', url);
    setLoading(true);
    setError(null);

    fetch(url${fetchOptions})
      .then(response => {
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return response.json();
      })
      .then(result => {
        console.log('Response:', result);
        // Extract results array and total_count from response
        const results = result.results || [];
        const total = result.total_count || results.length;

        setAllResults(results);
        setTotalCount(total);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [${stateVars}]);

  return (
    <Layout loading={loading}>
${hasParamsSection ? `      <Params>
${paramInputs}
      </Params>` : ''}
      <ErrorDisplay error={error} />
      {totalCount > 0 && (
        <Toolbar data={{ total_count: totalCount }} exclude={[]} />
      )}
      {!error && <ClientPaginatedResponse
        allItems={allResults}
        currentPath="${endpoint.path}"
        pageSize={20}
      />}
    </Layout>
  );
}

export default ${funcName};`;
}
