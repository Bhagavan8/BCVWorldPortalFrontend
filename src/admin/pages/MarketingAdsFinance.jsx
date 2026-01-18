import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import adminApi from '../../api/admin';

const PAGE_SIZE = 5;

const formatCurrency = (value) => {
    const amount = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

const MarketingAdsFinance = () => {
    const [activeView, setActiveView] = useState('adspend');
    const [adTransactions, setAdTransactions] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [websiteTransactions, setWebsiteTransactions] = useState([]);
    const [adSummary, setAdSummary] = useState({
        totalSpend: 0,
        thisMonthSpend: 0,
        lastMonthSpend: 0,
        thisWeekSpend: 0,
        todaySpend: 0
    });
    const [webSummary, setWebSummary] = useState({
        totalRevenue: 0,
        totalExpense: 0,
        netProfit: 0
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [adPage, setAdPage] = useState(1);
    const [webPage, setWebPage] = useState(1);

    const adTotalPages = useMemo(
        () => Math.max(1, Math.ceil(adTransactions.length / PAGE_SIZE)),
        [adTransactions.length]
    );

    const webTotalPages = useMemo(
        () => Math.max(1, Math.ceil(websiteTransactions.length / PAGE_SIZE)),
        [websiteTransactions.length]
    );

    const adPageItems = useMemo(() => {
        const start = (adPage - 1) * PAGE_SIZE;
        return adTransactions.slice(start, start + PAGE_SIZE);
    }, [adTransactions, adPage]);

    const webPageItems = useMemo(() => {
        const start = (webPage - 1) * PAGE_SIZE;
        return websiteTransactions.slice(start, start + PAGE_SIZE);
    }, [websiteTransactions, webPage]);

    const monthDiff = useMemo(
        () => adSummary.thisMonthSpend - adSummary.lastMonthSpend,
        [adSummary.thisMonthSpend, adSummary.lastMonthSpend]
    );

    const trackClassName = useMemo(() => {
        let cls = 'toggle-track';
        if (activeView === 'recurring') {
            cls += ' right-active';
        } else if (activeView === 'website') {
            cls += ' far-right-active';
        }
        return cls;
    }, [activeView]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [adRes, subRes, webRes, adSumRes, webSumRes] = await Promise.all([
                    adminApi.get('/finance/ad-transactions'),
                    adminApi.get('/finance/subscriptions'),
                    adminApi.get('/finance/website-transactions'),
                    adminApi.get('/finance/ad-summary'),
                    adminApi.get('/finance/website-summary')
                ]);

                setAdTransactions(adRes.data || []);
                setSubscriptions(subRes.data || []);
                setWebsiteTransactions(webRes.data || []);
                if (adSumRes.data) {
                    setAdSummary({
                        totalSpend: adSumRes.data.totalSpend || 0,
                        thisMonthSpend: adSumRes.data.thisMonthSpend || 0,
                        lastMonthSpend: adSumRes.data.lastMonthSpend || 0,
                        thisWeekSpend: adSumRes.data.thisWeekSpend || 0,
                        todaySpend: adSumRes.data.todaySpend || 0
                    });
                }
                if (webSumRes.data) {
                    setWebSummary({
                        totalRevenue: webSumRes.data.totalRevenue || 0,
                        totalExpense: webSumRes.data.totalExpense || 0,
                        netProfit: webSumRes.data.netProfit || 0
                    });
                }
            } catch (error) {
                console.error('Failed to load marketing finance data', error);
                toast.error('Failed to load marketing finance data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAdTransactionSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            const form = e.target;
            const amount = parseFloat(form.amount.value);
            const date = form.date.value;
            const description = form.description.value;

            await adminApi.post('/finance/ad-transactions', {
                amount,
                date,
                description
            });

            const [adRes, adSumRes] = await Promise.all([
                adminApi.get('/finance/ad-transactions'),
                adminApi.get('/finance/ad-summary')
            ]);
            setAdTransactions(adRes.data || []);
            if (adSumRes.data) {
                setAdSummary({
                    totalSpend: adSumRes.data.totalSpend || 0,
                    thisMonthSpend: adSumRes.data.thisMonthSpend || 0,
                    lastMonthSpend: adSumRes.data.lastMonthSpend || 0,
                    thisWeekSpend: adSumRes.data.thisWeekSpend || 0,
                    todaySpend: adSumRes.data.todaySpend || 0
                });
            }

            form.reset();
            closeModalById('addAdTransactionModal');
            toast.success('Ad spend saved');
        } catch (error) {
            console.error('Failed to save ad spend', error);
            toast.error('Failed to save ad spend');
        } finally {
            setSaving(false);
        }
    };

    const handleSubscriptionSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            const form = e.target;
            const name = form.name.value;
            const amount = parseFloat(form.amount.value);
            const frequency = form.frequency.value;
            const nextDueDate = form.nextDueDate.value || null;

            await adminApi.post('/finance/subscriptions', {
                name,
                amount,
                frequency,
                nextDueDate
            });

            const subRes = await adminApi.get('/finance/subscriptions');
            setSubscriptions(subRes.data || []);

            form.reset();
            closeModalById('addSubscriptionModal');
            toast.success('Subscription saved');
        } catch (error) {
            console.error('Failed to save subscription', error);
            toast.error('Failed to save subscription');
        } finally {
            setSaving(false);
        }
    };

    const handleWebsiteTransactionSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);
        try {
            const form = e.target;
            const type = form.type.value;
            const amount = parseFloat(form.amount.value);
            const date = form.date.value;
            const description = form.description.value;

            await adminApi.post('/finance/website-transactions', {
                type,
                amount,
                date,
                description
            });

            const [webRes, webSumRes] = await Promise.all([
                adminApi.get('/finance/website-transactions'),
                adminApi.get('/finance/website-summary')
            ]);
            setWebsiteTransactions(webRes.data || []);
            if (webSumRes.data) {
                setWebSummary({
                    totalRevenue: webSumRes.data.totalRevenue || 0,
                    totalExpense: webSumRes.data.totalExpense || 0,
                    netProfit: webSumRes.data.netProfit || 0
                });
            }

            form.reset();
            closeModalById('addWebsiteTransactionModal');
            toast.success('Website transaction saved');
        } catch (error) {
            console.error('Failed to save website transaction', error);
            toast.error('Failed to save website transaction');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAdTransaction = async (id) => {
        try {
            await adminApi.delete(`/finance/ad-transactions/${id}`);
            const [adRes, adSumRes] = await Promise.all([
                adminApi.get('/finance/ad-transactions'),
                adminApi.get('/finance/ad-summary')
            ]);
            setAdTransactions(adRes.data || []);
            if (adSumRes.data) {
                setAdSummary({
                    totalSpend: adSumRes.data.totalSpend || 0,
                    thisMonthSpend: adSumRes.data.thisMonthSpend || 0,
                    lastMonthSpend: adSumRes.data.lastMonthSpend || 0,
                    thisWeekSpend: adSumRes.data.thisWeekSpend || 0,
                    todaySpend: adSumRes.data.todaySpend || 0
                });
            }
            toast.success('Transaction deleted');
        } catch (error) {
            console.error('Failed to delete transaction', error);
            toast.error('Failed to delete transaction');
        }
    };

    const handleDeleteSubscription = async (id) => {
        try {
            await adminApi.delete(`/finance/subscriptions/${id}`);
            const subRes = await adminApi.get('/finance/subscriptions');
            setSubscriptions(subRes.data || []);
            toast.success('Subscription deleted');
        } catch (error) {
            console.error('Failed to delete subscription', error);
            toast.error('Failed to delete subscription');
        }
    };

    const handleDeleteWebsiteTransaction = async (id) => {
        try {
            await adminApi.delete(`/finance/website-transactions/${id}`);
            const [webRes, webSumRes] = await Promise.all([
                adminApi.get('/finance/website-transactions'),
                adminApi.get('/finance/website-summary')
            ]);
            setWebsiteTransactions(webRes.data || []);
            if (webSumRes.data) {
                setWebSummary({
                    totalRevenue: webSumRes.data.totalRevenue || 0,
                    totalExpense: webSumRes.data.totalExpense || 0,
                    netProfit: webSumRes.data.netProfit || 0
                });
            }
            toast.success('Website transaction deleted');
        } catch (error) {
            console.error('Failed to delete website transaction', error);
            toast.error('Failed to delete website transaction');
        }
    };

    const closeModalById = (id) => {
        if (typeof window === 'undefined') return;
        const modalEl = document.getElementById(id);
        if (!modalEl || !window.bootstrap) return;
        const instance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        instance.hide();
    };

    const renderAdSpendView = () => (
        <div id="adSpendView">
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card total-card h-100"
                        style={{
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Total Spend</h6>
                            <h2 className="card-title mb-0 fw-bold">{formatCurrency(adSummary.totalSpend)}</h2>
                            <small className="opacity-75 d-block mt-1">All Time</small>
                            <i className="bi bi-cash-stack card-icon-bg"></i>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card spend-card h-100"
                        style={{
                            background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">This Month Spend</h6>
                            <h2 className="card-title mb-0 fw-bold">{formatCurrency(adSummary.thisMonthSpend)}</h2>
                            <small className="opacity-75 d-block mt-1">Compared to last month</small>
                            <i className="bi bi-graph-up-arrow card-icon-bg"></i>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card diff-card h-100"
                        style={{
                            background: 'linear-gradient(135deg, #2ec4b6 0%, #20a4f3 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Month Difference</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {monthDiff >= 0 ? '+' : ''}
                                {formatCurrency(monthDiff)}
                            </h2>
                            <small className="opacity-75 d-block mt-1">This month vs last month</small>
                            <i className="bi bi-arrow-left-right card-icon-bg"></i>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card week-card h-100"
                        style={{
                            background: 'linear-gradient(135deg, #ef476f 0%, #ff1053 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">This Week Spend</h6>
                            <h2 className="card-title mb-0 fw-bold">{formatCurrency(adSummary.thisWeekSpend)}</h2>
                            <small className="opacity-75 d-block mt-1">Including today</small>
                            <i className="bi bi-calendar-week card-icon-bg"></i>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-6">
                    <div
                        className="card finance-card today-card h-100"
                        style={{
                            background: 'linear-gradient(135deg, #ffd166 0%, #f97316 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Today Spend</h6>
                            <h2 className="card-title mb-0 fw-bold">{formatCurrency(adSummary.todaySpend)}</h2>
                            <i className="bi bi-calendar-event card-icon-bg"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-header bg-white border-bottom-0 py-3 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0 fw-bold">Recent Transactions</h5>
                    <button
                        className="btn btn-primary rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target="#addAdTransactionModal"
                    >
                        <i className="bi bi-plus-lg me-1" /> Add Transaction
                    </button>
                </div>
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : adTransactions.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            No transactions found
                        </div>
                    ) : (
                        <div className="list-group list-group-flush">
                            {adPageItems.map((t) => {
                                const date = t.date ? new Date(t.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                }) : '';
                                return (
                                    <div
                                        key={t.id}
                                        className="list-group-item list-group-item-action py-3 transaction-item"
                                    >
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1 fw-bold">{t.description || 'Ad Spend'}</h6>
                                                <small className="text-muted">
                                                    <i className="bi bi-calendar3 me-1" />
                                                    {date}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <h5 className="mb-0 fw-bold text-primary">
                                                    {formatCurrency(t.amount)}
                                                </h5>
                                                <button
                                                    className="btn btn-sm btn-link text-danger p-0 mt-1"
                                                    type="button"
                                                    onClick={() => handleDeleteAdTransaction(t.id)}
                                                >
                                                    <i className="bi bi-trash" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {adTransactions.length > 0 && (
                    <div className="card-footer bg-white border-top-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">
                                Page {adPage} of {adTotalPages}
                            </span>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-secondary me-2"
                                    type="button"
                                    disabled={adPage === 1}
                                    onClick={() => setAdPage((p) => Math.max(1, p - 1))}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    type="button"
                                    disabled={adPage === adTotalPages}
                                    onClick={() => setAdPage((p) => Math.min(adTotalPages, p + 1))}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderSubscriptionsView = () => {
        let monthlyTotal = 0;
        let yearlyTotal = 0;
        subscriptions.forEach((sub) => {
            const amount = sub.amount || 0;
            const freq = (sub.frequency || 'Monthly').toLowerCase();
            if (freq === 'monthly') {
                monthlyTotal += amount;
                yearlyTotal += amount * 12;
            } else if (freq === 'yearly') {
                yearlyTotal += amount;
                monthlyTotal += amount / 12;
            }
        });

        return (
            <div id="recurringView">
                <div className="row g-4 mb-4">
                    <div className="col-12 col-md-6">
                        <div className="card finance-card h-100 bg-primary text-white">
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 opacity-75">Monthly Recurring</h6>
                                <h2 className="card-title mb-0 fw-bold">
                                    {formatCurrency(monthlyTotal)}
                                </h2>
                                <small className="opacity-75">Estimated monthly cost</small>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="card finance-card h-100 bg-info text-white">
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 opacity-75">Yearly Recurring</h6>
                                <h2 className="card-title mb-0 fw-bold">
                                    {formatCurrency(yearlyTotal)}
                                </h2>
                                <small className="opacity-75">Estimated yearly cost</small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">Active Subscriptions</h5>
                    <button
                        className="btn btn-primary rounded-pill"
                        data-bs-toggle="modal"
                        data-bs-target="#addSubscriptionModal"
                    >
                        <i className="bi bi-plus-lg me-1" /> Add Subscription
                    </button>
                </div>

                <div className="row g-3">
                    {loading ? (
                        <div className="col-12 text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : subscriptions.length === 0 ? (
                        <div className="col-12 text-center py-5 text-muted">
                            No active subscriptions
                        </div>
                    ) : (
                        subscriptions.map((sub) => (
                            <div key={sub.id} className="col-12 col-md-6 col-lg-4">
                                <div className="card subscription-card h-100 p-3">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 className="fw-bold mb-1">{sub.name}</h5>
                                            <span className="badge bg-light text-dark border">
                                                {sub.frequency}
                                            </span>
                                        </div>
                                        <div className="dropdown">
                                            <button
                                                className="btn btn-link text-muted p-0"
                                                data-bs-toggle="dropdown"
                                            >
                                                <i className="bi bi-three-dots-vertical" />
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                    <button
                                                        className="dropdown-item text-danger"
                                                        type="button"
                                                        onClick={() => handleDeleteSubscription(sub.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <h3 className="fw-bold text-primary mb-0">
                                            {formatCurrency(sub.amount)}
                                        </h3>
                                        <small className="text-muted">
                                            Next due:{' '}
                                            {sub.nextDueDate
                                                ? new Date(sub.nextDueDate).toLocaleDateString()
                                                : 'N/A'}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    const renderWebsiteFinanceView = () => (
        <div id="websiteFinanceView">
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-4">
                    <div className="card finance-card h-100" style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Total Revenue</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(webSummary.totalRevenue)}
                            </h2>
                            <small className="opacity-75">From Website</small>
                            <i className="bi bi-graph-up-arrow card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card finance-card h-100" style={{ background: 'linear-gradient(135deg, #ef476f 0%, #ff1053 100%)', color: 'white' }}>
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Total Expense</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(webSummary.totalExpense)}
                            </h2>
                            <small className="opacity-75">Website costs</small>
                            <i className="bi bi-cash-stack card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div className="card finance-card h-100" style={{ background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)', color: 'white' }}>
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Net Profit</h6>
                            <h2 className="card-title mb-0 fw-bold">
                                {formatCurrency(webSummary.netProfit)}
                            </h2>
                            <small className="opacity-75">
                                Revenue minus expense
                            </small>
                            <i className="bi bi-piggy-bank card-icon-bg" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Website Transactions</h5>
                <button
                    className="btn btn-primary rounded-pill"
                    data-bs-toggle="modal"
                    data-bs-target="#addWebsiteTransactionModal"
                >
                    <i className="bi bi-plus-lg me-1" /> Add Transaction
                </button>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0">
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : websiteTransactions.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            No transactions found
                        </div>
                    ) : (
                        <div className="list-group list-group-flush">
                            {webPageItems.map((t) => {
                                const date = t.date ? new Date(t.date).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                }) : '';
                                const isRevenue = (t.type || '').toLowerCase() === 'revenue';
                                return (
                                    <div
                                        key={t.id}
                                        className="list-group-item list-group-item-action py-3 transaction-item"
                                        style={{
                                            borderLeftColor: isRevenue ? '#11998e' : '#ef476f'
                                        }}
                                    >
                                        <div className="d-flex w-100 justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-1 fw-bold">
                                                    {t.description || 'Website Transaction'}
                                                </h6>
                                                <small className="text-muted">
                                                    <span className={`badge me-2 ${isRevenue ? 'bg-success' : 'bg-danger'}`}>
                                                        {isRevenue ? 'Revenue' : 'Expense'}
                                                    </span>
                                                    <i className="bi bi-calendar3 me-1" />
                                                    {date}
                                                </small>
                                            </div>
                                            <div className="text-end">
                                                <h5
                                                    className={`mb-0 fw-bold ${
                                                        isRevenue ? 'text-success' : 'text-danger'
                                                    }`}
                                                >
                                                    {isRevenue ? '+' : '-'}
                                                    {formatCurrency(t.amount)}
                                                </h5>
                                                <button
                                                    className="btn btn-sm btn-link text-danger p-0 mt-1"
                                                    type="button"
                                                    onClick={() => handleDeleteWebsiteTransaction(t.id)}
                                                >
                                                    <i className="bi bi-trash" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
                {websiteTransactions.length > 0 && (
                    <div className="card-footer bg-white border-top-0 py-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="text-muted small">
                                Page {webPage} of {webTotalPages}
                            </span>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-secondary me-2"
                                    type="button"
                                    disabled={webPage === 1}
                                    onClick={() => setWebPage((p) => Math.max(1, p - 1))}
                                >
                                    Previous
                                </button>
                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    type="button"
                                    disabled={webPage === webTotalPages}
                                    onClick={() => setWebPage((p) => Math.min(webTotalPages, p + 1))}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="content-wrapper">
            <div className="top-toggle-bar mb-3">
                <div className={trackClassName}>
                    <div className="toggle-knob" />
                    <button
                        type="button"
                        className={`toggle-option ${activeView === 'adspend' ? 'active' : ''}`}
                        onClick={() => setActiveView('adspend')}
                    >
                        Ad Spend
                    </button>
                    <button
                        type="button"
                        className={`toggle-option ${activeView === 'recurring' ? 'active' : ''}`}
                        onClick={() => setActiveView('recurring')}
                    >
                        Subscriptions
                    </button>
                    <button
                        type="button"
                        className={`toggle-option ${activeView === 'website' ? 'active' : ''}`}
                        onClick={() => setActiveView('website')}
                    >
                        Website Finance
                    </button>
                </div>
            </div>

            {activeView === 'adspend' && renderAdSpendView()}
            {activeView === 'recurring' && renderSubscriptionsView()}
            {activeView === 'website' && renderWebsiteFinanceView()}

            <div
                className="modal fade"
                id="addAdTransactionModal"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Ad Spend</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleAdTransactionSubmit}>
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

            <div
                className="modal fade"
                id="addSubscriptionModal"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Subscription</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubscriptionSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        className="form-control"
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
                                    <label className="form-label">Frequency</label>
                                    <select
                                        name="frequency"
                                        className="form-select"
                                        defaultValue="Monthly"
                                        required
                                    >
                                        <option value="Monthly">Monthly</option>
                                        <option value="Yearly">Yearly</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Next Due Date</label>
                                    <input
                                        name="nextDueDate"
                                        type="date"
                                        className="form-control"
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

            <div
                className="modal fade"
                id="addWebsiteTransactionModal"
                tabIndex="-1"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add Website Transaction</h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            />
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleWebsiteTransactionSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Type</label>
                                    <select
                                        name="type"
                                        className="form-select"
                                        defaultValue="revenue"
                                        required
                                    >
                                        <option value="revenue">Revenue</option>
                                        <option value="expense">Expense</option>
                                    </select>
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

export default MarketingAdsFinance;
