import Container from "@/components/Container";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const articles = [
  {
    slug: "what-to-do-when-you-receive-irs-notice",
    title: "What To Do When You Receive an IRS Notice",
    excerpt: "A step-by-step guide for handling IRS correspondence and avoiding costly mistakes.",
    category: "Tax Resolution"
  },
  {
    slug: "understanding-tax-credits-for-businesses",
    title: "Understanding Tax Credits for Businesses",
    excerpt: "How R&D credits, WOTC, and energy credits can reduce your tax liability.",
    category: "Tax Credits"
  },
  {
    slug: "payroll-compliance-essentials",
    title: "Payroll Compliance Essentials",
    excerpt: "Key requirements for employers to stay compliant with payroll tax obligations.",
    category: "Payroll"
  },
  {
    slug: "when-to-consider-fractional-cfo",
    title: "When to Consider a Fractional CFO",
    excerpt: "Signs your business could benefit from part-time executive financial leadership.",
    category: "Advisory"
  },
  {
    slug: "tax-planning-strategies-for-veterans",
    title: "Tax Planning Strategies for Veterans",
    excerpt: "Special considerations and benefits available to veteran taxpayers.",
    category: "Tax Planning"
  },
  {
    slug: "entity-selection-guide",
    title: "Entity Selection Guide: LLC vs S-Corp vs C-Corp",
    excerpt: "Choosing the right business structure for tax efficiency and liability protection.",
    category: "Entity Structuring"
  }
];

export default function Articles() {
  return (
    <>
      <Navbar />
      <Container>
        <h1 className="text-3xl font-bold mt-12">Tax & Business Insights</h1>
        <p className="mt-4 max-w-3xl">
          Expert articles on tax strategy, compliance, and business growth.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {articles.map((article) => (
            <div 
              key={article.slug} 
              className="border rounded-lg p-6 hover:shadow-md transition-shadow"
              data-testid={`article-card-${article.slug}`}
            >
              <span className="text-sm text-brand-red font-semibold">{article.category}</span>
              <h2 className="text-xl font-semibold mt-2 mb-3">{article.title}</h2>
              <p className="text-gray-600 text-sm mb-4">{article.excerpt}</p>
              <span className="text-brand-navy font-medium">
                  Coming Soon
                </span>
            </div>
          ))}
        </div>
      </Container>
      <Footer />
    </>
  );
}
