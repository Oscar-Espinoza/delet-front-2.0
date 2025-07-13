import { HTMLAttributes, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from '@/components/ui/input-otp'
import { useAuthStore } from '@/stores/authStore'

type OtpFormProps = HTMLAttributes<HTMLFormElement>

const formSchema = z.object({
  otp: z.string().min(1, { message: 'Please enter your otp code.' }),
})

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as { email?: string }
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { checkAuthStatus } = useAuthStore((state) => state.auth)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  const otp = form.watch('otp')

  async function onSubmit(data: z.infer<typeof formSchema>) {
    if (!search.email) {
      toast.error('Email is required for verification')
      return
    }

    setIsLoading(true)
    
    try {
      await confirmSignUp({
        username: search.email,
        confirmationCode: data.otp,
      })
      
      await checkAuthStatus()
      toast.success('Email verified successfully!')
      navigate({ to: '/' })
    } catch (error) {
      
      if (error instanceof Error && error.name === 'CodeMismatchException') {
        toast.error('Invalid verification code')
      } else if (error instanceof Error && error.name === 'ExpiredCodeException') {
        toast.error('Verification code has expired')
      } else if (error instanceof Error && error.name === 'NotAuthorizedException') {
        toast.error('User is already confirmed')
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to verify code')
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendCode() {
    if (!search.email) {
      toast.error('Email is required')
      return
    }

    setIsResending(true)
    
    try {
      await resendSignUpCode({
        username: search.email,
      })
      
      toast.success('Verification code resent to your email')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to resend code')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel className='sr-only'>One-Time Password</FormLabel>
              <FormControl>
                <InputOTP
                  maxLength={6}
                  {...field}
                  containerClassName='justify-between sm:[&>[data-slot="input-otp-group"]>div]:w-12'
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={otp.length < 6 || isLoading}>
          {isLoading ? 'Verifying...' : 'Verify'}
        </Button>
        
        <div className='mt-4 text-center'>
          <Button
            type='button'
            variant='outline'
            onClick={handleResendCode}
            disabled={isResending}
            className='text-sm'
          >
            {isResending ? 'Resending...' : 'Resend Code'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
