import { useEffect, useState } from "react";
import { api } from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/users/me").then((res) => setUser(res.data));
  }, []);

  if (!user) return <p>Carregando...</p>;

  return (
    <div>
      <h1>Meu perfil</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}

export default Profile;
