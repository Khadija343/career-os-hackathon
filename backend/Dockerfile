FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

RUN mkdir -p uploads/resumes

EXPOSE 5000

CMD ["node", "src/server.js"]
