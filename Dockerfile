FROM node:14-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ENV PORT 3000
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
EXPOSE 3000
CMD ["npm", "start"]
