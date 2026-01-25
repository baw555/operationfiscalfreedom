import Container from "@/components/Container";

export default function Admin() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">Admin Panel</h1>

      <ul className="mt-6 list-disc ml-6">
        <li><a href="/veteran-led-tax/partners">Partner Dashboard</a></li>
        <li><a href="/veteran-led-tax/pay">Collect Payment</a></li>
        <li><a href="/veteran-led-tax/articles">SEO Articles</a></li>
      </ul>
    </Container>
  );
}
