FROM ubuntu:latest as development


WORKDIR /usr/src/app

COPY package*.json .

# Update Ubuntu Software repository
RUN apt update
RUN apt upgrade -y
RUN apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/Europe/Warsaw /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata

# Install node and npm
RUN apt-get install -y sudo
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
RUN sudo apt-get install -y nodejs
RUN apt install -y npm
RUN rm -rf /var/lib/apt/lists/*
RUN apt clean

# Install Nest
RUN npm i -g @nestjs/cli

# Install node_modules
RUN npm cache clean --force
RUN npm install

#CLEAR
RUN apt autoremove -y

COPY . .

RUN ldconfig








