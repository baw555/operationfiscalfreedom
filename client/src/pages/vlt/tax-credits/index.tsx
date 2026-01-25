import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function TaxCredits() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12 text-brand-navy" data-testid="heading-tax-credits">Tax Credits</h1>
        <p className="mt-4 max-w-3xl text-gray-700">
          Tax credits directly reduce the amount of tax you owe, making them more valuable than deductions.
          Explore the credits below to see which ones you may qualify for.
        </p>

        <h2 className="text-2xl font-bold mt-10 text-brand-navy">Business Tax Credits</h2>
        
        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Employment & Labor</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/wotc">
              <span className="text-brand-navy hover:underline cursor-pointer">Work Opportunity Tax Credit (WOTC)</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/paid-family-leave-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Paid Family & Medical Leave Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/employer-childcare-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Employer-Provided Childcare Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/fica-tip-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">FICA Tip Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/indian-employment-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Indian Employment Credit</span>
            </Link>
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Research & Development</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/rd-tax-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">R&D Tax Credit (Section 41)</span>
            </Link>
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Energy & Clean Technology</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/energy-tax-credits">
              <span className="text-brand-navy hover:underline cursor-pointer">Energy Tax Credits (ITC/PTC)</span>
            </Link>
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Healthcare & Benefits</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/small-business-health-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Small Business Health Care Tax Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/pension-startup-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Small Employer Pension Start-Up Credit</span>
            </Link>
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Investment & Development</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/new-markets-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">New Markets Tax Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/lihtc">
              <span className="text-brand-navy hover:underline cursor-pointer">Low-Income Housing Tax Credit (LIHTC)</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/rehabilitation-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Rehabilitation Tax Credit (Historic Buildings)</span>
            </Link>
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Accessibility</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/disabled-access-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Disabled Access Credit</span>
            </Link>
          </li>
        </ul>

        <h2 className="text-2xl font-bold mt-12 text-brand-navy">Individual Tax Credits</h2>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Family & Dependents</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/child-tax-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Child Tax Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/dependent-care-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Child and Dependent Care Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/adoption-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Adoption Tax Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/eitc">
              <span className="text-brand-navy hover:underline cursor-pointer">Earned Income Tax Credit (EITC)</span>
            </Link>
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Education</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/aotc">
              <span className="text-brand-navy hover:underline cursor-pointer">American Opportunity Tax Credit (AOTC)</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/lifetime-learning-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Lifetime Learning Credit</span>
            </Link>
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Retirement & Savings</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/savers-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Saver's Credit (Retirement Savings)</span>
            </Link>
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Healthcare</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/premium-tax-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Premium Tax Credit (Marketplace Insurance)</span>
            </Link>
          </li>
        </ul>

        <h3 className="text-lg font-semibold mt-6 text-brand-navy">Other Individual Credits</h3>
        <ul className="mt-3 list-disc ml-6 space-y-2">
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/foreign-tax-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Foreign Tax Credit</span>
            </Link>
          </li>
          <li>
            <Link href="/veteran-led-tax/services/tax-credits/elderly-disabled-credit">
              <span className="text-brand-navy hover:underline cursor-pointer">Credit for the Elderly or Disabled</span>
            </Link>
          </li>
        </ul>

        <div className="mt-12 p-6 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-brand-navy">Not Sure Which Credits Apply to You?</h3>
          <p className="mt-2 text-gray-700">
            Our tax professionals can review your situation and identify all the credits you're eligible for.
          </p>
          <Link href="/veteran-led-tax/intake">
            <span className="inline-block mt-4 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer" data-testid="button-get-tax-credit-review">
              Get a Free Tax Credit Review
            </span>
          </Link>
        </div>
      </Container>
      <Footer />
    </>
  );
}
