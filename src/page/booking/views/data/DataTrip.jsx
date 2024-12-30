import { Empty, Pagination, Spin } from "antd";
import React from "react";
import { useAppSelector } from "../../../../stores/hooks";
import { TripCard } from "./TripCard";

export default function DataTrip({ data }) {
  const isLoading = useAppSelector((state) => state.trips?.loading);
  const [selectedTrip, setSelectedTrip] = React.useState({});
  const [activeCardIndex, setActiveCardIndex] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setActiveCardIndex(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <Empty />;
  }

  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      {paginatedData.map((item, ) => (
        <TripCard
          key={item.id}
          index={item.id}
          selectedTrip={selectedTrip}
          setSelectedTrip={setSelectedTrip}
          activeCardIndex={activeCardIndex}
          setActiveCardIndex={setActiveCardIndex}
          data={item}
        />
      ))}

      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={data.length}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
