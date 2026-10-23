/**
 * WorkforceIQ Problem Catalog - Batch 5: Frontend Development (JavaScript, React, CSS & HTML)
 * Contains 23 new unique problems (combined with 5 existing = 28 total)
 * Divided into Must-Solve and Coding Practice tracks.
 */

const FRONTEND_PROBLEMS = [
    // ==========================================
    // MUST-SOLVE TRACK (Foundational & Interview Core)
    // ==========================================
    {
        id: "fe-01",
        title: "Event Delegation for Dynamic List Items",
        skill: "Frontend Development",
        topic: "DOM and Events",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Handle clicks on dynamically appended child elements via a single parent listener.",
        prerequisites: ["addEventListener", "Event bubbling", "event.target and Element.closest()"],
        description: "Write a function `attachListDelegation(parentListElement, onRemoveItem)` that attaches a single click listener to an `<ul>` element. When any child delete button (`<button class='btn-delete'>`) is clicked, extract the parent `<li>` element's `data-id` attribute and trigger `onRemoveItem(id)`. Clicks on other parts of the item must not trigger the callback.",
        examples: [
            { input: "<li data-id='42'><span>Task</span><button class='btn-delete'>x</button></li> clicked on button", output: "onRemoveItem('42') invoked", explanation: "Event bubbles to <ul> and is captured by delegation." }
        ],
        hints: [
            "Hint 1: Use `event.target.closest('.btn-delete')` to determine if a delete button or one of its child elements was clicked.",
            "Hint 2: Walk up to the parent `<li>` with `.closest('li')` to read `item.dataset.id`."
        ],
        starterCode: `function attachListDelegation(parentListElement, onRemoveItem) {
    // Attach single listener to parent utilizing event bubbling
    parentListElement.addEventListener('click', function(event) {
        const deleteBtn = event.target.closest('.btn-delete');
        if (!deleteBtn || !parentListElement.contains(deleteBtn)) return;

        const listItem = deleteBtn.closest('li');
        if (listItem && listItem.dataset.id) {
            onRemoveItem(listItem.dataset.id);
        }
    });
}`,
        testCases: [
            { input: "Click on delete button inside list item", expectedOutput: "Callback fired with data-id", isHidden: false },
            { input: "Click on list item text outside delete button", expectedOutput: "Callback not fired", isHidden: false },
            { input: "Dynamically added list item after initialization", expectedOutput: "Handled seamlessly without adding new listeners", isHidden: true }
        ],
        rubricCriteria: "Zero per-item listeners created; uses closest() cleanly to support nested icons inside buttons.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation"
    },
    {
        id: "fe-02",
        title: "Promise.all Polyfill Implementation",
        skill: "Frontend Development",
        topic: "Async JavaScript and Promises",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Understand concurrency coordination, parallel resolution, and fast-fail promise semantics.",
        prerequisites: ["Promises", "Promise constructor", "Array order preservation"],
        description: "Implement a function `promiseAll(promises)` that mimics the behavior of `Promise.all()`. It takes an array of promises (or values) and returns a promise that resolves to an array of results in the original order once all input promises have resolved, or rejects immediately with the first rejection reason.",
        examples: [
            { input: "promiseAll([Promise.resolve(1), 2, new Promise(res => setTimeout(() => res(3), 50))])", output: "[1, 2, 3]", explanation: "Resolves all values in corresponding positions." },
            { input: "promiseAll([Promise.resolve(1), Promise.reject('Error')])", output: "Rejects with 'Error'", explanation: "Fast-fail on first rejection." }
        ],
        hints: [
            "Hint 1: If the input array is empty, resolve immediately with `[]`.",
            "Hint 2: Wrap each element with `Promise.resolve(item)` to handle non-promise values.",
            "Hint 3: Maintain a count of resolved items. When count === promises.length, resolve the outer promise."
        ],
        starterCode: `function promiseAll(promises) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(promises)) {
            return reject(new TypeError("Argument must be an array"));
        }
        if (promises.length === 0) {
            return resolve([]);
        }

        const results = new Array(promises.length);
        let completed = 0;

        promises.forEach((item, index) => {
            Promise.resolve(item).then(value => {
                results[index] = value;
                completed++;
                if (completed === promises.length) {
                    resolve(results);
                }
            }).catch(reject);
        });
    });
}`,
        testCases: [
            { input: "[Promise.resolve(10), Promise.resolve(20)]", expectedOutput: "[10, 20]", isHidden: false },
            { input: "Array containing non-promise values and promises", expectedOutput: "All resolved in original index order", isHidden: false },
            { input: "One promise rejects while another is slow", expectedOutput: "Fast-fails immediately with rejection", isHidden: true }
        ],
        rubricCriteria: "Preserves index order regardless of resolution completion timing; fast-fails on rejection.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all"
    },
    {
        id: "fe-03",
        title: "Throttle Function with Leading and Trailing Calls",
        skill: "Frontend Development",
        topic: "Performance and Timers",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Rate-limit high frequency UI events (scroll, resize) ensuring smooth rendering.",
        prerequisites: ["setTimeout", "Closures", "Date.now() / timestamps"],
        description: "Write a `throttle(fn, limit)` function that ensures `fn` is invoked at most once every `limit` milliseconds. Consecutive calls during the throttle window should trigger the trailing invocation at the end of the window.",
        examples: [
            { input: "Scroll event fired 50 times in 100ms with limit=100ms", output: "Function executed once immediately and once at 100ms window close", explanation: "Prevents UI freezing." }
        ],
        hints: [
            "Hint 1: Keep track of `lastRan` timestamp and `lastFunc` timer ID.",
            "Hint 2: If `Date.now() - lastRan >= limit`, invoke immediately; otherwise schedule with setTimeout."
        ],
        starterCode: `function throttle(fn, limit) {
    let inThrottle = false;
    let lastFn = null;
    let lastTime = 0;

    return function(...args) {
        const context = this;
        const now = Date.now();

        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = now;
            inThrottle = true;
        } else {
            clearTimeout(lastFn);
            lastFn = setTimeout(function() {
                if (Date.now() - lastTime >= limit) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(limit - (now - lastTime), 0));
        }
    };
}`,
        testCases: [
            { input: "Single call", expectedOutput: "Executes immediately on leading edge", isHidden: false },
            { input: "10 rapid bursts within limit window", expectedOutput: "Capped to 1 execution per interval", isHidden: false },
            { input: "Preserves 'this' context and passed arguments", expectedOutput: "Passes through cleanly", isHidden: true }
        ],
        rubricCriteria: "Accurate interval calculation without timer leaks.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event"
    },
    {
        id: "fe-04",
        title: "Flatten Nested JavaScript Object into Dot-Notation Keys",
        skill: "Frontend Development",
        topic: "Object Manipulation and Recursion",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Flatten multi-level configuration and state objects into flat 1-dimensional key-value maps.",
        prerequisites: ["Object.entries()", "Recursion", "typeof and Array.isArray checks"],
        description: "Write `flattenObject(obj)` that takes a nested object and returns a 1-level flat object whose keys are dot-separated paths.",
        examples: [
            { input: "{ user: { profile: { name: 'Alice' }, id: 1 } }", output: "{ 'user.profile.name': 'Alice', 'user.id': 1 }", explanation: "Hierarchical paths compressed into keys." }
        ],
        hints: [
            "Hint 1: Use a recursive helper `recurse(current, prefix)`.",
            "Hint 2: If current is an object and not null or array, iterate its entries and append keys."
        ],
        starterCode: `function flattenObject(obj) {
    const result = {};

    function recurse(current, prefix) {
        for (const [key, value] of Object.entries(current)) {
            const path = prefix ? \`\${prefix}.\${key}\` : key;
            if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
                recurse(value, path);
            } else {
                result[path] = value;
            }
        }
    }

    recurse(obj, '');
    return result;
}`,
        testCases: [
            { input: "{ a: { b: 10, c: { d: 20 } } }", expectedOutput: "{ 'a.b': 10, 'a.c.d': 20 }", isHidden: false },
            { input: "Flat object with no nesting", expectedOutput: "Identical flat object returned", isHidden: false },
            { input: "Values that are null or arrays", expectedOutput: "Retained as leaf values without recursing", isHidden: true }
        ],
        rubricCriteria: "Handles null and arrays correctly without classifying them as nested objects.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries"
    },
    {
        id: "fe-05",
        title: "Async Task Queue with Concurrency Limit",
        skill: "Frontend Development",
        topic: "Async Coordination",
        difficulty: "Hard",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Manage resource pool constraints by queuing async tasks to a maximum concurrent worker limit.",
        prerequisites: ["Promises", "Queue FIFO scheduling", "Recursive worker pump"],
        description: "Implement a class `TaskQueue(concurrency)` with a method `add(asyncFn)` returning a Promise that resolves or rejects with the result of `asyncFn()`. The queue must ensure at most `concurrency` async tasks are running simultaneously.",
        examples: [
            { input: "Queue with concurrency=2, add 5 tasks", output: "Tasks 1 and 2 start immediately; task 3 starts as soon as task 1 or 2 finishes", explanation: "Constant bounded worker pool." }
        ],
        hints: [
            "Hint 1: Store queued tasks as objects containing `{ taskFn, resolve, reject }`.",
            "Hint 2: In a `runNext()` helper, check if `running < concurrency && queue.length > 0`. If so, increment running and execute."
        ],
        starterCode: `class TaskQueue {
    constructor(concurrency) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }

    add(taskFn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ taskFn, resolve, reject });
            this._runNext();
        });
    }

    _runNext() {
        while (this.running < this.concurrency && this.queue.length > 0) {
            const { taskFn, resolve, reject } = this.queue.shift();
            this.running++;
            taskFn()
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this.running--;
                    this._runNext();
                });
        }
    }
}`,
        testCases: [
            { input: "Concurrency 2 running 4 tasks", expectedOutput: "Max simultaneous in-flight tasks <= 2", isHidden: false },
            { input: "Task throws exception", expectedOutput: "Promise rejects but queue continues processing remaining tasks", isHidden: false },
            { input: "High volume 50 tasks", expectedOutput: "All 50 resolved without dropping", isHidden: true }
        ],
        rubricCriteria: "Strict concurrency bound; resilient to task rejections without freezing subsequent queue items.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises"
    },
    {
        id: "fe-06",
        title: "React Custom Hook: useLocalStorage",
        skill: "Frontend Development",
        topic: "React Hooks and State",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Synchronize React component state seamlessly with browser localStorage.",
        prerequisites: ["useState", "useEffect or functional initializers", "JSON.stringify/parse"],
        description: "Create a React custom hook `useLocalStorage(key, initialValue)` that reads the initial value from `localStorage.getItem(key)` (parsing JSON), falling back to `initialValue` if missing or invalid. Provide a setter `setValue` that updates both React state and `localStorage`.",
        examples: [
            { input: "const [theme, setTheme] = useLocalStorage('theme', 'dark')", output: "Loads 'dark', setTheme('light') saves 'light' to localStorage", explanation: "State persistent across browser reloads." }
        ],
        hints: [
            "Hint 1: Use lazy state initialization: `useState(() => { ... })` to avoid reading localStorage on every render.",
            "Hint 2: Wrap JSON parsing in try-catch to avoid crashes on corrupt storage."
        ],
        starterCode: `// React custom hook simulation
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error("Error reading localStorage:", error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error("Error setting localStorage:", error);
        }
    };

    return [storedValue, setValue];
}`,
        testCases: [
            { input: "Key not present in localStorage", expectedOutput: "Returns initialValue", isHidden: false },
            { input: "Call setValue('new-val')", expectedOutput: "Updates state and writes JSON to localStorage", isHidden: false },
            { input: "Functional state update setValue(prev => prev + 1)", expectedOutput: "Computes based on previous value correctly", isHidden: true }
        ],
        rubricCriteria: "Lazy initialization, functional updater support, and robust JSON error handling.",
        sourceUrl: "https://react.dev/learn/reusing-logic-with-custom-hooks"
    },
    {
        id: "fe-07",
        title: "Accessible Modal Dialog with Keyboard Focus Trap",
        skill: "Frontend Development",
        topic: "Web Accessibility (A11y) and DOM",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Enforce WCAG accessibility dialog rules with focus trapping and Escape key closing.",
        prerequisites: ["keydown event", "element.focus()", "Tab key navigation cycling"],
        description: "Write `trapFocusInModal(modalElement, onClose)` that traps keyboard `Tab` and `Shift+Tab` navigation within the modal's focusable elements (`button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])`). Pressing `Escape` must invoke `onClose()`.",
        examples: [
            { input: "Pressing Tab on last button", output: "Focus wraps to first focusable element", explanation: "Prevents keyboard focus escaping modal." },
            { input: "Pressing Escape key", output: "onClose() invoked", explanation: "Standard dialog dismissal." }
        ],
        hints: [
            "Hint 1: Query all focusable children: `modal.querySelectorAll('...')`.",
            "Hint 2: On Tab key: if `shiftKey` and on first element, focus last; if not `shiftKey` and on last, focus first."
        ],
        starterCode: `function trapFocusInModal(modalElement, onClose) {
    const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function handleKeyDown(e) {
        if (e.key === 'Escape') {
            onClose();
            return;
        }
        if (e.key !== 'Tab') return;

        const focusables = Array.from(modalElement.querySelectorAll(focusableSelectors));
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    modalElement.addEventListener('keydown', handleKeyDown);
    return () => modalElement.removeEventListener('keydown', handleKeyDown);
}`,
        testCases: [
            { input: "Tab on last button", expectedOutput: "Focus directed to first element; default prevented", isHidden: false },
            { input: "Shift+Tab on first element", expectedOutput: "Focus directed to last element", isHidden: false },
            { input: "Escape key pressed", expectedOutput: "onClose callback triggered", isHidden: true }
        ],
        rubricCriteria: "Strict WCAG modal guidelines with proper cleanup function returned.",
        sourceUrl: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
    },
    {
        id: "fe-08",
        title: "Custom EventEmitter (Pub/Sub Event Bus)",
        skill: "Frontend Development",
        topic: "Design Patterns and Events",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Decouple frontend components through an asynchronous Publisher/Subscriber event emitter.",
        prerequisites: ["Object/Map handler storage", "Callback arrays", "Set or Array filtering"],
        description: "Implement an `EventEmitter` class with `on(event, listener)`, `emit(event, ...args)`, `off(event, listener)`, and `once(event, listener)`. `once` should trigger the listener only the first time the event is emitted, then unregister automatically.",
        examples: [
            { input: "ee.on('login', user => console.log(user)); ee.emit('login', 'Alice')", output: "Logs 'Alice'", explanation: "Listener triggered with event data." }
        ],
        hints: [
            "Hint 1: Store events in `this.events = new Map()` where each value is an array of functions.",
            "Hint 2: For `once(event, fn)`, wrap `fn` in a wrapper that calls `this.off(event, wrapper)` before executing `fn`."
        ],
        starterCode: `class EventEmitter {
    constructor() {
        this.events = new Map();
    }

    on(event, listener) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(listener);
        return () => this.off(event, listener);
    }

    off(event, listener) {
        if (!this.events.has(event)) return;
        const listeners = this.events.get(event).filter(l => l !== listener);
        this.events.set(event, listeners);
    }

    emit(event, ...args) {
        if (!this.events.has(event)) return;
        this.events.get(event).forEach(listener => listener(...args));
    }

    once(event, listener) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            listener(...args);
        };
        this.on(event, wrapper);
    }
}`,
        testCases: [
            { input: "Register listener and emit", expectedOutput: "Listener receives payload args", isHidden: false },
            { input: "Trigger 'once' listener multiple times", expectedOutput: "Fires exactly once, ignored subsequently", isHidden: false },
            { input: "Unregister with off()", expectedOutput: "Listener removed cleanly", isHidden: true }
        ],
        rubricCriteria: "Unsubscribe function returned by on(); once() correctly detaches wrapper on execution.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/EventTarget"
    },
    {
        id: "fe-09",
        title: "Deep Object Equality Comparison (isDeepEqual)",
        skill: "Frontend Development",
        topic: "Object Utilities and Comparison",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Compare nested object trees by value rather than reference identity.",
        prerequisites: ["Recursion", "Object.keys()", "Primitives vs Reference types"],
        description: "Write `isDeepEqual(a, b)` that returns `true` if two values (primitives, arrays, or objects) are deeply equal in structure and values, and `false` otherwise. Handle special cases like `NaN === NaN` evaluating to true.",
        examples: [
            { input: "isDeepEqual({ a: [1, 2], b: { c: 3 } }, { a: [1, 2], b: { c: 3 } })", output: "true", explanation: "Identical nested content." },
            { input: "isDeepEqual({ a: 1 }, { a: 2 })", output: "false", explanation: "Different values." }
        ],
        hints: [
            "Hint 1: Check `Object.is(a, b)` first for reference equality and NaN.",
            "Hint 2: Check `typeof a === 'object' && a !== null && typeof b === 'object' && b !== null`.",
            "Hint 3: Ensure key lengths match before recursively comparing every key."
        ],
        starterCode: `function isDeepEqual(a, b) {
    if (Object.is(a, b)) return true;

    if (a === null || typeof a !== 'object' || b === null || typeof b !== 'object') {
        return false;
    }

    if (Array.isArray(a) !== Array.isArray(b)) return false;

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);

    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!Object.prototype.hasOwnProperty.call(b, key)) return false;
        if (!isDeepEqual(a[key], b[key])) return false;
    }

    return true;
}`,
        testCases: [
            { input: "Matching nested objects and arrays", expectedOutput: "true", isHidden: false },
            { input: "Different key counts or missing keys", expectedOutput: "false", isHidden: false },
            { input: "isDeepEqual(NaN, NaN)", expectedOutput: "true", isHidden: true }
        ],
        rubricCriteria: "Handles arrays vs objects distinction and NaN equality conforming to Object.is semantics.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness"
    },
    {
        id: "fe-10",
        title: "Fetch with Exponential Backoff Retry",
        skill: "Frontend Development",
        topic: "Network and HTTP Requests",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Make network requests resilient to transient failures using exponential backoff.",
        prerequisites: ["fetch() API", "setTimeout wrapped in Promise", "Exponential backoff math"],
        description: "Write `fetchWithRetry(url, options = {}, retries = 3, backoffMs = 300)` that attempts `fetch(url, options)`. If the request throws a network error or returns a 5xx server status, retry up to `retries` times, doubling the delay each time (`backoffMs * 2^attempt`). If all attempts fail, reject with the final error.",
        examples: [
            { input: "Endpoint fails twice with 503, succeeds on 3rd try", output: "Resolves with response on 3rd attempt", explanation: "Retries overcome transient glitches." }
        ],
        hints: [
            "Hint 1: Use an async loop: `for (let attempt = 0; attempt <= retries; attempt++)`.",
            "Hint 2: Sleep with `await new Promise(r => setTimeout(r, delay))` before the next attempt."
        ],
        starterCode: `async function fetchWithRetry(url, options = {}, retries = 3, backoffMs = 300) {
    let delay = backoffMs;
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok && response.status >= 500 && attempt < retries) {
                // Retry on server error
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
                continue;
            }
            return response;
        } catch (err) {
            if (attempt === retries) throw err;
            await new Promise(res => setTimeout(res, delay));
            delay *= 2;
        }
    }
}`,
        testCases: [
            { input: "Immediate 200 OK response", expectedOutput: "Resolves without retries", isHidden: false },
            { input: "Server returns 500 then 200", expectedOutput: "Retries and resolves", isHidden: false },
            { input: "Client error 404", expectedOutput: "Does not retry client 4xx errors", isHidden: true }
        ],
        rubricCriteria: "Distinguishes 5xx/network errors from 4xx client errors; accurate backoff progression.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch"
    },
    {
        id: "fe-11",
        title: "IntersectionObserver Active Navigation Spy",
        skill: "Frontend Development",
        topic: "Web APIs and IntersectionObserver",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Highlight active navigation links dynamically as corresponding page sections scroll into view.",
        prerequisites: ["IntersectionObserver API", "DOM classList.toggle", "data attributes"],
        description: "Write `initScrollSpy(sections, navLinks)` that uses an `IntersectionObserver` to detect which `<section id='...'>` is currently in the viewport (threshold 0.5), adding an `.active` class to the matching `<a href='#...'>` and removing it from others.",
        examples: [
            { input: "Section #features scrolled into view", output: "Nav link [href='#features'] receives class 'active'", explanation: "Visual feedback of user position." }
        ],
        hints: [
            "Hint 1: Create `new IntersectionObserver(entries => { ... }, { threshold: 0.5 })`.",
            "Hint 2: Find entry where `entry.isIntersecting` is true, get `entry.target.id`, and activate corresponding link."
        ],
        starterCode: `function initScrollSpy(sections, navLinks) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === \`#\${id}\`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 });

    sections.forEach(section => observer.observe(section));
    return observer;
}`,
        testCases: [
            { input: "Section crosses 50% viewport threshold", expectedOutput: "Active class toggled to corresponding link", isHidden: false },
            { input: "Scroll back to top section", expectedOutput: "Top section link becomes active", isHidden: false },
            { input: "Observer disconnect cleanup", expectedOutput: "Disconnects observers cleanly", isHidden: true }
        ],
        rubricCriteria: "Performant intersection checking avoiding expensive window.onscroll event listeners.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
    },
    {
        id: "fe-12",
        title: "Virtual List Row Window Calculator",
        skill: "Frontend Development",
        topic: "DOM Virtualization and Performance",
        difficulty: "Hard",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Calculate visible index boundaries for massive lists (100,000+ items) to render only in-view rows.",
        prerequisites: ["Math.floor / Math.ceil", "Scroll offsets", "Overscan buffers"],
        description: "Write `getVirtualListWindow({ scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2 })` that returns `{ startIndex, endIndex, offsetY }`. `offsetY` is the top padding in pixels for positioning the rendered chunk.",
        examples: [
            { input: "scrollTop=200, viewportHeight=400, itemHeight=50, totalItems=1000", output: "startIndex = 2, endIndex = 13 (with overscan 2), offsetY = 100", explanation: "Only renders 12 items instead of 1000." }
        ],
        hints: [
            "Hint 1: First visible item is `Math.floor(scrollTop / itemHeight)`.",
            "Hint 2: Visible count is `Math.ceil(viewportHeight / itemHeight)`.",
            "Hint 3: Apply `Math.max(0, first - overscan)` and `Math.min(totalItems - 1, last + overscan)`."
        ],
        starterCode: `function getVirtualListWindow({ scrollTop, viewportHeight, itemHeight, totalItems, overscan = 2 }) {
    if (totalItems <= 0) {
        return { startIndex: 0, endIndex: 0, offsetY: 0 };
    }

    const firstVisible = Math.floor(scrollTop / itemHeight);
    const visibleCount = Math.ceil(viewportHeight / itemHeight);
    const lastVisible = firstVisible + visibleCount - 1;

    const startIndex = Math.max(0, firstVisible - overscan);
    const endIndex = Math.min(totalItems - 1, lastVisible + overscan);
    const offsetY = startIndex * itemHeight;

    return { startIndex, endIndex, offsetY };
}`,
        testCases: [
            { input: "scrollTop at 0 (top of list)", expectedOutput: "startIndex: 0, offsetY: 0", isHidden: false },
            { input: "Scrolled mid-way with overscan", expectedOutput: "startIndex and endIndex bounded accurately", isHidden: false },
            { input: "Scrolled past total height", expectedOutput: "endIndex does not exceed totalItems - 1", isHidden: true }
        ],
        rubricCriteria: "Boundary clamping avoids out-of-range index slice errors.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/Performance/Virtual_DOM"
    },

    // ==========================================
    // CODING PRACTICE TRACK (Progressive Practice)
    // ==========================================
    {
        id: "fe-13",
        title: "Group Array of Objects by Key Utility",
        skill: "Frontend Development",
        topic: "JavaScript Collections",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Group arrays of items into categorized dictionaries using Array.prototype.reduce.",
        prerequisites: ["Array.prototype.reduce", "Object indexation"],
        description: "Implement `groupBy(array, keyOrFn)` that groups elements of an array by a given property string or callback function, returning an object whose keys are group names and values are arrays of matched items.",
        examples: [
            { input: "groupBy(['one', 'two', 'three'], 'length')", output: "{ 3: ['one', 'two'], 5: ['three'] }", explanation: "Grouped by string length." }
        ],
        hints: [
            "Hint 1: Use `array.reduce((acc, item) => { ... }, {})`.",
            "Hint 2: Resolve group key with `typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn]`."
        ],
        starterCode: `function groupBy(array, keyOrFn) {
    return array.reduce((acc, item) => {
        const key = typeof keyOrFn === 'function' ? keyOrFn(item) : item[keyOrFn];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {});
}`,
        testCases: [
            { input: "Group by string property 'role'", expectedOutput: "Grouped dictionary", isHidden: false },
            { input: "Group by predicate function x => x % 2", expectedOutput: "{ 0: [...], 1: [...] }", isHidden: false },
            { input: "Empty array", expectedOutput: "{}", isHidden: true }
        ],
        rubricCriteria: "Supports both string property keys and extractor functions cleanly.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce"
    },
    {
        id: "fe-14",
        title: "RGB to Hex String Color Converter with Clamping",
        skill: "Frontend Development",
        topic: "String and Math Utilities",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Convert CSS RGB channel triplets into standardized hex color strings.",
        prerequisites: ["Number.toString(16)", "String.padStart(2, '0')", "Math clamping"],
        description: "Write `rgbToHex(r, g, b)` that converts 3 integer color components (0-255) into a lowercase 6-character hex string prefixed with `#` (e.g. `'#00ff00'`). Clamp any input value below 0 to 0 and above 255 to 255.",
        examples: [
            { input: "rgbToHex(255, 0, 128)", output: "'#ff0080'", explanation: "Standard hex conversion." },
            { input: "rgbToHex(-10, 300, 20)", output: "'#00ff14'", explanation: "-10 clamped to 0, 300 clamped to 255." }
        ],
        hints: [
            "Hint 1: Clamp with `Math.min(255, Math.max(0, Math.round(val)))`.",
            "Hint 2: Convert to hex with `clamped.toString(16).padStart(2, '0')`."
        ],
        starterCode: `function rgbToHex(r, g, b) {
    const clamp = (val) => Math.min(255, Math.max(0, Math.round(val || 0)));
    const toHex = (c) => clamp(c).toString(16).padStart(2, '0');
    return \`#\${toHex(r)}\${toHex(g)}\${toHex(b)}\`;
}`,
        testCases: [
            { input: "255, 255, 255", expectedOutput: "'#ffffff'", isHidden: false },
            { input: "0, 0, 0", expectedOutput: "'#000000'", isHidden: false },
            { input: "Out of bounds values -50, 400, 15", expectedOutput: "'#00ff0f'", isHidden: true }
        ],
        rubricCriteria: "Safe clamping and zero-padding ensure constant 7-character `#rrggbb` format.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/color_value"
    },
    {
        id: "fe-15",
        title: "DOM ClassList Toggle and State Query Utility",
        skill: "Frontend Development",
        topic: "DOM Manipulation",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Encapsulate clean DOM class toggling and boolean state synchronization.",
        prerequisites: ["Element.classList.toggle", "Element.classList.contains", "document.querySelector"],
        description: "Write `toggleElementState(elementOrSelector, className, forceBoolean)` that toggles `className` on an element. If `forceBoolean` is provided, add class if true, remove if false. Return boolean indicating if the class is now present.",
        examples: [
            { input: "toggleElementState('#drawer', 'open', true)", output: "Adds 'open' class, returns true", explanation: "Forced add." }
        ],
        hints: [
            "Hint 1: Resolve element: `typeof selector === 'string' ? document.querySelector(selector) : selector`.",
            "Hint 2: `element.classList.toggle(className, forceBoolean)`."
        ],
        starterCode: `function toggleElementState(elementOrSelector, className, forceBoolean) {
    const el = typeof elementOrSelector === 'string'
        ? document.querySelector(elementOrSelector)
        : elementOrSelector;

    if (!el) return false;

    if (typeof forceBoolean === 'boolean') {
        el.classList.toggle(className, forceBoolean);
    } else {
        el.classList.toggle(className);
    }
    return el.classList.contains(className);
}`,
        testCases: [
            { input: "Toggle on element without class", expectedOutput: "Adds class and returns true", isHidden: false },
            { input: "Force remove with forceBoolean=false", expectedOutput: "Removes class and returns false", isHidden: false },
            { input: "Element selector not found in document", expectedOutput: "Returns false without throwing", isHidden: true }
        ],
        rubricCriteria: "Null-safe resolution and proper adherence to classList.toggle spec.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Element/classList"
    },
    {
        id: "fe-16",
        title: "Curry Function with Arbitrary Argument Arity",
        skill: "Frontend Development",
        topic: "Functional JavaScript",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Transform n-ary functions into reusable chainable unary function pipelines.",
        prerequisites: ["fn.length property", "Function currying", "Recursive closures"],
        description: "Write a function `curry(fn)` that transforms a function `fn` of arity `N` into a curried version that can be called with partial arguments until all `N` arguments are provided.",
        examples: [
            { input: "const add = (a, b, c) => a + b + c; const curriedAdd = curry(add); curriedAdd(1)(2)(3)", output: "6", explanation: "Arguments accumulated until arity 3 is reached." },
            { input: "curriedAdd(1, 2)(3)", output: "6", explanation: "Supports multiple arguments per step." }
        ],
        hints: [
            "Hint 1: Check `args.length >= fn.length`. If true, call `fn.apply(this, args)`.",
            "Hint 2: Otherwise return a new function that accumulates additional arguments."
        ],
        starterCode: `function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return function(...moreArgs) {
            return curried.apply(this, args.concat(moreArgs));
        };
    };
}`,
        testCases: [
            { input: "Curried add3 called with (1)(2)(3)", expectedOutput: "6", isHidden: false },
            { input: "Curried add3 called with (1, 2, 3)", expectedOutput: "6", isHidden: false },
            { input: "Preserves 'this' context when called as method", expectedOutput: "Bound correctly", isHidden: true }
        ],
        rubricCriteria: "Correct arity checking using fn.length and recursion.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Glossary/Currying"
    },
    {
        id: "fe-17",
        title: "React Controlled Form with Live Validation & Touched State",
        skill: "Frontend Development",
        topic: "React Forms and State",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Manage form validation showing error messages only after fields have been touched by the user.",
        prerequisites: ["Controlled inputs", "onBlur and onChange", "Form validation rules"],
        description: "Build a form validation hook or logic `useFormValidation({ initialValues, validate })` that tracks `values`, `errors`, `touched`, `handleChange`, `handleBlur`, and `isValid`. Errors are only exposed for touched fields.",
        examples: [
            { input: "Empty email field focused then blurred", output: "touched.email = true, errors.email = 'Email required'", explanation: "Error shown on blur." }
        ],
        hints: [
            "Hint 1: In handleBlur(fieldName), mark `touched[fieldName] = true`.",
            "Hint 2: In handleChange(fieldName, value), update value and recompute errors."
        ],
        starterCode: `function useFormValidation(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        const nextValues = { ...values, [field]: value };
        setValues(nextValues);
        setErrors(validate(nextValues));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
        setErrors(validate(values));
    };

    const isValid = Object.keys(validate(values)).length === 0;

    return { values, touched, errors, handleChange, handleBlur, isValid };
}`,
        testCases: [
            { input: "Typing valid email", expectedOutput: "errors.email is empty, isValid is true", isHidden: false },
            { input: "Unfocused field with invalid value", expectedOutput: "touched is false, UI does not show error prematurely", isHidden: false },
            { input: "Form submission validation check", expectedOutput: "Validates all fields", isHidden: true }
        ],
        rubricCriteria: "Separates touched interaction state from pure schema validation.",
        sourceUrl: "https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable"
    },
    {
        id: "fe-18",
        title: "Infinite Scroll Sentinel with IntersectionObserver",
        skill: "Frontend Development",
        topic: "Async DOM and Infinite Loading",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Trigger paginated content loading when a footer sentinel element scrolls into view.",
        prerequisites: ["IntersectionObserver", "Loading flags to prevent duplicate fetches"],
        description: "Write `attachInfiniteScroll(sentinelElement, fetchNextPage)` that calls `fetchNextPage()` whenever `sentinelElement` enters the viewport. Guard with an internal `isLoading` flag to prevent duplicate simultaneous calls while a fetch is in progress.",
        examples: [
            { input: "User scrolls to bottom where sentinel is placed", output: "fetchNextPage() invoked once", explanation: "Triggers next page data load." }
        ],
        hints: [
            "Hint 1: Use an internal `let isLoading = false` variable.",
            "Hint 2: When `entry.isIntersecting && !isLoading`, set `isLoading = true`, call `await fetchNextPage()`, then reset."
        ],
        starterCode: `function attachInfiniteScroll(sentinelElement, fetchNextPage) {
    let isLoading = false;

    const observer = new IntersectionObserver(async (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading) {
            isLoading = true;
            try {
                await fetchNextPage();
            } finally {
                isLoading = false;
            }
        }
    }, { rootMargin: '200px' }); // Pre-fetch 200px before reaching bottom

    observer.observe(sentinelElement);
    return () => observer.disconnect();
}`,
        testCases: [
            { input: "Sentinel intersects viewport", expectedOutput: "fetchNextPage called", isHidden: false },
            { input: "Multiple rapid scroll ticks while loading", expectedOutput: "Additional fetches locked until first completes", isHidden: false },
            { input: "Disconnect called on component unmount", expectedOutput: "Observer stopped cleanly", isHidden: true }
        ],
        rubricCriteria: "Root margin optimization and robust loading lock preventing redundant fetches.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API"
    },
    {
        id: "fe-19",
        title: "Drag-and-Drop List Reordering Handlers",
        skill: "Frontend Development",
        topic: "HTML5 Drag and Drop API",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Implement drag-and-drop item reordering using standard HTML5 drag events.",
        prerequisites: ["dragstart", "dragover with e.preventDefault()", "drop and array splicing"],
        description: "Write `reorderList(list, fromIndex, toIndex)` that returns a new array with the element at `fromIndex` moved to `toIndex` without mutating the original array.",
        examples: [
            { input: "reorderList(['A', 'B', 'C', 'D'], 0, 2)", output: "['B', 'C', 'A', 'D']", explanation: "'A' moved from index 0 to index 2." }
        ],
        hints: [
            "Hint 1: Clone the list: `const result = [...list]`.",
            "Hint 2: Remove element with `const [removed] = result.splice(fromIndex, 1)` and insert with `result.splice(toIndex, 0, removed)`."
        ],
        starterCode: `function reorderList(list, fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
        return list;
    }
    const result = Array.from(list);
    const [removed] = result.splice(fromIndex, 1);
    result.splice(toIndex, 0, removed);
    return result;
}`,
        testCases: [
            { input: "Move element from start to end", expectedOutput: "Item moved, other elements shifted", isHidden: false },
            { input: "fromIndex equals toIndex", expectedOutput: "Unchanged copy returned", isHidden: false },
            { input: "Out of bounds indices", expectedOutput: "Original list safely returned", isHidden: true }
        ],
        rubricCriteria: "Immutability preserved; out-of-bounds guards prevent corruption.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API"
    },
    {
        id: "fe-20",
        title: "Responsive CSS Grid Auto-Fit Catalog Card Layout",
        skill: "Frontend Development",
        topic: "CSS Architecture and Layouts",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Construct modern zero-media-query responsive card grids via CSS repeat(auto-fit, minmax()).",
        prerequisites: ["CSS Grid", "repeat(auto-fit, minmax(...))", "gap and aspect-ratio"],
        description: "Provide the modern CSS class `.responsive-card-grid` that renders child cards in fluid columns of at least `280px` each, expanding evenly across wider viewports without requiring hardcoded media queries.",
        examples: [
            { input: "Desktop 1200px viewport", output: "4 equal columns (~280px+ each)", explanation: "Grid auto-fits columns." },
            { input: "Mobile 360px viewport", output: "1 full-width column", explanation: "Minmax wraps automatically." }
        ],
        hints: [
            "Hint 1: `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));`.",
            "Hint 2: Add `gap: 1.5rem;`."
        ],
        starterCode: `/* Modern zero-media-query responsive grid */
.responsive-card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
    width: 100%;
}

.responsive-card-grid > .card-item {
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
}`,
        testCases: [
            { input: "Wide desktop container (> 1200px)", expectedOutput: "Multi-column layout with 1fr expansion", isHidden: false },
            { input: "Narrow mobile container (< 400px)", expectedOutput: "Single column without overflow", isHidden: false },
            { input: "Spacing consistency", expectedOutput: "Even gaps between cards", isHidden: true }
        ],
        rubricCriteria: "Fluid responsiveness with repeat(auto-fit, minmax()) without hardcoded breakpoints.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout"
    },
    {
        id: "fe-21",
        title: "Custom Memoization Dependency Array Simulator (useMemo)",
        skill: "Frontend Development",
        topic: "React Internals and Performance",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Simulate React's useMemo dependency array comparison and cache invalidation algorithm.",
        prerequisites: ["Dependency array equality", "Object.is comparison", "Closure state preservation"],
        description: "Implement `createMemoizer()` that returns a function `memoize(factoryFn, deps)`. If `deps` have not changed according to `Object.is` since the previous invocation, return the cached result; otherwise re-evaluate `factoryFn()` and update cache.",
        examples: [
            { input: "memoize(() => expensive(x), [x]) called twice with same x", output: "Evaluated once, second call returns cached value", explanation: "Dependency comparison preserves cache." }
        ],
        hints: [
            "Hint 1: Store `prevDeps` and `prevResult` in closure.",
            "Hint 2: Compare lengths first, then `!Object.is(prevDeps[i], deps[i])`."
        ],
        starterCode: `function createMemoizer() {
    let prevDeps = null;
    let prevResult = undefined;

    return function memoize(factoryFn, deps) {
        const hasChanged = !prevDeps ||
            deps.length !== prevDeps.length ||
            deps.some((dep, index) => !Object.is(dep, prevDeps[index]));

        if (hasChanged) {
            prevResult = factoryFn();
            prevDeps = deps;
        }
        return prevResult;
    };
}`,
        testCases: [
            { input: "Same primitive dependencies [1, 'a']", expectedOutput: "Factory function not re-run", isHidden: false },
            { input: "Dependency changes from 1 to 2", expectedOutput: "Factory re-executed with updated value", isHidden: false },
            { input: "NaN dependency comparison", expectedOutput: "Object.is(NaN, NaN) treats as unchanged", isHidden: true }
        ],
        rubricCriteria: "Exact shallow dependency comparison conforming to React useMemo behavior.",
        sourceUrl: "https://react.dev/reference/react/useMemo"
    },
    {
        id: "fe-22",
        title: "Observable Stream Subject with Map and Filter Operators",
        skill: "Frontend Development",
        topic: "Reactive Programming",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Build a lightweight reactive Observable pipeline supporting functional stream transformations.",
        prerequisites: ["Observer pattern (next, error, complete)", "Higher-order functions"],
        description: "Implement an `Observable` class with `subscribe(observer)` and pipeable operators `map(fn)` and `filter(predicate)`. Subscribing to a mapped/filtered observable transforms or filters emitted items.",
        examples: [
            { input: "Observable.from([1, 2, 3, 4]).filter(x => x % 2 === 0).map(x => x * 10)", output: "Emits 20, 40", explanation: "Composed reactive transformation." }
        ],
        hints: [
            "Hint 1: Constructor takes a `subscribeFn(observer)`.",
            "Hint 2: Map operator returns a new Observable that intercepts `next: val => observer.next(fn(val))`."
        ],
        starterCode: `class Observable {
    constructor(subscribeFn) {
        this._subscribe = subscribeFn;
    }

    subscribe(observer) {
        const obs = typeof observer === 'function' ? { next: observer } : observer;
        return this._subscribe(obs);
    }

    map(fn) {
        return new Observable(observer => {
            return this.subscribe({
                next: val => observer.next(fn(val)),
                error: err => observer.error && observer.error(err),
                complete: () => observer.complete && observer.complete()
            });
        });
    }

    filter(predicate) {
        return new Observable(observer => {
            return this.subscribe({
                next: val => { if (predicate(val)) observer.next(val); },
                error: err => observer.error && observer.error(err),
                complete: () => observer.complete && observer.complete()
            });
        });
    }
}`,
        testCases: [
            { input: "Pipeline with filter and map", expectedOutput: "Outputs transformed filtered stream", isHidden: false },
            { input: "Error propagation down stream", expectedOutput: "Observer error callback invoked", isHidden: false },
            { input: "Multiple independent subscribers", expectedOutput: "Each subscriber receives independent stream execution", isHidden: true }
        ],
        rubricCriteria: "Clean composition of observable transforms without intermediate memory bloat.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators"
    },
    {
        id: "fe-23",
        title: "Markdown Shortcut Textarea Transformer",
        skill: "Frontend Development",
        topic: "Text Editing and Selection Range",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Wrap selected text in formatting symbols (e.g. bold **, italic _) preserving cursor focus.",
        prerequisites: ["HTMLInputElement.selectionStart", "HTMLInputElement.selectionEnd", "setSelectionRange"],
        description: "Write `wrapSelection(textareaElement, prefix, suffix = prefix)` that wraps the currently selected text in a textarea with `prefix` and `suffix`. If no text is selected, insert them and position cursor in between. Restore focus and cursor positions.",
        examples: [
            { input: "Text 'hello world', 'world' selected, wrapSelection(el, '**')", output: "Text becomes 'hello **world**', 'world' remains selected", explanation: "Standard markdown bold shortcut." }
        ],
        hints: [
            "Hint 1: Read `const start = textarea.selectionStart; const end = textarea.selectionEnd;`.",
            "Hint 2: Construct replacement text: `val.slice(0, start) + prefix + selected + suffix + val.slice(end)`.",
            "Hint 3: Update `textarea.selectionStart` and `textarea.selectionEnd` to highlight the wrapped text."
        ],
        starterCode: `function wrapSelection(textarea, prefix, suffix = prefix) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    const selected = text.slice(start, end);
    const replacement = prefix + selected + suffix;

    textarea.value = text.slice(0, start) + replacement + text.slice(end);

    // If text was selected, maintain selection on original text
    if (start !== end) {
        textarea.selectionStart = start + prefix.length;
        textarea.selectionEnd = end + prefix.length;
    } else {
        // Position cursor between prefix and suffix
        textarea.selectionStart = textarea.selectionEnd = start + prefix.length;
    }

    textarea.focus();
}`,
        testCases: [
            { input: "Selected text wrapped with **", expectedOutput: "**word** with focus retained", isHidden: false },
            { input: "Zero-length selection (cursor position)", expectedOutput: "Inserts **** and places cursor between", isHidden: false },
            { input: "Selection at extreme start or end of text", expectedOutput: "Safe slice bounds preserved", isHidden: true }
        ],
        rubricCriteria: "Preserves native undo/selection state and focuses element seamlessly.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange"
    }
];

if (typeof window !== "undefined") {
    window.FRONTEND_PROBLEMS = FRONTEND_PROBLEMS;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { FRONTEND_PROBLEMS };
}
