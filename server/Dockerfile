FROM node:14

WORKDIR /service/
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . ./
ADD https://raw.githubusercontent.com/articulate/docker-consul-template-bootstrap/master/wait-for-it.sh /service/wait-for-it.sh
RUN chmod a+rx /service/wait-for-it.sh

EXPOSE 5001

CMD yarn start:cold
