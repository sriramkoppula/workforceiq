/**
 * WorkforceIQ Problem Catalog - Batch 2: Data Structures & Algorithms (DSA)
 * Contains 46 unique problems (6 existing preserved + 40 new)
 * Divided into Must-Solve and Coding Practice tracks.
 */

const DSA_PROBLEMS = [
    // ==========================================
    // EXISTING PROBLEMS (PRESERVED VERBATIM)
    // ==========================================
    {
        id: "dsa-arr-01",
        title: "Two Sum - Target Pair Indices",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Master hash map complement lookups for linear-time array searching.",
        prerequisites: ["Arrays", "HashMap lookup"],
        description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
            { input: "nums = [3,2,4], target = 6", output: "[1,2]", explanation: "nums[1] + nums[2] == 6." }
        ],
        hints: [
            "Hint 1: Can you use a HashMap to store values you have already seen along with their indices?",
            "Hint 2: For each number `x`, check if `target - x` is already in the map."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        // Write your solution here
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
        testCases: [
            { input: "[2,7,11,15], target = 9", expectedOutput: "[0, 1]", isHidden: false },
            { input: "[3,2,4], target = 6", expectedOutput: "[1, 2]", isHidden: false },
            { input: "[3,3], target = 6", expectedOutput: "[0, 1]", isHidden: true }
        ],
        rubricCriteria: "Solves in O(N) time using single-pass hash map complement technique.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/util/HashMap.html"
    },
    {
        id: "dsa-arr-02",
        title: "Maximum Subarray (Kadane's Algorithm)",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Understand dynamic decision making and contiguous subarray optimization.",
        prerequisites: ["Array traversal", "Prefix sum concepts"],
        description: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum. Must run in O(N) time.",
        examples: [
            { input: "nums = [-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
            { input: "nums = [1]", output: "1", explanation: "Single element array." }
        ],
        hints: [
            "Hint 1: At each index, decide whether to extend the current running subarray or start fresh from current element.",
            "Hint 2: Maintain `currentSum = Math.max(num, currentSum + num)` and update `maxSum`."
        ],
        starterCode: `public class Solution {
    public static int maxSubArray(int[] nums) {
        int maxSoFar = nums[0];
        int currentMax = nums[0];
        // Write your solution here
        for (int i = 1; i < nums.length; i++) {
            currentMax = Math.max(nums[i], currentMax + nums[i]);
            maxSoFar = Math.max(maxSoFar, currentMax);
        }
        return maxSoFar;
    }
}`,
        testCases: [
            { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6", isHidden: false },
            { input: "[1]", expectedOutput: "1", isHidden: false },
            { input: "[5,4,-1,7,8]", expectedOutput: "23", isHidden: true },
            { input: "[-5,-2,-3]", expectedOutput: "-2", isHidden: true }
        ],
        rubricCriteria: "Optimal Kadane's algorithm with O(N) time and O(1) space.",
        sourceUrl: "https://en.wikipedia.org/wiki/Maximum_subarray_problem"
    },
    {
        id: "dsa-ll-01",
        title: "Reverse a Singly Linked List",
        skill: "Data Structures",
        topic: "Linked lists",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Master pointer manipulation, reference swapping, and null pointer guards.",
        prerequisites: ["Linked list node structure", "Reference pointers"],
        description: "Given the head of a singly linked list, reverse the list, and return the reversed list head.",
        examples: [
            { input: "head = [1,2,3,4,5]", output: "[5,4,3,2,1]", explanation: "All next pointers reversed in place." },
            { input: "head = [1,2]", output: "[2,1]", explanation: "2 points to 1, 1 points to null." }
        ],
        hints: [
            "Hint 1: Maintain three pointers: `prev` (null), `curr` (head), and `nextTemp`.",
            "Hint 2: Before altering `curr.next`, save `nextTemp = curr.next`."
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
        // Write your solution here
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`,
        testCases: [
            { input: "[1,2,3,4,5]", expectedOutput: "[5,4,3,2,1]", isHidden: false },
            { input: "[]", expectedOutput: "null", isHidden: false },
            { input: "[1]", expectedOutput: "[1]", isHidden: true }
        ],
        rubricCriteria: "Iterative or recursive reversal in O(N) time and O(1) space without data cloning.",
        sourceUrl: "https://en.wikipedia.org/wiki/Linked_list"
    },
    {
        id: "dsa-stack-01",
        title: "Valid Parentheses & Bracket Matching",
        skill: "Data Structures",
        topic: "Stacks and queues",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Understand LIFO stack mechanics and matching delimiters.",
        prerequisites: ["Stack operations (push, pop, peek)", "Character inspection"],
        description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. Open brackets must be closed by the same type of brackets in the correct order.",
        examples: [
            { input: "s = \"()[]{}\"", output: "true", explanation: "All pairs match properly." },
            { input: "s = \"(]\"", output: "false", explanation: "Mismatched bracket types." }
        ],
        hints: [
            "Hint 1: Push opening brackets onto a Stack. When a closing bracket is seen, check if stack is empty or top doesn't match.",
            "Hint 2: At the end of the string, the stack must be completely empty."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        // Write your solution here
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else if (stack.isEmpty() || stack.pop() != c) return false;
        }
        return stack.isEmpty();
    }
}`,
        testCases: [
            { input: "\"()\"", expectedOutput: "true", isHidden: false },
            { input: "\"()[]{}\"", expectedOutput: "true", isHidden: false },
            { input: "\"(]\"", expectedOutput: "false", isHidden: false },
            { input: "\"([)]\"", expectedOutput: "false", isHidden: true }
        ],
        rubricCriteria: "Correctly verifies balanced brackets in O(N) time using Stack.",
        sourceUrl: "https://docs.oracle.com/javase/8/docs/api/java/util/ArrayDeque.html"
    },
    {
        id: "dsa-tree-01",
        title: "Binary Tree Level Order Traversal (BFS)",
        skill: "Data Structures",
        topic: "Trees and binary search trees",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Execute breadth-first search on a tree using a FIFO queue.",
        prerequisites: ["Binary tree definitions", "Queue interface"],
        description: "Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).",
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "[[3],[9,20],[15,7]]", explanation: "Level 1: [3], Level 2: [9,20], Level 3: [15,7]." }
        ],
        hints: [
            "Hint 1: Use a Queue initialized with root. In each iteration, record `int levelSize = queue.size()`.",
            "Hint 2: Loop `levelSize` times to dequeue and collect all nodes at the current level."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static class TreeNode {
        public int val; public TreeNode left, right;
        public TreeNode(int val) { this.val = val; }
    }

    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        // Write your solution here
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                currentLevel.add(node.val);
                if (node.left != null) queue.offer(node.left);
                if (node.right != null) queue.offer(node.right);
            }
            result.add(currentLevel);
        }
        return result;
    }
}`,
        testCases: [
            { input: "[3,9,20,null,null,15,7]", expectedOutput: "[[3],[9,20],[15,7]]", isHidden: false },
            { input: "[1]", expectedOutput: "[[1]]", isHidden: false },
            { input: "[]", expectedOutput: "[]", isHidden: true }
        ],
        rubricCriteria: "Accurate BFS level batching using Queue size boundary tracking.",
        sourceUrl: "https://en.wikipedia.org/wiki/Breadth-first_search"
    },
    {
        id: "dsa-dp-01",
        title: "Climbing Stairs (Fibonacci DP)",
        skill: "Data Structures",
        topic: "Dynamic programming",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Identify overlapping subproblems and optimal substructure; reduce space from O(N) to O(1).",
        prerequisites: ["Recursion basics", "Dynamic programming recurrence relations"],
        description: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
        examples: [
            { input: "n = 2", output: "2", explanation: "1 step + 1 step, or 2 steps." },
            { input: "n = 3", output: "3", explanation: "1+1+1, 1+2, or 2+1." }
        ],
        hints: [
            "Hint 1: To reach step `n`, you arrived either from step `n - 1` or step `n - 2`.",
            "Hint 2: Therefore, `ways(n) = ways(n - 1) + ways(n - 2)`, identical to Fibonacci numbers."
        ],
        starterCode: `public class Solution {
    public static int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        // Write your solution here
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
}`,
        testCases: [
            { input: "2", expectedOutput: "2", isHidden: false },
            { input: "3", expectedOutput: "3", isHidden: false },
            { input: "4", expectedOutput: "5", isHidden: true },
            { input: "5", expectedOutput: "8", isHidden: true }
        ],
        rubricCriteria: "Solves in O(N) time and O(1) space without exponential recursion.",
        sourceUrl: "https://en.wikipedia.org/wiki/Dynamic_programming"
    },

    // ==========================================
    // NEW DSA ARRAYS & STRINGS (8)
    // ==========================================
    {
        id: "dsa-arr-03",
        title: "Container With Most Water",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Apply two-pointer inward shrinkage to optimize area calculation in O(N) time.",
        prerequisites: ["Two-pointer pattern", "Math.min/max"],
        description: "Given integer array `height` of length `n`, find two lines that together with the x-axis form a container, such that the container contains the most water. Return maximum water area.",
        examples: [
            { input: "height = [1,8,6,2,5,4,8,3,7]", output: "49", explanation: "The max area is between index 1 (height 8) and index 8 (height 7): min(8, 7) * (8 - 1) = 7 * 7 = 49." }
        ],
        hints: [
            "Hint 1: Start with pointers at the extreme ends: `left = 0`, `right = n - 1`.",
            "Hint 2: Move the pointer pointing to the shorter vertical line inward."
        ],
        starterCode: `public class Solution {
    public static int maxArea(int[] height) {
        int max = 0;
        int left = 0, right = height.length - 1;
        // Write your solution here
        while (left < right) {
            int h = Math.min(height[left], height[right]);
            max = Math.max(max, h * (right - left));
            if (height[left] < height[right]) left++;
            else right--;
        }
        return max;
    }
}`,
        testCases: [
            { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49", isHidden: false },
            { input: "[1,1]", expectedOutput: "1", isHidden: false },
            { input: "[4,3,2,1,4]", expectedOutput: "16", isHidden: true }
        ],
        rubricCriteria: "O(N) time with O(1) space using two pointers.",
        sourceUrl: "https://en.wikipedia.org/wiki/Two-pointer_technique"
    },
    {
        id: "dsa-arr-04",
        title: "Longest Substring Without Repeating Characters",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Implement variable-length sliding window using index hash map.",
        prerequisites: ["Sliding window pattern", "Character index mapping"],
        description: "Given a string `s`, find the length of the longest substring without repeating characters.",
        examples: [
            { input: "s = \"abcabcbb\"", output: "3", explanation: "The answer is \"abc\", with the length of 3." },
            { input: "s = \"bbbbb\"", output: "1", explanation: "The answer is \"b\", length 1." }
        ],
        hints: [
            "Hint 1: Maintain a sliding window [left, right] and a Map of char -> lastSeenIndex.",
            "Hint 2: If char is already seen in current window, jump `left = Math.max(left, map.get(c) + 1)`."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int lengthOfLongestSubstring(String s) {
        int maxLen = 0, left = 0;
        Map<Character, Integer> lastSeen = new HashMap<>();
        // Write your solution here
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (lastSeen.containsKey(c)) {
                left = Math.max(left, lastSeen.get(c) + 1);
            }
            lastSeen.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
        testCases: [
            { input: "\"abcabcbb\"", expectedOutput: "3", isHidden: false },
            { input: "\"bbbbb\"", expectedOutput: "1", isHidden: false },
            { input: "\"pwwkew\"", expectedOutput: "3", isHidden: true },
            { input: "\"\"", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Solves in single-pass O(N) time using sliding window.",
        sourceUrl: "https://en.wikipedia.org/wiki/Sliding_window_protocol"
    },
    {
        id: "dsa-arr-05",
        title: "Merge Sorted Arrays in Place",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Merge two sorted arrays backwards into nums1 without auxiliary memory.",
        prerequisites: ["Array indexing", "Backwards pointer traversal"],
        description: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`. Merge `nums2` into `nums1` as one sorted array in-place.",
        examples: [
            { input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3", output: "[1,2,2,3,5,6]", explanation: "Merged in place." }
        ],
        hints: [
            "Hint 1: Start filling from the back (`p = m + n - 1`) to avoid overwriting elements in nums1.",
            "Hint 2: Compare `nums1[p1]` and `nums2[p2]` and place the larger element at `nums1[p]`."
        ],
        starterCode: `public class Solution {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        int p1 = m - 1, p2 = n - 1, p = m + n - 1;
        // Write your solution here
        while (p1 >= 0 && p2 >= 0) {
            if (nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];
            else nums1[p--] = nums2[p2--];
        }
        while (p2 >= 0) nums1[p--] = nums2[p2--];
    }
}`,
        testCases: [
            { input: "nums1=[1,2,3,0,0,0], m=3, nums2=[2,5,6], n=3", expectedOutput: "[1,2,2,3,5,6]", isHidden: false },
            { input: "nums1=[1], m=1, nums2=[], n=0", expectedOutput: "[1]", isHidden: false },
            { input: "nums1=[0], m=0, nums2=[1], n=1", expectedOutput: "[1]", isHidden: true }
        ],
        rubricCriteria: "Backward two-pointer merge with O(M+N) time and O(1) space.",
        sourceUrl: "https://en.wikipedia.org/wiki/Merge_algorithm"
    },
    {
        id: "dsa-arr-06",
        title: "Product of Array Except Self",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Compute prefix and suffix products in O(N) time without using the division operator.",
        prerequisites: ["Prefix product array", "Suffix accumulation"],
        description: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`. Must run in O(N) time without division.",
        examples: [
            { input: "nums = [1,2,3,4]", output: "[24,12,8,6]", explanation: "answer[0] = 2*3*4 = 24; answer[1] = 1*3*4 = 12." }
        ],
        hints: [
            "Hint 1: First pass fills `res[i]` with the product of all elements to the left of `i`.",
            "Hint 2: Second pass traverses right-to-left multiplying by running right suffix product."
        ],
        starterCode: `public class Solution {
    public static int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] res = new int[n];
        res[0] = 1;
        // Write your solution here
        for (int i = 1; i < n; i++) res[i] = res[i - 1] * nums[i - 1];
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            res[i] *= right;
            right *= nums[i];
        }
        return res;
    }
}`,
        testCases: [
            { input: "[1,2,3,4]", expectedOutput: "[24, 12, 8, 6]", isHidden: false },
            { input: "[-1,1,0,-3,3]", expectedOutput: "[0, 0, 9, 0, 0]", isHidden: false },
            { input: "[2,3]", expectedOutput: "[3, 2]", isHidden: true }
        ],
        rubricCriteria: "Strict O(N) time with O(1) extra space excluding the output array; zero division operations.",
        sourceUrl: "https://en.wikipedia.org/wiki/Prefix_sum"
    },
    {
        id: "dsa-arr-07",
        title: "Trapping Rain Water",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Compute water elevation barriers using two-pointer max tracking in O(N) time and O(1) space.",
        prerequisites: ["Two-pointer optimization", "Prefix/Suffix max bounds"],
        description: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
        examples: [
            { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6", explanation: "6 total units of rain water are trapped." }
        ],
        hints: [
            "Hint 1: Water trapped at `i` is determined by `min(maxLeft, maxRight) - height[i]`.",
            "Hint 2: Using two pointers `left` and `right`, move the pointer with the smaller max bound inward."
        ],
        starterCode: `public class Solution {
    public static int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0, water = 0;
        // Write your solution here
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) leftMax = height[left];
                else water += leftMax - height[left];
                left++;
            } else {
                if (height[right] >= rightMax) rightMax = height[right];
                else water += rightMax - height[right];
                right--;
            }
        }
        return water;
    }
}`,
        testCases: [
            { input: "[0,1,0,2,1,0,1,3,2,1,2,1]", expectedOutput: "6", isHidden: false },
            { input: "[4,2,0,3,2,5]", expectedOutput: "9", isHidden: false },
            { input: "[1,2,3]", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Solves in O(N) time and O(1) space using two pointers.",
        sourceUrl: "https://en.wikipedia.org/wiki/Two-pointer_technique"
    },
    {
        id: "dsa-arr-08",
        title: "Rotate Image 90 Degrees Clockwise",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Transpose matrix and reflect rows to rotate 2D grids in-place without allocating another matrix.",
        prerequisites: ["Matrix manipulation", "In-place swaps"],
        description: "You are given an `n x n` 2D matrix representing an image. Rotate the image by 90 degrees clockwise in-place.",
        examples: [
            { input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[[7,4,1],[8,5,2],[9,6,3]]", explanation: "Rows become columns." }
        ],
        hints: [
            "Hint 1: First transpose the matrix (`matrix[i][j] <-> matrix[j][i]`).",
            "Hint 2: Then reverse each row horizontally."
        ],
        starterCode: `public class Solution {
    public static void rotate(int[][] matrix) {
        int n = matrix.length;
        // Write your solution here: Transpose
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[j][i];
                matrix[j][i] = temp;
            }
        }
        // Reverse rows
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n / 2; j++) {
                int temp = matrix[i][j];
                matrix[i][j] = matrix[i][n - 1 - j];
                matrix[i][n - 1 - j] = temp;
            }
        }
    }
}`,
        testCases: [
            { input: "[[1,2],[3,4]]", expectedOutput: "[[3,1],[4,2]]", isHidden: false },
            { input: "[[1]]", expectedOutput: "[[1]]", isHidden: false },
            { input: "3x3 matrix", expectedOutput: "Rotated 90 degrees clockwise", isHidden: true }
        ],
        rubricCriteria: "In-place 90 degree clockwise rotation with O(1) extra space.",
        sourceUrl: "https://en.wikipedia.org/wiki/In-place_matrix_transposition"
    },
    {
        id: "dsa-arr-09",
        title: "Best Time to Buy and Sell Stock",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Track minimum historical price in single pass to calculate maximum profit.",
        prerequisites: ["Single pass scan", "Math.min/max"],
        description: "You are given an array `prices` where `prices[i]` is the price of a given stock on the `i-th` day. Choose a single day to buy and a different day in the future to sell. Return maximum profit.",
        examples: [
            { input: "prices = [7,1,5,3,6,4]", output: "5", explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5." },
            { input: "prices = [7,6,4,3,1]", output: "0", explanation: "No profitable transactions possible." }
        ],
        hints: [
            "Hint 1: Keep track of `minPrice` seen so far.",
            "Hint 2: For each price, compute `price - minPrice` and update `maxProfit`."
        ],
        starterCode: `public class Solution {
    public static int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        // Write your solution here
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else maxProfit = Math.max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }
}`,
        testCases: [
            { input: "[7,1,5,3,6,4]", expectedOutput: "5", isHidden: false },
            { input: "[7,6,4,3,1]", expectedOutput: "0", isHidden: false },
            { input: "[2,4,1]", expectedOutput: "2", isHidden: true }
        ],
        rubricCriteria: "Single pass O(N) time and O(1) space.",
        sourceUrl: "https://en.wikipedia.org/wiki/Maximum_subarray_problem"
    },
    {
        id: "dsa-arr-10",
        title: "3Sum - Unique Triplets Sum to Zero",
        skill: "Data Structures",
        topic: "Arrays and strings",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Sort array and apply two pointers with duplicate skipping to find unique triplets.",
        prerequisites: ["Sorting", "Two pointers", "Deduplication"],
        description: "Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`. The solution set must not contain duplicate triplets.",
        examples: [
            { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]", explanation: "Unique zero-sum triplets." }
        ],
        hints: [
            "Hint 1: Sort `nums` first. Loop through `i` and run two pointers `left = i + 1`, `right = n - 1`.",
            "Hint 2: Skip identical consecutive elements for `i`, `left`, and `right` to prevent duplicates."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static List<List<Integer>> threeSum(int[] nums) {
        List<List<Integer>> res = new ArrayList<>();
        Arrays.sort(nums);
        // Write your solution here
        for (int i = 0; i < nums.length - 2; i++) {
            if (i > 0 && nums[i] == nums[i - 1]) continue;
            int left = i + 1, right = nums.length - 1;
            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];
                if (sum == 0) {
                    res.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    while (left < right && nums[left] == nums[left + 1]) left++;
                    while (left < right && nums[right] == nums[right - 1]) right--;
                    left++; right--;
                } else if (sum < 0) left++;
                else right--;
            }
        }
        return res;
    }
}`,
        testCases: [
            { input: "[-1,0,1,2,-1,-4]", expectedOutput: "[[-1,-1,2],[-1,0,1]]", isHidden: false },
            { input: "[0,1,1]", expectedOutput: "[]", isHidden: false },
            { input: "[0,0,0]", expectedOutput: "[[0,0,0]]", isHidden: true }
        ],
        rubricCriteria: "O(N^2) time complexity with strict deduplication without storing all tuples in a hash set.",
        sourceUrl: "https://en.wikipedia.org/wiki/3SUM"
    },

    // ==========================================
    // NEW DSA LINKED LISTS (5)
    // ==========================================
    {
        id: "dsa-ll-02",
        title: "Detect Cycle in a Linked List",
        skill: "Data Structures",
        topic: "Linked lists",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Apply Floyd's Tortoise and Hare two-pointer cycle detection algorithm.",
        prerequisites: ["Fast and slow pointers", "Node reference equality"],
        description: "Given `head`, the head of a linked list, determine if the linked list has a cycle in it. Return `true` if there is some node in the list that can be reached again by continuously following the `next` pointer.",
        examples: [
            { input: "head = [3,2,0,-4], pos = 1 (cycle back to node 2)", output: "true", explanation: "Fast and slow pointers will eventually meet." }
        ],
        hints: [
            "Hint 1: Advance `slow` by 1 step and `fast` by 2 steps.",
            "Hint 2: If `fast` meets `slow`, a cycle exists. If `fast` or `fast.next` hits null, no cycle."
        ],
        starterCode: `public class Solution {
    public static class ListNode {
        public int val; public ListNode next;
        public ListNode(int x) { val = x; next = null; }
    }

    public static boolean hasCycle(ListNode head) {
        if (head == null || head.next == null) return false;
        ListNode slow = head, fast = head;
        // Write your solution here
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) return true;
        }
        return false;
    }
}`,
        testCases: [
            { input: "List with cycle back to node 1", expectedOutput: "true", isHidden: false },
            { input: "List [1, 2] with no cycle", expectedOutput: "false", isHidden: false },
            { input: "Single node without cycle", expectedOutput: "false", isHidden: true }
        ],
        rubricCriteria: "Floyd's algorithm running in O(N) time and O(1) memory.",
        sourceUrl: "https://en.wikipedia.org/wiki/Cycle_detection"
    },
    {
        id: "dsa-ll-03",
        title: "Merge Two Sorted Linked Lists",
        skill: "Data Structures",
        topic: "Linked lists",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Use a dummy head sentinel node to cleanly splice two sorted linked lists.",
        prerequisites: ["Dummy head pattern", "Pointer reconnection"],
        description: "You are given the heads of two sorted linked lists `list1` and `list2`. Merge the two lists into one sorted list by splicing together the nodes of the first two lists.",
        examples: [
            { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "Merged in sorted order." }
        ],
        hints: [
            "Hint 1: Create a `dummyHead = new ListNode(0)` and `tail = dummyHead`.",
            "Hint 2: Compare `list1.val` and `list2.val`, attach the smaller node to `tail.next`, advance that list and tail."
        ],
        starterCode: `public class Solution {
    public static class ListNode {
        public int val; public ListNode next;
        public ListNode(int val) { this.val = val; }
    }

    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        // Write your solution here
        while (list1 != null && list2 != null) {
            if (list1.val <= list2.val) { tail.next = list1; list1 = list1.next; }
            else { tail.next = list2; list2 = list2.next; }
            tail = tail.next;
        }
        tail.next = (list1 != null) ? list1 : list2;
        return dummy.next;
    }
}`,
        testCases: [
            { input: "[1,2,4], [1,3,4]", expectedOutput: "[1,1,2,3,4,4]", isHidden: false },
            { input: "[], []", expectedOutput: "null", isHidden: false },
            { input: "[], [0]", expectedOutput: "[0]", isHidden: true }
        ],
        rubricCriteria: "Sentinel node pattern merging in O(N+M) time and O(1) space.",
        sourceUrl: "https://en.wikipedia.org/wiki/Linked_list"
    },
    {
        id: "dsa-ll-04",
        title: "Remove Nth Node From End of List",
        skill: "Data Structures",
        topic: "Linked lists",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Maintain a constant distance gap between two pointers to remove the target node in a single pass.",
        prerequisites: ["Two pointers with fixed offset", "Sentinel node"],
        description: "Given the `head` of a linked list, remove the `n-th` node from the end of the list and return its head in one single pass.",
        examples: [
            { input: "head = [1,2,3,4,5], n = 2", output: "[1,2,3,5]", explanation: "Node 4 (second from the end) is removed." }
        ],
        hints: [
            "Hint 1: Advance `first` pointer `n + 1` steps ahead from a dummy head node.",
            "Hint 2: Move both `first` and `second` until `first` hits null; then `second.next = second.next.next`."
        ],
        starterCode: `public class Solution {
    public static class ListNode {
        public int val; public ListNode next;
        public ListNode(int val) { this.val = val; }
    }

    public static ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode first = dummy, second = dummy;
        // Write your solution here
        for (int i = 0; i <= n; i++) first = first.next;
        while (first != null) {
            first = first.next;
            second = second.next;
        }
        second.next = second.next.next;
        return dummy.next;
    }
}`,
        testCases: [
            { input: "[1,2,3,4,5], n = 2", expectedOutput: "[1,2,3,5]", isHidden: false },
            { input: "[1], n = 1", expectedOutput: "null", isHidden: false },
            { input: "[1,2], n = 1", expectedOutput: "[1]", isHidden: true }
        ],
        rubricCriteria: "One-pass O(N) solution using two pointers with fixed offset.",
        sourceUrl: "https://en.wikipedia.org/wiki/Linked_list"
    },
    {
        id: "dsa-ll-05",
        title: "Reorder List Interleaving First and Last",
        skill: "Data Structures",
        topic: "Linked lists",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Combine middle finding, in-place list reversal, and alternate merging.",
        prerequisites: ["Middle finding", "List reversal", "List merging"],
        description: "You are given the head of a singly linked-list: L0 -> L1 -> … -> Ln - 1 -> Ln. Reorder it to: L0 -> Ln -> L1 -> Ln - 1 -> L2 -> Ln - 2 -> … in-place.",
        examples: [
            { input: "head = [1,2,3,4]", output: "[1,4,2,3]", explanation: "First and last alternating." }
        ],
        hints: [
            "Hint 1: Find the middle node using slow and fast pointers.",
            "Hint 2: Reverse the second half of the linked list.",
            "Hint 3: Merge the two halves alternately."
        ],
        starterCode: `public class Solution {
    public static class ListNode {
        public int val; public ListNode next;
        public ListNode(int val) { this.val = val; }
    }

    public static void reorderList(ListNode head) {
        if (head == null || head.next == null) return;
        // Write your solution here
        ListNode slow = head, fast = head;
        while (fast != null && fast.next != null) { slow = slow.next; fast = fast.next.next; }
        ListNode prev = null, curr = slow.next;
        slow.next = null;
        while (curr != null) {
            ListNode next = curr.next; curr.next = prev; prev = curr; curr = next;
        }
        ListNode p1 = head, p2 = prev;
        while (p2 != null) {
            ListNode t1 = p1.next, t2 = p2.next;
            p1.next = p2; p2.next = t1; p1 = t1; p2 = t2;
        }
    }
}`,
        testCases: [
            { input: "[1,2,3,4]", expectedOutput: "[1,4,2,3]", isHidden: false },
            { input: "[1,2,3,4,5]", expectedOutput: "[1,5,2,4,3]", isHidden: false },
            { input: "[1]", expectedOutput: "[1]", isHidden: true }
        ],
        rubricCriteria: "In-place reordering in O(N) time and O(1) space.",
        sourceUrl: "https://en.wikipedia.org/wiki/Linked_list"
    },
    {
        id: "dsa-ll-06",
        title: "Merge K Sorted Linked Lists",
        skill: "Data Structures",
        topic: "Linked lists",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Coordinate multiple sorted streams using a Min-Heap PriorityQueue in O(N log K) time.",
        prerequisites: ["PriorityQueue with custom Comparator", "Divide and conquer"],
        description: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        examples: [
            { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]", explanation: "Merged all 3 lists into one sorted stream." }
        ],
        hints: [
            "Hint 1: Insert the head node of each list into a `PriorityQueue` comparing `node.val`.",
            "Hint 2: Poll the smallest node, attach to result, and if `node.next != null`, insert `node.next`."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static class ListNode {
        public int val; public ListNode next;
        public ListNode(int val) { this.val = val; }
    }

    public static ListNode mergeKLists(ListNode[] lists) {
        if (lists == null || lists.length == 0) return null;
        PriorityQueue<ListNode> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a.val));
        // Write your solution here
        for (ListNode node : lists) {
            if (node != null) pq.offer(node);
        }
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (!pq.isEmpty()) {
            ListNode smallest = pq.poll();
            tail.next = smallest;
            tail = tail.next;
            if (smallest.next != null) pq.offer(smallest.next);
        }
        return dummy.next;
    }
}`,
        testCases: [
            { input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]", isHidden: false },
            { input: "[]", expectedOutput: "null", isHidden: false },
            { input: "[[]]", expectedOutput: "null", isHidden: true }
        ],
        rubricCriteria: "Solves in O(N log K) time using Min-Heap.",
        sourceUrl: "https://en.wikipedia.org/wiki/K-way_merge_algorithm"
    },

    // ==========================================
    // NEW DSA STACKS & QUEUES (5)
    // ==========================================
    {
        id: "dsa-stack-02",
        title: "Min Stack with O(1) Minimum Retrieval",
        skill: "Data Structures",
        topic: "Stacks and queues",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant O(1) time.",
        prerequisites: ["Auxiliary stack", "Stack invariants"],
        description: "Design a stack class `MinStack` supporting `push(val)`, `pop()`, `top()`, and `getMin()`. Each operation must run in O(1) time complexity.",
        examples: [
            { input: "push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()", output: "getMin()=-3, top()=0, getMin()=-2", explanation: "Maintains current minimum at every stack depth." }
        ],
        hints: [
            "Hint 1: Use an auxiliary stack `minStack` that records the minimum value seen at or below each level.",
            "Hint 2: When pushing `x`, push `Math.min(x, minStack.peek())` to the auxiliary stack."
        ],
        starterCode: `import java.util.*;

public class MinStack {
    private Deque<Integer> stack = new ArrayDeque<>();
    private Deque<Integer> minStack = new ArrayDeque<>();

    public void push(int val) {
        stack.push(val);
        // Write your solution here
        if (minStack.isEmpty() || val <= minStack.peek()) minStack.push(val);
        else minStack.push(minStack.peek());
    }

    public void pop() {
        stack.pop();
        minStack.pop();
    }

    public int top() { return stack.peek(); }
    public int getMin() { return minStack.peek(); }
}`,
        testCases: [
            { input: "push(-2), push(0), push(-3), getMin()", expectedOutput: "-3", isHidden: false },
            { input: "pop() after, getMin()", expectedOutput: "-2", isHidden: false },
            { input: "push(5), push(5), getMin()", expectedOutput: "5", isHidden: true }
        ],
        rubricCriteria: "All 4 operations run in strict O(1) time.",
        sourceUrl: "https://en.wikipedia.org/wiki/Stack_(abstract_data_type)"
    },
    {
        id: "dsa-stack-03",
        title: "Evaluate Reverse Polish Notation",
        skill: "Data Structures",
        topic: "Stacks and queues",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Parse postfix arithmetic expressions using operand stack evaluation.",
        prerequisites: ["Postfix notation", "Integer parsing"],
        description: "Evaluate the value of an arithmetic expression in Reverse Polish Notation (RPN). Valid operators are '+', '-', '*', and '/'. Each operand may be an integer or another expression.",
        examples: [
            { input: "tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]", output: "9", explanation: "((2 + 1) * 3) = 9." },
            { input: "tokens = [\"4\",\"13\",\"5\",\"/\",\"+\"]", output: "6", explanation: "(4 + (13 / 5)) = 6." }
        ],
        hints: [
            "Hint 1: Traverse tokens. If token is number, push to stack.",
            "Hint 2: If operator, pop two operands `b` then `a`, compute `a op b`, and push result."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        // Write your solution here
        for (String t : tokens) {
            if (t.equals("+")) stack.push(stack.pop() + stack.pop());
            else if (t.equals("-")) { int b = stack.pop(), a = stack.pop(); stack.push(a - b); }
            else if (t.equals("*")) stack.push(stack.pop() * stack.pop());
            else if (t.equals("/")) { int b = stack.pop(), a = stack.pop(); stack.push(a / b); }
            else stack.push(Integer.parseInt(t));
        }
        return stack.pop();
    }
}`,
        testCases: [
            { input: "[\"2\",\"1\",\"+\",\"3\",\"*\"]", expectedOutput: "9", isHidden: false },
            { input: "[\"4\",\"13\",\"5\",\"/\",\"+\"]", expectedOutput: "6", isHidden: false },
            { input: "[\"10\"]", expectedOutput: "10", isHidden: true }
        ],
        rubricCriteria: "O(N) time with integer operand stack; handles division and negative numbers correctly.",
        sourceUrl: "https://en.wikipedia.org/wiki/Reverse_Polish_notation"
    },
    {
        id: "dsa-stack-04",
        title: "Implement Queue using Two Stacks",
        skill: "Data Structures",
        topic: "Stacks and queues",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Simulate FIFO queue order using two LIFO stacks with amortized O(1) transfer.",
        prerequisites: ["Amortized analysis", "Dual stack mechanics"],
        description: "Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support `push`, `peek`, `pop`, and `empty`.",
        examples: [
            { input: "push(1), push(2), peek(), pop(), empty()", output: "peek()=1, pop()=1, empty()=false", explanation: "FIFO behavior preserved." }
        ],
        hints: [
            "Hint 1: Use `inStack` for pushes and `outStack` for pops.",
            "Hint 2: If `outStack` is empty when popping/peeking, transfer all elements from `inStack` to `outStack`."
        ],
        starterCode: `import java.util.*;

public class MyQueue {
    private Deque<Integer> in = new ArrayDeque<>();
    private Deque<Integer> out = new ArrayDeque<>();

    public void push(int x) { in.push(x); }

    public int pop() {
        peek();
        return out.pop();
    }

    public int peek() {
        // Write your solution here
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.peek();
    }

    public boolean empty() { return in.isEmpty() && out.isEmpty(); }
}`,
        testCases: [
            { input: "push(1), push(2), pop()", expectedOutput: "1", isHidden: false },
            { input: "peek() after", expectedOutput: "2", isHidden: false },
            { input: "empty() on new queue", expectedOutput: "true", isHidden: true }
        ],
        rubricCriteria: "Amortized O(1) time per operation using lazy transfer.",
        sourceUrl: "https://en.wikipedia.org/wiki/Queue_(abstract_data_type)"
    },
    {
        id: "dsa-stack-05",
        title: "Daily Temperatures & Monotonic Stack",
        skill: "Data Structures",
        topic: "Stacks and queues",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Use a decreasing monotonic stack to find the next greater element in O(N) time.",
        prerequisites: ["Monotonic stack pattern", "Next greater element"],
        description: "Given an array of integers `temperatures` representing the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature.",
        examples: [
            { input: "temperatures = [73,74,75,71,69,72,76,73]", output: "[1,1,4,2,1,1,0,0]", explanation: "From day 0 (73), day 1 (74) is warmer (1 day wait)." }
        ],
        hints: [
            "Hint 1: Store indices in a monotonic stack where temperatures are in decreasing order.",
            "Hint 2: When current temperature is higher than `temperatures[stack.peek()]`, pop and record `diff = i - prevIndex`."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int[] dailyTemperatures(int[] temperatures) {
        int n = temperatures.length;
        int[] ans = new int[n];
        Deque<Integer> stack = new ArrayDeque<>();
        // Write your solution here
        for (int i = 0; i < n; i++) {
            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {
                int prev = stack.pop();
                ans[prev] = i - prev;
            }
            stack.push(i);
        }
        return ans;
    }
}`,
        testCases: [
            { input: "[73,74,75,71,69,72,76,73]", expectedOutput: "[1, 1, 4, 2, 1, 1, 0, 0]", isHidden: false },
            { input: "[30,40,50,60]", expectedOutput: "[1, 1, 1, 0]", isHidden: false },
            { input: "[30,60,90]", expectedOutput: "[1, 1, 0]", isHidden: true }
        ],
        rubricCriteria: "Solves in O(N) time using monotonic stack.",
        sourceUrl: "https://en.wikipedia.org/wiki/Monotone_priority_queue"
    },
    {
        id: "dsa-stack-06",
        title: "Sliding Window Maximum",
        skill: "Data Structures",
        topic: "Stacks and queues",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Maintain max elements in rolling windows of size k in O(N) time using monotonic Deque.",
        prerequisites: ["Double-ended queue (Deque)", "Monotonic queue"],
        description: "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. Return the max sliding window.",
        examples: [
            { input: "nums = [1,3,-1,-3,5,3,6,7], k = 3", output: "[3,3,5,5,6,7]", explanation: "Each window of size 3 yields its maximum value." }
        ],
        hints: [
            "Hint 1: Maintain a Deque of indices such that elements at those indices are in decreasing order.",
            "Hint 2: Remove indices that fall outside the window (`deque.peekFirst() < i - k + 1`).",
            "Hint 3: Pop elements from back that are smaller than `nums[i]` before inserting."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int[] maxSlidingWindow(int[] nums, int k) {
        int n = nums.length;
        int[] res = new int[n - k + 1];
        Deque<Integer> dq = new ArrayDeque<>();
        // Write your solution here
        for (int i = 0; i < n; i++) {
            while (!dq.isEmpty() && dq.peekFirst() < i - k + 1) dq.pollFirst();
            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();
            dq.offerLast(i);
            if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];
        }
        return res;
    }
}`,
        testCases: [
            { input: "[1,3,-1,-3,5,3,6,7], k = 3", expectedOutput: "[3, 3, 5, 5, 6, 7]", isHidden: false },
            { input: "[1], k = 1", expectedOutput: "[1]", isHidden: false },
            { input: "[1,-1], k = 1", expectedOutput: "[1, -1]", isHidden: true }
        ],
        rubricCriteria: "Strict O(N) time complexity using monotonic Deque without heap overhead.",
        sourceUrl: "https://en.wikipedia.org/wiki/Monotone_priority_queue"
    },

    // ==========================================
    // NEW DSA TREES & BST (7)
    // ==========================================
    {
        id: "dsa-tree-02",
        title: "Maximum Depth of Binary Tree",
        skill: "Data Structures",
        topic: "Trees and binary search trees",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Compute recursive depth using post-order tree traversal.",
        prerequisites: ["Binary tree node", "DFS recursion"],
        description: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
        examples: [
            { input: "root = [3,9,20,null,null,15,7]", output: "3", explanation: "Depth of root 3 -> 20 -> 15 is 3." }
        ],
        hints: [
            "Hint 1: Base case: if `root == null`, return 0.",
            "Hint 2: Recursive case: `1 + Math.max(maxDepth(root.left), maxDepth(root.right))`."
        ],
        starterCode: `public class Solution {
    public static class TreeNode {
        public int val; public TreeNode left, right;
        public TreeNode(int val) { this.val = val; }
    }

    public static int maxDepth(TreeNode root) {
        // Write your solution here
        if (root == null) return 0;
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}`,
        testCases: [
            { input: "[3,9,20,null,null,15,7]", expectedOutput: "3", isHidden: false },
            { input: "[1,null,2]", expectedOutput: "2", isHidden: false },
            { input: "[]", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Solves in O(N) time with recursive tree traversal.",
        sourceUrl: "https://en.wikipedia.org/wiki/Binary_tree"
    },
    {
        id: "dsa-tree-03",
        title: "Invert / Mirror a Binary Tree",
        skill: "Data Structures",
        topic: "Trees and binary search trees",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Swap child pointers recursively to produce a mirror image of the tree.",
        prerequisites: ["Tree traversal", "Pointer swapping"],
        description: "Given the root of a binary tree, invert the tree, and return its root. All left children become right children and vice versa.",
        examples: [
            { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]", explanation: "Subtrees swapped symmetrically." }
        ],
        hints: [
            "Hint 1: Recursively invert `root.left` and `root.right`.",
            "Hint 2: Swap `root.left` and `root.right`."
        ],
        starterCode: `public class Solution {
    public static class TreeNode {
        public int val; public TreeNode left, right;
        public TreeNode(int val) { this.val = val; }
    }

    public static TreeNode invertTree(TreeNode root) {
        if (root == null) return null;
        // Write your solution here
        TreeNode temp = root.left;
        root.left = invertTree(root.right);
        root.right = invertTree(temp);
        return root;
    }
}`,
        testCases: [
            { input: "[4,2,7,1,3,6,9]", expectedOutput: "[4,7,2,9,6,3,1]", isHidden: false },
            { input: "[2,1,3]", expectedOutput: "[2,3,1]", isHidden: false },
            { input: "[]", expectedOutput: "null", isHidden: true }
        ],
        rubricCriteria: "O(N) time in-place child pointer inversion.",
        sourceUrl: "https://en.wikipedia.org/wiki/Binary_tree"
    },
    {
        id: "dsa-tree-04",
        title: "Validate Binary Search Tree",
        skill: "Data Structures",
        topic: "Trees and binary search trees",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Verify BST invariant (all left subnodes < root < all right subnodes) using boundary ranges.",
        prerequisites: ["BST definition", "Boundary bounds propagation"],
        description: "Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST satisfies: left subtree values < node.val < right subtree values.",
        examples: [
            { input: "root = [2,1,3]", output: "true", explanation: "1 < 2 < 3 is valid." },
            { input: "root = [5,1,4,null,null,3,6]", output: "false", explanation: "Right node 4 is less than root 5." }
        ],
        hints: [
            "Hint 1: Do not simply compare with immediate children; check against min and max bounds.",
            "Hint 2: Helper `isValid(node, Long min, Long max)` ensures bounds propagate down the tree."
        ],
        starterCode: `public class Solution {
    public static class TreeNode {
        public int val; public TreeNode left, right;
        public TreeNode(int val) { this.val = val; }
    }

    public static boolean isValidBST(TreeNode root) {
        return validate(root, null, null);
    }

    private static boolean validate(TreeNode node, Integer min, Integer max) {
        // Write your solution here
        if (node == null) return true;
        if (min != null && node.val <= min) return false;
        if (max != null && node.val >= max) return false;
        return validate(node.left, min, node.val) && validate(node.right, node.val, max);
    }
}`,
        testCases: [
            { input: "[2,1,3]", expectedOutput: "true", isHidden: false },
            { input: "[5,1,4,null,null,3,6]", expectedOutput: "false", isHidden: false },
            { input: "[2147483647]", expectedOutput: "true", isHidden: true }
        ],
        rubricCriteria: "Boundary propagation avoids common immediate-child comparison pitfalls.",
        sourceUrl: "https://en.wikipedia.org/wiki/Binary_search_tree"
    },
    {
        id: "dsa-tree-05",
        title: "Lowest Common Ancestor in BST",
        skill: "Data Structures",
        topic: "Trees and binary search trees",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Exploit BST sorting invariant to find LCA without searching the entire tree in O(H) time.",
        prerequisites: ["BST properties", "LCA definition"],
        description: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes `p` and `q` in the BST.",
        examples: [
            { input: "root = [6,2,8,0,4,7,9], p = 2, q = 8", output: "6", explanation: "LCA of 2 and 8 is 6." }
        ],
        hints: [
            "Hint 1: If both `p.val` and `q.val` are less than `root.val`, LCA must be in the left subtree.",
            "Hint 2: If both are greater, LCA is in right subtree. Otherwise, current `root` is the split point (LCA)."
        ],
        starterCode: `public class Solution {
    public static class TreeNode {
        public int val; public TreeNode left, right;
        public TreeNode(int val) { this.val = val; }
    }

    public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Write your solution here
        while (root != null) {
            if (p.val < root.val && q.val < root.val) root = root.left;
            else if (p.val > root.val && q.val > root.val) root = root.right;
            else return root;
        }
        return null;
    }
}`,
        testCases: [
            { input: "[6,2,8], p=2, q=8", expectedOutput: "6", isHidden: false },
            { input: "[6,2,8,0,4], p=2, q=4", expectedOutput: "2", isHidden: false },
            { input: "[2,1], p=2, q=1", expectedOutput: "2", isHidden: true }
        ],
        rubricCriteria: "O(H) time where H is height of the tree; no recursion stack needed.",
        sourceUrl: "https://en.wikipedia.org/wiki/Lowest_common_ancestor"
    },
    {
        id: "dsa-tree-06",
        title: "Binary Tree Diameter",
        skill: "Data Structures",
        topic: "Trees and binary search trees",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Calculate longest path between any two nodes using bottom-up post-order DFS.",
        prerequisites: ["Tree DFS", "Post-order traversal"],
        description: "Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes in a tree, which may or may not pass through the root.",
        examples: [
            { input: "root = [1,2,3,4,5]", output: "3", explanation: "Path [4,2,1,3] or [5,2,1,3] has 3 edges." }
        ],
        hints: [
            "Hint 1: At each node, `diameterThroughNode = leftHeight + rightHeight`.",
            "Hint 2: Return `1 + Math.max(leftHeight, rightHeight)` to parent while updating global diameter."
        ],
        starterCode: `public class Solution {
    public static class TreeNode {
        public int val; public TreeNode left, right;
        public TreeNode(int val) { this.val = val; }
    }

    private static int maxDiameter = 0;

    public static int diameterOfBinaryTree(TreeNode root) {
        maxDiameter = 0;
        height(root);
        return maxDiameter;
    }

    private static int height(TreeNode node) {
        // Write your solution here
        if (node == null) return 0;
        int left = height(node.left);
        int right = height(node.right);
        maxDiameter = Math.max(maxDiameter, left + right);
        return 1 + Math.max(left, right);
    }
}`,
        testCases: [
            { input: "[1,2,3,4,5]", expectedOutput: "3", isHidden: false },
            { input: "[1,2]", expectedOutput: "1", isHidden: false },
            { input: "[1]", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Solves in single-pass O(N) time with post-order traversal.",
        sourceUrl: "https://en.wikipedia.org/wiki/Binary_tree"
    },
    {
        id: "dsa-tree-07",
        title: "Construct Binary Tree from Preorder & Inorder",
        skill: "Data Structures",
        topic: "Trees and binary search trees",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Reconstruct tree topology using divide and conquer with HashMap index lookups.",
        prerequisites: ["Preorder/Inorder traversal", "HashMap lookup"],
        description: "Given two integer arrays `preorder` and `inorder` where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.",
        examples: [
            { input: "preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]", output: "[3,9,20,null,null,15,7]", explanation: "Root is 3, left child is 9, right subtree is [20,15,7]." }
        ],
        hints: [
            "Hint 1: `preorder[0]` is always the root node.",
            "Hint 2: Find root in `inorder` array: elements to left belong to left subtree, elements to right belong to right subtree."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static class TreeNode {
        public int val; public TreeNode left, right;
        public TreeNode(int val) { this.val = val; }
    }

    public static TreeNode buildTree(int[] preorder, int[] inorder) {
        Map<Integer, Integer> inMap = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);
        return build(preorder, 0, preorder.length - 1, 0, inorder.length - 1, inMap);
    }

    private static TreeNode build(int[] pre, int preStart, int preEnd, int inStart, int inEnd, Map<Integer, Integer> map) {
        // Write your solution here
        if (preStart > preEnd || inStart > inEnd) return null;
        TreeNode root = new TreeNode(pre[preStart]);
        int inRoot = map.get(root.val);
        int numsLeft = inRoot - inStart;
        root.left = build(pre, preStart + 1, preStart + numsLeft, inStart, inRoot - 1, map);
        root.right = build(pre, preStart + numsLeft + 1, preEnd, inRoot + 1, inEnd, map);
        return root;
    }
}`,
        testCases: [
            { input: "preorder=[3,9,20,15,7], inorder=[9,3,15,20,7]", expectedOutput: "Root 3 with left 9 right 20", isHidden: false },
            { input: "preorder=[-1], inorder=[-1]", expectedOutput: "Single node -1", isHidden: false },
            { input: "Full binary tree", expectedOutput: "Accurately constructed", isHidden: true }
        ],
        rubricCriteria: "O(N) time complexity using hash map for O(1) inorder index queries.",
        sourceUrl: "https://en.wikipedia.org/wiki/Tree_traversal"
    },
    {
        id: "dsa-tree-08",
        title: "Binary Tree Maximum Path Sum",
        skill: "Data Structures",
        topic: "Trees and binary search trees",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Compute maximum path sum between any two nodes with negative node values allowed.",
        prerequisites: ["Tree DP", "Post-order recursion"],
        description: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Return the maximum path sum of any non-empty path in the tree.",
        examples: [
            { input: "root = [-10,9,20,null,null,15,7]", output: "42", explanation: "Path 15 -> 20 -> 7 yields max sum 15 + 20 + 7 = 42." }
        ],
        hints: [
            "Hint 1: At each node, calculate max gain from left and right subtrees (`Math.max(0, gain)`).",
            "Hint 2: Update global max with `node.val + leftGain + rightGain`.",
            "Hint 3: Return `node.val + Math.max(leftGain, rightGain)` to parent."
        ],
        starterCode: `public class Solution {
    public static class TreeNode {
        public int val; public TreeNode left, right;
        public TreeNode(int val) { this.val = val; }
    }

    private static int maxSum = Integer.MIN_VALUE;

    public static int maxPathSum(TreeNode root) {
        maxSum = Integer.MIN_VALUE;
        maxGain(root);
        return maxSum;
    }

    private static int maxGain(TreeNode node) {
        // Write your solution here
        if (node == null) return 0;
        int left = Math.max(0, maxGain(node.left));
        int right = Math.max(0, maxGain(node.right));
        maxSum = Math.max(maxSum, node.val + left + right);
        return node.val + Math.max(left, right);
    }
}`,
        testCases: [
            { input: "[1,2,3]", expectedOutput: "6", isHidden: false },
            { input: "[-10,9,20,null,null,15,7]", expectedOutput: "42", isHidden: false },
            { input: "[-3]", expectedOutput: "-3", isHidden: true }
        ],
        rubricCriteria: "Solves in O(N) time with post-order traversal; correctly handles negative node values.",
        sourceUrl: "https://en.wikipedia.org/wiki/Tree_traversal"
    },

    // ==========================================
    // NEW DSA GRAPHS (5)
    // ==========================================
    {
        id: "dsa-graph-01",
        title: "Number of Connected Islands",
        skill: "Data Structures",
        topic: "Graphs and traversal",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Traverse 2D grid graphs using DFS/BFS component marking to count connected components.",
        prerequisites: ["2D Grid traversal", "DFS / BFS flood fill"],
        description: "Given an `m x n` 2D binary grid `grid` which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.",
        examples: [
            { input: "grid = [[\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\"],[\"0\",\"0\",\"1\"]]", output: "2", explanation: "Top-left cluster is 1 island; bottom-right single cell is second island." }
        ],
        hints: [
            "Hint 1: Loop over every cell `(r, c)`. When a '1' is found, increment island counter and start DFS.",
            "Hint 2: During DFS, mutate visited cells to '0' to avoid visiting twice."
        ],
        starterCode: `public class Solution {
    public static int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        int count = 0;
        // Write your solution here
        for (int r = 0; r < grid.length; r++) {
            for (int c = 0; c < grid[0].length; c++) {
                if (grid[r][c] == '1') {
                    count++;
                    dfs(grid, r, c);
                }
            }
        }
        return count;
    }

    private static void dfs(char[][] g, int r, int c) {
        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != '1') return;
        g[r][c] = '0';
        dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);
    }
}`,
        testCases: [
            { input: "3x3 grid with 2 islands", expectedOutput: "2", isHidden: false },
            { input: "All water grid", expectedOutput: "0", isHidden: false },
            { input: "Single land cell", expectedOutput: "1", isHidden: true }
        ],
        rubricCriteria: "O(M * N) time with linear flood fill; mutates grid or uses visited set.",
        sourceUrl: "https://en.wikipedia.org/wiki/Flood_fill"
    },
    {
        id: "dsa-graph-02",
        title: "Course Schedule - Cycle Detection in Directed Graph",
        skill: "Data Structures",
        topic: "Graphs and traversal",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Implement Kahn's algorithm or 3-color DFS to detect cycles in directed dependency graphs.",
        prerequisites: ["Topological sort", "In-degree array"],
        description: "There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given prerequisites where `prerequisites[i] = [a, b]` indicates you must take course `b` before `a`. Return true if you can finish all courses.",
        examples: [
            { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true", explanation: "Take course 0 then course 1." },
            { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false", explanation: "Cycle detected: cannot finish." }
        ],
        hints: [
            "Hint 1: Build adjacency list and compute in-degrees for each node.",
            "Hint 2: Queue all nodes with `inDegree == 0`. Poll, decrement neighbor in-degrees, and queue when 0.",
            "Hint 3: If visited count == numCourses, no cycle exists."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        int[] inDegree = new int[numCourses];
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());
        for (int[] p : prerequisites) {
            adj.get(p[1]).add(p[0]);
            inDegree[p[0]]++;
        }
        Queue<Integer> q = new LinkedList<>();
        // Write your solution here
        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);
        int visited = 0;
        while (!q.isEmpty()) {
            int curr = q.poll();
            visited++;
            for (int neighbor : adj.get(curr)) {
                if (--inDegree[neighbor] == 0) q.offer(neighbor);
            }
        }
        return visited == numCourses;
    }
}`,
        testCases: [
            { input: "2 courses, [[1,0]]", expectedOutput: "true", isHidden: false },
            { input: "2 courses, [[1,0],[0,1]]", expectedOutput: "false", isHidden: false },
            { input: "1 course, no prereqs", expectedOutput: "true", isHidden: true }
        ],
        rubricCriteria: "Kahn's BFS or 3-color DFS topological sort in O(V + E) time.",
        sourceUrl: "https://en.wikipedia.org/wiki/Topological_sorting"
    },
    {
        id: "dsa-graph-03",
        title: "Clone an Undirected Graph",
        skill: "Data Structures",
        topic: "Graphs and traversal",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Deep copy an arbitrary cyclic graph using HashMap memoization and graph traversal.",
        prerequisites: ["Graph traversal", "Map<Node, Node> clone cache"],
        description: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node contains a value (`int`) and a list (`List<Node>`) of its neighbors.",
        examples: [
            { input: "adjList = [[2,4],[1,3],[2,4],[1,3]]", output: "Cloned graph with identical topology", explanation: "All nodes duplicated into independent memory addresses." }
        ],
        hints: [
            "Hint 1: Use a `Map<Node, Node>` to remember nodes already cloned.",
            "Hint 2: If node is already in map, return the mapped clone to handle cycles gracefully."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static class Node {
        public int val; public List<Node> neighbors;
        public Node(int v) { val = v; neighbors = new ArrayList<>(); }
    }

    private static Map<Node, Node> map = new HashMap<>();

    public static Node cloneGraph(Node node) {
        map.clear();
        return dfs(node);
    }

    private static Node dfs(Node node) {
        // Write your solution here
        if (node == null) return null;
        if (map.containsKey(node)) return map.get(node);
        Node clone = new Node(node.val);
        map.put(node, clone);
        for (Node neighbor : node.neighbors) {
            clone.neighbors.add(dfs(neighbor));
        }
        return clone;
    }
}`,
        testCases: [
            { input: "Graph with 4 nodes", expectedOutput: "Deep clone with matching neighbor edges", isHidden: false },
            { input: "Single node graph", expectedOutput: "Single cloned node", isHidden: false },
            { input: "null node", expectedOutput: "null", isHidden: true }
        ],
        rubricCriteria: "O(V + E) time with hash map cycle prevention; clones every vertex and edge.",
        sourceUrl: "https://en.wikipedia.org/wiki/Graph_traversal"
    },
    {
        id: "dsa-graph-04",
        title: "Network Delay Time",
        skill: "Data Structures",
        topic: "Graphs and traversal",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Compute single-source shortest path in weighted directed graph using Dijkstra's algorithm.",
        prerequisites: ["Dijkstra's algorithm", "PriorityQueue with weighted edges"],
        description: "You are given a network of `n` nodes labeled from 1 to `n`. You are also given `times`, a list of travel times as directed edges `times[i] = (u, v, w)`. Send a signal from node `k`. Return minimum time for all nodes to receive the signal, or -1 if impossible.",
        examples: [
            { input: "times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2", output: "2", explanation: "Node 4 reached at time 2." }
        ],
        hints: [
            "Hint 1: Use Dijkstra's algorithm with a Min-Heap PriorityQueue.",
            "Hint 2: Track `dist[node]` array initialized to infinity; dist[k] = 0.",
            "Hint 3: Answer is `max(dist[1..n])` if all reachable, else -1."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int networkDelayTime(int[][] times, int n, int k) {
        Map<Integer, List<int[]>> graph = new HashMap<>();
        for (int[] t : times) graph.computeIfAbsent(t[0], x -> new ArrayList<>()).add(new int[]{t[1], t[2]});
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
        pq.offer(new int[]{k, 0});
        Map<Integer, Integer> dist = new HashMap<>();
        // Write your solution here
        while (!pq.isEmpty()) {
            int[] curr = pq.poll();
            int u = curr[0], d = curr[1];
            if (dist.containsKey(u)) continue;
            dist.put(u, d);
            if (graph.containsKey(u)) {
                for (int[] edge : graph.get(u)) {
                    if (!dist.containsKey(edge[0])) pq.offer(new int[]{edge[0], d + edge[1]});
                }
            }
        }
        if (dist.size() < n) return -1;
        int max = 0;
        for (int d : dist.values()) max = Math.max(max, d);
        return max;
    }
}`,
        testCases: [
            { input: "times=[[2,1,1],[2,3,1],[3,4,1]], n=4, k=2", expectedOutput: "2", isHidden: false },
            { input: "times=[[1,2,1]], n=2, k=1", expectedOutput: "1", isHidden: false },
            { input: "times=[[1,2,1]], n=2, k=2", expectedOutput: "-1", isHidden: true }
        ],
        rubricCriteria: "Dijkstra's algorithm in O(E log V) time with PriorityQueue.",
        sourceUrl: "https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm"
    },
    {
        id: "dsa-graph-05",
        title: "Word Ladder Shortest Transformation",
        skill: "Data Structures",
        topic: "Graphs and traversal",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Find shortest unweighted transformation path using Breadth-First Search (BFS) and word sets.",
        prerequisites: ["BFS shortest path", "Word graph mutations"],
        description: "Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return the number of words in the shortest transformation sequence from `beginWord` to `endWord` such that only one letter is changed at each step and each intermediate word is in `wordList`. Return 0 if impossible.",
        examples: [
            { input: "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]", output: "5", explanation: "\"hit\" -> \"hot\" -> \"dot\" -> \"dog\" -> \"cog\" has 5 words." }
        ],
        hints: [
            "Hint 1: Store `wordList` in a HashSet for O(1) containment checks.",
            "Hint 2: Run BFS queue where each level represents sequence length + 1.",
            "Hint 3: For current word, mutate each char from 'a' to 'z' and check membership in word set."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int ladderLength(String beginWord, String endWord, List<String> wordList) {
        Set<String> dict = new HashSet<>(wordList);
        if (!dict.contains(endWord)) return 0;
        Queue<String> q = new LinkedList<>();
        q.offer(beginWord);
        int level = 1;
        // Write your solution here
        while (!q.isEmpty()) {
            int size = q.size();
            for (int i = 0; i < size; i++) {
                char[] chars = q.poll().toCharArray();
                for (int j = 0; j < chars.length; j++) {
                    char orig = chars[j];
                    for (char c = 'a'; c <= 'z'; c++) {
                        chars[j] = c;
                        String next = new String(chars);
                        if (next.equals(endWord)) return level + 1;
                        if (dict.remove(next)) q.offer(next);
                    }
                    chars[j] = orig;
                }
            }
            level++;
        }
        return 0;
    }
}`,
        testCases: [
            { input: "hit -> cog, list contains cog", expectedOutput: "5", isHidden: false },
            { input: "hit -> cog, list does not contain cog", expectedOutput: "0", isHidden: false },
            { input: "a -> c, list = [\"a\", \"b\", \"c\"]", expectedOutput: "2", isHidden: true }
        ],
        rubricCriteria: "BFS guaranteed shortest path with level-by-level queue expansion.",
        sourceUrl: "https://en.wikipedia.org/wiki/Breadth-first_search"
    },

    // ==========================================
    // NEW DSA BINARY SEARCH & HEAPS (5)
    // ==========================================
    {
        id: "dsa-search-01",
        title: "Binary Search on Sorted Array",
        skill: "Data Structures",
        topic: "Binary search & sorting",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Implement logarithmic search on sorted arrays, preventing integer overflow in midpoint calculation.",
        prerequisites: ["Sorted array", "Binary search midpoint formula"],
        description: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index; otherwise, return -1. Must run in O(log n) time.",
        examples: [
            { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explanation: "9 exists in nums and its index is 4." },
            { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explanation: "2 does not exist." }
        ],
        hints: [
            "Hint 1: Use `mid = low + (high - low) / 2` to prevent overflow.",
            "Hint 2: Narrow search interval to `low = mid + 1` or `high = mid - 1`."
        ],
        starterCode: `public class Solution {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        // Write your solution here
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            if (nums[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        return -1;
    }
}`,
        testCases: [
            { input: "[-1,0,3,5,9,12], target = 9", expectedOutput: "4", isHidden: false },
            { input: "[-1,0,3,5,9,12], target = 2", expectedOutput: "-1", isHidden: false },
            { input: "[5], target = 5", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Strict O(log N) time with safe midpoint computation.",
        sourceUrl: "https://en.wikipedia.org/wiki/Binary_search_algorithm"
    },
    {
        id: "dsa-search-02",
        title: "Search in Rotated Sorted Array",
        skill: "Data Structures",
        topic: "Binary search & sorting",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Identify which half of the rotated array is monotonically sorted and discard the other half.",
        prerequisites: ["Modified binary search", "Rotated array properties"],
        description: "Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or -1 if it is not in `nums`. Must achieve O(log n) runtime.",
        examples: [
            { input: "nums = [4,5,6,7,0,1,2], target = 0", output: "4", explanation: "0 found at index 4." },
            { input: "nums = [4,5,6,7,0,1,2], target = 3", output: "-1", explanation: "3 not present." }
        ],
        hints: [
            "Hint 1: At least one half (`[low, mid]` or `[mid, high]`) must always be strictly sorted.",
            "Hint 2: Check if target falls within the sorted half; if so, search there, else search the opposite half."
        ],
        starterCode: `public class Solution {
    public static int search(int[] nums, int target) {
        int low = 0, high = nums.length - 1;
        // Write your solution here
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) return mid;
            if (nums[low] <= nums[mid]) { // Left half is sorted
                if (target >= nums[low] && target < nums[mid]) high = mid - 1;
                else low = mid + 1;
            } else { // Right half is sorted
                if (target > nums[mid] && target <= nums[high]) low = mid + 1;
                else high = mid - 1;
            }
        }
        return -1;
    }
}`,
        testCases: [
            { input: "[4,5,6,7,0,1,2], target = 0", expectedOutput: "4", isHidden: false },
            { input: "[4,5,6,7,0,1,2], target = 3", expectedOutput: "-1", isHidden: false },
            { input: "[1], target = 0", expectedOutput: "-1", isHidden: true }
        ],
        rubricCriteria: "Strict O(log N) runtime with binary search interval partitioning.",
        sourceUrl: "https://en.wikipedia.org/wiki/Binary_search_algorithm"
    },
    {
        id: "dsa-heap-01",
        title: "Kth Largest Element in an Array",
        skill: "Data Structures",
        topic: "Heaps and priority queues",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Maintain a bounded Min-Heap of size k to extract the k-th largest element in O(N log k) time.",
        prerequisites: ["Min-Heap", "PriorityQueue capacity sizing"],
        description: "Given an integer array `nums` and an integer `k`, return the `k-th` largest element in the array without sorting the entire array.",
        examples: [
            { input: "nums = [3,2,1,5,6,4], k = 2", output: "5", explanation: "Sorted: [6,5,4,3,2,1], 2nd largest is 5." }
        ],
        hints: [
            "Hint 1: Use a `PriorityQueue<Integer>` (Min-Heap).",
            "Hint 2: Add elements to heap; whenever `heap.size() > k`, call `heap.poll()`.",
            "Hint 3: Top of heap at the end is the k-th largest."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int findKthLargest(int[] nums, int k) {
        PriorityQueue<Integer> pq = new PriorityQueue<>(k);
        // Write your solution here
        for (int num : nums) {
            pq.offer(num);
            if (pq.size() > k) pq.poll();
        }
        return pq.peek();
    }
}`,
        testCases: [
            { input: "[3,2,1,5,6,4], k = 2", expectedOutput: "5", isHidden: false },
            { input: "[3,2,3,1,2,4,5,5,6], k = 4", expectedOutput: "4", isHidden: false },
            { input: "[1], k = 1", expectedOutput: "1", isHidden: true }
        ],
        rubricCriteria: "O(N log K) time with O(K) space bounded Min-Heap.",
        sourceUrl: "https://en.wikipedia.org/wiki/Priority_queue"
    },
    {
        id: "dsa-search-03",
        title: "Find Minimum in Rotated Sorted Array",
        skill: "Data Structures",
        topic: "Binary search & sorting",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Locate the inflection pivot point of a sorted rotated array in logarithmic time.",
        prerequisites: ["Binary search", "Array rotation pivot"],
        description: "Given the sorted rotated array `nums` of unique elements, return the minimum element of this array in O(log n) time.",
        examples: [
            { input: "nums = [3,4,5,1,2]", output: "1", explanation: "Original array was [1,2,3,4,5] rotated 3 times." },
            { input: "nums = [4,5,6,7,0,1,2]", output: "0", explanation: "0 is min." }
        ],
        hints: [
            "Hint 1: Compare `nums[mid]` with `nums[high]`.",
            "Hint 2: If `nums[mid] > nums[high]`, minimum lies strictly in the right half (`low = mid + 1`).",
            "Hint 3: Otherwise, minimum is in the left half including `mid` (`high = mid`)."
        ],
        starterCode: `public class Solution {
    public static int findMin(int[] nums) {
        int low = 0, high = nums.length - 1;
        // Write your solution here
        while (low < high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] > nums[high]) low = mid + 1;
            else high = mid;
        }
        return nums[low];
    }
}`,
        testCases: [
            { input: "[3,4,5,1,2]", expectedOutput: "1", isHidden: false },
            { input: "[4,5,6,7,0,1,2]", expectedOutput: "0", isHidden: false },
            { input: "[11,13,15,17]", expectedOutput: "11", isHidden: true }
        ],
        rubricCriteria: "O(log N) time complexity pivot detection.",
        sourceUrl: "https://en.wikipedia.org/wiki/Binary_search_algorithm"
    },
    {
        id: "dsa-heap-02",
        title: "Find Median from Data Stream",
        skill: "Data Structures",
        topic: "Heaps and priority queues",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Maintain two balancing heaps (Max-Heap for lower half, Min-Heap for upper half) to find median in O(1) time.",
        prerequisites: ["Dual heap balancing", "PriorityQueue reverse order"],
        description: "The median is the middle value in an ordered integer list. Design a data structure `MedianFinder` that supports adding numbers from a data stream and finding the median of current numbers in O(1) time.",
        examples: [
            { input: "addNum(1), addNum(2), findMedian() -> 1.5; addNum(3), findMedian() -> 2.0", output: "1.5 then 2.0", explanation: "Correct median calculation." }
        ],
        hints: [
            "Hint 1: Maintain `maxHeap` (lower half) and `minHeap` (upper half).",
            "Hint 2: Ensure sizes differ by at most 1 (`maxHeap.size() >= minHeap.size()`)."
        ],
        starterCode: `import java.util.*;

public class MedianFinder {
    private PriorityQueue<Integer> small = new PriorityQueue<>(Collections.reverseOrder());
    private PriorityQueue<Integer> large = new PriorityQueue<>();

    public void addNum(int num) {
        small.offer(num);
        large.offer(small.poll());
        // Write your solution here: balance heaps
        if (small.size() < large.size()) small.offer(large.poll());
    }

    public double findMedian() {
        return small.size() > large.size() ? small.peek() : (small.peek() + large.peek()) / 2.0;
    }
}`,
        testCases: [
            { input: "add(1), add(2), median", expectedOutput: "1.5", isHidden: false },
            { input: "add(3), median", expectedOutput: "2.0", isHidden: false },
            { input: "add(0), add(0), median", expectedOutput: "0.0", isHidden: true }
        ],
        rubricCriteria: "Dual heap design with O(log N) insert and O(1) findMedian.",
        sourceUrl: "https://en.wikipedia.org/wiki/Median"
    },

    // ==========================================
    // NEW DSA DYNAMIC PROGRAMMING (5)
    // ==========================================
    {
        id: "dsa-dp-02",
        title: "Coin Change - Minimum Coins Required",
        skill: "Data Structures",
        topic: "Dynamic programming",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Solve unbounded knapsack using bottom-up tabulation DP.",
        prerequisites: ["Bottom-up DP table", "Unbounded knapsack recurrence"],
        description: "You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount, or -1 if impossible.",
        examples: [
            { input: "coins = [1,2,5], amount = 11", output: "3", explanation: "11 = 5 + 5 + 1 (3 coins)." },
            { input: "coins = [2], amount = 3", output: "-1", explanation: "Impossible to make 3 with only 2-cent coins." }
        ],
        hints: [
            "Hint 1: Create `dp` array of size `amount + 1` filled with `amount + 1`.",
            "Hint 2: `dp[0] = 0`. For `i` from 1 to `amount` and each `coin`: `if (i >= coin) dp[i] = Math.min(dp[i], 1 + dp[i - coin])`."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        // Write your solution here
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i >= coin) dp[i] = Math.min(dp[i], 1 + dp[i - coin]);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
        testCases: [
            { input: "coins = [1,2,5], amount = 11", expectedOutput: "3", isHidden: false },
            { input: "coins = [2], amount = 3", expectedOutput: "-1", isHidden: false },
            { input: "coins = [1], amount = 0", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "Bottom-up tabulation running in O(amount * len(coins)) time.",
        sourceUrl: "https://en.wikipedia.org/wiki/Change-making_problem"
    },
    {
        id: "dsa-dp-03",
        title: "Longest Increasing Subsequence",
        skill: "Data Structures",
        topic: "Dynamic programming",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Formulate optimal state transition for non-contiguous subsequences.",
        prerequisites: ["Subsequence vs Subarray", "1D DP"],
        description: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
        examples: [
            { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explanation: "The longest increasing subsequence is [2,3,7,101], therefore length is 4." }
        ],
        hints: [
            "Hint 1: Define `dp[i]` as the length of the longest increasing subsequence ending at index `i`.",
            "Hint 2: For each `j < i`, if `nums[j] < nums[i]`, `dp[i] = Math.max(dp[i], dp[j] + 1)`."
        ],
        starterCode: `import java.util.*;

public class Solution {
    public static int lengthOfLIS(int[] nums) {
        if (nums.length == 0) return 0;
        int[] dp = new int[nums.length];
        Arrays.fill(dp, 1);
        int max = 1;
        // Write your solution here
        for (int i = 1; i < nums.length; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);
            }
            max = Math.max(max, dp[i]);
        }
        return max;
    }
}`,
        testCases: [
            { input: "[10,9,2,5,3,7,101,18]", expectedOutput: "4", isHidden: false },
            { input: "[0,1,0,3,2,3]", expectedOutput: "4", isHidden: false },
            { input: "[7,7,7,7]", expectedOutput: "1", isHidden: true }
        ],
        rubricCriteria: "Solves in O(N^2) or O(N log N) time.",
        sourceUrl: "https://en.wikipedia.org/wiki/Longest_increasing_subsequence"
    },
    {
        id: "dsa-dp-04",
        title: "House Robber - Non-Adjacent Maximum Sum",
        skill: "Data Structures",
        topic: "Dynamic programming",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Model binary decision choices (rob or skip) with O(1) space optimization.",
        prerequisites: ["1D DP recurrence", "State reduction"],
        description: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected and will automatically contact the police if two adjacent houses were broken into on the same night. Return maximum money you can rob.",
        examples: [
            { input: "nums = [1,2,3,1]", output: "4", explanation: "Rob house 1 (1) + house 3 (3) = 4." },
            { input: "nums = [2,7,9,3,1]", output: "12", explanation: "Rob house 1 (2) + house 3 (9) + house 5 (1) = 12." }
        ],
        hints: [
            "Hint 1: At house `i`, you can either rob it (`nums[i] + rob(i - 2)`) or skip it (`rob(i - 1)`).",
            "Hint 2: `curr = Math.max(prev1, prev2 + nums[i])`."
        ],
        starterCode: `public class Solution {
    public static int rob(int[] nums) {
        if (nums.length == 0) return 0;
        int prev2 = 0, prev1 = 0;
        // Write your solution here
        for (int num : nums) {
            int temp = Math.max(prev1, prev2 + num);
            prev2 = prev1;
            prev1 = temp;
        }
        return prev1;
    }
}`,
        testCases: [
            { input: "[1,2,3,1]", expectedOutput: "4", isHidden: false },
            { input: "[2,7,9,3,1]", expectedOutput: "12", isHidden: false },
            { input: "[0]", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "O(N) time with O(1) space state variables.",
        sourceUrl: "https://en.wikipedia.org/wiki/Dynamic_programming"
    },
    {
        id: "dsa-dp-05",
        title: "Unique Paths in a Grid with Obstacles",
        skill: "Data Structures",
        topic: "Dynamic programming",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Count paths in 2D grid DP while respecting zero-way obstacles.",
        prerequisites: ["2D DP grid", "Boundary initialization"],
        description: "You are given an `m x n` integer array `grid`. There is a robot initially located at the top-left corner `(0, 0)`. The robot tries to move to the bottom-right corner `(m - 1, n - 1)` moving only down or right. An obstacle is marked as 1. Return the number of possible unique paths.",
        examples: [
            { input: "grid = [[0,0,0],[0,1,0],[0,0,0]]", output: "2", explanation: "Obstacle in middle leaves 2 paths." }
        ],
        hints: [
            "Hint 1: If `grid[r][c] == 1`, `dp[r][c] = 0`.",
            "Hint 2: Otherwise, `dp[r][c] = dp[r - 1][c] + dp[r][c - 1]`."
        ],
        starterCode: `public class Solution {
    public static int uniquePathsWithObstacles(int[][] grid) {
        int m = grid.length, n = grid[0].length;
        int[] dp = new int[n];
        dp[0] = (grid[0][0] == 0) ? 1 : 0;
        // Write your solution here
        for (int r = 0; r < m; r++) {
            for (int c = 0; c < n; c++) {
                if (grid[r][c] == 1) dp[c] = 0;
                else if (c > 0) dp[c] += dp[c - 1];
            }
        }
        return dp[n - 1];
    }
}`,
        testCases: [
            { input: "[[0,0,0],[0,1,0],[0,0,0]]", expectedOutput: "2", isHidden: false },
            { input: "[[0,1],[0,0]]", expectedOutput: "1", isHidden: false },
            { input: "[[1]]", expectedOutput: "0", isHidden: true }
        ],
        rubricCriteria: "O(M * N) time with O(N) rolling space vector.",
        sourceUrl: "https://en.wikipedia.org/wiki/Dynamic_programming"
    },
    {
        id: "dsa-dp-06",
        title: "Edit Distance Between Two Words",
        skill: "Data Structures",
        topic: "Dynamic programming",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Practice Challenge",
        objective: "Calculate minimum Levenshtein edit distance using 2D matrix DP recurrence.",
        prerequisites: ["Levenshtein distance", "2D DP grid"],
        description: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2`. You have three operations: insert a character, delete a character, replace a character.",
        examples: [
            { input: "word1 = \"horse\", word2 = \"ros\"", output: "3", explanation: "horse -> rorse (replace 'h' with 'r') -> rose (remove 'r') -> ros (remove 'e')." }
        ],
        hints: [
            "Hint 1: Define `dp[i][j]` as the edit distance between `word1[0..i-1]` and `word2[0..j-1]`.",
            "Hint 2: If `word1[i-1] == word2[j-1]`, `dp[i][j] = dp[i-1][j-1]`.",
            "Hint 3: Else `dp[i][j] = 1 + min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace))`."
        ],
        starterCode: `public class Solution {
    public static int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        // Write your solution here
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], Math.min(dp[i - 1][j], dp[i][j - 1]));
            }
        }
        return dp[m][n];
    }
}`,
        testCases: [
            { input: "horse, ros", expectedOutput: "3", isHidden: false },
            { input: "intention, execution", expectedOutput: "5", isHidden: false },
            { input: "\"\", a", expectedOutput: "1", isHidden: true }
        ],
        rubricCriteria: "Classic Levenshtein DP running in O(M * N) time and space.",
        sourceUrl: "https://en.wikipedia.org/wiki/Levenshtein_distance"
    }
];

if (typeof window !== "undefined") {
    window.DSA_PROBLEMS = DSA_PROBLEMS;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { DSA_PROBLEMS };
}
