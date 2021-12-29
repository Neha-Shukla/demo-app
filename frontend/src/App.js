import logo from "./logo.svg";
import "./App.css";
import AccountModal from "./components/header";
import Main from "./components/main";

function App() {
  return (
    <div className="App">
      <AccountModal />
      <Main />
    </div>
  );
}

export default App;
