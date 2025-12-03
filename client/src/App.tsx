import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import VARatingSoftware from "@/pages/va-software";
import ManualHelp from "@/pages/manual-help";
import Gigs from "@/pages/gigs";
import Businesses from "@/pages/businesses";
import Income from "@/pages/income";
import Resources from "@/pages/resources";
import SuccessStories from "@/pages/success";
import JoinMission from "@/pages/join";
import Contact from "@/pages/contact";
import Login from "@/pages/login";

import ApplyWebsite from "@/pages/apply-website";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/va-software" component={VARatingSoftware} />
      <Route path="/manual-help" component={ManualHelp} />
      <Route path="/gigs" component={Gigs} />
      <Route path="/businesses" component={Businesses} />
      <Route path="/income" component={Income} />
      <Route path="/resources" component={Resources} />
      <Route path="/success" component={SuccessStories} />
      <Route path="/join" component={JoinMission} />
      <Route path="/contact" component={Contact} />
      <Route path="/login" component={Login} />
      <Route path="/apply-website" component={ApplyWebsite} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
