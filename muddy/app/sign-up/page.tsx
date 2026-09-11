import { SignupForm } from "@/components/signup-form"


const SignUp = () => {
    
  return (
    <div className="bg-background flex min-h-svh w-full flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <img
            src="https://mileslegend.sirv.com/logo-1.png"
            alt="MCFS Logo"
            className="h-6 w-6 rounded-md"
          />
          MCFS
        </a>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}

export default SignUp