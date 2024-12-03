import { Pagination, Spin } from "antd";
import React from "react";
import { useAppSelector } from "../../../../stores/hooks";
import { TripCard } from "./TripCard";
import { Empty } from 'antd';

export default function DataTrip() {
  const DataTripStaion = useAppSelector((state) => state.trips?.data);
  const isLoading = useAppSelector((state) => state.trips?.loading);
  const [selectedTrip, setSelectedTrip] = React.useState({});
  const [activeCardIndex, setActiveCardIndex] = React.useState(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const pageSize = 5;

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (DataTripStaion.length === 0) {
    return <Empty />;
  }

  const paginatedData = DataTripStaion.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-4">
      <>
        {paginatedData &&
          paginatedData.map((item, index) => (
            <TripCard
              key={item.id}
              index={index}
              selectedTrip={selectedTrip}
              setSelectedTrip={setSelectedTrip}
              activeCardIndex={activeCardIndex}
              setActiveCardIndex={setActiveCardIndex}
              data={item}
            />
          ))}
      </>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <Pagination
          current={currentPage}
          total={DataTripStaion.length}
          pageSize={pageSize}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
}
