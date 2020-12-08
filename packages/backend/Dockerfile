FROM node:13

# Create app directory
WORKDIR /app/backend

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY /packages/backend/package*.json ./

RUN npm install --silent

# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8081
# Bundle app source
COPY ./packages/backend/.env.example ./.env
COPY ./packages/backend ./

CMD ["npm","start"]