import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients } from '../redux/slices/clientSlice';
import { fetchItems } from '../redux/slices/itemSlice';
import {
  fetchSalesOrderById,
  addSalesOrder,
  editSalesOrder,
  clearCurrentOrder,
} from '../redux/slices/salesOrderSlice';

function emptyLine() {
  return {
    itemId: '',
    note: '',
    quantity: 0,
    taxRate: 0,
  };
}

function SalesOrderPage() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items: clients } = useSelector((state) => state.clients);
  const { items: itemsList } = useSelector((state) => state.items);
  const { currentOrder } = useSelector((state) => state.salesOrders);

  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [clientId, setClientId] = useState('');
  const [lines, setLines] = useState([emptyLine()]);

  useEffect(() => {
    dispatch(fetchClients());
    dispatch(fetchItems());
    if (isEditMode) {
      dispatch(fetchSalesOrderById(id));
    }
    return () => {
      dispatch(clearCurrentOrder());
    };
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && currentOrder) {
      setInvoiceNo(currentOrder.invoiceNo);
      setInvoiceDate(currentOrder.invoiceDate.split('T')[0]);
      setReferenceNo(currentOrder.referenceNo || '');
      setClientId(currentOrder.clientId);
      setLines(
        currentOrder.lines.map((l) => ({
          itemId: l.itemId,
          note: l.note || '',
          quantity: l.quantity,
          taxRate: l.taxRate,
        }))
      );
    }
  }, [currentOrder, isEditMode]);

  const selectedClient = clients.find((c) => c.id === Number(clientId));

  const getItemPrice = (itemId) => {
    const item = itemsList.find((i) => i.id === Number(itemId));
    return item ? item.price : 0;
  };

  const calculateLine = (line) => {
    const price = getItemPrice(line.itemId);
    const exclAmount = Number(line.quantity) * price;
    const taxAmount = (exclAmount * Number(line.taxRate)) / 100;
    const inclAmount = exclAmount + taxAmount;
    return { exclAmount, taxAmount, inclAmount };
  };

  const totals = lines.reduce(
    (acc, line) => {
      const { exclAmount, taxAmount, inclAmount } = calculateLine(line);
      acc.excl += exclAmount;
      acc.tax += taxAmount;
      acc.incl += inclAmount;
      return acc;
    },
    { excl: 0, tax: 0, incl: 0 }
  );

  const updateLine = (index, field, value) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setLines(newLines);
  };

  const addLine = () => setLines([...lines, emptyLine()]);

  const removeLine = (index) => {
    if (lines.length === 1) return;
    setLines(lines.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!clientId || !invoiceNo) {
      alert('Please fill in Customer and Invoice No.');
      return;
    }

    const orderData = {
      invoiceNo,
      invoiceDate: invoiceDate ? new Date(invoiceDate).toISOString() : new Date().toISOString(),
      referenceNo,
      clientId: Number(clientId),
      lines: lines
        .filter((l) => l.itemId)
        .map((l) => ({
          itemId: Number(l.itemId),
          note: l.note,
          quantity: Number(l.quantity),
          taxRate: Number(l.taxRate),
        })),
    };

    if (isEditMode) {
      await dispatch(editSalesOrder({ id, orderData }));
    } else {
      await dispatch(addSalesOrder(orderData));
    }
    navigate('/');
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sales Order</h1>
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
        >
          Save Order
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Customer Name</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">-- Select Customer --</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address 1</label>
            <input
              type="text"
              readOnly
              value={selectedClient?.address1 || ''}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              type="text"
              readOnly
              value={selectedClient?.city || ''}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <input
              type="text"
              readOnly
              value={selectedClient?.state || ''}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Post Code</label>
            <input
              type="text"
              readOnly
              value={selectedClient?.postCode || ''}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice No.</label>
            <input
              type="text"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Reference No.</label>
            <input
              type="text"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className="mt-1 w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded border border-gray-300 mb-4">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-3 py-2 border-b">Item Code</th>
              <th className="text-left px-3 py-2 border-b">Description</th>
              <th className="text-left px-3 py-2 border-b">Note</th>
              <th className="text-right px-3 py-2 border-b">Quantity</th>
              <th className="text-right px-3 py-2 border-b">Price</th>
              <th className="text-right px-3 py-2 border-b">Tax %</th>
              <th className="text-right px-3 py-2 border-b">Excl Amount</th>
              <th className="text-right px-3 py-2 border-b">Tax Amount</th>
              <th className="text-right px-3 py-2 border-b">Incl Amount</th>
              <th className="px-3 py-2 border-b"></th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => {
              const { exclAmount, taxAmount, inclAmount } = calculateLine(line);
              const price = getItemPrice(line.itemId);
              return (
                <tr key={index}>
                  <td className="px-3 py-2 border-b">
                    <select
                      value={line.itemId}
                      onChange={(e) => updateLine(index, 'itemId', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    >
                      <option value="">--</option>
                      {itemsList.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.itemCode}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <select
                      value={line.itemId}
                      onChange={(e) => updateLine(index, 'itemId', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    >
                      <option value="">--</option>
                      {itemsList.map((i) => (
                        <option key={i.id} value={i.id}>
                          {i.description}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 border-b">
                    <input
                      type="text"
                      value={line.note}
                      onChange={(e) => updateLine(index, 'note', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="px-3 py-2 border-b">
                    <input
                      type="number"
                      value={line.quantity}
                      onChange={(e) => updateLine(index, 'quantity', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-20 text-right"
                    />
                  </td>
                  <td className="px-3 py-2 border-b text-right">{price.toFixed(2)}</td>
                  <td className="px-3 py-2 border-b">
                    <input
                      type="number"
                      value={line.taxRate}
                      onChange={(e) => updateLine(index, 'taxRate', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-20 text-right"
                    />
                  </td>
                  <td className="px-3 py-2 border-b text-right">{exclAmount.toFixed(2)}</td>
                  <td className="px-3 py-2 border-b text-right">{taxAmount.toFixed(2)}</td>
                  <td className="px-3 py-2 border-b text-right font-semibold">
                    {inclAmount.toFixed(2)}
                  </td>
                  <td className="px-3 py-2 border-b text-center">
                    <button
                      onClick={() => removeLine(index)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <button
        onClick={addLine}
        className="mb-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm"
      >
        + Add Line
      </button>

      <div className="flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Excl</span>
            <span className="font-medium">{totals.excl.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Tax</span>
            <span className="font-medium">{totals.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-2">
            <span>Total Incl</span>
            <span>{totals.incl.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesOrderPage;