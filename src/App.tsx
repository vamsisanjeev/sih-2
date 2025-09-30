import { ThemeProvider } from './contexts/ThemeContext';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <ThemeProvider>
      <MainLayout />
    </ThemeProvider>
  );
}

export default App;
