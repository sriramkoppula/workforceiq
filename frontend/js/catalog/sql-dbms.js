/**
 * WorkforceIQ Problem Catalog - Batch 3: SQL & Database Management Systems (DBMS)
 * Contains 22 new unique problems (combined with 3 existing = 25 total)
 * Divided into Must-Solve and Coding Practice tracks.
 */

const SQL_DBMS_PROBLEMS = [
    // ==========================================
    // MUST-SOLVE TRACK (Foundational & Interview Core)
    // ==========================================
    {
        id: "sql-04",
        title: "Find Duplicate Emails in User Table",
        skill: "SQL",
        topic: "Basic Queries and Aggregations",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Master GROUP BY and HAVING clauses to identify duplicate entity records.",
        prerequisites: ["SELECT queries", "GROUP BY clause", "HAVING filter"],
        description: "Write an SQL query to find all duplicate emails in a table named `Person` with columns `id` (int) and `email` (varchar). Each email should be listed once in the output.",
        examples: [
            { input: "Person table with emails ['a@b.com', 'c@d.com', 'a@b.com']", output: "['a@b.com']", explanation: "'a@b.com' appears twice in the table." },
            { input: "Person table with distinct emails only", output: "Empty result set", explanation: "No duplicate records exist." }
        ],
        hints: [
            "Hint 1: Group the rows by the email column.",
            "Hint 2: Use the HAVING clause with COUNT(email) > 1 to filter out unique emails."
        ],
        starterCode: `-- Write your SQL solution below
SELECT email
FROM Person
GROUP BY email
HAVING COUNT(email) > 1;`,
        testCases: [
            { input: "Duplicate 'john@example.com' present", expectedOutput: "john@example.com", isHidden: false },
            { input: "All unique emails in Person table", expectedOutput: "0 rows", isHidden: false },
            { input: "Multiple distinct duplicates", expectedOutput: "alpha@corp.com, beta@corp.com", isHidden: true }
        ],
        rubricCriteria: "Uses GROUP BY with HAVING COUNT(*) > 1 without table full-scan duplicates.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html"
    },
    {
        id: "sql-05",
        title: "Find Consecutive Numbers in Logs",
        skill: "SQL",
        topic: "Window Functions and Sequences",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Detect sequential data patterns using window functions (LEAD/LAG) or self-joins.",
        prerequisites: ["Window functions (LEAD/LAG)", "Subqueries or CTEs"],
        description: "Given a table `Logs` with columns `id` (auto-increment int) and `num` (varchar), find all numbers that appear at least three times consecutively in order of `id`.",
        examples: [
            { input: "Logs id 1: 1, id 2: 1, id 3: 1, id 4: 2, id 5: 1, id 6: 2, id 7: 2", output: "num = 1", explanation: "1 is the only number appearing consecutively at ids 1, 2, 3." }
        ],
        hints: [
            "Hint 1: Use LAG(num, 1) and LAG(num, 2) OVER (ORDER BY id) to inspect preceding values.",
            "Hint 2: Check where num equals both lag1 and lag2, then use DISTINCT to avoid duplicates."
        ],
        starterCode: `-- Find numbers appearing at least 3 consecutive times
SELECT DISTINCT num AS ConsecutiveNums
FROM (
    SELECT num,
           LAG(num, 1) OVER (ORDER BY id) AS prev1,
           LAG(num, 2) OVER (ORDER BY id) AS prev2
    FROM Logs
) t
WHERE num = prev1 AND num = prev2;`,
        testCases: [
            { input: "Sequence with three consecutive 1s", expectedOutput: "1", isHidden: false },
            { input: "No three consecutive occurrences", expectedOutput: "Empty set", isHidden: false },
            { input: "Multiple different consecutive triples", expectedOutput: "1, 3", isHidden: true }
        ],
        rubricCriteria: "Accurate sequence window calculation in single table pass.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html"
    },
    {
        id: "sql-06",
        title: "Employees Earning More Than Their Managers",
        skill: "SQL",
        topic: "Joins and Subqueries",
        difficulty: "Easy",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Understand self-joins to query hierarchical parent-child relationships within one table.",
        prerequisites: ["Self-JOIN", "WHERE condition on multiple table aliases"],
        description: "The `Employee` table has columns `id`, `name`, `salary`, and `managerId`. Write an SQL query to find employees who earn more than their direct manager.",
        examples: [
            { input: "Joe (salary 70000, managerId 3), Sam (salary 60000, managerId null), Max (manager, salary 60000)", output: "Employee: Joe", explanation: "Joe earns 70000 while his manager Max earns 60000." }
        ],
        hints: [
            "Hint 1: Join the Employee table to itself: alias one as 'e' (employee) and another as 'm' (manager).",
            "Hint 2: Connect them ON e.managerId = m.id and filter WHERE e.salary > m.salary."
        ],
        starterCode: `-- Find employees earning more than their manager
SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;`,
        testCases: [
            { input: "Joe earns 70k, manager earns 60k", expectedOutput: "Joe", isHidden: false },
            { input: "Manager earns more than all subordinates", expectedOutput: "0 rows", isHidden: false },
            { input: "Employees without managers (managerId IS NULL)", expectedOutput: "Handled without NULL comparison errors", isHidden: true }
        ],
        rubricCriteria: "Clean inner join on parent key with proper alias qualification.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/join.html"
    },
    {
        id: "sql-07",
        title: "Department Top 3 Salaries (DENSE_RANK)",
        skill: "SQL",
        topic: "Window Functions and Ranking",
        difficulty: "Hard",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Apply DENSE_RANK() OVER (PARTITION BY ... ORDER BY ...) to solve top-N grouped queries.",
        prerequisites: ["DENSE_RANK()", "PARTITION BY", "Common Table Expressions (CTE)"],
        description: "A company's executives want to see who earns the most money in each of the company's departments. A high earner in a department is an employee whose salary is in the top three unique salaries for that department. Write an SQL query to find all such employees.",
        examples: [
            { input: "IT department with salaries [90k, 85k, 85k, 70k, 69k]", output: "IT employees with 90k, 85k (both), and 70k", explanation: "The top 3 unique salaries are 90k, 85k, and 70k." }
        ],
        hints: [
            "Hint 1: Use DENSE_RANK() so identical salaries share the same rank without skipping subsequent ranks.",
            "Hint 2: Partition by departmentId and order by salary DESC."
        ],
        starterCode: `-- Department Top 3 Salaries using DENSE_RANK
WITH RankedSalaries AS (
    SELECT d.name AS Department,
           e.name AS Employee,
           e.salary AS Salary,
           DENSE_RANK() OVER (PARTITION BY e.departmentId ORDER BY e.salary DESC) AS rnk
    FROM Employee e
    JOIN Department d ON e.departmentId = d.id
)
SELECT Department, Employee, Salary
FROM RankedSalaries
WHERE rnk <= 3;`,
        testCases: [
            { input: "Salaries with ties in top 3", expectedOutput: "All tied employees included in rank", isHidden: false },
            { input: "Department with fewer than 3 employees", expectedOutput: "All department employees returned", isHidden: false },
            { input: "Multi-department organization", expectedOutput: "Partitions computed independently per department", isHidden: true }
        ],
        rubricCriteria: "Correct partition ranking using DENSE_RANK without skipping ties.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-function-descriptions.html#function_dense-rank"
    },
    {
        id: "sql-08",
        title: "Nth Highest Salary Function",
        skill: "SQL",
        topic: "Functions and Subqueries",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Construct modular SQL logic or stored functions to query dynamic rank offsets.",
        prerequisites: ["DISTINCT", "ORDER BY DESC", "LIMIT OFFSET or DENSE_RANK"],
        description: "Write a SQL query or function `getNthHighestSalary(N INT)` that returns the Nth highest distinct salary from the `Employee` table. If there is no Nth highest salary, return `NULL`.",
        examples: [
            { input: "Employee table with salaries [100, 200, 300], N = 2", output: "200", explanation: "200 is the 2nd highest distinct salary." },
            { input: "Employee table with salaries [100], N = 2", output: "null", explanation: "There is no 2nd distinct salary." }
        ],
        hints: [
            "Hint 1: Set offset = N - 1 when using LIMIT 1 OFFSET (N - 1).",
            "Hint 2: Alternatively, select distinct salary where DENSE_RANK() = N."
        ],
        starterCode: `-- Return the Nth highest distinct salary
SELECT (
    SELECT DISTINCT salary
    FROM Employee
    ORDER BY salary DESC
    LIMIT 1 OFFSET 1 -- Replace offset with (N - 1)
) AS NthHighestSalary;`,
        testCases: [
            { input: "Salaries [100, 200, 300], N = 2", expectedOutput: "200", isHidden: false },
            { input: "Salaries [100], N = 2", expectedOutput: "null", isHidden: false },
            { input: "Salaries with duplicate maximums [300, 300, 200], N = 2", expectedOutput: "200", isHidden: true }
        ],
        rubricCriteria: "Proper handling of duplicate values and out-of-range N returning NULL.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/select.html"
    },
    {
        id: "sql-09",
        title: "Delete Duplicate Records Keeping Smallest ID",
        skill: "SQL",
        topic: "DML and Data Cleanup",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Perform safe, idempotent DELETE operations on duplicate rows using self-joins.",
        prerequisites: ["DELETE statement", "Table self-join in DELETE"],
        description: "Write an SQL statement to delete all duplicate email entries in `Person`, keeping only the unique email with the smallest `id`.",
        examples: [
            { input: "Person has ids [1: john@x.com, 2: bob@x.com, 3: john@x.com]", output: "Row with id 3 deleted; ids 1 and 2 remain", explanation: "Id 1 is smaller than id 3 for john@x.com." }
        ],
        hints: [
            "Hint 1: You can perform a self-join in a DELETE query: `DELETE p1 FROM Person p1, Person p2`.",
            "Hint 2: Filter with `p1.email = p2.email AND p1.id > p2.id` to remove the larger id."
        ],
        starterCode: `-- Delete duplicates keeping the minimum id
DELETE p1
FROM Person p1
JOIN Person p2 ON p1.email = p2.email AND p1.id > p2.id;`,
        testCases: [
            { input: "Person rows with IDs 1, 2, 3 where 1 & 3 share email", expectedOutput: "Only row 3 removed", isHidden: false },
            { input: "No duplicate emails", expectedOutput: "0 rows affected", isHidden: false },
            { input: "Triplicate email IDs 10, 11, 12", expectedOutput: "Rows 11 and 12 deleted", isHidden: true }
        ],
        rubricCriteria: "Idempotent DML removing only higher IDs without deleting all copies.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/delete.html"
    },
    {
        id: "sql-10",
        title: "Active User Monthly Retention Rate",
        skill: "SQL",
        topic: "Analytics and Business Metrics",
        difficulty: "Hard",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Compute cohort retention percentage using multi-month activity logs.",
        prerequisites: ["DATE_FORMAT / DATE functions", "COUNT(DISTINCT)", "Self-JOIN on user_id"],
        description: "Given a table `UserLogins` with `user_id` (int) and `login_date` (date), calculate the month-over-month retention rate: the percentage of users who logged in during a given month who also logged in during the subsequent month.",
        examples: [
            { input: "100 users active in Jan, 70 of them active in Feb", output: "Jan cohort retention: 70.00%", explanation: "70 / 100 * 100% = 70.0%." }
        ],
        hints: [
            "Hint 1: Create a monthly active user CTE with user_id and login_month.",
            "Hint 2: Self-join on user_id where month2 = DATE_ADD(month1, INTERVAL 1 MONTH)."
        ],
        starterCode: `-- Monthly retention rate calculation
WITH MonthlyUsers AS (
    SELECT DISTINCT user_id, DATE_FORMAT(login_date, '%Y-%m-01') AS cohort_month
    FROM UserLogins
)
SELECT m1.cohort_month,
       COUNT(DISTINCT m1.user_id) AS total_users,
       COUNT(DISTINCT m2.user_id) AS retained_users,
       ROUND(COUNT(DISTINCT m2.user_id) * 100.0 / COUNT(DISTINCT m1.user_id), 2) AS retention_rate
FROM MonthlyUsers m1
LEFT JOIN MonthlyUsers m2
  ON m1.user_id = m2.user_id
 AND m2.cohort_month = DATE_ADD(m1.cohort_month, INTERVAL 1 MONTH)
GROUP BY m1.cohort_month
ORDER BY m1.cohort_month;`,
        testCases: [
            { input: "Users active in consecutive months", expectedOutput: "Correct retention ratio computed", isHidden: false },
            { input: "Zero retention in following month", expectedOutput: "0.00%", isHidden: false },
            { input: "Sparse user activity over multiple quarters", expectedOutput: "Cohort tracked per calendar month", isHidden: true }
        ],
        rubricCriteria: "Accurate cohort definition and safe percentage calculation without divide-by-zero.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html"
    },
    {
        id: "sql-11",
        title: "Bank Account Balance & Transaction Rollup",
        skill: "SQL",
        topic: "Financial Aggregations and CASE WHEN",
        difficulty: "Medium",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Aggregate signed transaction ledgers into net current balances per account.",
        prerequisites: ["CASE WHEN conditional aggregation", "SUM() with negative values", "GROUP BY"],
        description: "Given `Accounts (account_id, initial_balance)` and `Transactions (trans_id, account_id, type ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER_OUT', 'TRANSFER_IN'], amount)`, calculate each account's final current balance.",
        examples: [
            { input: "Account 101 initial 1000, DEPOSIT 500, WITHDRAWAL 200", output: "account_id 101, balance 1300", explanation: "1000 + 500 - 200 = 1300." }
        ],
        hints: [
            "Hint 1: Use CASE WHEN type IN ('DEPOSIT', 'TRANSFER_IN') THEN amount ELSE -amount END.",
            "Hint 2: Left join Transactions to Accounts so accounts with 0 transactions retain initial balance."
        ],
        starterCode: `-- Calculate current balance from ledger
SELECT a.account_id,
       a.initial_balance + COALESCE(SUM(
           CASE
               WHEN t.type IN ('DEPOSIT', 'TRANSFER_IN') THEN t.amount
               WHEN t.type IN ('WITHDRAWAL', 'TRANSFER_OUT') THEN -t.amount
               ELSE 0
           END
       ), 0) AS current_balance
FROM Accounts a
LEFT JOIN Transactions t ON a.account_id = t.account_id
GROUP BY a.account_id, a.initial_balance;`,
        testCases: [
            { input: "Initial 500, +200, -100", expectedOutput: "600", isHidden: false },
            { input: "Account with no transactions", expectedOutput: "Retains initial balance", isHidden: false },
            { input: "Zero balance and overdraft handling", expectedOutput: "Exact net arithmetic", isHidden: true }
        ],
        rubricCriteria: "COALESCE prevents NULL on inactive accounts; signed aggregation is accurate.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html#operator_case"
    },
    {
        id: "sql-12",
        title: "ACID Transaction with Rollback for Insufficient Funds",
        skill: "SQL",
        topic: "DBMS Transactions and ACID Properties",
        difficulty: "Hard",
        track: "Must-Solve",
        priority: "Must-Learn Core",
        objective: "Demonstrate transaction isolation, explicit rollback, and atomic balance transfer.",
        prerequisites: ["START TRANSACTION / COMMIT / ROLLBACK", "Row-level locking (SELECT ... FOR UPDATE)"],
        description: "Write a transactional SQL script or stored procedure that transfers `X` dollars from `source_account` to `target_account`. If the source account balance is less than `X`, roll back the transaction and raise an error; otherwise, commit both balance updates atomically.",
        examples: [
            { input: "Source has 500, transfer 300 to Target", output: "Committed: Source has 200, Target has +300", explanation: "Atomic debit and credit completed." },
            { input: "Source has 100, transfer 300 to Target", output: "Rolled back: Insufficient funds exception", explanation: "No accounts modified due to rollback." }
        ],
        hints: [
            "Hint 1: Start with START TRANSACTION.",
            "Hint 2: Lock the source row with SELECT balance FROM Accounts WHERE id = src FOR UPDATE.",
            "Hint 3: Use an IF condition to check balance >= amount, performing COMMIT or ROLLBACK."
        ],
        starterCode: `-- Atomic money transfer transaction
START TRANSACTION;

SELECT balance INTO @src_bal
FROM Accounts
WHERE account_id = 1
FOR UPDATE;

-- Check and execute transfer
IF @src_bal >= 200 THEN
    UPDATE Accounts SET balance = balance - 200 WHERE account_id = 1;
    UPDATE Accounts SET balance = balance + 200 WHERE account_id = 2;
    COMMIT;
ELSE
    ROLLBACK;
END IF;`,
        testCases: [
            { input: "Sufficient balance (500 >= 200)", expectedOutput: "COMMIT executed, balances updated", isHidden: false },
            { input: "Insufficient balance (100 < 200)", expectedOutput: "ROLLBACK executed, balances untouched", isHidden: false },
            { input: "Concurrent transaction collision", expectedOutput: "Row locked with FOR UPDATE", isHidden: true }
        ],
        rubricCriteria: "Guarantees Atomicity and Isolation; prevents race conditions with pessimistic locking.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/innodb-locking-reads.html"
    },

    // ==========================================
    // CODING PRACTICE TRACK (Progressive Practice)
    // ==========================================
    {
        id: "sql-13",
        title: "Filter Products by Category and Stock Level",
        skill: "SQL",
        topic: "Basic Queries and Filtering",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Practice compound boolean logic with WHERE, AND, OR, and ORDER BY.",
        prerequisites: ["SELECT", "WHERE", "Comparison operators"],
        description: "Select `product_id`, `name`, `unit_price`, and `stock_quantity` from `Products` for items where `category = 'Electronics'`, `unit_price BETWEEN 50 AND 500`, and `stock_quantity > 0`. Order by `unit_price` ascending.",
        examples: [
            { input: "Products with various categories and prices", output: "Electronics between $50 and $500 in stock, sorted by price", explanation: "Standard multi-condition filter." }
        ],
        hints: [
            "Hint 1: Use `category = 'Electronics' AND unit_price BETWEEN 50 AND 500 AND stock_quantity > 0`.",
            "Hint 2: Add `ORDER BY unit_price ASC` at the end."
        ],
        starterCode: `-- Filter products by category, price, and stock
SELECT product_id, name, unit_price, stock_quantity
FROM Products
WHERE category = 'Electronics'
  AND unit_price BETWEEN 50 AND 500
  AND stock_quantity > 0
ORDER BY unit_price ASC;`,
        testCases: [
            { input: "Matching electronics in stock", expectedOutput: "Filtered sorted rows", isHidden: false },
            { input: "Out-of-stock items (stock = 0)", expectedOutput: "Excluded from result", isHidden: false },
            { input: "Price boundary values 50 and 500", expectedOutput: "Inclusive boundaries included", isHidden: true }
        ],
        rubricCriteria: "Correct inclusive range filter and sorting.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/comparison-operators.html#operator_between"
    },
    {
        id: "sql-14",
        title: "Calculate Average Order Value per Customer",
        skill: "SQL",
        topic: "Aggregations and Grouping",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Use AVG, COUNT, and ROUND with GROUP BY to summarize customer purchasing behavior.",
        prerequisites: ["GROUP BY", "Aggregate functions (AVG, COUNT)", "ROUND()"],
        description: "Given table `Orders (order_id, customer_id, order_total, order_date)`, return each `customer_id`, total orders placed as `order_count`, and average order total as `avg_order_value` rounded to 2 decimal places. Only include customers who have placed at least 2 orders.",
        examples: [
            { input: "Customer 1 placed 3 orders totaling 300", output: "customer_id 1, order_count 3, avg_order_value 100.00", explanation: "300 / 3 = 100.00." }
        ],
        hints: [
            "Hint 1: Group by customer_id.",
            "Hint 2: Filter with HAVING COUNT(order_id) >= 2."
        ],
        starterCode: `-- Average order value per customer with >= 2 orders
SELECT customer_id,
       COUNT(order_id) AS order_count,
       ROUND(AVG(order_total), 2) AS avg_order_value
FROM Orders
GROUP BY customer_id
HAVING COUNT(order_id) >= 2
ORDER BY avg_order_value DESC;`,
        testCases: [
            { input: "Customer with 3 orders", expectedOutput: "Included with correct rounded average", isHidden: false },
            { input: "Customer with 1 order", expectedOutput: "Filtered out by HAVING clause", isHidden: false },
            { input: "Order total with fractional cents", expectedOutput: "Rounded to 2 decimal places", isHidden: true }
        ],
        rubricCriteria: "Accurate HAVING filter and 2-decimal arithmetic rounding.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/aggregate-functions.html"
    },
    {
        id: "sql-15",
        title: "Find Latest Login Timestamp for Each User",
        skill: "SQL",
        topic: "Aggregations and Grouping",
        difficulty: "Easy",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Extract the most recent event per user utilizing MAX() grouped aggregation.",
        prerequisites: ["MAX() aggregate function", "LEFT JOIN or GROUP BY"],
        description: "Given `Users (user_id, username)` and `Logins (login_id, user_id, login_timestamp, ip_address)`, return `username` and their most recent login as `last_login`. If a user has never logged in, display 'Never Logged In'.",
        examples: [
            { input: "User 'alice' logged in Jan 1 and Jan 15", output: "alice | 2026-01-15 10:00:00", explanation: "Most recent timestamp displayed." },
            { input: "User 'bob' has 0 login records", output: "bob | Never Logged In", explanation: "COALESCE or IFNULL replaces NULL." }
        ],
        hints: [
            "Hint 1: Use a LEFT JOIN from Users to Logins.",
            "Hint 2: Wrap MAX(login_timestamp) in COALESCE(..., 'Never Logged In')."
        ],
        starterCode: `-- Latest login per user with fallback label
SELECT u.username,
       COALESCE(CAST(MAX(l.login_timestamp) AS CHAR), 'Never Logged In') AS last_login
FROM Users u
LEFT JOIN Logins l ON u.user_id = l.user_id
GROUP BY u.user_id, u.username;`,
        testCases: [
            { input: "User with multiple logins", expectedOutput: "Returns highest timestamp", isHidden: false },
            { input: "User without any logins", expectedOutput: "'Never Logged In'", isHidden: false },
            { input: "Users created at the same second", expectedOutput: "All users represented in output", isHidden: true }
        ],
        rubricCriteria: "Handles NULLs gracefully via LEFT JOIN and COALESCE.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/group-by-handling.html"
    },
    {
        id: "sql-16",
        title: "Running Total of Daily Sales",
        skill: "SQL",
        topic: "Window Functions and Running Totals",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Calculate cumulative running sums over ordered date dimensions using window functions.",
        prerequisites: ["SUM() OVER (ORDER BY ...)", "Window framing rules"],
        description: "Given table `DailySales (sale_date DATE, daily_amount DECIMAL(10,2))`, write a query to display `sale_date`, `daily_amount`, and the cumulative running total of sales up to and including that date as `running_total`.",
        examples: [
            { input: "Day 1: 100, Day 2: 150, Day 3: 200", output: "Day 1: 100, Day 2: 250, Day 3: 450", explanation: "Cumulative addition of daily revenues." }
        ],
        hints: [
            "Hint 1: Use `SUM(daily_amount) OVER (ORDER BY sale_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)`."
        ],
        starterCode: `-- Cumulative running total of sales
SELECT sale_date,
       daily_amount,
       SUM(daily_amount) OVER (
           ORDER BY sale_date
           ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_total
FROM DailySales
ORDER BY sale_date ASC;`,
        testCases: [
            { input: "Three sequential dates with sales", expectedOutput: "[100, 250, 450]", isHidden: false },
            { input: "Single date record", expectedOutput: "running_total equals daily_amount", isHidden: false },
            { input: "Days with zero daily sales", expectedOutput: "Running total remains flat without drop", isHidden: true }
        ],
        rubricCriteria: "Exact unbounded preceding window specification.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-functions-usage.html"
    },
    {
        id: "sql-17",
        title: "Customer First Purchase Month (Cohort Grouping)",
        skill: "SQL",
        topic: "Subqueries and Date Grouping",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Determine user cohort inception dates using MIN() subqueries.",
        prerequisites: ["Subqueries in FROM clause", "DATE_FORMAT", "MIN() aggregate"],
        description: "Find the total number of new customers acquired in each month based on their very first purchase date in table `Orders (order_id, customer_id, order_date)`.",
        examples: [
            { input: "Customers 1 & 2 first bought in Jan 2026, Customer 3 in Feb 2026", output: "2026-01: 2 new customers, 2026-02: 1 new customer", explanation: "Grouped by first order month." }
        ],
        hints: [
            "Hint 1: First find MIN(order_date) per customer_id in a subquery or CTE.",
            "Hint 2: Format the min date to 'YYYY-MM' and count customers grouped by that month."
        ],
        starterCode: `-- New customers acquired per cohort month
WITH FirstPurchase AS (
    SELECT customer_id,
           MIN(order_date) AS first_date
    FROM Orders
    GROUP BY customer_id
)
SELECT DATE_FORMAT(first_date, '%Y-%m') AS cohort_month,
       COUNT(customer_id) AS new_customers
FROM FirstPurchase
GROUP BY cohort_month
ORDER BY cohort_month ASC;`,
        testCases: [
            { input: "Customers with repeated orders over months", expectedOutput: "Counted only in first order month", isHidden: false },
            { input: "All customers joined in same month", expectedOutput: "Single cohort row with total count", isHidden: false },
            { input: "Multi-year dataset", expectedOutput: "Years distinguished properly (%Y-%m)", isHidden: true }
        ],
        rubricCriteria: "Ensures each customer is assigned exclusively to their true first purchase cohort.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/date-and-time-functions.html#function_date-format"
    },
    {
        id: "sql-18",
        title: "Classify Binary Tree Node Hierarchy Type",
        skill: "SQL",
        topic: "Hierarchies and CASE Logic",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Classify tree nodes as 'Root', 'Inner', or 'Leaf' using conditional CASE checks.",
        prerequisites: ["CASE WHEN", "Subqueries with IN / NOT IN", "NULL comparisons"],
        description: "Given a table `Tree` with columns `id` (node value) and `p_id` (parent node value), write a query to print the node type of each node ordered by `id`: 'Root' if p_id is NULL, 'Leaf' if node is not a parent of any node, and 'Inner' otherwise.",
        examples: [
            { input: "1 (p_id null), 2 (p_id 1), 3 (p_id 1), 4 (p_id 2), 5 (p_id 2)", output: "1: Root, 2: Inner, 3: Leaf, 4: Leaf, 5: Leaf", explanation: "1 has no parent; 2 has parent and children; 3, 4, 5 have no children." }
        ],
        hints: [
            "Hint 1: When p_id IS NULL, the node is 'Root'.",
            "Hint 2: When id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL), it's 'Inner'. Otherwise 'Leaf'."
        ],
        starterCode: `-- Classify tree nodes: Root, Inner, or Leaf
SELECT id,
       CASE
           WHEN p_id IS NULL THEN 'Root'
           WHEN id IN (SELECT p_id FROM Tree WHERE p_id IS NOT NULL) THEN 'Inner'
           ELSE 'Leaf'
       END AS type
FROM Tree
ORDER BY id ASC;`,
        testCases: [
            { input: "Root with children and leaves", expectedOutput: "Correct classification for all 3 types", isHidden: false },
            { input: "Single-node tree (only root)", expectedOutput: "Root", isHidden: false },
            { input: "Linear linked-list tree", expectedOutput: "Root -> Inner -> Leaf", isHidden: true }
        ],
        rubricCriteria: "Proper handling of NULL in subquery prevents three-valued logic pitfall.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/control-flow-functions.html"
    },
    {
        id: "sql-19",
        title: "Median Salary by Department",
        skill: "SQL",
        topic: "Window Functions and Statistics",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Calculate statistical medians over partitions without built-in MEDIAN functions.",
        prerequisites: ["ROW_NUMBER() OVER (PARTITION BY ...)", "COUNT(*) OVER (PARTITION BY ...)", "AVG()"],
        description: "Write an SQL query to calculate the median salary for each department in `Employee (id, name, department_id, salary)`. If a department has an even number of employees, the median is the average of the two middle salaries.",
        examples: [
            { input: "Dept 1 salaries: [100, 200, 300]", output: "Dept 1 median: 200.00", explanation: "Middle element of 3 items is index 2 (200)." },
            { input: "Dept 2 salaries: [100, 200, 300, 400]", output: "Dept 2 median: 250.00", explanation: "Average of middle elements 200 and 300 is 250.00." }
        ],
        hints: [
            "Hint 1: Use ROW_NUMBER() and COUNT(*) partitioned by department_id.",
            "Hint 2: The median elements satisfy `rn IN (FLOOR((cnt + 1)/2), CEIL((cnt + 1)/2))`."
        ],
        starterCode: `-- Median salary calculation per department
WITH RankedSalaries AS (
    SELECT department_id,
           salary,
           ROW_NUMBER() OVER (PARTITION BY department_id ORDER BY salary) AS rn,
           COUNT(*) OVER (PARTITION BY department_id) AS total_count
    FROM Employee
)
SELECT department_id,
       ROUND(AVG(salary), 2) AS median_salary
FROM RankedSalaries
WHERE rn IN (FLOOR((total_count + 1) / 2.0), CEIL((total_count + 1) / 2.0))
GROUP BY department_id;`,
        testCases: [
            { input: "Odd number of employee salaries", expectedOutput: "Exact middle value", isHidden: false },
            { input: "Even number of employee salaries", expectedOutput: "Average of two middle values", isHidden: false },
            { input: "Single employee department", expectedOutput: "Salary itself", isHidden: true }
        ],
        rubricCriteria: "Handles both odd and even partition sizes accurately with rounding.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-functions.html"
    },
    {
        id: "sql-20",
        title: "Index Design & Query Optimization Formulation",
        skill: "SQL",
        topic: "DBMS Indexing and Query Plans",
        difficulty: "Medium",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Design optimal composite indexes conforming to the Leftmost Prefix Rule for complex filters.",
        prerequisites: ["B-Tree Indexes", "EXPLAIN execution plan", "Covering indexes"],
        description: "Given a high-traffic query: `SELECT user_id, order_date, status, total_amount FROM Orders WHERE tenant_id = 42 AND status = 'COMPLETED' AND order_date >= '2026-01-01' ORDER BY order_date DESC;`, formulate the exact DDL to create the optimal covering composite index that eliminates filesort and table lookups.",
        examples: [
            { input: "Query with equality filters on tenant_id, status and range on order_date", output: "CREATE INDEX idx_orders_opt ON Orders (tenant_id, status, order_date DESC, total_amount, user_id);", explanation: "Equality columns first, range column next, included columns to make index covering." }
        ],
        hints: [
            "Hint 1: Follow the ESR rule: Equality columns first, Sort columns second, Range columns third.",
            "Hint 2: Include selected columns to avoid secondary table index lookups (covering index)."
        ],
        starterCode: `-- Optimal composite covering index DDL
CREATE INDEX idx_orders_optimal
ON Orders (tenant_id, status, order_date, total_amount, user_id);`,
        testCases: [
            { input: "EXPLAIN check for 'Using index' (covering)", expectedOutput: "Zero temporary table and filesort", isHidden: false },
            { input: "Prefix index matching for tenant_id queries", expectedOutput: "Utilizes index prefix", isHidden: false },
            { input: "High cardinality range filter", expectedOutput: "Range scan bounded effectively", isHidden: true }
        ],
        rubricCriteria: "Correct column ordering respecting leftmost prefix rule for equality and range predicates.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/multiple-column-indexes.html"
    },
    {
        id: "sql-21",
        title: "Gaps and Islands Streak Days Problem",
        skill: "SQL",
        topic: "Advanced Window Functions and Sequences",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Solve the classic SQL Gap-and-Island problem to compute consecutive activity streaks.",
        prerequisites: ["ROW_NUMBER()", "DATE_SUB / DATEDIFF", "GROUP BY island identifier"],
        description: "Given user activity logs `UserActivity (user_id, activity_date)`, find the longest consecutive streak of active days for each user.",
        examples: [
            { input: "User active on [2026-01-01, 2026-01-02, 2026-01-03, 2026-01-05, 2026-01-06]", output: "Longest streak: 3 days (Jan 1-3)", explanation: "Two islands exist: 3-day island and 2-day island. Max is 3." }
        ],
        hints: [
            "Hint 1: `activity_date - ROW_NUMBER() days` produces a constant group key for each consecutive island.",
            "Hint 2: Group by user_id and this computed group key, take COUNT(*), then find the MAX streak per user."
        ],
        starterCode: `-- Find longest consecutive active days streak per user
WITH DistinctDates AS (
    SELECT DISTINCT user_id, activity_date
    FROM UserActivity
),
Streaks AS (
    SELECT user_id,
           activity_date,
           DATE_SUB(activity_date, INTERVAL ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY activity_date) DAY) AS island_group
    FROM DistinctDates
),
StreakLengths AS (
    SELECT user_id,
           island_group,
           COUNT(*) AS streak_days
    FROM Streaks
    GROUP BY user_id, island_group
)
SELECT user_id,
       MAX(streak_days) AS longest_streak
FROM StreakLengths
GROUP BY user_id;`,
        testCases: [
            { input: "Active Jan 1, 2, 3, 5, 6", expectedOutput: "Longest streak: 3", isHidden: false },
            { input: "Non-consecutive single days", expectedOutput: "Longest streak: 1", isHidden: false },
            { input: "Continuous 30-day streak", expectedOutput: "Longest streak: 30", isHidden: true }
        ],
        rubricCriteria: "Robust island calculation using date-row_number offset technique.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-functions.html"
    },
    {
        id: "sql-22",
        title: "Sliding Window 7-Day Moving Average Revenue",
        skill: "SQL",
        topic: "Window Functions and Moving Averages",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Formulate range-based and row-based sliding window moving averages.",
        prerequisites: ["AVG() OVER (ORDER BY ... ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)"],
        description: "Given `DailyRevenue (rev_date DATE, amount DECIMAL(10,2))`, write a query returning each `rev_date`, that day's `amount`, and the 7-day moving average of revenue (average of current day and previous 6 days) as `moving_avg_7d`, rounded to 2 decimal places.",
        examples: [
            { input: "Sequential revenue logs for 14 days", output: "Moving average computed using 7-day window", explanation: "Smooths daily volatility." }
        ],
        hints: [
            "Hint 1: Use `ROWS BETWEEN 6 PRECEDING AND CURRENT ROW` inside the OVER clause.",
            "Hint 2: Round result to 2 decimal places with `ROUND(..., 2)`."
        ],
        starterCode: `-- 7-day moving average revenue
SELECT rev_date,
       amount,
       ROUND(AVG(amount) OVER (
           ORDER BY rev_date
           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
       ), 2) AS moving_avg_7d
FROM DailyRevenue
ORDER BY rev_date ASC;`,
        testCases: [
            { input: "Initial 7 days with equal revenue 100", expectedOutput: "100.00", isHidden: false },
            { input: "Spike on day 4 followed by drop", expectedOutput: "Gradual decay across 7-day window", isHidden: false },
            { input: "Fewer than 7 days total", expectedOutput: "Averages available preceding rows correctly", isHidden: true }
        ],
        rubricCriteria: "Precise frame specification avoiding boundary errors on partial weeks.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/window-functions-usage.html"
    },
    {
        id: "sql-23",
        title: "Deadlock Prevention and Optimistic Locking Design",
        skill: "SQL",
        topic: "DBMS Concurrency and Locking",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Implement version-column optimistic locking updates to prevent lost updates.",
        prerequisites: ["Optimistic concurrency control", "UPDATE ... WHERE version = expected_version"],
        description: "Write an SQL statement pattern for optimistic locking on table `ProductInventory (product_id, quantity, version)`. Decrement quantity by 5 for product_id 101, incrementing version by 1, succeeding only if the version in the database matches the expected version (3). Return the number of rows affected.",
        examples: [
            { input: "product_id 101 at version 3", output: "1 row updated, version becomes 4", explanation: "Optimistic check passed." },
            { input: "Another transaction already updated version to 4", output: "0 rows updated (concurrency conflict detected)", explanation: "Application catches 0 rows updated and retries." }
        ],
        hints: [
            "Hint 1: `UPDATE ProductInventory SET quantity = quantity - 5, version = version + 1 WHERE product_id = 101 AND version = 3`.",
            "Hint 2: If rows affected is 0, a concurrent modification occurred."
        ],
        starterCode: `-- Optimistic locking conditional update
UPDATE ProductInventory
SET quantity = quantity - 5,
    version = version + 1
WHERE product_id = 101
  AND version = 3
  AND quantity >= 5;`,
        testCases: [
            { input: "Version matches expected (version = 3)", expectedOutput: "1 row affected, version updated to 4", isHidden: false },
            { input: "Stale version (database has version = 4)", expectedOutput: "0 rows affected", isHidden: false },
            { input: "Insufficient quantity (quantity < 5)", expectedOutput: "0 rows affected", isHidden: true }
        ],
        rubricCriteria: "Atomic version verification and decrement preventing race conditions without heavy table locks.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html"
    },
    {
        id: "sql-24",
        title: "E-Commerce Schema DDL with Cascades and Check Constraints",
        skill: "SQL",
        topic: "Schema Design and Integrity Constraints",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Author normalized relational DDL with Primary Keys, Foreign Keys, CASCADE rules, and CHECK constraints.",
        prerequisites: ["CREATE TABLE DDL", "FOREIGN KEY ... ON DELETE CASCADE", "CHECK constraints"],
        description: "Write the SQL DDL to create two normalized tables: `Customers (id PK, email UNIQUE, status)` and `Orders (id PK, customer_id FK referencing Customers with ON DELETE CASCADE, total_amount DECIMAL(10,2) CHECK > 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`.",
        examples: [
            { input: "Customer deleted", output: "All corresponding orders automatically deleted via CASCADE", explanation: "Referential integrity preserved." }
        ],
        hints: [
            "Hint 1: Use `CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES Customers(id) ON DELETE CASCADE`.",
            "Hint 2: Add `CONSTRAINT chk_total CHECK (total_amount > 0)`."
        ],
        starterCode: `-- Normalized tables with referential integrity constraints
CREATE TABLE Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE Orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_customer
        FOREIGN KEY (customer_id) REFERENCES Customers(id)
        ON DELETE CASCADE,
    CONSTRAINT chk_order_total
        CHECK (total_amount > 0)
);`,
        testCases: [
            { input: "Insert order with positive total", expectedOutput: "Success", isHidden: false },
            { input: "Insert order with total_amount = -10", expectedOutput: "CHECK constraint violation error", isHidden: false },
            { input: "Delete customer", expectedOutput: "Cascading deletion of associated orders", isHidden: true }
        ],
        rubricCriteria: "3NF compliance, proper constraint naming, and cascading foreign key mechanics.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/create-table.html"
    },
    {
        id: "sql-25",
        title: "Hierarchical Organization Chart via Recursive CTE",
        skill: "SQL",
        topic: "Recursive CTEs and Graphs",
        difficulty: "Hard",
        track: "Coding Practice",
        priority: "Standard Practice",
        objective: "Traverse indefinite depth organizational hierarchies using WITH RECURSIVE queries.",
        prerequisites: ["WITH RECURSIVE", "Anchor query and Recursive query with UNION ALL"],
        description: "Given `Employees (emp_id, name, manager_id)`, write a recursive SQL query to generate the management chain for every employee starting from the CEO (`manager_id IS NULL`), computing their hierarchy level (0 for CEO, 1 for direct reports, 2 for next level) and full reporting path as a string.",
        examples: [
            { input: "CEO Alice -> Manager Bob -> Developer Charlie", output: "Charlie: level 2, path 'Alice -> Bob -> Charlie'", explanation: "Recursive depth traversal." }
        ],
        hints: [
            "Hint 1: Anchor member: `SELECT emp_id, name, manager_id, 0 AS level, CAST(name AS CHAR(1000)) AS path FROM Employees WHERE manager_id IS NULL`.",
            "Hint 2: Recursive member joins `Employees e` with CTE `c ON e.manager_id = c.emp_id`."
        ],
        starterCode: `-- Recursive CTE for Organization Hierarchy
WITH RECURSIVE OrgHierarchy AS (
    -- Anchor member: CEO
    SELECT emp_id,
           name,
           manager_id,
           0 AS level,
           CAST(name AS CHAR(1000)) AS path
    FROM Employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive member: Subordinates
    SELECT e.emp_id,
           e.name,
           e.manager_id,
           o.level + 1,
           CONCAT(o.path, ' -> ', e.name)
    FROM Employees e
    JOIN OrgHierarchy o ON e.manager_id = o.emp_id
)
SELECT emp_id, name, level, path
FROM OrgHierarchy
ORDER BY level, emp_id;`,
        testCases: [
            { input: "3-level reporting tree", expectedOutput: "Levels 0, 1, 2 with accumulated breadcrumb paths", isHidden: false },
            { input: "Multiple managers reporting to CEO", expectedOutput: "Independent hierarchy branches parsed", isHidden: false },
            { input: "Deep 10-level corporate structure", expectedOutput: "Full recursive traversal without infinite loops", isHidden: true }
        ],
        rubricCriteria: "Clean termination of recursive CTE and correct path concatenation.",
        sourceUrl: "https://dev.mysql.com/doc/refman/8.0/en/with.html#recursive-common-table-expressions"
    }
];

if (typeof window !== "undefined") {
    window.SQL_DBMS_PROBLEMS = SQL_DBMS_PROBLEMS;
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { SQL_DBMS_PROBLEMS };
}
