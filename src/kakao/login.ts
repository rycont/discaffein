import kakao from "../storages/kakao";
import storage from "../storages/static";

const login = async () => {
  try {
    await kakao.login(storage.email, storage.pw);
    console.log('Logged in to Loco, with', kakao.Name)
  } catch (e) {
    console.log(e);
  }
};

export default login;
