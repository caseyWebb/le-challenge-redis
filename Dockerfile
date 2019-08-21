FROM node:6
COPY . .
RUN yarn install --ignore-optional
RUN yarn add bluebird
CMD yarn test