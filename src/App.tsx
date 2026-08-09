import MainLayout from './layouts/MainLayout';
import TaskForm from './features/tasks/components/TaskForm';
import TaskList from './features/tasks/components/TaskList';

function App() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <TaskForm />
        <TaskList />
      </div>
    </MainLayout>
  );
}

export default App;
