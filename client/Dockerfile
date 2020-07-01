FROM node:alpine

# set working directory
WORKDIR /client

# add `/app/node_modules/.bin` to $PATH
ENV PATH /client/node_modules/.bin:$PATH

# copy npm files
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . .

# EXPOSE 3000

CMD ["npm", "start"]