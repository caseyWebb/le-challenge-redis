FROM node:6
COPY . .
RUN yarn install --ignore-optional
CMD yarn test