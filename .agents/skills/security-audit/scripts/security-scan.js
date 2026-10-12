/**
 * Automated Security Vulnerability & Code Quality Scanner
 * Scans dependencies, secrets, API routes, dangerous code sinks, and security headers.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = process.cwd();

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const findings = {
  critical: [],
  high: [],
  medium: [],
  low: [],
  info: [],
};

function addFinding(severity, category, title, details, filePath = '', line = null, recommendation = '') {
  const item = { category, title, details, filePath, line, recommendation };
  if (findings[severity]) {
    findings[severity].push(item);
  }
}

// 1. Audit Dependencies via npm audit
function auditDependencies() {
  console.log(`${colors.cyan}[1/5] Checking Dependencies for Known Vulnerabilities (CVEs)...${colors.reset}`);
  try {
    const auditRaw = execSync('npm audit --json', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
    const auditData = JSON.parse(auditRaw);
    
    if (auditData.metadata && auditData.metadata.vulnerabilities) {
      const v = auditData.metadata.vulnerabilities;
      const total = v.critical + v.high + v.moderate + v.low;
      if (total === 0) {
        console.log(`  ${colors.green}✔ No known package vulnerabilities found in npm audit.${colors.reset}`);
      } else {
        if (v.critical > 0) {
          addFinding('critical', 'Dependencies', `${v.critical} Critical npm vulnerability detected`, 'Run `npm audit fix` or upgrade dependencies.', 'package.json', null, 'Upgrade affected packages to safe patched versions.');
        }
        if (v.high > 0) {
          addFinding('high', 'Dependencies', `${v.high} High npm vulnerability detected`, 'Run `npm audit` for details.', 'package.json', null, 'Investigate and update packages.');
        }
        if (v.moderate > 0) {
          addFinding('medium', 'Dependencies', `${v.moderate} Moderate npm vulnerability detected`, 'Review npm audit recommendations.', 'package.json', null, 'Update dependencies when stable.');
        }
        if (v.low > 0) {
          addFinding('low', 'Dependencies', `${v.low} Low severity npm vulnerability detected`, 'Low risk vulnerability present.', 'package.json', null, 'Review dependency tree.');
        }
      }
    }
  } catch (err) {
    try {
      if (err.stdout) {
        const auditData = JSON.parse(err.stdout);
        if (auditData.metadata && auditData.metadata.vulnerabilities) {
          const v = auditData.metadata.vulnerabilities;
          if (v.critical > 0) addFinding('critical', 'Dependencies', `${v.critical} Critical vulnerabilities`, 'npm audit flagged critical issues.', 'package.json', null, 'Run npm audit fix or manual update.');
          if (v.high > 0) addFinding('high', 'Dependencies', `${v.high} High vulnerabilities`, 'npm audit flagged high issues.', 'package.json', null, 'Investigate high severity packages.');
          if (v.moderate > 0) addFinding('medium', 'Dependencies', `${v.moderate} Moderate vulnerabilities`, 'npm audit flagged moderate issues.', 'package.json', null, 'Update packages.');
          if (v.low > 0) addFinding('low', 'Dependencies', `${v.low} Low vulnerabilities`, 'npm audit flagged low issues.', 'package.json', null, 'Review packages.');
        }
      }
    } catch {
      console.log(`  ${colors.yellow}⚠ npm audit returned exit code with non-JSON output.${colors.reset}`);
    }
  }
}

// Ignore directories for source code scan
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'out',
  'coverage',
  '.system_generated',
  '.agents'
]);

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        getAllFiles(fullPath, fileList);
      }
    } else if (entry.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

// 2. Secret & Sensitive Data Exposure Checks
const SECRET_PATTERNS = [
  { name: 'Private Key', regex: /-----BEGIN (RSA|EC|PGP|OPENSSH|DSA|ENCRYPTED)? PRIVATE KEY-----/, severity: 'critical' },
  { name: 'Hardcoded AWS Access Key', regex: /AKIA[0-9A-Z]{16}/, severity: 'critical' },
  { name: 'Generic API Key / Secret Token', regex: /(api_key|apiKey|secret_key|secretKey|auth_token|jwt_secret)\s*[:=]\s*["'][A-Za-z0-9_\-\.]{16,}["']/i, severity: 'high' },
  { name: 'Hardcoded Database URL with Password', regex: /(postgres|mysql|mongodb|redis):\/\/[a-zA-Z0-9_-]+:[^@\s"']+@[a-zA-Z0-9_\.-]+/i, severity: 'high' },
  { name: 'Slack Bot Token', regex: /xox[baprs]-[0-9a-zA-Z]{10,48}/, severity: 'critical' },
  { name: 'GitHub Personal Access Token', regex: /gh[pous]_[A-Za-z0-9_]{36,}/, severity: 'critical' }
];

function checkSecretsAndSensitiveFiles(allFiles) {
  console.log(`${colors.cyan}[2/5] Scanning for Hardcoded Secrets & Sensitive Files...${colors.reset}`);
  
  // Check .gitignore for .env
  const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf-8');
    if (!gitignoreContent.includes('.env')) {
      addFinding('high', 'Configuration', '.gitignore does not contain .env', 'Risk of accidentally committing secret keys and environment variables.', '.gitignore', null, 'Add `.env*.local` and `.env` to .gitignore.');
    } else {
      console.log(`  ${colors.green}✔ .gitignore correctly contains .env exclusions.${colors.reset}`);
    }
  }

  // Check if .env is committed or exists
  const envPath = path.join(PROJECT_ROOT, '.env');
  if (fs.existsSync(envPath)) {
    const gitignorePath = path.join(PROJECT_ROOT, '.gitignore');
    const isGitIgnored = fs.existsSync(gitignorePath) && fs.readFileSync(gitignorePath, 'utf-8').includes('.env');
    const envContent = fs.readFileSync(envPath, 'utf-8');
    if (envContent.match(/DATABASE_URL=.*password/i) || envContent.match(/SECRET=.*[a-z0-9]{10}/i)) {
      if (!isGitIgnored) {
        addFinding('high', 'Secrets', '.env file exists with sensitive values and is NOT gitignored!', 'High risk of committing secrets to VCS repository.', '.env', null, 'Add `.env` and `.env*.local` to .gitignore immediately.');
      } else {
        addFinding('info', 'Secrets', '.env file exists with local credentials (protected by .gitignore)', 'Local configuration file is present and properly excluded by .gitignore.', '.env', null, 'Never force-add or commit this file to version control.');
      }
    }
  }

  // Scan file contents
  for (const file of allFiles) {
    const ext = path.extname(file);
    if (!['.js', '.ts', '.tsx', '.jsx', '.json', '.env', '.yaml', '.yml'].includes(ext)) continue;
    if (file.includes('package-lock.json') || file.includes('security-audit.js')) continue;

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const lineContent = lines[i];
        for (const sp of SECRET_PATTERNS) {
          if (sp.regex.test(lineContent)) {
            // Avoid false positives for mock example data or template strings
            if (lineContent.includes('process.env.') || lineContent.includes('SANDBOX_') || lineContent.includes('example') || lineContent.includes('your-secret')) {
              continue;
            }
            const relPath = path.relative(PROJECT_ROOT, file);
            addFinding(sp.severity, 'Hardcoded Secrets', `${sp.name} detected`, `Potential secret in line: ${lineContent.trim().substring(0, 80)}...`, relPath, i + 1, 'Move secrets to .env.local and access exclusively via process.env.');
          }
        }
      }
    } catch {}
  }
}

// 3. Dangerous Code Sinks & Insecure Patterns
const DANGEROUS_PATTERNS = [
  { name: 'Remote Code Execution / eval()', regex: /\beval\s*\(/, severity: 'critical', desc: 'Direct eval() usage allows arbitrary JavaScript execution.' },
  { name: 'Function Constructor (Code Injection)', regex: /new\s+Function\s*\(/, severity: 'high', desc: 'Function constructor can be misused for dynamic code execution.' },
  { name: 'Unsafe HTML Injection (XSS Risk)', regex: /dangerouslySetInnerHTML/, severity: 'medium', desc: 'React dangerouslySetInnerHTML can lead to Stored/Reflected XSS if user input is not sanitized with DOMPurify.' },
  { name: 'Child Process Execution (Command Injection)', regex: /\b(exec|execSync)\s*\(/, severity: 'medium', desc: 'Executing shell commands can lead to OS Command Injection if user arguments are interpolated.' },
  { name: 'Unsafe Raw SQL Query', regex: /\$queryRawUnsafe/, severity: 'high', desc: 'Prisma $queryRawUnsafe bypasses parameterized query protection, allowing SQL injection.' },
  { name: 'Insecure Direct Cookie Access without httpOnly', regex: /document\.cookie\s*=/, severity: 'low', desc: 'Writing cookies in client scripts may lack httpOnly / secure flags.' }
];

function scanCodeSinks(allFiles) {
  console.log(`${colors.cyan}[3/5] Scanning Codebase for Injection Sinks & Dangerous Functions...${colors.reset}`);
  
  for (const file of allFiles) {
    const ext = path.extname(file);
    if (!['.js', '.ts', '.tsx', '.jsx'].includes(ext)) continue;
    if (file.includes('security-audit.js')) continue;

    try {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const lineContent = lines[i];
        for (const dp of DANGEROUS_PATTERNS) {
          if (dp.regex.test(lineContent)) {
            // Filter out comments
            if (lineContent.trim().startsWith('//') || lineContent.trim().startsWith('/*') || lineContent.trim().startsWith('*')) continue;
            // Filter out safe JSON-LD escaping in JsonLd.tsx
            if (file.includes('JsonLd.tsx') && (lineContent.includes('\\u003c') || content.includes('\\u003c'))) continue;
            
            const relPath = path.relative(PROJECT_ROOT, file);
            addFinding(dp.severity, 'Injection / Dangerous Sinks', dp.name, `${dp.desc} (Line: ${lineContent.trim().substring(0, 90)})`, relPath, i + 1, 'Refactor code to use safe APIs (e.g. parameterized queries, safe sanitization).');
          }
        }
      }
    } catch {}
  }
}

// 4. Next.js API Routes Authentication & Authorization Audit
function auditApiRoutes(allFiles) {
  console.log(`${colors.cyan}[4/5] Auditing API Routes for Authentication & Authorization (OWASP A01)...${colors.reset}`);
  
  const apiFiles = allFiles.filter(f => f.includes(path.join('src', 'app', 'api')) && f.endsWith('route.ts'));
  
  for (const file of apiFiles) {
    const relPath = path.relative(PROJECT_ROOT, file).replace(/\\/g, '/');
    const content = fs.readFileSync(file, 'utf-8');

    const isMutating = content.includes('export async function POST') ||
                       content.includes('export async function PUT') ||
                       content.includes('export async function PATCH') ||
                       content.includes('export async function DELETE');

    const isAdminRoute = relPath.includes('/api/admin/');
    const hasAuthCheck = content.includes('verifyToken') ||
                         content.includes('getSession') ||
                         content.includes('requireAdminAuth') ||
                         content.includes('auth(') ||
                         content.includes('getServerSession') ||
                         content.includes('cookies()') ||
                         content.includes('authorization') ||
                         content.includes('Authorization') ||
                         content.includes('ADMIN_SECRET') ||
                         content.includes('role ===') ||
                         content.includes('SUPER_ADMIN');

    if (isAdminRoute && !hasAuthCheck) {
      addFinding(
        'critical',
        'Broken Access Control (A01)',
        `Admin API route without authentication: ${relPath}`,
        'The route is located under /api/admin/ but does not appear to verify session or JWT token.',
        relPath,
        1,
        'Enforce authentication middleware or session check at the top of route handlers.'
      );
    }

    // Check for input validation on mutating routes
    if (isMutating) {
      const hasValidation = content.includes('.parse(') || content.includes('.safeParse(') || content.includes('z.object');
      if (!hasValidation && !isAdminRoute) {
        addFinding(
          'low',
          'Input Validation (A03)',
          `Mutating API route without visible Zod schema validation: ${relPath}`,
          'Route accepts POST/PUT/PATCH/DELETE without explicit schema validation.',
          relPath,
          1,
          'Validate request payload with Zod schemas to prevent unexpected field injection.'
        );
      }
    }
  }
}

// 5. Security Headers & Configuration (OWASP A05)
function checkSecurityHeaders() {
  console.log(`${colors.cyan}[5/5] Checking Next.js Security Headers & Transport Configuration...${colors.reset}`);
  
  const nextConfigPathTs = path.join(PROJECT_ROOT, 'next.config.ts');
  const nextConfigPathJs = path.join(PROJECT_ROOT, 'next.config.js');
  const nextConfigPathMjs = path.join(PROJECT_ROOT, 'next.config.mjs');
  
  let nextConfigContent = '';
  let configFile = '';
  if (fs.existsSync(nextConfigPathTs)) {
    nextConfigContent = fs.readFileSync(nextConfigPathTs, 'utf-8');
    configFile = 'next.config.ts';
  } else if (fs.existsSync(nextConfigPathJs)) {
    nextConfigContent = fs.readFileSync(nextConfigPathJs, 'utf-8');
    configFile = 'next.config.js';
  } else if (fs.existsSync(nextConfigPathMjs)) {
    nextConfigContent = fs.readFileSync(nextConfigPathMjs, 'utf-8');
    configFile = 'next.config.mjs';
  }

  const middlewarePath = path.join(PROJECT_ROOT, 'src', 'middleware.ts');
  let middlewareContent = '';
  if (fs.existsSync(middlewarePath)) {
    middlewareContent = fs.readFileSync(middlewarePath, 'utf-8');
  }

  const combinedConfig = nextConfigContent + '\n' + middlewareContent;

  const RECOMMENDED_HEADERS = [
    { header: 'X-Frame-Options', desc: 'Protects against clickjacking attacks by controlling iframes.' },
    { header: 'X-Content-Type-Options', desc: 'Prevents MIME-type sniffing.' },
    { header: 'Referrer-Policy', desc: 'Limits referrer information sent in outbound requests.' },
    { header: 'Strict-Transport-Security', desc: 'Forces browser to only use HTTPS (HSTS).' },
    { header: 'Content-Security-Policy', desc: 'Restricts script sources, prevents Cross-Site Scripting (CSP).' }
  ];

  for (const h of RECOMMENDED_HEADERS) {
    if (!combinedConfig.includes(h.header)) {
      addFinding(
        'medium',
        'Security Headers (A05)',
        `Missing HTTP Security Header: ${h.header}`,
        h.desc,
        configFile || 'src/middleware.ts',
        null,
        `Add '${h.header}' header in next.config.ts headers() function or middleware.ts.`
      );
    }
  }
}

// Generate Summary Report
function printReport() {
  console.log('\n================================================================');
  console.log(`${colors.bold}🔍 KOKKIRI PLATFORM SECURITY AUDIT REPORT${colors.reset}`);
  console.log(`Generated at: ${new Date().toISOString()}`);
  console.log('================================================================\n');

  const totalFindings =
    findings.critical.length +
    findings.high.length +
    findings.medium.length +
    findings.low.length;

  console.log(`${colors.bold}SUMMARY BY SEVERITY:${colors.reset}`);
  console.log(`  ${colors.red}● CRITICAL : ${findings.critical.length}${colors.reset}`);
  console.log(`  ${colors.red}● HIGH     : ${findings.high.length}${colors.reset}`);
  console.log(`  ${colors.yellow}● MEDIUM   : ${findings.medium.length}${colors.reset}`);
  console.log(`  ${colors.cyan}● LOW      : ${findings.low.length}${colors.reset}`);
  console.log(`  ● INFO     : ${findings.info.length}`);
  console.log(`  -----------------------`);
  console.log(`  TOTAL ACTIONABLE: ${totalFindings}\n`);

  const printSection = (list, label, color) => {
    if (list.length === 0) return;
    console.log(`${color}${colors.bold}--- [${label}] (${list.length} issues) ---${colors.reset}`);
    list.forEach((item, index) => {
      console.log(`\n${color}#${index + 1} [${item.category}] ${item.title}${colors.reset}`);
      if (item.filePath) {
        console.log(`   File: ${item.filePath}${item.line ? `:${item.line}` : ''}`);
      }
      console.log(`   Issue: ${item.details}`);
      if (item.recommendation) {
        console.log(`   Fix:   ${colors.green}${item.recommendation}${colors.reset}`);
      }
    });
    console.log('');
  };

  printSection(findings.critical, 'CRITICAL SEVERITY', colors.red);
  printSection(findings.high, 'HIGH SEVERITY', colors.red);
  printSection(findings.medium, 'MEDIUM SEVERITY', colors.yellow);
  printSection(findings.low, 'LOW SEVERITY', colors.cyan);

  // Security Health Score Calculation (0 - 100)
  let penalty =
    findings.critical.length * 30 +
    findings.high.length * 15 +
    findings.medium.length * 5 +
    findings.low.length * 2;
  const score = Math.max(0, 100 - penalty);

  let scoreColor = colors.green;
  if (score < 50) scoreColor = colors.red;
  else if (score < 80) scoreColor = colors.yellow;

  console.log('================================================================');
  console.log(`${colors.bold}SECURITY POSTURE SCORE: ${scoreColor}${score} / 100${colors.reset}`);
  if (score >= 90) {
    console.log(`Status: ${colors.green}EXCELLENT - Codebase satisfies core defensive security standards.${colors.reset}`);
  } else if (score >= 70) {
    console.log(`Status: ${colors.yellow}MODERATE - Remediation recommended for medium/high issues.${colors.reset}`);
  } else {
    console.log(`Status: ${colors.red}ACTION REQUIRED - Critical or high vulnerabilities detected.${colors.reset}`);
  }
  console.log('================================================================\n');

  return { totalFindings, score };
}

function runAudit() {
  console.log(`${colors.bold}Starting Automated Security & Vulnerability Scan...${colors.reset}\n`);
  const allFiles = getAllFiles(PROJECT_ROOT);
  
  auditDependencies();
  checkSecretsAndSensitiveFiles(allFiles);
  scanCodeSinks(allFiles);
  auditApiRoutes(allFiles);
  checkSecurityHeaders();
  
  const result = printReport();
  return result;
}

runAudit();
