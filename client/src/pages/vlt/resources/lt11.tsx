import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "wouter";

export default function LT11() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">IRS Notice LT11</h1>

        <p className="mt-4 max-w-3xl">
          LT11 is the Final Notice of Intent to Levy. This is a serious notice
          indicating the IRS intends to seize your assets if you don't respond.
        </p>

        <h2 className="text-xl font-semibold mt-8">What LT11 Means</h2>
        <ul className="list-disc ml-6 mt-2 max-w-3xl">
          <li>Previous notices have gone unanswered</li>
          <li>The IRS is preparing to levy your wages, bank accounts, or property</li>
          <li>You have a right to a Collection Due Process hearing</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">What To Do Immediately</h2>
        <ul className="list-disc ml-6 mt-2 max-w-3xl">
          <li>Do not ignore this notice</li>
          <li>Request a Collection Due Process hearing within 30 days</li>
          <li>Consider payment options or resolution programs</li>
          <li>Seek professional help immediately</li>
        </ul>

        <h2 className="text-xl font-semibold mt-8">Response Deadline</h2>
        <p className="mt-2 max-w-3xl">
          30 days from the notice date to request a hearing. After that,
          the IRS can proceed with levy action.
        </p>

        <Link href="/veteran-led-tax/intake">
          <span className="inline-block mt-8 px-6 py-3 bg-brand-red text-white font-semibold rounded hover:bg-brand-red/90 cursor-pointer">
            Get Urgent Help With LT11
          </span>
        </Link>
      </Container>
      <Footer />
    </>
  );
}
