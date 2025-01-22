# Jupiter Todo App Example

This is a Next.js Todo app created as a demonstration of how to seamlessly add dependencies to your project using the Jupiter CLI.

**Checkout [Jupiter CLI](https://www.npmjs.com/package/ju)**

1. [Clone the Repository](#clone-the-repository)
2. [Initialize a Jupiter Project](#initialize-a-jupiter-project)
3. [Adding Dependencies](#adding-dependencies)
4. [Local Development](#local-development-optional)

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
Creating todo-app-db  ... done
Creating todo-app-mail ... done
```

## Deploy 

With the dependencies set up, you can now deploy the `Todo app` by running the following command:

```
ju d
```
