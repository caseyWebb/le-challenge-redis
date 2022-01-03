FROM node:16
COPY . .
RUN yarn install --ignore-optional
CMD yarn test