import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Button from "../components/ui/CustomButton";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-600 max-w-md mb-8">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button leftIcon={<ArrowLeft className="h-5 w-5" />}>
          Back to Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
