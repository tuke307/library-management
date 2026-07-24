import "dotenv/config";

const requiredKeys = ["DATABASE_URL"] as const;

export type EnvKey = (typeof requiredKeys)[number];

const getEnv = (key: EnvKey) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env = {
  DATABASE_URL: getEnv("DATABASE_URL"),
};
