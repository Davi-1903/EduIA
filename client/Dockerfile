FROM node:20 AS build

WORKDIR /app
COPY package*.json .
RUN npm install --legacy-peer-deps

COPY . .
CMD ["npm", "run", "build"]