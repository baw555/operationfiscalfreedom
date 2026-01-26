import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/hooks/use-scroll-to-top";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import VARatingSoftware from "@/pages/va-software";
import ManualHelp from "@/pages/manual-help";
import FinOps from "@/pages/fin-ops";
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
import MasterPortal from "@/pages/master-portal";
import SubMasterPortal from "@/pages/submaster-portal";
import VeteranIntake from "@/pages/veteran-intake";
import BusinessIntake from "@/pages/business-intake";
import SignContract from "@/pages/sign-contract";
import CompPlan from "@/pages/comp-plan";
import ScheduleA from "@/pages/schedule-a";
import ApplyStartupGrant from "@/pages/apply-startup-grant";
import Investors from "@/pages/investors";
import NewHomeFurniture from "@/pages/new-home-furniture";
import PrivateDoctor from "@/pages/private-doctor";
import BecomeInvestor from "@/pages/become-investor";
import MissionActHealth from "@/pages/mission-act-health";
import MerchantServices from "@/pages/merchant-services";
import MyLocker from "@/pages/my-locker";
import Shipping from "@/pages/shipping";
import LogisticsOverview from "@/pages/logistics-overview";
import BestPractices from "@/pages/best-practices";
import DownloadParcelChecklist from "@/pages/download-parcel-checklist";
import DownloadFreightChecklist from "@/pages/download-freight-checklist";
import DownloadRatePlaybook from "@/pages/download-rate-playbook";
import DownloadFedExRates from "@/pages/download-fedex-rates";
import DownloadUPSRates from "@/pages/download-ups-rates";
import FinOp from "@/pages/fin-op";
import VLTHome from "@/pages/vlt/home";
import VLTTaxPreparation from "@/pages/vlt/tax-preparation";
import VLTTaxPlanning from "@/pages/vlt/tax-planning";
import VLTTaxResolution from "@/pages/vlt/tax-resolution";
import VLTTaxRecovery from "@/pages/vlt/tax-recovery";
import VLTPayroll from "@/pages/vlt/payroll";
import VLTSalesUseTaxDefense from "@/pages/vlt/sales-use-tax-defense";
import VLTTaxCreditsIncentives from "@/pages/vlt/tax-credits-incentives";
import VLTOutsourcedAccounting from "@/pages/vlt/outsourced-accounting";
import VLTFractionalCFO from "@/pages/vlt/fractional-cfo";
import VLTEntityStructuring from "@/pages/vlt/entity-structuring";
import VLTIntake from "@/pages/vlt/intake";
import VLTOurLegacy from "@/pages/vlt/our-legacy";
import VLTServices from "@/pages/vlt/services";
import VLTResources from "@/pages/vlt/resources/index";
import VLTIRSNotices from "@/pages/vlt/resources/irs-notices";
import VLTCP14 from "@/pages/vlt/resources/cp14";
import VLTLT11 from "@/pages/vlt/resources/lt11";
import VLTCP504 from "@/pages/vlt/resources/cp504";
import VLTAuditRepresentation from "@/pages/vlt/resources/audit-representation";
import VLTWageGarnishments from "@/pages/vlt/resources/wage-garnishments";
import VLTFormsAndLetters from "@/pages/vlt/resources/forms-and-letters";
import VLTBusinessLoans from "@/pages/vlt/resources/business-loans";
import VLTGuides from "@/pages/vlt/resources/guides";
import VLTApps from "@/pages/vlt/apps/index";
import VLTCRM from "@/pages/vlt/apps/crm";
import VLTWOTC from "@/pages/vlt/apps/wotc";
import VLTSmartFile from "@/pages/vlt/apps/smartfile";
import VLTVideos from "@/pages/vlt/videos";
import VLTTaxNews from "@/pages/vlt/tax-news";
import VLTFAQs from "@/pages/vlt/faqs";
import VLTLocations from "@/pages/vlt/locations";
import VLTPartners from "@/pages/vlt/partners";
import VLTDisclosures from "@/pages/vlt/disclosures";
import VLTPrivacy from "@/pages/vlt/privacy";
import VLTTerms from "@/pages/vlt/terms";
import VLTTaxCredits from "@/pages/vlt/tax-credits/index";
import VLTRDTaxCredit from "@/pages/vlt/tax-credits/rd-tax-credit";
import VLTUtilityTaxCredit from "@/pages/vlt/tax-credits/utility-tax-credit";
import VLTWOTCCredit from "@/pages/vlt/tax-credits/wotc";
import VLTEnergyTaxCredits from "@/pages/vlt/tax-credits/energy-tax-credits";
import VLTPaidFamilyLeaveCredit from "@/pages/vlt/tax-credits/paid-family-leave-credit";
import VLTDisabledAccessCredit from "@/pages/vlt/tax-credits/disabled-access-credit";
import VLTEmployerChildcareCredit from "@/pages/vlt/tax-credits/employer-childcare-credit";
import VLTPensionStartupCredit from "@/pages/vlt/tax-credits/pension-startup-credit";
import VLTFICATipCredit from "@/pages/vlt/tax-credits/fica-tip-credit";
import VLTNewMarketsCredit from "@/pages/vlt/tax-credits/new-markets-credit";
import VLTRehabilitationCredit from "@/pages/vlt/tax-credits/rehabilitation-credit";
import VLTSmallBusinessHealthCredit from "@/pages/vlt/tax-credits/small-business-health-credit";
import VLTLIHTC from "@/pages/vlt/tax-credits/lihtc";
import VLTIndianEmploymentCredit from "@/pages/vlt/tax-credits/indian-employment-credit";
import VLTEITC from "@/pages/vlt/tax-credits/eitc";
import VLTChildTaxCredit from "@/pages/vlt/tax-credits/child-tax-credit";
import VLTAOTC from "@/pages/vlt/tax-credits/aotc";
import VLTLifetimeLearningCredit from "@/pages/vlt/tax-credits/lifetime-learning-credit";
import VLTSaversCredit from "@/pages/vlt/tax-credits/savers-credit";
import VLTAdoptionCredit from "@/pages/vlt/tax-credits/adoption-credit";
import VLTDependentCareCredit from "@/pages/vlt/tax-credits/dependent-care-credit";
import VLTForeignTaxCredit from "@/pages/vlt/tax-credits/foreign-tax-credit";
import VLTElderlyDisabledCredit from "@/pages/vlt/tax-credits/elderly-disabled-credit";
import VLTPremiumTaxCredit from "@/pages/vlt/tax-credits/premium-tax-credit";
import VLTArticles from "@/pages/vlt/articles/index";
import VLTUnfiledTaxReturns from "@/pages/vlt/articles/unfiled-tax-returns";
import VLTBackTaxes from "@/pages/vlt/articles/back-taxes";
import VLTIRSAudit from "@/pages/vlt/articles/irs-audit";
import VLTPay from "@/pages/vlt/pay";
import VLTAdmin from "@/pages/vlt/admin";
import VLTAffiliatePortal from "@/pages/vlt/affiliate-portal";
import VLTFinOpsRefer from "@/pages/vlt/finops-refer";
import VLTBusinessOwner from "@/pages/vlt/business-owner";
import VLTIntakeRefer from "@/pages/vlt/intake-refer";
import VLTIntakeClient from "@/pages/vlt/intake-client";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/va-software" component={VARatingSoftware} />
      <Route path="/manual-help" component={ManualHelp} />
      <Route path="/fin-ops" component={FinOps} />
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
      <Route path="/private-doctor" component={PrivateDoctor} />
      <Route path="/become-investor" component={BecomeInvestor} />
      <Route path="/mission-act-health" component={MissionActHealth} />
      <Route path="/merchant-services" component={MerchantServices} />
      <Route path="/my-locker" component={MyLocker} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/logistics-overview" component={LogisticsOverview} />
      <Route path="/best-practices" component={BestPractices} />
      <Route path="/download/parcel-checklist" component={DownloadParcelChecklist} />
      <Route path="/download/freight-checklist" component={DownloadFreightChecklist} />
      <Route path="/download/rate-playbook" component={DownloadRatePlaybook} />
      <Route path="/download/fedex-rates" component={DownloadFedExRates} />
      <Route path="/download/ups-rates" component={DownloadUPSRates} />
      <Route path="/veteran-led-tax" component={VLTHome} />
      <Route path="/veteran-led-tax/our-legacy" component={VLTOurLegacy} />
      <Route path="/veteran-led-tax/services" component={VLTServices} />
      <Route path="/veteran-led-tax/services/tax-preparation" component={VLTTaxPreparation} />
      <Route path="/veteran-led-tax/services/tax-planning" component={VLTTaxPlanning} />
      <Route path="/veteran-led-tax/services/tax-resolution" component={VLTTaxResolution} />
      <Route path="/veteran-led-tax/services/tax-recovery" component={VLTTaxRecovery} />
      <Route path="/veteran-led-tax/services/payroll" component={VLTPayroll} />
      <Route path="/veteran-led-tax/services/sales-use-tax-defense" component={VLTSalesUseTaxDefense} />
      <Route path="/veteran-led-tax/services/tax-credits-incentives" component={VLTTaxCreditsIncentives} />
      <Route path="/veteran-led-tax/services/outsourced-accounting" component={VLTOutsourcedAccounting} />
      <Route path="/veteran-led-tax/services/fractional-cfo" component={VLTFractionalCFO} />
      <Route path="/veteran-led-tax/services/entity-structuring" component={VLTEntityStructuring} />
      <Route path="/veteran-led-tax/services/tax-credits" component={VLTTaxCredits} />
      <Route path="/veteran-led-tax/services/tax-credits/rd-tax-credit" component={VLTRDTaxCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/utility-tax-credit" component={VLTUtilityTaxCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/wotc" component={VLTWOTCCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/energy-tax-credits" component={VLTEnergyTaxCredits} />
      <Route path="/veteran-led-tax/services/tax-credits/paid-family-leave-credit" component={VLTPaidFamilyLeaveCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/disabled-access-credit" component={VLTDisabledAccessCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/employer-childcare-credit" component={VLTEmployerChildcareCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/pension-startup-credit" component={VLTPensionStartupCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/fica-tip-credit" component={VLTFICATipCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/new-markets-credit" component={VLTNewMarketsCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/rehabilitation-credit" component={VLTRehabilitationCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/small-business-health-credit" component={VLTSmallBusinessHealthCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/lihtc" component={VLTLIHTC} />
      <Route path="/veteran-led-tax/services/tax-credits/indian-employment-credit" component={VLTIndianEmploymentCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/eitc" component={VLTEITC} />
      <Route path="/veteran-led-tax/services/tax-credits/child-tax-credit" component={VLTChildTaxCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/aotc" component={VLTAOTC} />
      <Route path="/veteran-led-tax/services/tax-credits/lifetime-learning-credit" component={VLTLifetimeLearningCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/savers-credit" component={VLTSaversCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/adoption-credit" component={VLTAdoptionCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/dependent-care-credit" component={VLTDependentCareCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/foreign-tax-credit" component={VLTForeignTaxCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/elderly-disabled-credit" component={VLTElderlyDisabledCredit} />
      <Route path="/veteran-led-tax/services/tax-credits/premium-tax-credit" component={VLTPremiumTaxCredit} />
      <Route path="/veteran-led-tax/intake" component={VLTIntake} />
      <Route path="/veteran-led-tax/resources" component={VLTResources} />
      <Route path="/veteran-led-tax/resources/irs-notices" component={VLTIRSNotices} />
      <Route path="/veteran-led-tax/resources/irs-notices/cp14" component={VLTCP14} />
      <Route path="/veteran-led-tax/resources/irs-notices/lt11" component={VLTLT11} />
      <Route path="/veteran-led-tax/resources/irs-notices/cp504" component={VLTCP504} />
      <Route path="/veteran-led-tax/resources/audit-representation" component={VLTAuditRepresentation} />
      <Route path="/veteran-led-tax/resources/wage-garnishments" component={VLTWageGarnishments} />
      <Route path="/veteran-led-tax/resources/forms-and-letters" component={VLTFormsAndLetters} />
      <Route path="/veteran-led-tax/resources/business-loans" component={VLTBusinessLoans} />
      <Route path="/veteran-led-tax/resources/guides" component={VLTGuides} />
      <Route path="/veteran-led-tax/apps" component={VLTApps} />
      <Route path="/veteran-led-tax/apps/all" component={VLTApps} />
      <Route path="/veteran-led-tax/apps/crm" component={VLTCRM} />
      <Route path="/veteran-led-tax/apps/wotc" component={VLTWOTC} />
      <Route path="/veteran-led-tax/apps/smartfile" component={VLTSmartFile} />
      <Route path="/veteran-led-tax/videos" component={VLTVideos} />
      <Route path="/veteran-led-tax/tax-news" component={VLTTaxNews} />
      <Route path="/veteran-led-tax/faqs" component={VLTFAQs} />
      <Route path="/veteran-led-tax/articles" component={VLTArticles} />
      <Route path="/veteran-led-tax/articles/unfiled-tax-returns" component={VLTUnfiledTaxReturns} />
      <Route path="/veteran-led-tax/articles/back-taxes" component={VLTBackTaxes} />
      <Route path="/veteran-led-tax/articles/irs-audit" component={VLTIRSAudit} />
      <Route path="/veteran-led-tax/locations" component={VLTLocations} />
      <Route path="/veteran-led-tax/partners" component={VLTPartners} />
      <Route path="/veteran-led-tax/pay" component={VLTPay} />
      <Route path="/veteran-led-tax/admin" component={VLTAdmin} />
      <Route path="/veteran-led-tax/affiliate" component={VLTAffiliatePortal} />
      <Route path="/veteran-led-tax/finops-refer" component={VLTFinOpsRefer} />
      <Route path="/veteran-led-tax/business-owner" component={VLTBusinessOwner} />
      <Route path="/veteran-led-tax/intake-refer" component={VLTIntakeRefer} />
      <Route path="/veteran-led-tax/intake-client" component={VLTIntakeClient} />
      <Route path="/veteran-led-tax/disclosures" component={VLTDisclosures} />
      <Route path="/veteran-led-tax/privacy" component={VLTPrivacy} />
      <Route path="/veteran-led-tax/terms" component={VLTTerms} />
      {/* Lead Management System Routes */}
      <Route path="/affiliate" component={AffiliateApply} />
      <Route path="/get-help" component={GetHelp} />
      <Route path="/admin/setup" component={AdminSetup} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      <Route path="/master-portal" component={MasterPortal} />
      <Route path="/submaster-portal" component={SubMasterPortal} />
      <Route path="/veteran-intake" component={VeteranIntake} />
      <Route path="/business-intake" component={BusinessIntake} />
      <Route path="/sign-contract" component={SignContract} />
      <Route path="/comp-plan" component={CompPlan} />
      <Route path="/schedule-a" component={ScheduleA} />
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
        <ScrollToTop />
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
