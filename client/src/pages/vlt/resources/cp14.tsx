import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function CP14() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">IRS Notice CP14</h1>

        <p className="mt-4 max-w-3xl">
          CP14 is the first notice the IRS sends when you have a balance due on your tax account.
          It shows the amount owed, including any penalties and interest.
        </p>

        <h2 className="text-xl font-semibold mt-8">What CP14 Means</h2>
        <ul className="list-disc ml-6 mt-2 max-w-3xl">
          <li>You filed a return but didn't pay the full amount</li>
          <li>The IRS made changes to your return that resulted in a balance</li>
          <li>Penalties and interest have been assessed</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">What To Do</h2>
        <ul className="list-disc ml-6 mt-2 max-w-3xl">
          <li>Review the notice carefully and compare to your records</li>
          <li>Pay the balance if correct, or respond if you disagree</li>
          <li>Consider payment options if you can't pay in full</li>
          <li>Don't ignore it—penalties and interest continue to accrue</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Response Deadline</h2>
        <p className="mt-2 max-w-3xl">
          Typically 21 days from the notice date. Acting quickly can prevent
          additional penalties and collection actions.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Get Help With CP14
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
