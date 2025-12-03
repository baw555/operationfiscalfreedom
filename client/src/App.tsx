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
import AffiliateApply from "@/pages/affiliate-apply";
import GetHelp from "@/pages/get-help";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import AffiliateLogin from "@/pages/affiliate-login";
import AffiliateDashboard from "@/pages/affiliate-dashboard";
import AdminSetup from "@/pages/admin-setup";
import ApplyStartupGrant from "@/pages/apply-startup-grant";
import Investors from "@/pages/investors";
import NewHomeFurniture from "@/pages/new-home-furniture";

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
      <Route path="/apply-startup-grant" component={ApplyStartupGrant} />
      <Route path="/investors" component={Investors} />
      <Route path="/new-home-furniture" component={NewHomeFurniture} />
      {/* Lead Management System Routes */}
      <Route path="/affiliate" component={AffiliateApply} />
      <Route path="/get-help" component={GetHelp} />
      <Route path="/admin/setup" component={AdminSetup} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/affiliate/login" component={AffiliateLogin} />
      <Route path="/affiliate/dashboard" component={AffiliateDashboard} />
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
