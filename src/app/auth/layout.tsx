// src/auth/layout/AuthLayout.tsx
import AuthHeroSection from "@/auth/components/AuthHeroSection";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-screen flex-col lg:flex-row justify-between items-center lg:py-6 lg:px-4 lg:gap-6 overflow-hidden">

      {/* Left Section - Hero */}
      <div className="w-full h-screen lg:w-[45%] 2xl:h-[50vh] 2xl:w-[20%] mx-auto ">
        <AuthHeroSection />
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-[55%] flex flex-col bg-white p-6">
        {children}
      </div>
    </div>
  );
}
