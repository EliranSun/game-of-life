import React from 'react';
import './App.css';

import Grid from './components/grid';

function App() {
  return (
    <div className="App">
      <Grid rows={ 50 } cols={ 50 } />
    </div>
  );
}

export default App;
