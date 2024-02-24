import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import Heading from "../ui/Heading";

const Signup = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const navigate = useNavigate();
  async function onSubmit({ email, firstName, lastName, password }) {
    const response = await axios.post(
      "http://localhost:3000/api/v1/user/signup",
      {
        username: email,
        firstname: firstName,
        lastname: lastName,
        password,
      }
    );
    console.log("backend called");
    // reset();
    console.log(response);
    localStorage.setItem("token", response.data.token);
    navigate("/dashboard");
  }
  return (
    <div className="flex items-center justify-center h-[100dvh] bg-gray-200">
      <form
        className="bg-white flex flex-col items-center py-8 px-6 rounded-lg gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Heading label="Sign Up" />
        <p className="flex flex-wrap mb-4">
          Enter your information to create an account
        </p>
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="firstName" className=" font-bold">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            className=" border-black-200 border-2 rounded-md px-2 py-2"
            placeholder="John"
            {...register("firstName", { required: "This filed is required" })}
          />

          <label htmlFor="lastName" className=" font-bold">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            className=" border-black-200 border-2 rounded-md px-2 py-2"
            placeholder="Doe"
            {...register("lastName", { required: "This filed is required" })}
          />

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
            type="text"
            id="password"
            className=" border-black-200 border-2 rounded-md px-2 py-2"
            {...register("password", { required: "This filed is required" })}
          />
        </div>
        <Button
          className="bg-black text-white w-full py-2 rounded-lg"
          type="submit"
        >
          Sign Up
        </Button>
        <p className="font-semibold">
          Already have an account?{" "}
          <button className="underline" onClick={() => navigate("/login")}>
            Login
          </button>{" "}
        </p>
      </form>
    </div>
  );
};

export { Signup };
