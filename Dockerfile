FROM node:22 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/build ./public
COPY package.json yarn.lock ./

RUN yarn global add serve

EXPOSE 3000

CMD ["serve", "-s", "public", "-l", "3000"]