import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function CP504() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">IRS Notice CP504</h1>

        <p className="mt-4 max-w-3xl">
          CP504 is an Intent to Levy notice. The IRS is notifying you they
          may seize your state tax refund or other assets to pay your balance.
        </p>

        <h2 className="text-xl font-semibold mt-8">What CP504 Means</h2>
        <ul className="list-disc ml-6 mt-2 max-w-3xl">
          <li>You have an unpaid balance that hasn't been resolved</li>
          <li>Previous notices (CP14, CP501, CP503) may have been sent</li>
          <li>The IRS may offset your state tax refund</li>
          <li>Further collection action is imminent if not resolved</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">What To Do</h2>
        <ul className="list-disc ml-6 mt-2 max-w-3xl">
          <li>Pay the balance in full if possible</li>
          <li>Set up a payment plan if you can't pay in full</li>
          <li>Apply for Currently Not Collectible status if experiencing hardship</li>
          <li>Consider an Offer in Compromise if you qualify</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Response Deadline</h2>
        <p className="mt-2 max-w-3xl">
          Act immediately. CP504 indicates the IRS is escalating collection efforts.
          The next notice could be a Final Notice (LT11).
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Get Help With CP504
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
