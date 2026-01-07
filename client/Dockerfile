FROM node:24-slim

WORKDIR /app

COPY package*.json .
RUN npm install --legacy-peer-deps

CMD [ "npm", "run", "dev" ]