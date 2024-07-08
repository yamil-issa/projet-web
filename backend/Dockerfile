FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm rebuild bcrypt --build-from-source

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
