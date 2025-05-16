# examples :zap:

Examples to get started with Hyperfluid, and how to use with Service Accounts:

- [x] [**Bun/JS**](./bun/): with [`bun`](https://bun.sh/)
  - [x] **Postgres**: only works with Simple Query Protocol, you should not use the Extended Query Protocol (ex: prepare statements)
  - [x] **HTTP** (OpenAPI)
  - [x] **GraphQL**
  - [ ] **Trino**: the `trino-js-client` is missing the authentication with JWT, so does not work yet 
- [ ] **Python**

## Before using the examples

1. An account on [Hyperfluid demo](https://demo.hyperfluid.nudibranches.tech/) (or your own instance)

2. Create an **organization**
    - Create an **Harbor**
    - Create a **DataDock** with a Kind to `TrinoInternal` (choose your own options)
    - In your DataDock details page, go to the "Data Containers" tab
    - Click on **"TPCH" catalog** to add it to your Trino Data Dock

3. Create a service account

4. Move it to [`./bun/service_account.json`](./bun/)

6. Go to `cd ./bun/`

7. Execute the bun script
    - `pnpm install`
    - `pnpm dev`

> [!NOTE]
> When starting the example program, you can change the service account path with the environment variable `SERVICE_ACCOUNT_PATH`
> (defaulting to : `./bun/service_account.json`).

## Authentication methods

You can choose between two authentication methods:
- **Client Credentials Flow:** your client will authenticate as a service account
  - Example on how to use it: [`./bun/src/auth_utils/client_credentials.ts`](./bun/src/auth_utils/client_credentials.ts)
- **Authorization Code Flow:** your client will authenticate as a user (like when you login to the web app)
  - Example on how to use it: [`./bun/src/auth_utils/authorization_code.ts`](./bun/src/auth_utils/authorization_code.ts)

## More details

On [Hyperfluid Documentation](https://www.nudibranches.tech/docs/core-concepts/)!
