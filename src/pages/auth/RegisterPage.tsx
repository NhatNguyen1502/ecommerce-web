import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Mail, Phone } from "lucide-react";
import Button from "../../components/ui/CustomButton";
import { useForm, SubmitHandler } from "react-hook-form";
import { SignUpPayload } from "../../types/User";
import { useMutation } from "@tanstack/react-query";
import { postSignUp } from "../../api/authService";
import toast from "react-hot-toast";
import { LoadingOverlay } from "../../components/ui/LoadingOverlay";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpPayload>();

  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: (body: SignUpPayload) =>
      postSignUp(
        body,
        () => {
          navigate("/login");
          toast.success("Successfully created!");
        },
        (error) => {
          toast.error(error.message);
        }
      ),
  });

  const onSubmit: SubmitHandler<SignUpPayload> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <LoadingOverlay isLoading={mutation.isPending} />
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create an account
            </h1>
            <p className="text-gray-600">
              Join our community of mobile enthusiasts
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name<span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  required
                  {...register("firstName", { required: true, maxLength: 50 })}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="First Name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    First name is required
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name<span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  required
                  {...register("lastName", { required: true, maxLength: 50 })}
                  className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Last Name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    Last name is required
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address<span className="text-red-500">*</span>
              </label>
              <input
                id="address"
                type="text"
                required
                {...register("address", { required: true })}
                className="block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Address"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">Address is required</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phoneNumber"
                  type="text"
                  required
                  {...register("phoneNumber", { required: true })}
                  className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Phone Number"
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                  Phone Number is required
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  {...register("email", {
                    required: true,
                    pattern: /^\S+@\S+$/i,
                  })}
                  className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">Email is required</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  {...register("password", { required: true })}
                  className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="********"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  Password is required
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword">
                Confirm Password<span className="text-red-500">*</span>{" "}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  {...register("confirmPassword", {
                    required: true,
                    validate: (value) => value === watch("password"),
                  })}
                  className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="********"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            <Button type="submit" fullWidth>
              Create Account
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;

