# Use official Node
FROM node:20-alpine

# Set work Dir
WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install
COPY . .
RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npx prisma db seed
RUN npm run build
ENV NODE_ENV = production

EXPOSE 3000

CMD ["npm","start"]
