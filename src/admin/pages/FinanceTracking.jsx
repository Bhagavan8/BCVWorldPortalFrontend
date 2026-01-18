import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import adminApi from '../../api/admin';

const PAGE_SIZE = 10;

const formatCurrency = (value) => {
    const amount = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

const FinanceTracking = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [summary, setSummary] = useState({
        totalBalance: 0,
        totalIncome: 0,
        totalLoanExpenses: 0,
        totalOtherExpenses: 0,
        monthlyEmiCommitment: 0,
        totalLoanPrincipal: 0,
        totalOutstandingLoan: 0,
        totalPending: 0,
        dailyExpense: 0,
        weeklyExpense: 0,
        monthlyExpense: 0,
        lastMonthExpense: 0,
        lastMonthSaving: 0,
        savingDiff: 0
    });
    const [transactions, setTransactions] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [summaryRes, txRes] = await Promise.all([
                    adminApi.get('/finance/tracking-summary'),
                    adminApi.get('/finance/transactions')
                ]);
                const s = summaryRes.data || {};
                setSummary({
                    totalBalance: s.totalBalance || 0,
                    totalIncome: s.totalIncome || 0,
                    totalLoanExpenses: s.totalLoanExpenses || 0,
                    totalOtherExpenses: s.totalOtherExpenses || 0,
                    monthlyEmiCommitment: s.monthlyEmiCommitment || 0,
                    totalLoanPrincipal: s.totalLoanPrincipal || 0,
                    totalOutstandingLoan: s.totalOutstandingLoan || 0,
                    totalPending: s.totalPending || 0,
                    dailyExpense: s.dailyExpense || 0,
                    weeklyExpense: s.weeklyExpense || 0,
                    monthlyExpense: s.monthlyExpense || 0,
                    lastMonthExpense: s.lastMonthExpense || 0,
                    lastMonthSaving: s.lastMonthSaving || 0,
                    savingDiff: s.savingDiff || 0
                });
                setTransactions(txRes.data || []);
            } catch (error) {
                console.error('Failed to load financial tracking data', error);
                toast.error('Failed to load financial tracking data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredTransactions = useMemo(() => {
        if (filterType === 'all') return transactions;
        return transactions.filter((t) => (t.type || '').toLowerCase() === filterType);
    }, [transactions, filterType]);

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE)),
        [filteredTransactions.length]
    );

    const pageItems = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filteredTransactions.slice(start, start + PAGE_SIZE);
    }, [filteredTransactions, page]);

    useEffect(() => {
        setPage(1);
    }, [filterType]);

    const handleTransactionSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            const form = e.target;
            const type = form.type.value;
            const amount = parseFloat(form.amount.value);
            const category = form.category.value;
            const date = form.date.value;
            const description = form.description.value;

            await adminApi.post('/finance/transactions', {
                type,
                amount,
                category,
                date,
                description
            });

            const [summaryRes, txRes] = await Promise.all([
                adminApi.get('/finance/tracking-summary'),
                adminApi.get('/finance/transactions')
            ]);
            const s = summaryRes.data || {};
            setSummary({
                totalBalance: s.totalBalance || 0,
                totalIncome: s.totalIncome || 0,
                totalLoanExpenses: s.totalLoanExpenses || 0,
                totalOtherExpenses: s.totalOtherExpenses || 0,
                monthlyEmiCommitment: s.monthlyEmiCommitment || 0,
                totalLoanPrincipal: s.totalLoanPrincipal || 0,
                totalOutstandingLoan: s.totalOutstandingLoan || 0,
                totalPending: s.totalPending || 0,
                dailyExpense: s.dailyExpense || 0,
                weeklyExpense: s.weeklyExpense || 0,
                monthlyExpense: s.monthlyExpense || 0,
                lastMonthExpense: s.lastMonthExpense || 0,
                lastMonthSaving: s.lastMonthSaving || 0,
                savingDiff: s.savingDiff || 0
            });
            setTransactions(txRes.data || []);

            form.reset();
            const today = new Date();
            form.date.value = today.toISOString().split('T')[0];
            closeModalById('addTransactionModal');
            toast.success('Transaction added');
        } catch (error) {
            console.error('Failed to save transaction', error);
            toast.error('Failed to save transaction');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteTransaction = async (id) => {
        try {
            await adminApi.delete(`/finance/transactions/${id}`);
            const [summaryRes, txRes] = await Promise.all([
                adminApi.get('/finance/tracking-summary'),
                adminApi.get('/finance/transactions')
            ]);
            const s = summaryRes.data || {};
            setSummary({
                totalBalance: s.totalBalance || 0,
                totalIncome: s.totalIncome || 0,
                totalLoanExpenses: s.totalLoanExpenses || 0,
                totalOtherExpenses: s.totalOtherExpenses || 0,
                monthlyEmiCommitment: s.monthlyEmiCommitment || 0,
                totalLoanPrincipal: s.totalLoanPrincipal || 0,
                totalOutstandingLoan: s.totalOutstandingLoan || 0,
                totalPending: s.totalPending || 0,
                dailyExpense: s.dailyExpense || 0,
                weeklyExpense: s.weeklyExpense || 0,
                monthlyExpense: s.monthlyExpense || 0,
                lastMonthExpense: s.lastMonthExpense || 0,
                lastMonthSaving: s.lastMonthSaving || 0,
                savingDiff: s.savingDiff || 0
            });
            setTransactions(txRes.data || []);
            toast.success('Transaction deleted');
        } catch (error) {
            console.error('Failed to delete transaction', error);
            toast.error('Failed to delete transaction');
        }
    };

    const closeModalById = (id) => {
        if (typeof window === 'undefined') return;
        const modalEl = document.getElementById(id);
        if (!modalEl || !window.bootstrap) return;
        const instance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        instance.hide();
    };

    const renderOverviewTab = () => (
        <div className="tab-pane fade show active">
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card balance-card h-100"
                        style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start">
                                <h6 className="card-subtitle mb-2 opacity-75">Total Balance</h6>
                            </div>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalBalance)}
                            </h2>
                            <small
                                className="opacity-75 d-block mt-1"
                                style={{ fontSize: '0.75rem' }}
                            >
                                Income - Expenses
                            </small>
                            <i className="bi bi-wallet2 card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card income-card h-100"
                        style={{
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Total Income</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalIncome)}
                            </h2>
                            <i className="bi bi-arrow-down-circle card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card h-100"
                        style={{ background: 'linear-gradient(45deg, #6f42c1, #a885d8)', color: 'white' }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Loan Expenses</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalLoanExpenses)}
                            </h2>
                            <i className="bi bi-bank card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card expense-card h-100"
                        style={{
                            background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Other Expenses</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalOtherExpenses)}
                            </h2>
                            <i className="bi bi-arrow-up-circle card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card h-100"
                        style={{ background: 'linear-gradient(135deg, #7209b7 0%, #b5179e 100%)', color: 'white' }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Monthly EMI</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.monthlyEmiCommitment)}
                            </h2>
                            <i className="bi bi-calendar-check card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card h-100"
                        style={{ background: 'linear-gradient(135deg, #ff9f1c 0%, #ffbf69 100%)', color: 'white' }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Total Borrowed</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalLoanPrincipal)}
                            </h2>
                            <i className="bi bi-bank2 card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card h-100"
                        style={{ background: 'linear-gradient(135deg, #e63946 0%, #d62828 100%)', color: 'white' }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Outstanding Loan</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalOutstandingLoan)}
                            </h2>
                            <i className="bi bi-exclamation-circle card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card pending-card h-100"
                        style={{
                            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Pending</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalPending)}
                            </h2>
                            <i className="bi bi-clock-history card-icon-bg" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-1">Today's Expenses</h6>
                                <h4 className="mb-0 fw-bold text-danger">
                                    {formatCurrency(summary.dailyExpense)}
                                </h4>
                            </div>
                            <div
                                className="icon-shape bg-danger bg-opacity-10 text-danger rounded-3 p-3"
                                style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}
                            >
                                <i className="bi bi-calendar-event fs-4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-1">Weekly Expenses</h6>
                                <h4 className="mb-0 fw-bold text-danger">
                                    {formatCurrency(summary.weeklyExpense)}
                                </h4>
                            </div>
                            <div
                                className="icon-shape bg-danger bg-opacity-10 text-danger rounded-3 p-3"
                                style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}
                            >
                                <i className="bi bi-calendar-week fs-4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-1">Monthly Expenses</h6>
                                <h4 className="mb-0 fw-bold text-danger">
                                    {formatCurrency(summary.monthlyExpense)}
                                </h4>
                            </div>
                            <div
                                className="icon-shape bg-danger bg-opacity-10 text-danger rounded-3 p-3"
                                style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}
                            >
                                <i className="bi bi-calendar3 fs-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-1">Last Month Expenses</h6>
                                <h4 className="mb-0 fw-bold text-danger">
                                    {formatCurrency(summary.lastMonthExpense)}
                                </h4>
                            </div>
                            <div
                                className="icon-shape bg-danger bg-opacity-10 text-danger rounded-3 p-3"
                                style={{ backgroundColor: 'rgba(220, 53, 69, 0.1)' }}
                            >
                                <i className="bi bi-calendar3 fs-4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-1">Last Month Saving</h6>
                                <h4 className="mb-0 fw-bold text-success">
                                    {formatCurrency(summary.lastMonthSaving)}
                                </h4>
                            </div>
                            <div
                                className="icon-shape bg-success bg-opacity-10 text-success rounded-3 p-3"
                                style={{ backgroundColor: 'rgba(25, 135, 84, 0.1)' }}
                            >
                                <i className="bi bi-piggy-bank fs-4" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-body d-flex align-items-center justify-content-between">
                            <div>
                                <h6 className="text-muted mb-1">Savings Difference (This vs Last)</h6>
                                <h4 className="mb-0 fw-bold">
                                    {formatCurrency(summary.savingDiff)}
                                </h4>
                            </div>
                            <div
                                className="icon-shape bg-primary bg-opacity-10 text-primary rounded-3 p-3"
                                style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}
                            >
                                <i className="bi bi-graph-up fs-4" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-12 col-xl-8">
                    <div className="row mb-4">
                        <div className="col-12 col-lg-6 mb-4 mb-lg-0">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-bold text-primary">
                                        <i className="bi bi-bank me-2" />
                                        Active Loans
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary btn-sm"
                                        disabled
                                    >
                                        <i className="bi bi-plus-lg" />
                                        {' '}
                                        New Loan
                                    </button>
                                </div>
                                <div className="card-body p-0">
                                    <div
                                        className="list-group list-group-flush"
                                        style={{ maxHeight: '300px', overflowY: 'auto' }}
                                    >
                                        <div className="text-center py-3 text-muted small">
                                            No active loans.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-lg-6">
                            <div className="card shadow-sm h-100">
                                <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0 fw-bold text-success">
                                        <i className="bi bi-graph-up-arrow me-2" />
                                        Investments
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm"
                                        disabled
                                    >
                                        <i className="bi bi-plus-lg" />
                                        {' '}
                                        New Invest
                                    </button>
                                </div>
                                <div className="card-body p-0">
                                    <div
                                        className="list-group list-group-flush"
                                        style={{ maxHeight: '300px', overflowY: 'auto' }}
                                    >
                                        <div className="text-center py-3 text-muted small">
                                            No investments recorded.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <div>
                                <h5 className="mb-0 fw-bold">
                                    <i className="bi bi-arrow-repeat me-2" />
                                    Recurring Payments
                                </h5>
                            </div>
                            <button
                                type="button"
                                className="btn btn-outline-dark btn-sm"
                                disabled
                            >
                                <i className="bi bi-gear-fill me-1" />
                                Manage
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="list-group list-group-flush">
                                <div className="text-center py-3 text-muted small">
                                    No active recurring payments or salary set up.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 fw-bold">Recent Transactions</h5>
                            <button
                                className="btn btn-primary btn-sm"
                                data-bs-toggle="modal"
                                data-bs-target="#addTransactionModal"
                            >
                                <i className="bi bi-plus-lg me-1" />
                                Add New
                            </button>
                        </div>
                        <div className="card-body p-0">
                            <div className="p-3 border-bottom overflow-auto">
                                <div className="btn-group segment-toggle" role="group">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="filterType"
                                        id="filterAll"
                                        value="all"
                                        checked={filterType === 'all'}
                                        onChange={() => setFilterType('all')}
                                    />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="filterAll">
                                        All
                                    </label>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="filterType"
                                        id="filterIncome"
                                        value="income"
                                        checked={filterType === 'income'}
                                        onChange={() => setFilterType('income')}
                                    />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="filterIncome">
                                        Income
                                    </label>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="filterType"
                                        id="filterExpense"
                                        value="expense"
                                        checked={filterType === 'expense'}
                                        onChange={() => setFilterType('expense')}
                                    />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="filterExpense">
                                        Expense
                                    </label>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="filterType"
                                        id="filterLoan"
                                        value="loan"
                                        checked={filterType === 'loan'}
                                        onChange={() => setFilterType('loan')}
                                    />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="filterLoan">
                                        Loans
                                    </label>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="filterType"
                                        id="filterInvestment"
                                        value="investment"
                                        checked={filterType === 'investment'}
                                        onChange={() => setFilterType('investment')}
                                    />
                                    <label className="btn btn-outline-primary btn-sm" htmlFor="filterInvestment">
                                        Investment
                                    </label>
                                </div>
                            </div>
                            <div
                                className="list-group list-group-flush"
                                style={{ maxHeight: '600px', overflowY: 'auto' }}
                            >
                                {loading ? (
                                    <div className="text-center py-5 text-muted">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                ) : pageItems.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        <i className="bi bi-receipt display-4 opacity-25" />
                                        <p className="mt-2">No transactions found</p>
                                    </div>
                                ) : (
                                    pageItems.map((t) => {
                                        const type = (t.type || '').toLowerCase();
                                        const isIncome = type === 'income';
                                        const amountClass = isIncome ? 'text-success' : 'text-danger';
                                        const sign = isIncome ? '+' : '-';
                                        const date = t.date
                                            ? new Date(t.date).toLocaleDateString()
                                            : '';
                                        return (
                                            <div
                                                key={t.id}
                                                className={`list-group-item transaction-item p-3 border-bottom type-${type}`}
                                            >
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div>
                                                        <h6 className="mb-0 fw-bold text-capitalize">
                                                            {t.description || t.category || 'Transaction'}
                                                        </h6>
                                                        <small className="text-muted">
                                                            {date}{' '}
                                                            <span className="badge bg-light text-dark border ms-1">
                                                                {t.type}
                                                            </span>
                                                        </small>
                                                    </div>
                                                    <div className="text-end">
                                                        <h6 className={`mb-0 fw-bold ${amountClass}`}>
                                                            {sign}
                                                            {formatCurrency(t.amount)}
                                                        </h6>
                                                        <button
                                                            className="btn btn-link btn-sm text-muted p-0 text-decoration-none"
                                                            type="button"
                                                            onClick={() => handleDeleteTransaction(t.id)}
                                                        >
                                                            <small>Delete</small>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            {filteredTransactions.length > 0 && (
                                <div className="p-3 border-top d-flex justify-content-between align-items-center">
                                    <div className="small text-muted">
                                        Page {page} of {totalPages}
                                    </div>
                                    <div className="btn-group">
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            type="button"
                                            disabled={page === 1}
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        >
                                            Prev
                                        </button>
                                        <button
                                            className="btn btn-outline-secondary btn-sm"
                                            type="button"
                                            disabled={page === totalPages}
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-xl-4">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">Expense Breakdown</h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted mb-0">
                                Detailed expense charts will be added in a future update.
                            </p>
                        </div>
                    </div>

                    <div className="card shadow-sm">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 fw-bold">Quick Stats</h5>
                        </div>
                        <div className="card-body">
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Monthly Salary</span>
                                    <span className="fw-bold">
                                        {formatCurrency(0)}
                                    </span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div
                                        className="progress-bar bg-success"
                                        role="progressbar"
                                        style={{ width: '0%' }}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Investment Portfolio</span>
                                    <span className="fw-bold">
                                        {formatCurrency(0)}
                                    </span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div
                                        className="progress-bar bg-info"
                                        role="progressbar"
                                        style={{ width: '0%' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="d-flex justify-content-between mb-1">
                                    <span className="text-muted">Loan Repayment</span>
                                    <span className="fw-bold">
                                        {formatCurrency(summary.totalOutstandingLoan)}
                                    </span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div
                                        className="progress-bar bg-warning"
                                        role="progressbar"
                                        style={{ width: '25%' }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="content-wrapper">
            <div className="top-toggle-bar mb-3">
                <div className="toggle-track">
                    <div className="toggle-knob" />
                    <button
                        type="button"
                        className={`toggle-option ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        type="button"
                        className={`toggle-option ${activeTab === 'credit' ? 'active' : ''}`}
                        onClick={() => setActiveTab('credit')}
                    >
                        Credit Cards
                    </button>
                </div>
            </div>

            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'credit' && (
                <div className="text-muted">
                    <p className="mt-3">
                        Credit card analytics and management will be available in a future update.
                    </p>
                </div>
            )}

            <div
                className="modal fade"
                id="addTransactionModal"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Transaction</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleTransactionSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Type</label>
                                    <select name="type" className="form-select" defaultValue="expense" required>
                                        <option value="income">Income</option>
                                        <option value="expense">Expense</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Category</label>
                                    <input
                                        name="category"
                                        type="text"
                                        className="form-control"
                                        placeholder="salary, food, rent, etc."
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Amount (₹)</label>
                                    <input
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Date</label>
                                    <input
                                        name="date"
                                        type="date"
                                        className="form-control"
                                        required
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Description</label>
                                    <input
                                        name="description"
                                        type="text"
                                        className="form-control"
                                        placeholder="Optional"
                                    />
                                </div>
                                <div className="d-flex justify-content-end">
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving ? (
                                            <span className="spinner-border spinner-border-sm" />
                                        ) : (
                                            'Save'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinanceTracking;
