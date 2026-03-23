# Stage 1: Build React app
FROM node:25-alpine as build

WORKDIR /app/frontend

COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./

RUN npm ci

COPY ./frontend/ ./
RUN npm run build

# Stage 2: Run Next.js app
FROM node:20-alpine

WORKDIR /app

COPY --from=build /app/frontend /app

WORKDIR /app

EXPOSE 3000

CMD ["npm", "start"]
