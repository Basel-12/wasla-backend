# GP Backend

NestJS backend for authentication, users, OTP verification, email sending, and background mail jobs.

## Tech Stack

- NestJS 11
- TypeORM + PostgreSQL
- JWT authentication
- Redis + BullMQ
- `@nestjs-modules/mailer` + Handlebars templates
- `nestjs-i18n`

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

## Auth Endpoints

Base path: `/api/v1/auth`

- `POST /signup`
- `POST /login`
- `POST /verify-otp`

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

## Protected User Endpoint

Base path: `/api/v1/users`

- `GET /me` (requires auth guard / valid JWT)

## CORS

CORS is enabled globally with:

- `origin: *`
- allowed methods: `GET,HEAD,PUT,PATCH,POST,DELETE`

## Request/Response Logging

A global `LoggerInterceptor` is registered in `AppModule` to log incoming requests and outgoing responses.

## Accessing API from Mobile on Same Wi-Fi

1. Start backend with `npm run start:dev`.
2. Keep backend bound to all interfaces:
   - in `src/main.ts`: `app.listen(process.env.PORT ?? 3000, '0.0.0.0')`
3. Use your PC's **Wi-Fi adapter private IP** (for example `192.168.1.x`), not virtual adapter/public IP.
4. Use that IP in your mobile app:
   - `http://<your-private-ip>:3000/api/v1`
5. Allow inbound TCP 3000 in Windows Firewall if needed.

## Notes

- TypeORM currently uses `synchronize: true` in development.
- Review this setting before production deployment.
