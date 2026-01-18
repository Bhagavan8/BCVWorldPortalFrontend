import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import adminApi from '../../api/admin';

const formatCurrency = (value) => {
    const amount = Number.isFinite(value) ? value : 0;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);
};

const TotalFinanceOverview = () => {
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        netTotalBalance: 0,
        totalAllSpending: 0,
        totalAllIncome: 0,
        spendToday: 0,
        spendWeek: 0,
        spendMonth: 0,
        spendLastMonth: 0,
        spendYear: 0,
        spendLastYear: 0,
        totalAdSpend: 0,
        totalInvestments: 0,
        totalLoans: 0,
        totalRecurring: 0,
        totalWebsiteRevenue: 0,
        totalWebsiteExpenses: 0
    });

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            try {
                const res = await adminApi.get('/finance/total-summary');
                const data = res.data || {};
                setSummary({
                    netTotalBalance: data.netTotalBalance || 0,
                    totalAllSpending: data.totalAllSpending || 0,
                    totalAllIncome: data.totalAllIncome || 0,
                    spendToday: data.spendToday || 0,
                    spendWeek: data.spendWeek || 0,
                    spendMonth: data.spendMonth || 0,
                    spendLastMonth: data.spendLastMonth || 0,
                    spendYear: data.spendYear || 0,
                    spendLastYear: data.spendLastYear || 0,
                    totalAdSpend: data.totalAdSpend || 0,
                    totalInvestments: data.totalInvestments || 0,
                    totalLoans: data.totalLoans || 0,
                    totalRecurring: data.totalRecurring || 0,
                    totalWebsiteRevenue: data.totalWebsiteRevenue || 0,
                    totalWebsiteExpenses: data.totalWebsiteExpenses || 0
                });
            } catch (error) {
                console.error('Failed to load total finance summary', error);
                toast.error('Failed to load total finance summary');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, []);

    return (
        <div className="content-wrapper">
            {loading && (
                <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}

            <div className="row g-4 mb-5">
                <div className="col-12 col-md-4">
                    <div
                        className="card finance-card bg-gradient-success h-100"
                        style={{
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Net Total Balance</h6>
                            <h2 className="card-title mb-0 fw-bold display-5">
                                {formatCurrency(summary.netTotalBalance)}
                            </h2>
                            <small className="opacity-75 d-block mt-2">
                                Income - (Expenses + Ads)
                            </small>
                            <i className="bi bi-wallet-fill card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div
                        className="card finance-card bg-gradient-danger h-100"
                        style={{
                            background: 'linear-gradient(135deg, #ef476f 0%, #ff1053 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Total All-Time Spending</h6>
                            <h2 className="card-title mb-0 fw-bold display-5">
                                {formatCurrency(summary.totalAllSpending)}
                            </h2>
                            <small className="opacity-75 d-block mt-2">
                                Ads + Expenses + Subscriptions
                            </small>
                            <i className="bi bi-graph-down-arrow card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <div
                        className="card finance-card bg-gradient-primary h-100"
                        style={{
                            background: 'linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Total All-Time Income</h6>
                            <h2 className="card-title mb-0 fw-bold display-5">
                                {formatCurrency(summary.totalAllIncome)}
                            </h2>
                            <small className="opacity-75 d-block mt-2">
                                All Sources
                            </small>
                            <i className="bi bi-cash-coin card-icon-bg" />
                        </div>
                    </div>
                </div>
            </div>

            <h5 className="fw-bold mb-3">Time-Based Spending Analysis</h5>
            <div className="row g-4 mb-5">
                <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                    <div className="card finance-card bg-white border h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                                Today Spend
                            </h6>
                            <h4 className="mb-0 fw-bold text-danger">
                                {formatCurrency(summary.spendToday)}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                    <div className="card finance-card bg-white border h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                                This Week Spend
                            </h6>
                            <h4 className="mb-0 fw-bold text-danger">
                                {formatCurrency(summary.spendWeek)}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                    <div className="card finance-card bg-white border h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                                This Month Spend
                            </h6>
                            <h4 className="mb-0 fw-bold text-danger">
                                {formatCurrency(summary.spendMonth)}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                    <div className="card finance-card bg-white border h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                                Last Month Spend
                            </h6>
                            <h4 className="mb-0 fw-bold text-secondary">
                                {formatCurrency(summary.spendLastMonth)}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                    <div className="card finance-card bg-white border h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                                This Year Spend
                            </h6>
                            <h4 className="mb-0 fw-bold text-danger">
                                {formatCurrency(summary.spendYear)}
                            </h4>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-6 col-lg-4 col-xl-2">
                    <div className="card finance-card bg-white border h-100">
                        <div className="card-body">
                            <h6 className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>
                                Last Year Spend
                            </h6>
                            <h4 className="mb-0 fw-bold text-secondary">
                                {formatCurrency(summary.spendLastYear)}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>

            <h5 className="fw-bold mb-3">Category Breakdown</h5>
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card bg-gradient-info h-100"
                        style={{
                            background: 'linear-gradient(135deg, #2ec4b6 0%, #20a4f3 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Ad Spend Total</h6>
                            <h3 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalAdSpend)}
                            </h3>
                            <small className="opacity-75 d-block mt-1">Marketing</small>
                            <i className="bi bi-megaphone card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card bg-gradient-purple h-100"
                        style={{
                            background: 'linear-gradient(135deg, #7209b7 0%, #b5179e 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Investments Value</h6>
                            <h3 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalInvestments)}
                            </h3>
                            <small className="opacity-75 d-block mt-1">Current Value</small>
                            <i className="bi bi-piggy-bank card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card bg-gradient-warning h-100 text-dark"
                        style={{
                            background: 'linear-gradient(135deg, #ff9f1c 0%, #ffbf69 100%)',
                            color: '#212529'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Loans Outstanding</h6>
                            <h3 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalLoans)}
                            </h3>
                            <small className="opacity-75 d-block mt-1">Remaining Balance</small>
                            <i className="bi bi-bank card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6 col-lg-3">
                    <div
                        className="card finance-card bg-gradient-dark h-100"
                        style={{
                            background: 'linear-gradient(135deg, #0f172a 0%, #1f2937 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Monthly Recurring</h6>
                            <h3 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalRecurring)}
                            </h3>
                            <small className="opacity-75 d-block mt-1">Subscriptions</small>
                            <i className="bi bi-arrow-repeat card-icon-bg" />
                        </div>
                    </div>
                </div>
            </div>

            <h5 className="fw-bold mb-3">Website Finance</h5>
            <div className="row g-4 mb-4">
                <div className="col-12 col-md-6">
                    <div
                        className="card finance-card bg-gradient-success h-100"
                        style={{
                            background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Website Revenue</h6>
                            <h3 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalWebsiteRevenue)}
                            </h3>
                            <small className="opacity-75 d-block mt-1">
                                Total Income from Website
                            </small>
                            <i className="bi bi-globe card-icon-bg" />
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div
                        className="card finance-card bg-gradient-danger h-100"
                        style={{
                            background: 'linear-gradient(135deg, #ef476f 0%, #ff1053 100%)',
                            color: '#ffffff'
                        }}
                    >
                        <div className="card-body">
                            <h6 className="card-subtitle mb-2 opacity-75">Website Expenses</h6>
                            <h3 className="card-title mb-0 fw-bold">
                                {formatCurrency(summary.totalWebsiteExpenses)}
                            </h3>
                            <small className="opacity-75 d-block mt-1">
                                Total Costs for Website
                            </small>
                            <i className="bi bi-globe2 card-icon-bg" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalFinanceOverview;
