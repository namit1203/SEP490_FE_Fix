import NavBooking from "../modules/NavBooking";
import SearchBooking from "../modules/SearchBooking";

export default function SearchViews() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="border-b border-gray-200">
        <NavBooking />
      </div>
      <div className="p-4 sm:p-6 lg:p-8">
        <SearchBooking />
      </div>
    </div>
  );
}
