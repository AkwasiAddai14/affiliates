import { SignUp } from '@clerk/nextjs'
import AuthLayout from '@/components/AuthLayout'

export default function SignUpPage() {
  return (
    <AuthLayout>
      <SignUp
        appearance={{
          variables: {
            colorPrimary: '#0ea5e9',
            colorBackground: '#ffffff',
            borderRadius: '0.5rem',
          },
        }}
        afterSignUpUrl="/"
      />
    </AuthLayout>
  )
}
