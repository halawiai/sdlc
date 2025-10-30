import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProcessFlowPage from './pages/ProcessFlowPage';
import VisualProcessPage from './pages/VisualProcessPage';
import HorizontalProcessPage from './pages/HorizontalProcessPage';
import FullLifecyclePage from './pages/FullLifecyclePage';
import RACIMatrixPage from './pages/RACIMatrixPage';
import GovernanceFrameworkPage from './pages/GovernanceFrameworkPage';
import SitemapPage from './pages/SitemapPage';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import NotFoundPage from './pages/NotFoundPage';
import EditableProcessTestPage from './pages/EditableProcessTestPage';
import CriteriaMatrixPage from './pages/CriteriaMatrixPage';
import EditableProcessPage from './pages/EditableProcessPage';
import VisualProcessTestPage from './pages/VisualProcessTestPage';
import ProcessFlowTestPage from './pages/ProcessFlowTestPage';
import SDLCProcessPage from './pages/SDLCProcessPage';
import PrioritizationFrameworkPage from './pages/PrioritizationFrameworkPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><ProcessFlowTestPage /></Layout>} />
        <Route path="/process-flow" element={<Layout><ProcessFlowPage /></Layout>} />
        <Route path="/process-flow-test" element={<Layout><ProcessFlowTestPage /></Layout>} />
        <Route path="/visual-process" element={<Layout><VisualProcessPage /></Layout>} />
        <Route path="/horizontal-process" element={<Layout><HorizontalProcessPage /></Layout>} />
        <Route path="/full-lifecycle" element={<Layout><FullLifecyclePage /></Layout>} />
        <Route path="/criteria" element={<Layout><CriteriaMatrixPage /></Layout>} />
        <Route path="/prioritization-framework" element={<Layout><PrioritizationFrameworkPage /></Layout>} />
        <Route path="/raci-matrix" element={<Layout><RACIMatrixPage /></Layout>} />
        <Route path="/governance-framework" element={<Layout><GovernanceFrameworkPage /></Layout>} />
        <Route path="/sdlc-process" element={<Layout><SDLCProcessPage /></Layout>} />
        <Route path="/sitemap" element={<Layout><SitemapPage /></Layout>} />
        <Route path="/about" element={<Layout><AboutPage /></Layout>} />
        <Route path="/help" element={<Layout><HelpPage /></Layout>} />
        <Route path="/editable-test" element={<Layout><EditableProcessTestPage /></Layout>} />
        <Route path="/documentation/editable-process" element={<Layout><EditableProcessPage /></Layout>} />
        <Route path="/process/visual-process-test" element={<Layout><VisualProcessTestPage /></Layout>} />
        <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;