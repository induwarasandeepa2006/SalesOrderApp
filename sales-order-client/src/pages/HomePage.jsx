import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSalesOrders } from '../redux/slices/salesOrderSlice';
import { fetchClients } from '../redux/slices/clientSlice';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: orders, status } = useSelector((state) => state.salesOrders);
  const { items: clients } = useSelector((state) => state.clients);

  useEffect(() => {
    dispatch(fetchSalesOrders());
    dispatch(fetchClients());
  }, [dispatch]);

  const getClientName = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client ? client.name : 'Unknown';
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Orders</h1>
        <button
          onClick={() => navigate('/sales-order')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          + Add New
        </button>
      </div>

      {status === 'loading' && <p className="text-gray-500">Loading...</p>}

      {status === 'succeeded' && orders.length === 0 && (
        <p className="text-gray-500">No sales orders yet. Click "Add New" to create one.</p>
      )}

      {orders.length > 0 && (
        <div className="overflow-x-auto rounded border border-gray-300">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 border-b">Invoice No</th>
                <th className="text-left px-4 py-2 border-b">Date</th>
                <th className="text-left px-4 py-2 border-b">Customer</th>
                <th className="text-left px-4 py-2 border-b">Reference</th>
                <th className="text-right px-4 py-2 border-b">Total Excl</th>
                <th className="text-right px-4 py-2 border-b">Total Tax</th>
                <th className="text-right px-4 py-2 border-b">Total Incl</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onDoubleClick={() => navigate(`/sales-order/${order.id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-2 border-b">{order.invoiceNo}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(order.invoiceDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 border-b">{getClientName(order.clientId)}</td>
                  <td className="px-4 py-2 border-b">{order.referenceNo}</td>
                  <td className="px-4 py-2 border-b text-right">{order.totalExcl.toFixed(2)}</td>
                  <td className="px-4 py-2 border-b text-right">{order.totalTax.toFixed(2)}</td>
                  <td className="px-4 py-2 border-b text-right font-semibold">
                    {order.totalIncl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default HomePage;