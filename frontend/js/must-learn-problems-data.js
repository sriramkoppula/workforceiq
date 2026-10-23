/**
 * WorkforceIQ - Must-Learn Problems Catalog
 * Structured by Skill, Topic, and Difficulty
 * Curated foundational and essential practical problems.
 */

const MUST_LEARN_PROBLEMS = [

    // =========================================================================
    // JAVA FUNDAMENTALS
    // =========================================================================
    {
        id: "java-fund-01",
        title: "Primitive Types & Memory Limits",
        skill: "Java Fundamentals",
        topic: "Variables and Data Types",
        difficulty: "Easy",
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
        priority: "High Priority",
        objective: "Understand checked vs unchecked exceptions and proper try-with-resources resource cleanup.",
        prerequisites: ["try-catch blocks", "AutoCloseable interface"],
        description: "Design a method `parseConfig(String line)` that extracts key-value pairs formatted as `key=value`. Throw a custom `InvalidConfigFormatException` (checked) if '=' is absent or either side is blank. Ensure any opened stream or scanner is safely closed using try-with-resources.",
        examples: [
            { input: "line = \"timeout=3000\"", output: "{key: 'timeout', value: '3000'}", explanation: "Valid configuration line." },
            { input: "line = \"invalid_line\"", output: "InvalidConfigFormatException: Missing delimiter '='", explanation: "No '=' sign detected." }
        ],
        hints: [
            "Hint 1: Use try-with-resources on AutoCloseable resources to guarantee cleanup even on errors.",
            "Hint 2: Distinguish between runtime programming bugs and expected bad user input."
        ],
        starterCode: `public class Solution {
    public static class ConfigPair {
        public String key, value;
        public ConfigPair(String k, String v) { this.key = k; this.value = v; }
    }

    public static ConfigPair parseConfig(String line) throws Exception {
        // Implement parsing and validation
        return null;
    }
}`,
        testCases: [
            { input: "\"port=8080\"", expectedOutput: "port: 8080", isHidden: false },
            { input: "\"bad_input\"", expectedOutput: "Exception thrown", isHidden: false },
            { input: "\"=emptyKey\"", expectedOutput: "Exception thrown", isHidden: true }
        ],
        rubricCriteria: "Proper custom exception type, clean try-with-resources, thorough validation of edge cases.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/essential/exceptions/"
    },

    // =========================================================================
    // OBJECT-ORIENTED PROGRAMMING (OOP)
    // =========================================================================
    {
        id: "oop-01",
        title: "Immutable Domain Object Pattern",
        skill: "OOP",
        topic: "Encapsulation",
        difficulty: "Easy",
        priority: "Must-Learn Core",
        objective: "Master deep immutability, defensive copying, and final class design in Java.",
        prerequisites: ["Classes & fields", "Encapsulation getters"],
        description: "Implement an immutable `UserProfile` class containing `username`, `email`, and a `List<String> roles`. Ensure that external mutation of the passed roles list does not modify the internal state of the `UserProfile` instance (defensive copying in constructor and getter).",
        examples: [
            { input: "List roles = [\"USER\"]; profile = new UserProfile(\"alice\", \"a@b.com\", roles); roles.add(\"ADMIN\");", output: "profile.getRoles() remains [\"USER\"]", explanation: "Defensive copying prevents outside tampering." }
        ],
        hints: [
            "Hint 1: Declare the class `final` and all fields `private final`.",
            "Hint 2: Return Collections.unmodifiableList(new ArrayList<>(roles)) in constructor and getter."
        ],
        starterCode: `import java.util.*;

public final class UserProfile {
    private final String username;
    private final String email;
    private final List<String> roles;

    public UserProfile(String username, String email, List<String> roles) {
        this.username = username;
        this.email = email;
        // Apply defensive copying
        this.roles = roles != null ? new ArrayList<>(roles) : new ArrayList<>();
    }

    public String getUsername() { return username; }
    public String getEmail() { return email; }
    public List<String> getRoles() {
        return Collections.unmodifiableList(roles);
    }
}`,
        testCases: [
            { input: "new UserProfile('dev', 'd@corp.com', ['ADMIN'])", expectedOutput: "Immutable instance", isHidden: false },
            { input: "Mutate external list after creation", expectedOutput: "Internal roles unchanged", isHidden: false },
            { input: "Attempt mutating getRoles() result directly", expectedOutput: "UnsupportedOperationException", isHidden: true }
        ],
        rubricCriteria: "True deep immutability with defensive copies and unmodifiable view returns.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/essential/concurrency/imstrat.html"
    },
    {
        id: "oop-02",
        title: "Payment Gateway Polymorphism & Strategy",
        skill: "OOP",
        topic: "Polymorphism",
        difficulty: "Medium",
        priority: "Must-Learn Core",
        objective: "Apply dynamic polymorphism and the Strategy design pattern for extensible payment processing.",
        prerequisites: ["Interfaces", "Method overriding (@Override)"],
        description: "Create an interface `PaymentProcessor` with method `boolean process(double amount)`. Implement `CreditCardProcessor` (validates 16 digits, 1.5% fee) and `UpiProcessor` (validates '@' in vpa, 0% fee). Build a `PaymentService` that delegates transaction execution dynamically without `instanceof` checks.",
        examples: [
            { input: "processor = new UpiProcessor(\"user@okhdfc\"); process(500.0);", output: "Success, charged 500.0", explanation: "UPI strategy executed polymorphically." },
            { input: "processor = new CreditCardProcessor(\"4111111111111111\"); process(100.0);", output: "Success, charged 101.5", explanation: "Credit card applies 1.5% processing fee." }
        ],
        hints: [
            "Hint 1: Use dependency injection where PaymentService takes the PaymentProcessor interface.",
            "Hint 2: Avoid switch statements on processor types — polymorphism handles this cleanly."
        ],
        starterCode: `public interface PaymentProcessor {
    boolean process(double amount);
    double getFee(double amount);
}

// Implement CreditCardProcessor and UpiProcessor
`,
        testCases: [
            { input: "UPI valid VPA payment of 200", expectedOutput: "true, fee 0.0", isHidden: false },
            { input: "Credit card valid 16-digit payment of 100", expectedOutput: "true, fee 1.5", isHidden: false },
            { input: "Invalid UPI VPA payment", expectedOutput: "false", isHidden: true }
        ],
        rubricCriteria: "Zero instanceof checks in PaymentService, clean interface contract, proper encapsulation.",
        sourceUrl: "https://docs.oracle.com/javase/tutorial/java/IandI/polymorphism.html"
    },
    {
        id: "oop-03",
        title: "LRU Cache using LinkedHashMap or Doubly Linked List",
        skill: "OOP",
        topic: "Classes and Objects",
        difficulty: "Hard",
        priority: "High Priority",
        objective: "Combine OOP design, hash table efficiency, and doubly-linked node eviction.",
        prerequisites: ["Hash maps", "Node-based structures", "OOP composition"],
        description: "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with `get(key)` and `put(key, value)` both running in average O(1) time complexity.",
        examples: [
            { input: "LRUCache cache = new LRUCache(2); cache.put(1, 1); cache.put(2, 2); cache.get(1); cache.put(3, 3); cache.get(2);", output: "[-1]", explanation: "Key 2 was evicted because key 1 was accessed, making 2 the least recently used." }
        ],
        hints: [
            "Hint 1: Use a HashMap<Integer, Node> paired with a doubly-linked list with dummy head and tail.",
            "Hint 2: When a node is accessed or added, detach it and move it to the head of the list."
        ],
        starterCode: `import java.util.*;

public class LRUCache {
    private final int capacity;

    public LRUCache(int capacity) {
        this.capacity = capacity;
    }

    public int get(int key) {
        return -1;
    }

    public void put(int key, int value) {
        // Implement O(1) eviction logic
    }
}`,
        testCases: [
            { input: "Cap 2: put(1,1), put(2,2), get(1)", expectedOutput: "1", isHidden: false },
            { input: "Followed by put(3,3), get(2)", expectedOutput: "-1", isHidden: false },
            { input: "Put update existing key updates value & freshness", expectedOutput: "Fresh value returned", isHidden: true }
        ],
        rubricCriteria: "Strict O(1) get and put, no full list scans, correct eviction of oldest entry upon reaching capacity.",
        sourceUrl: "https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU"
    },

    // =========================================================================
    // DATA STRUCTURES AND ALGORITHMS (DSA)
    // =========================================================================
    {
        id: "dsa-arr-01",
        title: "Two Sum - Target Pair Indices",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Easy",
        priority: "Must-Learn Core",
        objective: "Achieve optimal O(N) array search using Hash Table lookup instead of nested loops.",
        prerequisites: ["Array indexing", "HashMap get & put operations"],
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution and you cannot use the same element twice.",
        examples: [
            { input: "nums = [2, 7, 11, 15], target = 9", output: "[0, 1]", explanation: "nums[0] + nums[1] == 2 + 7 == 9." },
            { input: "nums = [3, 2, 4], target = 6", output: "[1, 2]", explanation: "nums[1] + nums[2] == 2 + 4 == 6." }
        ],
        hints: [
            "Hint 1: A brute-force two-loop solution is O(N^2). Can we trade space for time?",
            "Hint 2: While iterating through nums, check if `target - nums[i]` exists in your map. If so, you found the pair!"
        ],
        starterCode: `import java.util.HashMap;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        // Write your solution here
        return new int[]{};
    }
}`,
        testCases: [
            { input: "[2, 7, 11, 15], 9", expectedOutput: "[0, 1]", isHidden: false },
            { input: "[3, 2, 4], 6", expectedOutput: "[1, 2]", isHidden: false },
            { input: "[3, 3], 6", expectedOutput: "[0, 1]", isHidden: true },
            { input: "[-1, -2, -3, -4, -5], -8", expectedOutput: "[2, 4]", isHidden: true }
        ],
        rubricCriteria: "Time complexity O(N), Space complexity O(N), correct one-pass lookup.",
        sourceUrl: "https://en.wikipedia.org/wiki/Subset_sum_problem"
    },
    {
        id: "dsa-arr-02",
        title: "Maximum Subarray (Kadane's Algorithm)",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Medium",
        priority: "Must-Learn Core",
        objective: "Master dynamic programming subarray prefix decisions in linear O(N) time.",
        prerequisites: ["Arrays", "Greedy/DP basics"],
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum. Must run in O(N) time and O(1) space.",
        examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "Subarray [4,-1,2,1] has the largest sum = 6." },
            { input: "nums = [5,4,-1,7,8]", output: "23", explanation: "Entire array sum is 23." }
        ],
        hints: [
            "Hint 1: At index `i`, you have two choices: extend the previous running subarray sum (`currentMax + nums[i]`) or start fresh with `nums[i]`.",
            "Hint 2: Maintain globalMax across all visited indices."
        ],
        starterCode: `public class Solution {
    public static int maxSubArray(int[] nums) {
        int currentMax = nums[0];
        int globalMax = nums[0];
        // Implement Kadane's Algorithm
        return globalMax;
    }
}`,
        testCases: [
            { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", isHidden: false },
            { input: "[1]", expectedOutput: "1", isHidden: false },
            { input: "[-1, -2, -3]", expectedOutput: "-1", isHidden: true },
            { input: "[5,4,-1,7,8]", expectedOutput: "23", isHidden: true }
        ],
        rubricCriteria: "Correctly handles arrays with all negative numbers, executes in single pass O(N) time.",
        sourceUrl: "https://en.wikipedia.org/wiki/Maximum_subarray_problem"
    },
    {
        id: "dsa-ll-01",
        title: "Reverse a Singly Linked List",
        skill: "Data Structures",
        topic: "Linked lists",
        difficulty: "Easy",
        priority: "Must-Learn Core",
        objective: "Manipulate node pointers in place without auxiliary data structures.",
        prerequisites: ["Pointer manipulation", "ListNode structure"],
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list's head in O(N) time and O(1) space.",
        examples: [
            { input: "head = [1, 2, 3, 4, 5]", output: "[5, 4, 3, 2, 1]", explanation: "Every pointer is flipped to point backwards." },
            { input: "head = []", output: "[]", explanation: "Empty list returns null." }
        ],
        hints: [
            "Hint 1: Maintain three pointers: `prev` (starts null), `curr` (starts head), and `nextTemp`.",
            "Hint 2: Before updating `curr.next = prev`, preserve the next node in `nextTemp`."
        ],
        starterCode: `public class Solution {
    public static class ListNode {
        public int val;
        public ListNode next;
        public ListNode(int val) { this.val = val; }
    }

    public static ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        // Invert pointers iteratively
        return prev;
    }
}`,
        testCases: [
            { input: "1 -> 2 -> 3 -> null", expectedOutput: "3 -> 2 -> 1 -> null", isHidden: false },
            { input: "1 -> null", expectedOutput: "1 -> null", isHidden: false },
            { input: "null", expectedOutput: "null", isHidden: true }
        ],
        rubricCriteria: "Strict O(1) memory, no memory leak, handles 0 and 1 node edge cases.",
        sourceUrl: "https://en.wikipedia.org/wiki/Linked_list#Reversal"
    },
    {
        id: "dsa-stack-01",
        title: "Valid Parentheses & Bracket Matching",
        skill: "Data Structures",
        topic: "Stacks and queues",
        difficulty: "Easy",
        priority: "Must-Learn Core",
        objective: "Master LIFO stack discipline for nested syntax validation.",
        prerequisites: ["Stack push/pop", "Character comparison"],
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type in correct order.",
        examples: [
            { input: "s = \"()[]{}\"", output: "true", explanation: "All bracket pairs matched correctly." },
            { input: "s = \"(]\"", output: "false", explanation: "Mismatched bracket types." }
        ],
        hints: [
            "Hint 1: Push opening brackets onto the stack. When seeing a closing bracket, check if top matches.",
            "Hint 2: If the stack is empty when seeing a closing bracket, it is immediately invalid."
        ],
        starterCode: `import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        // Write your solution here
        return stack.isEmpty();
    }
}`,
        testCases: [
            { input: "\"()[]{}\"", expectedOutput: "true", isHidden: false },
            { input: "\"(]\"", expectedOutput: "false", isHidden: false },
            { input: "\"([)]\"", expectedOutput: "false", isHidden: true },
            { input: "\"{[]}\"", expectedOutput: "true", isHidden: true }
        ],
        rubricCriteria: "Time O(N), Space O(N), handles empty string, unmatched left or right brackets.",
        sourceUrl: "https://en.wikipedia.org/wiki/Bracket#Computer_programming"
    },
    {
        id: "dsa-tree-01",
        title: "Binary Tree Level Order Traversal (BFS)",
        skill: "Data Structures",
        topic: "Trees and binary search trees",
        difficulty: "Medium",
        priority: "Must-Learn Core",
        objective: "Understand Breadth-First Search using a Queue to group nodes level by level.",
        prerequisites: ["Binary tree definitions", "Queue FIFO operations"],
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level) as a list of lists.",
        examples: [
            { input: "root = [3, 9, 20, null, null, 15, 7]", output: "[[3], [9, 20], [15, 7]]", explanation: "Root on level 0, children on level 1, grandchildren on level 2." }
        ],
        hints: [
            "Hint 1: Use a Queue. At the start of processing each level, note `int levelSize = queue.size()`.",
            "Hint 2: Loop exactly `levelSize` times to dequeue all nodes of the current level before moving to children."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static class TreeNode {
        public int val;
        public TreeNode left, right;
        public TreeNode(int v) { this.val = v; }
    }

    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        // BFS with Queue
        return result;
    }
}`,
        testCases: [
            { input: "Tree with root 3, left 9, right 20", expectedOutput: "[[3], [9, 20]]", isHidden: false },
            { input: "Single root [1]", expectedOutput: "[[1]]", isHidden: false },
            { input: "Empty tree null", expectedOutput: "[]", isHidden: true }
        ],
        rubricCriteria: "Linear O(N) traversal visiting each node once, correct level boundaries.",
        sourceUrl: "https://en.wikipedia.org/wiki/Breadth-first_search"
    },
    {
        id: "dsa-dp-01",
        title: "Climbing Stairs (Fibonacci DP)",
        skill: "Data Structures",
        topic: "Dynamic programming",
        difficulty: "Easy",
        priority: "Must-Learn Core",
        objective: "Recognize overlapping subproblems and optimal substructure; reduce space from O(N) to O(1).",
        prerequisites: ["Recursion basics", "Memoization / DP concept"],
        description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        examples: [
            { input: "n = 2", output: "2", explanation: "1 step + 1 step, or 2 steps." },
            { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." }
        ],
        hints: [
            "Hint 1: To reach step `n`, you arrived from step `n-1` or `n-2`. So `ways(n) = ways(n-1) + ways(n-2)`.",
            "Hint 2: You only need two variables to track previous two steps instead of an entire array."
        ],
        starterCode: `public class Solution {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        // Space-optimized DP
        return prev1;
    }
}`,
        testCases: [
            { input: "2", expectedOutput: "2", isHidden: false },
            { input: "3", expectedOutput: "3", isHidden: false },
            { input: "5", expectedOutput: "8", isHidden: true },
            { input: "10", expectedOutput: "89", isHidden: true }
        ],
        rubricCriteria: "O(N) time and O(1) space, no recursive exponential time explosion.",
        sourceUrl: "https://en.wikipedia.org/wiki/Fibonacci_sequence"
    },

    // =========================================================================
    // SQL AND DBMS
    // =========================================================================
    {
        id: "sql-01",
        title: "Second Highest Salary Query",
        skill: "SQL",
        topic: "SELECT, WHERE, ORDER BY, and DISTINCT",
        difficulty: "Medium",
        priority: "Must-Learn Core",
        objective: "Handle NULL defaults, DISTINCT deduplication, and offset ranking in SQL.",
        prerequisites: ["SELECT DISTINCT", "ORDER BY DESC", "LIMIT OFFSET"],
        description: "Write an SQL query to find the second highest distinct salary from the `Employee` table. If there is no second highest salary, the query should report `NULL`.",
        examples: [
            { input: "Employee table: id, salary -> [(1, 100), (2, 200), (3, 300)]", output: "SecondHighestSalary: 200", explanation: "300 is highest, 200 is second highest." },
            { input: "Employee table with only 1 employee with salary 100", output: "SecondHighestSalary: NULL", explanation: "No second highest exists." }
        ],
        hints: [
            "Hint 1: Wrap the subquery with `SELECT (...) AS SecondHighestSalary` so that empty result sets safely return NULL.",
            "Hint 2: Use `SELECT DISTINCT salary FROM Employee ORDER BY salary DESC LIMIT 1 OFFSET 1`."
        ],
        starterCode: `-- Write your SQL query below
SELECT (
    SELECT DISTINCT salary 
    FROM Employee 
    ORDER BY salary DESC 
    LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`,
        testCases: [
            { input: "Salaries: [100, 200, 300]", expectedOutput: "200", isHidden: false },
            { input: "Salaries: [100]", expectedOutput: "null", isHidden: false },
            { input: "Salaries: [200, 200, 100]", expectedOutput: "100", isHidden: true }
        ],
        rubricCriteria: "Returns NULL properly when fewer than two distinct salaries exist.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/select.html"
    },
    {
        id: "sql-02",
        title: "Department Highest Salaries with JOIN & GROUP BY",
        skill: "SQL",
        topic: "Aggregate functions and GROUP BY",
        difficulty: "Medium",
        priority: "Must-Learn Core",
        objective: "Combine GROUP BY aggregate subqueries with table JOINs.",
        prerequisites: ["INNER JOIN", "GROUP BY", "MAX() aggregate"],
        description: "Write an SQL query to find employees who have the highest salary in each of the departments. Join `Employee` with `Department` to output `DepartmentName`, `EmployeeName`, and `Salary`.",
        examples: [
            { input: "Employee (IT: Max 90000, HR: Max 80000)", output: "IT | Max | 90000\nHR | Sam | 80000", explanation: "Selects each department's top earner." }
        ],
        hints: [
            "Hint 1: Find MAX(salary) grouped by departmentId in a subquery or CTE.",
            "Hint 2: Join the original Employee table on departmentId AND salary matching that max."
        ],
        starterCode: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
    SELECT departmentId, MAX(salary)
    FROM Employee
    GROUP BY departmentId
);`,
        testCases: [
            { input: "2 departments with 4 employees", expectedOutput: "2 highest records matched", isHidden: false },
            { input: "Tie for highest salary in department", expectedOutput: "Both tied employees returned", isHidden: true }
        ],
        rubricCriteria: "Accurately handles ties in top salary and joins department names correctly.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/group-by-functions.html"
    },
    {
        id: "sql-03",
        title: "Customers with No Orders (LEFT JOIN / NOT EXISTS)",
        skill: "SQL",
        topic: "JOINs",
        difficulty: "Easy",
        priority: "Must-Learn Core",
        objective: "Practice anti-join patterns using LEFT JOIN WHERE IS NULL or NOT EXISTS.",
        prerequisites: ["LEFT OUTER JOIN", "IS NULL predicate"],
        description: "Given tables `Customers` (id, name) and `Orders` (id, customerId), write an SQL query to report all customers who never placed any orders.",
        examples: [
            { input: "Customers: Joe, Henry, Sam. Orders: Sam ordered.", output: "Joe, Henry", explanation: "Joe and Henry have no matching records in Orders." }
        ],
        hints: [
            "Hint 1: `SELECT c.name AS Customers FROM Customers c LEFT JOIN Orders o ON c.id = o.customerId WHERE o.id IS NULL;`",
            "Hint 2: Alternatively, use `WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.customerId = c.id)`."
        ],
        starterCode: `SELECT c.name AS Customers
FROM Customers c
LEFT JOIN Orders o ON c.id = o.customerId
WHERE o.id IS NULL;`,
        testCases: [
            { input: "3 customers, 1 order", expectedOutput: "2 customers returned", isHidden: false },
            { input: "All customers ordered", expectedOutput: "Empty set", isHidden: true }
        ],
        rubricCriteria: "Optimal anti-join without inefficient NOT IN on nullable columns.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/join.html"
    },

    // =========================================================================
    // PYTHON
    // =========================================================================
    {
        id: "py-01",
        title: "Frequency Counter & Anagram Validator",
        skill: "Python",
        topic: "Control Flow & Functions",
        difficulty: "Easy",
        priority: "Must-Learn Core",
        objective: "Leverage Python dictionaries or `collections.Counter` for linear hash-based counting.",
        prerequisites: ["Python dict syntax", "String iteration"],
        description: "Given two strings `s` and `t`, return `True` if `t` is an anagram of `s`, and `False` otherwise. An anagram is formed by rearranging letters.",
        examples: [
            { input: "s = \"anagram\", t = \"nagaram\"", output: "True", explanation: "Same character frequencies." },
            { input: "s = \"rat\", t = \"car\"", output: "False", explanation: "Different character sets." }
        ],
        hints: [
            "Hint 1: If len(s) != len(t), return False immediately.",
            "Hint 2: Compare character frequencies using a dictionary or collections.Counter."
        ],
        starterCode: `from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    return Counter(s) == Counter(t)`,
        testCases: [
            { input: "'anagram', 'nagaram'", expectedOutput: "True", isHidden: false },
            { input: "'rat', 'car'", expectedOutput: "False", isHidden: false },
            { input: "'a', 'ab'", expectedOutput: "False", isHidden: true }
        ],
        rubricCriteria: "Time complexity O(N), handles unicode/case correctly according to spec.",
        sourceUrl: "https://docs.python.org/3/library/collections.html#collections.Counter"
    },
    {
        id: "py-02",
        title: "Log File Parsing & Aggregate Stats",
        skill: "Python",
        topic: "File Handling & Modules",
        difficulty: "Medium",
        priority: "High Priority",
        objective: "Use Python generators, regular expressions, and file streams for memory-efficient processing.",
        prerequisites: ["Context manager (with open)", "Regex re module"],
        description: "Write a generator function `parse_apache_logs(log_lines)` that extracts IP address, HTTP status code, and response time from log lines. Return a summary dictionary showing the count of status codes and average response time.",
        examples: [
            { input: "['127.0.0.1 200 45ms', '192.168.1.1 404 12ms', '127.0.0.1 200 55ms']", output: "{200: 2, 404: 1, 'avg_time': 37.33}", explanation: "Aggregates counts and response time." }
        ],
        hints: [
            "Hint 1: Use regex pattern matching to extract fields cleanly.",
            "Hint 2: Stream lines lazily rather than reading entire gigabyte logs into RAM."
        ],
        starterCode: `import re

def parse_logs(lines):
    # Process log lines and compute aggregate stats
    pass`,
        testCases: [
            { input: "3 sample log lines", expectedOutput: "Status counts and avg computed", isHidden: false },
            { input: "Malformed lines skipped gracefully", expectedOutput: "No crash, robust parsing", isHidden: true }
        ],
        rubricCriteria: "Memory efficient generator, robust error recovery for malformed lines.",
        sourceUrl: "https://docs.python.org/3/tutorial/inputoutput.html#reading-and-writing-files"
    },

    // =========================================================================
    // JAVASCRIPT
    // =========================================================================
    {
        id: "js-01",
        title: "Debounce Function Implementation",
        skill: "JavaScript",
        topic: "Functions, Arrow Functions & Closures",
        difficulty: "Medium",
        priority: "Must-Learn Core",
        objective: "Master JavaScript closures, `setTimeout`, `clearTimeout`, and preserving `this` context.",
        prerequisites: ["Higher-order functions", "Closures", "Timers"],
        description: "Create a `debounce(fn, delay)` utility that limits how often a function can fire. When invoked repeatedly, it should cancel previous pending executions and only run after `delay` milliseconds of silence.",
        examples: [
            { input: "Call debouncedSearch 5 times within 100ms with delay=300ms", output: "Function executed once, 300ms after last call.", explanation: "Intermediate calls are cancelled." }
        ],
        hints: [
            "Hint 1: Return a closure holding a `timer` identifier in scope.",
            "Hint 2: Call `clearTimeout(timer)` inside the returned function before setting a new timer with `fn.apply(this, args)`."
        ],
        starterCode: `function debounce(fn, delay) {
    let timerId = null;
    return function (...args) {
        if (timerId) clearTimeout(timerId);
        timerId = setTimeout(() => {
            fn.apply(this, args);
        }, delay);
    };
}`,
        testCases: [
            { input: "Single call after delay", expectedOutput: "Executed once with correct arguments", isHidden: false },
            { input: "Multiple bursts before delay", expectedOutput: "Executed once only", isHidden: false },
            { input: "Preserves 'this' context on method call", expectedOutput: "Valid context", isHidden: true }
        ],
        rubricCriteria: "Correct closure scoping, parameter forwarding with rest/spread, clearTimeout on rapid triggers.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/setTimeout"
    },
    {
        id: "js-02",
        title: "Deep Clone Object with Circular Reference Protection",
        skill: "JavaScript",
        topic: "Array Iteration & Functional Methods",
        difficulty: "Hard",
        priority: "High Priority",
        objective: "Understand reference vs value types, recursion, and WeakMap tracking.",
        prerequisites: ["Object inspection", "Recursion", "WeakMap"],
        description: "Implement a function `deepClone(obj)` that produces an independent deep copy of nested objects, arrays, Dates, and RegExps, while properly handling circular references using a `WeakMap` cache.",
        examples: [
            { input: "obj = { a: 1, b: { c: [2, 3] } }", output: "cloned != obj, cloned.b != obj.b, cloned.b.c != obj.b.c", explanation: "All levels cloned independently." }
        ],
        hints: [
            "Hint 1: Check for primitive types and null upfront (`typeof obj !== 'object' || obj === null`).",
            "Hint 2: Pass `hash = new WeakMap()` to track already cloned references and break circular loops."
        ],
        starterCode: `function deepClone(obj, hash = new WeakMap()) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (hash.has(obj)) return hash.get(obj);
    
    // Implement cloning for Array, Date, Object
    const copy = Array.isArray(obj) ? [] : {};
    hash.set(obj, copy);
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            copy[key] = deepClone(obj[key], hash);
        }
    }
    return copy;
}`,
        testCases: [
            { input: "{ x: 10, y: [1, 2] }", expectedOutput: "Deep clone verifies independent mutations", isHidden: false },
            { input: "Circular reference a.self = a", expectedOutput: "Handles cycle without call stack overflow", isHidden: true }
        ],
        rubricCriteria: "Handles circular cycles without crashing, deep clones nested properties.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone"
    },

    // =========================================================================
    // REACT
    // =========================================================================
    {
        id: "react-01",
        title: "Search Filter with Controlled Inputs & Debounce",
        skill: "React",
        topic: "React Hooks (useState & useEffect)",
        difficulty: "Medium",
        priority: "Must-Learn Core",
        objective: "Coordinate controlled form state, derived lists, and side-effect cleanup.",
        prerequisites: ["useState hook", "Controlled components", "Array.prototype.filter"],
        description: "Build a `SkillSearchBar` React component that takes a `skills` array prop and provides a search input. Filter the list in real time ignoring case, display matching items, and show a 'No skills match your query' message when the filter returns zero items.",
        examples: [
            { input: "skills = ['Java', 'JavaScript', 'SQL']; query = 'java'", output: "Displays 'Java' and 'JavaScript'", explanation: "Case-insensitive substring match." }
        ],
        hints: [
            "Hint 1: Keep `query` in useState. Derive `filteredSkills = skills.filter(...)` during render instead of keeping redundant state.",
            "Hint 2: Always provide a unique `key` prop when rendering list elements."
        ],
        starterCode: `import React, { useState } from 'react';

export function SkillSearchBar({ skills = [] }) {
    const [query, setQuery] = useState('');

    const filtered = skills.filter(s =>
        s.toLowerCase().includes(query.trim().toLowerCase())
    );

    return (
        <div>
            <input
                type="text"
                placeholder="Search skills..."
                value={query}
                onChange={e => setQuery(e.target.value)}
            />
            <ul>
                {filtered.map(skill => (
                    <li key={skill}>{skill}</li>
                ))}
            </ul>
            {filtered.length === 0 && <p>No skills match your query</p>}
        </div>
    );
}`,
        testCases: [
            { input: "Search 'java' on ['Java', 'SQL']", expectedOutput: "['Java'] rendered", isHidden: false },
            { input: "Empty query", expectedOutput: "All skills rendered", isHidden: false },
            { input: "Search 'python' when not present", expectedOutput: "'No skills match' message visible", isHidden: true }
        ],
        rubricCriteria: "Derived state calculated cleanly during render, unique keys on list items, clean controlled input.",
        sourceUrl: "https://react.dev/learn/sharing-state-between-components"
    },

    // =========================================================================
    // HTML & CSS
    // =========================================================================
    {
        id: "html-01",
        title: "Accessible Semantic Form with Validation",
        skill: "HTML",
        topic: "Forms, Form Controls & Input Validation",
        difficulty: "Easy",
        priority: "Must-Learn Core",
        objective: "Build accessible HTML5 forms using appropriate semantics, ARIA attributes, and client-side constraints.",
        prerequisites: ["HTML form elements", "Label for associations", "Input types"],
        description: "Create a semantic login form containing Email and Password fields, explicit `<label>` tags with matching `for` / `id` pairs, required validation, email type, and a submit button with an accessible name.",
        examples: [
            { input: "Form markup inspected", output: "<form>, <label for='email'>, <input type='email' id='email' required>", explanation: "Screen readers can associate label text with controls." }
        ],
        hints: [
            "Hint 1: Always connect `<label for='id'>` with the input's `id`.",
            "Hint 2: Use `type='email'` to enforce browser-native email validation rules."
        ],
        starterCode: `<form id="loginForm" novalidate>
    <div class="form-group">
        <label for="userEmail">Email Address</label>
        <input type="email" id="userEmail" name="email" required autocomplete="email" />
    </div>
    <div class="form-group">
        <label for="userPassword">Password</label>
        <input type="password" id="userPassword" name="password" required minlength="8" />
    </div>
    <button type="submit">Sign In</button>
</form>`,
        testCases: [
            { input: "Inspect label-for associations", expectedOutput: "All inputs labeled", isHidden: false },
            { input: "Inspect input types and required attributes", expectedOutput: "Valid constraints", isHidden: false }
        ],
        rubricCriteria: "100% accessible label associations, appropriate autocomplete and type attributes.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Learn/Forms/How_to_structure_a_web_form"
    },
    {
        id: "css-01",
        title: "Responsive Multi-Card Grid with CSS Grid & Flexbox",
        skill: "CSS",
        topic: "CSS Grid Systems",
        difficulty: "Medium",
        priority: "Must-Learn Core",
        objective: "Master auto-fit, minmax, and flexible card layouts without hardcoded breakpoints.",
        prerequisites: ["CSS Grid", "Flexbox alignment", "minmax() function"],
        description: "Write CSS for `.card-grid` to display child cards in a responsive grid that automatically wraps: columns must be at least `280px` wide and expand equally to fill available space (`grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`). Each card must have flexible internal layout with sticky bottom actions.",
        examples: [
            { input: "1200px viewport", output: "4 equal columns", explanation: "1200 / 280 ~ 4 columns." },
            { input: "360px mobile viewport", output: "1 full-width column", explanation: "Gracefully collapses to single column." }
        ],
        hints: [
            "Hint 1: Use `display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;`.",
            "Hint 2: On `.card`, use `display: flex; flex-direction: column; justify-content: space-between;`."
        ],
        starterCode: `.card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
}

.card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
    border-radius: 12px;
}`,
        testCases: [
            { input: "Wide desktop viewport check", expectedOutput: "Multi-column grid", isHidden: false },
            { input: "Narrow mobile viewport check", expectedOutput: "Single column without horizontal scroll", isHidden: false }
        ],
        rubricCriteria: "Zero horizontal overflow, fluid column wrapping, consistent spacing.",
        sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout"
    }
];

function matchesSkill(problemSkill, targetSkill) {
    if (!targetSkill) return true;
    const p = (problemSkill || '').toLowerCase();
    const t = (targetSkill || '').toLowerCase();
    if (p === t) return true;
    if ((t === 'frontend development' || t === 'frontend') && ['javascript', 'react', 'html', 'css', 'frontend development'].includes(p)) return true;
    if ((t === 'sql & dbms' || t === 'sql' || t === 'dbms') && ['sql', 'dbms', 'sql & dbms'].includes(p)) return true;
    if ((t === 'java & oop' || t === 'java') && ['java fundamentals', 'oop'].includes(p)) return true;
    if (p.includes(t) || t.includes(p)) return true;
    return false;
}

// Helper functions for easy querying and filtering
const MustLearnService = {
    getAllProblems() {
        return MUST_LEARN_PROBLEMS;
    },

    getTracks() {
        return ["Must-Solve", "Coding Practice"];
    },

    getSkills() {
        // Return standard prominent skills in curriculum order
        const standardOrder = [
            "Data Structures",
            "Java Fundamentals",
            "OOP",
            "SQL",
            "Python",
            "Frontend Development",
            "Backend Development"
        ];
        const allInCatalog = new Set(MUST_LEARN_PROBLEMS.map(p => p.skill));
        const result = [];
        standardOrder.forEach(s => {
            if (allInCatalog.has(s) || (s === "Frontend Development" && MUST_LEARN_PROBLEMS.some(p => matchesSkill(p.skill, s)))) {
                result.push(s);
            }
        });
        // Add any remaining skills
        allInCatalog.forEach(s => {
            if (!result.includes(s) && !["JavaScript", "React", "HTML", "CSS"].includes(s)) {
                result.push(s);
            }
        });
        return result;
    },

    getTopicsBySkill(skillName) {
        if (!skillName) return [];
        const topicsSet = new Set();
        MUST_LEARN_PROBLEMS
            .filter(p => matchesSkill(p.skill, skillName))
            .forEach(p => topicsSet.add(p.topic));
        return Array.from(topicsSet);
    },

    getProblemsBySkill(skillName) {
        if (!skillName) return MUST_LEARN_PROBLEMS;
        return MUST_LEARN_PROBLEMS.filter(p => matchesSkill(p.skill, skillName));
    },

    getProblemsBySkillAndTopic(skillName, topicName) {
        return MUST_LEARN_PROBLEMS.filter(p =>
            (!skillName || matchesSkill(p.skill, skillName)) &&
            (!topicName || p.topic.toLowerCase() === topicName.toLowerCase())
        );
    },

    getProblemById(problemId) {
        return MUST_LEARN_PROBLEMS.find(p => p.id === problemId) || null;
    }
};

// =====================================================
// MERGE EXTENDED CATALOG BATCHES (Batches 1-6)
// Batches: Java OOP, DSA, SQL DBMS, Python, Frontend Dev, Backend Dev
// Loaded BEFORE this file via script tags in HTML. Duplicate-safe merge.
// =====================================================
(function mergeCatalogBatches() {
    // Ensure all existing base problems have a defined track
    MUST_LEARN_PROBLEMS.forEach(p => {
        if (!p.track) {
            p.track = "Must-Solve";
        }
    });

    const existingIds = new Set(MUST_LEARN_PROBLEMS.map(p => p.id));

    function mergeArray(batch, label) {
        if (typeof batch === 'undefined' || !Array.isArray(batch)) return;
        let added = 0;
        batch.forEach(p => {
            if (p && p.id) {
                if (!existingIds.has(p.id)) {
                    if (!p.track) p.track = "Must-Solve";
                    MUST_LEARN_PROBLEMS.push(p);
                    existingIds.add(p.id);
                    added++;
                } else {
                    // Update any existing problem with batch metadata if missing
                    const existing = MUST_LEARN_PROBLEMS.find(item => item.id === p.id);
                    if (existing && !existing.track && p.track) {
                        existing.track = p.track;
                    }
                }
            }
        });
        if (typeof console !== 'undefined') {
            console.log('[MustLearnService] Merged catalog batch "' + label + '": ' + added + ' problems added, ' + (batch.length - added) + ' duplicates skipped.');
        }
    }

    const getGlobal = (name) => {
        if (typeof window !== 'undefined' && window[name]) return window[name];
        if (typeof global !== 'undefined' && global[name]) return global[name];
        return undefined;
    };

    mergeArray(getGlobal('JAVA_OOP_PROBLEMS'), 'Java OOP');
    mergeArray(getGlobal('DSA_PROBLEMS'), 'DSA');
    mergeArray(getGlobal('SQL_DBMS_PROBLEMS'), 'SQL & DBMS');
    mergeArray(getGlobal('PYTHON_PROBLEMS'), 'Python');
    mergeArray(getGlobal('FRONTEND_PROBLEMS'), 'Frontend Development');
    mergeArray(getGlobal('BACKEND_PROBLEMS'), 'Backend Development');

    if (typeof console !== 'undefined') {
        console.log('[MustLearnService] Total problems after merge: ' + MUST_LEARN_PROBLEMS.length);
    }
})();

// Export to window if in browser environment
if (typeof window !== "undefined") {
    window.MUST_LEARN_PROBLEMS = MUST_LEARN_PROBLEMS;
    window.MustLearnService = MustLearnService;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { MUST_LEARN_PROBLEMS, MustLearnService };
}

