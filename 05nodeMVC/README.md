## MVC (Model, View, Controller)

### A mature Express.js app running as a microservice


```
service-name/
│
├── src/
│   ├── app.js                  # Express app bootstrap
│   ├── server.js               # HTTP server (listen)
│
│   ├── config/                 # Config & env handling
│   │   ├── index.js
│   │   ├── default.js
│   │   ├── dev.js
│   │   ├── prod.js
│   │   └── schema.js           # env validation (convict / zod)
│
│   ├── routes/                 # API routes (thin)
│   │   ├── index.js
│   │   └── oncall.routes.js
│
│   ├── controllers/            # Request → Response mapping
│   │   └── oncall.controller.js
│
│   ├── services/               # Business logic
│   │   └── oncall.service.js
│
│   ├── repositories/           # DB access layer
│   │   └── oncall.repository.js
│
│   ├── models/                 # ORM models (Prisma / Sequelize)
│   │   └── prismaClient.js
│
│   ├── middlewares/            # Express middlewares
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── requestLogger.js
│
│   ├── integrations/           # External services
│   │   ├── grafana.client.js
│   │   ├── elastic.client.js
│   │   └── jira.client.js
│
│   ├── utils/                  # Pure helpers
│   │   ├── logger.js
│   │   ├── errors.js
│   │   └── normalizeUri.js
│
│   ├── jobs/                   # Cron / async jobs
│   │   └── ticketCleanup.job.js
│
│   ├── events/                 # Kafka / RabbitMQ
│   │   ├── producers/
│   │   └── consumers/
│
│   ├── constants/
│   │   └── enums.js
│
│   ├── validations/            # Joi/Zod schemas
│   │   └── oncall.schema.js
│
│   └── tests/
│       ├── unit/
│       └── integration/
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── scripts/                    # DB seed, maintenance scripts
│   └── seedDb.js
│
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── helm/                       # Kubernetes charts
│   └── service-name/
│
├── .env.example
├── .dockerignore
├── .eslintrc
├── .gitignore
├── package.json
└── README.md

```

**When service goes large**

```
src/
├── oncall/
│   ├── oncall.routes.js
│   ├── oncall.controller.js
│   ├── oncall.service.js
│   ├── oncall.repository.js
│   └── oncall.schema.js
│
├── auth/
├── health/
├── common/
│   ├── logger.js
│   └── errors.js

```