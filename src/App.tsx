import { Home } from "./pages/home";
import { NewRoom } from "./pages/newRoom";
import { Room } from "./pages/room";
import { AdminRoom } from "./pages/adminRoom";
import {BrowserRouter, Route, Switch } from 'react-router-dom'

import { AuthContextProvider } from './contexts/AuthContext'

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" exact component={Home}/>
          <Route path="/rooms/new" exact component={NewRoom}/>
          <Route path="/rooms/:id" exact component={Room}/>
          <Route path="/admin/rooms/:id" exact component={AdminRoom}/>
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
