import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  loadingClassName?: string;
}

const LoadingSpinner = ({ size = 24, className = '', loadingClassName = '' }: LoadingSpinnerProps) => {
  return (
    <div className={`flex justify-center items-center w-full ${className}`}>
      <Loader2
        className={`animate-spin text-blue-600 ${loadingClassName}`}
        size={size}
      />
    </div>
  );
};


export default LoadingSpinner;