import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function verifyIfMigrationsIsRunning() {
  const tableResult = await database.query(
    "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pgmigrations');",
  );
  const tableExists = tableResult.rows[0].exists;

  return tableExists;
}

test("POST to /api/v1/migrations should return 200", async () => {
  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response1.status).toBe(201);

  const response1Body = await response1.json();
  console.log(response1Body);
  // const isMigrationsRunning = await verifyIfMigrationsIsRunning();

  expect(Array.isArray(response1Body)).toBe(true);
  expect(response1Body.length).toBeGreaterThan(0);
  // expect(isMigrationsRunning).toBe(true);

  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
  expect(response2.status).toBe(200);

  const response2Body = await response2.json();
  console.log(response2Body);
  // const isMigrations2Running = await verifyIfMigrationsIsRunning();

  expect(Array.isArray(response2Body)).toBe(true);
  expect(response2Body.length).toBe(0);
  // expect(isMigrations2Running).toBe(true);
});
