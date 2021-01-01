import throwError from "../utils/makeError";

const throwKeyNotFoundError = (key: string) =>
  throwError(`key "${key}" was not found on env`);

const storage = {
  email: process.env.email || throwKeyNotFoundError("email"),
  pw: process.env.pw || throwKeyNotFoundError("pw"),
  uuid: process.env.uuid || throwKeyNotFoundError("uuid"),
  name: process.env.name || throwKeyNotFoundError("name"),
  botToken: process.env.botToken || throwKeyNotFoundError("botToken"),
};
export default storage;
