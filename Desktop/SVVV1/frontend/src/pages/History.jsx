import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, ArrowUpRight, ArrowDownLeft, Filter, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function History() {
    const { transactions } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'all' || t.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleExportPDF = () => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(20);
        doc.setTextColor(16, 185, 129); // Emerald color
        doc.text('SecureFin Transaction Report', 14, 22);

        // Add date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

        // Calculate summary
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const balance = totalIncome - totalExpenses;

        // Add summary box
        doc.setFillColor(240, 240, 240);
        doc.rect(14, 35, 182, 25, 'F');
        doc.setFontSize(11);
        doc.setTextColor(0);
        doc.text(`Total Income: ₹${totalIncome.toFixed(2)}`, 20, 43);
        doc.text(`Total Expenses: ₹${totalExpenses.toFixed(2)}`, 20, 50);
        doc.setFont(undefined, 'bold');
        doc.text(`Current Balance: ₹${balance.toFixed(2)}`, 20, 57);
        doc.setFont(undefined, 'normal');

        // Prepare table data
        const tableData = filteredTransactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            new Date(t.date).toLocaleTimeString(),
            t.description || '-',
            t.category,
            t.type.charAt(0).toUpperCase() + t.type.slice(1),
            `₹${t.amount.toFixed(2)}`
        ]);

        // Add table
        doc.autoTable({
            startY: 65,
            head: [['Date', 'Time', 'Description', 'Category', 'Type', 'Amount']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [16, 185, 129],
                textColor: [255, 255, 255],
                fontStyle: 'bold'
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            columnStyles: {
                0: { cellWidth: 25 },
                1: { cellWidth: 22 },
                2: { cellWidth: 45 },
                3: { cellWidth: 25 },
                4: { cellWidth: 20 },
                5: { cellWidth: 25, halign: 'right' }
            },
            didParseCell: function (data) {
                // Color code the type column
                if (data.column.index === 4 && data.cell.section === 'body') {
                    const type = data.cell.raw;
                    if (type === 'Income') {
                        data.cell.styles.textColor = [16, 185, 129]; // Green
                    } else if (type === 'Expense') {
                        data.cell.styles.textColor = [239, 68, 68]; // Red
                    }
                }
                // Color code the amount column
                if (data.column.index === 5 && data.cell.section === 'body') {
                    const rowIndex = data.row.index;
                    const type = filteredTransactions[rowIndex].type;
                    if (type === 'income') {
                        data.cell.styles.textColor = [16, 185, 129]; // Green
                    } else {
                        data.cell.styles.textColor = [239, 68, 68]; // Red
                    }
                }
            }
        });

        // Add footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text(
                `Page ${i} of ${pageCount}`,
                doc.internal.pageSize.getWidth() / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Save the PDF
        doc.save(`SecureFin_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="bg-secondary/50 backdrop-blur-lg p-6 rounded-2xl border border-slate-700">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h3 className="text-xl font-bold text-white">Transaction History</h3>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search transactions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-accent w-full md:w-64"
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent"
                            >
                                <option value="all">All Types</option>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>

                            <button
                                onClick={handleExportPDF}
                                className="bg-accent hover:bg-emerald-600 border border-accent text-white px-4 py-2 rounded-lg transition-colors flex items-center font-medium"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-700">
                                <th className="py-4 px-4 font-medium">Date</th>
                                <th className="py-4 px-4 font-medium">Description</th>
                                <th className="py-4 px-4 font-medium">Category</th>
                                <th className="py-4 px-4 font-medium">Type</th>
                                <th className="py-4 px-4 font-medium text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {filteredTransactions.length > 0 ? (
                                filteredTransactions.map((t) => (
                                    <tr key={t.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                                        <td className="py-4 px-4 text-slate-300">
                                            {new Date(t.date).toLocaleDateString()}
                                            <span className="block text-xs text-slate-500">{new Date(t.date).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="py-4 px-4 font-medium text-white">{t.description}</td>
                                        <td className="py-4 px-4">
                                            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">
                                                {t.category}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className={`flex items-center ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {t.type === 'income' ? <ArrowDownLeft className="w-4 h-4 mr-1" /> : <ArrowUpRight className="w-4 h-4 mr-1" />}
                                                <span className="capitalize">{t.type}</span>
                                            </div>
                                        </td>
                                        <td className={`py-4 px-4 text-right font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {t.type === 'income' ? '+' : '-'}₹{t.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="py-10 text-center text-slate-500">
                                        No transactions found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
