import Ajv from "ajv";
import schema from "./naver-schema.json";
export * from "./types";

const ajv = new Ajv({
  removeAdditional: true,
  useDefaults: true,
});

export const validate = ajv.compile(schema);
