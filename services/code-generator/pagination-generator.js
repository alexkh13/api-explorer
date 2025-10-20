// Pagination Code Generator
// Generates code for paginated GET requests with infinite scroll

import { IMPORTS, generateFetchOptions } from '../../utils/code-templates.js';
import { generateStateDeclarations, generateParamInputs, capitalize } from '../../utils/code-generation-helpers.js';

/**
 * Generate code for a paginated GET request with infinite scroll
 * @param {string} funcName - Function name
 * @param {string} fullUrl - Full API URL
 * @param {Object} skipParam - Skip/offset parameter metadata
 * @param {Object} limitParam - Limit parameter metadata
 * @param {Array} pathParams - Path parameters
 * @param {Array} queryParams - Query parameters
 * @param {Array} nonPaginationParams - Non-pagination parameters
 * @param {string} endpoint - Endpoint metadata
 * @param {string|null} bearerToken - Optional bearer token
 * @returns {string} Generated JSX code
 */
export function generatePaginatedCode(funcName, fullUrl, skipParam, limitParam, pathParams, queryParams, nonPaginationParams, endpoint, bearerToken = null) {
  const stateInit = generateStateDeclarations(nonPaginationParams);
  const nonPaginationStateVars = nonPaginationParams.map(p => p.name).join(', ');

  let urlBase = `\`${fullUrl}\``;
  pathParams.forEach(param => {
    urlBase = urlBase.replace(`:${param.name}`, `\${${param.name}}`);
  });

  const nonPaginationQueryParams = queryParams.filter(p => p.name !== skipParam.name && p.name !== limitParam.name);
  const fetchOptions = generateFetchOptions(null, false, bearerToken);
  const paramInputs = nonPaginationParams.length > 0 ? generateParamInputs(nonPaginationParams) : '';
  const hasParamsSection = paramInputs.length > 0;

  const skipVarName = skipParam.name.replace(/^_/, '');
  const limitVarName = limitParam.name.replace(/^_/, '');
  const skipRefName = skipVarName + 'Ref';

  // Build query params array including both non-pagination and pagination params
  const allQueryParamsForUrl = [
    ...nonPaginationQueryParams.map(p => `"${p.name}=" + ${p.name}`),
    `"${skipParam.name}=" + current${capitalize(skipVarName)}`,
    `"${limitParam.name}=" + ${limitVarName}`
  ];
  const queryParamsConstruction = '"?" + ' + allQueryParamsForUrl.join(' + "&" + ');

  return `${IMPORTS}

function ${funcName}() {
${stateInit}
  const [allResults, setAllResults] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const ${skipRefName} = useRef(${JSON.stringify(skipParam.default)});
  const [${limitVarName}] = useState(${JSON.stringify(limitParam.default)});
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const fetchPage = useCallback((current${capitalize(skipVarName)}) => {
    const queryParams = ${queryParamsConstruction};
    const url = ${urlBase} + queryParams;

    console.log('Fetching:', url);

    return fetch(url${fetchOptions})
      .then(response => {
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return response.json();
      })
      .then(result => {
        console.log('Response:', result);
        // Handle both array responses and object responses with 'results' key
        const newData = Array.isArray(result) ? result : (result.results || []);
        const isLastPage = newData.length < ${limitVarName};

        setAllResults(prev => [...prev, ...newData]);
        setResponseData(result);
        ${skipRefName}.current = Number(current${capitalize(skipVarName)}) + Number(${limitVarName});
        setHasMore(!isLastPage);
        setError(null);

        return result;
      });
  }, [${nonPaginationStateVars ? nonPaginationStateVars + ', ' : ''}${limitVarName}]);

  useEffect(() => {
    setLoading(true);
    setAllResults([]);
    ${skipRefName}.current = ${JSON.stringify(skipParam.default)};
    setHasMore(true);
    setError(null);
    fetchPage(${JSON.stringify(skipParam.default)})
      .then(() => setLoading(false))
      .catch(err => {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, [${nonPaginationStateVars ? nonPaginationStateVars + ', ' : ''}fetchPage]);

  const handleLoadMore = useCallback(() => {
    return fetchPage(${skipRefName}.current).catch(err => {
      console.error('Load more error:', err);
      setError(err.message);
    });
  }, [fetchPage]);

  // Check if response is an object with keys other than 'results'
  const hasToolbarData = responseData && typeof responseData === 'object' &&
    !Array.isArray(responseData) && Object.keys(responseData).some(key => key !== 'results');

  return (
    <Layout loading={loading}>
${hasParamsSection ? `      <Params>
${paramInputs}
      </Params>` : ''}
      <ErrorDisplay error={error} />
      {hasToolbarData && <Toolbar data={responseData} exclude={['results']} />}
      {!error && <PaginatedResponse
        items={allResults}
        onLoadMore={handleLoadMore}
        loading={loading}
        hasMore={hasMore}
        currentPath="${endpoint.path}"
      />}
    </Layout>
  );
}

export default ${funcName};`;
}
