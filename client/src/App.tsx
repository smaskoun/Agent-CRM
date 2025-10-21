import { Link, Route, Switch } from "wouter";
import { ClientsPage } from "./pages/ClientsPage";
import { DealsPage } from "./pages/DealsPage";
import { HomePage } from "./pages/HomePage";
import { PipelinePage } from "./pages/PipelinePage";
import { Layout } from "./components/Layout";

const navigation = [
  { href: "/", label: "Overview" },
  { href: "/pipeline", label: "Pipeline" },
  { href: "/clients", label: "Clients" },
  { href: "/deals", label: "Deals" },
];

export default function App() {
  return (
    <Layout
      navigation={navigation.map((item) => (
        <Link key={item.href} href={item.href}>
          {item.label}
        </Link>
      ))}
    >
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
