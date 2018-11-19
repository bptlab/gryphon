FROM node:jessie
# MONGOINSTALL
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv BC711F9BA15703C6
RUN echo "deb http://ftp.debian.org/debian jessie-backports main" | tee /etc/apt/sources.list
RUN echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list
# Update apt-get sources AND install MongoDB
RUN apt-get update \
 && apt-get install -y \
  mongodb-org-server \
  mongodb-org-mongos \
  mongodb-org-shell \
 && rm -rf /var/lib/apt/lists/*

# Install grunt
RUN npm install -g node-gyp grunt-cli

# Copy package.json early for module dependencies (to allow for npm caching)
COPY package.json /var/gryphon/

# Install dependencies
RUN cd /var/gryphon && npm install

# Copy project data
COPY . /var/gryphon/

RUN cd /var/gryphon && grunt config
RUN cd /var/gryphon && grunt

CMD service mongod start && node /var/gryphon/bin/www

EXPOSE 3000
EXPOSE 27017
