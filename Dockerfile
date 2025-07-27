# Base stage
FROM node:20-alpine AS base

# Install dependencies (add curl for debugging)
RUN apk add --no-cache python3 make g++ postgresql-client curl

WORKDIR /usr/src/app

# Install dependencies first for better caching
COPY package*.json ./
COPY yarn.lock ./

# Development stage
FROM base AS development
RUN yarn global add nodemon
RUN yarn install
# Copy all files (except those in .dockerignore)
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Production stage
FROM base AS production
RUN yarn install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]  