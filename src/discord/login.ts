import discord from "../storages/discord";
import storage from "../storages/static";

const login = async () => {
  console.log(await discord.login(storage.botToken));
};

export default login;
