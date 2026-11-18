# Employee Leave Management API

**Set C – Mid-Term Practical Assessment**  
Full Stack Development | Node.js + Express.js  
Port: `3000`

---

## Setup & Run

```bash
npm install
node server.js
```

Server starts at: `http://localhost:3000`

---

## API Endpoints

| # | Method | Endpoint | Description |
|---|--------|----------|-------------|
| 1 | GET | `/api/leaves` | Get all leave records |
| 2 | POST | `/api/leaves` | Create a new leave request |
| 3 | GET | `/api/leaves/:id` | Get a leave request by ID |
| 4 | PUT | `/api/leaves/:id` | Update a leave request by ID |
| 5 | DELETE | `/api/leaves/:id` | Delete a leave request by ID |
| 6 | GET | `/api/leaves/filter?status=value` | Filter leave requests by status (case-insensitive) |
| 7 | GET | `/api/leaves/pending` | Get all Pending leave requests |

---

## Record Structure

| Field | Type | Description |
|-------|------|-------------|
| `id` | Number | Auto-generated unique identifier |
| `employeeName` | String | Employee's full name |
| `employeeCode` | String | Employee's unique code |
| `leaveType` | String | `Casual`, `Sick`, or `Earned` |
| `days` | Number | Positive integer — number of leave days |
| `status` | String | `Pending`, `Approved`, or `Rejected` |

---

## Sample Requests

### POST /api/leaves
```json
{
  "employeeName": "Vikram Das",
  "employeeCode": "EMP104",
  "leaveType": "Earned",
  "days": 2,
  "status": "Pending"
}
```

### PUT /api/leaves/701
```json
{
  "employeeName": "Ananya Singh",
  "employeeCode": "EMP101",
  "leaveType": "Casual",
  "days": 2,
  "status": "Approved"
}
```

---

## Validation Rules

- `employeeName` and `employeeCode` — required, non-empty strings
- `leaveType` — must be one of `Casual`, `Sick`, `Earned`
- `days` — must be a **positive integer**
- `status` — must be one of `Pending`, `Approved`, `Rejected`
- Invalid input returns **HTTP 400**

---

## Notes

- All data is stored **in-memory**; data resets on server restart.
- Static routes (`/filter`, `/pending`) are declared **before** dynamic `/:id` routes to avoid conflicts.
