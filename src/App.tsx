import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import styled from "styled-components";
import Header from "./components/Header";
import Home from "./routes/Home";
import Search from "./routes/Search";
import Tv from "./routes/Tv";
// basename={process.env.PUBLIC_URL}
function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>

        <Route path={["/", "/movie/:movieId"]}>
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
