/**
 * WorkforceIQ Problem Catalog - Batch 1: Java Fundamentals & Object-Oriented Programming (OOP)
 * Contains 32 unique problems (7 existing preserved + 25 new)
 * Divided into Must-Solve and Coding Practice tracks.
 */

const JAVA_OOP_PROBLEMS = [
    // ==========================================
    // EXISTING PROBLEMS (PRESERVED VERBATIM)
    // ==========================================
    {
        id: "java-fund-01",
        title: "Primitive Types & Memory Limits",
        skill: "Java Fundamentals",
        topic: "Variables and Data Types",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Understand integer overflow, type casting, and range limits of primitive types.",
        prerequisites: ["Basic Java syntax", "Variable declaration"],
        description: "Write a method `solve(int a, int b)` that computes the sum of two integers. If the sum exceeds `Integer.MAX_VALUE` or is below `Integer.MIN_VALUE`, throw an `ArithmeticException` with message 'Integer overflow detected', otherwise return the sum as a long.",
        examples: [
            { input: "a = 2147483640, b = 10", output: "ArithmeticException: Integer overflow detected", explanation: "2147483640 + 10 exceeds 2^31 - 1 (2147483647)." },
            { input: "a = 15, b = 25", output: "40", explanation: "Normal safe addition within integer bounds." }
        ],
        hints: [
            "Hint 1: You can check bounds before addition or promote operands to long before comparing with Integer.MAX_VALUE.",
            "Hint 2: Alternatively, look into Math.addExact(int x, int y) introduced in Java 8."
        ],
        starterCode: `public class Solution {
    public static long safeAdd(int a, int b) {
        // Write your solution here
        return (long) a + b;
    }
}`,
        testCases: [
            { input: "15, 25", expectedOutput: "40", isHidden: false },
            { input: "2147483640, 10", expectedOutput: "OVERFLOW", isHidden: false },
            { input: "-2147483640, -100", expectedOutput: "OVERFLOW", isHidden: true },
            { input: "0, 0", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Detects both positive and negative integer overflow correctly without silently wrapping around.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/datatypes.html"
    },
    {
        id: "java-fund-02",
        title: "FizzBuzz Pattern Matching",
        skill: "Java Fundamentals",
        topic: "Control Flow",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Master conditional branching, order of boolean evaluation, and modulo arithmetic.",
        prerequisites: ["if-else conditionals", "Modulo operator (%)"],
        description: "Given an integer `n`, return a list of strings from 1 to `n` where numbers divisible by 3 and 5 are 'FizzBuzz', divisible by 3 are 'Fizz', divisible by 5 are 'Buzz', and otherwise the number as a string.",
        examples: [
            { input: "n = 5", output: "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]", explanation: "3 -> Fizz, 5 -> Buzz" },
            { input: "n = 15", output: "Ends with \"FizzBuzz\" at index 15", explanation: "15 is divisible by both 3 and 5." }
        ],
        hints: [
            "Hint 1: Check the combined condition (divisible by 15) first, or build strings by concatenation.",
            "Hint 2: Beware of checking `i % 3 == 0` first if you don't handle the 15 case."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static List<String> fizzBuzz(int n) {
        List<String> result = new ArrayList<>();
        // Write your solution here
        return result;
    }
}`,
        testCases: [
            { input: "3", expectedOutput: "[\"1\", \"2\", \"Fizz\"]", isHidden: false },
            { input: "5", expectedOutput: "[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]", isHidden: false },
            { input: "15", expectedOutput: "15th is FizzBuzz", isHidden: true }
        ],
        rubricCriteria: "Outputs exact capitalization and order without off-by-one errors.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/flow.html"
    },
    {
        id: "java-fund-03",
        title: "String Palindrome & Character Cleaning",
        skill: "Java Fundamentals",
        topic: "Strings",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Practice String manipulation, ASCII pointer inspection, and two-pointer traversal.",
        prerequisites: ["String indexing", "Character class methods"],
        description: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Write an optimal O(N) time and O(1) extra space solution.",
        examples: [
            { input: "s = \"A man, a plan, a canal: Panama\"", output: "true", explanation: "\"amanaplanacanalpanama\" is a palindrome." },
            { input: "s = \"race a car\"", output: "false", explanation: "\"raceacar\" is not a palindrome." }
        ],
        hints: [
            "Hint 1: Use two pointers (left starting at 0, right starting at length - 1).",
            "Hint 2: Skip non-alphanumeric characters using Character.isLetterOrDigit(char c)."
        ],
        starterCode: `public class Solution {
    public static boolean isPalindrome(String s) {
        // Two-pointer approach
        // Write your solution here
        return true;
    }
}`,
        testCases: [
            { input: "\"A man, a plan, a canal: Panama\"", expectedOutput: "true", isHidden: false },
            { input: "\"race a car\"", expectedOutput: "false", isHidden: false },
            { input: "\" \"", expectedOutput: "true", isHidden: true },
            { input: "\"0P\"", expectedOutput: "false", isHidden: true }
        ],
        rubricCriteria: "Time complexity O(N) with O(1) auxiliary space, correct handling of spaces and punctuation.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/data/strings.html"
    },
    {
        id: "java-fund-04",
        title: "Robust Exception Handling with Resources",
        skill: "Java Fundamentals",
        topic: "Exception Handling",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "High Priority",
        objective: "Understand checked vs unchecked exceptions and proper try-with-resources resource cleanup.",
        prerequisites: ["try-catch blocks", "AutoCloseable interface"],
        description: "Implement a method `parseConfig(String rawConfig)` that reads key-value pairs formatted as 'key=value\\n'. If a line does not contain '=', throw a custom `MalformedConfigException` with the line number. Ensure resources are closed cleanly.",
        examples: [
            { input: "\"host=localhost\\nport=8080\"", output: "Map containing host and port keys", explanation: "Valid 2-line config format." },
            { input: "\"host=localhost\\ninvalid_line\"", output: "Throws MalformedConfigException: Invalid syntax at line 2", explanation: "Line 2 lacks an equals sign delimiter." }
        ],
        hints: [
            "Hint 1: Use BufferedReader with StringReader inside a try-with-resources statement.",
            "Hint 2: Track line counter and validate each line contains index of '=' > 0."
        ],
        starterCode: `import java.util.*;
import java.io.*;

public class Solution {
    public static Map<String, String> parseConfig(String rawConfig) throws Exception {
        Map<String, String> map = new HashMap<>();
        // Write your solution here
        return map;
    }
}`,
        testCases: [
            { input: "\"host=localhost\\nport=8080\"", expectedOutput: "{host=localhost, port=8080}", isHidden: false },
            { input: "\"name=WorkforceIQ\"", expectedOutput: "{name=WorkforceIQ}", isHidden: false },
            { input: "\"bad_syntax_here\"", expectedOutput: "EXCEPTION_THROWN", isHidden: true }
        ],
        rubricCriteria: "Throws specific checked/unchecked exception on syntax errors with correct line numbering.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html"
    },
    {
        id: "oop-01",
        title: "Immutable Domain Object Pattern",
        skill: "OOP",
        topic: "Encapsulation",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Master principles of thread-safe immutability: final class, private final fields, defensive copying.",
        prerequisites: ["Encapsulation", "Object reference semantics"],
        description: "Design an immutable `UserProfile` class having `id` (Long), `username` (String), and `skills` (List<String>). Ensure caller mutations to the input list or return list do not compromise class integrity.",
        examples: [
            { input: "List passed into constructor is modified afterwards", output: "UserProfile.getSkills() remains untouched", explanation: "Defensive copying creates an internal independent copy." },
            { input: "userProfile.getSkills().add(\"Hacked\")", output: "Throws UnsupportedOperationException or retains original list", explanation: "Returned list is unmodifiable." }
        ],
        hints: [
            "Hint 1: In the constructor, store `Collections.unmodifiableList(new ArrayList<>(skills))`.",
            "Hint 2: In the getter, return an unmodifiable view or a clone of the list."
        ],
        starterCode: `import java.util.*;

public final class UserProfile {
    private final Long id;
    private final String username;
    private final List<String> skills;

    public UserProfile(Long id, String username, List<String> skills) {
        this.id = id;
        this.username = username;
        // Write your solution here: defensive copy
        this.skills = skills != null ? Collections.unmodifiableList(new ArrayList<>(skills)) : Collections.emptyList();
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public List<String> getSkills() { return skills; }
}`,
        testCases: [
            { input: "UserProfile created with [\"Java\", \"SQL\"]", expectedOutput: "Immutable list size 2", isHidden: false },
            { input: "Mutate source array after construction", expectedOutput: "UserProfile retains initial elements", isHidden: false },
            { input: "Null skills passed", expectedOutput: "Empty list returned safely", isHidden: true }
        ],
        rubricCriteria: "Defensive copy in constructor and unmodifiable list return; class declared final.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/essential/concurrency/immediat.html"
    },
    {
        id: "oop-02",
        title: "Payment Gateway Polymorphism & Strategy",
        skill: "OOP",
        topic: "Polymorphism",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Implement the Strategy design pattern using dynamic polymorphism and dependency inversion.",
        prerequisites: ["Interfaces", "Method overriding (@Override)"],
        description: "Create a `PaymentProcessor` interface with method `processPayment(double amount)`. Implement `CreditCardPayment` (with 2% fee) and `UpiPayment` (0% fee). Write a `CheckoutService` that accepts any processor polymorphically.",
        examples: [
            { input: "processor = CreditCardPayment, amount = 100.0", output: "Charged 102.0", explanation: "100.0 + (100.0 * 0.02) = 102.0." },
            { input: "processor = UpiPayment, amount = 250.0", output: "Charged 250.0", explanation: "UPI has zero transaction surcharge." }
        ],
        hints: [
            "Hint 1: Avoid if-else checks on payment type. Let the concrete class calculate total charged.",
            "Hint 2: Keep CheckoutService dependent on the interface abstraction, not concrete implementations."
        ],
        starterCode: `interface PaymentProcessor {
    double process(double amount);
}

public class Solution {
    public static double executePayment(PaymentProcessor processor, double amount) {
        // Write your solution here
        return processor.process(amount);
    }
}`,
        testCases: [
            { input: "CreditCard, 100.0", expectedOutput: "102.0", isHidden: false },
            { input: "UPI, 500.0", expectedOutput: "500.0", isHidden: false },
            { input: "CreditCard, 1000.0", expectedOutput: "1020.0", isHidden: true }
        ],
        rubricCriteria: "Correct polymorphic dispatch without type-casting or instanceof branches.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html"
    },
    {
        id: "oop-03",
        title: "LRU Cache using LinkedHashMap or Doubly Linked List",
        skill: "OOP",
        topic: "Classes and Objects",
        difficulty: "Hard",
        track: "Must-Solve",
        priority: "High Priority",
        objective: "Compose data structures and maintain stateful object invariants with O(1) eviction.",
        prerequisites: ["HashMap", "Doubly Linked List", "LinkedHashMap removeEldestEntry"],
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement `get(key)` and `put(key, value)` both running in average O(1) time complexity.",
        examples: [
            { input: "capacity = 2; put(1, 1); put(2, 2); get(1); put(3, 3); get(2);", output: "get(1) returns 1; get(2) returns -1 (evicted)", explanation: "Key 2 was evicted when key 3 was inserted because key 1 was accessed most recently." }
        ],
        hints: [
            "Hint 1: Java's LinkedHashMap has a protected boolean `removeEldestEntry(Map.Entry)` method.",
            "Hint 2: Pass `accessOrder = true` in the LinkedHashMap constructor so access order is tracked."
        ],
        starterCode: `import java.util.*;

public class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int capacity;

    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    public int get(int key) {
        return super.getOrDefault(key, -1);
    }

    public void put(int key, int value) {
        super.put(key, value);
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        // Write your solution here
        return size() > capacity;
    }
}`,
        testCases: [
            { input: "put(1,10), put(2,20), get(1), put(3,30), get(2)", expectedOutput: "get(2) == -1", isHidden: false },
            { input: "capacity=1, put(1,5), put(2,6), get(1)", expectedOutput: "get(1) == -1", isHidden: false },
            { input: "capacity=2, put(1,1), put(1,2), get(1)", expectedOutput: "get(1) == 2", isHidden: true }
        ],
        rubricCriteria: "Strict O(1) average time complexity for both get and put operations with eviction.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/util/LinkedHashMap.html"
    },

    // ==========================================
    // NEW JAVA FUNDAMENTALS: MUST-SOLVE (8)
    // ==========================================
    {
        id: "java-fund-05",
        title: "Loop Invariants & Factorial Calculation",
        skill: "Java Fundamentals",
        topic: "Loops & Iteration",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Understand iterative loops, accumulation variables, and edge case handling for n=0 and n=1.",
        prerequisites: ["for loops", "Primitive integer types"],
        description: "Implement a method `factorial(int n)` that computes the factorial of non-negative integer `n`. Return -1 if `n < 0` or if `n > 20` (as it would overflow a 64-bit signed long).",
        examples: [
            { input: "n = 5", output: "120", explanation: "5 * 4 * 3 * 2 * 1 = 120." },
            { input: "n = 0", output: "1", explanation: "0! is mathematically defined as 1." }
        ],
        hints: [
            "Hint 1: Use a long accumulator variable initialized to 1.",
            "Hint 2: Validate boundary conditions first before starting loop."
        ],
        starterCode: `public class Solution {
    public static long factorial(int n) {
        // Write your solution here
        return 1;
    }
}`,
        testCases: [
            { input: "5", expectedOutput: "120", isHidden: false },
            { input: "0", expectedOutput: "1", isHidden: false },
            { input: "-3", expectedOutput: "-1", isHidden: true },
            { input: "20", expectedOutput: "2432902008176640000", isHidden: true }
        ],
        rubricCriteria: "Handles edge cases 0 and negative inputs correctly, accumulator uses long.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/for.html"
    },
    {
        id: "java-fund-06",
        title: "Array Deduplication & In-Place Compaction",
        skill: "Java Fundamentals",
        topic: "Arrays & Iteration",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Manipulate array pointers in-place to remove duplicate elements from sorted arrays.",
        prerequisites: ["Array indexing", "Two-pointer technique"],
        description: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements `k`.",
        examples: [
            { input: "nums = [1, 1, 2]", output: "2 (nums becomes [1, 2, _])", explanation: "Array length of unique elements is 2." },
            { input: "nums = [0, 0, 1, 1, 1, 2, 2, 3, 3, 4]", output: "5", explanation: "First 5 elements are [0, 1, 2, 3, 4]." }
        ],
        hints: [
            "Hint 1: Use an index write pointer starting at 1.",
            "Hint 2: Only copy `nums[read]` to `nums[write]` when `nums[read] != nums[write - 1]`."
        ],
        starterCode: `public class Solution {
    public static int removeDuplicates(int[] nums) {
        // Write your solution here
        return 0;
    }
}`,
        testCases: [
            { input: "[1, 1, 2]", expectedOutput: "2", isHidden: false },
            { input: "[0, 0, 1, 1, 2]", expectedOutput: "3", isHidden: false },
            { input: "[7]", expectedOutput: "1", isHidden: true }
        ],
        rubricCriteria: "Modifies array in-place with O(1) auxiliary space, returns accurate unique count.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html"
    },
    {
        id: "java-fund-07",
        title: "Custom Generic Pair Container",
        skill: "Java Fundamentals",
        topic: "Generics & Type Safety",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Understand generic type parameters <T, U>, compile-time type safety, and equals/hashCode implementation.",
        prerequisites: ["Generics syntax", "Object methods"],
        description: "Create a generic immutable class `Pair<T, U>` holding two values `first` and `second`. Implement `getFirst()`, `getSecond()`, and an overridden `toString()` formatting as '(first, second)'.",
        examples: [
            { input: "Pair<String, Integer> p = new Pair<>(\"Age\", 25)", output: "\"(Age, 25)\"", explanation: "Formats pair elements neatly." }
        ],
        hints: [
            "Hint 1: Declare class with `<T, U>` type parameters.",
            "Hint 2: Make the fields private final and initialize via constructor."
        ],
        starterCode: `public class Pair<T, U> {
    private final T first;
    private final U second;

    public Pair(T first, U second) {
        this.first = first;
        this.second = second;
    }

    public T getFirst() { return first; }
    public U getSecond() { return second; }

    @Override
    public String toString() {
        // Write your solution here
        return "(" + first + ", " + second + ")";
    }
}`,
        testCases: [
            { input: "\"ID\", 101", expectedOutput: "\"(ID, 101)\"", isHidden: false },
            { input: "1.5, true", expectedOutput: "\"(1.5, true)\"", isHidden: false },
            { input: "null, null", expectedOutput: "\"(null, null)\"", isHidden: true }
        ],
        rubricCriteria: "Type-safe generic class definition with correct getters and toString formatting.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/generics/types.html"
    },
    {
        id: "java-fund-08",
        title: "Stream API Filtering & Mapping",
        skill: "Java Fundamentals",
        topic: "Java Streams & Lambdas",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Utilize declarative functional pipelines: filter, map, collect, and collectors.",
        prerequisites: ["Java 8 Streams", "Lambda expressions"],
        description: "Given a list of employee names, write a method `filterAndUpperCase(List<String> names, int minLength)` that filters names having at least `minLength` characters, converts them to UPPERCASE, sorts them alphabetically, and returns the result as a List.",
        examples: [
            { input: "names = [\"alice\", \"bob\", \"charlotte\", \"dan\"], minLength = 4", output: "[\"ALICE\", \"CHARLOTTE\"]", explanation: "'bob' (3) and 'dan' (3) are excluded." }
        ],
        hints: [
            "Hint 1: Use `names.stream().filter(s -> s.length() >= minLength)`.",
            "Hint 2: Chain `.map(String::toUpperCase).sorted().collect(Collectors.toList())`."
        ],
        starterCode: `import java.util.*;
import java.util.stream.*;

public class Solution {
    public static List<String> filterAndUpperCase(List<String> names, int minLength) {
        // Write your solution here
        return names.stream()
            .filter(n -> n != null && n.length() >= minLength)
            .map(String::toUpperCase)
            .sorted()
            .collect(Collectors.toList());
    }
}`,
        testCases: [
            { input: "[\"alex\", \"sam\", \"christina\"], minLength = 4", expectedOutput: "[\"ALEX\", \"CHRISTINA\"]", isHidden: false },
            { input: "[\"a\", \"bb\"], minLength = 3", expectedOutput: "[]", isHidden: false },
            { input: "[\"zebra\", \"apple\"], minLength = 5", expectedOutput: "[\"APPLE\", \"ZEBRA\"]", isHidden: true }
        ],
        rubricCriteria: "Pure stream pipeline without mutable external side effects.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/util/stream/package-summary.html"
    },
    {
        id: "java-fund-09",
        title: "Word Frequency Map with HashMap",
        skill: "Java Fundamentals",
        topic: "Collections Framework",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Use HashMap for counting occurrences and handling default keys.",
        prerequisites: ["Map interface", "HashMap operations"],
        description: "Given a sentence string, count the frequency of each lowercase word (ignoring punctuation). Return a Map<String, Integer> mapping word to frequency.",
        examples: [
            { input: "\"the quick brown fox jumps over the lazy dog the\"", output: "{the=3, quick=1, brown=1, ...}", explanation: "'the' appears 3 times." }
        ],
        hints: [
            "Hint 1: Split string by whitespace regex `\\\\s+`.",
            "Hint 2: Use `map.put(word, map.getOrDefault(word, 0) + 1)` or `map.merge()`."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static Map<String, Integer> wordFrequency(String text) {
        Map<String, Integer> counts = new HashMap<>();
        // Write your solution here
        return counts;
    }
}`,
        testCases: [
            { input: "\"hello world hello\"", expectedOutput: "{hello=2, world=1}", isHidden: false },
            { input: "\"java\"", expectedOutput: "{java=1}", isHidden: false },
            { input: "\"one one one two\"", expectedOutput: "{one=3, two=1}", isHidden: true }
        ],
        rubricCriteria: "Accurate frequency calculation with O(N) time complexity.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html"
    },
    {
        id: "java-fund-10",
        title: "Priority Queue & Task Scheduling",
        skill: "Java Fundamentals",
        topic: "Collections Framework",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Implement priority-based scheduling using PriorityQueue with custom Comparator.",
        prerequisites: ["PriorityQueue", "Comparator interface"],
        description: "A task has a `name` (String) and `priority` (int, higher number = higher priority). Write a scheduler method `drainTasksByPriority(List<Task> tasks)` that returns task names in order of highest priority first. If priorities tie, break ties alphabetically.",
        examples: [
            { input: "[Task('Bug', 5), Task('Feature', 10), Task('Docs', 5)]", output: "['Feature', 'Bug', 'Docs']", explanation: "Priority 10 first, then 5 ties broken by alphabetical name." }
        ],
        hints: [
            "Hint 1: Use PriorityQueue with Comparator `Comparator.comparingInt(Task::getPriority).reversed().thenComparing(Task::getName)`.",
            "Hint 2: Poll elements until the queue is empty."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static class Task {
        public String name;
        public int priority;
        public Task(String n, int p) { this.name = n; this.priority = p; }
    }

    public static List<String> drainTasks(List<Task> tasks) {
        List<String> order = new ArrayList<>();
        // Write your solution here
        return order;
    }
}`,
        testCases: [
            { input: "[(\"A\", 1), (\"B\", 5)]", expectedOutput: "[\"B\", \"A\"]", isHidden: false },
            { input: "[(\"Alpha\", 3), (\"Beta\", 3)]", expectedOutput: "[\"Alpha\", \"Beta\"]", isHidden: false },
            { input: "[(\"Critical\", 99)]", expectedOutput: "[\"Critical\"]", isHidden: true }
        ],
        rubricCriteria: "PriorityQueue accurately orders elements using custom multi-level comparator.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/util/PriorityQueue.html"
    },
    {
        id: "java-fund-11",
        title: "Safe Multithreaded Counter",
        skill: "Java Fundamentals",
        topic: "Concurrency & Atomic Variables",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Understand thread race conditions and lock-free thread safety using AtomicInteger.",
        prerequisites: ["Threads", "Race conditions", "AtomicInteger"],
        description: "Write a thread-safe counter class `SafeCounter` supporting `increment()`, `decrement()`, and `getValue()`. It must allow concurrent invocations across 10 threads without losing updates.",
        examples: [
            { input: "10 threads each incrementing 1,000 times", output: "10000", explanation: "No lost updates due to atomic compare-and-swap (CAS)." }
        ],
        hints: [
            "Hint 1: Use `java.util.concurrent.atomic.AtomicInteger` as the underlying storage.",
            "Hint 2: `incrementAndGet()` and `decrementAndGet()` provide lock-free atomicity."
        ],
        starterCode: `import java.util.concurrent.atomic.AtomicInteger;

public class SafeCounter {
    private final AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        // Write your solution here
        count.incrementAndGet();
    }

    public void decrement() {
        // Write your solution here
        count.decrementAndGet();
    }

    public int getValue() {
        return count.get();
    }
}`,
        testCases: [
            { input: "Increment 5 times", expectedOutput: "5", isHidden: false },
            { input: "Increment 10, Decrement 3", expectedOutput: "7", isHidden: false },
            { input: "Initial state", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Thread-safe implementation with atomic primitives, avoids unsynchronized shared mutable state.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/atomic/AtomicInteger.html"
    },
    {
        id: "java-fund-12",
        title: "File Line Counting & UTF-8 Reader",
        skill: "Java Fundamentals",
        topic: "File I/O & NIO",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Read text stream with proper UTF-8 charset encoding and count non-empty lines.",
        prerequisites: ["BufferedReader", "StandardCharsets"],
        description: "Implement a method `countValidLines(String content)` that counts lines that are not empty and not purely whitespace, ignoring comment lines that start with '#'.",
        examples: [
            { input: "\"# Config\\nhost=localhost\\n\\nport=8080\\n# End\"", output: "2", explanation: "'host=localhost' and 'port=8080' are valid; comments and empty lines ignored." }
        ],
        hints: [
            "Hint 1: Use `BufferedReader` with `StringReader`.",
            "Hint 2: Check `line.trim().isEmpty()` and `line.trim().startsWith(\"#\")`."
        ],
        starterCode: `import java.io.*;

public class Solution {
    public static int countValidLines(String content) throws IOException {
        int count = 0;
        // Write your solution here
        return count;
    }
}`,
        testCases: [
            { input: "\"a\\nb\\nc\"", expectedOutput: "3", isHidden: false },
            { input: "\"# comment\\nactive=true\\n   \"", expectedOutput: "1", isHidden: false },
            { input: "\"\"", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Handles empty inputs, whitespace lines, and comment prefixes cleanly without leaking streams.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/essential/io/charstreams.html"
    },

    // ==========================================
    // NEW JAVA FUNDAMENTALS: CODING PRACTICE (8)
    // ==========================================
    {
        id: "java-fund-13",
        title: "Roman Numeral to Integer Conversion",
        skill: "Java Fundamentals",
        topic: "Strings & Switch",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Parse structured string symbols and handle subtraction rules (e.g. IV = 4, IX = 9).",
        prerequisites: ["switch statements", "String charAt"],
        description: "Given a roman numeral string `s`, convert it to an integer. Roman numerals are represented by symbols: I (1), V (5), X (10), L (50), C (100), D (500), M (1000).",
        examples: [
            { input: "s = \"LVIII\"", output: "58", explanation: "L = 50, V = 5, III = 3." },
            { input: "s = \"MCMXCIV\"", output: "1994", explanation: "M = 1000, CM = 900, XC = 90, IV = 4." }
        ],
        hints: [
            "Hint 1: If current value < next value, subtract current value (e.g. IV: 5 - 1 = 4).",
            "Hint 2: Otherwise, add current value."
        ],
        starterCode: `public class Solution {
    public static int romanToInt(String s) {
        // Write your solution here
        return 0;
    }
}`,
        testCases: [
            { input: "\"III\"", expectedOutput: "3", isHidden: false },
            { input: "\"IV\"", expectedOutput: "4", isHidden: false },
            { input: "\"MCMXCIV\"", expectedOutput: "1994", isHidden: true }
        ],
        rubricCriteria: "Handles single values, additions, and subtractions accurately in O(N) time.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/switch.html"
    },
    {
        id: "java-fund-14",
        title: "Matrix Transposition in Java",
        skill: "Java Fundamentals",
        topic: "2D Arrays",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Manipulate multi-dimensional arrays and swap rows with columns.",
        prerequisites: ["2D arrays", "Nested loops"],
        description: "Given a 2D integer array `matrix`, return the transpose of `matrix`. The transpose of a matrix is the matrix flipped over its main diagonal, switching the row and column indices.",
        examples: [
            { input: "[[1,2,3],[4,5,6]]", output: "[[1,4],[2,5],[3,6]]", explanation: "A 2x3 matrix transposes into a 3x2 matrix." }
        ],
        hints: [
            "Hint 1: Resulting matrix dimensions are `matrix[0].length` by `matrix.length`.",
            "Hint 2: Assign `transposed[j][i] = matrix[i][j]`."
        ],
        starterCode: `public class Solution {
    public static int[][] transpose(int[][] matrix) {
        // Write your solution here
        int rows = matrix.length;
        int cols = matrix[0].length;
        int[][] res = new int[cols][rows];
        return res;
    }
}`,
        testCases: [
            { input: "[[1,2],[3,4]]", expectedOutput: "[[1,3],[2,4]]", isHidden: false },
            { input: "[[1,2,3]]", expectedOutput: "[[1],[2],[3]]", isHidden: false },
            { input: "[[5]]", expectedOutput: "[[5]]", isHidden: true }
        ],
        rubricCriteria: "Allocates correct inverted dimensions and maps coordinates accurately.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/arrays.html"
    },
    {
        id: "java-fund-15",
        title: "Group Anagrams by Sorted Key",
        skill: "Java Fundamentals",
        topic: "Collections & Streams",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Use canonical sorted keys with HashMap to cluster related string arrays.",
        prerequisites: ["char[] sorting", "Map<String, List<String>>"],
        description: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order. An Anagram is a word formed by rearranging the letters of another word.",
        examples: [
            { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", explanation: "Words with identical character sets form identical sorted keys." }
        ],
        hints: [
            "Hint 1: Convert string to char array, sort it, and use new String(chars) as hash key.",
            "Hint 2: `map.computeIfAbsent(key, k -> new ArrayList<>()).add(str)`."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        Map<String, List<String>> map = new HashMap<>();
        return new ArrayList<>(map.values());
    }
}`,
        testCases: [
            { input: "[\"a\"]", expectedOutput: "[[\"a\"]]", isHidden: false },
            { input: "[\"eat\", \"tea\"]", expectedOutput: "Group size 1 containing 2 items", isHidden: false },
            { input: "[\"\"]", expectedOutput: "[[\"\"]]", isHidden: true }
        ],
        rubricCriteria: "Optimal grouping with O(N * K log K) time complexity.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/collections/interfaces/map.html"
    },
    {
        id: "java-fund-16",
        title: "Custom Comparator for Student Ranking",
        skill: "Java Fundamentals",
        topic: "Interfaces & Comparators",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Write multi-attribute sorting logic using Comparator chaining in Java.",
        prerequisites: ["Comparator<T>", "Comparable<T>"],
        description: "Sort a list of `Student` objects by grade descending (highest first). If grades are equal, sort by age ascending (youngest first). If age is also equal, sort by name alphabetically.",
        examples: [
            { input: "[Student('Alice', 90, 20), Student('Bob', 95, 21), Student('Charlie', 90, 19)]", output: "['Bob', 'Charlie', 'Alice']", explanation: "Bob has highest grade (95). Charlie and Alice tie at 90, but Charlie is younger (19 < 20)." }
        ],
        hints: [
            "Hint 1: Use `Comparator.comparingDouble(Student::getGrade).reversed().thenComparingInt(Student::getAge).thenComparing(Student::getName)`.",
            "Hint 2: Beware of null values if comparing strings."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static class Student {
        public String name; public double grade; public int age;
        public Student(String n, double g, int a) { name=n; grade=g; age=a; }
    }

    public static List<Student> rankStudents(List<Student> students) {
        // Write your solution here
        students.sort(Comparator.comparingDouble((Student s) -> s.grade).reversed()
            .thenComparingInt(s -> s.age)
            .thenComparing(s -> s.name));
        return students;
    }
}`,
        testCases: [
            { input: "2 students with different grades", expectedOutput: "Sorted descending", isHidden: false },
            { input: "Equal grades, different ages", expectedOutput: "Younger first", isHidden: false },
            { input: "Identical grade and age, different name", expectedOutput: "Alphabetical order", isHidden: true }
        ],
        rubricCriteria: "Strict compliance with 3-tier comparator contract.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/util/Comparator.html"
    },
    {
        id: "java-fund-17",
        title: "Producer-Consumer with BlockingQueue",
        skill: "Java Fundamentals",
        topic: "Concurrency & Synchronization",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Coordinate concurrent producer and consumer threads using ArrayBlockingQueue without deadlocks.",
        prerequisites: ["BlockingQueue", "InterruptedException"],
        description: "Implement a thread-safe message exchange `MessageBroker` with fixed buffer size. Producers put messages; consumers take messages. It must block when buffer is full/empty rather than throwing exceptions.",
        examples: [
            { input: "capacity = 2, produce 3 items concurrently", output: "Producer waits until consumer takes 1 item", explanation: "Bounded queue applies backpressure." }
        ],
        hints: [
            "Hint 1: Use `java.util.concurrent.ArrayBlockingQueue`.",
            "Hint 2: Call `queue.put(item)` (blocking) and `queue.take()` (blocking)."
        ],
        starterCode: `import java.util.concurrent.*;

public class MessageBroker {
    private final BlockingQueue<String> queue;

    public MessageBroker(int capacity) {
        this.queue = new ArrayBlockingQueue<>(capacity);
    }

    public void publish(String msg) throws InterruptedException {
        // Write your solution here
        queue.put(msg);
    }

    public String consume() throws InterruptedException {
        // Write your solution here
        return queue.take();
    }
}`,
        testCases: [
            { input: "Publish 1, Consume 1", expectedOutput: "Message matches", isHidden: false },
            { input: "Capacity 5, Publish 3", expectedOutput: "Queue size is 3", isHidden: false },
            { input: "Empty take with timeout", expectedOutput: "Handled properly", isHidden: true }
        ],
        rubricCriteria: "Non-busy waiting concurrency using Java concurrent utility collections.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/util/concurrent/BlockingQueue.html"
    },
    {
        id: "java-fund-18",
        title: "Custom Annotation Processor Simulation",
        skill: "Java Fundamentals",
        topic: "Reflection & Annotations",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Inspect runtime annotations on class methods using Java Reflection API.",
        prerequisites: ["Reflection API", "Custom @interface"],
        description: "Given an object instance, inspect all declared methods and find those marked with `@SecuredRole(\"ADMIN\")`. Return a list of method names authorized for admin execution.",
        examples: [
            { input: "Service with @SecuredRole('ADMIN') deleteUser() and public viewUser()", output: "['deleteUser']", explanation: "Only marked methods are extracted." }
        ],
        hints: [
            "Hint 1: Use `clazz.getDeclaredMethods()` to inspect all methods.",
            "Hint 2: Call `method.getAnnotation(SecuredRole.class)`."
        ],
        starterCode: `import java.lang.reflect.*;
import java.util.*;

public class Solution {
    public static List<String> findAdminMethods(Class<?> clazz) {
        List<String> list = new ArrayList<>();
        // Write your solution here: inspect methods
        return list;
    }
}`,
        testCases: [
            { input: "Class with 1 admin method", expectedOutput: "[\"deleteUser\"]", isHidden: false },
            { input: "Class with 0 annotations", expectedOutput: "[]", isHidden: false },
            { input: "Class with multiple annotated methods", expectedOutput: "Matches all admin methods", isHidden: true }
        ],
        rubricCriteria: "Reflection inspection checks annotation presence without modifying method visibility illegally.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/reflect/index.html"
    },
    {
        id: "java-fund-19",
        title: "Bitwise Single Number Finder",
        skill: "Java Fundamentals",
        topic: "Bit Manipulation",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Apply XOR bitwise properties (a ^ a = 0, a ^ 0 = a) to solve duplicate cancellation in O(N) time and O(1) space.",
        prerequisites: ["Bitwise XOR operator (^)", "Linear scan"],
        description: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.",
        examples: [
            { input: "nums = [2, 2, 1]", output: "1", explanation: "2 XOR 2 cancels out to 0; 0 XOR 1 = 1." },
            { input: "nums = [4, 1, 2, 1, 2]", output: "4", explanation: "Pairs cancel out leaving 4." }
        ],
        hints: [
            "Hint 1: Initialize accumulator `res = 0`.",
            "Hint 2: XOR every number in the array with `res`."
        ],
        starterCode: `public class Solution {
    public static int singleNumber(int[] nums) {
        int res = 0;
        // Write your solution here
        for (int num : nums) {
            res ^= num;
        }
        return res;
    }
}`,
        testCases: [
            { input: "[2, 2, 1]", expectedOutput: "1", isHidden: false },
            { input: "[4, 1, 2, 1, 2]", expectedOutput: "4", isHidden: false },
            { input: "[1]", expectedOutput: "1", isHidden: true }
        ],
        rubricCriteria: "O(N) time with O(1) auxiliary memory using bitwise XOR cancellation.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/nutsandbolts/op3.html"
    },
    {
        id: "java-fund-20",
        title: "Deep Copy of Nested Object Graph",
        skill: "Java Fundamentals",
        topic: "Cloning & Serialization",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Distinguish between shallow and deep copying; recursively clone nested objects.",
        prerequisites: ["Cloneable interface", "Constructor copying"],
        description: "Given an `AddressBook` object holding a `List<Contact>`, implement a copy constructor or clone method that produces a true deep copy such that editing a contact in the copy does not alter the original.",
        examples: [
            { input: "book1 has contact 'Sam'. Mutate book2's contact 'Sam' to 'Samuel'", output: "book1 contact name remains 'Sam'", explanation: "Nested objects are cloned into independent references." }
        ],
        hints: [
            "Hint 1: Do not simply pass the list reference: `new ArrayList<>(originalList)` only makes a shallow copy of contacts.",
            "Hint 2: Iterate and create `new Contact(c.getName(), c.getPhone())` for each item."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static class Contact {
        public String name;
        public Contact(String n) { this.name = n; }
        public Contact clone() { return new Contact(this.name); }
    }

    public static List<Contact> deepCopy(List<Contact> original) {
        List<Contact> copy = new ArrayList<>();
        // Write your solution here
        for (Contact c : original) {
            copy.add(c.clone());
        }
        return copy;
    }
}`,
        testCases: [
            { input: "List of 2 contacts", expectedOutput: "Independent copies created", isHidden: false },
            { input: "Empty list", expectedOutput: "Empty list", isHidden: false },
            { input: "Mutating cloned contact field", expectedOutput: "Original untouched", isHidden: true }
        ],
        rubricCriteria: "Ensures nested member references are not shared between original and copied container.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/lang/Cloneable.html"
    },

    // ==========================================
    // NEW OOP: MUST-SOLVE (5)
    // ==========================================
    {
        id: "oop-04",
        title: "Abstract Shape Hierarchy & Area Calculation",
        skill: "OOP",
        topic: "Inheritance & Abstraction",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Define abstract base classes with abstract and concrete methods, enforcing contract implementation in subclasses.",
        prerequisites: ["abstract keyword", "Inheritance (extends)"],
        description: "Create an abstract class `Shape` with abstract method `calculateArea()` and concrete method `getName()`. Implement concrete subclasses `Circle(radius)` and `Rectangle(width, height)`. Return total combined area for an array of shapes.",
        examples: [
            { input: "[Circle(radius=1.0), Rectangle(w=2, h=3)]", output: "~9.14", explanation: "PI * 1^2 (3.14159) + 2 * 3 (6) = 9.14159." }
        ],
        hints: [
            "Hint 1: Circle area = `Math.PI * radius * radius`.",
            "Hint 2: Iterate over `Shape[]` and sum `shape.calculateArea()` polymorphically."
        ],
        starterCode: `public class Solution {
    public static abstract class Shape {
        public abstract double calculateArea();
    }

    public static double totalArea(Shape[] shapes) {
        double sum = 0;
        // Write your solution here
        for (Shape s : shapes) {
            sum += s.calculateArea();
        }
        return sum;
    }
}`,
        testCases: [
            { input: "[Rectangle(2, 5)]", expectedOutput: "10.0", isHidden: false },
            { input: "[Circle(2)]", expectedOutput: "12.566", isHidden: false },
            { input: "Empty shapes array", expectedOutput: "0.0", isHidden: true }
        ],
        rubricCriteria: "Subclasses override abstract method properly; calculation polymorphic.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/IandI/abstract.html"
    },
    {
        id: "oop-05",
        title: "Vehicle Interface with Default Methods",
        skill: "OOP",
        topic: "Interfaces",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Utilize Java 8 interface default methods to provide backward-compatible behavior without breaking existing implementations.",
        prerequisites: ["interface syntax", "default keyword"],
        description: "Define a `Vehicle` interface with `int getMaxSpeed()` and a default method `boolean isHighwayLegal()` that returns `getMaxSpeed() >= 60`. Implement `Bicycle` (maxSpeed 25) and `Car` (maxSpeed 120).",
        examples: [
            { input: "Bicycle(maxSpeed=25)", output: "isHighwayLegal() = false", explanation: "25 < 60." },
            { input: "Car(maxSpeed=120)", output: "isHighwayLegal() = true", explanation: "120 >= 60." }
        ],
        hints: [
            "Hint 1: Declare `default boolean isHighwayLegal() { return getMaxSpeed() >= 60; }` inside the interface.",
            "Hint 2: Subclasses need only implement `getMaxSpeed()`."
        ],
        starterCode: `public class Solution {
    public interface Vehicle {
        int getMaxSpeed();
        // Write your solution here: default method
        default boolean isHighwayLegal() {
            return getMaxSpeed() >= 60;
        }
    }
}`,
        testCases: [
            { input: "Car with maxSpeed 80", expectedOutput: "true", isHidden: false },
            { input: "Scooter with maxSpeed 45", expectedOutput: "false", isHidden: false },
            { input: "Speed exactly 60", expectedOutput: "true", isHidden: true }
        ],
        rubricCriteria: "Default method correctly references abstract interface contract method.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/IandI/defaultmethods.html"
    },
    {
        id: "oop-06",
        title: "Thread-Safe Singleton with Double-Checked Locking",
        skill: "OOP",
        topic: "Design Patterns",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Master the double-checked locking idiom using volatile keyword to avoid instruction reordering.",
        prerequisites: ["volatile keyword", "synchronized block", "private constructor"],
        description: "Implement a thread-safe `DatabaseConnectionPool` singleton using lazy initialization and double-checked locking. Ensure the constructor is private and the instance variable is `volatile`.",
        examples: [
            { input: "DatabaseConnectionPool.getInstance() called from 20 threads simultaneously", output: "All threads receive the exact same object reference", explanation: "Double-checked locking synchronizes only on first creation." }
        ],
        hints: [
            "Hint 1: Check `instance == null` once outside synchronized block, and once again inside.",
            "Hint 2: Declare `private static volatile DatabaseConnectionPool instance;`."
        ],
        starterCode: `public class DatabaseConnectionPool {
    private static volatile DatabaseConnectionPool instance;

    private DatabaseConnectionPool() {}

    public static DatabaseConnectionPool getInstance() {
        // Write your solution here
        if (instance == null) {
            synchronized (DatabaseConnectionPool.class) {
                if (instance == null) {
                    instance = new DatabaseConnectionPool();
                }
            }
        }
        return instance;
    }
}`,
        testCases: [
            { input: "First call", expectedOutput: "Non-null instance", isHidden: false },
            { input: "Consecutive calls", expectedOutput: "Same reference identity (==)", isHidden: false },
            { input: "Concurrent invocations", expectedOutput: "Single object allocated", isHidden: true }
        ],
        rubricCriteria: "Strict double-checked locking pattern with volatile field modifier.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/essential/concurrency/locksync.html"
    },
    {
        id: "oop-07",
        title: "Notification Service with Factory Pattern",
        skill: "OOP",
        topic: "Design Patterns",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Decouple client code from concrete implementations using the Factory Method pattern.",
        prerequisites: ["Factory pattern", "Interface polymorphism"],
        description: "Implement `NotificationFactory.create(String channel)` that returns an instance of `Notification` ('EMAIL' -> `EmailNotification`, 'SMS' -> `SmsNotification`, 'PUSH' -> `PushNotification`). Throw `IllegalArgumentException` for unknown channels.",
        examples: [
            { input: "channel = \"EMAIL\"", output: "EmailNotification instance", explanation: "Instantiates email channel delivery mechanism." },
            { input: "channel = \"UNKNOWN\"", output: "IllegalArgumentException: Unknown channel UNKNOWN", explanation: "Invalid channel rejected." }
        ],
        hints: [
            "Hint 1: Use a switch on `channel.toUpperCase()`.",
            "Hint 2: Return concrete classes that implement the common `Notification` interface."
        ],
        starterCode: `public class NotificationFactory {
    public interface Notification {
        String send(String message);
    }

    public static Notification create(String channel) {
        // Write your solution here
        if (channel == null) throw new IllegalArgumentException("Channel required");
        switch (channel.toUpperCase()) {
            case "EMAIL": return msg -> "Email: " + msg;
            case "SMS": return msg -> "SMS: " + msg;
            case "PUSH": return msg -> "Push: " + msg;
            default: throw new IllegalArgumentException("Unknown channel: " + channel);
        }
    }
}`,
        testCases: [
            { input: "\"EMAIL\"", expectedOutput: "EmailNotification returned", isHidden: false },
            { input: "\"SMS\"", expectedOutput: "SmsNotification returned", isHidden: false },
            { input: "\"TELEPATHY\"", expectedOutput: "IllegalArgumentException thrown", isHidden: true }
        ],
        rubricCriteria: "Factory encapsulates instantiation; returns interface type; throws exception on invalid channel.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html"
    },
    {
        id: "oop-08",
        title: "Order Processing State Machine",
        skill: "OOP",
        topic: "State Pattern",
        difficulty: "Hard",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Model domain state transitions (CREATED -> PAID -> SHIPPED -> DELIVERED) without nested conditional statements.",
        prerequisites: ["State design pattern", "Enums / Polymorphic state objects"],
        description: "Implement an `Order` object whose `next()` and `prev()` methods advance and reverse order status along the lifecycle: CREATED -> PAID -> SHIPPED -> DELIVERED. Calling `next()` on DELIVERED should throw an `IllegalStateException`.",
        examples: [
            { input: "order created; next(); next();", output: "Status is SHIPPED", explanation: "CREATED -> PAID -> SHIPPED." },
            { input: "order on DELIVERED; next();", output: "IllegalStateException: Order is already delivered", explanation: "Cannot advance terminal state." }
        ],
        hints: [
            "Hint 1: Use an interface `OrderState` or enum with transition methods.",
            "Hint 2: Maintain internal state reference on the Order context."
        ],
        starterCode: `public class Order {
    public enum State { CREATED, PAID, SHIPPED, DELIVERED }
    private State state = State.CREATED;

    public State getState() { return state; }

    public void next() {
        // Write your solution here
        switch (state) {
            case CREATED: state = State.PAID; break;
            case PAID: state = State.SHIPPED; break;
            case SHIPPED: state = State.DELIVERED; break;
            case DELIVERED: throw new IllegalStateException("Already delivered");
        }
    }
}`,
        testCases: [
            { input: "New order", expectedOutput: "CREATED", isHidden: false },
            { input: "next() once", expectedOutput: "PAID", isHidden: false },
            { input: "next() 4 times", expectedOutput: "IllegalStateException", isHidden: true }
        ],
        rubricCriteria: "Enforces valid state machine transitions; forbids illegal state jumps.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/javaOO/enum.html"
    },

    // ==========================================
    // NEW OOP: CODING PRACTICE (4)
    // ==========================================
    {
        id: "oop-09",
        title: "Bank Account with Fine-Grained Encapsulation",
        skill: "OOP",
        topic: "Encapsulation",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Guard internal balance state against illegal negative values and unverified withdrawals.",
        prerequisites: ["private fields", "Validation in setters"],
        description: "Create a `BankAccount` class with private `balance`. Implement `deposit(double amount)` and `withdraw(double amount)`. Both must validate that amount > 0. `withdraw` must throw an `InsufficientFundsException` if amount exceeds balance.",
        examples: [
            { input: "balance = 100, withdraw(150)", output: "Throws InsufficientFundsException", explanation: "Cannot overdraw without credit allowance." },
            { input: "balance = 100, deposit(50)", output: "balance = 150", explanation: "Positive deposit succeeds." }
        ],
        hints: [
            "Hint 1: Never allow balance to be directly reassigned by callers.",
            "Hint 2: Throw IllegalArgumentException if amount <= 0."
        ],
        starterCode: `public class BankAccount {
    private double balance;

    public BankAccount(double initialBalance) {
        if (initialBalance < 0) throw new IllegalArgumentException("Initial balance cannot be negative");
        this.balance = initialBalance;
    }

    public double getBalance() { return balance; }

    public void deposit(double amount) {
        // Write your solution here
        if (amount <= 0) throw new IllegalArgumentException("Deposit amount must be positive");
        this.balance += amount;
    }

    public void withdraw(double amount) throws Exception {
        // Write your solution here
        if (amount <= 0) throw new IllegalArgumentException("Withdraw amount must be positive");
        if (amount > balance) throw new Exception("Insufficient funds");
        this.balance -= amount;
    }
}`,
        testCases: [
            { input: "Deposit 50 to 100", expectedOutput: "Balance 150.0", isHidden: false },
            { input: "Withdraw 40 from 100", expectedOutput: "Balance 60.0", isHidden: false },
            { input: "Negative deposit", expectedOutput: "IllegalArgumentException", isHidden: true }
        ],
        rubricCriteria: "Encapsulation prevents negative balance and validates deposit amounts.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html"
    },
    {
        id: "oop-10",
        title: "Discount Strategy Calculation",
        skill: "OOP",
        topic: "Strategy Pattern",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Swap pricing discount algorithms at runtime using strategy interfaces.",
        prerequisites: ["Interface contracts", "Polymorphism"],
        description: "Implement a `DiscountStrategy` interface with `applyDiscount(double price)`. Implement `PercentageDiscount(10%)` and `FlatDiscount($20 off for orders over $100)`. Ensure price never drops below 0.",
        examples: [
            { input: "price = 200, PercentageDiscount(15)", output: "170.0", explanation: "200 - 30 = 170.0." },
            { input: "price = 50, FlatDiscount(20 off > 100)", output: "50.0", explanation: "Order does not exceed $100 threshold so discount is 0." }
        ],
        hints: [
            "Hint 1: Apply `Math.max(0.0, discountedPrice)` to prevent negative prices.",
            "Hint 2: Clean strategy objects have no mutable state."
        ],
        starterCode: `public class Solution {
    public interface DiscountStrategy {
        double applyDiscount(double originalPrice);
    }

    public static double calculateFinalPrice(DiscountStrategy strategy, double price) {
        // Write your solution here
        return Math.max(0.0, strategy.applyDiscount(price));
    }
}`,
        testCases: [
            { input: "10% on 100.0", expectedOutput: "90.0", isHidden: false },
            { input: "Flat 20 on 150.0", expectedOutput: "130.0", isHidden: false },
            { input: "100% discount on 50.0", expectedOutput: "0.0", isHidden: true }
        ],
        rubricCriteria: "Strategies implement common interface; logic is decoupled from checkout engine.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html"
    },
    {
        id: "oop-11",
        title: "Builder Pattern for HTTP Request Config",
        skill: "OOP",
        topic: "Builder Pattern",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Construct complex objects step-by-step with fluent method chaining and validation.",
        prerequisites: ["Static inner classes", "Fluent interfaces"],
        description: "Create an immutable `HttpRequestConfig` with properties `url` (mandatory), `method` (defaults to 'GET'), `headers` (Map), and `timeoutMs` (defaults to 5000). Use the Builder pattern so callers configure options fluently and call `build()`.",
        examples: [
            { input: "new HttpRequestConfig.Builder(\"https://api.workforceiq.com\").method(\"POST\").timeout(3000).build()", output: "Configured HttpRequestConfig object", explanation: "Fluent setters configure object safely." }
        ],
        hints: [
            "Hint 1: Return `this` from builder modifier methods to enable chaining.",
            "Hint 2: Validate mandatory fields inside `build()` method."
        ],
        starterCode: `import java.util.*;

public class HttpRequestConfig {
    private final String url;
    private final String method;
    private final int timeoutMs;

    private HttpRequestConfig(Builder builder) {
        this.url = builder.url;
        this.method = builder.method;
        this.timeoutMs = builder.timeoutMs;
    }

    public String getUrl() { return url; }
    public String getMethod() { return method; }
    public int getTimeoutMs() { return timeoutMs; }

    public static class Builder {
        private final String url;
        private String method = "GET";
        private int timeoutMs = 5000;

        public Builder(String url) {
            if (url == null || url.trim().isEmpty()) throw new IllegalArgumentException("URL required");
            this.url = url;
        }

        public Builder method(String m) { this.method = m; return this; }
        public Builder timeout(int t) { this.timeoutMs = t; return this; }

        public HttpRequestConfig build() {
            // Write your solution here
            return new HttpRequestConfig(this);
        }
    }
}`,
        testCases: [
            { input: "Default builder with URL", expectedOutput: "GET, 5000ms", isHidden: false },
            { input: "Custom POST and 2000ms", expectedOutput: "POST, 2000ms", isHidden: false },
            { input: "Null URL in builder", expectedOutput: "IllegalArgumentException", isHidden: true }
        ],
        rubricCriteria: "Fluent chaining with defaults, immutable target class, validates mandatory fields in constructor.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html"
    },
    {
        id: "oop-12",
        title: "Event Bus with Observer Pattern",
        skill: "OOP",
        topic: "Observer Pattern",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Implement publisher-subscriber event distribution with dynamic subscriber registration and unregistration.",
        prerequisites: ["Observer pattern", "List<EventListener>"],
        description: "Implement a lightweight in-memory `EventBus` supporting `subscribe(eventType, listener)`, `unsubscribe(eventType, listener)`, and `publish(eventType, data)`. Ensure multiple subscribers to an event all receive notifications in registration order.",
        examples: [
            { input: "subscribe 'USER_SIGNUP' to Logger and Emailer; publish data", output: "Both Logger and Emailer execute callback", explanation: "All registered observers for that event type are triggered." }
        ],
        hints: [
            "Hint 1: Store subscribers in `Map<String, List<Consumer<Object>>>`.",
            "Hint 2: Call `forEach(listener -> listener.accept(data))` on publish."
        ],
        starterCode: `import java.util.*;
import java.util.function.Consumer;

public class EventBus {
    private final Map<String, List<Consumer<String>>> listeners = new HashMap<>();

    public void subscribe(String event, Consumer<String> listener) {
        listeners.computeIfAbsent(event, k -> new ArrayList<>()).add(listener);
    }

    public void publish(String event, String payload) {
        // Write your solution here
        List<Consumer<String>> list = listeners.get(event);
        if (list != null) {
            for (Consumer<String> l : list) {
                l.accept(payload);
            }
        }
    }
}`,
        testCases: [
            { input: "1 subscriber receives published payload", expectedOutput: "Payload received", isHidden: false },
            { input: "2 subscribers both receive payload", expectedOutput: "Both executed", isHidden: false },
            { input: "Publishing event with 0 subscribers", expectedOutput: "No errors thrown", isHidden: true }
        ],
        rubricCriteria: "Decouples event publishers from subscribers using Observer pattern.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html"
    }
];

if (typeof window !== "undefined") {
    window.JAVA_OOP_PROBLEMS = JAVA_OOP_PROBLEMS;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { JAVA_OOP_PROBLEMS };
}
