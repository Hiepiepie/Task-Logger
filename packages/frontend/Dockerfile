
FROM node:13
WORKDIR /app/frontend
ENV PATH /app/node_modules/.bin:$PATH

COPY /packages/frontend/package*.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
COPY ./packages/frontend ./
CMD ["npm","start"]

# production environment
#FROM nginx:stable
#COPY --from=build /app/build /usr/share/nginx/html
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]
