FROM node:14-alpine AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
COPY public /app/public
COPY src /app/src
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm run build

FROM node:14-alpine
WORKDIR /app
EXPOSE 3000
RUN npm install -g serve
COPY --from=builder /app/build /app/build
CMD ["serve", "-s", "build", "-l", "3000", "-n"]
