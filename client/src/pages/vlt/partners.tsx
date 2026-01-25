import Container from "@/components/Container";

export default function Partners() {
  return (
    <Container>
      <h1 className="text-3xl font-bold mt-12">Partner Dashboard</h1>

      <table className="mt-6 w-full border">
        <thead>
          <tr className="border-b">
            <th className="p-2">Lead</th>
            <th className="p-2">Type</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-2">John D.</td>
            <td className="p-2">Tax Credits</td>
            <td className="p-2">New</td>
          </tr>
        </tbody>
      </table>
    </Container>
  );
}
