import { SignIn } from '@clerk/nextjs'
import AuthLayout from '@/components/AuthLayout'

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn
        appearance={{
          variables: {
            colorPrimary: '#0ea5e9',
            colorBackground: '#ffffff',
            borderRadius: '0.5rem',
          },
        }}
        afterSignInUrl="/"
      />
    </AuthLayout>
  )
}
