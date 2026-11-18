const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// ─── In-Memory Data Store ─────────────────────────────────────────────────────
let leaves = [
  {
    id: 701,
    employeeName: "Ananya Singh",
    employeeCode: "EMP101",
    leaveType: "Casual",
    days: 2,
    status: "Pending",
  },
  {
    id: 702,
    employeeName: "Rahul Verma",
    employeeCode: "EMP102",
    leaveType: "Sick",
    days: 1,
    status: "Approved",
  },
  {
    id: 703,
    employeeName: "Simran Kaur",
    employeeCode: "EMP103",
    leaveType: "Earned",
    days: 3,
    status: "Rejected",
  },
];

// Auto-increment ID counter (starts after the last pre-seeded id)
let nextId = 704;

// ─── Validation Constants ─────────────────────────────────────────────────────
const VALID_LEAVE_TYPES = ["Casual", "Sick", "Earned"];
const VALID_STATUSES = ["Pending", "Approved", "Rejected"];

// ─── Helper: Validate a leave request body ────────────────────────────────────
function validateLeaveBody(body) {
  const { employeeName, employeeCode, leaveType, days, status } = body;
  const errors = [];

  if (!employeeName || typeof employeeName !== "string" || employeeName.trim() === "") {
    errors.push("employeeName is required and must be a non-empty string.");
  }

  if (!employeeCode || typeof employeeCode !== "string" || employeeCode.trim() === "") {
    errors.push("employeeCode is required and must be a non-empty string.");
  }

  if (!leaveType || !VALID_LEAVE_TYPES.includes(leaveType)) {
    errors.push(`leaveType is required and must be one of: ${VALID_LEAVE_TYPES.join(", ")}.`);
  }

  if (days === undefined || days === null) {
    errors.push("days is required.");
  } else if (typeof days !== "number" || !Number.isInteger(days) || days <= 0) {
    errors.push("days must be a positive integer.");
  }

  if (!status || !VALID_STATUSES.includes(status)) {
    errors.push(`status is required and must be one of: ${VALID_STATUSES.join(", ")}.`);
  }

  return errors;
}

// ─── Routes ───────────────────────────────────────────────────────────────────

// IMPORTANT: Specific static routes MUST be declared BEFORE the dynamic /:id route
// to prevent them from being treated as IDs (as noted in the assignment).

// ── 1. GET /api/leaves ── Return all leave records ───────────────────────────
app.get("/api/leaves", (req, res) => {
  res.status(200).json(leaves);
});

// ── 6. GET /api/leaves/filter?status=value ── Filter by status ───────────────
// Declared before /:id to avoid being matched as an id
app.get("/api/leaves/filter", (req, res) => {
  const { status } = req.query;

  if (!status) {
    return res.status(400).json({ error: "Query parameter 'status' is required." });
  }

  // Case-insensitive matching as required
  const filtered = leaves.filter(
    (leave) => leave.status.toLowerCase() === status.toLowerCase()
  );

  res.status(200).json(filtered);
});

// ── 7. GET /api/leaves/pending ── Return only Pending leave requests ──────────
// Declared before /:id to avoid being matched as an id
app.get("/api/leaves/pending", (req, res) => {
  const pendingLeaves = leaves.filter((leave) => leave.status === "Pending");
  res.status(200).json(pendingLeaves);
});

// ── 3. GET /api/leaves/:id ── Get a leave request by ID ──────────────────────
app.get("/api/leaves/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format. ID must be a number." });
  }

  const leave = leaves.find((l) => l.id === id);

  if (!leave) {
    return res.status(404).json({ error: `Leave request with ID ${id} not found.` });
  }

  res.status(200).json(leave);
});

// ── 2. POST /api/leaves ── Create a new leave request ────────────────────────
app.post("/api/leaves", (req, res) => {
  const errors = validateLeaveBody(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { employeeName, employeeCode, leaveType, days, status } = req.body;

  const newLeave = {
    id: nextId++,
    employeeName: employeeName.trim(),
    employeeCode: employeeCode.trim(),
    leaveType,
    days,
    status,
  };

  leaves.push(newLeave);
  res.status(201).json(newLeave);
});

// ── 4. PUT /api/leaves/:id ── Update a leave request ─────────────────────────
app.put("/api/leaves/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format. ID must be a number." });
  }

  const index = leaves.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Leave request with ID ${id} not found.` });
  }

  const errors = validateLeaveBody(req.body);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  const { employeeName, employeeCode, leaveType, days, status } = req.body;

  // Update the record in-place while preserving the original id
  leaves[index] = {
    id,
    employeeName: employeeName.trim(),
    employeeCode: employeeCode.trim(),
    leaveType,
    days,
    status,
  };

  res.status(200).json(leaves[index]);
});

// ── 5. DELETE /api/leaves/:id ── Delete a leave request ──────────────────────
app.delete("/api/leaves/:id", (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid ID format. ID must be a number." });
  }

  const index = leaves.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Leave request with ID ${id} not found.` });
  }

  const deleted = leaves.splice(index, 1)[0];

  res.status(200).json({
    message: `Leave request with ID ${id} has been successfully deleted.`,
    deleted,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Employee Leave Management API is running on http://localhost:${PORT}`);
});
