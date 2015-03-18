FROM centos:latest
MAINTAINER Andras Toth <andras.toth93@gmail.com>

RUN yum update -y
RUN yum install -y wget git hg golang

ENV GOPATH /gopath
ENV PATH $PATH:$GOROOT/bin:$GOPATH/bin

ADD . /gopath/src/github.com/tothandras/websocket-test
RUN go get -v -d all
RUN go install github.com/tothandras/websocket-test
RUN cp -r /gopath/src/github.com/tothandras/websocket-test/static /gopath/bin/static
ENTRYPOINT websocket-test
EXPOSE 80
