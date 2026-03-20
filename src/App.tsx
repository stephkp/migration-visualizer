import { useState } from "react";
import { Header } from "@/components/Header";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <main className="app__main">
        <div className="app__content">
          <h1 className="app__title">FlowState</h1>
          <p className="app__subtitle">Global Migration Visualizer</p>
        </div>
      </main>
    </div>
  );
}

export default App;
