import React, { useState, useEffect } from 'react';
import { BiCalculator, BiRupee, BiTime, BiMoney, BiTable, BiDownload, BiBarChartAlt2 } from 'react-icons/bi';
import '../assets/css/FinanceCalculators.css';
import SEO from '../components/SEO';

const FinanceCalculators = () => {
  const [activeTab, setActiveTab] = useState('emi');

  // EMI Calculator State
  const [loanType, setLoanType] = useState('car'); // car or personal
  const [assetPrice, setAssetPrice] = useState(1200000); // Car Price
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [downPayment, setDownPayment] = useState(360000);
  const [loanAmount, setLoanAmount] = useState(840000);
  
  const [interestRate, setInterestRate] = useState(8.8);
  const [loanTenure, setLoanTenure] = useState(7); // in years
  const [tenureType, setTenureType] = useState('years'); // years or months
  
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);

  // --- Tax Calculator State ---
  const [annualIncome, setAnnualIncome] = useState(1200000);
  const [taxDeductions, setTaxDeductions] = useState(150000);
  const [taxPayableOld, setTaxPayableOld] = useState(0);
  const [taxPayableNew, setTaxPayableNew] = useState(0);
  const [financialYear, setFinancialYear] = useState('2025-2026'); // Default to 2025-26 as per user request

  // --- Salary Calculator State ---
  const [salaryCTC, setSalaryCTC] = useState(1200000);
  const [salaryBasic, setSalaryBasic] = useState(0);
  const [salaryHRA, setSalaryHRA] = useState(0);
  const [salaryPF, setSalaryPF] = useState(1800);
  const [salaryProfTax, setSalaryProfTax] = useState(200);
  const [monthlyInHand, setMonthlyInHand] = useState(0);

  // --- Investment Calculator State ---
  const [invMonthly, setInvMonthly] = useState(5000);
  const [invRate, setInvRate] = useState(12);
  const [invYears, setInvYears] = useState(10);
  const [invTotalValue, setInvTotalValue] = useState(0);
  const [invTotalInvested, setInvTotalInvested] = useState(0);
  const [invEstReturns, setInvEstReturns] = useState(0);

  // --- Eligibility Calculator State ---
  const [eligIncome, setEligIncome] = useState(50000);
  const [eligOtherEMI, setEligOtherEMI] = useState(0);
  const [eligRate, setEligRate] = useState(8.5);
  const [eligTenure, setEligTenure] = useState(20);
  const [eligLoanAmount, setEligLoanAmount] = useState(0);
  const [eligEMI, setEligEMI] = useState(0);

  // --- Calculations ---

  // Tax Calculation
  useEffect(() => {
    // 1. Old Regime Calculation (Same for all years currently)
    // Deduct standard deduction (50k) + 80C/D deductions
    let taxableOld = Math.max(0, parseFloat(annualIncome) - 50000 - parseFloat(taxDeductions));
    let taxOld = 0;

    if (taxableOld <= 500000) {
        taxOld = 0; // Rebate u/s 87A
    } else {
        // Slabs: 0-2.5L (0%), 2.5-5L (5%), 5-10L (20%), >10L (30%)
        if (taxableOld > 250000) taxOld += Math.min(250000, taxableOld - 250000) * 0.05;
        if (taxableOld > 500000) taxOld += Math.min(500000, taxableOld - 500000) * 0.20;
        if (taxableOld > 1000000) taxOld += (taxableOld - 1000000) * 0.30;
        
        taxOld += taxOld * 0.04; // 4% Cess
    }

    // 2. New Regime Calculation
    let taxNew = 0;
    
    if (financialYear === '2024-2025') {
        // FY 2024-25 (Final Budget July 2024)
        // Std Deduction: 75k
        // Slabs: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%)
        let taxableNew = Math.max(0, parseFloat(annualIncome) - 75000);

        if (taxableNew <= 700000) {
            taxNew = 0; // Rebate u/s 87A up to 7L
        } else {
            if (taxableNew > 300000) taxNew += Math.min(400000, taxableNew - 300000) * 0.05; // 3-7L
            if (taxableNew > 700000) taxNew += Math.min(300000, taxableNew - 700000) * 0.10; // 7-10L
            if (taxableNew > 1000000) taxNew += Math.min(200000, taxableNew - 1000000) * 0.15; // 10-12L
            if (taxableNew > 1200000) taxNew += Math.min(300000, taxableNew - 1200000) * 0.20; // 12-15L
            if (taxableNew > 1500000) taxNew += (taxableNew - 1500000) * 0.30; // >15L
            
            taxNew += taxNew * 0.04; // 4% Cess
        }
    } else {
        // FY 2025-26 and 2026-27 (Proposed/Projected)
        // Std Deduction: 75k
        // Slabs: 0-4L (0%), 4-8L (5%), 8-12L (10%), 12-16L (15%), 16-20L (20%), 20-24L (25%), >24L (30%)
        // Rebate: Up to 12L taxable income is tax free
        let taxableNew = Math.max(0, parseFloat(annualIncome) - 75000);

        if (taxableNew <= 1200000) {
            taxNew = 0; // Rebate u/s 87A up to 12L (effectively)
        } else {
            // If income > 12L, calculate tax from slab 0 (usually rebate is lost if > limit, but for marginal relief we assume standard calculation first. 
            // Note: 87A is usually "Total income does not exceed X". If it exceeds, you pay full tax.
            // Slabs:
            // 0-4L: 0
            // 4-8L: 5%
            // 8-12L: 10%
            // 12-16L: 15%
            // 16-20L: 20%
            // 20-24L: 25%
            // >24L: 30%
            
            if (taxableNew > 400000) taxNew += Math.min(400000, taxableNew - 400000) * 0.05; // 4-8L
            if (taxableNew > 800000) taxNew += Math.min(400000, taxableNew - 800000) * 0.10; // 8-12L
            if (taxableNew > 1200000) taxNew += Math.min(400000, taxableNew - 1200000) * 0.15; // 12-16L
            if (taxableNew > 1600000) taxNew += Math.min(400000, taxableNew - 1600000) * 0.20; // 16-20L
            if (taxableNew > 2000000) taxNew += Math.min(400000, taxableNew - 2000000) * 0.25; // 20-24L
            if (taxableNew > 2400000) taxNew += (taxableNew - 2400000) * 0.30; // >24L

            taxNew += taxNew * 0.04; // 4% Cess
        }
    }

    setTaxPayableOld(Math.round(taxOld));
    setTaxPayableNew(Math.round(taxNew));

  }, [annualIncome, taxDeductions, financialYear]);

  // Salary Calculation
  useEffect(() => {
    // 1. Calculate Breakdown based on CTC
    // Assumption: Basic = 50% of CTC, HRA = 50% of Basic, PF = 12% of Basic (Monthly)
    const annualCTC = parseFloat(salaryCTC);
    const basicYearly = annualCTC * 0.50;
    const hraYearly = basicYearly * 0.50;
    const pfMonthly = Math.round((basicYearly / 12) * 0.12);
    
    // Update calculated states
    setSalaryBasic(Math.round(basicYearly));
    setSalaryHRA(Math.round(hraYearly));
    setSalaryPF(pfMonthly); // Auto-update PF based on Basic
    
    // 2. In-Hand Calculation
    const monthlyGross = annualCTC / 12;
    // Use the New Regime tax for monthly deduction estimate
    const monthlyTax = taxPayableNew / 12; 
    const deductions = parseFloat(pfMonthly) + parseFloat(salaryProfTax) + monthlyTax;
    setMonthlyInHand(Math.round(Math.max(0, monthlyGross - deductions)));
  }, [salaryCTC, salaryProfTax, taxPayableNew]); // Removed salaryPF from dependency to avoid infinite loop since we set it here

  // Investment Calculation
  useEffect(() => {
    const p = parseFloat(invMonthly);
    const r = parseFloat(invRate) / 100 / 12;
    const n = parseFloat(invYears) * 12;

    if (p > 0 && r > 0 && n > 0) {
        const fv = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        const invested = p * n;
        setInvTotalValue(Math.round(fv));
        setInvTotalInvested(Math.round(invested));
        setInvEstReturns(Math.round(fv - invested));
    } else {
        setInvTotalValue(0);
        setInvTotalInvested(0);
        setInvEstReturns(0);
    }
  }, [invMonthly, invRate, invYears]);

  // Eligibility Calculation
  useEffect(() => {
    const income = parseFloat(eligIncome);
    const obligations = parseFloat(eligOtherEMI);
    const r = parseFloat(eligRate) / 12 / 100;
    const n = parseFloat(eligTenure) * 12;

    // FOIR 50%
    const maxEMI = (income * 0.50) - obligations;

    if (maxEMI > 0 && r > 0 && n > 0) {
        const maxLoan = (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
        setEligLoanAmount(Math.round(maxLoan));
        setEligEMI(Math.round(maxEMI));
    } else {
        setEligLoanAmount(0);
        setEligEMI(0);
    }
  }, [eligIncome, eligOtherEMI, eligRate, eligTenure]);

  // Update Down Payment & Loan Amount when Asset Price changes
  useEffect(() => {
    const newDownPayment = Math.round((assetPrice * downPaymentPercent) / 100);
    setDownPayment(newDownPayment);
    setLoanAmount(assetPrice - newDownPayment);
  }, [assetPrice, downPaymentPercent]);

  // Update Percent when Down Payment Amount changes manually
  const handleDownPaymentAmountChange = (val) => {
    let newDownPayment = parseFloat(val);
    if (newDownPayment > assetPrice) newDownPayment = assetPrice;
    if (newDownPayment < 0) newDownPayment = 0;
    
    setDownPayment(newDownPayment);
    setDownPaymentPercent(Math.round((newDownPayment / assetPrice) * 100));
    setLoanAmount(assetPrice - newDownPayment);
  };

  // EMI Calculation Logic
  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTenure, tenureType]);

  const calculateEMI = () => {
    let principal = parseFloat(loanAmount);
    let rate = parseFloat(interestRate);
    let time = parseFloat(loanTenure);

    if (isNaN(principal) || isNaN(rate) || isNaN(time)) return;

    // Convert to monthly
    let r = rate / 12 / 100;
    let n = tenureType === 'years' ? time * 12 : time;

    let emiValue = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    // If interest is 0 (edge case)
    if (rate === 0) {
        emiValue = principal / n;
    }

    setEmi(Math.round(emiValue));
    setTotalPayment(Math.round(emiValue * n));
    setTotalInterest(Math.round((emiValue * n) - principal));

    // Generate Schedule
    let balance = principal;
    let newSchedule = [];
    for (let i = 1; i <= n; i++) {
        let interestPart = balance * r;
        let principalPart = emiValue - interestPart;
        balance -= principalPart;
        
        if (balance < 0) balance = 0;

        newSchedule.push({
            month: i,
            emi: Math.round(emiValue),
            interest: Math.round(interestPart),
            principal: Math.round(principalPart),
            balance: Math.round(balance)
        });
    }
    setSchedule(newSchedule);
  };

  // SVG Donut Chart Component
  const DonutChart = ({ value1, value2, color1, color2 }) => {
    const total = parseFloat(value1) + parseFloat(value2);
    if (total === 0) return null;
    
    const p1 = (value1 / total) * 100;
    const p2 = (value2 / total) * 100;
    
    // SVG Circle Calculations
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset1 = circumference - (p1 / 100) * circumference;
    
    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth="25"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke={color1} // First segment
            strokeWidth="25"
            strokeDasharray={circumference}
            strokeDashoffset={offset1}
            transform="rotate(-90 100 100)"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="transparent"
            stroke={color2} // Second segment
            strokeWidth="25"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (p2 / 100) * circumference} // Start where first ends
            transform={`rotate(${-90 + (p1 * 3.6)} 100 100)`}
          />
        </svg>
      </div>
    );
  };

  // Helper to format currency
  const formatINR = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'emi':
        return (
          <div className="calculator-content animate-fade-in">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Column: Inputs Card */}
                <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                
                    {/* Loan Type Toggle */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-800 mb-3">Loan Type</label>
                        <div className="flex rounded-lg overflow-hidden border border-blue-600 w-full">
                        <button 
                            onClick={() => setLoanType('car')}
                            className={`flex-1 py-3 text-sm font-medium transition ${loanType === 'car' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                        >
                            Car Loan
                        </button>
                        <button 
                            onClick={() => setLoanType('personal')}
                            className={`flex-1 py-3 text-sm font-medium transition ${loanType === 'personal' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                        >
                            Personal Loan
                        </button>
                        </div>
                    </div>

                    {/* Car Price */}
                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-800 mb-4">
                            {loanType === 'car' ? 'Car Price' : 'Loan Amount'}
                        </label>
                        
                        <input 
                            type="range" 
                            min="100000" 
                            max="10000000" 
                            step="10000"
                            value={assetPrice} 
                            onChange={(e) => setAssetPrice(e.target.value)}
                            className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                        />

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 font-bold">₹</span>
                            </div>
                            <input 
                                type="number" 
                                value={assetPrice} 
                                onChange={(e) => setAssetPrice(e.target.value)}
                                className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 font-semibold text-right"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Total price before down payment</p>
                    </div>

                    {/* Down Payment (Only for Car Loan) */}
                    {loanType === 'car' && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <label className="block text-sm font-bold text-gray-800">Down Payment</label>
                                <span className="text-sm font-bold text-gray-600">{downPaymentPercent}%</span>
                            </div>
                            
                            <input 
                                type="range" 
                                min="0" 
                                max="90" 
                                step="1"
                                value={downPaymentPercent} 
                                onChange={(e) => setDownPaymentPercent(e.target.value)}
                                className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                            />

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 font-bold">₹</span>
                                </div>
                                <input 
                                    type="number" 
                                    value={downPayment} 
                                    onChange={(e) => handleDownPaymentAmountChange(e.target.value)}
                                    className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900 font-semibold text-right"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Your loan amount will be: <span className="font-bold">₹ {loanAmount.toLocaleString('en-IN')}</span>
                            </p>
                        </div>
                    )}

                    {/* Tenure & Interest Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Tenure */}
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-4">Tenure</label>

                            <input 
                                type="range" 
                                min="1" 
                                max={tenureType === 'years' ? 30 : 360} 
                                step="1"
                                value={loanTenure} 
                                onChange={(e) => setLoanTenure(e.target.value)}
                                className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                            />

                            <div className="flex flex-nowrap items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                                <input 
                                    type="number" 
                                    value={loanTenure} 
                                    onChange={(e) => setLoanTenure(e.target.value)}
                                    className="flex-grow min-w-0 px-4 py-3 outline-none text-center font-semibold text-gray-900"
                                />
                                <div className="flex flex-nowrap bg-gray-50 border-l border-gray-200">
                                    <button 
                                        onClick={() => setTenureType('years')}
                                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition ${tenureType === 'years' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        years
                                    </button>
                                    <button 
                                        onClick={() => setTenureType('months')}
                                        className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition ${tenureType === 'months' ? 'text-blue-600 bg-blue-50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                                    >
                                        months
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Interest */}
                        <div>
                            <label className="block text-sm font-bold text-gray-800 mb-4">Interest</label>

                            <input 
                                type="range" 
                                min="1" 
                                max="30" 
                                step="0.1"
                                value={interestRate} 
                                onChange={(e) => setInterestRate(e.target.value)}
                                className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
                            />

                            <div className="flex flex-nowrap items-center border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                                <input 
                                    type="number" 
                                    value={interestRate} 
                                    onChange={(e) => setInterestRate(e.target.value)}
                                    className="flex-grow min-w-0 px-4 py-3 outline-none text-center font-semibold text-gray-900"
                                />
                                <div className="bg-gray-50 border-l border-gray-200 px-5 self-stretch flex items-center justify-center">
                                    <span className="text-gray-600 font-bold whitespace-nowrap">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Results Card */}
                <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-36">
                    
                    {/* Header Row */}
                    <div className="flex justify-between items-start mb-10">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900">₹ {formatINR(emi)}</h2>
                            <p className="text-gray-500 mt-2 font-medium">EMI for {loanTenure} {tenureType}</p>
                        </div>
                        <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={showSchedule} onChange={() => setShowSchedule(!showSchedule)} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700">Schedule</span>
                            </label>
                        </div>
                    </div>

                    {/* Donut Chart */}
                    <div className="flex justify-center mb-10">
                        <DonutChart 
                            value1={loanAmount} 
                            value2={totalInterest} 
                            color1="#10b981" // Green (Principal)
                            color2="#f59e0b" // Orange (Interest)
                        />
                    </div>

                    {/* Summary Stats */}
                    <div className="space-y-6">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span>
                                <span className="text-gray-600 font-medium">Principal Loan Amount</span>
                            </div>
                            <span className="font-bold text-gray-900 text-base">₹ {formatINR(loanAmount)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></span>
                                <span className="text-gray-600 font-medium">Total Interest Payable</span>
                            </div>
                            <span className="font-bold text-gray-900 text-base">₹ {formatINR(totalInterest)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm pt-6 border-t border-gray-100">
                            <span className="text-gray-800 font-bold text-base">Total Amount Payable</span>
                            <span className="font-bold text-gray-900 text-xl">₹ {formatINR(totalPayment)}</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Schedule Table (Conditional) */}
            {showSchedule && (
                <div className="w-full mt-12 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 animate-fade-in relative z-10">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center text-xl">
                            <BiTable className="mr-2" /> Amortization Schedule
                        </h3>
                    </div>
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-sm text-left border-collapse">
                            <thead className="bg-gray-50 text-gray-600 sticky top-0 z-20">
                                <tr>
                                    <th className="px-6 py-4 font-semibold rounded-tl-lg">Month</th>
                                    <th className="px-6 py-4 font-semibold">Principal</th>
                                    <th className="px-6 py-4 font-semibold">Interest</th>
                                    <th className="px-6 py-4 font-semibold">Total Payment</th>
                                    <th className="px-6 py-4 font-semibold rounded-tr-lg">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {schedule.map((row) => (
                                    <tr key={row.month} className="hover:bg-gray-50 transition group">
                                        <td className="px-6 py-4 font-medium text-gray-900 group-hover:text-blue-600">{row.month}</td>
                                        <td className="px-6 py-4 text-green-600 font-medium">₹ {formatINR(row.principal)}</td>
                                        <td className="px-6 py-4 text-red-500 font-medium">₹ {formatINR(row.interest)}</td>
                                        <td className="px-6 py-4 text-gray-700">₹ {formatINR(row.emi)}</td>
                                        <td className="px-6 py-4 text-gray-500">₹ {formatINR(row.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
          </div>
        );
      
      case 'tax':
        return (
            <div className="calculator-content animate-fade-in">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                        {/* Financial Year Selection */}
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-800 mb-3">Financial Year</label>
                            <div className="flex rounded-lg overflow-hidden border border-blue-600 w-full">
                                <button 
                                    onClick={() => setFinancialYear('2024-2025')}
                                    className={`flex-1 py-3 text-sm font-medium transition ${financialYear === '2024-2025' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                                >
                                    FY 2024-25
                                </button>
                                <button 
                                    onClick={() => setFinancialYear('2025-2026')}
                                    className={`flex-1 py-3 text-sm font-medium transition ${financialYear === '2025-2026' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                                >
                                    FY 2025-26
                                </button>
                                <button 
                                    onClick={() => setFinancialYear('2026-2027')}
                                    className={`flex-1 py-3 text-sm font-medium transition ${financialYear === '2026-2027' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                                >
                                    FY 2026-27
                                </button>
                            </div>
                        </div>

                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-800 mb-4">Annual Income</label>
                            <input type="range" min="300000" max="5000000" step="10000" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold">₹</span></div>
                                <input type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-right" />
                            </div>
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-800 mb-4">Investments (80C etc)</label>
                            <input type="range" min="0" max="500000" step="5000" value={taxDeductions} onChange={(e) => setTaxDeductions(e.target.value)} className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold">₹</span></div>
                                <input type="number" value={taxDeductions} onChange={(e) => setTaxDeductions(e.target.value)} className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-right" />
                            </div>
                        </div>
                    </div>
                    {/* Results */}
                    <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-36">
                         <h2 className="text-3xl font-bold text-gray-900 mb-6">Tax Estimate</h2>
                         
                         {/* Donut Chart */}
                         <div className="flex justify-center mb-8">
                             <DonutChart 
                                 value1={annualIncome - taxPayableNew} // Net Income
                                 value2={taxPayableNew} // Tax
                                 color1="#10b981" // Green (Net Income)
                                 color2="#3b82f6" // Blue (Tax)
                             />
                         </div>

                         <div className="space-y-6">
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <span className="text-gray-700 font-medium">Old Regime</span>
                                <span className="text-xl font-bold text-gray-900">₹ {formatINR(taxPayableOld)}</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <span className="text-blue-800 font-medium">New Regime</span>
                                <span className="text-xl font-bold text-blue-900">₹ {formatINR(taxPayableNew)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-4">* Simplified calculation for FY {financialYear}. Actual tax may vary based on surcharge, cess, and specific exemptions.</p>
                         </div>
                    </div>
                 </div>
            </div>
        );

      case 'salary':
        return (
            <div className="calculator-content animate-fade-in">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-800 mb-4">Annual CTC</label>
                            <input type="range" min="300000" max="5000000" step="10000" value={salaryCTC} onChange={(e) => setSalaryCTC(e.target.value)} className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold">₹</span></div>
                                <input type="number" value={salaryCTC} onChange={(e) => setSalaryCTC(e.target.value)} className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-right" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-4">Monthly PF (12% of Basic)</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold">₹</span></div>
                                    <input type="number" value={salaryPF} onChange={(e) => setSalaryPF(parseFloat(e.target.value))} className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-right" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-4">Professional Tax</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold">₹</span></div>
                                    <input type="number" value={salaryProfTax} onChange={(e) => setSalaryProfTax(parseFloat(e.target.value))} className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-right" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Results */}
                    <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-36">
                         <div className="text-center mb-8">
                            <span className="text-gray-500 font-medium">Monthly In-Hand Salary</span>
                            <h2 className="text-4xl font-bold text-blue-600 mt-2">₹ {formatINR(monthlyInHand)}</h2>
                         </div>
                         <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Monthly Gross (Approx)</span>
                                <span className="font-bold">₹ {formatINR(Math.round(salaryCTC/12))}</span>
                            </div>
                            <div className="flex justify-between text-sm text-red-500">
                                <span>Deductions (PF + PT)</span>
                                <span>- ₹ {formatINR(salaryPF + salaryProfTax)}</span>
                            </div>
                             <div className="flex justify-between text-sm text-red-500">
                                <span>Est. Monthly Tax</span>
                                <span>- ₹ {formatINR(Math.round(taxPayableNew/12))}</span>
                            </div>
                         </div>
                    </div>
                 </div>
            </div>
        );

      case 'investment':
        return (
             <div className="calculator-content animate-fade-in">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-800 mb-4">Monthly Investment</label>
                            <input type="range" min="500" max="100000" step="500" value={invMonthly} onChange={(e) => setInvMonthly(e.target.value)} className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold">₹</span></div>
                                <input type="number" value={invMonthly} onChange={(e) => setInvMonthly(e.target.value)} className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-right" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-4">Expected Return (p.a)</label>
                                <div className="flex flex-nowrap border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                                    <input type="number" value={invRate} onChange={(e) => setInvRate(e.target.value)} className="flex-grow min-w-0 px-4 py-3 outline-none text-center font-semibold text-gray-900" />
                                    <div className="bg-gray-50 border-l border-gray-200 px-5 flex items-center justify-center"><span className="text-gray-600 font-bold whitespace-nowrap">%</span></div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-4">Time Period</label>
                                <div className="flex flex-nowrap border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                                    <input type="number" value={invYears} onChange={(e) => setInvYears(e.target.value)} className="flex-grow min-w-0 px-4 py-3 outline-none text-center font-semibold text-gray-900" />
                                    <div className="bg-gray-50 border-l border-gray-200 px-5 flex items-center justify-center"><span className="text-gray-600 font-bold whitespace-nowrap">Yr</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Results */}
                    <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-36">
                         <div className="mb-8">
                            <h2 className="text-4xl font-bold text-gray-900">₹ {formatINR(invTotalValue)}</h2>
                            <p className="text-gray-500 mt-2 font-medium">Total Value</p>
                         </div>

                         {/* Donut Chart */}
                         <div className="flex justify-center mb-8">
                             <DonutChart 
                                 value1={invTotalInvested} // Invested
                                 value2={invEstReturns} // Returns
                                 color1="#3b82f6" // Blue (Invested)
                                 color2="#10b981" // Green (Returns)
                             />
                         </div>

                         <div className="space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-3"></span><span className="text-gray-600 font-medium">Invested Amount</span></div>
                                <span className="font-bold text-gray-900 text-base">₹ {formatINR(invTotalInvested)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-3"></span><span className="text-gray-600 font-medium">Est. Returns</span></div>
                                <span className="font-bold text-green-600 text-base">₹ {formatINR(invEstReturns)}</span>
                            </div>
                         </div>
                    </div>
                 </div>
            </div>
        );

      case 'eligibility':
        return (
            <div className="calculator-content animate-fade-in">
                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Inputs */}
                    <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100">
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-800 mb-4">Gross Monthly Income</label>
                            <input type="range" min="15000" max="1000000" step="5000" value={eligIncome} onChange={(e) => setEligIncome(e.target.value)} className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold">₹</span></div>
                                <input type="number" value={eligIncome} onChange={(e) => setEligIncome(e.target.value)} className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-right" />
                            </div>
                        </div>
                        <div className="mb-8">
                            <label className="block text-sm font-bold text-gray-800 mb-4">Other Monthly EMIs</label>
                            <input type="range" min="0" max="500000" step="1000" value={eligOtherEMI} onChange={(e) => setEligOtherEMI(e.target.value)} className="w-full mb-6 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue" />
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold">₹</span></div>
                                <input type="number" value={eligOtherEMI} onChange={(e) => setEligOtherEMI(e.target.value)} className="block w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-right" />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-800 mb-4">Interest Rate</label>
                                <div className="flex flex-nowrap border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                                    <input type="number" value={eligRate} onChange={(e) => setEligRate(e.target.value)} className="flex-grow min-w-0 px-4 py-3 outline-none text-center font-semibold text-gray-900" />
                                    <div className="bg-gray-50 border-l border-gray-200 px-5 flex items-center justify-center"><span className="text-gray-600 font-bold whitespace-nowrap">%</span></div>
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-bold text-gray-800 mb-4">Tenure (Years)</label>
                                <div className="flex flex-nowrap border border-gray-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition">
                                    <input type="number" value={eligTenure} onChange={(e) => setEligTenure(e.target.value)} className="flex-grow min-w-0 px-4 py-3 outline-none text-center font-semibold text-gray-900" />
                                    <div className="bg-gray-50 border-l border-gray-200 px-5 flex items-center justify-center"><span className="text-gray-600 font-bold whitespace-nowrap">Yr</span></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Results */}
                    <div className="lg:col-span-5 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 h-fit sticky top-36">
                         <div className="mb-8">
                            <span className="text-gray-500 font-medium">You are eligible for a loan of</span>
                            <h2 className="text-4xl font-bold text-green-600 mt-2">₹ {formatINR(eligLoanAmount)}</h2>
                         </div>

                         {/* Donut Chart */}
                         <div className="flex justify-center mb-8">
                             <DonutChart 
                                 value1={eligEMI} // EMI Capacity
                                 value2={eligIncome * 0.5 - eligEMI} // Remaining FOIR Capacity (just for visuals)
                                 color1="#16a34a" // Green (Loan EMI Capacity)
                                 color2="#e5e7eb" // Gray (Buffer/Other)
                             />
                         </div>

                         <div className="space-y-4 border-t border-gray-100 pt-6">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Max Monthly EMI</span>
                                <span className="font-bold">₹ {formatINR(eligEMI)}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-4">Based on 50% FOIR (Fixed Obligation to Income Ratio).</p>
                         </div>
                    </div>
                 </div>
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="finance-calculators-page min-h-screen bg-gray-50 pt-40 pb-12 px-4 sm:px-6 lg:px-8">
      <SEO title="Finance Calculators" description="Calculate your EMI, Tax, Salary, and Investments with BCVWORLD's finance tools." />
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
             <h1 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Calculators</h1>
             
             {/* Tabs */}
             <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm border border-gray-200 overflow-x-auto max-w-full">
                {['emi', 'tax', 'salary', 'investment', 'eligibility'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium rounded-md capitalize whitespace-nowrap transition
                            ${activeTab === tab 
                                ? 'bg-gray-800 text-white' 
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
                        `}
                    >
                        {tab}
                    </button>
                ))}
             </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            {renderTabContent()}
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Why use our calculators?</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                    <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Accurate and instant results</li>
                    <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Visual breakdowns and schedules</li>
                    <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Completely free to use</li>
                    <li className="flex items-start"><span className="text-green-500 mr-2">✓</span> Mobile-friendly and responsive</li>
                </ul>
            </div>
            <div className="bg-blue-600 p-6 rounded-xl shadow-lg text-white">
                <h3 className="text-lg font-bold mb-3">Need Professional Advice?</h3>
                <p className="text-blue-100 text-sm mb-4">
                    Our financial experts can help you plan your investments and tax saving strategies better.
                </p>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition">
                    Contact Us
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default FinanceCalculators;
