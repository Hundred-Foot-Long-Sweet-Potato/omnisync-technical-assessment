# Use official Node
FROM node:20-alpine

# Set work Dir
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

ENV NODE_ENV = production

EXPOSE 3000

CMD ["npm","start"]
