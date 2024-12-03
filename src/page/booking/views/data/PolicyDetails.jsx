export const PolicyDetails = () => (
  <div className="max-w-3xl mx-auto">
    <h1 className="text-xl font-bold mb-4">Chính sách hủy đơn hàng</h1>
    <div className="flex items-center mb-4">
      <div className="flex-1 text-center bg-yellow-500 text-white py-2">
        Hôm nay
      </div>
      <div className="flex-1 text-center bg-gray-200 py-2">21:00</div>
      <div className="flex-1 text-center bg-red-500 text-white py-2">
        Khởi hành
      </div>
    </div>
    <div className="flex justify-between text-sm mb-4">
      <span>Không mất phí</span>
      <span>Phí hủy 100%</span>
    </div>
    <p className="text-sm mb-6">
      <strong>Ghi Chú:</strong> Phí hủy sẽ được tính trên giá gốc, không giảm
      trừ khuyến mãi hoặc giảm giá; đồng thời không vượt quá số tiền quý khách
      đã thanh toán.
    </p>
    <h2 className="text-lg font-bold mb-2">Chính sách nhà xe</h2>
    <h3 className="text-base font-bold mb-2">Yêu cầu lên xe</h3>
    <ul className="list-disc list-inside mb-4">
      <li>
        Có mặt tại văn phòng/quầy vé/bến xe trước 30 phút để làm thủ tục lên xe
      </li>
      <li>Đối vé giấy trước khi lên xe</li>
      <li>Xuất trình SMS/Email đặt vé cho nhân viên</li>
      <li>Không mang đồ ăn, thức uống có mùi lên xe</li>
      <li>Không hút thuốc lá, không sử dụng chất kích thích trên xe</li>
      <li>Không vứt rác trên xe</li>
      <li>Không làm ồn, gây mất trật tự trên xe</li>
      <li>Không mang giày, dép trên xe</li>
    </ul>
    <h3 className="text-base font-bold mb-2">Hành lý xách tay</h3>
    <ul className="list-disc list-inside mb-4">
      <li>Tổng trọng lượng hành lý không vượt quá 20 kg</li>
      <li>Không vận chuyển hàng hóa cồng kềnh</li>
      <li>
        Hành lý trên trong trường hợp hủy đơn hàng do vi phạm các quy định về
        hành lý
      </li>
    </ul>
    <h3 className="text-base font-bold mb-2">Trẻ em và phụ nữ có thai</h3>
    <ul className="list-disc list-inside mb-4">
      <li>
        Trẻ em dưới 5 tuổi hoặc dưới 100 cm được miễn phí nếu ngồi cùng
        ghế/giường với bố mẹ
      </li>
      <li>Trẻ em từ 5 tuổi hoặc từ 120 cm trở lên mua vé như người lớn</li>
      <li>Nhà xe có thể đảm bảo sức khỏe trong quá trình di chuyển</li>
      <li>
        Nhà xe từ chối vận chuyển nếu hành khách không tuân thủ các quy định về
        sức khỏe
      </li>
    </ul>
    <h3 className="text-base font-bold mb-2">Động vật cảnh/Thú cưng</h3>
    <ul className="list-disc list-inside mb-4">
      <li>
        Hành xe có quyền từ chối vận chuyển động vật là một hành lý xách tay
      </li>
      <li>Hành khách có trách nhiệm chăm sóc thú cưng</li>
      <li>
        Nhiệt độ trên xe có thể không phù hợp với điều kiện sinh hoạt của thú
        cưng
      </li>
      <li>
        Trong trường hợp thú cưng gây hại, nhà xe không chịu trách nhiệm về sự
        cố
      </li>
    </ul>
    <h3 className="text-base font-bold mb-2">Xuất hóa đơn GTGT</h3>
    <ul className="list-disc list-inside mb-4">
      <li>
        Nhà xe có cung cấp hóa đơn GTGT cho dịch vụ xe khách, phí xuất hóa đơn
        là 10% giá trị vé
      </li>
      <li>Quý khách vui lòng cung cấp đầy đủ, chính xác thông tin hóa đơn</li>
      <li>
        Nhà xe từ chối xuất lại hóa đơn nếu hành khách cung cấp sai thông tin
      </li>
    </ul>
    <div className="text-right text-sm text-blue-500">
      <a href="#">Báo cáo sai/thiếu thông tin</a>
    </div>
  </div>
);
