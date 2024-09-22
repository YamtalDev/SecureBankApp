FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx tsc

EXPOSE 5000

CMD ["node", "dist/index.js"]