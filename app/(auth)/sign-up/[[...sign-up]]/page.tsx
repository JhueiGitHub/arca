import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-slate-500 hover:bg-slate-400 text-sm normal-case",
            card: "bg-white shadow-xl rounded-xl",
            // Add more custom styles as needed
          },
        }}
      />
    </div>
  );
}
