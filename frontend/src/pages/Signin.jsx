import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Heading from "../ui/Heading";
import { useEffect, useState } from "react";

const Signin = () => {
  const [loginErr, setLoginErr] = useState("");
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const navigate = useNavigate();

  async function onSubmit({ email, password }) {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        { username: email, password }
      );
      console.log("backend called");
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      // console.log(err.response.data.message);
      setLoginErr(err.response.data.message);
    }
  }

  useEffect(() => {
    const login = async () => {
      const token = `Bearer ${localStorage.getItem("token")}`;
      console.log(token);
      const { response } = await axios.post(
        "http://localhost:3000/api/v1/user/signin",
        {},
        {
          headers: {
            Authorization: token || "",
          },
        }
      );
      if (response.data.success) {
        navigate("/dashboard");
      }
      console.log(response.data);
    };

    login();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-[100dvh] bg-gray-200">
      <form
        className="bg-white flex flex-col items-center py-8 px-6 rounded-lg gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading label="Sign In" />
        <p className="flex flex-wrap mb-4">
          Enter your information to create an account
        </p>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="email" className=" font-bold">
            Email
          </label>
          <input
            type="text"
            id="email"
            className=" border-black-200 border-2 rounded-md px-2 py-2"
            placeholder="johndoe@gmail.com"
            {...register("email", { required: "This filed is required" })}
          />

          <label htmlFor="password" className="font-bold">
            Password
          </label>
          <input
            type="password"
            id="password"
            className=" border-black-200 border-2 rounded-md px-2 py-2"
            {...register("password", { required: "This filed is required" })}
          />
        </div>
        <Button
          className="bg-black text-white w-full py-2 rounded-lg"
          type="submit"
        >
          Sign In
        </Button>
        {loginErr && <p className=" text-red-600 font-semibold">{loginErr}</p>}
        <p className="font-semibold">
          Dont have an account?{" "}
          <button className="underline" onClick={() => navigate("/signup")}>
            Signup
          </button>{" "}
        </p>
      </form>
    </div>
  );
};

export { Signin };
