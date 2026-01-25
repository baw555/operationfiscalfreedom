import Container from "@/components/Container";

export default function Articles() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">Tax & Finance Articles</h1>

      <ul className="list-disc ml-6 mt-6">
        <li><a href="/veteran-led-tax/articles/unfiled-tax-returns">What Happens If You Don't File</a></li>
        <li><a href="/veteran-led-tax/articles/back-taxes">Understanding Back Taxes</a></li>
        <li><a href="/veteran-led-tax/articles/irs-audit">IRS Audits Explained</a></li>
      </ul>
    </Container>
  );
}
