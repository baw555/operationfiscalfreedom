import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/hooks/use-scroll-to-top";
import { lazy, Suspense } from "react";

// Only eagerly load the homepage - everything else is lazy loaded
import Home from "@/pages/home";

// Loading component for lazy routes
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-brand-navy">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-white border-t-brand-red rounded-full animate-spin mx-auto mb-4" />
      <p className="text-white font-display text-xl">Loading...</p>
    </div>
  </div>
);

// Lazy load all other pages
const NotFound = lazy(() => import("@/pages/not-found"));
const About = lazy(() => import("@/pages/about"));
const FinOps = lazy(() => import("@/pages/fin-ops"));
const Businesses = lazy(() => import("@/pages/businesses"));
const Income = lazy(() => import("@/pages/income"));
const Resources = lazy(() => import("@/pages/resources"));
const SuccessStories = lazy(() => import("@/pages/success"));
const JoinMission = lazy(() => import("@/pages/join"));
const Contact = lazy(() => import("@/pages/contact"));
const Login = lazy(() => import("@/pages/login"));
const ApplyWebsite = lazy(() => import("@/pages/apply-website"));
const AffiliateApply = lazy(() => import("@/pages/affiliate-apply"));
const GetHelp = lazy(() => import("@/pages/get-help"));
const AdminLogin = lazy(() => import("@/pages/admin-login"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const AffiliateLogin = lazy(() => import("@/pages/affiliate-login"));
const AffiliateDashboard = lazy(() => import("@/pages/affiliate-dashboard"));
const AffiliateNda = lazy(() => import("@/pages/affiliate-nda"));
const AdminSetup = lazy(() => import("@/pages/admin-setup"));
const MasterPortal = lazy(() => import("@/pages/master-portal"));
const SubMasterPortal = lazy(() => import("@/pages/submaster-portal"));
const VeteranIntake = lazy(() => import("@/pages/veteran-intake"));
const BusinessIntake = lazy(() => import("@/pages/business-intake"));
const SignContract = lazy(() => import("@/pages/sign-contract"));
const CompPlan = lazy(() => import("@/pages/comp-plan"));
const ScheduleA = lazy(() => import("@/pages/schedule-a"));
const ApplyStartupGrant = lazy(() => import("@/pages/apply-startup-grant"));
const NewHomeFurniture = lazy(() => import("@/pages/new-home-furniture"));
const PrivateDoctor = lazy(() => import("@/pages/private-doctor"));
const Transparency = lazy(() => import("@/pages/transparency"));
const MissionActHealth = lazy(() => import("@/pages/mission-act-health"));
const MerchantServices = lazy(() => import("@/pages/merchant-services"));
const MyLocker = lazy(() => import("@/pages/my-locker"));
const VGiftCards = lazy(() => import("@/pages/vgift-cards"));
const Shipping = lazy(() => import("@/pages/shipping"));
const Insurance = lazy(() => import("@/pages/insurance"));
const MedicalSales = lazy(() => import("@/pages/medical-sales"));
const BusinessDevelopment = lazy(() => import("@/pages/business-development"));
const LogisticsOverview = lazy(() => import("@/pages/logistics-overview"));
const BestPractices = lazy(() => import("@/pages/best-practices"));
const DownloadParcelChecklist = lazy(() => import("@/pages/download-parcel-checklist"));
const DownloadFreightChecklist = lazy(() => import("@/pages/download-freight-checklist"));
const DownloadRatePlaybook = lazy(() => import("@/pages/download-rate-playbook"));
const DownloadFedExRates = lazy(() => import("@/pages/download-fedex-rates"));
const DownloadUPSRates = lazy(() => import("@/pages/download-ups-rates"));
const FinOp = lazy(() => import("@/pages/fin-op"));
const StressTest = lazy(() => import("@/pages/stress-test"));
const JobPlacement = lazy(() => import("@/pages/job-placement"));
const VetProfessionals = lazy(() => import("@/pages/vet-professionals"));
const HealthcarePage = lazy(() => import("@/pages/healthcare"));

// Disability Rating pages
const DisabilityInitial = lazy(() => import("@/pages/disability-rating/initial"));
const DisabilityIncrease = lazy(() => import("@/pages/disability-rating/increase"));
const DisabilityDenial = lazy(() => import("@/pages/disability-rating/denial"));
const DisabilitySSDI = lazy(() => import("@/pages/disability-rating/ssdi"));
const DisabilityWidow = lazy(() => import("@/pages/disability-rating/widow"));
const DisabilityReferEarn = lazy(() => import("@/pages/disability-rating/refer-earn"));
const DisabilityIntake = lazy(() => import("@/pages/disability-rating/intake"));

// VLT pages - grouped lazy load
const VLTHome = lazy(() => import("@/pages/vlt/home"));
const VLTTaxPreparation = lazy(() => import("@/pages/vlt/tax-preparation"));
const VLTTaxPlanning = lazy(() => import("@/pages/vlt/tax-planning"));
const VLTTaxResolution = lazy(() => import("@/pages/vlt/tax-resolution"));
const VLTTaxRecovery = lazy(() => import("@/pages/vlt/tax-recovery"));
const VLTPayroll = lazy(() => import("@/pages/vlt/payroll"));
const VLTSalesUseTaxDefense = lazy(() => import("@/pages/vlt/sales-use-tax-defense"));
const VLTTaxCreditsIncentives = lazy(() => import("@/pages/vlt/tax-credits-incentives"));
const VLTOutsourcedAccounting = lazy(() => import("@/pages/vlt/outsourced-accounting"));
const VLTFractionalCFO = lazy(() => import("@/pages/vlt/fractional-cfo"));
const VLTEntityStructuring = lazy(() => import("@/pages/vlt/entity-structuring"));
const VLTIntake = lazy(() => import("@/pages/vlt/intake"));
const VLTOurLegacy = lazy(() => import("@/pages/vlt/our-legacy"));
const VLTServices = lazy(() => import("@/pages/vlt/services"));
const VLTResources = lazy(() => import("@/pages/vlt/resources/index"));
const VLTIRSNotices = lazy(() => import("@/pages/vlt/resources/irs-notices"));
const VLTCP14 = lazy(() => import("@/pages/vlt/resources/cp14"));
const VLTLT11 = lazy(() => import("@/pages/vlt/resources/lt11"));
const VLTCP504 = lazy(() => import("@/pages/vlt/resources/cp504"));
const VLTAuditRepresentation = lazy(() => import("@/pages/vlt/resources/audit-representation"));
const VLTWageGarnishments = lazy(() => import("@/pages/vlt/resources/wage-garnishments"));
const VLTFormsAndLetters = lazy(() => import("@/pages/vlt/resources/forms-and-letters"));
const VLTBusinessLoans = lazy(() => import("@/pages/vlt/resources/business-loans"));
const VLTGuides = lazy(() => import("@/pages/vlt/resources/guides"));
const VLTApps = lazy(() => import("@/pages/vlt/apps/index"));
const VLTCRM = lazy(() => import("@/pages/vlt/apps/crm"));
const VLTWOTC = lazy(() => import("@/pages/vlt/apps/wotc"));
const VLTSmartFile = lazy(() => import("@/pages/vlt/apps/smartfile"));
const VLTVideos = lazy(() => import("@/pages/vlt/videos"));
const VLTTaxNews = lazy(() => import("@/pages/vlt/tax-news"));
const VLTFAQs = lazy(() => import("@/pages/vlt/faqs"));
const VLTLocations = lazy(() => import("@/pages/vlt/locations"));
const VLTPartners = lazy(() => import("@/pages/vlt/partners"));
const VLTDisclosures = lazy(() => import("@/pages/vlt/disclosures"));
const VLTPrivacy = lazy(() => import("@/pages/vlt/privacy"));
const VLTTerms = lazy(() => import("@/pages/vlt/terms"));
const VLTTaxCredits = lazy(() => import("@/pages/vlt/tax-credits/index"));
const VLTRDTaxCredit = lazy(() => import("@/pages/vlt/tax-credits/rd-tax-credit"));
const VLTUtilityTaxCredit = lazy(() => import("@/pages/vlt/tax-credits/utility-tax-credit"));
const VLTWOTCCredit = lazy(() => import("@/pages/vlt/tax-credits/wotc"));
const VLTEnergyTaxCredits = lazy(() => import("@/pages/vlt/tax-credits/energy-tax-credits"));
const VLTPaidFamilyLeaveCredit = lazy(() => import("@/pages/vlt/tax-credits/paid-family-leave-credit"));
const VLTDisabledAccessCredit = lazy(() => import("@/pages/vlt/tax-credits/disabled-access-credit"));
const VLTEmployerChildcareCredit = lazy(() => import("@/pages/vlt/tax-credits/employer-childcare-credit"));
const VLTPensionStartupCredit = lazy(() => import("@/pages/vlt/tax-credits/pension-startup-credit"));
const VLTFICATipCredit = lazy(() => import("@/pages/vlt/tax-credits/fica-tip-credit"));
const VLTNewMarketsCredit = lazy(() => import("@/pages/vlt/tax-credits/new-markets-credit"));
const VLTRehabilitationCredit = lazy(() => import("@/pages/vlt/tax-credits/rehabilitation-credit"));
const VLTSmallBusinessHealthCredit = lazy(() => import("@/pages/vlt/tax-credits/small-business-health-credit"));
const VLTLIHTC = lazy(() => import("@/pages/vlt/tax-credits/lihtc"));
const VLTIndianEmploymentCredit = lazy(() => import("@/pages/vlt/tax-credits/indian-employment-credit"));
const VLTEITC = lazy(() => import("@/pages/vlt/tax-credits/eitc"));
const VLTChildTaxCredit = lazy(() => import("@/pages/vlt/tax-credits/child-tax-credit"));
const VLTAOTC = lazy(() => import("@/pages/vlt/tax-credits/aotc"));
const VLTLifetimeLearningCredit = lazy(() => import("@/pages/vlt/tax-credits/lifetime-learning-credit"));
const VLTSaversCredit = lazy(() => import("@/pages/vlt/tax-credits/savers-credit"));
const VLTAdoptionCredit = lazy(() => import("@/pages/vlt/tax-credits/adoption-credit"));
const VLTDependentCareCredit = lazy(() => import("@/pages/vlt/tax-credits/dependent-care-credit"));
const VLTForeignTaxCredit = lazy(() => import("@/pages/vlt/tax-credits/foreign-tax-credit"));
const VLTElderlyDisabledCredit = lazy(() => import("@/pages/vlt/tax-credits/elderly-disabled-credit"));
const VLTPremiumTaxCredit = lazy(() => import("@/pages/vlt/tax-credits/premium-tax-credit"));
const VLTArticles = lazy(() => import("@/pages/vlt/articles/index"));
const VLTUnfiledTaxReturns = lazy(() => import("@/pages/vlt/articles/unfiled-tax-returns"));
const VLTBackTaxes = lazy(() => import("@/pages/vlt/articles/back-taxes"));
const VLTIRSAudit = lazy(() => import("@/pages/vlt/articles/irs-audit"));
const VLTPay = lazy(() => import("@/pages/vlt/pay"));
const VLTAdmin = lazy(() => import("@/pages/vlt/admin"));
const VLTAffiliatePortal = lazy(() => import("@/pages/vlt/affiliate-portal"));
const VLTFinOpsRefer = lazy(() => import("@/pages/vlt/finops-refer"));
const VLTBusinessOwner = lazy(() => import("@/pages/vlt/business-owner"));
const VLTIntakeRefer = lazy(() => import("@/pages/vlt/intake-refer"));
const VLTIntakeClient = lazy(() => import("@/pages/vlt/intake-client"));

// CSU (Cost Savings University) pages
const CsuPortal = lazy(() => import("@/pages/csu-portal"));
const CsuSign = lazy(() => import("@/pages/csu-sign"));

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
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
        <Route path="/new-home-furniture" component={NewHomeFurniture} />
        <Route path="/private-doctor" component={PrivateDoctor} />
        <Route path="/transparency" component={Transparency} />
        <Route path="/mission-act-health" component={MissionActHealth} />
        <Route path="/merchant-services" component={MerchantServices} />
        <Route path="/my-locker" component={MyLocker} />
        <Route path="/vgift-cards" component={VGiftCards} />
        
        {/* Disability Rating Routes */}
        <Route path="/disability-rating/initial" component={DisabilityInitial} />
        <Route path="/disability-rating/increase" component={DisabilityIncrease} />
        <Route path="/disability-rating/denial" component={DisabilityDenial} />
        <Route path="/disability-rating/ssdi" component={DisabilitySSDI} />
        <Route path="/disability-rating/widow" component={DisabilityWidow} />
        <Route path="/disability-rating/refer-earn" component={DisabilityReferEarn} />
        <Route path="/disability-rating/intake" component={DisabilityIntake} />
        
        <Route path="/shipping" component={Shipping} />
        <Route path="/insurance" component={Insurance} />
        <Route path="/medical-sales" component={MedicalSales} />
        <Route path="/business-development" component={BusinessDevelopment} />
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
        <Route path="/affiliate/nda" component={AffiliateNda} />
        <Route path="/affiliate/dashboard" component={AffiliateDashboard} />
        <Route path="/stress-test" component={StressTest} />
        <Route path="/job-placement" component={JobPlacement} />
        <Route path="/vet-professionals" component={VetProfessionals} />
        <Route path="/healthcare" component={HealthcarePage} />
        <Route path="/healthcare/ptsd" component={HealthcarePage} />
        <Route path="/healthcare/exosomes" component={HealthcarePage} />
        <Route path="/healthcare/less-invasive" component={HealthcarePage} />
        <Route path="/healthcare/new-treatments" component={HealthcarePage} />
        <Route path="/healthcare/guidance" component={HealthcarePage} />
        
        {/* Cost Savings University Routes */}
        <Route path="/csu-portal" component={CsuPortal} />
        <Route path="/Payzium" component={CsuPortal} />
        <Route path="/csu-sign" component={CsuSign} />
        
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
