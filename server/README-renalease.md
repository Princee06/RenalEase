# RenalEase Backend

Node.js + Express + MongoDB (Mongoose) + Firebase Authentication backend for the RenalEase kidney disease / dialysis tracking app.

## 1. Setup

### 1.1 Install dependencies
```bash
npm install
```

### 1.2 Create MongoDB Atlas cluster
1. Go to https://www.mongodb.com/cloud/atlas and create a free (M0) cluster.
2. Under **Database Access**, create a user with a password.
3. Under **Network Access**, add your IP (or `0.0.0.0/0` for development).
4. Click **Connect > Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

### 1.3 Create a Firebase project (for Authentication)
1. Go to https://console.firebase.google.com and create a project.
2. Enable **Authentication** and turn on the sign-in methods you want (Email/Password, Google, etc.) — this is what your frontend uses to log users in.
3. Go to **Project Settings > Service Accounts > Generate new private key**. This downloads a JSON file with `project_id`, `client_email`, and `private_key` — these three values go into your backend's `.env` (see below). Never commit this file.

### 1.4 Configure environment variables
```bash
cp .env.example .env
```
Fill in `.env`:
- `MONGODB_URI` — your Atlas connection string (include the database name, e.g. `/renalease`)
- `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` — from the service account JSON
- `CLIENT_ORIGIN` — your frontend's URL (for CORS)

### 1.5 Run
```bash
npm run dev     # with nodemon, auto-restarts on changes
npm start        # production
```
Server starts on `http://localhost:5000`. Check `GET /api/health` to confirm it's running.

## 2. How authentication works

The frontend signs the user in with the **Firebase client SDK** (unrelated to this backend) and gets an ID token:
```js
const idToken = await firebase.auth().currentUser.getIdToken();
```
Every request to this API must include that token:
```
Authorization: Bearer <idToken>
```
The backend verifies the token with the Firebase Admin SDK, then finds (or auto-creates, on first login) a matching `User` document in MongoDB. All data is scoped to that user — nobody can read or write another user's records.

## 3. Project structure
```
src/
  config/       # DB and Firebase connection setup
  middleware/    # auth (token verification) and error handling
  models/        # Mongoose schemas
  controllers/   # request handlers (generic CRUD factory + custom logic)
  routes/        # Express routers
  app.js         # Express app assembly
  server.js      # entry point
```

Most resources (dialysis sessions, medications, lab results, fluid intake, weight logs, appointments, diet logs) share one generic CRUD controller/route factory (`genericController.js` / `genericRoutes.js`) since they follow the same "list / create / read / update / delete, scoped to the logged-in user" pattern. Medication logs get a couple of extra endpoints for adherence tracking.

## 4. API Reference

All routes below are prefixed with `/api` and require the `Authorization: Bearer <idToken>` header, except `/api/health`.

### Health
| Method | Path | Description |
|---|---|---|
| GET | `/health` | Public health check |

### User profile
| Method | Path | Description |
|---|---|---|
| GET | `/users/me` | Get current user's profile |
| PUT | `/users/me` | Update profile (CKD stage, dry weight, emergency contact, etc.) |

### Dialysis sessions — `/dialysis-sessions`
Standard CRUD. Supports `?from=&to=` date filtering and `?page=&limit=` pagination.
Fields: `type`, `date`, `durationMinutes`, `preWeightKg`, `postWeightKg`, `fluidRemovedLiters`, `bloodPressurePre`, `bloodPressurePost`, `location`, `complications`, `notes`.

### Medications — `/medications`
Standard CRUD. Fields: `name`, `dosage`, `frequency`, `times[]`, `withFood`, `prescribedBy`, `startDate`, `endDate`, `active`, `notes`.

### Medication logs — `/medication-logs`
- Standard CRUD (`?from=&to=` filters on `scheduledTime`)
- `GET /medication-logs/today` — today's scheduled doses, with medication details populated
- `PUT /medication-logs/:id/status` — body `{ "status": "taken" | "missed" | "skipped" | "pending" }`

### Lab results — `/lab-results`
Standard CRUD. Fields: `date`, `creatinine`, `gfr`, `bun`, `potassium`, `sodium`, `phosphorus`, `calcium`, `albumin`, `hemoglobin`, `pth`, `labName`, `orderedBy`, `notes`, `attachmentUrl`.

### Fluid intake — `/fluid-intake`
Standard CRUD. Fields: `date`, `amountMl`, `beverageType`, `note`.

### Weight logs — `/weight-logs`
Standard CRUD. Fields: `date`, `weightKg`, `note`.

### Appointments — `/appointments`
Standard CRUD. Fields: `title`, `doctorName`, `location`, `dateTime`, `durationMinutes`, `type`, `status`, `reminderMinutesBefore`, `notes`.

### Diet logs — `/diet-logs`
Standard CRUD. Fields: `date`, `mealType`, `foodItem`, `potassiumMg`, `sodiumMg`, `phosphorusMg`, `proteinG`, `calories`, `notes`.

### Generic CRUD shape (applies to all resources above except `/users/me`)
| Method | Path | Description |
|---|---|---|
| GET | `/<resource>` | List current user's records (paginated) |
| GET | `/<resource>/:id` | Get one record |
| POST | `/<resource>` | Create a record |
| PUT | `/<resource>/:id` | Update a record |
| DELETE | `/<resource>/:id` | Delete a record |

List responses look like:
```json
{
  "success": true,
  "count": 20,
  "total": 143,
  "page": 1,
  "pages": 8,
  "data": [ ... ]
}
```

## 5. Notes / next steps
- **Reminders/notifications** (medication & appointment reminders) aren't implemented — the data model supports them (`times`, `reminderMinutesBefore`), but sending push/email/SMS notifications needs a scheduler (e.g. `node-cron`) plus a delivery channel (Firebase Cloud Messaging, email, etc.). Happy to add this next.
- **File uploads** for lab report PDFs: `attachmentUrl` is a plain string field — wire it up to Firebase Storage or an S3 bucket and save the resulting URL there.
- Consider adding request validation (e.g. `zod` or `joi`) on top of Mongoose validation for stricter input checking.
