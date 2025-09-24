import { Button } from '@/components/custom/button'
import { Icons } from '@/components/icons'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className }: UserAuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const { login, googleSignIn } = useAuth()
  const navigate = useNavigate()

  // Form validation
  const isEmailValid = email.includes('@') && email.includes('.')
  const isPasswordValid = password.length >= 6
  const isFormValid = isEmailValid && isPasswordValid

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const autofillCredentials = () => {
    setEmail('admin@bayshoreai.com')
    setPassword('admin123')
    setEmailTouched(true)
    setPasswordTouched(true)
  }

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    if (!isFormValid) return

    setIsLoading(true)
    setError('')

    try {
      const success = await login(email, password)
      if (success) {
        navigate('/dashboard')
      } else {
        setError(
          'Invalid credentials or insufficient permissions. Please verify your admin access.'
        )
      }
    } catch (error) {
      setError(
        'Authentication failed. Please check your connection and try again.'
      )
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true)
    setError('')

    try {
      const success = await googleSignIn()
      if (success) {
        navigate('/dashboard')
      } else {
        setError(
          'Google authentication failed or insufficient admin permissions.'
        )
      }
    } catch (error) {
      setError('Google sign-in failed. Please try again.')
      console.error('Google sign-in error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={formVariants}
      initial='hidden'
      animate='visible'
      className={cn('space-y-6', className)}
    >
      <form onSubmit={onSubmit} className='space-y-5'>
        {/* Email Field */}
        <motion.div variants={itemVariants} className='space-y-2'>
          <Label htmlFor='email' className='font-medium text-slate-300'>
            Email Address
          </Label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <Mail className='h-4 w-4 text-slate-400' />
            </div>
            <Input
              id='email'
              placeholder='admin@company.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setEmailTouched(true)}
              className={cn(
                'h-12 border-slate-600 bg-slate-800/50 pl-10 pr-10 text-white placeholder:text-slate-400',
                'transition-all duration-200 focus:border-blue-500 focus:ring-blue-500/20',
                emailTouched &&
                  !isEmailValid &&
                  'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                emailTouched &&
                  isEmailValid &&
                  'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20'
              )}
              required
            />
            {emailTouched && (
              <div className='absolute inset-y-0 right-0 flex items-center pr-3'>
                {isEmailValid ? (
                  <CheckCircle2 className='h-4 w-4 text-emerald-500' />
                ) : (
                  <AlertCircle className='h-4 w-4 text-red-500' />
                )}
              </div>
            )}
          </div>
          <AnimatePresence>
            {emailTouched && !isEmailValid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='flex items-center gap-1 text-xs text-red-400'
              >
                <AlertCircle className='h-3 w-3' />
                Please enter a valid email address
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Password Field */}
        <motion.div variants={itemVariants} className='space-y-2'>
          <Label htmlFor='password' className='font-medium text-slate-300'>
            Password
          </Label>
          <div className='relative'>
            <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
              <Lock className='h-4 w-4 text-slate-400' />
            </div>
            <Input
              id='password'
              placeholder='Enter your password'
              type={showPassword ? 'text' : 'password'}
              autoCapitalize='none'
              autoComplete='current-password'
              autoCorrect='off'
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setPasswordTouched(true)}
              className={cn(
                'h-12 border-slate-600 bg-slate-800/50 pl-10 pr-10 text-white placeholder:text-slate-400',
                'transition-all duration-200 focus:border-blue-500 focus:ring-blue-500/20',
                passwordTouched &&
                  !isPasswordValid &&
                  'border-red-500 focus:border-red-500 focus:ring-red-500/20',
                passwordTouched &&
                  isPasswordValid &&
                  'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20'
              )}
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 transition-colors hover:text-slate-300'
            >
              {showPassword ? (
                <EyeOff className='h-4 w-4' />
              ) : (
                <Eye className='h-4 w-4' />
              )}
            </button>
          </div>
          <AnimatePresence>
            {passwordTouched && !isPasswordValid && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className='flex items-center gap-1 text-xs text-red-400'
              >
                <AlertCircle className='h-3 w-3' />
                Password must be at least 6 characters
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className='flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400'
            >
              <AlertCircle className='mt-0.5 h-4 w-4 flex-shrink-0' />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <motion.div variants={itemVariants}>
          <Button
            type='submit'
            disabled={isLoading || !isFormValid}
            className={cn(
              'h-12 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
              'disabled:cursor-not-allowed disabled:from-slate-600 disabled:to-slate-700',
              'font-semibold text-white shadow-lg transition-all duration-200',
              'focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800'
            )}
          >
            {isLoading ? (
              <div className='flex items-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white' />
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </Button>
        </motion.div>
      </form>

      {/* Divider */}
      <motion.div variants={itemVariants} className='relative'>
        <div className='absolute inset-0 flex items-center'>
          <span className='w-full border-t border-slate-700' />
        </div>
        <div className='relative flex justify-center text-xs uppercase'>
          <span className='bg-slate-800/50 px-3 font-medium text-slate-400'>
            Or continue with
          </span>
        </div>
      </motion.div>

      {/* Google Sign In */}
      <motion.div variants={itemVariants}>
        <Button
          variant='outline'
          type='button'
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className={cn(
            'h-12 w-full border-slate-600 bg-white/5 hover:bg-white/10',
            'text-slate-300 transition-all duration-200 hover:text-white',
            'focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-slate-800'
          )}
        >
          {isLoading ? (
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-slate-200' />
          ) : (
            <div className='flex items-center gap-3'>
              <Icons.google className='h-4 w-4' />
              <span className='font-medium'>Continue with Google</span>
            </div>
          )}
        </Button>
      </motion.div>

      {/* Admin Credentials Info */}
      <motion.div variants={itemVariants} className='space-y-4 pt-2'>
        <div className='text-center'>
          <div className='mb-3 flex items-center justify-center gap-2'>
            <p className='text-xs font-medium text-slate-400'>
              Demo Admin Credentials
            </p>
            <Button
              type='button'
              variant='outline'
              size='sm'
              onClick={autofillCredentials}
              className='h-6 border-blue-500/20 bg-blue-500/10 px-2 text-xs text-blue-400 hover:bg-blue-500/20'
            >
              Auto-fill
            </Button>
          </div>
          <div className='space-y-2'>
            <div className='group flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 transition-colors hover:bg-slate-800/50'>
              <span className='text-xs text-slate-400'>Email:</span>
              <div className='flex items-center gap-2'>
                <code className='rounded bg-slate-700/50 px-2 py-1 font-mono text-xs text-blue-400'>
                  admin@bayshoreai.com
                </code>
                <button
                  onClick={() =>
                    copyToClipboard('admin@bayshoreai.com', 'email')
                  }
                  className='rounded p-1 opacity-0 transition-opacity hover:bg-slate-600/50 group-hover:opacity-100'
                >
                  {copiedField === 'email' ? (
                    <Check className='h-3 w-3 text-emerald-400' />
                  ) : (
                    <Copy className='h-3 w-3 text-slate-400' />
                  )}
                </button>
              </div>
            </div>
            <div className='group flex items-center justify-between rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 transition-colors hover:bg-slate-800/50'>
              <span className='text-xs text-slate-400'>Password:</span>
              <div className='flex items-center gap-2'>
                <code className='rounded bg-slate-700/50 px-2 py-1 font-mono text-xs text-blue-400'>
                  admin123
                </code>
                <button
                  onClick={() => copyToClipboard('admin123', 'password')}
                  className='rounded p-1 opacity-0 transition-opacity hover:bg-slate-600/50 group-hover:opacity-100'
                >
                  {copiedField === 'password' ? (
                    <Check className='h-3 w-3 text-emerald-400' />
                  ) : (
                    <Copy className='h-3 w-3 text-slate-400' />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='border-t border-slate-700/50 pt-3 text-center'>
          <p className='text-xs text-slate-500'>
            🔒 Admin access only • Enterprise-grade security
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
