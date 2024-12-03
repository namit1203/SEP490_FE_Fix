export const TripDetailsCard = ({ item }) => {
  const fieldsToDisplay = {
    pointStartDetails: "Điểm đón",
    pointEndDetails: "Điểm trả",
    timeStartDetils: "Thời gian bắt đầu",
    timeEndDetails: "Thời gian đến nơi",
  };
  return (
    <div className="mb-4 p-4 border rounded-lg shadow-md bg-white">
      {Object.entries(item)
        .filter(([key]) => fieldsToDisplay[key])
        .map(([key, value]) => (
          <div key={key} className="mb-2">
            <p className="text-sm font-semibold text-gray-700">
              {fieldsToDisplay[key]}:
            </p>
            <p
              className={`text-sm ${
                key.includes("time") ? "text-green-500" : "text-gray-900"
              }`}
            >
              {value}
            </p>
          </div>
        ))}
    </div>
  );
};
