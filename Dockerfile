FROM node:4-onbuild
# MONGOINSTALL
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv EA312927
RUN echo "deb http://repo.mongodb.org/apt/debian wheezy/mongodb-org/3.2 main" | tee /etc/apt/sources.list.d/mongodb-org-3.2.list
# Update apt-get sources AND install MongoDB
RUN apt-get update && apt-get install -y mongodb-org-server && apt-get install -y mongodb-org-mongos && apt-get install -y mongodb-org-shell
# Create the MongoDB data directory
RUN mkdir -p /data/db
RUN chmod +x dockerstart.sh
CMD ./dockerstart.sh

EXPOSE 3000
EXPOSE 27017