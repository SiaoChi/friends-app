FROM node:18
COPY ./ /app
WORKDIR /app
RUN npm install
RUN npm install pm2 -g
RUN npm run build
CMD node dist/index.js