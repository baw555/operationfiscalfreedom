import Container from "@/components/Container";

export default function CP504() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">CP504 Notice</h1>
      <p className="mt-4 max-w-3xl">
        A CP504 is an Intent to Levy notice. The IRS may seize your state tax
        refund or other assets to pay your balance.
      </p>

      <h2 className="text-xl font-semibold mt-8">What To Do</h2>
      <ul className="list-disc ml-6 mt-2">
        <li>Pay the balance if possible</li>
        <li>Set up a payment plan</li>
        <li>Consider Currently Not Collectible status</li>
      </ul>

      <a href="/veteran-led-tax/intake" className="btn mt-8">Begin Intake</a>
    </Container>
  );
}
