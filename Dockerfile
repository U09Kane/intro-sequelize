FROM node:13-alpine

# install dependencies
RUN apk update && apk add bash vim mysql-client

# copy over requirements and install
COPY package*.json /express-app/
WORKDIR /express-app
RUN npm install --production

# copy src code
COPY * /express-app/

# entrypoint
CMD npm start
