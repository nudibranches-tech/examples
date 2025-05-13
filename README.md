# examples

Examples to get started with Hyperfluid, and how to use with Service Accounts:

- [x] Bun: [`bun`](./bun/) (is similar to others JS runtimes)
- [ ] Python

## Before using the examples

- An account on [Hyperfluid demo](https://demo.hyperfluid.nudibranches.tech/) (or your own instance)

- Create an **organization**
  - Create an **Harbor**
  - Create a **DataDock** with a Kind to `TrinoInternal` (choose your own options)
  - In your DataDock details page, go to the "Data Containers" tab
  - Click on "TPCH" to add it to your Trino Data Dock
  - Go to `cd ./bun/`
  - Replace the variables like `YOUR_BIFROST_URL` or `YOUR_DATADOCK_ID`
  - Execute the bun script
    - `pnpm install`
    - `bun dev`
- Create a service account
- Move it to [`./bun/service_account.json`](./bun/)

## More details

On [Hyperfluid Documentation](https://www.nudibranches.tech/docs/core-concepts/)!
