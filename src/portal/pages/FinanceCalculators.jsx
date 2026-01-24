// FinanceCalculators.jsx
import React, { useState, useEffect } from 'react';
import '../assets/css/FinanceCalculators.css';

const FinanceCalculators = () => {
  const [activeCalculator, setActiveCalculator] = useState('emi');
  const [loanType, setLoanType] = useState('car');
  const [price, setPrice] = useState(1200000);
  const [downPayment, setDownPayment] = useState(360000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(30);
  const [tenureMonths, setTenureMonths] = useState(84);
  const [interestRate, setInterestRate] = useState(8.8);
  const [showSchedule, setShowSchedule] = useState(false);
  
  // Tax calculator states
  const [annualIncome, setAnnualIncome] = useState(600000);
  const [taxRate, setTaxRate] = useState(10);
  
  // Salary calculator states
  const [ctcAnnual, setCtcAnnual] = useState(600000);
  const [pfPercent, setPfPercent] = useState(12);
  const [otherDeductionsPercent, setOtherDeductionsPercent] = useState(5);
  
  // Investment calculator states
  const [sipMonthly, setSipMonthly] = useState(10000);
  const [investmentMonths, setInvestmentMonths] = useState(120);
  const [expectedReturn, setExpectedReturn] = useState(12);
  
  // Eligibility calculator states
  const [grossMonthlyIncome, setGrossMonthlyIncome] = useState(50000);
  const [existingEMIs, setExistingEMIs] = useState(0);
  const [eligibilityInterestRate, setEligibilityInterestRate] = useState(9);
  const [eligibilityTenure, setEligibilityTenure] = useState(20);
  
  // Basic calculator states
  const [calcExpression, setCalcExpression] = useState('0');
  
  // Format currency in INR
  const formatINR = (num) => {
    try {
      return '₹ ' + Number(num || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });
    } catch {
      return '₹ ' + num;
    }
  };
  
  // Calculate EMI
  const computeEMI = (P, annualRate, months) => {
    const r = (annualRate / 100) / 12;
    if (r === 0) return P / months;
    const pow = Math.pow(1 + r, months);
    return P * r * pow / (pow - 1);
  };
  
  // Generate amortization schedule
  const buildSchedule = (P, annualRate, months) => {
    const r = (annualRate / 100) / 12;
    const emi = computeEMI(P, annualRate, months);
    let balance = P;
    const rows = [];
    for (let m = 1; m <= months; m++) {
      const interest = balance * r;
      const principal = emi - interest;
      balance = Math.max(0, balance - principal);
      rows.push({
        month: m,
        emi: Math.round(emi),
        interest: Math.round(interest),
        principal: Math.round(principal),
        balance: Math.round(balance)
      });
    }
    return rows;
  };
  
  // Calculate loan eligibility
  const calculateEligibility = () => {
    const netIncome = Math.max(0, grossMonthlyIncome - existingEMIs);
    const maxEMI = netIncome * 0.5; // 50% FOIR
    const r = (eligibilityInterestRate / 100) / 12;
    const n = eligibilityTenure * 12;
    
    let maxLoan = 0;
    if (r === 0) {
      maxLoan = maxEMI * n;
    } else {
      const pow = Math.pow(1 + r, n);
      maxLoan = (maxEMI * (pow - 1)) / (r * pow);
    }
    
    return {
      maxLoan: Math.round(maxLoan),
      maxEMI: Math.round(maxEMI),
      remainingIncome: Math.round(netIncome - maxEMI),
      netIncome: Math.round(netIncome)
    };
  };
  
  // Calculate SIP returns
  const calculateSIP = () => {
    const r = expectedReturn / 100 / 12;
    const n = investmentMonths;
    const pow = Math.pow(1 + r, n);
    const futureValue = r === 0 ? sipMonthly * n : sipMonthly * ((pow - 1) / r) * (1 + r);
    const principalInvested = sipMonthly * n;
    const returnsEarned = futureValue - principalInvested;
    
    return {
      futureValue: Math.round(futureValue),
      principalInvested: Math.round(principalInvested),
      returnsEarned: Math.round(returnsEarned)
    };
  };
  
  // Calculate salary breakdown
  const calculateSalary = () => {
    const monthlyGross = ctcAnnual / 12;
    const pfDeduction = monthlyGross * (pfPercent / 100);
    const otherDeductions = monthlyGross * (otherDeductionsPercent / 100);
    const inHand = monthlyGross - pfDeduction - otherDeductions;
    
    return {
      inHand: Math.round(inHand),
      totalDeductions: Math.round(pfDeduction + otherDeductions),
      monthlyGross: Math.round(monthlyGross)
    };
  };
  
  // Calculate tax breakdown
  const calculateTax = () => {
    const monthlyIncome = annualIncome / 12;
    const monthlyTax = monthlyIncome * (taxRate / 100);
    const netMonthly = monthlyIncome - monthlyTax;
    
    return {
      netMonthly: Math.round(netMonthly),
      monthlyTax: Math.round(monthlyTax),
      monthlyIncome: Math.round(monthlyIncome)
    };
  };
  
  // Handle basic calculator button clicks
  const handleCalcButton = (val) => {
    if (val === 'C') {
      setCalcExpression('0');
    } else if (val === 'DEL') {
      setCalcExpression(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (val === '=') {
      try {
        let evalExpr = calcExpression
          .replace(/sin\(/g, 'Math.sin(')
          .replace(/cos\(/g, 'Math.cos(')
          .replace(/tan\(/g, 'Math.tan(')
          .replace(/log\(/g, 'Math.log10(')
          .replace(/ln\(/g, 'Math.log(')
          .replace(/sqrt\(/g, 'Math.sqrt(')
          .replace(/PI/g, 'Math.PI')
          .replace(/E/g, 'Math.E')
          .replace(/\^/g, '**')
          .replace(/%/g, '/100');
        // Use Function constructor instead of eval for better security/practice
        // Input is controlled via buttons, so this is relatively safe
        const result = new Function('return ' + evalExpr)();
        setCalcExpression(String(result));
      } catch {
        setCalcExpression('Error');
      }
    } else {
      setCalcExpression(prev => prev === '0' || prev === 'Error' ? val : prev + val);
    }
  };
  
  // Get current results based on active calculator
  const getResults = () => {
    switch (activeCalculator) {
      case 'emi': {
        const loanAmount = Math.max(0, price - (loanType === 'car' ? downPayment : 0));
        const emi = computeEMI(loanAmount, interestRate, tenureMonths);
        const totalPayable = Math.round(emi * tenureMonths);
        const totalInterest = Math.round(totalPayable - loanAmount);
        const schedule = buildSchedule(loanAmount, interestRate, tenureMonths);
        return {
          primaryValue: Math.round(emi),
          primaryLabel: `EMI for ${Math.round(tenureMonths / 12)} years`,
          labelA: 'Principal Loan Amount',
          valueA: loanAmount,
          labelB: 'Total Interest Payable',
          valueB: totalInterest,
          labelTotal: 'Total Amount Payable',
          valueTotal: totalPayable,
          donutData: {
            principal: loanAmount,
            interest: totalInterest
          },
          schedule: schedule,
          showScheduleToggle: true
        };
      }
        
      case 'tax': {
        const taxResults = calculateTax();
        return {
          primaryValue: taxResults.netMonthly,
          primaryLabel: 'Net Monthly Income',
          labelA: 'Net Monthly',
          valueA: taxResults.netMonthly,
          labelB: 'Monthly Tax',
          valueB: taxResults.monthlyTax,
          labelTotal: 'Gross Monthly',
          valueTotal: taxResults.monthlyIncome,
          donutData: {
            principal: taxResults.netMonthly,
            interest: taxResults.monthlyTax
          },
          showScheduleToggle: false
        };
      }
        
      case 'salary': {
        const salaryResults = calculateSalary();
        return {
          primaryValue: salaryResults.inHand,
          primaryLabel: 'In-hand Monthly',
          labelA: 'In-hand Monthly',
          valueA: salaryResults.inHand,
          labelB: 'Total Deductions',
          valueB: salaryResults.totalDeductions,
          labelTotal: 'Gross Monthly',
          valueTotal: salaryResults.monthlyGross,
          donutData: {
            principal: salaryResults.inHand,
            interest: salaryResults.totalDeductions
          },
          showScheduleToggle: false
        };
      }
        
      case 'invest': {
        const sipResults = calculateSIP();
        return {
          primaryValue: sipResults.futureValue,
          primaryLabel: `Future Value (${Math.round(investmentMonths / 12)} yrs)`,
          labelA: 'Principal Invested',
          valueA: sipResults.principalInvested,
          labelB: 'Returns Earned',
          valueB: sipResults.returnsEarned,
          labelTotal: 'Future Value',
          valueTotal: sipResults.futureValue,
          donutData: {
            principal: sipResults.principalInvested,
            interest: sipResults.returnsEarned
          },
          showScheduleToggle: false
        };
      }
        
      case 'elig': {
        const eligibilityResults = calculateEligibility();
        return {
          primaryValue: eligibilityResults.maxLoan,
          primaryLabel: 'Maximum Loan Amount',
          labelA: 'Max Monthly EMI',
          valueA: eligibilityResults.maxEMI,
          labelB: 'Remaining Income',
          valueB: eligibilityResults.remainingIncome,
          labelTotal: 'Net Monthly Income',
          valueTotal: eligibilityResults.netIncome,
          donutData: {
            principal: eligibilityResults.maxEMI,
            interest: eligibilityResults.remainingIncome
          },
          showScheduleToggle: false
        };
      }
        
      case 'basic': {
        return {
          primaryValue: calcExpression === '0' ? 'Standard Calculator' : calcExpression,
          primaryLabel: '',
          labelA: '-',
          valueA: '-',
          labelB: '-',
          valueB: '-',
          labelTotal: '-',
          valueTotal: '-',
          donutData: { principal: 0, interest: 0 },
          showScheduleToggle: false
        };
      }
        
      default:
        return {
          primaryValue: 0,
          primaryLabel: '',
          labelA: '',
          valueA: 0,
          labelB: '',
          valueB: 0,
          labelTotal: '',
          valueTotal: 0,
          donutData: { principal: 0, interest: 0 },
          showScheduleToggle: false
        };
    }
  };
  
  const results = getResults();
  
  // Calculate donut chart segments
  const calculateDonutSegments = (principal, interest) => {
    const total = principal + interest;
    const r = 52;
    const C = 2 * Math.PI * r;
    const principalLen = total === 0 ? 0 : C * (principal / total);
    const interestLen = total === 0 ? 0 : C * (interest / total);
    return { principalLen, interestLen, C };
  };
  
  const donutSegments = calculateDonutSegments(
    results.donutData.principal,
    results.donutData.interest
  );

  // Update down payment when percentage changes
  useEffect(() => {
    if (loanType === 'car') {
      const newDownPayment = Math.round(price * downPaymentPercent / 100);
      setDownPayment(newDownPayment);
    }
  }, [downPaymentPercent, price, loanType]);

  return (
    <main className="emi-page container-fluid py-4">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><a href="/">Home</a></li>
          <li className="breadcrumb-item active" aria-current="page">Finance Calculators</li>
        </ol>
      </nav>
      
      <h1 className="h3 mb-2">Finance Calculators: EMI, Tax, Salary & Investment</h1>
      <p className="text-muted mb-3">
        Use these free tools to compute loan EMIs, estimate income tax, check in-hand salary after deductions, 
        and plan SIP investments. All results update instantly and work perfectly on mobile.
      </p>

      <div className="row g-4 align-items-stretch">
        {/* Main Content Center */}
        <div className="col-lg-8">
          <div className="row g-4">
            {/* Calculator Input Section */}
            <section className="col-lg-6">
              <div className="h-100 p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h2 className="h5 mb-0">Calculators</h2>
                  <div className="btn-group btn-group-sm" role="group" aria-label="calculator selector">
                    {['emi', 'tax', 'salary', 'invest', 'elig', 'basic'].map((calc) => (
                      <button
                        key={calc}
                        className={`btn btn-outline-secondary ${activeCalculator === calc ? 'active' : ''}`}
                        onClick={() => setActiveCalculator(calc)}
                      >
                        {calc.charAt(0).toUpperCase() + calc.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                  {/* Basic Calculator */}
                  {activeCalculator === 'basic' && (
                    <div className="p-2">
                      <input 
                        type="text" 
                        className="form-control form-control-lg mb-3 text-end fw-bold fs-3" 
                        value={calcExpression}
                        readOnly
                      />
                      <div className="row g-2">
                        {[
                          { val: 'sin(', label: 'sin', cls: 'btn-info' },
                          { val: 'cos(', label: 'cos', cls: 'btn-info' },
                          { val: 'tan(', label: 'tan', cls: 'btn-info' },
                          { val: 'PI', label: 'π', cls: 'btn-info' },
                          { val: 'log(', label: 'log', cls: 'btn-info' },
                          { val: 'ln(', label: 'ln', cls: 'btn-info' },
                          { val: 'sqrt(', label: '√', cls: 'btn-info' },
                          { val: '^', label: '^', cls: 'btn-info' },
                          { val: '(', label: '(', cls: 'btn-secondary' },
                          { val: ')', label: ')', cls: 'btn-secondary' },
                          { val: 'E', label: 'e', cls: 'btn-info' },
                          { val: 'C', label: 'C', cls: 'btn-danger' },
                          { val: '7', label: '7', cls: 'btn-light' },
                          { val: '8', label: '8', cls: 'btn-light' },
                          { val: '9', label: '9', cls: 'btn-light' },
                          { val: '/', label: '÷', cls: 'btn-warning' },
                          { val: '4', label: '4', cls: 'btn-light' },
                          { val: '5', label: '5', cls: 'btn-light' },
                          { val: '6', label: '6', cls: 'btn-light' },
                          { val: '*', label: '×', cls: 'btn-warning' },
                          { val: '1', label: '1', cls: 'btn-light' },
                          { val: '2', label: '2', cls: 'btn-light' },
                          { val: '3', label: '3', cls: 'btn-light' },
                          { val: '-', label: '−', cls: 'btn-warning' },
                          { val: '0', label: '0', cls: 'btn-light' },
                          { val: '.', label: '.', cls: 'btn-light' },
                          { val: '%', label: '%', cls: 'btn-secondary' },
                          { val: '+', label: '+', cls: 'btn-warning' },
                          { val: 'DEL', label: '⌫', cls: 'btn-secondary' },
                          { val: '=', label: '=', cls: 'btn-primary' },
                        ].map((btn) => (
                          <div key={btn.val} className="col-3">
                            <button
                              className={`btn ${btn.cls} w-100 ${btn.val === 'DEL' || btn.val === '=' ? 'fs-5' : 'fs-6'}`}
                              onClick={() => handleCalcButton(btn.val)}
                            >
                              {btn.label}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Eligibility Calculator */}
                  {activeCalculator === 'elig' && (
                    <div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Gross Monthly Income</label>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input 
                            type="number" 
                            className="form-control"
                            value={grossMonthlyIncome}
                            onChange={(e) => setGrossMonthlyIncome(Number(e.target.value))}
                            min="0"
                            step="1000"
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Total Monthly EMIs</label>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input 
                            type="number" 
                            className="form-control"
                            value={existingEMIs}
                            onChange={(e) => setExistingEMIs(Number(e.target.value))}
                            min="0"
                            step="1000"
                          />
                          <div className="form-text">Existing EMIs you are currently paying</div>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Interest Rate</label>
                        <div className="input-group">
                          <input 
                            type="number" 
                            className="form-control"
                            value={eligibilityInterestRate}
                            onChange={(e) => setEligibilityInterestRate(Number(e.target.value))}
                            min="0"
                            step="0.1"
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Tenure</label>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="text-muted">{eligibilityTenure} years</span>
                        </div>
                        <input
                          type="range"
                          className="form-range"
                          min="1"
                          max="30"
                          step="1"
                          value={eligibilityTenure}
                          onChange={(e) => setEligibilityTenure(Number(e.target.value))}
                        />
                        <div className="input-group mt-2">
                          <input 
                            type="number" 
                            className="form-control"
                            value={eligibilityTenure * 12}
                            readOnly
                          />
                          <span className="input-group-text">months</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EMI Calculator */}
                  {activeCalculator === 'emi' && (
                    <div>
                      <div className="mb-3">
                        <label className="form-label fw-semibold">Loan Type</label>
                        <div className="btn-group w-100" role="group">
                          <input
                            type="radio"
                            className="btn-check"
                            name="loanType"
                            id="typeCar"
                            checked={loanType === 'car'}
                            onChange={() => setLoanType('car')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="typeCar">Car Loan</label>
                          <input
                            type="radio"
                            className="btn-check"
                            name="loanType"
                            id="typePersonal"
                            checked={loanType === 'personal'}
                            onChange={() => setLoanType('personal')}
                          />
                          <label className="btn btn-outline-primary" htmlFor="typePersonal">Personal Loan</label>
                        </div>
                      </div>

                      <div className="form-group mb-4">
                        <label className="form-label fw-semibold">
                          {loanType === 'car' ? 'Car Price' : 'Personal Loan Amount'}
                        </label>
                        <input
                          type="range"
                          className="form-range"
                          min="100000"
                          max="5000000"
                          step="10000"
                          value={price}
                          onChange={(e) => setPrice(Number(e.target.value))}
                        />
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={price}
                            onChange={(e) => setPrice(Number(e.target.value))}
                            min="10000"
                            step="1000"
                          />
                        </div>
                        <div className="form-text">
                          {loanType === 'car' ? 'Total price before down payment' : 'Total loan amount required'}
                        </div>
                      </div>

                      {loanType === 'car' && (
                        <div className="mb-4">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="fw-semibold">Down Payment</span>
                            <span className="text-muted">{downPaymentPercent}%</span>
                          </div>
                          <input
                            type="range"
                            className="form-range"
                            min="0"
                            max="90"
                            step="1"
                            value={downPaymentPercent}
                            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                          />
                          <div className="input-group mt-2">
                            <span className="input-group-text">₹</span>
                            <input
                              type="number"
                              className="form-control"
                              value={downPayment}
                              onChange={(e) => setDownPayment(Number(e.target.value))}
                              min="0"
                              step="1000"
                            />
                          </div>
                          <div className="small mt-2">
                            Your loan amount will be:{' '}
                            <span className="fw-semibold">
                              {formatINR(Math.max(0, price - downPayment))}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-semibold">Tenure</span>
                              <span className="text-muted">{Math.round(tenureMonths / 12)} years</span>
                            </div>
                            <input
                              type="range"
                              className="form-range"
                              min="12"
                              max="120"
                              step="12"
                              value={tenureMonths}
                              onChange={(e) => setTenureMonths(Number(e.target.value))}
                            />
                            <div className="input-group mt-2">
                              <input
                                type="number"
                                className="form-control"
                                value={tenureMonths}
                                readOnly
                                min="6"
                                max="360"
                                step="1"
                              />
                              <span className="input-group-text">months</span>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="fw-semibold">Interest</span>
                              <span className="text-muted">{interestRate.toFixed(1)}%</span>
                            </div>
                            <input
                              type="range"
                              className="form-range"
                              min="6"
                              max="20"
                              step="0.1"
                              value={interestRate}
                              onChange={(e) => setInterestRate(Number(e.target.value))}
                            />
                            <div className="input-group mt-2">
                              <input
                                type="number"
                                className="form-control"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                min="1"
                                max="40"
                                step="0.1"
                              />
                              <span className="input-group-text">%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tax Calculator */}
                  {activeCalculator === 'tax' && (
                    <div>
                      <div className="form-group mb-4">
                        <label className="form-label fw-semibold">Annual Income</label>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={annualIncome}
                            onChange={(e) => setAnnualIncome(Number(e.target.value))}
                            min="0"
                            step="1000"
                          />
                        </div>
                      </div>
                      <div className="form-group mb-2">
                        <label className="form-label fw-semibold">Tax Rate</label>
                        <input
                          type="range"
                          className="form-range"
                          min="0"
                          max="40"
                          step="0.5"
                          value={taxRate}
                          onChange={(e) => setTaxRate(Number(e.target.value))}
                        />
                        <div className="input-group mt-2">
                          <input
                            type="number"
                            className="form-control"
                            value={taxRate}
                            onChange={(e) => setTaxRate(Number(e.target.value))}
                            min="0"
                            max="40"
                            step="0.5"
                          />
                          <span className="input-group-text">%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Salary Calculator */}
                  {activeCalculator === 'salary' && (
                    <div>
                      <div className="form-group mb-3">
                        <label className="form-label fw-semibold">CTC (Annual)</label>
                        <div className="input-group">
                          <span className="input-group-text">₹</span>
                          <input
                            type="number"
                            className="form-control"
                            value={ctcAnnual}
                            onChange={(e) => setCtcAnnual(Number(e.target.value))}
                            min="0"
                            step="1000"
                          />
                        </div>
                      </div>
                      <div className="row g-3">
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">PF Deduction</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              value={pfPercent}
                              onChange={(e) => setPfPercent(Number(e.target.value))}
                              min="0"
                              max="20"
                              step="0.5"
                            />
                            <span className="input-group-text">%</span>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">Other Deductions</label>
                          <div className="input-group">
                            <input
                              type="number"
                              className="form-control"
                              value={otherDeductionsPercent}
                              onChange={(e) => setOtherDeductionsPercent(Number(e.target.value))}
                              min="0"
                              max="40"
                              step="0.5"
                            />
                            <span className="input-group-text">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Investment Calculator */}
                  {activeCalculator === 'invest' && (
                    <div>
                      <div className="row g-3">
                        <div className="col-12">
                          <label className="form-label fw-semibold">Monthly SIP</label>
                          <div className="input-group">
                            <span className="input-group-text">₹</span>
                            <input
                              type="number"
                              className="form-control"
                              value={sipMonthly}
                              onChange={(e) => setSipMonthly(Number(e.target.value))}
                              min="0"
                              step="500"
                            />
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">Tenure</label>
                          <input
                            type="range"
                            className="form-range"
                            min="12"
                            max="360"
                            step="12"
                            value={investmentMonths}
                            onChange={(e) => setInvestmentMonths(Number(e.target.value))}
                          />
                          <div className="input-group mt-2">
                            <input
                              type="number"
                              className="form-control"
                              value={investmentMonths}
                              onChange={(e) => setInvestmentMonths(Number(e.target.value))}
                              min="12"
                              max="360"
                              step="1"
                            />
                            <span className="input-group-text">months</span>
                          </div>
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label fw-semibold">Expected Return</label>
                          <input
                            type="range"
                            className="form-range"
                            min="2"
                            max="20"
                            step="0.1"
                            value={expectedReturn}
                            onChange={(e) => setExpectedReturn(Number(e.target.value))}
                          />
                          <div className="input-group mt-2">
                            <input
                              type="number"
                              className="form-control"
                              value={expectedReturn}
                              onChange={(e) => setExpectedReturn(Number(e.target.value))}
                              min="0"
                              max="40"
                              step="0.1"
                            />
                            <span className="input-group-text">%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
            </section>

            {/* Results Section */}
            <section className="col-lg-6">
              <div className="h-100 p-3">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <div className="emi-amount">
                        {activeCalculator === 'basic' ? results.primaryValue : formatINR(results.primaryValue)}
                      </div>
                      <div className="text-muted">{results.primaryLabel}</div>
                    </div>
                    {results.showScheduleToggle && (
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="toggleSchedule"
                          checked={showSchedule}
                          onChange={(e) => setShowSchedule(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="toggleSchedule">Schedule</label>
                      </div>
                    )}
                  </div>

                  {/* Graph View */}
                  {!showSchedule ? (
                    <div id="graphView">
                      <div className="row g-3 align-items-center">
                        <div className="col-md-6">
                          <div className="donut-wrap">
                            <svg className="donut" viewBox="0 0 120 120" width="220" height="220" aria-label="Breakdown">
                              <circle cx="60" cy="60" r="52" className="donut-bg" />
                              <circle
                                cx="60"
                                cy="60"
                                r="52"
                                className="donut-seg principal"
                                strokeDasharray={`${donutSegments.principalLen} ${donutSegments.C - donutSegments.principalLen}`}
                                strokeDashoffset="0"
                              />
                              <circle
                                cx="60"
                                cy="60"
                                r="52"
                                className="donut-seg interest"
                                strokeDasharray={`${donutSegments.interestLen} ${donutSegments.C - donutSegments.interestLen}`}
                                strokeDashoffset={-donutSegments.principalLen}
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <ul className="legend list-unstyled">
                            <li>
                              <span className="legend-dot principal"></span>
                              <span>{results.labelA}</span>
                              <span className="float-end">
                                {typeof results.valueA === 'number' ? formatINR(results.valueA) : results.valueA}
                              </span>
                            </li>
                            <li>
                              <span className="legend-dot interest"></span>
                              <span>{results.labelB}</span>
                              <span className="float-end">
                                {typeof results.valueB === 'number' ? formatINR(results.valueB) : results.valueB}
                              </span>
                            </li>
                            <li className="mt-2">
                              <span>{results.labelTotal}</span>
                              <span className="float-end fw-semibold">
                                {typeof results.valueTotal === 'number' ? formatINR(results.valueTotal) : results.valueTotal}
                              </span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Schedule View */
                    <div id="scheduleView">
                      <div className="table-responsive">
                        <table className="table table-sm align-middle">
                          <thead>
                            <tr>
                              <th>Month</th>
                              <th>EMI</th>
                              <th>Interest</th>
                              <th>Principal</th>
                              <th>Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.schedule && results.schedule.slice(0, 12).map((row) => (
                              <tr key={row.month}>
                                <td>{row.month}</td>
                                <td>{formatINR(row.emi)}</td>
                                <td>{formatINR(row.interest)}</td>
                                <td>{formatINR(row.principal)}</td>
                                <td>{formatINR(row.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <p className="text-muted small text-center">
                          Showing first 12 months. Full schedule available in export.
                        </p>
                      </div>
                    </div>
                  )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* SEO Content Sections */}
      <section className="seo-section container-fluid py-3">
        <div className="row g-4">
          <div className="col-lg-6">
            <h2 className="h5" id="about-finance-calculators">Free Finance Calculators (India)</h2>
            <p>Use our EMI, Income Tax, In-Hand Salary, and SIP Investment calculators to plan loans and savings with confidence. Results update instantly and work great on mobile. These tools are designed for India with rupee inputs and monthly compounding where applicable.</p>
            <p>Switch across calculators using the selector and adjust values via sliders or numeric fields. You can toggle loan schedules to view month-by-month breakdowns and download insights as needed.</p>
            <ul className="list-unstyled mb-0">
              <li><a href="#emi-calculator">EMI Calculator</a> - monthly installment, interest, total payable</li>
              <li><a href="#tax-calculator">Income Tax Calculator</a> - monthly net and tax amount</li>
              <li><a href="#salary-calculator">Salary In-Hand</a> - deductions (PF/other) and net monthly</li>
              <li><a href="#sip-calculator">SIP Investment</a> - principal invested, returns, future value</li>
              <li><a href="#eligibility-calculator">Loan Eligibility</a> - max loan amount based on income/EMI</li>
            </ul>
          </div>
          <div className="col-lg-6">
            <h2 className="h5" id="emi-calculator">EMI Calculator</h2>
            <p>Calculate your monthly EMI for home, auto, or personal loans. Adjust product price, down payment, tenure and interest to see the principal vs interest split and total payable. The schedule view shows month-wise interest and principal reduction with outstanding balance.</p>
            
            <h2 className="h5 mt-3" id="tax-calculator">Income Tax Calculator</h2>
            <p>Estimate monthly net income by entering annual income and an effective rate. This is a quick estimator; consult official slabs and regimes before filing. The donut chart shows net vs tax for easy comparison.</p>
            
            <h2 className="h5 mt-3" id="salary-calculator">Salary In-Hand Calculator</h2>
            <p>See your take-home monthly salary from CTC with PF and other deductions. Adjust percentages to match your employment structure and understand net vs deductions.</p>
            
            <h2 className="h5 mt-3" id="sip-calculator">SIP Investment Calculator</h2>
            <p>Plan long-term wealth with SIP. Enter monthly contribution, tenure in months, and expected annual return. We use monthly compounding to show principal invested, gains, and future value.</p>
            
            <h2 className="h5 mt-3" id="eligibility-calculator">Loan Eligibility Calculator</h2>
            <p>Estimate the maximum loan amount you can borrow based on your gross monthly income and existing EMI obligations. We assume a 50% Fixed Obligation to Income Ratio (FOIR) to calculate your eligible monthly installment capacity.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section container-fluid py-3">
        <h2 className="h5">FAQs</h2>
        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h3 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq1">
                How is EMI calculated?
              </button>
            </h3>
            <div id="faq1" className="accordion-collapse collapse">
              <div className="accordion-body">
                EMI uses the standard formula: EMI = P × r × (1+r)^n / ((1+r)^n − 1), where P is loan principal, r is monthly interest rate, and n is loan tenure in months.
              </div>
            </div>
          </div>
          
          <div className="accordion-item">
            <h3 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq2">
                Does the tax calculator use official slabs?
              </button>
            </h3>
            <div id="faq2" className="accordion-collapse collapse">
              <div className="accordion-body">
                This tool is an estimator using an effective rate for quick monthly net projections. Refer to current government slabs and your chosen regime for accurate filing.
              </div>
            </div>
          </div>
          
          <div className="accordion-item">
            <h3 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq3">
                Can I see the loan amortization schedule?
              </button>
            </h3>
            <div id="faq3" className="accordion-collapse collapse">
              <div className="accordion-body">
                Yes. Toggle "Schedule" to view month-by-month EMI split between interest and principal with the remaining balance.
              </div>
            </div>
          </div>
          
          <div className="accordion-item">
            <h3 className="accordion-header">
              <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#faq4">
                Are SIP returns compounded monthly?
              </button>
            </h3>
            <div id="faq4" className="accordion-collapse collapse">
              <div className="accordion-body">
                We apply monthly compounding using the standard SIP future value formula with the monthly rate derived from your annual return input.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default FinanceCalculators;
