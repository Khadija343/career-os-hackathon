FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

# Linux containers are case-sensitive; existing imports reference
# Auth.controller.js / Auth.service.js while files on disk are lowercase.
RUN ln -sf auth.controller.js src/controllers/Auth.controller.js \
    && ln -sf auth.service.js src/services/Auth.service.js

RUN mkdir -p uploads/resumes

EXPOSE 5000

CMD ["node", "src/server.js"]
