import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Detail } from './pages/Detail';
import { Player } from './pages/Player';
import { Upload } from './pages/Upload';
import { useEffect } from 'react';
import { useStore } from './store/useStore';

function App() {
  const { fetchData } = useStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="series/:id" element={<Detail />} />
          <Route path="upload" element={<Upload />} />
        </Route>
        <Route path="/player/:seriesId/:episodeId" element={<Player />} />
      </Routes>
    </Router>
  );
}

export default App;
