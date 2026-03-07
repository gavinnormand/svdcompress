import Footer from "./components/footer";
import Nav from "./components/nav";
import Home from "./pages/home";

function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <div className="flex-1">
        <Home />
      </div>
      <Footer />
    </div>
  );
}

export default App;
