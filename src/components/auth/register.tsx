import React, { useState } from "react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "@data/auth/use-register.mutation";
import Logo from "@components/ui/logo";
import Alert from "@components/ui/alert";
import Input from "@components/ui/input";
import PasswordInput from "@components/ui/password-input";
import Button from "@components/ui/button";
import { useUI } from "@contexts/ui.context";
import { CUSTOMER, SUPER_ADMIN } from "@utils/constants";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

type FormValues = {
  name: string;
  email: string;
  contact: string;
  password: string;
};

const registerFormSchema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  email: yup.string().email("E-mail não é válido").required("E-mail é obrigatório"),
  contact: yup.string().min(9, "Digite 9 caracteres").required("Contato é obrigatório"),
  password: yup.string().required("Senha requerida"),
});

const defaultValues = {
  name: "",
  email: "",
  contact: "",
  password: "",
};

const RegisterForm = () => {
  const { mutate, isLoading: loading } = useRegisterMutation();
  const [errorMsg, setErrorMsg] = useState("");
  const {
    register,
    handleSubmit,
    setError,

    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(registerFormSchema),
  });
  const router = useRouter();
  const { authorize, closeModal, setModalView } = useUI();
  function handleNavigate(path: string) {
    router.push(`/${path}`);
    closeModal();
  }
  function onSubmit({ name, email, contact, password }: FormValues) {
    mutate(
      {
        name,
        email,
        contact,
        password,
      },
      {
        onSuccess: (data) => {
          if (
            (data?.token && data?.permissions?.includes(CUSTOMER)) ||
            data?.permissions?.includes(SUPER_ADMIN)
          ) {
            Cookies.set("auth_token", data.token);
            Cookies.set("auth_permissions", data.permissions);
            authorize();
            return;
          }
          if (!data.token) {
            setErrorMsg("As credenciais estavam erradas!");
            return;
          }
          if (!data.permissions.includes(CUSTOMER)) {
            setErrorMsg("Não tem permissão suficiente");
            return;
          }
        },
        onError: (error) => {
          const {
            response: { data },
          }: any = error ?? {};
          Object.keys(data).forEach((field: any) => {
            setError(field, {
              type: "manual",
              message: data[field][0],
            });
          });
        },
      }
    );
  }
  return (
    <div className="py-6 px-5 sm:p-8 bg-white w-screen md:max-w-md h-screen md:h-auto flex flex-col justify-center">
      <div className="flex justify-center">
        <Logo />
      </div>
      <p className="text-center text-sm md:text-base leading-relaxed px-2 sm:px-0 text-body mt-4 sm:mt-5 mb-7 sm:mb-10">
      Ao se inscrever, você concorda com nossos
        <span
          onClick={() => handleNavigate("terms")}
          className="mx-1 underline cursor-pointer text-primary hover:no-underline"
        >
          termos
        </span>
        &
        <span
          onClick={() => handleNavigate("privacy")}
          className="ml-1 underline cursor-pointer text-primary hover:no-underline"
        >
          política de privacidade
        </span>
      </p>
      {errorMsg && (
        <Alert
          variant="error"
          message={errorMsg}
          className="mb-6"
          closeable={true}
          onClose={() => setErrorMsg("")}
        />
      )}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label="Nome"
          {...register("name")}
          type="text"
          variant="outline"
          className="mb-5"
          error={errors.name?.message}
        />
        <Input
          label="Email"
          {...register("email")}
          type="email"
          variant="outline"
          className="mb-5"
          error={errors.email?.message}
        />
         <Input
          label="Contato"
          {...register("contact")}
          type="number"
          variant="outline"
          className="mb-5"
          error={errors.contact?.message}
        />
        <PasswordInput
          label="Password"
          {...register("password")}
          error={errors.password?.message}
          variant="outline"
          className="mb-5"
        />
        <div className="mt-8">
          <Button className="w-full h-12" loading={loading} disabled={loading}>
            Criar Conta
          </Button>
        </div>
      </form>
      {/* End of forgot register form */}

      <div className="flex flex-col items-center justify-center relative text-sm text-heading mt-8 sm:mt-11 mb-6 sm:mb-8">
        <hr className="w-full" />
        <span className="absolute left-2/4 -top-2.5 px-2 -ml-4 bg-white">
          Ou
        </span>
      </div>
      <div className="text-sm sm:text-base text-body text-center">
      Já tem uma conta?{" "}
        <button
          onClick={() => setModalView("LOGIN_VIEW")}
          className="ml-1 underline text-primary font-semibold transition-colors duration-200 focus:outline-none hover:text-primary-2 focus:text-primary-2 hover:no-underline focus:no-underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default RegisterForm;
