import { Link, useNavigate } from "react-router-dom";
import { User, KeyRound } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import Button from "../../components/ui/CustomButton";
import { SubmitHandler, useForm } from "react-hook-form";
import { SignInPayload } from "../../types/User";
import { useMutation } from "@tanstack/react-query";
import { postSignIn } from "../../api/authService";
import toast from "react-hot-toast";
import { LoadingOverlay } from "../../components/ui/LoadingOverlay";
import { UserRole } from "../../constants/useRole";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { register, handleSubmit } = useForm<SignInPayload>();

  const mutation = useMutation({
    mutationFn: (body: SignInPayload) =>
      postSignIn(
        body,
        (data) => {
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("refreshToken", data.refreshToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);

          toast.success("Sign in successfully!");

          if (data.user.role === UserRole.ADMIN) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        },
        (error) => {
          toast.error(error.message);
        }
      ),
  });

  const onSubmit: SubmitHandler<SignInPayload> = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <LoadingOverlay isLoading={mutation.isPending} />
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  {...register("email")}
                  className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
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
                  {...register("password")}
                  className="pl-10 block w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="********"
                />
              </div>
            </div>

            <Button type="submit" fullWidth>
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
