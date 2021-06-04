import LoginAndSignup from "./pages/LoginAndSignup";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PrivateRoute } from "./auth/privateroute";
import Userdetails from "./pages/Userdetails";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={LoginAndSignup} />
          <PrivateRoute path="/userdetails" component={Userdetails} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
