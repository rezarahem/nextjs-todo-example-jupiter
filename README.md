# Jupiter Todo App Example

This is a Next.js Todo app created as a demonstration of how to seamlessly add dependencies to your project using the Jupiter CLI.

**Checkout [Jupiter CLI](https://www.npmjs.com/package/ju)**

1. [Clone the Repository](#clone-the-repository)
2. [Initialize a Jupiter Project](#initialize-a-jupiter-project)
3. [Adding Dependencies](#adding-dependencies)
4. [Local Development (Optional)](#local-development-optional)
5. [Push Datebase Schema on the Host](#push-datebase-schema-on-the-host)
6. [Update Dockerfile with Eequired Environment Variables](#update-dockerfile-with-eequired-environment-variables)
7. [Deploy](#deploy)

---

## Clone the Repository

To get started, clone this repository to your local machine:

```
git clone https://github.com/rezarahem/nextjs-todo-example-jupiter.git
```

Navigate to the project directory:

```
cd nextjs-todo-example-jupiter
```

Install the required dependencies:

```
npm i
```

## Initialize a Jupiter Project

Create or use an existing Next.js project:

```bash
  ju init
```

Follow the prompts to configure your deployment.

## Adding Dependencies

By default, Jupiter creates a `docker-compose.yml` file in `root` directory, which serves as the base Docker Compose configuration.

`docker-compose.yml`

```
networks:
  <app-name>:
    name: <app-name>
    external: true
    driver: bridge
```

For this example, we want to create a simple Todo app where users can log in with their email and create or delete todos. To achieve this, we'll need a database and an email SMTP server as dependencies. Let's update the Docker Compose file accordingly.

`docker-compose.yml`

```
services:
  postgres:
    image: postgres:latest
    container_name: todo-app-db
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: db
    networks:
      - <app-name>
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

  smtp:
    image: ixdotai/smtp:latest
    container_name: todo-app-mail
    restart: always
    networks:
      - <app-name>
    environment:
      - MAILNAME=<your-domain>
      - SMARTHOST_USER=user
      - SMARTHOST_PASSWORD=pass
      - DKIM_SELECTOR=default
      - DKIM_KEY_PATH=/etc/exim4/dkim.key.temp
    volumes:
      - $HOME/default.private:/etc/exim4/dkim.key.temp:ro

volumes:
  postgres_data:

networks:
  <app-name>:
    name: <app-name>
    external: true
    driver: bridge
```

You just need to update the `app-name` and the `domain-name`

## Local Development (Optional)

For local testing and further development, you should add a `.env` file to root directory:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/db
```

You’ll also need Docker installed on your local machine to create the database container.

**Note** You only need the database container locally. Setting up the SMTP server locally can be troublesome. Additionally, for local development, the function responsible for sending the OTP will shortcut and always return the string ju as the OTP for login.

`/server-actions/check-email.ts`

```
const key = env === 'development' ? 'ju' : await sendOtp(email.data);
```

So, if you're logging in locally, always enter ju as the OTP.

## Setting Up Dependencies on VPS/Host

Before setting up dependencies, I should note that for the SMTP server to work properly, you need a domain with the correct DNS settings for your email. These DNS records include DMARC, SPF, and DKIM. The first two are relatively easy to set up. For instructions on setting up DKIM, check out the [ixdotai/smtp repo](https://github.com/ix-ai/smtp?tab=readme-ov-file#enabling-dkim-support)

Just make sure to place the DKIM private key at the root of your VPS, as specified in the
`docker-compose.yml`

```
volumes:
 - $HOME/default.private:/etc/exim4/dkim.key.temp:ro
```

Now, you can set up your dependencies with the following command:

```
ju r
```

This command connects to your VPS and uses Docker Compose to set up your dependencies. Upon successful execution, you should see logs similar to the following when the service is created with `docker compose up`:

```
 Container todo-app-mail  Creating
 Container todo-app-db  Creating
 Container todo-app-mail  Created
 Container todo-app-db  Created
 Container todo-app-mail  Starting
 Container todo-app-db  Starting
 Container todo-app-db  Started
 Container todo-app-mail  Started
```

## Push Datebase Schema on the Host

To update your database schema on the VPS efficiently, you can establish a secure `tunnel` between your local machine and the database running on the VPS. This allows you to connect to the remote database as if it were local, enabling seamless updates. Use the following command to set up the `tunnel`:

```bash
ssh -L 5432:localhost:5432 -p <vps-ssh-port> <vps-user>@<vps-ip>
```

This command forwards port `5432` (commonly used by PostgreSQL) on your local machine to the same port on the VPS, creating a direct and secure connection to the database.

Once the tunnel is established, you can update your database schema using the following command:

```
npx drizzle-kit push
```

## Update Dockerfile with Eequired Environment Variables

For your application to function correctly, ensure the following environment variables are added to the Dockerfile located in the root directory:

```
ENV DATABASE_URL=postgresql://user:pass@todo-app-db:5432/db
ENV SMTP_EMAIL=<your-smtp-email>
```

These should be included under the prod section to ensure proper configuration in the production environment.

**Note** You can choose any name for your SMTP email address.

## Deploy

With the dependencies and configurations set up, you can now deploy the `Todo app` by running the following command:

```
ju d
```
