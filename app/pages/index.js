import { LoginForm } from '../components/login-form';
import { login } from '../functions/login';

export default function Page() {
  return (
    <main className='h-full grid place-items-center'>
      <LoginForm action={login} />
    </main>
  );
}
