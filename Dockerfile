FROM hoosin/alpine-nginx-nodejs:latest

COPY nginx.conf /etc/nginx/nginx.conf

WORKDIR /opt/node_app/app

COPY . ./
RUN npm install --no-optional && npm cache clean --force
COPY . .

EXPOSE 3000

RUN npm run build