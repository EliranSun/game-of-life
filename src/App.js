import React from 'react';
import './App.css';

import Grid from './components/grid';

function App() {
  return (
    <div className="App">
      <Grid rows={ 10 } cols={ 10 } />
    </div>
  );
}

export default App;
