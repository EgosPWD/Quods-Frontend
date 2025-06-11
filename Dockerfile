FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# Instala un servidor estático como 'serve'
RUN npm install -g serve

# Usa el build de React
WORKDIR /app
EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
