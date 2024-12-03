export const ImageGallery = () => (
  <div className="flex flex-col items-center p-4">
    <div className="relative w-3/4">
      <img
        src="https://static.vexere.com/production/images/1592301219051.jpeg"
        alt="Three buses parked in a row with trees in the background"
        className="w-full h-auto"
      />
      <div className="absolute bottom-4 left-4 text-white text-2xl font-bold">
        vexere
      </div>
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 text-white text-2xl font-bold cursor-pointer">
        <i className="fas fa-chevron-left"></i>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 text-white text-2xl font-bold cursor-pointer">
        <i className="fas fa-chevron-right"></i>
      </div>
    </div>
    <div className="flex mt-4 space-x-2">
      <div className="border-2 border-blue-500 p-1">
        <img
          src="https://static.vexere.com/production/images/1592301219051.jpeg"
          alt="Thumbnail of three buses parked in a row"
          className="w-20 h-20"
        />
      </div>
      <div className="p-1">
        <img
          src="https://static.vexere.com/production/images/1592301219051.jpeg"
          alt="Thumbnail of a bus with lights on at night"
          className="w-20 h-20"
        />
      </div>
      <div className="p-1">
        <img
          src="https://static.vexere.com/production/images/1592301219051.jpeg"
          alt="Thumbnail of a bus parked near a monument"
          className="w-20 h-20"
        />
      </div>
      <div className="p-1">
        <img
          src="https://static.vexere.com/production/images/1592301219051.jpeg"
          alt="Thumbnail of the interior of a bus"
          className="w-20 h-20"
        />
      </div>
      <div className="p-1">
        <img
          src="https://static.vexere.com/production/images/1592301219051.jpeg"
          alt="Thumbnail of a bus driving on a road"
          className="w-20 h-20"
        />
      </div>
    </div>
    <div className="mt-2 text-gray-600">1/6</div>
    <div className="mt-2 text-blue-500 cursor-pointer">
      Báo cáo sai / thiếu thông tin
    </div>
  </div>
);
