import { useEffect } from "react";
//import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Spinner from "@components/ui/loaders/spinner/spinner";
import { useLogoutMutation } from "@data/auth/use-logout.mutation";

export default function SignOut() {
  //const router = useRouter();
  const { mutate } = useLogoutMutation();

  useEffect(() => {
    mutate();
    Cookies.remove("auth_token");
    Cookies.remove("auth_permissions");
    //router.push("/");
    location.href="/";

  }, []);

  return (
    <div className="min-h-screen grid place-items-center">
      <div className="text-center">
        <Spinner text="Saindo..." />
      </div>
    </div>
  );
}
