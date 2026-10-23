/**
 * WorkforceIQ Problem Catalog - Batch 4: Python Programming & Software Engineering
 * Contains 23 new unique problems (combined with 2 existing = 25 total)
 * Divided into Must-Solve and Coding Practice tracks.
 */

const PYTHON_PROBLEMS = [
    // ==========================================
    // MUST-SOLVE TRACK (Foundational & Interview Core)
    // ==========================================
    {
        id: "py-03",
        title: "Flatten Arbitrarily Nested Iterables Recursively",
        skill: "Python",
        topic: "Recursion and Collections",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Handle arbitrary recursive depths and varied collection types safely.",
        prerequisites: ["Recursive functions", "isinstance() checks", "Iterable unpacking"],
        description: "Write a function `flatten(nested_list)` that takes a nested list containing integers and other nested lists of arbitrary depth, and returns a single flat list with all elements in order. Strings, if present, should be treated as scalar values rather than iterables.",
        examples: [
            { input: "[1, [2, [3, 4], 5], 6, [7]]", output: "[1, 2, 3, 4, 5, 6, 7]", explanation: "All nested lists flattened in order." },
            { input: "[]", output: "[]", explanation: "Empty list returns empty list." }
        ],
        hints: [
            "Hint 1: Use recursion: if an element is an iterable (like list or tuple) and not a string, recurse on it.",
            "Hint 2: Accumulate elements using list.extend() or yield from in a generator."
        ],
        starterCode: `def flatten(nested_list):
    """Flatten an arbitrarily nested list into a 1D list."""
    result = []
    # Write your solution here
    for item in nested_list:
        if isinstance(item, (list, tuple)):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result`,
        testCases: [
            { input: "[1, [2, [3, 4], 5], 6]", expectedOutput: "[1, 2, 3, 4, 5, 6]", isHidden: false },
            { input: "[[[1]], 2, [3, [4, [5]]]]", expectedOutput: "[1, 2, 3, 4, 5]", isHidden: false },
            { input: "['hello', ['world']]", expectedOutput: "['hello', 'world']", isHidden: true }
        ],
        rubricCriteria: "Handles arbitrary nesting depth without stack overflow on reasonable depths.",
        sourceUrl: "https://docs.python.org/3/tutorial/controlflow.html"
    },
    {
        id: "py-04",
        title: "Custom Function Memoization Decorator",
        skill: "Python",
        topic: "Decorators and Closures",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Master first-class functions, closures, and argument hashing in Python decorators.",
        prerequisites: ["Decorators (@syntax)", "*args and **kwargs", "Dictionary hash lookups"],
        description: "Write a decorator `@memoize` that caches the results of function calls based on their positional and keyword arguments. Subsequent calls with the same arguments should return the cached result without re-executing the wrapped function.",
        examples: [
            { input: "fib(10) called twice", output: "Computed once, second call returns instantly from cache", explanation: "Cache hit avoids duplicate computations." }
        ],
        hints: [
            "Hint 1: Inside the decorator wrapper, serialize args and frozenset(kwargs.items()) into a hashable cache key.",
            "Hint 2: Use functools.wraps(func) to preserve the original function's name and docstring."
        ],
        starterCode: `from functools import wraps

def memoize(func):
    """Decorator to cache function results based on arguments."""
    cache = {}
    @wraps(func)
    def wrapper(*args, **kwargs):
        # Create hashable key from args and sorted kwargs
        key = (args, frozenset(sorted(kwargs.items())))
        if key not in cache:
            cache[key] = func(*args, **kwargs)
        return cache[key]
    return wrapper`,
        testCases: [
            { input: "Call square(5) multiple times", expectedOutput: "25", isHidden: false },
            { input: "Call with kwargs: add(a=2, b=3) and add(b=3, a=2)", expectedOutput: "Same cache key hits", isHidden: false },
            { input: "Function metadata preserves __name__", expectedOutput: "True", isHidden: true }
        ],
        rubricCriteria: "Correct closure encapsulation, preserves function signature, handles keyword args order.",
        sourceUrl: "https://docs.python.org/3/glossary.html#term-decorator"
    },
    {
        id: "py-05",
        title: "Chunked File Streaming Generator",
        skill: "Python",
        topic: "Generators and Iterators",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Process massive datasets in constant memory using generator yield expressions.",
        prerequisites: ["yield keyword", "Generator functions", "Chunk slicing"],
        description: "Write a generator function `chunk_iterable(iterable, chunk_size)` that yields consecutive lists of length `chunk_size` from any iterable. The final chunk may be shorter if the total number of items is not evenly divisible by `chunk_size`.",
        examples: [
            { input: "range(7), chunk_size=3", output: "[[0, 1, 2], [3, 4, 5], [6]]", explanation: "Yields 2 full chunks and 1 remainder chunk." }
        ],
        hints: [
            "Hint 1: Accumulate items into a buffer list. When len(buffer) == chunk_size, yield buffer and reset.",
            "Hint 2: After the loop, don't forget to yield any remaining elements in buffer."
        ],
        starterCode: `def chunk_iterable(iterable, chunk_size):
    """Yield successive chunks of size chunk_size from iterable."""
    if chunk_size <= 0:
        raise ValueError("chunk_size must be positive")
    chunk = []
    for item in iterable:
        chunk.append(item)
        if len(chunk) == chunk_size:
            yield chunk
            chunk = []
    if chunk:
        yield chunk`,
        testCases: [
            { input: "[1, 2, 3, 4, 5], chunk_size=2", expectedOutput: "[[1, 2], [3, 4], [5]]", isHidden: false },
            { input: "[], chunk_size=3", expectedOutput: "[]", isHidden: false },
            { input: "Generator input (stream of 100 items)", expectedOutput: "Chunked without loading full stream into memory", isHidden: true }
        ],
        rubricCriteria: "Memory-efficient O(1) extra space outside current chunk; handles empty inputs.",
        sourceUrl: "https://docs.python.org/3/tutorial/classes.html#generators"
    },
    {
        id: "py-06",
        title: "Context Manager for Safe Resource Locking",
        skill: "Python",
        topic: "Context Managers and OOP",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Implement deterministic resource acquisition and release via __enter__ and __exit__ protocols.",
        prerequisites: ["with statement", "__enter__ and __exit__ dunder methods", "Exception suppression"],
        description: "Create a class `TimerContext` that measures execution time using `time.perf_counter()`. When used in a `with TimerContext() as t:` block, it records start time on enter, stop time on exit, and provides `t.elapsed` in seconds.",
        examples: [
            { input: "with TimerContext() as t: time.sleep(0.01)", output: "t.elapsed >= 0.01", explanation: "Elapsed time measured accurately." }
        ],
        hints: [
            "Hint 1: In __enter__, record self.start = time.perf_counter() and return self.",
            "Hint 2: In __exit__, calculate self.elapsed = time.perf_counter() - self.start."
        ],
        starterCode: `import time

class TimerContext:
    """Context manager to measure elapsed execution time."""
    def __init__(self):
        self.start = 0.0
        self.elapsed = 0.0

    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.elapsed = time.perf_counter() - self.start
        return False  # Propagate exceptions if any occurred`,
        testCases: [
            { input: "Run inside with block", expectedOutput: "t.elapsed is float >= 0", isHidden: false },
            { input: "Exception occurs inside with block", expectedOutput: "Exception propagated correctly", isHidden: false },
            { input: "Multiple independent timers", expectedOutput: "Thread-isolated measurements", isHidden: true }
        ],
        rubricCriteria: "Proper dunder protocol implementation conforming to PEP 343.",
        sourceUrl: "https://docs.python.org/3/reference/datamodel.html#context-managers"
    },
    {
        id: "py-07",
        title: "Matrix Spiral Order Traversal",
        skill: "Python",
        topic: "Matrix Manipulation and Boundary Pointers",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Navigate 2D arrays with boundary pointers and directional traversal in Python.",
        prerequisites: ["2D lists", "While loops with pointer boundaries"],
        description: "Given an `m x n` matrix of integers, return all elements of the matrix in spiral clockwise order.",
        examples: [
            { input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[1, 2, 3, 6, 9, 8, 7, 4, 5]", explanation: "Outer perimeter traversed first, then inner cell." }
        ],
        hints: [
            "Hint 1: Maintain top, bottom, left, and right boundary pointers.",
            "Hint 2: Increment top after reading row, decrement bottom after reading bottom row, checking boundaries at each turn."
        ],
        starterCode: `def spiral_order(matrix):
    """Return all elements of matrix in spiral order."""
    if not matrix or not matrix[0]:
        return []
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1

    while top <= bottom and left <= right:
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1

        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1

        if top <= bottom:
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1

        if left <= right:
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1

    return result`,
        testCases: [
            { input: "[[1,2,3],[4,5,6],[7,8,9]]", expectedOutput: "[1, 2, 3, 6, 9, 8, 7, 4, 5]", isHidden: false },
            { input: "[[1,2,3,4],[5,6,7,8],[9,10,11,12]]", expectedOutput: "[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]", isHidden: false },
            { input: "[[1]]", expectedOutput: "[1]", isHidden: true }
        ],
        rubricCriteria: "Handles non-square rectangular matrices and 1-row/1-column edge cases flawlessly.",
        sourceUrl: "https://docs.python.org/3/tutorial/datastructures.html"
    },
    {
        id: "py-08",
        title: "Group Anagrams Using DefaultDict",
        skill: "Python",
        topic: "Hashing and Collections",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Group collections by canonized hashable tuple keys using collections.defaultdict.",
        prerequisites: ["collections.defaultdict", "tuple sorting or character frequency counts"],
        description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
        examples: [
            { input: "['eat','tea','tan','ate','nat','bat']", output: "[['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]", explanation: "Strings with identical character counts are grouped." }
        ],
        hints: [
            "Hint 1: Sort each string alphabetically to form a canonical key: `tuple(sorted(s))` or `''.join(sorted(s))`.",
            "Hint 2: Map each canonical key to a list in `defaultdict(list)`."
        ],
        starterCode: `from collections import defaultdict

def group_anagrams(strs):
    """Group list of strings into anagram clusters."""
    groups = defaultdict(list)
    for s in strs:
        key = ''.join(sorted(s))
        groups[key].append(s)
    return list(groups.values())`,
        testCases: [
            { input: "['eat','tea','tan','ate','nat','bat']", expectedOutput: "3 groups grouped properly", isHidden: false },
            { input: "['']", expectedOutput: "[['']]", isHidden: false },
            { input: "['a']", expectedOutput: "[['a']]", isHidden: true }
        ],
        rubricCriteria: "O(N * K log K) runtime where N is word count and K is max string length.",
        sourceUrl: "https://docs.python.org/3/library/collections.html#collections.defaultdict"
    },
    {
        id: "py-09",
        title: "Custom Exception Hierarchy with Error Codes",
        skill: "Python",
        topic: "Object-Oriented Programming and Exceptions",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Build structured application exception hierarchies with status codes and serialized payloads.",
        prerequisites: ["Exception inheritance", "super().__init__()", "__str__ override"],
        description: "Design an `AppError(Exception)` base class with attributes `message` and `error_code`, along with subclasses `NotFoundError(AppError)` (code 404) and `ValidationError(AppError)` (code 400). When stringified, it should output '[ERROR_CODE] message'.",
        examples: [
            { input: "raise NotFoundError('User 42 missing')", output: "str(err) == '[404] User 42 missing'", explanation: "Custom string representation formats code and message." }
        ],
        hints: [
            "Hint 1: Base class initializes `self.message = message` and `self.error_code = error_code`.",
            "Hint 2: Subclasses pass their default status code to `super().__init__(message, 404)`."
        ],
        starterCode: `class AppError(Exception):
    """Base application exception."""
    def __init__(self, message, error_code=500):
        super().__init__(message)
        self.message = message
        self.error_code = error_code

    def __str__(self):
        return f"[{self.error_code}] {self.message}"

class NotFoundError(AppError):
    def __init__(self, message="Resource not found"):
        super().__init__(message, error_code=404)

class ValidationError(AppError):
    def __init__(self, message="Invalid payload"):
        super().__init__(message, error_code=400)`,
        testCases: [
            { input: "NotFoundError('Missing file')", expectedOutput: "'[404] Missing file'", isHidden: false },
            { input: "ValidationError('Negative age')", expectedOutput: "'[400] Negative age'", isHidden: false },
            { input: "isinstance(NotFoundError(), AppError)", expectedOutput: "True", isHidden: true }
        ],
        rubricCriteria: "Clean OOP inheritance preserving standard Python Exception behavior.",
        sourceUrl: "https://docs.python.org/3/tutorial/errors.html#user-defined-exceptions"
    },
    {
        id: "py-10",
        title: "Domain Bank Account with Properties and Dunder Methods",
        skill: "Python",
        topic: "Object-Oriented Programming",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Master encapsulated getters/setters via @property and dunder methods (__str__, __repr__, __eq__).",
        prerequisites: ["@property and @setter", "__repr__ vs __str__", "__eq__ value comparison"],
        description: "Implement a `BankAccount` class with `account_number` (read-only string) and `balance` (float). Prevent setting a negative balance via setter (raise `ValueError`). Implement `deposit(amount)`, `withdraw(amount)`, `__str__`, `__repr__`, and `__eq__` (two accounts are equal if they have the same account_number).",
        examples: [
            { input: "acc = BankAccount('123', 100); acc.deposit(50)", output: "acc.balance == 150", explanation: "Deposit increases balance." },
            { input: "acc.balance = -10", output: "Raises ValueError('Balance cannot be negative')", explanation: "Encapsulation prevents illegal states." }
        ],
        hints: [
            "Hint 1: Store private `_balance` and expose with `@property def balance(self): return self._balance`.",
            "Hint 2: Provide `@balance.setter` that verifies `value >= 0`."
        ],
        starterCode: `class BankAccount:
    """Encapsulated bank account entity with validation."""
    def __init__(self, account_number: str, initial_balance: float = 0.0):
        self._account_number = account_number
        if initial_balance < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = float(initial_balance)

    @property
    def account_number(self):
        return self._account_number

    @property
    def balance(self):
        return self._balance

    @balance.setter
    def balance(self, value):
        if value < 0:
            raise ValueError("Balance cannot be negative")
        self._balance = float(value)

    def deposit(self, amount: float):
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self._balance += amount

    def withdraw(self, amount: float):
        if amount <= 0 or amount > self._balance:
            raise ValueError("Invalid withdrawal amount")
        self._balance -= amount

    def __eq__(self, other):
        return isinstance(other, BankAccount) and self._account_number == other._account_number

    def __str__(self):
        return f"Account({self._account_number}): \${self._balance:.2f}"

    def __repr__(self):
        return f"BankAccount(account_number='{self._account_number}', balance={self._balance})"`,
        testCases: [
            { input: "Deposit and withdraw valid amounts", expectedOutput: "Balance updated correctly", isHidden: false },
            { input: "Attempt negative balance setter", expectedOutput: "ValueError raised", isHidden: false },
            { input: "Two accounts with same account_number compared with ==", expectedOutput: "True", isHidden: true }
        ],
        rubricCriteria: "Robust property encapsulation and accurate dunder equality logic.",
        sourceUrl: "https://docs.python.org/3/library/functions.html#property"
    },
    {
        id: "py-11",
        title: "Search in Rotated Sorted Array (O(log N))",
        skill: "Python",
        topic: "Binary Search Algorithms",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Adapt binary search to identify which half of a rotated array is sorted.",
        prerequisites: ["Binary search", "Midpoint calculations", "O(log N) complexity"],
        description: "Given an integer array `nums` sorted in ascending order (with distinct values) and rotated at some unknown pivot, find the index of a given `target`. If target is not present, return `-1`. You must write an algorithm with `O(log n)` runtime complexity.",
        examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "0 is at index 4." },
            { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1", explanation: "3 is not in array." }
        ],
        hints: [
            "Hint 1: One half (left to mid or mid to right) is guaranteed to be normally sorted at all times.",
            "Hint 2: Check if target lies within the sorted half; if yes, search that half, otherwise search the other."
        ],
        starterCode: `def search_rotated(nums, target):
    """Find index of target in rotated sorted array in O(log N)."""
    left, right = 0, len(nums) - 1

    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid

        # Check if left half is sorted
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            # Right half is sorted
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1

    return -1`,
        testCases: [
            { input: "[4,5,6,7,0,1,2], target=0", expectedOutput: "4", isHidden: false },
            { input: "[4,5,6,7,0,1,2], target=3", expectedOutput: "-1", isHidden: false },
            { input: "[1], target=1", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Strict O(log N) runtime without fallback to linear search.",
        sourceUrl: "https://docs.python.org/3/library/bisect.html"
    },
    {
        id: "py-12",
        title: "Safe Deep Dictionary Key Traversal",
        skill: "Python",
        topic: "Data Structure Traversal",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Safely query nested dictionaries using dot-notation paths without KeyError exceptions.",
        prerequisites: ["Dictionaries", "String split()", "Iterative pointer traversal"],
        description: "Write a function `get_nested(data, path, default=None)` that takes a nested dictionary and a dot-separated string path (e.g. `'user.profile.address.city'`), returning the value if it exists or `default` if any intermediate key is missing or non-dict.",
        examples: [
            { input: "data = {'a': {'b': {'c': 42}}}, path = 'a.b.c'", output: "42", explanation: "Target leaf value resolved." },
            { input: "data = {'a': {'b': 10}}, path = 'a.b.c.d'", output: "None", explanation: "Safe fallback when non-dict encountered." }
        ],
        hints: [
            "Hint 1: Split path by '.' to get key list: `keys = path.split('.')`.",
            "Hint 2: Loop through keys; if current is not a dict or key not in current, return default."
        ],
        starterCode: `def get_nested(data, path, default=None):
    """Safely traverse nested dictionary by dot path."""
    current = data
    for key in path.split('.'):
        if not isinstance(current, dict) or key not in current:
            return default
        current = current[key]
    return current`,
        testCases: [
            { input: "{'user': {'name': 'Alice'}}, 'user.name'", expectedOutput: "'Alice'", isHidden: false },
            { input: "{'user': None}, 'user.name.first'", expectedOutput: "None", isHidden: false },
            { input: "{'a': {'b': 0}}, 'a.b', default=999", expectedOutput: "0 (preserves falsy values)", isHidden: true }
        ],
        rubricCriteria: "Returns falsy values like 0, False, '' correctly without replacing them with default.",
        sourceUrl: "https://docs.python.org/3/tutorial/datastructures.html#dictionaries"
    },

    // ==========================================
    // CODING PRACTICE TRACK (Progressive Practice)
    // ==========================================
    {
        id: "py-13",
        title: "Prime Number Generator with Sieve of Eratosthenes",
        skill: "Python",
        topic: "Algorithms and Comprehensions",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Implement the classic Sieve of Eratosthenes algorithm in Python.",
        prerequisites: ["List indexing and slicing", "Boolean flags array", "Math square root"],
        description: "Write a function `sieve_primes(n)` that returns a list of all prime numbers less than or equal to `n` in ascending order.",
        examples: [
            { input: "n = 10", output: "[2, 3, 5, 7]", explanation: "Primes <= 10." },
            { input: "n = 1", output: "[]", explanation: "No primes <= 1." }
        ],
        hints: [
            "Hint 1: Create a boolean array `is_prime = [True] * (n + 1)` and set index 0 and 1 to False.",
            "Hint 2: For each prime `p` from 2 up to sqrt(n), mark multiples of `p` starting from `p*p` as False."
        ],
        starterCode: `def sieve_primes(n):
    """Return all prime numbers up to n using the Sieve of Eratosthenes."""
    if n < 2:
        return []
    is_prime = [True] * (n + 1)
    is_prime[0] = is_prime[1] = False

    p = 2
    while p * p <= n:
        if is_prime[p]:
            for i in range(p * p, n + 1, p):
                is_prime[i] = False
        p += 1

    return [i for i, prime in enumerate(is_prime) if prime]`,
        testCases: [
            { input: "n = 10", expectedOutput: "[2, 3, 5, 7]", isHidden: false },
            { input: "n = 2", expectedOutput: "[2]", isHidden: false },
            { input: "n = 30", expectedOutput: "[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]", isHidden: true }
        ],
        rubricCriteria: "O(N log log N) time complexity; handles boundary cases n < 2 cleanly.",
        sourceUrl: "https://docs.python.org/3/tutorial/introduction.html#first-steps-towards-programming"
    },
    {
        id: "py-14",
        title: "Invert Dictionary Key-Value Mapping with Conflict Lists",
        skill: "Python",
        topic: "Dictionaries and Grouping",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Invert dictionaries handling duplicate values by accumulating keys into lists.",
        prerequisites: ["Dictionary iteration", "defaultdict or dict.setdefault()"],
        description: "Write `invert_dict(d)` that inverts a dictionary mapping. If multiple keys have the same value, group the original keys into a sorted list under that value.",
        examples: [
            { input: "{'a': 1, 'b': 2, 'c': 1}", output: "{1: ['a', 'c'], 2: ['b']}", explanation: "Keys 'a' and 'c' share value 1." }
        ],
        hints: [
            "Hint 1: Use `result.setdefault(val, []).append(key)`.",
            "Hint 2: Sort the resulting list of keys for consistent output."
        ],
        starterCode: `def invert_dict(d):
    """Invert dictionary with duplicate values collected in sorted lists."""
    inverted = {}
    for key, val in d.items():
        inverted.setdefault(val, []).append(key)
    for val in inverted:
        inverted[val].sort()
    return inverted`,
        testCases: [
            { input: "{'a': 1, 'b': 2, 'c': 1}", expectedOutput: "{1: ['a', 'c'], 2: ['b']}", isHidden: false },
            { input: "{}", expectedOutput: "{}", isHidden: false },
            { input: "{'x': 10, 'y': 10, 'z': 10}", expectedOutput: "{10: ['x', 'y', 'z']}", isHidden: true }
        ],
        rubricCriteria: "Preserves all values and sorts grouped keys deterministically.",
        sourceUrl: "https://docs.python.org/3/library/stdtypes.html#dict"
    },
    {
        id: "py-15",
        title: "Remove All Adjacent Duplicates in String",
        skill: "Python",
        topic: "Stack Data Structure",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Simulate stack-based greedy cancellation of adjacent characters.",
        prerequisites: ["List as stack (append and pop)", "String concatenation"],
        description: "Given a string `s`, repeatedly remove adjacent duplicate character pairs until no more adjacent duplicates remain. Return the final string.",
        examples: [
            { input: "s = 'abbaca'", output: "'ca'", explanation: "'bb' removed -> 'aaca' -> 'aa' removed -> 'ca'." }
        ],
        hints: [
            "Hint 1: Use a stack. For each char, if stack is non-empty and top equals char, pop it.",
            "Hint 2: Otherwise push char onto stack. Join stack at the end."
        ],
        starterCode: `def remove_duplicates(s: str) -> str:
    """Remove all adjacent duplicate character pairs using a stack."""
    stack = []
    for ch in s:
        if stack and stack[-1] == ch:
            stack.pop()
        else:
            stack.append(ch)
    return ''.join(stack)`,
        testCases: [
            { input: "'abbaca'", expectedOutput: "'ca'", isHidden: false },
            { input: "'azxxzy'", expectedOutput: "'ay'", isHidden: false },
            { input: "'aaaa'", expectedOutput: "''", isHidden: true }
        ],
        rubricCriteria: "Linear O(N) time and space complexity.",
        sourceUrl: "https://docs.python.org/3/tutorial/datastructures.html#using-lists-as-stacks"
    },
    {
        id: "py-16",
        title: "Token Bucket Rate Limiter Class",
        skill: "Python",
        topic: "Object-Oriented Programming and Algorithms",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Implement a token bucket algorithm with lazy replenishment based on elapsed time.",
        prerequisites: ["Time math", "OOP state tracking", "Min/Max bounds"],
        description: "Implement a class `TokenBucket(capacity, fill_rate)` where `capacity` is the maximum token count and `fill_rate` is tokens added per second. Implement `allow_request(tokens=1)` returning `True` and deducting tokens if available, or `False` otherwise.",
        examples: [
            { input: "Bucket capacity 5, consume 3 tokens, then 2 tokens", output: "Both succeed; 0 tokens remain until refill", explanation: "Token replenishment depends on elapsed time." }
        ],
        hints: [
            "Hint 1: Record `self.last_check = time.time()`.",
            "Hint 2: On allow_request, compute `elapsed = now - last_check`, add `elapsed * fill_rate` tokens (capped at capacity), and update last_check."
        ],
        starterCode: `import time

class TokenBucket:
    """Token bucket rate limiter with lazy replenishment."""
    def __init__(self, capacity: float, fill_rate: float):
        self.capacity = float(capacity)
        self.fill_rate = float(fill_rate)
        self.tokens = float(capacity)
        self.last_check = time.time()

    def allow_request(self, tokens: float = 1.0) -> bool:
        now = time.time()
        elapsed = now - self.last_check
        self.last_check = now
        # Replenish tokens based on elapsed seconds
        self.tokens = min(self.capacity, self.tokens + elapsed * self.fill_rate)

        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False`,
        testCases: [
            { input: "Immediate burst within capacity", expectedOutput: "True for capacity, then False", isHidden: false },
            { input: "Wait for token replenishment", expectedOutput: "Allows requests again after refill interval", isHidden: false },
            { input: "Fractional token consumption", expectedOutput: "Floating point precision tracked safely", isHidden: true }
        ],
        rubricCriteria: "Accurate lazy replenishment without background threads.",
        sourceUrl: "https://docs.python.org/3/library/time.html"
    },
    {
        id: "py-17",
        title: "Parse CSV Data with Schema Validation & Type Casting",
        skill: "Python",
        topic: "File I/O and Data Parsing",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Parse CSV tabular text into validated and typed dictionary records.",
        prerequisites: ["csv module or string parsing", "Type casting with try-except", "Data validation"],
        description: "Write `parse_csv_records(csv_text, schema)` that takes raw CSV text and a schema dictionary mapping field names to types (e.g. `{'id': int, 'name': str, 'score': float}`). Return a list of parsed record dicts. Skip malformed rows where casting fails.",
        examples: [
            { input: "'id,name,score\\n1,Alice,95.5\\n2,Bob,invalid'", output: "[{'id': 1, 'name': 'Alice', 'score': 95.5}]", explanation: "Row 2 skipped due to invalid float casting." }
        ],
        hints: [
            "Hint 1: Use `csv.DictReader(io.StringIO(csv_text))`.",
            "Hint 2: In a try-except ValueError block, cast each field according to schema."
        ],
        starterCode: `import csv
import io

def parse_csv_records(csv_text, schema):
    """Parse CSV text validating and casting fields according to schema."""
    reader = csv.DictReader(io.StringIO(csv_text.strip()))
    records = []
    for row in reader:
        try:
            parsed = {}
            for field, target_type in schema.items():
                parsed[field] = target_type(row[field].strip())
            records.append(parsed)
        except (ValueError, KeyError):
            continue  # Skip invalid rows
    return records`,
        testCases: [
            { input: "Valid 2-row CSV", expectedOutput: "List of 2 typed dicts", isHidden: false },
            { input: "CSV with corrupt row", expectedOutput: "Corrupt row skipped, valid rows retained", isHidden: false },
            { input: "Trailing commas and whitespace", expectedOutput: "Stripped and parsed accurately", isHidden: true }
        ],
        rubricCriteria: "Resilient parsing with explicit type checking and zero unhandled exceptions.",
        sourceUrl: "https://docs.python.org/3/library/csv.html"
    },
    {
        id: "py-18",
        title: "LRU Cache via collections.OrderedDict",
        skill: "Python",
        topic: "Data Structures and Caching",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Build an O(1) Least Recently Used cache using Python's OrderedDict.",
        prerequisites: ["collections.OrderedDict", "move_to_end()", "popitem(last=False)"],
        description: "Design an `LRUCache(capacity)` with `get(key)` returning value (or -1) and moving key to most recently used, and `put(key, value)` inserting/updating key and evicting the least recently used item when capacity is exceeded.",
        examples: [
            { input: "put(1, 1), put(2, 2), get(1), put(3, 3)", output: "Key 2 evicted because key 1 was accessed", explanation: "Key 1 was renewed by get()." }
        ],
        hints: [
            "Hint 1: Use `self.cache.move_to_end(key)` when accessed.",
            "Hint 2: Evict with `self.cache.popitem(last=False)`."
        ],
        starterCode: `from collections import OrderedDict

class LRUCache:
    """O(1) LRU Cache implementation using OrderedDict."""
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)`,
        testCases: [
            { input: "Cache capacity 2 with evictions", expectedOutput: "Accurate eviction of stale keys", isHidden: false },
            { input: "Overwriting existing key value", expectedOutput: "Value updated without capacity inflation", isHidden: false },
            { input: "Get on non-existent key", expectedOutput: "-1", isHidden: true }
        ],
        rubricCriteria: "Strict O(1) time complexity for both get and put operations.",
        sourceUrl: "https://docs.python.org/3/library/collections.html#collections.OrderedDict"
    },
    {
        id: "py-19",
        title: "Sudoku Board Configuration Validator",
        skill: "Python",
        topic: "Matrices and Hash Sets",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Validate rows, columns, and 3x3 sub-boxes of a 9x9 board using set lookups.",
        prerequisites: ["2D lists", "Set membership", "3x3 sub-grid coordinate mapping"],
        description: "Determine if a `9 x 9` Sudoku board is valid. Only the filled cells need to be validated according to standard Sudoku rules: each row, column, and 3x3 sub-box must contain digits 1-9 without repetition. Empty cells are represented by `'.'`. Return boolean.",
        examples: [
            { input: "Standard valid partially filled board", output: "True", explanation: "No duplicate digits in any row, column, or 3x3 sub-box." }
        ],
        hints: [
            "Hint 1: Use sets with tuples: `('r', row_idx, val)`, `('c', col_idx, val)`, `('b', row//3, col//3, val)`.",
            "Hint 2: If any tuple is already in the set, the board is invalid."
        ],
        starterCode: `def is_valid_sudoku(board):
    """Validate 9x9 Sudoku board."""
    seen = set()
    for r in range(9):
        for c in range(9):
            val = board[r][c]
            if val != '.':
                row_key = ('r', r, val)
                col_key = ('c', c, val)
                box_key = ('b', r // 3, c // 3, val)
                if row_key in seen or col_key in seen or box_key in seen:
                    return False
                seen.add(row_key)
                seen.add(col_key)
                seen.add(box_key)
    return True`,
        testCases: [
            { input: "Valid partially filled board", expectedOutput: "True", isHidden: false },
            { input: "Duplicate '5' in same column", expectedOutput: "False", isHidden: false },
            { input: "Duplicate '8' in same 3x3 sub-box", expectedOutput: "False", isHidden: true }
        ],
        rubricCriteria: "Single-pass O(1) space (at most 81 cells) validation.",
        sourceUrl: "https://docs.python.org/3/tutorial/datastructures.html#sets"
    },
    {
        id: "py-20",
        title: "Bounded Fibonacci Custom Iterator Class",
        skill: "Python",
        topic: "Iterators and Dunder Methods",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Implement the Python iterator protocol using __iter__ and __next__ dunder methods.",
        prerequisites: ["__iter__() returning self", "__next__() raising StopIteration", "Fibonacci sequence logic"],
        description: "Implement a class `FibonacciIterator(max_value)` that implements the Python iterator protocol. It yields Fibonacci numbers (0, 1, 1, 2, 3, 5, ...) stopping (via `StopIteration`) as soon as the next number exceeds `max_value`.",
        examples: [
            { input: "list(FibonacciIterator(10))", output: "[0, 1, 1, 2, 3, 5, 8]", explanation: "13 exceeds 10, so iteration stops." }
        ],
        hints: [
            "Hint 1: In __next__, check if current > max_value. If so, raise StopIteration.",
            "Hint 2: Advance a, b = b, a + b and return previous a."
        ],
        starterCode: `class FibonacciIterator:
    """Iterator yielding Fibonacci numbers up to max_value."""
    def __init__(self, max_value: int):
        self.max_value = max_value
        self.a = 0
        self.b = 1

    def __iter__(self):
        return self

    def __next__(self):
        if self.a > self.max_value:
            raise StopIteration
        current = self.a
        self.a, self.b = self.b, self.a + self.b
        return current`,
        testCases: [
            { input: "max_value = 10", expectedOutput: "[0, 1, 1, 2, 3, 5, 8]", isHidden: false },
            { input: "max_value = 0", expectedOutput: "[0]", isHidden: false },
            { input: "max_value = 1", expectedOutput: "[0, 1, 1]", isHidden: true }
        ],
        rubricCriteria: "Conforms strictly to PEP 234 iterator protocol with proper StopIteration termination.",
        sourceUrl: "https://docs.python.org/3/tutorial/classes.html#iterators"
    },
    {
        id: "py-21",
        title: "Task Scheduler with Dependency Resolution (Topological Sort)",
        skill: "Python",
        topic: "Graph Algorithms and In-Degree",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Order dependent execution graphs and detect circular cycles using Kahn's algorithm.",
        prerequisites: ["Graph adjacency list", "In-degree array/dict", "Queue (collections.deque)"],
        description: "Given `num_tasks` (integer 0 to n-1) and a list of directed dependencies `prerequisites` where `[a, b]` means task `b` must be completed before task `a` can start, return a valid task execution order. If it is impossible due to a cycle, return an empty list `[]`.",
        examples: [
            { input: "num_tasks = 2, prerequisites = [[1,0]]", output: "[0, 1]", explanation: "Task 0 must precede task 1." },
            { input: "num_tasks = 2, prerequisites = [[1,0],[0,1]]", output: "[]", explanation: "Circular dependency detected." }
        ],
        hints: [
            "Hint 1: Build adjacency list and compute in-degrees for each task.",
            "Hint 2: Add all tasks with in_degree == 0 to a queue. Process and decrement neighbor in-degrees."
        ],
        starterCode: `from collections import deque, defaultdict

def find_order(num_tasks, prerequisites):
    """Return valid task execution order or [] if circular."""
    adj = defaultdict(list)
    in_degree = [0] * num_tasks

    for dest, src in prerequisites:
        adj[src].append(dest)
        in_degree[dest] += 1

    queue = deque([i for i in range(num_tasks) if in_degree[i] == 0])
    order = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return order if len(order) == num_tasks else []`,
        testCases: [
            { input: "4 tasks with linear chain", expectedOutput: "Valid topological order", isHidden: false },
            { input: "Cycle [1->0, 0->1]", expectedOutput: "[]", isHidden: false },
            { input: "Disconnected forest of tasks", expectedOutput: "All components resolved", isHidden: true }
        ],
        rubricCriteria: "Linear O(V + E) runtime with robust cycle detection.",
        sourceUrl: "https://docs.python.org/3/library/collections.html#collections.deque"
    },
    {
        id: "py-22",
        title: "Serialize and Deserialize Binary Tree to JSON String",
        skill: "Python",
        topic: "Tree Serialization and Recursion",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Convert tree graph structures to serialized text and reconstruct identical trees.",
        prerequisites: ["Binary tree node", "Pre-order traversal (DFS)", "Iterators for deserialization"],
        description: "Design an algorithm to serialize a binary tree to a string and deserialize that string back to the original tree structure. You may use preorder DFS with null markers.",
        examples: [
            { input: "Tree [1, 2, 3, null, null, 4, 5]", output: "Serialized string can be deserialized back into identical binary tree", explanation: "Lossless round-trip conversion." }
        ],
        hints: [
            "Hint 1: In serialize, use pre-order traversal; if node is None, append '#'.",
            "Hint 2: In deserialize, turn string into an iterator `iter(data.split(','))` and recurse."
        ],
        starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root) -> str:
        """Encodes a tree to a single string."""
        def dfs(node):
            if not node:
                return ["#"]
            return [str(node.val)] + dfs(node.left) + dfs(node.right)
        return ','.join(dfs(root))

    def deserialize(self, data: str):
        """Decodes your encoded data to tree."""
        values = iter(data.split(','))
        def build():
            val = next(values)
            if val == '#':
                return None
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node
        return build()`,
        testCases: [
            { input: "Single root node", expectedOutput: "Serializes and deserializes accurately", isHidden: false },
            { input: "Empty tree (None)", expectedOutput: "Serializes to '#' and deserializes to None", isHidden: false },
            { input: "Skewed linked-list tree", expectedOutput: "Preserves topology exactly", isHidden: true }
        ],
        rubricCriteria: "O(N) time and space serialization with lossless structural fidelity.",
        sourceUrl: "https://docs.python.org/3/library/json.html"
    },
    {
        id: "py-23",
        title: "Longest Increasing Subsequence in O(N log N) via Bisect",
        skill: "Python",
        topic: "Dynamic Programming and Bisect",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Achieve optimal O(N log N) patience sorting using Python's standard bisect module.",
        prerequisites: ["bisect.bisect_left", "Patience sorting / tails array", "O(N log N) complexity"],
        description: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence. Your solution must run in `O(N log N)` time.",
        examples: [
            { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The longest increasing subsequence is [2, 3, 7, 101], length 4." }
        ],
        hints: [
            "Hint 1: Maintain a `tails` list where `tails[i]` stores the smallest tail of all increasing subsequences of length `i + 1`.",
            "Hint 2: For each x in nums, find its insertion point with `idx = bisect.bisect_left(tails, x)`. If idx == len(tails), append x; else tails[idx] = x."
        ],
        starterCode: `import bisect

def length_of_lis(nums):
    """Find length of longest increasing subsequence in O(N log N)."""
    tails = []
    for x in nums:
        idx = bisect.bisect_left(tails, x)
        if idx == len(tails):
            tails.append(x)
        else:
            tails[idx] = x
    return len(tails)`,
        testCases: [
            { input: "[10,9,2,5,3,7,101,18]", expectedOutput: "4", isHidden: false },
            { input: "[0,1,0,3,2,3]", expectedOutput: "4", isHidden: false },
            { input: "[7,7,7,7,7]", expectedOutput: "1 (strictly increasing)", isHidden: true }
        ],
        rubricCriteria: "O(N log N) runtime using binary search without O(N^2) nested DP loops.",
        sourceUrl: "https://docs.python.org/3/library/bisect.html"
    },
    {
        id: "py-24",
        title: "Thread-Safe Singleton Pattern using Metaclasses",
        skill: "Python",
        topic: "Metaclasses and Concurrency",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Enforce process-wide singletons safely across multi-threaded applications via Python metaclasses.",
        prerequisites: ["type metaclass", "__call__ intercept", "threading.Lock()"],
        description: "Implement a thread-safe Singleton metaclass `SingletonMeta(type)`. Any class defined with `metaclass=SingletonMeta` should instantiate exactly one instance even when called concurrently from multiple threads.",
        examples: [
            { input: "class Database(metaclass=SingletonMeta): pass; d1 = Database(); d2 = Database()", output: "d1 is d2", explanation: "Same memory instance returned." }
        ],
        hints: [
            "Hint 1: In `SingletonMeta.__init__`, define `self._instances = {}` and `self._lock = threading.Lock()`.",
            "Hint 2: In `__call__`, acquire `self._lock` before checking and creating the instance."
        ],
        starterCode: `import threading

class SingletonMeta(type):
    """Thread-safe Singleton metaclass."""
    _instances = {}
    _lock = threading.Lock()

    def __call__(cls, *args, **kwargs):
        with cls._lock:
            if cls not in cls._instances:
                instance = super().__call__(*args, **kwargs)
                cls._instances[cls] = instance
        return cls._instances[cls]`,
        testCases: [
            { input: "d1 = Service(); d2 = Service()", expectedOutput: "d1 is d2 returns True", isHidden: false },
            { input: "Concurrent instantiation from 10 threads", expectedOutput: "All threads obtain identical object id", isHidden: false },
            { input: "Subclassing two distinct singleton classes", expectedOutput: "Each class has independent singleton instance", isHidden: true }
        ],
        rubricCriteria: "Thread-safety with lock; metaclass correctly intercepts class invocation.",
        sourceUrl: "https://docs.python.org/3/reference/datamodel.html#metaclasses"
    },
    {
        id: "py-25",
        title: "Regex Pattern Matcher with '.' and '*' Support",
        skill: "Python",
        topic: "Dynamic Programming and String Matching",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Implement a dynamic programming regex parser supporting wildcard '.' and Kleene star '*'.",
        prerequisites: ["2D dynamic programming", "Pattern state machine", "String matching"],
        description: "Given an input string `s` and a pattern `p`, implement regular expression matching with support for `'.'` (matches any single character) and `'*'` (matches zero or more of the preceding element). The matching should cover the entire input string (not partial).",
        examples: [
            { input: "s = 'aa', p = 'a*'", output: "True", explanation: "'*' repeats 'a' twice." },
            { input: "s = 'ab', p = '.*'", output: "True", explanation: "'.*' matches any string." }
        ],
        hints: [
            "Hint 1: Use a 2D boolean table `dp[i][j]` representing whether s[:i] matches p[:j].",
            "Hint 2: If p[j-1] == '*', it can match 0 occurrences (`dp[i][j-2]`) or 1+ occurrences if preceding char matches (`dp[i-1][j]`)."
        ],
        starterCode: `def is_match(s: str, p: str) -> bool:
    """Evaluate full string regex matching with '.' and '*'."""
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True

    # Handle patterns with '*' matching empty string
    for j in range(2, n + 1):
        if p[j - 1] == '*':
            dp[0][j] = dp[0][j - 2]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j - 1] == '*':
                # Match 0 of preceding or match 1+ if char matches
                dp[i][j] = dp[i][j - 2] or (
                    (p[j - 2] == '.' or p[j - 2] == s[i - 1]) and dp[i - 1][j]
                )
            elif p[j - 1] == '.' or p[j - 1] == s[i - 1]:
                dp[i][j] = dp[i - 1][j - 1]

    return dp[m][n]`,
        testCases: [
            { input: "s = 'aa', p = 'a*'", expectedOutput: "True", isHidden: false },
            { input: "s = 'mississippi', p = 'mis*is*p*.'", expectedOutput: "False", isHidden: false },
            { input: "s = 'aab', p = 'c*a*b'", expectedOutput: "True", isHidden: true }
        ],
        rubricCriteria: "Rigorous DP matrix handling Kleene star 0-occurrence lookback correctly.",
        sourceUrl: "https://docs.python.org/3/library/re.html"
    }
];

if (typeof window !== "undefined") {
    window.PYTHON_PROBLEMS = PYTHON_PROBLEMS;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { PYTHON_PROBLEMS };
}
