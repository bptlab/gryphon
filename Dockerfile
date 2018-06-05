FROM node:latest
# MONGOINSTALL
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.2 main" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
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
COPY patches /var/gryphon/

# Install dependencies
RUN cd /var/gryphon && npm install --unsafe-perm

# Copy project data
COPY . /var/gryphon/

RUN cd /var/gryphon && grunt config
RUN cd /var/gryphon && grunt

CMD service mongod start && node /var/gryphon/bin/www

EXPOSE 3000
EXPOSE 27017
