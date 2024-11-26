import { useEffect, useState } from 'react';
import { db } from '../config/fbConfig';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const Pedidos = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            const querySnapshot = await getDocs(collection(db, 'orders'));
            const ordersList = querySnapshot.docs.map((doc, index) => ({
                id: doc.id,
                ...doc.data(),
                orderNumber: index + 1
            }));
            ordersList.sort((a, b) => a.createdAt - b.createdAt);
            setOrders(ordersList);
        };

        fetchOrders();

        const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
            const ordersList = snapshot.docs.map((doc, index) => ({
                id: doc.id,
                ...doc.data(),
                orderNumber: index + 1
            }));
            // Ordenar los pedidos por fecha de creación (asumiendo que hay un campo 'createdAt')
            ordersList.sort((a, b) => a.createdAt - b.createdAt);
            setOrders(ordersList);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        await deleteDoc(doc(db, 'orders', id));
        setOrders(orders.filter(order => order.id !== id));
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-6">Pedidos</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order) => (
                    <div key={order.id} className="rounded-lg border bg-white-400/10 flex flex-col p-5 h-full hover:scale-105 transition-all duration-300 shadow-lg">
                        <h2 className="text-xl font-bold mb-2">Pedido Nr° {order.orderNumber}</h2>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {order.items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <p className="font-bold mt-2">Total: S/ {order.totalAmount}</p>
                        <button
                            className="mt-4 bg-red-600 hover:bg-red-800 text-white font-medium rounded-lg px-4 py-2"
                            onClick={() => handleDelete(order.id)}
                        >
                            Borrar Pedido
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pedidos;