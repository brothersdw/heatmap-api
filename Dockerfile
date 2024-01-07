FROM node:18

RUN apt update -y

WORKDIR /app

# COPY init.sh /usr/bin/init.sh

COPY . .

RUN npm install -g knex

RUN npm install curl --force

RUN npm install --force

EXPOSE 3008

# CMD ["sh", "-c", "npx knex migrate:latest; npm run dev; ./init.sh"]
CMD ["sh", "-c", "npx knex migrate:latest; npm run dev"]

# ENTRYPOINT [ "./init.sh" ]


# RUN curl -X POST http://localhost:3008/insert-test-diseases
