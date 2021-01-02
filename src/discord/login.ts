import discord from "../storages/discord";
import storage from "../storages/static";

const login = async () => {
  await discord.login(storage.botToken)
  console.log('Loggin in to Discord')
};

export default login;
