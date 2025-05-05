import FiltersClient from "./FiltersClient";

export default function Sidebar() {
  return (
    <div className="w-1/4">
      <div className="bg-gray-100 rounded p-4">
        <h2 className="font-semibold mb-4">Filters</h2>
        {/* Countries Filter */}
        <FiltersClient />
      </div>
    </div>
  );
}