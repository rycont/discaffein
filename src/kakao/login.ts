import kakao from "../storages/kakao";
import storage from "../storages/static";

const login = async () => {
  try {
    await kakao.login(storage.email, storage.pw);
    console.log(kakao.Name)
  } catch (e) {
    console.log(e);
  }
};

export default login;
