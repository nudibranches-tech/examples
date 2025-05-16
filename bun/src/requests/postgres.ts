import { SQL } from "bun";
import postgres from "postgres";

export async function doBunPostgresRequest(accessToken: string) {
  const config = fillConfig();

  const sql = await new SQL({
    adapter: "postgres",
    hostname: config.hostname.value,
    port: config.port.value,
    database: config.database.value,
    password: accessToken,
  })
    .connect()
    .catch((e) => console.error(e));
  if (!sql) process.exit(1);

  const result = await sql.unsafe(config.query.value).simple();
  sql.end(); // closing connection manually

  return result;
}

export async function doPostgresJsRequest(accessToken: string) {
  const config = fillConfig();

  const sql = postgres({
    hostname: config.hostname.value,
    port: parseInt(config.port.value),
    database: config.database.value,
    password: accessToken,
    fetch_types: false,
  });

  const result = await sql.unsafe(config.query.value).simple();
  sql.end(); // closing connection manually

  return result;
}

/// Some utils, don't worry
type Config = {
  hostname: Prompt;
  port: Prompt;
  database: Prompt;
  query: Prompt;
};

type Prompt = {
  label: string;
  help?: string;
  value: string;
};

function fillConfig(): Config {
  const config: Config = {
    hostname: {
      label: "Enter a hostname:",
      value: "",
    },
    port: {
      label: "Enter a port:",
      value: "",
    },
    database: {
      label: "Enter your DataDock ID (= Database):",
      value: "",
    },
    query: {
      label: "Enter your SQL Query:",
      help: "Example: SELECT * FROM {catalog}.{schema}.{table} LIMIT 10",
      value: "",
    },
  };

  for (const configEntry of Object.values(config)) {
    let value = null;
    if (configEntry.help) {
      console.log(`> ${configEntry.label}`);
      console.log(`  > ${configEntry.help}`);
      value = prompt("  >");
    } else {
      value = prompt(`> ${configEntry.label}`);
    }

    if (value === null) {
      console.error(`No value provided`);
      process.exit(1);
    }

    configEntry.value = value;
  }

  return config;
}
