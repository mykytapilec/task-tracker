import AuthForm from './AuthForm.tsx';

function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Task Tracker
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage your tasks with a simple and focused workflow.
          </p>
        </div>

        <AuthForm />
      </div>
    </main>
  );
}

export default AuthPage;
