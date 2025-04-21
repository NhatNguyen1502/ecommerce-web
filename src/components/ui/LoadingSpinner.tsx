import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner = ({ size = 24, className = '' }: LoadingSpinnerProps) => {
  return (
    <div className={`flex justify-center items-center w-full ${className}`}>
      <Loader2 className="animate-spin text-blue-600" size={size} />
    </div>
  );
};

export default LoadingSpinner;