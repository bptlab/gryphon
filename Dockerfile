FROM node:stretch
# MONGOINSTALL
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
#RUN echo "deb http://ftp.debian.org/debian stretch-backports main" | tee /etc/apt/sources.list
RUN echo "deb http://repo.mongodb.org/apt/debian stretch/mongodb-org/4.0 main" | tee /etc/apt/sources.list.d/mongodb-org-4.0.list
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

# Copy patches
COPY patches /var/gryphon/patches

# Install dependencies
RUN cd /var/gryphon && npm install --unsafe-perm

# Copy project data
COPY . /var/gryphon/

RUN cd /var/gryphon && grunt config
RUN cd /var/gryphon && grunt

CMD mongod --logpath /var/log/mongodb/mongodb.log --fork --dbpath /var/lib/mongodb && node /var/gryphon/bin/www

EXPOSE 3000
