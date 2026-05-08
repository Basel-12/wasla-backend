# Wasla Backend

NestJS backend for authentication, users management, OTP verification, avatar uploads, push notifications, and background jobs.

## Tech Stack

- NestJS 11
- TypeORM + PostgreSQL
- JWT authentication
- Redis + BullMQ
- `@nestjs-modules/mailer` + Handlebars templates
- `nestjs-i18n`
- Firebase Admin (FCM)
- Multer (file uploads)

## API Base URL

- Global prefix: `/api`
- URI versioning: `v1`
- Default local base URL: `http://localhost:3000/api/v1`

Example:

- Signup endpoint: `POST http://localhost:3000/api/v1/auth/signup`

## Prerequisites

- Node.js 18+ (recommended)
- npm
- PostgreSQL
- Redis

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gp_backend

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
# REDIS_PASSWORD=

# Mail
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@example.com
MAIL_PASSWORD=your_password_or_app_password
MAIL_FROM="GP Backend <no-reply@gp.local>"

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Optional notification bootstrap id
# WELCOME_NOTIFICATION_ID=1
```

## Running the App

```bash
# development
npm run start:dev

# debug
npm run start:debug

# production
npm run build
npm run start:prod
```

## Available Scripts

- `npm run build` - build the app
- `npm run start` - start app
- `npm run start:dev` - start with watch mode
- `npm run start:debug` - start in debug + watch mode
- `npm run start:prod` - run compiled build
- `npm run lint` - run ESLint with `--fix`
- `npm run format` - format source and tests
- `npm run test` - run unit tests
- `npm run test:watch` - run tests in watch mode
- `npm run test:cov` - run tests with coverage
- `npm run test:e2e` - run e2e tests

## Main Modules

- `AuthModule`
- `UsersModule`
- `OtpModule`
- `MailModule`
- `MailQueueModule`
- `NotificationsModule`
- `FirebaseModule`
- `NotificationQueueModule`

## Auth Endpoints

Base path: `/api/v1/auth`

- `POST /signup`
- `POST /login`
- `POST /verify-otp`
- `POST /resend-otp`
- `POST /forgot-password`
- `POST /verify-reset-otp`
- `POST /reset-password`

### Signup Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "strongpassword"
}
```

Notes:

- Phone validation is configured for Egyptian numbers.
- Global validation pipe is enabled with `whitelist: true`.

## Users Endpoints

Base path: `/api/v1/users`

Authenticated routes:

- `GET /me`
- `PATCH /update-profile`
- `PATCH /change-password`
- `PATCH /update-avatar` (multipart/form-data, field name: `avatar`)
- `POST /set-firebase-token`
- `PATCH /deactivate-user`

Admin-only route:

- `GET /all?page=<number>&limit=<number>`

Notes:

- `GET /all` requires admin role and uses pagination metadata (`total`, `page`, `limit`, `totalPages`).
- Avatar files are stored in `public/uploads/avatars` and served under `/public`.
- Stored avatar value is the filename (not absolute path).

## CORS

CORS is enabled globally with:

- `origin: *`
- allowed methods: `GET,HEAD,PUT,PATCH,POST,DELETE`

## Request/Response Logging

A global `LoggerInterceptor` is registered in `AppModule` to log incoming requests and outgoing responses.

## Notes

- TypeORM is configured with `synchronize: false`.
- Use migrations for schema changes in shared environments.
