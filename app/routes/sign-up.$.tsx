import { SignUp } from '@clerk/remix'

export default function SignUpPage() {
  return (
    <div className='flex justify-center mt-8'>
      <SignUp />
    </div>
  )
}