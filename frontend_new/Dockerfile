FROM node:18
WORKDIR /var/next
COPY package*.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5177
CMD ["npm", "run", "dev", "--", "--host"]