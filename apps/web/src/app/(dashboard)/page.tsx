export default function DashboardPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Lịch hẹn hôm nay</h3>
          <p className="text-3xl font-bold text-cyan-600 mt-2">24</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Khách hàng mới</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Doanh thu ngày</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">15.2M</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Ticket chờ</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">5</p>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Chào mừng đến với Việt Care CMS</h2>
        <p className="text-gray-600">
          Hệ thống quản lý phòng khám/bệnh viện đa khoa. Chọn chức năng từ menu bên trái để bắt đầu.
        </p>
      </div>
    </div>
  );
}
