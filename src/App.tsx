import Board from './features/board/components/Board';
import TaskForm from './features/tasks/components/TaskForm';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <TaskForm />
        <Board />
      </div>
    </MainLayout>
  );
}

export default App;
