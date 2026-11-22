interface HomeFitLogoProps {
  className?: string;
}

export default function HomeFitLogo({ className = "" }: HomeFitLogoProps) {
  return (
    <img
      src="/images/fitness/homefit-logo.jpeg"
      alt="HomeFit"
      width={360}
      height={275}
      className={`block object-contain ${className}`}
    />
  );
}