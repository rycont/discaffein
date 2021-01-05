import throwError from "../utils/makeError";

const throwKeyNotFoundError = (key: string) =>
  throwError(`key "${key}" was not found on env`);

const storage = {
  uuid: process.env.uuid || throwKeyNotFoundError("uuid"),
  name: process.env.name || throwKeyNotFoundError("name"),
  botToken: process.env.botToken || throwKeyNotFoundError("botToken"),
  discordServerId: process.env.discordServerId || throwKeyNotFoundError("discordServerId")
};
export default storage;
