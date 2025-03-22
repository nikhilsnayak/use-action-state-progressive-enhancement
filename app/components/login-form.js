'use client';

import { useActionState } from 'react';

export function LoginForm({ action }) {
  const [state, formAction] = useActionState(action, null);

  return (
    <section className='max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
        Login Form with{' '}
        <code className='bg-gray-200 dark:bg-gray-800 px-1 rounded'>
          useActionState
        </code>{' '}
        Progressive Enhancement
      </h2>
      <p
        className={`text-sm ${
          state?.success
            ? 'text-green-600 dark:text-green-400'
            : 'text-red-600 dark:text-red-400'
        } ${state?.message ? 'opacity-100' : 'opacity-0'}`}
      >
        {state?.message}
      </p>
      <form action={formAction} className='space-y-4'>
        <label className='block'>
          <span className='text-gray-700 dark:text-gray-300'>Email</span>
          <input
            type='email'
            name='email'
            className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            defaultValue={state?.formValues?.email}
          />
        </label>
        <label className='block'>
          <span className='text-gray-700 dark:text-gray-300'>Password</span>
          <input
            type='password'
            name='password'
            className='mt-1 w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
            defaultValue={state?.formValues?.password}
          />
        </label>
        <button
          type='submit'
          className='w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition'
        >
          Login
        </button>
      </form>
    </section>
  );
}
