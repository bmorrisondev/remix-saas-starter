import { SignIn } from '@clerk/remix'

export default function SignInPage() {
  return (
    <div className='flex justify-center mt-8'>
      <SignIn />
    </div>
  )
}