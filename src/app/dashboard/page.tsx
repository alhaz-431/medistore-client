export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">অ্যাক্টিভিটি সামারি</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">মোট অর্ডার</p>
          <h3 className="text-3xl font-bold text-blue-700">০</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">অ্যাক্টিভ ওষুধ</p>
          <h3 className="text-3xl font-bold text-green-600">৪</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">মোট আয়</p>
          <h3 className="text-3xl font-bold text-orange-600">৳ ০</h3>
        </div>
      </div>
    </div>
  );
}