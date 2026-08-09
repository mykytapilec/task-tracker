import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <MainLayout>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <p className="mt-2 text-slate-600">
          Manage your tasks and track their progress.
        </p>
      </section>
    </MainLayout>
  );
}

export default App;
