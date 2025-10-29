import { Route, Switch } from "wouter";
import { ClientsPage } from "./pages/ClientsPage";
import { DealsPage } from "./pages/DealsPage";
import { HomePage } from "./pages/HomePage";
import { PipelinePage } from "./pages/PipelinePage";
import { Layout } from "./components/Layout";

const navigation = [
  { href: "/", label: "Dashboard", icon: "🏠" },
  { href: "/clients", label: "Contacts", icon: "👥" },
  { href: "/deals", label: "Deals", icon: "💼" },
  { href: "/pipeline", label: "Pipeline", icon: "🗂️" },
];

export default function App() {
  return (
    <Layout navigation={navigation}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/pipeline" component={PipelinePage} />
        <Route path="/clients" component={ClientsPage} />
        <Route path="/deals" component={DealsPage} />
        <Route>
          <div>
            <h1>Page not found</h1>
            <p>The requested page could not be located.</p>
          </div>
        </Route>
      </Switch>
    </Layout>
  );
}
