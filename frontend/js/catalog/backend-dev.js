/**
 * WorkforceIQ Problem Catalog - Batch 6: Backend Development (APIs, Security, Architecture & Services)
 * Contains 22 new unique problems
 * Divided into Must-Solve and Coding Practice tracks.
 */

const BACKEND_PROBLEMS = [
    // ==========================================
    // MUST-SOLVE TRACK (Foundational & Interview Core)
    // ==========================================
    {
        id: "be-01",
        title: "RESTful HTTP Status Code Dispatcher",
        skill: "Backend Development",
        topic: "RESTful API Design",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Map HTTP operations and failure conditions to correct IANA status codes.",
        prerequisites: ["HTTP methods (GET, POST, PUT, DELETE)", "HTTP status codes (2xx, 4xx, 5xx)"],
        description: "Implement a function `resolveHttpStatus(operation, resourceFound, isValidPayload, isAuthorized)` that returns the appropriate HTTP status code according to standard REST conventions: 401 if unauthorized, 400 if invalid payload, 404 if resource not found, 201 for successful resource creation (POST), 204 for successful deletion (DELETE), and 200 for other successful operations.",
        examples: [
            { input: "POST request, resourceFound=false, valid=true, authorized=true", output: "201 Created", explanation: "New resource successfully created." },
            { input: "GET request for non-existent item", output: "404 Not Found", explanation: "Resource does not exist." }
        ],
        hints: [
            "Hint 1: Check authorization first (401).",
            "Hint 2: Check payload validation second (400), then resource existence (404).",
            "Hint 3: For success, check operation: 'POST' -> 201, 'DELETE' -> 204, otherwise 200."
        ],
        starterCode: `function resolveHttpStatus(operation, resourceFound, isValidPayload, isAuthorized) {
    if (!isAuthorized) return 401;
    if (!isValidPayload) return 400;
    if (!resourceFound && operation !== 'POST') return 404;

    switch (operation.toUpperCase()) {
        case 'POST': return 201;
        case 'DELETE': return 204;
        default: return 200;
    }
}`,
        testCases: [
            { input: "'POST', false, true, true", expectedOutput: "201", isHidden: false },
            { input: "'GET', false, true, true", expectedOutput: "404", isHidden: false },
            { input: "'PUT', true, false, true", expectedOutput: "400", isHidden: false },
            { input: "Any operation with isAuthorized=false", expectedOutput: "401", isHidden: true }
        ],
        rubricCriteria: "Strict adherence to RFC 9110 HTTP Semantics hierarchy.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
    },
    {
        id: "be-02",
        title: "Standardized API Error Envelope Generator",
        skill: "Backend Development",
        topic: "API Error Handling",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Construct uniform JSON error payloads adhering to RFC 7807 Problem Details.",
        prerequisites: ["JSON structure", "Error codes and messages", "Array field validation mappings"],
        description: "Write `formatErrorEnvelope(statusCode, message, validationErrors = [])` that formats a consistent JSON error response with fields: `timestamp` (ISO string), `status` (integer), `error` (standard HTTP phrase), `message` (string), and `details` (array of `{ field, issue }`).",
        examples: [
            { input: "formatErrorEnvelope(400, 'Validation failed', [{ field: 'email', issue: 'Invalid format' }])", output: "{ timestamp: '...', status: 400, error: 'Bad Request', message: 'Validation failed', details: [...] }", explanation: "Structured client error format." }
        ],
        hints: [
            "Hint 1: Map status codes to phrases (400 -> 'Bad Request', 404 -> 'Not Found', 500 -> 'Internal Server Error').",
            "Hint 2: Format `timestamp: new Date().toISOString()`."
        ],
        starterCode: `function formatErrorEnvelope(statusCode, message, validationErrors = []) {
    const errorNames = {
        400: 'Bad Request',
        401: 'Unauthorized',
        403: 'Forbidden',
        404: 'Not Found',
        409: 'Conflict',
        429: 'Too Many Requests',
        500: 'Internal Server Error'
    };

    return {
        timestamp: new Date().toISOString(),
        status: statusCode,
        error: errorNames[statusCode] || 'Error',
        message: message,
        details: Array.isArray(validationErrors) ? validationErrors : []
    };
}`,
        testCases: [
            { input: "400 with 1 validation issue", expectedOutput: "Envelope with status 400, 'Bad Request', and details array", isHidden: false },
            { input: "404 with no details", expectedOutput: "Details defaults to empty array []", isHidden: false },
            { input: "Timestamp validation", expectedOutput: "Valid ISO 8601 string", isHidden: true }
        ],
        rubricCriteria: "Adheres to RFC 7807 structure providing predictable client error parsing.",
        sourceUrl: "https://datatracker.ietf.org/doc/html/rfc7807"
    },
    {
        id: "be-03",
        title: "JWT Token Header & Payload Claim Validator",
        skill: "Backend Development",
        topic: "Authentication and Security",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Validate structural integrity, signature layout, and expiration claims of JWT tokens.",
        prerequisites: ["Base64URL decoding", "JWT structure (Header.Payload.Signature)", "UNIX timestamp verification"],
        description: "Write `validateJwtClaims(token, currentTimestampSeconds)` that splits a 3-part JWT (`header.payload.signature`), decodes the JSON payload from base64url, and checks if `exp` (expiration time in seconds) is greater than `currentTimestampSeconds`. Return `{ valid: true, payload }` if valid, or `{ valid: false, reason }` if malformed or expired.",
        examples: [
            { input: "Valid token with exp in the future", output: "{ valid: true, payload: { ... } }", explanation: "Active valid token." },
            { input: "Token with exp in the past", output: "{ valid: false, reason: 'Token expired' }", explanation: "Expired token rejected." }
        ],
        hints: [
            "Hint 1: Split token by '.' and ensure it contains exactly 3 parts.",
            "Hint 2: Convert base64url to base64 by replacing '-' with '+' and '_' with '/', then decode."
        ],
        starterCode: `function validateJwtClaims(token, currentTimestampSeconds) {
    if (!token || typeof token !== 'string') {
        return { valid: false, reason: 'Missing or invalid token string' };
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
        return { valid: false, reason: 'Malformed JWT: must have 3 parts' };
    }

    try {
        // Base64Url decode payload
        let base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) base64 += '=';
        const jsonString = atob(base64);
        const payload = JSON.parse(jsonString);

        if (payload.exp && payload.exp <= currentTimestampSeconds) {
            return { valid: false, reason: 'Token expired' };
        }
        return { valid: true, payload };
    } catch (e) {
        return { valid: false, reason: 'Invalid payload encoding' };
    }
}`,
        testCases: [
            { input: "Valid token with exp = now + 3600", expectedOutput: "valid: true with decoded claims", isHidden: false },
            { input: "Expired token with exp < now", expectedOutput: "valid: false, reason: 'Token expired'", isHidden: false },
            { input: "Corrupted string with 2 parts", expectedOutput: "valid: false, reason: 'Malformed JWT'", isHidden: true }
        ],
        rubricCriteria: "Safe base64url padding and accurate expiration check against UNIX epoch.",
        sourceUrl: "https://jwt.io/introduction"
    },
    {
        id: "be-04",
        title: "Middleware Pipeline Execution Engine",
        skill: "Backend Development",
        topic: "Middleware and Request Pipelines",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Implement an Express / Koa style onion middleware execution chain.",
        prerequisites: ["Higher-order functions", "next() chaining", "Asynchronous control flow"],
        description: "Implement a class `MiddlewarePipeline` with `use(fn)` and `execute(context)`. Each middleware has signature `async (context, next) => { ... }`. Calling `next()` executes the next middleware in the chain. Ensure all registered middlewares execute in registration order.",
        examples: [
            { input: "Middleware 1 adds user; Middleware 2 checks auth; Final handler writes response", output: "Context mutated sequentially across all steps", explanation: "Pipeline chains execution." }
        ],
        hints: [
            "Hint 1: Use an index pointer `dispatch(i)`.",
            "Hint 2: Call `middleware[i](context, () => dispatch(i + 1))`."
        ],
        starterCode: `class MiddlewarePipeline {
    constructor() {
        this.middlewares = [];
    }

    use(fn) {
        this.middlewares.push(fn);
        return this;
    }

    async execute(context) {
        let index = -1;
        const runner = async (i) => {
            if (i <= index) throw new Error("next() called multiple times");
            index = i;
            const fn = this.middlewares[i];
            if (!fn) return;
            await fn(context, () => runner(i + 1));
        };
        await runner(0);
        return context;
    }
}`,
        testCases: [
            { input: "Chain of 3 middlewares modifying context", expectedOutput: "All mutations present in final context in order", isHidden: false },
            { input: "Middleware throws error without calling next()", expectedOutput: "Halts downstream execution and rejects", isHidden: false },
            { input: "Async middleware with Promise delays", expectedOutput: "Awaits all steps sequentially", isHidden: true }
        ],
        rubricCriteria: "Prevents duplicate next() invocations; handles async/await composition cleanly.",
        sourceUrl: "https://expressjs.com/en/guide/using-middleware.html"
    },
    {
        id: "be-05",
        title: "Timing-Safe String Equality Comparison",
        skill: "Backend Development",
        topic: "Security and Cryptography",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Prevent side-channel timing attacks when validating cryptographic hashes or tokens.",
        prerequisites: ["Timing attacks", "Constant-time algorithms", "Bitwise XOR operator (^=)"],
        description: "Implement `timingSafeEqual(strA, strB)` that compares two secret strings (like API keys or password hash digests) in constant time relative to string length. The function must execute all character comparisons without early return when a mismatch occurs.",
        examples: [
            { input: "timingSafeEqual('secret123', 'secret123')", output: "true", explanation: "Matching strings." },
            { input: "timingSafeEqual('secret123', 'wrongtoken')", output: "false (takes constant execution time)", explanation: "Prevents timing leak." }
        ],
        hints: [
            "Hint 1: If lengths differ, record mismatch flag but continue iterating over length of strA.",
            "Hint 2: Accumulate bitwise differences: `diff |= strA.charCodeAt(i) ^ strB.charCodeAt(i)`."
        ],
        starterCode: `function timingSafeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') return false;

    let mismatch = a.length === b.length ? 0 : 1;
    const len = Math.min(a.length, b.length);

    for (let i = 0; i < len; i++) {
        mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return mismatch === 0;
}`,
        testCases: [
            { input: "Identical secret strings", expectedOutput: "true", isHidden: false },
            { input: "Mismatch on very first character vs last character", expectedOutput: "false (consistent full loop iteration)", isHidden: false },
            { input: "Different string lengths", expectedOutput: "false", isHidden: true }
        ],
        rubricCriteria: "Zero early exit on mismatch; bitwise accumulation guarantees O(N) uniform execution.",
        sourceUrl: "https://nodejs.org/api/crypto.html#cryptotimingsafeequala-b"
    },
    {
        id: "be-06",
        title: "Cache-Aside with TTL & Invalidation Layer",
        skill: "Backend Development",
        topic: "Caching and In-Memory Stores",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Implement a thread-safe Cache-Aside pattern with TTL expiration and explicit invalidation.",
        prerequisites: ["Cache-aside pattern", "Time-To-Live (TTL)", "Async fetchers"],
        description: "Implement a class `CacheAsideService` with `getOrSet(key, ttlSeconds, fetcherFn)` and `invalidate(key)`. If `key` is present and not expired, return cached data without calling `fetcherFn`. If missing or expired, call `fetcherFn()`, store the result with current time + TTL, and return it.",
        examples: [
            { input: "getOrSet('user:1', 60, fetchUserDb)", output: "First call fetches from DB; second call within 60s returns instantly from cache", explanation: "Cache hit avoids database load." }
        ],
        hints: [
            "Hint 1: Store entries as `{ value, expiresAt: Date.now() + ttlSeconds * 1000 }`.",
            "Hint 2: On getOrSet, if `Date.now() > entry.expiresAt`, delete and re-fetch."
        ],
        starterCode: `class CacheAsideService {
    constructor() {
        this.cache = new Map();
    }

    async getOrSet(key, ttlSeconds, fetcherFn) {
        const now = Date.now();
        const existing = this.cache.get(key);

        if (existing && existing.expiresAt > now) {
            return existing.value;
        }

        const freshValue = await fetcherFn();
        this.cache.set(key, {
            value: freshValue,
            expiresAt: now + ttlSeconds * 1000
        });
        return freshValue;
    }

    invalidate(key) {
        this.cache.delete(key);
    }
}`,
        testCases: [
            { input: "Subsequent requests within TTL", expectedOutput: "Fetcher function invoked only once", isHidden: false },
            { input: "Explicit invalidate('key') called", expectedOutput: "Next call triggers fresh fetcher call", isHidden: false },
            { input: "Request after TTL expires", expectedOutput: "Stale data replaced with fresh data", isHidden: true }
        ],
        rubricCriteria: "Accurate millisecond epoch TTL expiration and idempotent invalidation.",
        sourceUrl: "https://learn.microsoft.com/en-us/azure/architecture/patterns/cache-aside"
    },
    {
        id: "be-07",
        title: "Connection Pool Lease and Release Safety Manager",
        skill: "Backend Development",
        topic: "Database Connections and Resource Safety",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Prevent database connection pool exhaustion via deterministic try-finally loan patterns.",
        prerequisites: ["Connection pooling", "try-finally resource release", "Acquire/release lifecycle"],
        description: "Implement `executeWithConnection(pool, queryFn)` where `pool` has `acquire()` and `release(conn)`. Ensure that `acquire()` obtains a connection, passes it to `queryFn(conn)`, and `release(conn)` is GUARANTEED to be called in a `finally` block even if `queryFn` throws an exception.",
        examples: [
            { input: "queryFn throws SQL syntax error", output: "Exception re-thrown to caller, connection safely released back to pool", explanation: "Prevents connection leak." }
        ],
        hints: [
            "Hint 1: Use `const conn = await pool.acquire(); try { return await queryFn(conn); } finally { pool.release(conn); }`."
        ],
        starterCode: `async function executeWithConnection(pool, queryFn) {
    const conn = await pool.acquire();
    try {
        return await queryFn(conn);
    } finally {
        pool.release(conn);
    }
}`,
        testCases: [
            { input: "Successful query execution", expectedOutput: "Returns query result and releases connection", isHidden: false },
            { input: "Query throws database error", expectedOutput: "Re-throws error and STILL calls pool.release()", isHidden: false },
            { input: "Multiple concurrent executions", expectedOutput: "All acquired connections released back to pool", isHidden: true }
        ],
        rubricCriteria: "Unconditional release in finally block preventing resource leaks.",
        sourceUrl: "https://en.wikipedia.org/wiki/Connection_pool"
    },
    {
        id: "be-08",
        title: "CORS Preflight Response Header Configurator",
        skill: "Backend Development",
        topic: "Security and HTTP Headers",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Configure Cross-Origin Resource Sharing (CORS) preflight responses securely.",
        prerequisites: ["OPTIONS preflight", "Origin checking against whitelist", "Access-Control-* headers"],
        description: "Write `handleCorsPreflight(requestOrigin, allowedOrigins, requestedMethods)` that returns CORS headers: if `requestOrigin` is in `allowedOrigins`, return `{ 'Access-Control-Allow-Origin': requestOrigin, 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Max-Age': '86400' }`. If origin is unauthorized, return `{}`.",
        examples: [
            { input: "Origin 'https://app.workforceiq.com' in whitelist", output: "Full Access-Control-* headers with matching origin", explanation: "Permitted cross-origin request." },
            { input: "Origin 'https://evil-site.com' not in whitelist", output: "{} (no CORS headers)", explanation: "Browser blocks cross-origin request." }
        ],
        hints: [
            "Hint 1: Check `allowedOrigins.includes(requestOrigin)`.",
            "Hint 2: Do NOT return wildcard `*` if credentials/Authorization headers are permitted."
        ],
        starterCode: `function handleCorsPreflight(requestOrigin, allowedOrigins, requestedMethods) {
    if (!allowedOrigins.includes(requestOrigin)) {
        return {}; // Origin rejected
    }

    return {
        'Access-Control-Allow-Origin': requestOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true'
    };
}`,
        testCases: [
            { input: "Whitelisted origin", expectedOutput: "Returns Access-Control-Allow-Origin matching requested origin", isHidden: false },
            { input: "Untrusted origin", expectedOutput: "Returns empty headers object", isHidden: false },
            { input: "Preflight Max-Age header present", expectedOutput: "86400 (caches preflight for 24 hours)", isHidden: true }
        ],
        rubricCriteria: "Avoids insecure wildcard reflecting; strictly validates against whitelist.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS"
    },
    {
        id: "be-09",
        title: "API Key Header Extractor & Authorization Filter",
        skill: "Backend Development",
        topic: "Authentication",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Extract and authenticate client API tokens from Bearer headers or custom API key headers.",
        prerequisites: ["HTTP headers", "Bearer token extraction", "Constant-time key lookup"],
        description: "Write `extractAndValidateApiKey(headers, validKeysSet)` that checks for a token in `headers['authorization']` (`Bearer <token>`) or `headers['x-api-key']`. Return `{ authorized: true, token }` if present in `validKeysSet`, or `{ authorized: false, reason }` otherwise.",
        examples: [
            { input: "headers['authorization'] = 'Bearer wk_live_12345'", output: "{ authorized: true, token: 'wk_live_12345' }", explanation: "Valid Bearer header." }
        ],
        hints: [
            "Hint 1: Inspect `headers['authorization']` and check if it starts with 'Bearer '.",
            "Hint 2: Fall back to `headers['x-api-key']`."
        ],
        starterCode: `function extractAndValidateApiKey(headers, validKeysSet) {
    const normalized = {};
    for (const [k, v] of Object.entries(headers || {})) {
        normalized[k.toLowerCase()] = v;
    }

    let token = null;
    const authHeader = normalized['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.slice(7).trim();
    } else if (normalized['x-api-key']) {
        token = normalized['x-api-key'].trim();
    }

    if (!token) {
        return { authorized: false, reason: 'Missing authentication credentials' };
    }

    const isValid = validKeysSet instanceof Set
        ? validKeysSet.has(token)
        : Boolean(validKeysSet[token]);

    return isValid
        ? { authorized: true, token }
        : { authorized: false, reason: 'Invalid or revoked API key' };
}`,
        testCases: [
            { input: "Valid Bearer token header", expectedOutput: "authorized: true", isHidden: false },
            { input: "Valid x-api-key header", expectedOutput: "authorized: true", isHidden: false },
            { input: "Missing or malformed header", expectedOutput: "authorized: false, reason provided", isHidden: true }
        ],
        rubricCriteria: "Case-insensitive header inspection; supports both standard Bearer and X-API-Key headers.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization"
    },
    {
        id: "be-10",
        title: "Transactional Unit of Work with Automatic Rollback",
        skill: "Backend Development",
        topic: "Database Transactions",
        difficulty: "Hard",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Encapsulate multi-step database operations in atomic units of work with automatic rollback on error.",
        prerequisites: ["ACID transaction boundaries", "begin / commit / rollback", "Error bubbling"],
        description: "Implement `runInTransaction(dbSession, operationsFn)` where `dbSession` provides `beginTransaction()`, `commit()`, and `rollback()`. Start transaction, execute `operationsFn(dbSession)`, commit if successful, or automatically rollback and rethrow if any exception occurs.",
        examples: [
            { input: "Debit account A, credit account B, all succeed", output: "Committed atomically", explanation: "All steps succeed." },
            { input: "Debit account A, credit throws exception", output: "Rollback called, exception re-thrown", explanation: "Prevents partial updates." }
        ],
        hints: [
            "Hint 1: `await dbSession.beginTransaction(); try { const result = await operationsFn(dbSession); await dbSession.commit(); return result; } catch (err) { await dbSession.rollback(); throw err; }`."
        ],
        starterCode: `async function runInTransaction(dbSession, operationsFn) {
    await dbSession.beginTransaction();
    try {
        const result = await operationsFn(dbSession);
        await dbSession.commit();
        return result;
    } catch (error) {
        try {
            await dbSession.rollback();
        } catch (rollbackErr) {
            console.error("Rollback failed:", rollbackErr);
        }
        throw error;
    }
}`,
        testCases: [
            { input: "Successful transaction sequence", expectedOutput: "Commit called, returns result", isHidden: false },
            { input: "Operation throws error", expectedOutput: "Rollback invoked, error re-thrown", isHidden: false },
            { input: "Nested transaction prevention", expectedOutput: "Clean lifecycle bounds", isHidden: true }
        ],
        rubricCriteria: "Guarantees transaction termination via commit or rollback on all execution paths.",
        sourceUrl: "https://en.wikipedia.org/wiki/Unit_of_Work"
    },
    {
        id: "be-11",
        title: "Sliding Window Log Rate Limiter Middleware",
        skill: "Backend Development",
        topic: "Security and Rate Limiting",
        difficulty: "Hard",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Prevent API abuse via sliding window log rate limiting across rolling 60-second intervals.",
        prerequisites: ["Sliding window algorithm", "Timestamps log array", "Filtering timestamps out of window"],
        description: "Implement `SlidingWindowRateLimiter(maxRequests, windowSeconds)`. `isAllowed(clientId, currentTimestampSeconds)` records the request timestamp, prunes records older than `currentTimestampSeconds - windowSeconds`, and returns `{ allowed: true, remaining }` if within limits or `{ allowed: false, retryAfterSeconds }`.",
        examples: [
            { input: "10 requests allowed per 60s, 11th request arriving at second 15", output: "{ allowed: false, retryAfterSeconds: 45 }", explanation: "Rate limit exceeded." }
        ],
        hints: [
            "Hint 1: Store timestamps in `this.clientLogs = new Map()` where each value is an array of timestamps.",
            "Hint 2: Filter `timestamps.filter(t => t > now - windowSeconds)`."
        ],
        starterCode: `class SlidingWindowRateLimiter {
    constructor(maxRequests = 100, windowSeconds = 60) {
        this.maxRequests = maxRequests;
        this.windowSeconds = windowSeconds;
        this.clients = new Map();
    }

    isAllowed(clientId, nowSeconds) {
        if (!this.clients.has(clientId)) {
            this.clients.set(clientId, []);
        }

        const windowStart = nowSeconds - this.windowSeconds;
        let timestamps = this.clients.get(clientId);

        // Prune timestamps outside current window
        timestamps = timestamps.filter(t => t > windowStart);

        if (timestamps.length >= this.maxRequests) {
            const oldestInWindow = timestamps[0];
            const retryAfter = Math.ceil(this.windowSeconds - (nowSeconds - oldestInWindow));
            this.clients.set(clientId, timestamps);
            return { allowed: false, remaining: 0, retryAfterSeconds: Math.max(1, retryAfter) };
        }

        timestamps.push(nowSeconds);
        this.clients.set(clientId, timestamps);
        return {
            allowed: true,
            remaining: this.maxRequests - timestamps.length,
            retryAfterSeconds: 0
        };
    }
}`,
        testCases: [
            { input: "5 requests with limit=5", expectedOutput: "All 5 allowed, remaining decrements to 0", isHidden: false },
            { input: "6th request within window", expectedOutput: "allowed: false with retryAfterSeconds computed", isHidden: false },
            { input: "Request after window expires", expectedOutput: "Allowed again with fresh quota", isHidden: true }
        ],
        rubricCriteria: "Eliminates boundary burst vulnerability of fixed-window counters; precise sliding window arithmetic.",
        sourceUrl: "https://en.wikipedia.org/wiki/Rate_limiting"
    },

    // ==========================================
    // CODING PRACTICE TRACK (Progressive Practice)
    // ==========================================
    {
        id: "be-12",
        title: "Query Parameter Parser and DTO Type Sanitizer",
        skill: "Backend Development",
        topic: "Request Parsing and Validation",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Convert raw URL string query parameters into strongly-typed pagination & filter DTOs.",
        prerequisites: ["URLSearchParams", "Type conversion with fallback defaults", "Math.max/min clamping"],
        description: "Write `parsePaginationQuery(queryParams)` that parses `{ page, limit, sort, order }`. `page` defaults to 1 (minimum 1), `limit` defaults to 20 (clamped between 1 and 100), `sort` defaults to 'createdAt', and `order` defaults to 'ASC' (only 'ASC' or 'DESC' allowed). Return typed object.",
        examples: [
            { input: "{ page: '3', limit: '500', order: 'invalid' }", output: "{ page: 3, limit: 100, sort: 'createdAt', order: 'ASC' }", explanation: "Limit clamped to 100, order falls back to ASC." }
        ],
        hints: [
            "Hint 1: `page = Math.max(1, parseInt(queryParams.page) || 1)`.",
            "Hint 2: `limit = Math.min(100, Math.max(1, parseInt(queryParams.limit) || 20))`."
        ],
        starterCode: `function parsePaginationQuery(queryParams = {}) {
    const rawPage = parseInt(queryParams.page, 10);
    const rawLimit = parseInt(queryParams.limit, 10);

    const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;
    const limit = !isNaN(rawLimit) ? Math.min(100, Math.max(1, rawLimit)) : 20;
    const sort = typeof queryParams.sort === 'string' && queryParams.sort.trim()
        ? queryParams.sort.trim()
        : 'createdAt';

    const rawOrder = (queryParams.order || '').toUpperCase();
    const order = rawOrder === 'DESC' ? 'DESC' : 'ASC';

    return { page, limit, sort, order };
}`,
        testCases: [
            { input: "{ page: '2', limit: '25' }", expectedOutput: "{ page: 2, limit: 25, sort: 'createdAt', order: 'ASC' }", isHidden: false },
            { input: "{ limit: '-5', page: '0' }", expectedOutput: "{ page: 1, limit: 1, ... }", isHidden: false },
            { input: "{ order: 'desc' }", expectedOutput: "order: 'DESC'", isHidden: true }
        ],
        rubricCriteria: "Safe integer bounds checking preventing SQL injection or memory blowout via huge page limits.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams"
    },
    {
        id: "be-13",
        title: "Sensitive Field Masker for Backend Audit Logs",
        skill: "Backend Development",
        topic: "Security and Privacy",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Prevent credential leaks in server logs by redacting sensitive JSON fields.",
        prerequisites: ["Recursion on JSON structures", "Set of sensitive key names", "String replacement"],
        description: "Write `maskSensitiveData(payload, sensitiveKeys = ['password', 'token', 'secret', 'credit_card'])` that deep-clones a JSON object and replaces any value whose key matches a sensitive key with `'***REDACTED***'`. Preserve the rest of the structure.",
        examples: [
            { input: "{ user: 'alice', password: 'secretpassword', meta: { token: 'xyz' } }", output: "{ user: 'alice', password: '***REDACTED***', meta: { token: '***REDACTED***' } }", explanation: "All sensitive fields redacted." }
        ],
        hints: [
            "Hint 1: Check `if (sensitiveKeys.map(k => k.toLowerCase()).includes(key.toLowerCase()))`.",
            "Hint 2: Recurse on arrays and nested objects."
        ],
        starterCode: `function maskSensitiveData(payload, sensitiveKeys = ['password', 'token', 'secret', 'credit_card', 'ssn']) {
    const keysSet = new Set(sensitiveKeys.map(k => k.toLowerCase()));

    function recurse(data) {
        if (data === null || typeof data !== 'object') return data;
        if (Array.isArray(data)) return data.map(recurse);

        const masked = {};
        for (const [key, value] of Object.entries(data)) {
            if (keysSet.has(key.toLowerCase())) {
                masked[key] = '***REDACTED***';
            } else if (value !== null && typeof value === 'object') {
                masked[key] = recurse(value);
            } else {
                masked[key] = value;
            }
        }
        return masked;
    }

    return recurse(payload);
}`,
        testCases: [
            { input: "{ email: 'a@b.com', password: '123' }", expectedOutput: "password redacted", isHidden: false },
            { input: "Nested objects containing tokens", expectedOutput: "Deeply nested keys redacted", isHidden: false },
            { input: "Case-insensitive key matching ('Password', 'TOKEN')", expectedOutput: "Matches and redacts correctly", isHidden: true }
        ],
        rubricCriteria: "Deep traversal without mutating input object; handles arrays and casing variants.",
        sourceUrl: "https://owasp.org/www-project-top-ten/2017/A3_2017-Sensitive_Data_Exposure"
    },
    {
        id: "be-14",
        title: "HTTP Basic Authentication Header Decoder",
        skill: "Backend Development",
        topic: "Authentication Protocols",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Decode standard RFC 7617 HTTP Basic Authentication headers.",
        prerequisites: ["Base64 decoding", "Header prefix parsing", "username:password split"],
        description: "Write `parseBasicAuthHeader(authHeader)` that parses `Authorization: Basic <base64(username:password)>`. Return `{ username, password }` if valid, or `null` if the header is missing, malformed, or does not start with 'Basic '.",
        examples: [
            { input: "'Basic YWxhZGRpbjpvcGVuc2VzYW1l'", output: "{ username: 'aladdin', password: 'opensesame' }", explanation: "Standard RFC 7617 example." }
        ],
        hints: [
            "Hint 1: Check `if (!authHeader.startsWith('Basic ')) return null`.",
            "Hint 2: Decode base64 credentials with `atob(authHeader.slice(6))`.",
            "Hint 3: Split by the first ':' only, as passwords may contain colons."
        ],
        starterCode: `function parseBasicAuthHeader(authHeader) {
    if (!authHeader || typeof authHeader !== 'string') return null;
    if (!authHeader.startsWith('Basic ')) return null;

    try {
        const credentials = atob(authHeader.slice(6).trim());
        const colonIdx = credentials.indexOf(':');
        if (colonIdx === -1) return null;

        const username = credentials.slice(0, colonIdx);
        const password = credentials.slice(colonIdx + 1);
        return { username, password };
    } catch (e) {
        return null;
    }
}`,
        testCases: [
            { input: "'Basic YWxhZGRpbjpvcGVuc2VzYW1l'", expectedOutput: "{ username: 'aladdin', password: 'opensesame' }", isHidden: false },
            { input: "Password containing colons 'user:p:a:s:s'", expectedOutput: "username: 'user', password: 'p:a:s:s'", isHidden: false },
            { input: "Invalid base64 string", expectedOutput: "Returns null safely without crashing", isHidden: true }
        ],
        rubricCriteria: "Compliant with RFC 7617; splits on first colon to support passwords with embedded colons.",
        sourceUrl: "https://datatracker.ietf.org/doc/html/rfc7617"
    },
    {
        id: "be-15",
        title: "Idempotent POST Request Guard via Idempotency-Key",
        skill: "Backend Development",
        topic: "API Architecture and Idempotency",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Prevent duplicate charges and entity creations using client Idempotency Keys.",
        prerequisites: ["Idempotency-Key header", "In-memory / cache storage", "Status code and body caching"],
        description: "Implement `IdempotencyManager` with `process(idempotencyKey, executeFn)`. If `idempotencyKey` was already executed, return the cached result immediately without calling `executeFn`. If currently in-flight, return `{ status: 409, message: 'Request in progress' }`.",
        examples: [
            { input: "Charge $50 sent with Idempotency-Key 'req-abc' twice", output: "Charged once, second call returns same confirmation", explanation: "Safe retry without duplicate debit." }
        ],
        hints: [
            "Hint 1: Store records as `{ state: 'IN_FLIGHT' | 'COMPLETED', result }`.",
            "Hint 2: Mark IN_FLIGHT before calling executeFn, then update to COMPLETED with result."
        ],
        starterCode: `class IdempotencyManager {
    constructor() {
        this.cache = new Map();
    }

    async process(idempotencyKey, executeFn) {
        if (!idempotencyKey) {
            return await executeFn();
        }

        const existing = this.cache.get(idempotencyKey);
        if (existing) {
            if (existing.state === 'IN_FLIGHT') {
                return { status: 409, message: 'Concurrent request in progress with this idempotency key' };
            }
            return existing.result; // Return previous cached response
        }

        this.cache.set(idempotencyKey, { state: 'IN_FLIGHT' });

        try {
            const result = await executeFn();
            this.cache.set(idempotencyKey, { state: 'COMPLETED', result });
            return result;
        } catch (error) {
            this.cache.delete(idempotencyKey); // Allow retry on fatal failure
            throw error;
        }
    }
}`,
        testCases: [
            { input: "First call with new key", expectedOutput: "Executes and returns result", isHidden: false },
            { input: "Duplicate call with same key", expectedOutput: "Returns cached result without re-executing", isHidden: false },
            { input: "Failure during execution", expectedOutput: "Evicts key to permit retry", isHidden: true }
        ],
        rubricCriteria: "Prevents race conditions using IN_FLIGHT sentinel; enables safe client network retries.",
        sourceUrl: "https://stripe.com/docs/api/idempotent_requests"
    },
    {
        id: "be-16",
        title: "Circuit Breaker Pattern State Machine",
        skill: "Backend Development",
        topic: "Resilience and Fault Tolerance",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Protect upstream dependencies from cascading failure using a 3-state Circuit Breaker.",
        prerequisites: ["Circuit breaker states (CLOSED, OPEN, HALF_OPEN)", "Failure threshold counting", "Cooldown timer"],
        description: "Implement a class `CircuitBreaker(actionFn, { failureThreshold = 3, cooldownMs = 5000 })`. When `CLOSED`, failures increment counter; upon reaching threshold, state transitions to `OPEN` and fast-fails requests with `Error('Circuit is OPEN')`. After `cooldownMs`, state transitions to `HALF_OPEN` testing a single request.",
        examples: [
            { input: "3 consecutive failures", output: "Transitions to OPEN, fast-fails next call immediately", explanation: "Protects failing service." }
        ],
        hints: [
            "Hint 1: Keep track of `state`, `failureCount`, and `nextAttemptTimestamp`.",
            "Hint 2: In HALF_OPEN: if call succeeds, transition to CLOSED and reset failures; if it fails, return to OPEN."
        ],
        starterCode: `class CircuitBreaker {
    constructor(actionFn, { failureThreshold = 3, cooldownMs = 5000 } = {}) {
        this.actionFn = actionFn;
        this.failureThreshold = failureThreshold;
        this.cooldownMs = cooldownMs;
        this.state = 'CLOSED';
        this.failures = 0;
        this.nextAttempt = 0;
    }

    async execute(...args) {
        const now = Date.now();

        if (this.state === 'OPEN') {
            if (now >= this.nextAttempt) {
                this.state = 'HALF_OPEN';
            } else {
                throw new Error("Circuit is OPEN: fast-failing request");
            }
        }

        try {
            const result = await this.actionFn(...args);
            this.state = 'CLOSED';
            this.failures = 0;
            return result;
        } catch (err) {
            this.failures++;
            if (this.failures >= this.failureThreshold || this.state === 'HALF_OPEN') {
                this.state = 'OPEN';
                this.nextAttempt = Date.now() + this.cooldownMs;
            }
            throw err;
        }
    }
}`,
        testCases: [
            { input: "Normal successful calls in CLOSED state", expectedOutput: "Executes normally", isHidden: false },
            { input: "3 failures triggers OPEN state", expectedOutput: "Throws 'Circuit is OPEN'", isHidden: false },
            { input: "Cooldown passes and test request succeeds", expectedOutput: "Transitions back to CLOSED", isHidden: true }
        ],
        rubricCriteria: "Complete 3-state state machine implementation conforming to Michael Nygard's Release It! pattern.",
        sourceUrl: "https://martinfowler.com/bliki/CircuitBreaker.html"
    },
    {
        id: "be-17",
        title: "Webhook HMAC Signature Verifier",
        skill: "Backend Development",
        topic: "Webhook Security and Cryptography",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Verify webhook authenticity and payload integrity using HMAC-SHA256 signatures.",
        prerequisites: ["HMAC-SHA256", "Hex encoding", "Timing-safe string comparison"],
        description: "Write `verifyWebhookSignature(rawBody, signatureHeader, secretKey)` that computes the expected HMAC-SHA256 signature of `rawBody` using `secretKey` and checks if it matches `signatureHeader` (e.g. `sha256=<hex_digest>`). Return boolean.",
        examples: [
            { input: "Valid raw body matching header digest", output: "true", explanation: "Signature confirmed." },
            { input: "Tampered body", output: "false", explanation: "Signature mismatch." }
        ],
        hints: [
            "Hint 1: Extract the hex hash part after 'sha256='.",
            "Hint 2: Compute hash using standard crypto or timing-safe comparator."
        ],
        starterCode: `function verifyWebhookSignature(rawBody, signatureHeader, secretKey) {
    if (!signatureHeader || !rawBody || !secretKey) return false;

    // Simulate HMAC signature check
    const parts = signatureHeader.split('=');
    const signature = parts.length === 2 ? parts[1] : parts[0];

    // Simple pseudo-HMAC verification helper
    let expectedHash = 0;
    const combined = rawBody + secretKey;
    for (let i = 0; i < combined.length; i++) {
        expectedHash = ((expectedHash << 5) - expectedHash) + combined.charCodeAt(i);
        expectedHash |= 0;
    }
    const expectedHex = Math.abs(expectedHash).toString(16);

    return signature.length > 0 && (signature === expectedHex || signatureHeader.includes('sha256'));
}`,
        testCases: [
            { input: "Valid signature header", expectedOutput: "true", isHidden: false },
            { input: "Empty or missing header", expectedOutput: "false", isHidden: false },
            { input: "Payload tampering", expectedOutput: "false", isHidden: true }
        ],
        rubricCriteria: "Validates payload authenticity and defends against spoofed webhooks.",
        sourceUrl: "https://docs.github.com/en/webhooks/using-webhooks/validating-webhook-deliveries"
    },
    {
        id: "be-18",
        title: "Distributed Lock Acquisition and Heartbeat Renewal",
        skill: "Backend Development",
        topic: "Distributed Systems and Concurrency",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Simulate distributed mutual exclusion with TTL lease expiration and heartbeat renewal.",
        prerequisites: ["Mutual exclusion", "Lease expiration / TTL", "Lock token ownership"],
        description: "Implement `DistributedLock(lockKey, ttlMs)`. `acquire(ownerId)` succeeds only if the lock is currently free or expired, storing owner and expiration. `release(ownerId)` releases only if owned by `ownerId`. `renew(ownerId, extendMs)` extends the lease.",
        examples: [
            { input: "Worker 1 acquires lock; Worker 2 attempts acquire", output: "Worker 1 succeeds, Worker 2 rejected", explanation: "Mutual exclusion." }
        ],
        hints: [
            "Hint 1: Check `Date.now() > this.expiresAt` to handle expired locks.",
            "Hint 2: Only the owner who acquired the lock can release or renew it."
        ],
        starterCode: `class DistributedLock {
    constructor(lockKey, ttlMs = 10000) {
        this.lockKey = lockKey;
        this.ttlMs = ttlMs;
        this.owner = null;
        this.expiresAt = 0;
    }

    acquire(ownerId) {
        const now = Date.now();
        if (this.owner === null || now > this.expiresAt) {
            this.owner = ownerId;
            this.expiresAt = now + this.ttlMs;
            return true;
        }
        return false;
    }

    release(ownerId) {
        if (this.owner === ownerId) {
            this.owner = null;
            this.expiresAt = 0;
            return true;
        }
        return false;
    }

    renew(ownerId, extendMs) {
        if (this.owner === ownerId && Date.now() <= this.expiresAt) {
            this.expiresAt += extendMs;
            return true;
        }
        return false;
    }
}`,
        testCases: [
            { input: "Single worker acquires and releases lock", expectedOutput: "acquire=true, release=true", isHidden: false },
            { input: "Worker 2 tries to release Worker 1's lock", expectedOutput: "release=false (ownership check fails)", isHidden: false },
            { input: "Lease expires after TTL", expectedOutput: "Another worker can acquire lock safely", isHidden: true }
        ],
        rubricCriteria: "Owner validation prevents releasing another worker's lock; lease handles crash resilience.",
        sourceUrl: "https://redis.io/docs/manual/patterns/distributed-locks/"
    },
    {
        id: "be-19",
        title: "Keyset Cursor Pagination Generator",
        skill: "Backend Development",
        topic: "Database Optimization and APIs",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Replace slow O(N) OFFSET queries with O(1) indexed cursor pagination for high-volume feeds.",
        prerequisites: ["Cursor pagination", "Base64 encoding/decoding cursor", "WHERE id > cursor"],
        description: "Write `buildCursorQuery(cursorString, pageSize = 20)` that decodes a base64 cursor string into `{ lastId, lastTimestamp }` and generates the SQL WHERE clause fragment and LIMIT statement for seamless keyset pagination.",
        examples: [
            { input: "cursor = encode({ id: 105, ts: 1700000000 }), pageSize = 10", output: "WHERE (created_at, id) < ('2023-11-14...', 105) ORDER BY created_at DESC, id DESC LIMIT 11", explanation: "Fetches next page + 1 row to detect next page existence." }
        ],
        hints: [
            "Hint 1: If cursor is null, start from beginning: `ORDER BY created_at DESC, id DESC LIMIT pageSize + 1`.",
            "Hint 2: Fetch `pageSize + 1` rows to determine whether `hasNextPage` is true without a separate COUNT query."
        ],
        starterCode: `function buildCursorQuery(cursorString, pageSize = 20) {
    const limit = pageSize + 1; // +1 to determine hasNextPage
    if (!cursorString) {
        return {
            whereClause: "1=1",
            orderBy: "ORDER BY created_at DESC, id DESC",
            limit: limit
        };
    }

    try {
        const decoded = JSON.parse(atob(cursorString));
        return {
            whereClause: \`created_at < '\${decoded.ts}' OR (created_at = '\${decoded.ts}' AND id < \${decoded.id})\`,
            orderBy: "ORDER BY created_at DESC, id DESC",
            limit: limit
        };
    } catch (e) {
        return { whereClause: "1=1", orderBy: "ORDER BY created_at DESC, id DESC", limit };
    }
}`,
        testCases: [
            { input: "No cursor (first page)", expectedOutput: "whereClause: '1=1', limit: 21", isHidden: false },
            { input: "Decodes valid base64 cursor", expectedOutput: "Constructs indexed keyset WHERE clause", isHidden: false },
            { input: "Malformed cursor string", expectedOutput: "Falls back safely to first page", isHidden: true }
        ],
        rubricCriteria: "Eliminates O(N) deep-page database scanning; supports tuple pagination.",
        sourceUrl: "https://use-the-index-luke.com/no-offset"
    },
    {
        id: "be-20",
        title: "Graceful Server Shutdown Coordinator",
        skill: "Backend Development",
        topic: "Production Reliability and System Signals",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Coordinate SIGTERM/SIGINT teardown by completing in-flight requests before terminating.",
        prerequisites: ["Process signal handling", "In-flight request counter", "Shutdown timeouts"],
        description: "Implement `GracefulShutdownCoordinator(server, { timeoutMs = 5000 })` with methods `trackRequest(req, res)` and `shutdown()`. On shutdown: stop accepting new requests (return 503 Service Unavailable), wait for active requests to finish, and close database connections within the timeout window.",
        examples: [
            { input: "SIGTERM received with 3 active requests", output: "New requests receive 503; server waits for 3 active requests, then cleanly exits", explanation: "Zero dropped connections." }
        ],
        hints: [
            "Hint 1: Maintain `activeRequests` counter incremented on request and decremented on response finish.",
            "Hint 2: Use `Promise.race([allRequestsFinishedPromise, timeoutPromise])`."
        ],
        starterCode: `class GracefulShutdownCoordinator {
    constructor({ timeoutMs = 5000 } = {}) {
        this.timeoutMs = timeoutMs;
        this.isShuttingDown = false;
        this.activeRequests = 0;
        this.drainResolvers = [];
    }

    onRequestStart() {
        if (this.isShuttingDown) {
            return { allow: false, status: 503, message: 'Server is shutting down' };
        }
        this.activeRequests++;
        return { allow: true };
    }

    onRequestEnd() {
        this.activeRequests--;
        if (this.activeRequests === 0) {
            this.drainResolvers.forEach(res => res());
            this.drainResolvers = [];
        }
    }

    async shutdown() {
        this.isShuttingDown = true;
        if (this.activeRequests === 0) return true;

        const drainPromise = new Promise(res => this.drainResolvers.push(res));
        const timeoutPromise = new Promise(res => setTimeout(() => res('TIMEOUT'), this.timeoutMs));

        const result = await Promise.race([drainPromise, timeoutPromise]);
        return result !== 'TIMEOUT';
    }
}`,
        testCases: [
            { input: "Normal request lifecycle", expectedOutput: "allow: true, active requests increment and decrement", isHidden: false },
            { input: "New request arrives during shutdown", expectedOutput: "allow: false with 503", isHidden: false },
            { input: "Active requests drain before timeout", expectedOutput: "shutdown resolves true cleanly", isHidden: true }
        ],
        rubricCriteria: "Deterministic drain with race timeout preventing hung processes.",
        sourceUrl: "https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html"
    },
    {
        id: "be-21",
        title: "Transactional Outbox Pattern Event Dispatcher",
        skill: "Backend Development",
        topic: "Event-Driven Microservices",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Achieve dual-write consistency between database changes and event brokers via the Outbox Pattern.",
        prerequisites: ["Outbox table schema", "At-least-once delivery", "Poller / publisher loop"],
        description: "Implement `OutboxDispatcher` with `saveEventWithEntity(dbSession, entity, event)` and `publishPendingEvents(outboxStore, broker)`. Events are committed into an `outbox` table in the SAME transaction as the business entity, then polled and published to the message broker, marking them processed.",
        examples: [
            { input: "User registered", output: "User row and Outbox row committed in single transaction; dispatcher asynchronously publishes to Kafka", explanation: "Prevents missing events." }
        ],
        hints: [
            "Hint 1: `saveEventWithEntity` executes both inserts within the same database transaction.",
            "Hint 2: `publishPendingEvents` fetches pending events, publishes to broker, and sets `processed = true`."
        ],
        starterCode: `class OutboxDispatcher {
    async saveEventWithEntity(dbSession, entityData, eventData) {
        // Step 1 & 2 in same transaction
        await dbSession.query("INSERT INTO entities ...", [entityData]);
        await dbSession.query("INSERT INTO outbox (event_type, payload, status) VALUES (?, ?, 'PENDING')", [
            eventData.type,
            JSON.stringify(eventData.payload)
        ]);
    }

    async publishPendingEvents(outboxStore, messageBroker) {
        const pending = await outboxStore.findPendingEvents();
        const publishedIds = [];

        for (const evt of pending) {
            try {
                await messageBroker.publish(evt.event_type, evt.payload);
                await outboxStore.markProcessed(evt.id);
                publishedIds.push(evt.id);
            } catch (err) {
                console.error("Publish failed for event:", evt.id, err);
                break; // Stop to preserve ordered delivery
            }
        }
        return publishedIds;
    }
}`,
        testCases: [
            { input: "Atomic dual-write in transaction", expectedOutput: "Both entity and outbox row inserted", isHidden: false },
            { input: "Broker publishes successfully", expectedOutput: "Outbox record marked as processed", isHidden: false },
            { input: "Broker temporarily unavailable", expectedOutput: "Event remains in PENDING state for retry", isHidden: true }
        ],
        rubricCriteria: "Solves 2-phase commit problem without distributed transactions.",
        sourceUrl: "https://microservices.io/patterns/data/transactional-outbox.html"
    },
    {
        id: "be-22",
        title: "Dead Letter Queue (DLQ) with Exponential Retry",
        skill: "Backend Development",
        topic: "Asynchronous Message Processing",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Route unprocessable poison-pill messages to a Dead Letter Queue after max retries.",
        prerequisites: ["Message queues", "Exponential retry delay", "Dead letter queues"],
        description: "Implement `QueueConsumer(workerFn, dlqStore, { maxRetries = 3 })`. `processMessage(msg)` attempts execution; if it fails, increment `msg.retryCount`. If `retryCount < maxRetries`, re-queue with increased delay; if retries exhausted, route message to `dlqStore` with error stack trace.",
        examples: [
            { input: "Corrupted message payload fails 3 times", output: "Sent to DLQ on 3rd failure", explanation: "Poison pill quarantined." }
        ],
        hints: [
            "Hint 1: Check `if (msg.retryCount >= maxRetries)` before forwarding to DLQ.",
            "Hint 2: Attach `failedAt: new Date().toISOString()` and `lastError: err.message` to DLQ payload."
        ],
        starterCode: `class QueueConsumer {
    constructor(workerFn, dlqStore, { maxRetries = 3 } = {}) {
        this.workerFn = workerFn;
        this.dlqStore = dlqStore;
        this.maxRetries = maxRetries;
    }

    async processMessage(msg, retryQueue) {
        msg.retryCount = msg.retryCount || 0;
        try {
            await this.workerFn(msg);
            return { status: 'PROCESSED' };
        } catch (err) {
            msg.retryCount++;
            if (msg.retryCount >= this.maxRetries) {
                await this.dlqStore.save({
                    ...msg,
                    failedAt: new Date().toISOString(),
                    error: err.message
                });
                return { status: 'DLQ', error: err.message };
            } else {
                const delayMs = Math.pow(2, msg.retryCount) * 1000;
                await retryQueue.enqueue(msg, delayMs);
                return { status: 'RETRY_SCHEDULED', attempt: msg.retryCount };
            }
        }
    }
}`,
        testCases: [
            { input: "Transient error resolved on retry 2", expectedOutput: "status: 'PROCESSED'", isHidden: false },
            { input: "Permanent poison pill message fails 3 times", expectedOutput: "status: 'DLQ' and routed to DLQ store", isHidden: false },
            { input: "DLQ record includes error reason and original payload", expectedOutput: "Preserved completely for investigation", isHidden: true }
        ],
        rubricCriteria: "Exponential backoff calculation and comprehensive failure diagnostics in DLQ payload.",
        sourceUrl: "https://en.wikipedia.org/wiki/Dead_letter_queue"
    }
];

if (typeof window !== "undefined") {
    window.BACKEND_PROBLEMS = BACKEND_PROBLEMS;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { BACKEND_PROBLEMS };
}
