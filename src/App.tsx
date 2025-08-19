import './App.css';
import { Button } from './components/ui/button';
import { cn } from './lib/utils';

function App() {
  const sara = false;
  return (
    <div className={cn('bg-red-500', sara && 'bg-blue-500')}>
      sara
      <Button>sara and shrouq</Button>
    </div>
  );
}

export default App;
