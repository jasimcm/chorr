export default function Home() {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Chorulla Palli - Mosques Serving Iftar</h1>
        <p className="text-white">Find mosques serving food during Ramadan (Iftar)</p>
        <div className="mt-6">
          <a href="/add-mosque" className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg">
            Add Mosque
          </a>
        </div>
      </div>
    );
  }