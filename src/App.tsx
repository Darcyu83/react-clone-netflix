import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from "./routes/Tv";

const Nav = styled.nav``;

function App() {
  return (
    <Router>
      <nav> </nav>

      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
