import { useState } from "react";
import { useLoaderData } from "react-router";
import CoverageMap from "./CoverageMap";

const Coverage = () => {
  const warehouseData = useLoaderData();
  const [district, setDistrict] = useState("");
  const [query, setQuery] = useState("");

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        We are available in 64 districts
      </h1>

      {/* Search Box */}
      <div className="flex justify-center gap-2">
        <input
          type="text"
          placeholder="Search by district..."
          className="input input-bordered w-full max-w-xs"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => setQuery(district)}>
          Search
        </button>
      </div>

      {/* Map */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">
          We deliver almost all over Bangladesh
        </h2>
        <CoverageMap warehouses={warehouseData} selectedDistrict={query} />
      </div>
    </div>
  );
};

export default Coverage;
