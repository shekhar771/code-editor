import { FormEvent, useState } from 'react'

type AuthMode = 'login' | 'register'

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Phase 2: connect to POST /api/auth/login or /api/auth/register
  }

  const toggleMode = () => {
    setMode((current) => (current === 'login' ? 'register' : 'login'))
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1e1e1e] px-4">
      <div className="w-full max-w-md rounded-lg border border-[#3c3c3c] bg-[#252526] p-8 shadow-xl">
        <h1 className="mb-1 text-center text-2xl font-bold text-white">CodeSync</h1>
        <p className="mb-6 text-center text-sm text-gray-400">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-300">
                Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0e639c] focus:ring-1 focus:ring-[#0e639c]"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0e639c] focus:ring-1 focus:ring-[#0e639c]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              className="w-full rounded border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-white placeholder-gray-500 outline-none focus:border-[#0e639c] focus:ring-1 focus:ring-[#0e639c]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="mt-2 w-full rounded bg-[#0e639c] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1177bb]"
          >
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={toggleMode}
            className="font-medium text-[#3794ff] hover:text-[#4da3ff]"
          >
            {mode === 'login' ? 'Register' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  )
}
