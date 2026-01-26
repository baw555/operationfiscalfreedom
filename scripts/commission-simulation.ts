/**
 * Commission Simulation Model
 * Simulates a large affiliate network with sales and revenue calculations
 * Based on the NavigatorUSA compression formula:
 * - Producer Base: 69% + compression from empty uplines (1% per empty slot, max 6)
 * - Each Upline: 1% each (max 6 uplines)
 * - House: 22.5% fixed
 * - Recruiter Bounty: 2.5% separate
 */

interface Affiliate {
  id: number;
  name: string;
  level: number; // 0 = top, 1 = recruited by level 0, etc.
  recruiterId: number | null;
  uplineChain: number[]; // IDs of uplines (up to 6)
  totalSales: number;
  totalCommissions: number;
  uplineCommissions: number; // Earned from downline sales
  role: 'master' | 'submaster' | 'affiliate';
}

interface Sale {
  id: number;
  affiliateId: number;
  contractType: string;
  contractRate: number; // percentage (e.g., 70 for 70%)
  dealAmount: number;
  commissionPool: number;
  producerEarnings: number;
  uplinePayouts: { affiliateId: number; amount: number; level: number }[];
  houseEarnings: number;
  recruiterBounty: number;
}

interface SimulationResult {
  totalAffiliates: number;
  totalSales: number;
  totalRevenue: number;
  totalCommissionPool: number;
  affiliatesByLevel: Record<number, number>;
  topEarners: { name: string; role: string; level: number; totalEarnings: number; salesCount: number }[];
  averageEarningsByLevel: Record<number, number>;
  compressionBenefits: { uplineCount: number; producerRate: string; count: number; avgEarnings: number }[];
  contractTypeBreakdown: { type: string; sales: number; revenue: number; avgDeal: number }[];
}

// Contract types with their commission rates
const CONTRACT_TYPES = [
  { name: 'Private Reinsurance', rate: 70 },
  { name: 'Tax Resolution', rate: 55 },
  { name: 'ICC Logistics', rate: 18 },
];

// Commission formula constants
const PRODUCER_BASE_PCT = 0.69;
const UPLINE_PCT_EACH = 0.01;
const MAX_UPLINES = 6;
const HOUSE_PCT = 0.225;
const RECRUITER_BOUNTY_PCT = 0.025;

function generateName(id: number): string {
  const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles',
    'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
    'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul', 'Andrew', 'Joshua', 'Kenneth',
    'Nancy', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle', 'Dorothy'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
    'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
    'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'];
  return `${firstNames[id % firstNames.length]} ${lastNames[Math.floor(id / firstNames.length) % lastNames.length]}`;
}

function createAffiliateNetwork(totalAffiliates: number): Affiliate[] {
  const affiliates: Affiliate[] = [];
  
  // Create hierarchical structure
  // Level 0: Masters (top 2%)
  // Level 1: Submasters (next 8%)
  // Level 2-6: Regular affiliates distributed
  
  const masterCount = Math.max(1, Math.floor(totalAffiliates * 0.02));
  const submasterCount = Math.floor(totalAffiliates * 0.08);
  
  for (let i = 0; i < totalAffiliates; i++) {
    let level: number;
    let role: 'master' | 'submaster' | 'affiliate';
    let recruiterId: number | null = null;
    
    if (i < masterCount) {
      level = 0;
      role = 'master';
    } else if (i < masterCount + submasterCount) {
      level = 1;
      role = 'submaster';
      // Recruited by a random master
      recruiterId = Math.floor(Math.random() * masterCount);
    } else {
      // Regular affiliates - distributed across levels 2-6
      level = 2 + Math.floor(Math.random() * 5); // levels 2-6
      role = 'affiliate';
      // Recruited by someone at a higher level
      const possibleRecruiters = affiliates.filter(a => a.level < level);
      if (possibleRecruiters.length > 0) {
        recruiterId = possibleRecruiters[Math.floor(Math.random() * possibleRecruiters.length)].id;
      }
    }
    
    // Build upline chain (up to 6 levels)
    const uplineChain: number[] = [];
    let currentRecruiterId = recruiterId;
    while (currentRecruiterId !== null && uplineChain.length < MAX_UPLINES) {
      uplineChain.push(currentRecruiterId);
      const recruiter = affiliates.find(a => a.id === currentRecruiterId);
      currentRecruiterId = recruiter?.recruiterId ?? null;
    }
    
    affiliates.push({
      id: i,
      name: generateName(i),
      level,
      recruiterId,
      uplineChain,
      totalSales: 0,
      totalCommissions: 0,
      uplineCommissions: 0,
      role,
    });
  }
  
  return affiliates;
}

function calculateCommission(
  dealAmount: number,
  contractRate: number,
  uplineCount: number
): {
  commissionPool: number;
  producerEarnings: number;
  uplinePayouts: number[];
  houseEarnings: number;
  recruiterBounty: number;
} {
  const commissionPool = dealAmount * (contractRate / 100);
  
  // Producer gets base + compression from empty upline slots
  const emptySlots = MAX_UPLINES - uplineCount;
  const producerRate = PRODUCER_BASE_PCT + (emptySlots * UPLINE_PCT_EACH);
  const producerEarnings = commissionPool * producerRate;
  
  // Each upline gets 1%
  const uplinePayouts: number[] = [];
  for (let i = 0; i < uplineCount; i++) {
    uplinePayouts.push(commissionPool * UPLINE_PCT_EACH);
  }
  
  // House always gets 22.5%
  const houseEarnings = commissionPool * HOUSE_PCT;
  
  // Recruiter bounty is separate 2.5%
  const recruiterBounty = commissionPool * RECRUITER_BOUNTY_PCT;
  
  return {
    commissionPool,
    producerEarnings,
    uplinePayouts,
    houseEarnings,
    recruiterBounty,
  };
}

function simulateSales(affiliates: Affiliate[], salesCount: number): Sale[] {
  const sales: Sale[] = [];
  
  for (let i = 0; i < salesCount; i++) {
    // Random affiliate makes a sale
    const affiliate = affiliates[Math.floor(Math.random() * affiliates.length)];
    
    // Random contract type
    const contractType = CONTRACT_TYPES[Math.floor(Math.random() * CONTRACT_TYPES.length)];
    
    // Random deal amount ($5,000 - $500,000)
    const dealAmount = 5000 + Math.floor(Math.random() * 495000);
    
    const uplineCount = affiliate.uplineChain.length;
    const commission = calculateCommission(dealAmount, contractType.rate, uplineCount);
    
    // Build upline payouts
    const uplinePayouts = affiliate.uplineChain.map((uplineId, index) => ({
      affiliateId: uplineId,
      amount: commission.uplinePayouts[index] || 0,
      level: index + 1,
    }));
    
    // Update affiliate earnings
    affiliate.totalSales++;
    affiliate.totalCommissions += commission.producerEarnings;
    
    // Update upline earnings
    uplinePayouts.forEach(payout => {
      const uplineAffiliate = affiliates.find(a => a.id === payout.affiliateId);
      if (uplineAffiliate) {
        uplineAffiliate.uplineCommissions += payout.amount;
      }
    });
    
    sales.push({
      id: i,
      affiliateId: affiliate.id,
      contractType: contractType.name,
      contractRate: contractType.rate,
      dealAmount,
      commissionPool: commission.commissionPool,
      producerEarnings: commission.producerEarnings,
      uplinePayouts,
      houseEarnings: commission.houseEarnings,
      recruiterBounty: commission.recruiterBounty,
    });
  }
  
  return sales;
}

function analyzeResults(affiliates: Affiliate[], sales: Sale[]): SimulationResult {
  // Count affiliates by level
  const affiliatesByLevel: Record<number, number> = {};
  affiliates.forEach(a => {
    affiliatesByLevel[a.level] = (affiliatesByLevel[a.level] || 0) + 1;
  });
  
  // Calculate total revenue
  const totalRevenue = sales.reduce((sum, s) => sum + s.dealAmount, 0);
  const totalCommissionPool = sales.reduce((sum, s) => sum + s.commissionPool, 0);
  
  // Top earners (total = producer + upline commissions)
  const sortedByEarnings = [...affiliates]
    .map(a => ({
      name: a.name,
      role: a.role,
      level: a.level,
      totalEarnings: a.totalCommissions + a.uplineCommissions,
      salesCount: a.totalSales,
    }))
    .sort((a, b) => b.totalEarnings - a.totalEarnings)
    .slice(0, 20);
  
  // Average earnings by level
  const earningsByLevel: Record<number, { total: number; count: number }> = {};
  affiliates.forEach(a => {
    const total = a.totalCommissions + a.uplineCommissions;
    if (!earningsByLevel[a.level]) {
      earningsByLevel[a.level] = { total: 0, count: 0 };
    }
    earningsByLevel[a.level].total += total;
    earningsByLevel[a.level].count++;
  });
  const averageEarningsByLevel: Record<number, number> = {};
  Object.entries(earningsByLevel).forEach(([level, data]) => {
    averageEarningsByLevel[parseInt(level)] = data.total / data.count;
  });
  
  // Compression benefits analysis
  const compressionGroups: Record<number, { count: number; totalEarnings: number }> = {};
  affiliates.forEach(a => {
    const uplineCount = a.uplineChain.length;
    if (!compressionGroups[uplineCount]) {
      compressionGroups[uplineCount] = { count: 0, totalEarnings: 0 };
    }
    compressionGroups[uplineCount].count++;
    compressionGroups[uplineCount].totalEarnings += a.totalCommissions;
  });
  const compressionBenefits = Object.entries(compressionGroups).map(([uplineCount, data]) => ({
    uplineCount: parseInt(uplineCount),
    producerRate: `${(69 + (6 - parseInt(uplineCount))).toFixed(0)}%`,
    count: data.count,
    avgEarnings: data.totalEarnings / data.count,
  })).sort((a, b) => a.uplineCount - b.uplineCount);
  
  // Contract type breakdown
  const contractStats: Record<string, { sales: number; revenue: number }> = {};
  sales.forEach(s => {
    if (!contractStats[s.contractType]) {
      contractStats[s.contractType] = { sales: 0, revenue: 0 };
    }
    contractStats[s.contractType].sales++;
    contractStats[s.contractType].revenue += s.dealAmount;
  });
  const contractTypeBreakdown = Object.entries(contractStats).map(([type, data]) => ({
    type,
    sales: data.sales,
    revenue: data.revenue,
    avgDeal: data.revenue / data.sales,
  }));
  
  return {
    totalAffiliates: affiliates.length,
    totalSales: sales.length,
    totalRevenue,
    totalCommissionPool,
    affiliatesByLevel,
    topEarners: sortedByEarnings,
    averageEarningsByLevel,
    compressionBenefits,
    contractTypeBreakdown,
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

function printResults(result: SimulationResult): void {
  console.log('\n' + '='.repeat(80));
  console.log('                    NAVIGATORUSA COMMISSION SIMULATION');
  console.log('                         Veterans Family Resources');
  console.log('='.repeat(80) + '\n');
  
  console.log('NETWORK OVERVIEW');
  console.log('-'.repeat(40));
  console.log(`Total Affiliates: ${result.totalAffiliates.toLocaleString()}`);
  console.log(`Total Sales: ${result.totalSales.toLocaleString()}`);
  console.log(`Total Revenue: ${formatCurrency(result.totalRevenue)}`);
  console.log(`Total Commission Pool: ${formatCurrency(result.totalCommissionPool)}`);
  
  console.log('\n\nAFFILIATES BY LEVEL');
  console.log('-'.repeat(40));
  Object.entries(result.affiliatesByLevel)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([level, count]) => {
      const role = parseInt(level) === 0 ? 'Master' : parseInt(level) === 1 ? 'Submaster' : 'Affiliate';
      console.log(`Level ${level} (${role}): ${count.toLocaleString()} affiliates`);
    });
  
  console.log('\n\nCOMPRESSION BENEFIT ANALYSIS');
  console.log('-'.repeat(40));
  console.log('(Fewer uplines = higher producer rate due to compression)');
  console.log('');
  result.compressionBenefits.forEach(cb => {
    console.log(`${cb.uplineCount} Uplines -> Producer Rate: ${cb.producerRate} | Count: ${cb.count.toLocaleString()} | Avg Earnings: ${formatCurrency(cb.avgEarnings)}`);
  });
  
  console.log('\n\nAVERAGE EARNINGS BY LEVEL');
  console.log('-'.repeat(40));
  Object.entries(result.averageEarningsByLevel)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([level, avg]) => {
      const role = parseInt(level) === 0 ? 'Master' : parseInt(level) === 1 ? 'Submaster' : 'Affiliate';
      console.log(`Level ${level} (${role}): ${formatCurrency(avg)} average total earnings`);
    });
  
  console.log('\n\nCONTRACT TYPE BREAKDOWN');
  console.log('-'.repeat(40));
  result.contractTypeBreakdown.forEach(ct => {
    console.log(`${ct.type}: ${ct.sales.toLocaleString()} sales | ${formatCurrency(ct.revenue)} revenue | ${formatCurrency(ct.avgDeal)} avg deal`);
  });
  
  console.log('\n\nTOP 20 EARNERS');
  console.log('-'.repeat(80));
  console.log('Rank | Name                      | Role       | Level | Sales | Total Earnings');
  console.log('-'.repeat(80));
  result.topEarners.forEach((earner, index) => {
    const name = earner.name.padEnd(25);
    const role = earner.role.padEnd(10);
    const level = earner.level.toString().padEnd(5);
    const sales = earner.salesCount.toString().padStart(5);
    const earnings = formatCurrency(earner.totalEarnings).padStart(15);
    console.log(`${(index + 1).toString().padStart(4)} | ${name} | ${role} | ${level} | ${sales} | ${earnings}`);
  });
  
  console.log('\n' + '='.repeat(80));
  console.log('                           SIMULATION COMPLETE');
  console.log('='.repeat(80) + '\n');
}

// Run the simulation
console.log('Starting NavigatorUSA Commission Simulation...\n');

const AFFILIATE_COUNT = 1500;  // Number of affiliates in the network
const SALES_COUNT = 10000;     // Number of sales to simulate

console.log(`Creating affiliate network with ${AFFILIATE_COUNT} members...`);
const affiliates = createAffiliateNetwork(AFFILIATE_COUNT);

console.log(`Simulating ${SALES_COUNT} sales transactions...`);
const sales = simulateSales(affiliates, SALES_COUNT);

console.log('Analyzing results...');
const results = analyzeResults(affiliates, sales);

printResults(results);
